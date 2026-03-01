# 3D CIRCULAR REVOLVING CAROUSEL - COMPLETE IMPLEMENTATION

## CONCEPT OVERVIEW

Create a 3D circular carousel where 5 persona orbs are arranged in a circular arc. The center orb is largest and in focus, while side orbs progressively shrink and fade as they curve away. Scrolling/swiping rotates the entire circle, bringing a new orb to center.

```
VISUAL CONCEPT (Top-down view):

                    ┌─────┐
                    │  ●  │  ← Back (smallest, most faded)
                   /       \
                 /           \
          ┌───┐               ┌───┐
          │ ● │               │ ● │  ← Sides (medium)
          └───┘               └───┘
             \                 /
              \               /
               \             /
              ┌───────────────┐
              │               │
              │       ●       │  ← CENTER (largest, full opacity)
              │               │
              └───────────────┘

FRONT VIEW (What user sees):

     ○           ◉           ●●●           ◉           ○
   (tiny)    (medium)      (LARGE)      (medium)     (tiny)
   30%         70%          100%          70%          30%
   
   ← ← ← ← ← REVOLVES ON SCROLL/SWIPE → → → → →
```

---

## PROMPT: Complete 3D Circular Carousel

```
Create src/components/CircularCarousel/CircularCarousel.tsx

A 3D circular carousel that displays 5 persona orbs in a revolving arc formation.

=== CORE MECHANICS ===

1. CIRCULAR POSITIONING:
   - Orbs are positioned on an imaginary circle/ellipse
   - The circle is tilted toward the viewer (like a coin on a table)
   - Center position (0°) is closest to viewer and largest
   - Side positions (±72°, ±144°) curve away and get smaller

2. ROTATION:
   - Scroll/swipe rotates all orbs around the circle
   - Each orb moves to the next position
   - Animation is smooth and continuous
   - Full rotation = 360° / 5 orbs = 72° per step

3. SIZING & OPACITY:
   Position 0° (CENTER):    size = 220px, opacity = 1.0,   z-index = 50
   Position ±72° (SIDES):   size = 150px, opacity = 0.7,   z-index = 40
   Position ±144° (BACK):   size = 100px, opacity = 0.4,   z-index = 30

=== IMPLEMENTATION ===

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface Persona {
  id: string;
  name: string;
  role: string;
  color: string;
  glowColor: string;
}

interface CircularCarouselProps {
  personas: Persona[];
  onSelectPersona: (persona: Persona) => void;
}

const CircularCarousel: React.FC<CircularCarouselProps> = ({ 
  personas, 
  onSelectPersona 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const TOTAL_ORBS = personas.length; // 5
  const ANGLE_PER_ORB = 360 / TOTAL_ORBS; // 72°
  
  // Calculate position for each orb based on its offset from center
  const getOrbTransform = (index: number, currentActive: number) => {
    // Calculate how many positions away from center
    let offset = index - currentActive;
    
    // Normalize to range [-2, 2] for 5 items
    if (offset > 2) offset -= TOTAL_ORBS;
    if (offset < -2) offset += TOTAL_ORBS;
    
    // Convert offset to angle (0 = center, ±1 = sides, ±2 = back)
    const angle = offset * ANGLE_PER_ORB; // -144, -72, 0, 72, 144
    
    // Calculate X position (circular arc)
    // Center = 0, sides spread out, back items wrap around
    const radiusX = 320; // Horizontal spread
    const x = Math.sin((angle * Math.PI) / 180) * radiusX;
    
    // Calculate Z position (depth - creates 3D effect)
    const radiusZ = 150; // Depth
    const z = Math.cos((angle * Math.PI) / 180) * radiusZ - radiusZ;
    
    // Calculate size based on position
    // Center (offset 0) = largest, edges = smaller
    const absOffset = Math.abs(offset);
    let size, opacity, zIndex;
    
    if (absOffset === 0) {
      size = 220;
      opacity = 1;
      zIndex = 50;
    } else if (absOffset === 1) {
      size = 150;
      opacity = 0.7;
      zIndex = 40;
    } else {
      size = 100;
      opacity = 0.4;
      zIndex = 30;
    }
    
    // Y position (slight arc - center higher or lower)
    const y = absOffset * 10; // Slight vertical offset for depth
    
    return {
      x,
      y,
      z,
      size,
      opacity,
      zIndex,
      rotateY: angle * 0.3, // Slight rotation to face center
      isCenter: absOffset === 0,
      offset: absOffset,
    };
  };
  
  // Animate to new position
  const animateToIndex = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Normalize index
    const normalizedIndex = ((newIndex % TOTAL_ORBS) + TOTAL_ORBS) % TOTAL_ORBS;
    
    // Animate each orb
    orbRefs.current.forEach((orb, index) => {
      if (!orb) return;
      
      const transform = getOrbTransform(index, normalizedIndex);
      
      gsap.to(orb, {
        x: transform.x,
        y: transform.y,
        z: transform.z,
        scale: transform.size / 220, // Normalize to base size
        opacity: transform.opacity,
        rotateY: transform.rotateY,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          if (index === 0) setIsAnimating(false);
        },
      });
      
      // Update z-index immediately
      orb.style.zIndex = transform.zIndex.toString();
    });
    
    setActiveIndex(normalizedIndex);
  };
  
  // Navigate functions
  const goNext = () => animateToIndex(activeIndex + 1);
  const goPrev = () => animateToIndex(activeIndex - 1);
  const goToIndex = (index: number) => animateToIndex(index);
  
  // Handle wheel scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let scrollTimeout: NodeJS.Timeout;
    let accumulatedDelta = 0;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      accumulatedDelta += e.deltaY;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (Math.abs(accumulatedDelta) > 50) {
          if (accumulatedDelta > 0) {
            goNext();
          } else {
            goPrev();
          }
        }
        accumulatedDelta = 0;
      }, 50);
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [activeIndex, isAnimating]);
  
  // Handle touch swipe
  const touchStartX = useRef(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        goPrev(); // Swipe right = previous
      } else {
        goNext(); // Swipe left = next
      }
    }
  };
  
  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Enter' || e.key === ' ') {
        onSelectPersona(personas[activeIndex]);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);
  
  // Initialize positions
  useEffect(() => {
    orbRefs.current.forEach((orb, index) => {
      if (!orb) return;
      const transform = getOrbTransform(index, activeIndex);
      gsap.set(orb, {
        x: transform.x,
        y: transform.y,
        z: transform.z,
        scale: transform.size / 220,
        opacity: transform.opacity,
        rotateY: transform.rotateY,
      });
      orb.style.zIndex = transform.zIndex.toString();
    });
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] flex items-center justify-center"
      style={{ perspective: '1000px' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Container */}
      <div 
        className="relative"
        style={{ 
          transformStyle: 'preserve-3d',
          width: '700px',
          height: '300px',
        }}
      >
        {personas.map((persona, index) => {
          const transform = getOrbTransform(index, activeIndex);
          
          return (
            <div
              key={persona.id}
              ref={el => orbRefs.current[index] = el}
              className="absolute left-1/2 top-1/2 cursor-pointer"
              style={{
                width: '220px',
                height: '220px',
                marginLeft: '-110px',
                marginTop: '-110px',
                transformStyle: 'preserve-3d',
              }}
              onClick={() => {
                if (transform.isCenter) {
                  onSelectPersona(persona);
                } else {
                  goToIndex(index);
                }
              }}
            >
              <OrbWithLabel 
                persona={persona} 
                isCenter={transform.isCenter}
                size={transform.size}
              />
            </div>
          );
        })}
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3">
        {personas.map((persona, index) => (
          <button
            key={persona.id}
            onClick={() => goToIndex(index)}
            className={`rounded-full transition-all duration-300 ${
              index === activeIndex 
                ? 'w-8 h-3' 
                : 'w-3 h-3 hover:scale-125'
            }`}
            style={{
              backgroundColor: index === activeIndex 
                ? persona.color 
                : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
      
      {/* Navigation Arrows (Desktop) */}
      <button 
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hidden md:flex"
      >
        <span className="text-white text-xl">←</span>
      </button>
      <button 
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hidden md:flex"
      >
        <span className="text-white text-xl">→</span>
      </button>
    </div>
  );
};

export default CircularCarousel;
```

---

## PROMPT: Orb Component with Label

```
Create src/components/CircularCarousel/OrbWithLabel.tsx

The individual orb with persona info and "Click to talk" CTA.

interface OrbWithLabelProps {
  persona: Persona;
  isCenter: boolean;
  size: number;
}

const OrbWithLabel: React.FC<OrbWithLabelProps> = ({ persona, isCenter, size }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Orb */}
      <div 
        className="rounded-full relative transition-all duration-300"
        style={{
          width: size,
          height: size,
          background: `
            radial-gradient(
              ellipse at 30% 20%,
              ${persona.color}88 0%,
              ${persona.color}44 40%,
              ${persona.color}22 70%,
              transparent 100%
            )
          `,
          boxShadow: isCenter 
            ? `0 0 60px ${persona.glowColor}, 0 0 120px ${persona.glowColor}66`
            : `0 0 30px ${persona.glowColor}44`,
        }}
      >
        {/* Glass highlight */}
        <div 
          className="absolute top-[5%] left-[10%] w-[40%] h-[30%] rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
          }}
        />
        
        {/* Wave pattern overlay (optional) */}
        <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {[...Array(8)].map((_, i) => (
              <ellipse
                key={i}
                cx="100"
                cy={100 + i * 15}
                rx={90 - i * 5}
                ry={20}
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
      </div>
      
      {/* Label */}
      <div className={`mt-4 text-center transition-all duration-300 ${
        isCenter ? 'opacity-100' : 'opacity-60'
      }`}>
        <p className={`font-semibold text-white ${
          isCenter ? 'text-xl' : 'text-sm'
        }`}>
          {persona.name}
        </p>
        <p className={`text-white/60 ${
          isCenter ? 'text-base' : 'text-xs'
        }`}>
          {persona.role}
        </p>
      </div>
      
      {/* Click to Talk (only on center) */}
      {isCenter && (
        <div className="mt-3 flex items-center gap-2 animate-pulse">
          <span className="text-lg">🎙️</span>
          <span 
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: persona.color }}
          >
            Click to Talk
          </span>
        </div>
      )}
    </div>
  );
};

export default OrbWithLabel;
```

---

## PROMPT: Mobile Adaptation

```
Update CircularCarousel.tsx for mobile responsiveness:

=== MOBILE CHANGES ===

1. SIZING:
   - Desktop: Center = 220px, Sides = 150px, Back = 100px
   - Mobile:  Center = 160px, Sides = 100px, Back = 60px

2. RADIUS:
   - Desktop: radiusX = 320px
   - Mobile:  radiusX = 140px

3. CONTAINER:
   - Desktop: height = 500px
   - Mobile:  height = 400px

4. NAVIGATION:
   - Desktop: Arrow buttons visible, scroll enabled
   - Mobile:  Swipe only, hide arrow buttons

=== IMPLEMENTATION ===

// Add to component:
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

// Update getOrbTransform:
const getOrbTransform = (index: number, currentActive: number) => {
  // ... existing offset calculation ...
  
  // Responsive values
  const radiusX = isMobile ? 140 : 320;
  const radiusZ = isMobile ? 80 : 150;
  
  // Responsive sizing
  let size, opacity, zIndex;
  
  if (absOffset === 0) {
    size = isMobile ? 160 : 220;
    opacity = 1;
    zIndex = 50;
  } else if (absOffset === 1) {
    size = isMobile ? 100 : 150;
    opacity = 0.7;
    zIndex = 40;
  } else {
    size = isMobile ? 60 : 100;
    opacity = 0.4;
    zIndex = 30;
  }
  
  // ... rest of calculation
};

// Update container styles:
<div 
  ref={containerRef}
  className={`relative w-full flex items-center justify-center ${
    isMobile ? 'h-[400px]' : 'h-[500px]'
  }`}
  // ...
>

// Hide arrow buttons on mobile:
<button 
  onClick={goPrev}
  className="... hidden md:flex"
>
```

---

## PROMPT: Add Momentum/Inertia Scrolling

```
Add smooth momentum scrolling for a more natural feel:

// Add to component state:
const velocityRef = useRef(0);
const lastTouchX = useRef(0);
const lastTimestamp = useRef(0);
const momentumFrame = useRef<number>();

// Handle touch move for velocity tracking:
const handleTouchMove = (e: React.TouchEvent) => {
  const currentX = e.touches[0].clientX;
  const currentTime = Date.now();
  
  const deltaX = currentX - lastTouchX.current;
  const deltaTime = currentTime - lastTimestamp.current;
  
  if (deltaTime > 0) {
    velocityRef.current = deltaX / deltaTime; // pixels per ms
  }
  
  lastTouchX.current = currentX;
  lastTimestamp.current = currentTime;
};

// Handle touch end with momentum:
const handleTouchEnd = (e: React.TouchEvent) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX.current;
  const velocity = Math.abs(velocityRef.current);
  
  // Determine how many positions to move based on velocity
  let positionsToMove = 1;
  if (velocity > 0.5) positionsToMove = 2;
  if (velocity > 1.0) positionsToMove = 3;
  
  const threshold = 30;
  
  if (Math.abs(deltaX) > threshold || velocity > 0.2) {
    if (deltaX > 0) {
      animateToIndex(activeIndex - positionsToMove);
    } else {
      animateToIndex(activeIndex + positionsToMove);
    }
  }
  
  velocityRef.current = 0;
};

// Add to container:
<div
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
>
```

---

## PROMPT: Add Entrance Animation

```
Add a dramatic entrance when the carousel first appears:

// Add state:
const [hasEntered, setHasEntered] = useState(false);

// Entrance animation on mount:
useEffect(() => {
  // Start orbs from center, scaled to 0
  orbRefs.current.forEach((orb) => {
    if (!orb) return;
    gsap.set(orb, {
      x: 0,
      y: 0,
      z: 0,
      scale: 0,
      opacity: 0,
    });
  });
  
  // Animate to positions with stagger
  const tl = gsap.timeline({
    onComplete: () => setHasEntered(true),
  });
  
  orbRefs.current.forEach((orb, index) => {
    if (!orb) return;
    const transform = getOrbTransform(index, activeIndex);
    
    tl.to(orb, {
      x: transform.x,
      y: transform.y,
      z: transform.z,
      scale: transform.size / 220,
      opacity: transform.opacity,
      rotateY: transform.rotateY,
      duration: 0.8,
      ease: 'back.out(1.7)',
    }, index * 0.1); // Stagger by 0.1s
  });
}, []);
```

---

## SIZING REFERENCE TABLE

| Device | Center Orb | Side Orbs | Back Orbs | Radius X |
|--------|------------|-----------|-----------|----------|
| Desktop (1200px+) | 220px | 150px | 100px | 320px |
| Tablet (768-1199px) | 180px | 120px | 80px | 240px |
| Mobile (<768px) | 160px | 100px | 60px | 140px |

---

## FULL INTEGRATION

```
Update src/App.tsx:

import CircularCarousel from './components/CircularCarousel/CircularCarousel';

function App() {
  const handleSelectPersona = (persona: Persona) => {
    // Transition to conversation interface
    console.log('Selected:', persona.name);
    // Your existing conversation logic
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="h-full flex flex-col items-center justify-center px-4">
        {/* Headline */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-wider">
            AI Voice Bot for Intelligent Conversations
          </h1>
        </div>
        
        {/* Circular Carousel */}
        <CircularCarousel 
          personas={PERSONAS}
          onSelectPersona={handleSelectPersona}
        />
        
        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm md:text-base flex items-center justify-center gap-2">
            <span>👆</span>
            <span>Click any agent to start talking</span>
          </p>
          <p className="text-white/40 text-xs md:text-sm mt-2">
            ← Swipe or use arrow keys to revolve →
          </p>
        </div>
        
        {/* Language badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['Hindi', 'Tamil', 'Telugu', 'Marathi', '+6 more'].map(lang => (
            <span 
              key={lang} 
              className="text-xs text-white/40 px-3 py-1 border border-white/10 rounded-full"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 left-6 text-white/40 text-xs md:text-sm">
        🎧 Tip: Use earphones for best experience
      </div>
      <div className="absolute bottom-6 right-6">
        <button className="text-white/40 text-xs md:text-sm hover:text-white/60 transition">
          Prefer a traditional website? →
        </button>
      </div>
    </div>
  );
}
```

---

## INTERACTION SUMMARY

| Action | Desktop | Mobile |
|--------|---------|--------|
| Navigate | Scroll wheel, Arrow keys, Click arrows | Swipe left/right |
| Select center | Click | Tap |
| Go to specific | Click side orb | Tap side orb |
| Visual feedback | Hover glow | Touch highlight |

---

## TESTING CHECKLIST

- [ ] All 5 orbs visible at once
- [ ] Center orb is largest (220px desktop, 160px mobile)
- [ ] Side orbs progressively smaller
- [ ] Smooth rotation animation (0.6s)
- [ ] Scroll wheel rotates carousel (desktop)
- [ ] Swipe rotates carousel (mobile)
- [ ] Arrow keys work (desktop)
- [ ] Click center orb triggers conversation
- [ ] Click side orb brings it to center
- [ ] Navigation dots work
- [ ] Labels only fully visible on center + adjacent
- [ ] "Click to talk" only on center orb
- [ ] Entrance animation plays on load
- [ ] No scroll on page (overflow hidden)
- [ ] 60fps animation (check DevTools)
```