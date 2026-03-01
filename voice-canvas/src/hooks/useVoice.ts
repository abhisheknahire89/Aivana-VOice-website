import { useState, useRef, useCallback } from 'react';

export function useVoice() {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const startListening = useCallback(async (personaEndpoint: string) => {
        try {
            setError(null);

            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // TODO: Replace mock with real WebSocket connection
            // const ws = new WebSocket(personaEndpoint);
            // wsRef.current = ws;
            //
            // ws.onopen = () => { ... stream audio via MediaRecorder ... };
            // ws.onmessage = (event) => { ... handle response audio + transcript ... };
            // ws.onerror = (err) => setError('Connection failed');
            // ws.onclose = () => setIsListening(false);

            console.log(`[useVoice] Mock: Connected to ${personaEndpoint}`);
            setIsListening(true);

            // Mock: Simulate a backend response after 2s
            setTimeout(() => {
                setIsSpeaking(true);
                setTranscript('I understand your request. Let me help you with that.');

                // Mock: Speaking duration
                setTimeout(() => {
                    setIsSpeaking(false);
                }, 3000);
            }, 2000);

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to access microphone';
            setError(message);
            setIsListening(false);
        }
    }, []);

    const stopListening = useCallback(() => {
        // Stop all media tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }

        // Close WebSocket
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        setIsListening(false);
    }, []);

    const sendTextPrompt = useCallback((text: string) => {
        console.log(`[useVoice] Sending text prompt: "${text}"`);

        // TODO: Send text to backend WebSocket/API
        // wsRef.current?.send(JSON.stringify({ type: 'text', content: text }));

        // Mock: Simulate processing + response
        setTranscript(`You said: "${text}"`);
        setIsSpeaking(true);

        setTimeout(() => {
            setTranscript(`Processing your request: "${text}". Here's what I found...`);
            setTimeout(() => {
                setIsSpeaking(false);
            }, 3000);
        }, 1000);
    }, []);

    return {
        isListening,
        isSpeaking,
        transcript,
        error,
        startListening,
        stopListening,
        sendTextPrompt,
    };
}
