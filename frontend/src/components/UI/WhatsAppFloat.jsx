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
            className={styles.floatBtnWrapper}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className={styles.iconCircle}>
                <MessageCircle size={24} fill="#ffffff" color="#25D366" />
            </div>
            <span className={styles.pillText}>Contact us</span>
        </motion.a>
    );
};

export default WhatsAppFloat;
