import { useEffect } from 'react';

export const useCursorEffect = () => {
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
};
