import React from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';

const Button = ({ children, onClick, variant = 'primary', className = '', href, ...props }) => {
    const Component = href ? motion.a : motion.button;

    return (
        <Component
            href={href}
            className={`${styles.btn} ${styles[variant]} ${className}`}
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Button;
