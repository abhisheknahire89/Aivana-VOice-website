import { useRef, useEffect } from 'react';

interface UseSwipeOptions {
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    threshold?: number;
}

export function useSwipe(
    elementRef: React.RefObject<HTMLElement | null>,
    { onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeOptions
) {
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleTouchStart = (e: TouchEvent) => {
            touchStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStart.current) return;

            const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
            const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

            // Only trigger if horizontal swipe is dominant
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
                if (deltaX > 0) {
                    onSwipeRight(); // Swiped right → go to previous
                } else {
                    onSwipeLeft(); // Swiped left → go to next
                }
            }

            touchStart.current = null;
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onSwipeLeft, onSwipeRight, threshold, elementRef]);
}
