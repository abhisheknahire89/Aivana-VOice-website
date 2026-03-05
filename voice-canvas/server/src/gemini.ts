/**
 * Single Gemini Live session. One connection, one stream.
 */

import { GoogleGenAI, Modality, ActivityHandling } from '@google/genai';
import type { LiveServerMessage } from '@google/genai';
import { getSystemInstruction, getPersonaVoiceName } from './personas.js';
import { geminiToMulawBase64 } from './audio.js';

const MODELS = [
  'gemini-2.5-flash-native-audio-preview-12-2025',
  'gemini-2.5-flash-preview-05-20',
  'gemini-2.5-flash',
];

export type GeminiSessionCallbacks = {
  onAudioChunk: (base64Mulaw: string) => void;
  onTranscript?: (role: 'user' | 'assistant', text: string) => void;
  onError: (err: Error) => void;
  onClose: () => void;
};

export interface GeminiSession {
  sendPcm(pcm16kBuffer: Buffer): void;
  endTurn(): void;
  close(): void;
}

export async function createGeminiSession(
  apiKey: string,
  persona: string,
  language: string,
  callbacks: GeminiSessionCallbacks,
  startPrompt: string = 'Start'
): Promise<GeminiSession> {
  const ai = new GoogleGenAI({ apiKey });
  const systemInstruction = getSystemInstruction(persona, language);

  let lastErr: Error | null = null;
  for (const model of MODELS) {
    try {
      let setupCompleteResolve: () => void = () => {};
      const setupCompletePromise = new Promise<void>((resolve) => {
        setupCompleteResolve = resolve;
      });

      const liveConfig = {
        model,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction,
          realtimeInputConfig: {
            activityHandling: ActivityHandling.START_OF_ACTIVITY_INTERRUPTS,
          },
          speechConfig: (() => {
            const languageCode = language === 'hi-IN' ? 'hi-IN' : 'en-US';
            const voiceName = getPersonaVoiceName(persona);
            return voiceName
              ? { languageCode, voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
              : { languageCode };
          })(),
        },
        callbacks: {
          onopen: () => {},
          onmessage: (msg: LiveServerMessage) => {
            const raw = msg as unknown as Record<string, unknown>;
            if (raw.setupComplete === true) setupCompleteResolve();
            try {
              const sc = (msg.serverContent ?? raw.server_content) as Record<string, unknown> | undefined;
              const mt = (sc?.modelTurn ?? sc?.model_turn ?? sc?.content) as { parts?: Array<Record<string, unknown>> } | undefined;
              const parts: Array<Record<string, unknown>> = (mt?.parts as Array<Record<string, unknown>>) ?? [];

              for (const part of parts) {
                const inline = (part.inlineData ?? part.inline_data) as { mimeType?: string; mime_type?: string; data?: string } | undefined;
                const data = inline?.data;
                if (data && typeof data === 'string') {
                  const mime = ((inline?.mimeType ?? inline?.mime_type) ?? '').toLowerCase();
                  const isAudio = mime.startsWith('audio/') || mime.includes('pcm') || mime === '';
                  if (isAudio) {
                    try {
                      const pcmBuffer = Buffer.from(data, 'base64');
                      if (pcmBuffer.length >= 2) {
                        const mulawB64 = geminiToMulawBase64(pcmBuffer);
                        callbacks.onAudioChunk(mulawB64);
                      }
                    } catch { /* noop */ }
                  }
                }
                const text = part.text as string | undefined;
                if (text) callbacks.onTranscript?.('assistant', text);
              }
            } catch { /* noop */ }
          },
          onerror: (event: { error?: Error }) => {
            callbacks.onError(event.error ?? new Error('Unknown Gemini error'));
          },
          onclose: () => callbacks.onClose(),
        },
      };

      const session = await ai.live.connect(liveConfig);
      Promise.race([
        setupCompletePromise,
        new Promise<void>((r) => setTimeout(r, 3000)),
      ]).then(() => {
        setTimeout(() => {
          try {
            session.sendClientContent({
              turns: [{ role: 'user', parts: [{ text: startPrompt.trim() || 'Start' }] }],
              turnComplete: true,
            });
          } catch { /* noop */ }
        }, 80);
      });

      return {
        sendPcm(pcm16kBuffer: Buffer) {
          try {
            session.sendRealtimeInput({
              audio: {
                data: pcm16kBuffer.toString('base64'),
                mimeType: 'audio/pcm;rate=16000',
              },
            });
          } catch (e) {
            callbacks.onError(e instanceof Error ? e : new Error(String(e)));
          }
        },
        endTurn() {
          try {
            session.sendClientContent({ turns: [], turnComplete: true });
          } catch { /* noop */ }
        },
        close() {
          try {
            session.conn?.close();
          } catch { /* noop */ }
        },
      };
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
      continue;
    }
  }
  throw lastErr ?? new Error('Failed to create Gemini session');
}
