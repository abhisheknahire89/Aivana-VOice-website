/**
 * Gemini Live voice via WebSocket (same models and persona voices as voicebot).
 * Use when VITE_VOICE_WS_URL or VITE_VOICEBOT_WS_URL is set.
 */

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { mulawDecodeToFloat32 } from '../utils/mulaw';

const PERSONA_TO_VOICEBOT: Record<string, string> = {
  priya: 'Priya',
  rohan: 'Riya',
  neha: 'Neha',
  veda: 'Ananya',
};

const SAMPLE_RATE_PLAYBACK = 8000;
const CHUNK_MS = 100;
const RESAMPLE_RATIO = 48000 / 16000;
const NEW_PHRASE_GAP_MS = 400;
const MAX_SCHEDULE_AHEAD_MS = 1500;

function activePersonaName(personaId: string): string {
  const names: Record<string, string> = { priya: 'Priya', rohan: 'Rohan', neha: 'Neha', veda: 'Veda' };
  return names[personaId] ?? 'Assistant';
}

export function useLiveVoice(wsUrl: string) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playbackContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef(0);
  const lastAudioTimeRef = useRef(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const closedRef = useRef(false);
  const sendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startListening = useCallback(
    async (personaId: string) => {
      if (!wsUrl) return;

      activeSourcesRef.current.forEach((s) => {
        try {
          s.stop();
        } catch (_) {}
      });
      activeSourcesRef.current.clear();
      if (sendIntervalRef.current) {
        clearInterval(sendIntervalRef.current);
        sendIntervalRef.current = null;
      }
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (_) {}
        wsRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (processorRef.current && audioContextRef.current) {
        try {
          processorRef.current.disconnect();
          audioContextRef.current.close();
        } catch (_) {}
        processorRef.current = null;
        audioContextRef.current = null;
      }

      const voicebotPersona = PERSONA_TO_VOICEBOT[personaId] ?? 'Ananya';
      try {
        setError(null);
        setTranscript('');
        closedRef.current = false;

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        const CONNECT_TIMEOUT_MS = 12000;
        await Promise.race([
          new Promise<void>((resolve, reject) => {
            ws.onopen = () => {
              ws.send(
                JSON.stringify({
                  type: 'init',
                  persona: voicebotPersona,
                  language: 'en-IN',
                })
              );
              resolve();
            };
            ws.onerror = () => reject(new Error('WebSocket connection failed'));
            ws.onclose = (ev) => {
              if (!closedRef.current) {
                setError(ev.code === 1006 ? 'Cannot reach voice server. Start it with: npm run dev:server' : 'Connection closed');
                setIsListening(false);
                setIsSpeaking(false);
              }
            };
          }),
          new Promise<void>((_, reject) =>
            setTimeout(() => reject(new Error('Connection timed out. Start the voice server with: npm run dev:server')), CONNECT_TIMEOUT_MS)
          ),
        ]).catch((err) => {
          try {
            ws.close();
          } catch (_) {}
          wsRef.current = null;
          throw err;
        });

        ws.onmessage = (event: MessageEvent) => {
          try {
            const data = typeof event.data === 'string' ? event.data : '';
            if (!data.startsWith('{')) return;
            const msg = JSON.parse(data) as {
              type?: string;
              data?: string;
              role?: string;
              text?: string;
              message?: string;
            };
            if (msg.type === 'audio' && msg.data) {
              const ctx = playbackContextRef.current;
              if (ctx && ctx.state !== 'closed') {
                if (ctx.state === 'suspended') ctx.resume().catch(() => {});

                const now = performance.now();
                const gap = now - lastAudioTimeRef.current;
                lastAudioTimeRef.current = now;

                if (gap > NEW_PHRASE_GAP_MS) {
                  activeSourcesRef.current.forEach((s) => {
                    try {
                      s.stop();
                    } catch (_) {}
                  });
                  activeSourcesRef.current.clear();
                  nextPlayTimeRef.current = ctx.currentTime;
                }

                const maxAhead = ctx.currentTime + MAX_SCHEDULE_AHEAD_MS / 1000;
                if (nextPlayTimeRef.current > maxAhead) {
                  nextPlayTimeRef.current = ctx.currentTime;
                }

                const bytes = Uint8Array.from(atob(msg.data), (c) => c.charCodeAt(0));
                const float32 = mulawDecodeToFloat32(bytes);
                const buffer = ctx.createBuffer(1, float32.length, SAMPLE_RATE_PLAYBACK);
                buffer.copyToChannel(new Float32Array(float32), 0);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                const start = Math.max(nextPlayTimeRef.current, ctx.currentTime);
                nextPlayTimeRef.current = start + buffer.duration;
                source.connect(ctx.destination);
                activeSourcesRef.current.add(source);
                source.onended = () => {
                  activeSourcesRef.current.delete(source);
                  if (activeSourcesRef.current.size === 0) setIsSpeaking(false);
                };
                source.start(start);
                setIsSpeaking(true);
              }
            } else if (msg.type === 'transcript' && msg.role && msg.text) {
              const name = msg.role === 'assistant' ? activePersonaName(personaId) : 'You';
              setTranscript((prev) => (prev ? `${prev}\n${name}: ${msg.text}` : `${name}: ${msg.text}`));
            } else if (msg.type === 'error' && msg.message) {
              setError(msg.message);
            } else if (msg.type === 'ready') {
              setIsListening(true);
            }
          } catch (_) {}
        };

        ws.onerror = () => setError('WebSocket error');
        ws.onclose = () => {
          if (sendIntervalRef.current) {
            clearInterval(sendIntervalRef.current);
            sendIntervalRef.current = null;
          }
          if (!closedRef.current) {
            setIsListening(false);
            setIsSpeaking(false);
          }
        };

        if (!playbackContextRef.current || playbackContextRef.current.state === 'closed') {
          playbackContextRef.current = new AudioContext({ sampleRate: SAMPLE_RATE_PLAYBACK });
        }
        nextPlayTimeRef.current = playbackContextRef.current.currentTime;
        lastAudioTimeRef.current = 0;
        activeSourcesRef.current.clear();

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const ctx = new AudioContext({ sampleRate: 48000 });
        audioContextRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const bufferSize = 4096;
        const processor = ctx.createScriptProcessor(bufferSize, 1, 1);
        processorRef.current = processor;

        const pcmChunk: number[] = [];
        sendIntervalRef.current = setInterval(() => {
          if (pcmChunk.length === 0 || ws.readyState !== WebSocket.OPEN) return;
          const buf = new Int16Array(pcmChunk.length);
          for (let i = 0; i < pcmChunk.length; i++) buf[i] = pcmChunk[i]!;
          pcmChunk.length = 0;
          const u8 = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
          let b64 = '';
          for (let i = 0; i < u8.length; i++) b64 += String.fromCharCode(u8[i]!);
          ws.send(JSON.stringify({ type: 'audio', data: btoa(b64) }));
        }, CHUNK_MS);

        processor.onaudioprocess = (e: AudioProcessingEvent) => {
          const input = e.inputBuffer.getChannelData(0);
          for (let i = 0; i < input.length; i += RESAMPLE_RATIO) {
            const s = input[i] ?? 0;
            const v = Math.max(-1, Math.min(1, s));
            pcmChunk.push(Math.round(v * 32767));
          }
        };
        source.connect(processor);
        processor.connect(ctx.destination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start');
        setIsListening(false);
      }
    },
    [wsUrl]
  );

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (_) {}
        wsRef.current = null;
      }
      if (sendIntervalRef.current) {
        clearInterval(sendIntervalRef.current);
        sendIntervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      activeSourcesRef.current.forEach((s) => {
        try {
          s.stop();
        } catch (_) {}
      });
      activeSourcesRef.current.clear();
    };
  }, []);

  const stopListening = useCallback(() => {
    closedRef.current = true;
    activeSourcesRef.current.forEach((s) => {
      try {
        s.stop();
      } catch (_) {}
    });
    activeSourcesRef.current.clear();
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (_) {}
      wsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (processorRef.current && audioContextRef.current) {
      try {
        processorRef.current.disconnect();
        audioContextRef.current.close();
      } catch (_) {}
      processorRef.current = null;
      audioContextRef.current = null;
    }
    setIsListening(false);
    setIsSpeaking(false);
  }, []);

  return useMemo(
    () => ({
      isListening,
      isSpeaking,
      transcript,
      error,
      startListening,
      stopListening,
      isConfigured: !!wsUrl,
    }),
    [isListening, isSpeaking, transcript, error, startListening, stopListening, wsUrl]
  );
}
