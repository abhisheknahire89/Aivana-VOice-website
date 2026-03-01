import { useEffect, useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import './styles/globals.css';
import { usePhase } from './hooks/usePhase';
import { useAudio } from './hooks/useAudio';
import type { Persona } from './data/personas';
import { getPersonaById } from './data/personas';
import CenterPoint from './components/CenterPoint/CenterPoint';
import RippleManager from './components/Ripple/index';
import Constellation from './components/Constellation/Constellation';
import CircularCarousel from './components/CircularCarousel/CircularCarousel';
import ConversationInterface from './components/ConversationInterface/index';
import EscapeHatch from './components/EscapeHatch/index';
import GuidanceLayer from './components/GuidanceLayer/GuidanceLayer';
import Recruitment from './components/Recruitment/Recruitment';
import Benefits from './components/Benefits/Benefits';
import Laboratory from './components/Laboratory/Laboratory';
import Navbar from './components/Navbar/Navbar';
import AmbientParticleField from './components/AmbientField/AmbientParticleField';

function App() {
  const {
    currentPhase,
    selectedPersona,
    selectPersona,
    goBack,
    startExperience,
    goToRecruitment,
    goToProtocols,
    goToLaboratory,
    exitToInterface
  } = usePhase();
  const { isReady, preloadCritical, playIntroVoice, playPromptVoice } = useAudio();
  const loadingRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);

  const [hoveredPersona, setHoveredPersona] = useState<Persona | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState<{ x: number, y: number } | null>(null);

  // Magnetic cursor state
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    preloadCritical();
  }, [preloadCritical]);

  // Fade-out loading → void
  useEffect(() => {
    if (isReady && currentPhase === 'loading') {
      const el = loadingRef.current;
      if (el) {
        gsap.to(el, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => startExperience(),
        });
      } else {
        startExperience();
      }
    }
  }, [isReady, currentPhase, startExperience]);

  // Intro voice — 3s into awakening
  useEffect(() => {
    if (currentPhase === 'awakening') {
      const t = setTimeout(() => playIntroVoice(), 3000);
      return () => clearTimeout(t);
    }
  }, [currentPhase, playIntroVoice]);

  // Prompt voice — 6s into constellation
  useEffect(() => {
    if (currentPhase === 'constellation') {
      const t = setTimeout(() => playPromptVoice(), 6000);
      return () => clearTimeout(t);
    }
  }, [currentPhase, playPromptVoice]);

  // Hero GSAP reveal when carousel mounts
  useEffect(() => {
    if (currentPhase === 'interactive') {
      if (heroCopyRef.current) {
        gsap.fromTo(
          heroCopyRef.current.querySelectorAll('.gsap-reveal'),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.15, ease: 'expo.out', delay: 0.2 }
        );
      }
    }
  }, [currentPhase]);

  // Premium magnetic cursor
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let cx = 0, cy = 0;

    const animateCursor = () => {
      const cursor = cursorRef.current;
      const inner = cursorInnerRef.current;
      if (cursor && inner) {
        cx = lerp(cx, mousePos.current.x, 0.12);
        cy = lerp(cy, mousePos.current.y, 0.12);
        cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
        inner.style.transform = `translate(${mousePos.current.x - 3}px, ${mousePos.current.y - 3}px)`;
      }
      raf = requestAnimationFrame(animateCursor);
    };
    raf = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleSelectPersona = useCallback((persona: Persona) => selectPersona(persona), [selectPersona]);
  const handleSwitchPersona = useCallback((id: string) => {
    const p = getPersonaById(id);
    if (p) selectPersona(p);
  }, [selectPersona]);
  const handleHoverPersona = useCallback((persona: Persona | null, position: { x: number, y: number } | null) => {
    setHoveredPersona(persona);
    setHoveredPosition(position);
  }, []);
  const handleBookDemo = useCallback(() => {
    window.open('https://calendly.com/', '_blank');
  }, []);

  const isVoid = currentPhase === 'void';
  const isLoading = currentPhase === 'loading';
  const showAwakeningContent =
    currentPhase === 'awakening' ||
    currentPhase === 'constellation' ||
    currentPhase === 'interactive' ||
    currentPhase === 'conversation' ||
    currentPhase === 'protocols' ||
    currentPhase === 'laboratory';

  const showConstellation = currentPhase === 'constellation';
  const showCarousel = currentPhase === 'interactive';
  const showConversation = currentPhase === 'conversation' && selectedPersona !== null;
  const showRecruitment = currentPhase === 'recruitment';
  const showProtocols = currentPhase === 'protocols';
  const showLaboratory = currentPhase === 'laboratory';
  const showParticles = !isLoading && !isVoid;

  return (
    <div className={`h-screen w-screen bg-black overflow-hidden relative ${isVoid || isLoading ? 'cursor-none' : ''}`}>
      {/* Custom cursor - desktop only */}
      <div
        ref={cursorRef}
        className="hidden md:block fixed top-0 left-0 z-[999] pointer-events-none"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.15)',
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease',
          willChange: 'transform',
        }}
      />
      <div
        ref={cursorInnerRef}
        className="hidden md:block fixed top-0 left-0 z-[999] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.8)',
          willChange: 'transform',
        }}
      />

      {/* Ambient particle field */}
      {showParticles && <AmbientParticleField count={50} />}

      {/* Persistent Navbar */}
      <Navbar
        onBookDemo={handleBookDemo}
        onRecruitment={goToRecruitment}
        onProtocols={goToProtocols}
        onLaboratory={goToLaboratory}
        onInterface={exitToInterface}
      />

      {/* Loading */}
      {isLoading && (
        <div
          ref={loadingRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-8"
        >
          {/* Animated logo mark */}
          <div className="relative">
            <div
              className="w-12 h-12 rounded-full border border-white/10"
              style={{
                animation: 'spin 3s linear infinite',
                background: 'conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.3) 100%)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <p className="text-white/15 text-[10px] tracking-[0.5em] uppercase font-light">
            initialising
          </p>
        </div>
      )}

      {/* Awakening visuals */}
      {showAwakeningContent && !showConversation && (
        <>
          <CenterPoint />
          <RippleManager />
        </>
      )}

      {/* Constellation phase */}
      {showConstellation && (
        <Constellation
          currentPhase={currentPhase}
          onSelectPersona={handleSelectPersona}
          onHoverPersona={handleHoverPersona}
        />
      )}

      {/* Interactive carousel */}
      {showCarousel && (
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
          {/* Hero copy */}
          <div ref={heroCopyRef} className="text-center mb-10 md:mb-16 px-6 pt-10 md:pt-14">
            <div className="gsap-reveal mb-3">
              <span
                className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-light"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Dimension Zero · AI Personnel
              </span>
            </div>
            <h1
              className="gsap-reveal text-[clamp(2.8rem,7vw,6.5rem)] font-bold text-white tracking-[-0.03em] mb-4 leading-[0.9]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Your AI<br />
              <span style={{
                background: 'linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.45) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Team Is Ready
              </span>
            </h1>
            <p className="gsap-reveal text-sm md:text-base text-white/20 font-light max-w-md mx-auto tracking-wide">
              Five voice-first AI agents. Waiting to be activated.
            </p>
          </div>

          {/* Carousel */}
          <div className="w-full flex-1 flex items-center justify-center overflow-visible px-4">
            <CircularCarousel onSelectPersona={handleSelectPersona} />
          </div>
        </div>
      )}

      {/* Guidance overlays */}
      <GuidanceLayer
        phase={currentPhase}
        hoveredPersona={hoveredPersona}
        hoveredPosition={hoveredPosition}
        onBookDemo={handleBookDemo}
      />

      {/* Conversation */}
      {showConversation && selectedPersona && (
        <ConversationInterface
          persona={selectedPersona}
          onBack={goBack}
          onSwitchPersona={handleSwitchPersona}
        />
      )}

      {/* Full-screen sections */}
      {showRecruitment && (
        <div className="absolute inset-0 z-[60] overflow-y-auto bg-black">
          <Recruitment onBack={exitToInterface} />
        </div>
      )}
      {showProtocols && (
        <div className="absolute inset-0 z-[60] overflow-y-auto bg-black">
          <Benefits onBack={exitToInterface} />
        </div>
      )}
      {showLaboratory && (
        <div className="absolute inset-0 z-[60] overflow-y-auto bg-black">
          <Laboratory onBack={exitToInterface} />
        </div>
      )}

      {/* Bottom tip */}
      {!showConversation && !isLoading && !isVoid && !showRecruitment && !showProtocols && !showLaboratory && (
        <div className="absolute bottom-8 left-8 text-white/20 text-[9px] md:text-[10px] tracking-[0.35em] uppercase hidden md:block z-40 font-light">
          🎧 Use earphones for best experience
        </div>
      )}

      <EscapeHatch show={currentPhase === 'interactive'} />
    </div>
  );
}

export default App;
