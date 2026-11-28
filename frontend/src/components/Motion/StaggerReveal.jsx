import React from 'react';
import { motion } from 'framer-motion';

/**
 * StaggerReveal — Viewport-triggered staggered sequence for grids & lists
 */
export const StaggerReveal = ({
    children,
    className = '',
    staggerDuration = 0.08,
    delayChildren = 0.1,
    style = {},
    ...props
}) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDuration,
                delayChildren: delayChildren
            }
        }
    };

    return (
        <motion.div
            className={className}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            style={style}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({
    children,
    className = '',
    yOffset = 24,
    style = {},
    ...props
}) => {
    const itemVariants = {
        hidden: { opacity: 0, y: yOffset, filter: 'blur(4px)' },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <motion.div className={className} variants={itemVariants} style={style} {...props}>
            {children}
        </motion.div>
    );
};

export default StaggerReveal;
