import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import styles from './WhatsAppFloat.module.css';

const WhatsAppFloat = () => {
    return (
        <motion.a
            href="https://wa.me/919629741825"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.floatBtn}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
        >
            <MessageCircle size={32} />
            <span className={styles.tooltip}>Chat with us</span>
        </motion.a>
    );
};

export default WhatsAppFloat;
