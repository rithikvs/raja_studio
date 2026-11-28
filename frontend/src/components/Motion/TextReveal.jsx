import React from 'react';
import { motion } from 'framer-motion';

/**
 * TextReveal — High-end editorial headline word reveal
 * Masks words and animates them upwards with smooth spring easing.
 */
export const TextReveal = ({
    text,
    className = '',
    goldWords = [],
    delay = 0,
    stagger = 0.045,
    tag: Tag = 'h2',
    style = {},
    ...props
}) => {
    if (!text || typeof text !== 'string') {
        return <Tag className={className} style={style} {...props}>{text}</Tag>;
    }

    const words = text.split(' ');

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: stagger,
                delayChildren: delay
            }
        }
    };

    const wordVariants = {
        hidden: {
            y: '100%',
            opacity: 0
        },
        visible: {
            y: '0%',
            opacity: 1,
            transition: {
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <Tag className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.28em', ...style }} {...props}>
            <motion.span
                style={{ display: 'contents' }}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {words.map((word, i) => {
                    const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').toLowerCase();
                    const isGold = goldWords.some(gw => gw.toLowerCase() === cleanWord);

                    return (
                        <span
                            key={i}
                            style={{
                                display: 'inline-block',
                                overflow: 'hidden',
                                verticalAlign: 'bottom',
                                lineHeight: '1.25'
                            }}
                        >
                            <motion.span
                                variants={wordVariants}
                                style={{
                                    display: 'inline-block',
                                    color: isGold ? 'var(--color-champagne-gold)' : undefined,
                                    textShadow: isGold ? '0 2px 14px rgba(217, 175, 69, 0.3)' : undefined
                                }}
                            >
                                {word}
                            </motion.span>
                        </span>
                    );
                })}
            </motion.span>
        </Tag>
    );
};

export default TextReveal;
