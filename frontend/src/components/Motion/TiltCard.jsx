import React, { useRef, useState, useEffect } from 'react';

/**
 * TiltCard — Lightweight 3D perspective tilt effect
 * Uses CSS transforms with dampening for silky smooth movement and specular reflection.
 * Automatically disabled on touch / mobile devices and prefers-reduced-motion.
 */
export const TiltCard = ({
    children,
    className = '',
    style = {},
    maxTilt = 10,
    perspective = 1000,
    scale = 1.02,
    glare = true,
    ...props
}) => {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setIsTouchDevice(isTouch || prefersReduced);
    }, []);

    const handleMouseMove = (e) => {
        if (isTouchDevice || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate rotation angles
        const rotateY = ((mouseX / width) - 0.5) * (maxTilt * 2);
        const rotateX = -((mouseY / height) - 0.5) * (maxTilt * 2);

        setTransform(
            `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
        );

        if (glare) {
            setGlareStyle({
                opacity: 0.15,
                x: (mouseX / width) * 100,
                y: (mouseY / height) * 100
            });
        }
    };

    const handleMouseEnter = () => {
        if (!isTouchDevice) setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
        setGlareStyle(prev => ({ ...prev, opacity: 0 }));
    };

    return (
        <div
            ref={cardRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                ...style,
                transform: isTouchDevice ? 'none' : transform,
                transition: isHovered
                    ? 'transform 0.08s ease-out'
                    : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d',
                willChange: isHovered ? 'transform' : 'auto',
                position: 'relative',
                overflow: 'hidden'
            }}
            {...props}
        >
            {children}
            {glare && !isTouchDevice && (
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: 'none',
                        zIndex: 2,
                        opacity: glareStyle.opacity,
                        transition: 'opacity 0.4s ease',
                        background: `radial-gradient(circle 240px at ${glareStyle.x}% ${glareStyle.y}%, rgba(217, 175, 69, 0.35), transparent 80%)`
                    }}
                />
            )}
        </div>
    );
};

export default TiltCard;
