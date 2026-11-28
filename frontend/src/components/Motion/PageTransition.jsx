import React from 'react';
import { motion } from 'framer-motion';

/**
 * PageTransition — Soft luxurious route transition wrapper
 */
export const PageTransition = ({ children, className = '', style = {} }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
                duration: 0.38,
                ease: [0.16, 1, 0.3, 1]
            }}
            style={{ width: '100%', ...style }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
