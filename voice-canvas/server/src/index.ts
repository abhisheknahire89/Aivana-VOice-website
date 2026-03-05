/**
 * Standalone Gemini Live voice server — ONE session globally.
 * New connection takes over: previous session is closed first.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../../.env') });
import { WebSocketServer } from 'ws';
import { createGeminiSession } from './gemini.js';

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? process.env.VITE_GEMINI_API_KEY ?? '';

if (!GEMINI_API_KEY.trim()) {
  console.error('Set GEMINI_API_KEY or VITE_GEMINI_API_KEY in server/.env or voice-canvas/.env');
  process.exit(1);
}

const server = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Voice server running. Connect via WebSocket to /voice');
});

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const url = request.url ?? '';
  const pathname = url.split('?')[0];
  if (pathname === '/voice') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
    return;
  }
  socket.destroy();
});

type Session = Awaited<ReturnType<typeof createGeminiSession>>;

let globalSession: Session | null = null;
let globalWs: import('ws').WebSocket | null = null;

const RESPONSE_GAP_MS = 1100;
const SUPPRESS_SECOND_MS = 3000;

function takeDownPrevious(): void {
  const prevWs = globalWs;
  const prevSession = globalSession;
  globalWs = null;
  globalSession = null;
  if (prevSession) {
    try {
      prevSession.close();
    } catch (_) {}
  }
  if (prevWs && prevWs.readyState === prevWs.OPEN) {
    try {
      prevWs.close(1000, 'Replaced');
    } catch (_) {}
  }
}

wss.on('connection', (ws: import('ws').WebSocket) => {
  let session: Session | null = null;
  let initialized = false;
  let lastForwardedTime = 0;
  let suppressUntil = 0;

  function send(msg: object) {
    if (ws.readyState === ws.OPEN) {
      try {
        ws.send(JSON.stringify(msg));
      } catch (_) {}
    }
  }

  ws.on('message', async (data: Buffer | string) => {
    try {
      const raw = typeof data === 'string' ? data : data.toString();
      if (!raw.startsWith('{')) return;
      const msg = JSON.parse(raw) as { type?: string; persona?: string; language?: string; data?: string };

      if (msg.type === 'audio' && msg.data) {
        lastForwardedTime = 0;
        suppressUntil = 0;
      }

      if (msg.type === 'init') {
        if (initialized) {
          send({ type: 'error', message: 'Already initialized' });
          return;
        }
        takeDownPrevious();

        const persona = (msg.persona ?? 'Ananya').trim();
        const language = (msg.language ?? 'en-IN').trim();

        session = await createGeminiSession(
          GEMINI_API_KEY,
          persona,
          language,
          {
            onAudioChunk(b64) {
              if (globalWs !== ws) return;
              const now = Date.now();
              if (now < suppressUntil) return;
              if (lastForwardedTime > 0 && now - lastForwardedTime > RESPONSE_GAP_MS) {
                suppressUntil = now + SUPPRESS_SECOND_MS;
                return;
              }
              lastForwardedTime = now;
              send({ type: 'audio', data: b64 });
            },
            onTranscript(role, text) {
              if (globalWs !== ws) return;
              send({ type: 'transcript', role, text });
            },
            onError(err) {
              if (globalWs === ws) send({ type: 'error', message: err.message });
            },
            onClose() {},
          },
          'Start'
        );
        initialized = true;
        globalSession = session;
        globalWs = ws;
        send({ type: 'ready', persona, language });
        return;
      }

      if (msg.type === 'audio' && msg.data && session && globalWs === ws) {
        const buffer = Buffer.from(msg.data, 'base64');
        if (buffer.length > 0) session.sendPcm(buffer);
      }
    } catch (e) {
      send({ type: 'error', message: e instanceof Error ? e.message : String(e) });
    }
  });

  ws.on('close', () => {
    if (session) {
      try {
        session.close();
      } catch (_) {}
      session = null;
    }
    if (globalWs === ws) {
      globalWs = null;
      globalSession = null;
    }
  });

  ws.on('error', () => {
    if (session) {
      try {
        session.close();
      } catch (_) {}
      session = null;
    }
    if (globalWs === ws) {
      globalWs = null;
      globalSession = null;
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Voice server: ws://localhost:${PORT}/voice`);
});
