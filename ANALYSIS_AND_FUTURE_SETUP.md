# Aivana Voice Website — Analysis & Future Setup

## What This Site Is

**Purpose:** A **showcase and branding** frontend for the Aivana voice model. It is **not** the operational dashboard and does **not** place real phone calls or use Twilio.

- **Demo only:** Visitors get an idea of the product through a voice-led, orb-based experience.
- **Speaks from the website:** Uses **pre-recorded audio** (and optionally a future live voice backend) so the site itself “talks” — no telephony.
- **Relationship to voicebot:** The main app at `bot.aivanahealth.com` is the **product** (campaigns, leads, real calls). This site is the **marketing/landing** experience.

---

## How It Works Today

### Experience flow (from `voice-canvas-spec.md`)

1. **Void** — Black screen, anticipation.
2. **Awakening** — Center point + ripples; intro voice: *"Hi. I'm one of five voices..."* (pre-recorded).
3. **Constellation** — Center explodes into 5 persona orbs (Priya, Rohan, Neha, Veda, Arjun); prompt: *"Move toward one. See who speaks to you."*
4. **Hover** — Orb scales up, label appears, **whisper** plays (pre-recorded per persona).
5. **Selection (click)** — Color explosion, transition to conversation UI.
6. **Conversation interface** — Central orb, transcript area, prompt chips, “Tap to speak.” Currently **mock**: no real WebSocket; simulated responses.

### Tech stack

| Layer | Technology |
|-------|------------|
| App | React 19, TypeScript, Vite 7 |
| 3D / visuals | Three.js, @react-three/fiber, @react-three/drei |
| Animation | GSAP |
| Audio | Howler.js (pre-recorded MP3s) |
| Styling | Tailwind 4 |
| Deploy | Vercel (`vercel.json` at repo root) |

### Voice and audio

- **Pre-recorded only (current):**
  - `useAudio.ts` — Howler.js; paths under `/audio/`: `intro-voice.mp3`, `prompt-voice.mp3`, `priya-whisper.mp3`, `priya-intro.mp3`, etc., plus `ambient-drone.mp3`.
  - No live TTS or ASR on the site; no connection to the voicebot backend or Aivana inference.
- **Conversation (useVoice.ts):**
  - **Mock:** “Tap to speak” gets mic permission and simulates a 2s delay then a fake transcript and “speaking” state. TODO comments indicate intent to replace with a real WebSocket to a voice API (e.g. `wss://voice.aivana.ai/<persona>`).

### Data

- **Personas:** `voice-canvas/src/data/personas.ts` — Priya, Rohan, Neha, Veda (4 in code; spec mentions 5 with Arjun). Each has: id, name, role, color, gradients, prompts, features, etc. No `endpoint` in current type; spec had placeholder `endpoint: 'wss://voice.aivana.ai/priya'` etc.

---

## Project Structure

```
Aivana-VOice-website/
├── voice-canvas/           # Main Vite + React app
│   ├── src/
│   │   ├── components/    # Navbar, HeroOrb, CircularCarousel, ConversationInterface, etc.
│   │   ├── data/          # personas.ts
│   │   ├── hooks/         # useVoice (mock), useAudio (Howler), usePhase, useIsMobile, etc.
│   │   ├── styles/        # globals.css
│   │   ├── utils/         # animations
│   │   ├── App.tsx, main.tsx
│   │   └── index.html
│   ├── package.json
│   └── vite.config.ts
├── voice-canvas-spec.md    # Full UX/phase spec (void → awakening → constellation → conversation)
├── design.md              # 3D carousel and UI design notes
├── vercel.json            # Build: voice-canvas; output: voice-canvas/dist; SPA rewrites
└── index.html             # Root (if used by Vercel)
```

---

## Future Setup Checklist

### 1. Audio assets (required for full spec)

The spec and `useAudio.ts` expect these under `voice-canvas/public/audio/` (or equivalent public path):

- `intro-voice.mp3` — “Hi. I'm one of five voices...”
- `prompt-voice.mp3` — “Move toward one. See who speaks to you.”
- Per persona: `priya-whisper.mp3`, `priya-intro.mp3` (and same for rohan, neha, veda, arjun if added).
- `ambient-drone.mp3` — loopable ambient.
- Optional: `ui-sounds/` (ripple, hover-chime, select-whoosh, click).

Until these exist, the app can still run; Howler is set to fail gracefully (e.g. intro load error after timeout).

### 2. Optional: live voice in the demo

To make “Tap to speak” **real** instead of mock:

- **Backend:** Expose a WebSocket (or HTTP) voice API that accepts audio (e.g. PCM/16 kHz) and returns TTS/response audio + transcript. This could be:
  - The same Aivana inference service used by the voicebot (`AIVANA_VOICE_WS_URL`), or
  - A dedicated “demo” endpoint that uses the same or a lighter model.
- **Frontend:** In `useVoice.ts`, replace the mock with:
  - `WebSocket(personaEndpoint)` (or your chosen API).
  - Send mic audio (e.g. via MediaRecorder or Web Audio → backend format).
  - On message: play response audio, set transcript, drive `isSpeaking`/`isListening`.
- **Config:** Add persona `endpoint` (or a single demo endpoint) in `personas.ts` or env (e.g. `VITE_VOICE_WS_URL`).

The site remains **demo-only**; it would still not place phone calls or use the voicebot’s campaign/lead logic.

### 3. Deploy (Vercel)

- **Build:** From repo root, Vercel runs: `cd voice-canvas && npm install && npm run build`.
- **Output:** `voice-canvas/dist`.
- **Routes:** All requests rewritten to `/index.html` (SPA).
- **Domain:** Point a marketing domain (e.g. `aivana.ai` or `voice.aivana.ai`) to this Vercel project; keep `bot.aivanahealth.com` for the main voicebot app.

### 4. Optional: 5th persona (Arjun)

Spec mentions Arjun (general queries). `personas.ts` currently has 4. To align with spec, add Arjun with same shape (id, name, role, color, prompts, etc.) and ensure any audio paths (e.g. `arjun-whisper.mp3`) exist if you use them.

---

## Summary

| Aspect | Detail |
|--------|--------|
| **Role** | Showcase/branding site for the voice model; no outbound calls. |
| **Voice today** | Pre-recorded MP3s (intro, prompt, whispers, full intros); conversation is mock. |
| **Stack** | React 19, Vite, Three.js, GSAP, Howler; deploy via Vercel. |
| **Future voice** | Optional: wire `useVoice` to a real WebSocket voice API (e.g. Aivana inference) for live demo. |
| **Future assets** | Add `/audio/` files per spec for full experience; app degrades gracefully if missing. |

Use this doc when setting up the site (e.g. new env, new domain) or when adding real voice to the demo.
