import { useState, useRef, useCallback } from 'react';
import { getSystemPrompt, OPENING_LINES } from '../data/prompts';

const GEMINI_API_KEY = (import.meta as unknown as { env: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY?.trim() ?? '';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<{ start(): void; stop(): void } | null>(null);
  const chatHistoryRef = useRef<{ role: 'user' | 'model'; parts: { text: string }[] }[]>([]);

  async function callGemini(personaId: string, userText: string): Promise<string> {
    const systemPrompt = getSystemPrompt(personaId);
    const history = chatHistoryRef.current;
    const opening = OPENING_LINES[personaId] ?? OPENING_LINES.veda;
    const contents = [
      { role: 'user', parts: [{ text: `[System]\n${systemPrompt}` }] },
      { role: 'model', parts: [{ text: opening }] },
      ...history.slice(-8),
      { role: 'user', parts: [{ text: userText }] },
    ];
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 150, temperature: 0.8 },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(res.status === 401 ? 'Invalid API key' : err || res.statusText);
    }
    const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? 'Sorry, I didn’t get that.';
    chatHistoryRef.current = [...history, { role: 'user', parts: [{ text: userText }] }, { role: 'model', parts: [{ text }] }];
    return text;
  }

  function speak(text: string, onDone?: () => void) {
    if (!('speechSynthesis' in window)) {
      onDone?.();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => {
      setIsSpeaking(false);
      onDone?.();
    };
    window.speechSynthesis.speak(u);
  }

  const startListening = useCallback(
    async (personaId: string) => {
      if (!GEMINI_API_KEY) {
        setError('Add VITE_GEMINI_API_KEY to your environment');
        return;
      }
      try {
        setError(null);
        setTranscript('');
        chatHistoryRef.current = [];

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const SR = (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown }).SpeechRecognition
          || (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;
        if (!SR) {
          setError('Speech recognition not supported in this browser');
          return;
        }

        const recognition = new SR() as {
          start(): void;
          stop(): void;
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: (e: unknown) => void;
          onend: () => void;
          onerror: (e: { error: string }) => void;
        };
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';
        recognitionRef.current = recognition;

        recognition.onresult = async (e: unknown) => {
          const ev = e as { results: { length: number; item(i: number): { isFinal?: boolean; item(i: number): { transcript?: string } } } };
          const last = ev.results.length - 1;
          const result = ev.results.item(last);
          if (!result?.isFinal) return;
          const userText = result.item(0)?.transcript?.trim();
          if (!userText) return;
          setTranscript((prev) => (prev ? `${prev}\nYou: ${userText}` : `You: ${userText}`));
          recognition.stop();
          try {
            const reply = await callGemini(personaId, userText);
            setTranscript((prev) => (prev ? `${prev}\n${activePersonaName(personaId)}: ${reply}` : `${activePersonaName(personaId)}: ${reply}`));
            speak(reply, () => {
              if (recognitionRef.current && streamRef.current) {
                recognitionRef.current.start();
                setIsListening(true);
              }
            });
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            if (recognitionRef.current && streamRef.current) {
              recognitionRef.current.start();
              setIsListening(true);
            }
          }
        };

        recognition.onend = () => {};

        recognition.onerror = (e: { error: string }) => {
          if (e.error === 'no-speech' || e.error === 'aborted') return;
          setError(e.error);
        };

        const opening = OPENING_LINES[personaId] ?? OPENING_LINES.veda;
        speak(opening, () => {
          setTranscript((prev) => (prev ? `${prev}\n${activePersonaName(personaId)}: ${opening}` : `${activePersonaName(personaId)}: ${opening}`));
          recognition.start();
          setIsListening(true);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start');
        setIsListening(false);
      }
    },
    []
  );

  const stopListening = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsListening(false);
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    error,
    startListening,
    stopListening,
    isConfigured: !!GEMINI_API_KEY,
  };
}

function activePersonaName(personaId: string): string {
  const names: Record<string, string> = { priya: 'Priya', rohan: 'Rohan', neha: 'Neha', veda: 'Veda' };
  return names[personaId] ?? 'Assistant';
}
