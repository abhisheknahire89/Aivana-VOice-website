/**
 * Standalone Gemini Live voice server for voice-canvas.
 * Browser connects via WebSocket /voice; sends PCM 16kHz base64, receives μ-law 8kHz base64.
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

wss.on('connection', (ws: import('ws').WebSocket) => {
  let session: Awaited<ReturnType<typeof createGeminiSession>> | null = null;
  let initialized = false;

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

      if (msg.type === 'init') {
        if (initialized) {
          send({ type: 'error', message: 'Already initialized' });
          return;
        }
        const persona = (msg.persona ?? 'Ananya').trim();
        const language = (msg.language ?? 'en-IN').trim();

        session = await createGeminiSession(
          GEMINI_API_KEY,
          persona,
          language,
          {
            onAudioChunk(b64) {
              send({ type: 'audio', data: b64 });
            },
            onTranscript(role, text) {
              send({ type: 'transcript', role, text });
            },
            onError(err) {
              send({ type: 'error', message: err.message });
            },
            onClose() {},
          },
          'Start'
        );
        initialized = true;
        send({ type: 'ready', persona, language });
        return;
      }

      if (msg.type === 'audio' && msg.data && session) {
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
  });

  ws.on('error', () => {
    if (session) {
      try {
        session.close();
      } catch (_) {}
      session = null;
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Voice server: ws://localhost:${PORT}/voice`);
});
