import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, FileText, ChevronDown } from 'lucide-react';
import { MagneticButton } from '../Motion';
import styles from './ServicesHero.module.css';

const ServicesHero = ({ onOpenEnquiry, onExploreClick, onWatchWorkClick }) => {
    return (
        <section className={styles.heroSection}>
            {/* Ambient Background Glow Orbs */}
            <div className={styles.ambientAura} />
            <div className={styles.ambientAuraSecondary} />

            <div className={`container ${styles.heroContainer}`}>
                <div className={styles.heroContent}>
                    {/* Top Studio Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.eyebrowBadge}
                    >
                        <Sparkles size={14} className={styles.sparkleIcon} />
                        <span>PRECISION CRAFTSMANSHIP &amp; PRODUCTION</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.heroHeadline}
                    >
                        Your Vision. <br />
                        <span className={styles.goldGradientText}>Our Technology.</span> <br />
                        Endless Possibilities.
                    </motion.h1>

                    {/* Supporting Text */}
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.heroSubtitle}
                    >
                        From precision UV printing and laser fabrication to archival portrait photography, multi-camera live broadcast, and expert technical repairs — discover what Raja Studios can create for you.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.heroCtaGroup}
                    >
                        <MagneticButton 
                            onClick={onExploreClick} 
                            className={styles.primaryCta}
                            strength={0.25}
                        >
                            <span>Explore Our Services</span>
                            <ArrowRight size={18} />
                        </MagneticButton>

                        <MagneticButton 
                            onClick={onWatchWorkClick} 
                            className={styles.secondaryCta}
                            strength={0.2}
                        >
                            <Play size={16} fill="currentColor" />
                            <span>Watch Our Work</span>
                        </MagneticButton>

                        <MagneticButton 
                            onClick={() => onOpenEnquiry(null)} 
                            className={styles.outlineCta}
                            strength={0.2}
                        >
                            <FileText size={16} />
                            <span>Get a Quote</span>
                        </MagneticButton>
                    </motion.div>

                    {/* Studio Highlights Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.45 }}
                        className={styles.heroPillars}
                    >
                        <div className={styles.pillarItem}>
                            <strong>In-House Machinery</strong>
                            <span>UV, Laser &amp; Wide-Format</span>
                        </div>
                        <div className={styles.pillarDivider} />
                        <div className={styles.pillarItem}>
                            <strong>Live Broadcasting</strong>
                            <span>Multi-Cam YouTube Live</span>
                        </div>
                        <div className={styles.pillarDivider} />
                        <div className={styles.pillarItem}>
                            <strong>Customized Keepsakes</strong>
                            <span>Museum-Grade Precision</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Scroll Indicator */}
            <div className={styles.scrollDownIndicator} onClick={onExploreClick}>
                <span>Discover Services</span>
                <ChevronDown size={18} className={styles.bounceChevron} />
            </div>
        </section>
    );
};

export default ServicesHero;
