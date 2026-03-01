import gsap from 'gsap';

export function fadeIn(element: HTMLElement, duration = 0.5) {
    return gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration, ease: 'power2.out' });
}

export function fadeOut(element: HTMLElement, duration = 0.5) {
    return gsap.to(element, { opacity: 0, duration, ease: 'power2.in' });
}

export function scaleIn(element: HTMLElement, duration = 0.6) {
    return gsap.fromTo(
        element,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration, ease: 'back.out(1.7)' }
    );
}

export function explodeOrbsFromCenter(
    orbs: HTMLElement[],
    positions: { x: string; y: string }[]
) {
    // Start all orbs at center, invisible
    gsap.set(orbs, {
        left: '50%',
        top: '50%',
        scale: 0,
        opacity: 0,
    });

    // Animate each orb to its target position with stagger
    orbs.forEach((orb, i) => {
        const pos = positions[i];
        if (!pos) return;

        gsap.to(orb, {
            left: pos.x,
            top: pos.y,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            delay: i * 0.1,
            ease: 'back.out(1.7)',
        });
    });
}

export function createColorExplosion(
    color: string,
    sourceX: number,
    sourceY: number,
    onComplete: () => void
) {
    const el = document.createElement('div');

    Object.assign(el.style, {
        position: 'fixed',
        left: `${sourceX}px`,
        top: `${sourceY}px`,
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: color,
        transform: 'translate(-50%, -50%) scale(1)',
        pointerEvents: 'none',
        zIndex: '9999',
    });

    document.body.appendChild(el);

    gsap.to(el, {
        scale: 100,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
            el.remove();
            onComplete();
        },
    });
}
