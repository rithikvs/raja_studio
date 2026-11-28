import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedSection — Scroll-triggered section entrance with luxury badge & heading reveal
 */
export const AnimatedSection = ({
    children,
    className = '',
    delay = 0,
    yOffset = 30,
    style = {},
    ...props
}) => {
    return (
        <motion.section
            className={className}
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
                duration: 0.75,
                delay,
                ease: [0.16, 1, 0.3, 1]
            }}
            style={style}
            {...props}
        >
            {children}
        </motion.section>
    );
};

export default AnimatedSection;
