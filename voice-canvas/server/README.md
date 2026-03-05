# Voice server (Gemini Live)

Standalone WebSocket server for the voice-canvas app. Same Gemini Live models and persona voices as the voicebot project.

## Run

```bash
# From voice-canvas/
npm run dev:server    # voice server only (port 3001)
npm run dev:all        # voice server + Vite (one command)
```

Set `GEMINI_API_KEY` or `VITE_GEMINI_API_KEY` in `server/.env` or `voice-canvas/.env`.

## Protocol

- **Path:** `/voice`
- **Init:** Client sends `{ "type": "init", "persona": "Ananya"|"Priya"|"Neha"|"Riya", "language": "en-IN" }`. Server creates a Gemini Live session and replies `{ "type": "ready" }`.
- **Audio:** Client sends `{ "type": "audio", "data": "<base64 PCM 16kHz mono>" }`. Server sends `{ "type": "audio", "data": "<base64 μ-law 8kHz>" }` and `{ "type": "transcript", "role", "text" }` for playback.
