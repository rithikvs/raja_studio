import React, { useRef, useState, useEffect } from 'react';

/**
 * SpotlightEffect — Mouse tracking radial spotlight effect
 * Casts a subtle warm gold and emerald aura following the cursor.
 */
export const SpotlightEffect = ({
    children,
    className = '',
    style = {},
    spotlightColor = 'rgba(217, 175, 69, 0.16)',
    spotlightSize = 350,
    ...props
}) => {
    const containerRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const touch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setIsTouch(touch || reduced);
    }, []);

    const handleMouseMove = (e) => {
        if (isTouch || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleMouseEnter = () => {
        if (!isTouch) setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={containerRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                position: 'relative',
                overflow: 'hidden',
                ...style
            }}
            {...props}
        >
            {!isTouch && (
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: 'none',
                        zIndex: 1,
                        opacity,
                        transition: 'opacity 0.3s ease',
                        background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
                    }}
                />
            )}
            <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
        </div>
    );
};

export default SpotlightEffect;
