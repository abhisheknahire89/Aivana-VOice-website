# THE VOICE CANVAS
## Complete Production Specification for Antigravity

---

## CONCEPT SUMMARY

A radical departure from traditional SaaS websites. Visitors land in darkness, greeted by a voice. Five AI personas appear as floating orbs. Hover reveals whispered introductions. Click floods the screen with color and initiates live conversation.

**The demo IS the website.**

---

## PHASE-BY-PHASE BREAKDOWN

### PHASE 1: THE VOID
**Duration:** 0 - 1.5 seconds

```
Screen: Pure black (#000000)
Audio: Silence
Interaction: None (disabled)
```

**Purpose:** Build anticipation. User wonders "is it loading?"

**Technical:**
```css
body {
  background: #000000;
  overflow: hidden;
  cursor: none; /* Hide cursor initially */
}
```

---

### PHASE 2: THE AWAKENING
**Duration:** 1.5 - 4 seconds

**Visual Sequence:**
1. **1.5s:** Single white point appears at center (opacity 0 → 1)
2. **2.0s:** First ripple emanates outward
3. **2.5s:** Second ripple, cursor appears
4. **3.0s:** Voice begins speaking
5. **3.5s:** Ripples continue, point pulses gently

**Center Point Spec:**
```css
.center-point {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(255,255,255,0.5);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
}
```

**Ripple Effect:**
```javascript
function createRipple() {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  document.body.appendChild(ripple);
  
  gsap.fromTo(ripple, 
    { scale: 0, opacity: 0.4 },
    { 
      scale: 30, 
      opacity: 0, 
      duration: 3,
      ease: 'power1.out',
      onComplete: () => ripple.remove()
    }
  );
}

// Trigger ripples
setTimeout(() => createRipple(), 2000);
setTimeout(() => createRipple(), 2500);
setTimeout(() => createRipple(), 3200);
```

```css
.ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
```

**Voice Audio (auto-play):**
> "Hi. I'm one of five voices that could transform your business."

```javascript
// Play intro voice at 3 seconds
const introVoice = new Howl({
  src: ['/audio/intro-voice.mp3'],
  volume: 0.7
});

setTimeout(() => introVoice.play(), 3000);
```

---

### PHASE 3: THE CONSTELLATION
**Duration:** 4 - 6 seconds

**Visual Sequence:**
1. **4.0s:** Center point explodes into 5 orbs
2. **4.5s:** Orbs drift to their positions
3. **5.5s:** Orbs settle, begin floating animation
4. **6.0s:** Voice prompt plays

**Orb Positions (Pentagon, slightly asymmetric):**
```javascript
const orbPositions = {
  priya: { x: '35%', y: '25%' },   // Top-left
  rohan: { x: '65%', y: '25%' },   // Top-right
  neha:  { x: '50%', y: '75%' },   // Bottom-center
  veda:  { x: '20%', y: '55%' },   // Left
  arjun: { x: '80%', y: '55%' },   // Right
};
```

**Orb Component:**
```javascript
const Orb = ({ persona, position, color, onHover, onClick }) => {
  return (
    <div 
      className="orb"
      style={{
        left: position.x,
        top: position.y,
        '--orb-color': color,
        '--orb-glow': `${color}66`, // 40% opacity
      }}
      onMouseEnter={onHover}
      onClick={onClick}
    >
      <div className="orb-inner" />
      <div className="orb-glow" />
    </div>
  );
};
```

```css
.orb {
  position: absolute;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.orb-inner {
  width: 100%;
  height: 100%;
  background: var(--orb-color);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
}

.orb-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--orb-glow) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  opacity: 0.5;
  pointer-events: none;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
```

**Explosion Animation (center → positions):**
```javascript
function explodeOrbs() {
  const orbs = document.querySelectorAll('.orb');
  
  orbs.forEach((orb, i) => {
    const persona = orb.dataset.persona;
    const target = orbPositions[persona];
    
    // Start at center
    gsap.set(orb, { left: '50%', top: '50%', scale: 0, opacity: 0 });
    
    // Animate to position
    gsap.to(orb, {
      left: target.x,
      top: target.y,
      scale: 1,
      opacity: 1,
      duration: 1.2,
      delay: i * 0.1,
      ease: 'back.out(1.7)'
    });
  });
}
```

**Voice (at 6 seconds):**
> "Move toward one. See who speaks to you."

---

### PHASE 4: THE HOVER STATE

**When cursor approaches an orb (within 150px):**

**Visual Changes:**
1. Hovered orb scales: 40px → 120px
2. Glow intensifies (opacity 0.5 → 0.8, radius doubles)
3. Other orbs fade (opacity 1 → 0.3) and drift away slightly
4. Label fades in below orb
5. Background bleeds orb color from that direction
6. Whispered intro plays

**Hover Detection:**
```javascript
function checkOrbProximity(mouseX, mouseY) {
  orbs.forEach(orb => {
    const rect = orb.getBoundingClientRect();
    const orbX = rect.left + rect.width / 2;
    const orbY = rect.top + rect.height / 2;
    const distance = Math.hypot(mouseX - orbX, mouseY - orbY);
    
    if (distance < 150) {
      activateOrb(orb);
    } else {
      deactivateOrb(orb);
    }
  });
}

document.addEventListener('mousemove', (e) => {
  checkOrbProximity(e.clientX, e.clientY);
});
```

**Orb Activation:**
```javascript
function activateOrb(orb) {
  const persona = orb.dataset.persona;
  
  // Scale up hovered orb
  gsap.to(orb, {
    scale: 3,
    duration: 0.4,
    ease: 'power2.out'
  });
  
  // Fade other orbs
  document.querySelectorAll('.orb').forEach(other => {
    if (other !== orb) {
      gsap.to(other, { opacity: 0.3, duration: 0.3 });
    }
  });
  
  // Show label
  showLabel(orb, persona);
  
  // Background color bleed
  bleedBackground(persona, orb.style.left, orb.style.top);
  
  // Play whispered intro (only once per hover)
  if (!orb.dataset.played) {
    playWhisper(persona);
    orb.dataset.played = 'true';
  }
}
```

**Label Component:**
```css
.orb-label {
  position: absolute;
  top: calc(100% + 16px);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.orb-label.visible {
  opacity: 1;
}

.orb-label-name {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.orb-label-role {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
}
```

**Background Color Bleed:**
```javascript
function bleedBackground(persona, x, y) {
  const color = PERSONA_COLORS[persona];
  
  // Create radial gradient from orb position
  document.body.style.background = `
    radial-gradient(
      circle at ${x} ${y},
      ${color}22 0%,
      transparent 50%
    ),
    #000000
  `;
}
```

**Whispered Intros (3-5 seconds each):**
```javascript
const whispers = {
  priya: "/audio/priya-whisper.mp3",   // "I'm Priya... I handle support in 10 languages..."
  rohan: "/audio/rohan-whisper.mp3",   // "I'm Rohan... I close deals while you sleep..."
  neha:  "/audio/neha-whisper.mp3",    // "I'm Neha... I never miss an appointment..."
  veda:  "/audio/veda-whisper.mp3",    // "I'm VEDA... I triage patients with care..."
  arjun: "/audio/arjun-whisper.mp3",   // "I'm Arjun... I handle anything you throw at me..."
};

function playWhisper(persona) {
  const audio = new Howl({
    src: [whispers[persona]],
    volume: 0.6
  });
  audio.play();
}
```

---

### PHASE 5: THE SELECTION (Click)

**Animation Sequence (0.8 seconds total):**

1. **0.0s:** Click registered
2. **0.1s:** Orb flashes bright
3. **0.2s:** Color explosion begins (fills screen)
4. **0.3s:** Other orbs dissolve (scale down, fade out)
5. **0.5s:** Screen is full persona color (deep shade)
6. **0.6s:** Orb reforms at center, larger (200px)
7. **0.8s:** UI elements fade in
8. **1.0s:** Full intro voice plays

**Selection Handler:**
```javascript
function selectPersona(persona) {
  const orb = document.querySelector(`[data-persona="${persona}"]`);
  const color = PERSONA_COLORS[persona];
  
  // 1. Flash
  gsap.to(orb, { 
    filter: 'brightness(2)', 
    duration: 0.1,
    yoyo: true,
    repeat: 1
  });
  
  // 2. Color explosion
  setTimeout(() => {
    createColorExplosion(color, orb);
  }, 100);
  
  // 3. Dissolve other orbs
  document.querySelectorAll('.orb').forEach(other => {
    if (other !== orb) {
      gsap.to(other, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  });
  
  // 4. Reform at center
  setTimeout(() => {
    transitionToConversation(persona);
  }, 500);
}
```

**Color Explosion:**
```javascript
function createColorExplosion(color, sourceOrb) {
  const rect = sourceOrb.getBoundingClientRect();
  const explosion = document.createElement('div');
  explosion.className = 'color-explosion';
  explosion.style.setProperty('--explosion-color', color);
  explosion.style.left = rect.left + rect.width/2 + 'px';
  explosion.style.top = rect.top + rect.height/2 + 'px';
  document.body.appendChild(explosion);
  
  gsap.to(explosion, {
    scale: 100,
    duration: 0.5,
    ease: 'power2.out',
    onComplete: () => {
      document.body.style.background = getDeepColor(color);
      explosion.remove();
    }
  });
}
```

```css
.color-explosion {
  position: fixed;
  width: 50px;
  height: 50px;
  background: var(--explosion-color);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 100;
}
```

**Deep Background Colors:**
```javascript
const deepColors = {
  priya: '#1a0a2e',  // Deep purple
  rohan: '#2a1a00',  // Deep amber
  neha:  '#0a2a1a',  // Deep emerald
  veda:  '#2a0a0a',  // Deep red
  arjun: '#0a1a2a',  // Deep cyan
};
```

---

### PHASE 6: THE CONVERSATION INTERFACE

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [← Back]                                    [Book Demo]    │
│                                                             │
│                                                             │
│                         ┌─────┐                             │
│                         │     │                             │
│                         │ ◉   │  ← 200px orb               │
│                         │     │                             │
│                         └─────┘                             │
│                                                             │
│                      "PRIYA"                                │
│                  Customer Support                           │
│                                                             │
│                                                             │
│        ┌─────────────────────────────────────┐             │
│        │                                     │             │
│        │     Live transcription appears      │             │
│        │     here during conversation        │             │
│        │                                     │             │
│        └─────────────────────────────────────┘             │
│                                                             │
│                                                             │
│    💬 "Track my order"   💬 "Refund"   💬 "Tamil"         │
│                                                             │
│                                                             │
│              🎙️ Tap anywhere to speak                      │
│                                                             │
│                                                             │
│              ○   ○   ●   ○   ○                             │
│              P   R   N   V   A                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Conversation Interface Component:**
```jsx
function ConversationInterface({ persona }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  return (
    <div className="conversation-interface" onClick={handleTapToSpeak}>
      {/* Navigation */}
      <nav className="conversation-nav">
        <button className="back-btn" onClick={goBack}>
          ← Back
        </button>
        <button className="demo-btn">
          Book Demo
        </button>
      </nav>
      
      {/* Central Orb */}
      <div className="conversation-orb">
        <ActiveOrb 
          persona={persona} 
          isListening={isListening}
          isSpeaking={isSpeaking}
        />
        <h1 className="persona-name">{persona.name}</h1>
        <p className="persona-role">{persona.role}</p>
      </div>
      
      {/* Transcription Area */}
      <div className="transcription-area">
        {transcript && (
          <p className="transcript">{transcript}</p>
        )}
      </div>
      
      {/* Suggested Prompts */}
      <div className="prompts">
        {persona.prompts.map(prompt => (
          <button 
            key={prompt} 
            className="prompt-chip"
            onClick={() => sendPrompt(prompt)}
          >
            💬 "{prompt}"
          </button>
        ))}
      </div>
      
      {/* Tap Instruction */}
      <p className="tap-instruction">
        🎙️ Tap anywhere to speak
      </p>
      
      {/* Persona Switcher */}
      <div className="persona-dots">
        {PERSONAS.map(p => (
          <button
            key={p.id}
            className={`dot ${p.id === persona.id ? 'active' : ''}`}
            onClick={() => switchPersona(p.id)}
            style={{ '--dot-color': p.color }}
          />
        ))}
      </div>
    </div>
  );
}
```

**Active Orb (Voice Reactive):**
```jsx
function ActiveOrb({ persona, isListening, isSpeaking }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    // Three.js or Canvas setup for reactive orb
    const canvas = canvasRef.current;
    // ... visualization code
  }, []);
  
  return (
    <div className={`active-orb ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}>
      <canvas ref={canvasRef} />
    </div>
  );
}
```

```css
.active-orb {
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.active-orb.listening {
  animation: listen-pulse 0.5s ease-in-out infinite;
}

.active-orb.speaking {
  animation: speak-wave 0.3s ease-in-out infinite;
}

@keyframes listen-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

**Full-Screen Tap to Talk:**
```javascript
function handleTapToSpeak(e) {
  // Ignore if clicking on interactive elements
  if (e.target.closest('button, nav, .prompts')) return;
  
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
}

async function startListening() {
  setIsListening(true);
  
  // Request mic permission
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
  // Connect to voice backend
  voiceConnection.connect(activePersona.endpoint);
  voiceConnection.sendAudio(stream);
  
  // Update UI
  document.body.classList.add('listening-mode');
}
```

**Listening Mode (Full Screen Pulse):**
```css
body.listening-mode::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--persona-color);
  opacity: 0;
  animation: screen-pulse 1s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

@keyframes screen-pulse {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.05; }
}
```

---

## PERSONA DATA STRUCTURE

```javascript
const PERSONAS = [
  {
    id: 'priya',
    name: 'Priya',
    role: 'Customer Support',
    color: '#9333EA',
    deepColor: '#1a0a2e',
    glowColor: 'rgba(147, 51, 234, 0.4)',
    endpoint: 'wss://voice.aivana.ai/priya',
    whisperAudio: '/audio/priya-whisper.mp3',
    fullIntroAudio: '/audio/priya-intro.mp3',
    fullIntroText: "I'm Priya. I handle customer support calls — complaints, returns, order tracking — in Hindi, Tamil, Telugu, and 7 more Indian languages. I work 24/7, never get tired, and I actually care. Want to test me?",
    prompts: [
      "Track my order",
      "I want a refund",
      "Speak in Tamil"
    ]
  },
  {
    id: 'rohan',
    name: 'Rohan',
    role: 'Sales',
    color: '#F59E0B',
    deepColor: '#2a1a00',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    endpoint: 'wss://voice.aivana.ai/rohan',
    whisperAudio: '/audio/rohan-whisper.mp3',
    fullIntroAudio: '/audio/rohan-intro.mp3',
    fullIntroText: "I'm Rohan. I qualify leads, pitch products, handle objections, and book demos — even at 2 AM. I don't take days off, and I never forget to follow up. Ready to see me work?",
    prompts: [
      "Tell me pricing",
      "Book a demo",
      "What's the ROI?"
    ]
  },
  {
    id: 'neha',
    name: 'Neha',
    role: 'Appointments',
    color: '#10B981',
    deepColor: '#0a2a1a',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    endpoint: 'wss://voice.aivana.ai/neha',
    whisperAudio: '/audio/neha-whisper.mp3',
    fullIntroAudio: '/audio/neha-intro.mp3',
    fullIntroText: "I'm Neha. I schedule appointments, send reminders, handle reschedules, and reduce no-shows. I integrate with any calendar. Zero friction, zero missed slots. Shall I book something?",
    prompts: [
      "Book tomorrow 3 PM",
      "Cancel appointment",
      "Reschedule to Friday"
    ]
  },
  {
    id: 'veda',
    name: 'VEDA',
    role: 'Healthcare Triage',
    color: '#EF4444',
    deepColor: '#2a0a0a',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    endpoint: 'wss://voice.aivana.ai/veda',
    whisperAudio: '/audio/veda-whisper.mp3',
    fullIntroAudio: '/audio/veda-intro.mp3',
    fullIntroText: "I'm VEDA — Virtual Emergency and Diagnostic Assistant. I handle patient calls, collect symptoms, assess urgency, and route to the right department. Clinically accurate. Deeply empathetic. How can I help you today?",
    prompts: [
      "I have a headache",
      "Book OPD appointment",
      "Speak in Hindi"
    ]
  },
  {
    id: 'arjun',
    name: 'Arjun',
    role: 'General Queries',
    color: '#06B6D4',
    deepColor: '#0a1a2a',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    endpoint: 'wss://voice.aivana.ai/arjun',
    whisperAudio: '/audio/arjun-whisper.mp3',
    fullIntroAudio: '/audio/arjun-intro.mp3',
    fullIntroText: "I'm Arjun. I'm the catch-all — FAQs, general queries, call routing, overflow handling. Nothing slips through the cracks when I'm on duty. What do you need?",
    prompts: [
      "What are your hours?",
      "Connect to support",
      "Where are you located?"
    ]
  }
];
```

---

## AUDIO REQUIREMENTS

### Required Audio Files:

```
/audio/
├── intro-voice.mp3          (3s)  "Hi. I'm one of five voices..."
├── prompt-voice.mp3         (3s)  "Move toward one. See who speaks to you."
├── priya-whisper.mp3        (4s)  Whispered intro
├── priya-intro.mp3          (12s) Full spoken intro
├── rohan-whisper.mp3        (4s)
├── rohan-intro.mp3          (12s)
├── neha-whisper.mp3         (4s)
├── neha-intro.mp3           (12s)
├── veda-whisper.mp3         (4s)
├── veda-intro.mp3           (12s)
├── arjun-whisper.mp3        (4s)
├── arjun-intro.mp3          (12s)
├── ambient-drone.mp3        (30s, loopable)
└── ui-sounds/
    ├── ripple.mp3           (1s)
    ├── hover-chime.mp3      (0.5s)
    ├── select-whoosh.mp3    (0.8s)
    └── click.mp3            (0.2s)
```

### Voice Recording Guidelines:

**Whispers (intimate, ASMR-style):**
- Close mic technique
- Soft, breathy delivery
- Volume: 60% of normal speech
- Slight reverb for depth

**Full Intros (confident, warm):**
- Clear articulation
- Medium pace
- Personality shines through
- Ends with question (invites interaction)

**Ambient Drone:**
- Low frequency (60-120 Hz)
- Subtle harmonic content
- No rhythm/beat
- Seamless loop point

---

## ESCAPE HATCH (Traditional Mode)

After 8 seconds of no interaction, show subtle exit:

```jsx
{showEscapeHatch && (
  <button className="escape-hatch" onClick={goToTraditional}>
    Prefer a traditional website? →
  </button>
)}
```

```css
.escape-hatch {
  position: fixed;
  bottom: 24px;
  right: 24px;
  font-size: 12px;
  color: rgba(255,255,255,0.3);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.escape-hatch:hover {
  color: rgba(255,255,255,0.6);
}
```

**Traditional Mode:** Morphs into standard layout with:
- Hero section
- Features grid
- Persona showcase
- Pricing
- CTA

(But they'll remember the void.)

---

## MOBILE ADAPTATION

**Layout:**
```
┌─────────────────────┐
│                     │
│         ◉          │ ← Priya (top)
│                     │
│    ◉    ◉    ◉    │ ← VEDA, Neha, Arjun
│                     │
│         ◉          │ ← Rohan (bottom)
│                     │
│                     │
│  "Tap a voice"      │
│                     │
└─────────────────────┘
```

**Behavior:**
- Tap (not hover) to preview
- Tap again to select
- Haptic feedback on interactions
- Simplified animations (respect battery)

```css
@media (max-width: 768px) {
  .orb {
    width: 60px;
    height: 60px;
  }
  
  .orb-label {
    display: none; /* Show only on tap */
  }
  
  /* Cross layout */
  [data-persona="priya"] { top: 20%; left: 50%; }
  [data-persona="rohan"] { top: 80%; left: 50%; }
  [data-persona="veda"]  { top: 50%; left: 20%; }
  [data-persona="neha"]  { top: 50%; left: 50%; }
  [data-persona="arjun"] { top: 50%; left: 80%; }
}
```

---

## PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.0s |
| Time to Interactive | < 2.0s |
| Animation FPS | 60fps |
| Total JS Bundle | < 150kb |
| Audio Preload | Whispers only |
| Lighthouse Performance | > 90 |

**Optimizations:**
- CSS animations where possible (vs JS)
- Lazy load Three.js (if used)
- Preload only whisper audio on hover intent
- Use `will-change` sparingly
- Intersection Observer for off-screen elements

---

## IMPLEMENTATION PHASES

### Phase 1: The Void + Awakening (Day 1-2)
- [ ] Black screen
- [ ] Center point animation
- [ ] Ripple effect
- [ ] Intro voice playback

### Phase 2: The Constellation (Day 2-3)
- [ ] Orb components
- [ ] Explosion animation
- [ ] Float animations
- [ ] Positioning system

### Phase 3: Hover Interactions (Day 3-4)
- [ ] Proximity detection
- [ ] Orb scaling
- [ ] Label fade-in
- [ ] Background color bleed
- [ ] Whisper audio integration

### Phase 4: Selection + Transition (Day 4-5)
- [ ] Click handler
- [ ] Color explosion
- [ ] Screen transition
- [ ] Orb reformation

### Phase 5: Conversation Interface (Day 5-7)
- [ ] Layout build
- [ ] Active orb visualization
- [ ] Voice integration (existing WebRTC)
- [ ] Transcription display
- [ ] Prompt chips
- [ ] Persona switcher

### Phase 6: Polish (Day 7-8)
- [ ] Mobile adaptation
- [ ] Escape hatch
- [ ] Performance optimization
- [ ] Audio fine-tuning
- [ ] Browser testing

---

## BROWSER SUPPORT

- Chrome 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓
- Edge 90+ ✓
- Mobile Safari ✓
- Chrome Android ✓

**Fallbacks:**
- No WebGL → CSS-only orbs
- No Web Audio → Static (no ambient)
- No Mic Permission → Text-only demo

---

## FINAL CHECKLIST

### Assets from Abhishek:
- [ ] Logo (SVG)
- [ ] Voice API endpoints confirmed
- [ ] 12 audio files recorded (see Audio Requirements)

### CTO Build:
- [ ] Antigravity project setup
- [ ] Phase 1-6 implementation
- [ ] Voice integration
- [ ] Mobile testing
- [ ] Performance audit

### Launch:
- [ ] Staging deployment
- [ ] User testing (5 people)
- [ ] Bug fixes
- [ ] Production deployment
- [ ] Submit to Awwwards

---

**BUILD TIME ESTIMATE: 8-10 days**

**This is your blueprint. Execute.**
