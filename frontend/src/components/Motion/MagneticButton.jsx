import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * MagneticButton — Subtle magnetic attraction towards cursor
 * Draws buttons slightly toward the cursor on hover with silky spring physics.
 * Automatically disabled on touch screens and prefers-reduced-motion.
 */
export const MagneticButton = ({
    children,
    className = '',
    strength = 0.28,
    style = {},
    onClick,
    ...props
}) => {
    const btnRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const touch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setIsTouch(touch || reduced);
    }, []);

    const handleMouseMove = (e) => {
        if (isTouch || !btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = (e.clientX - centerX) * strength;
        const distanceY = (e.clientY - centerY) * strength;

        setPosition({ x: distanceX, y: distanceY });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    if (isTouch) {
        return (
            <div className={className} style={style} onClick={onClick} {...props}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={btnRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, mass: 0.2 }}
            style={{ display: 'inline-block', ...style }}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default MagneticButton;
