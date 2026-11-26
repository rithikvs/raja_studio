import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Volume2, VolumeX, Gift, Sparkles, Check, ArrowRight, X } from 'lucide-react';
import styles from './CameraIntro.module.css';

/**
 * Web Audio API Mechanical Camera Shutter Sound Synthesizer
 * Produces a crisp, realistic dual-click camera shutter sound without external MP3 dependencies.
 */
function playRealisticShutterSound(isMuted) {
    if (isMuted) return;
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();

        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }

        const now = ctx.currentTime;

        // 1. Mirror Flip (Low frequency mechanical movement)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(150, now);
        osc1.frequency.exponentialRampToValueAtTime(45, now + 0.05);

        gain1.gain.setValueAtTime(0.15, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.05);

        // 2. High-speed shutter curtain release (Bandpass filtered texture)
        const bufferSize = Math.floor(ctx.sampleRate * 0.07);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1900, now + 0.055);
        filter.Q.setValueAtTime(3.2, now + 0.055);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.setValueAtTime(0.18, now + 0.055);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        whiteNoise.start(now + 0.055);
        whiteNoise.stop(now + 0.12);

        // 3. Mirror Return Snap (Tactile metal click)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(850, now + 0.11);
        osc2.frequency.exponentialRampToValueAtTime(200, now + 0.17);

        gain2.gain.setValueAtTime(0.001, now);
        gain2.gain.setValueAtTime(0.12, now + 0.11);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.11);
        osc2.stop(now + 0.17);
    } catch {
        // Silently skip if audio context is blocked by browser policy
    }
}

const CameraIntro = ({ onFinish }) => {
    const [animationPhase, setAnimationPhase] = useState('focusing'); // 'focusing' | 'locked' | 'snap' | 'complete'
    const [isMuted, setIsMuted] = useState(false);
    const [flashActive, setFlashActive] = useState(false);
    const [timecode, setTimecode] = useState('00:00:01:14');

    // Prevent background scrolling while intro is active
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Timecode simulation
    useEffect(() => {
        const timer = setInterval(() => {
            const frames = Math.floor(Math.random() * 30).toString().padStart(2, '0');
            setTimecode(`00:00:01:${frames}`);
        }, 120);
        return () => clearInterval(timer);
    }, []);

    // Animation timeline orchestrator
    useEffect(() => {
        // Phase 1: Focusing (0ms to 850ms)
        const t1 = setTimeout(() => {
            // Phase 2: Autofocus Lock (850ms)
            setAnimationPhase('locked');
        }, 850);

        // Phase 3: Shutter Snap + Flash (2000ms)
        const t2 = setTimeout(() => {
            setAnimationPhase('snap');
            setFlashActive(true);
            playRealisticShutterSound(isMuted);
            setTimeout(() => setFlashActive(false), 380);
        }, 2000);

        // Phase 4: Complete and smoothly reveal site (2700ms)
        const t3 = setTimeout(() => {
            setAnimationPhase('complete');
            if (onFinish) onFinish();
        }, 2750);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [isMuted, onFinish]);

    const handleSkip = () => {
        playRealisticShutterSound(isMuted);
        setAnimationPhase('complete');
        if (onFinish) onFinish();
    };

    if (animationPhase === 'complete') {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div 
                className={styles.introOverlay}
                initial={{ opacity: 1 }}
                animate={{ 
                    opacity: animationPhase === 'snap' ? 0.9 : 1,
                    scale: animationPhase === 'snap' ? 1.08 : 1
                }}
                exit={{ opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Background Textures */}
                <div className={styles.filmGrain} />
                <div className={styles.anamorphicStreak} />

                {/* Viewfinder Rule of Thirds Grid */}
                <div className={styles.gridOverlay}>
                    <div className={styles.gridLineH1} />
                    <div className={styles.gridLineH2} />
                    <div className={styles.gridLineV1} />
                    <div className={styles.gridLineV2} />
                </div>

                {/* Viewfinder Corner Framing Brackets */}
                <div className={styles.cornerBrackets}>
                    <div className={styles.cornerTL} />
                    <div className={styles.cornerTR} />
                    <div className={styles.cornerBL} />
                    <div className={styles.cornerBR} />
                </div>

                {/* Camera Viewfinder HUD */}
                <motion.div 
                    className={styles.viewfinderHud}
                    animate={{
                        opacity: animationPhase === 'snap' ? 0 : 1
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Top Bar */}
                    <div className={styles.hudTopBar}>
                        <div className={styles.recIndicator}>
                            <span className={styles.recDot} />
                            <span>REC • {timecode}</span>
                        </div>
                        <div className={styles.hudModelName}>
                            STUDIO CINE 50mm f/1.2 • GOLD EDITION
                        </div>
                        <div className={styles.hudBatteryFormat}>
                            <span>[▮▮▮▮] 98%</span>
                            <span>4K UHD 60P</span>
                        </div>
                    </div>

                    {/* Center Autofocus Reticle */}
                    <div className={styles.centerReticle}>
                        <motion.div 
                            className={`${styles.afBox} ${animationPhase === 'locked' || animationPhase === 'snap' ? styles.afBoxLocked : ''}`}
                            animate={{
                                scale: animationPhase === 'focusing' ? [1.2, 0.95, 1] : 1,
                                borderColor: animationPhase === 'locked' || animationPhase === 'snap' ? '#10b981' : '#F5C542'
                            }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                        >
                            <svg className={styles.afCrosshair} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="9" />
                                <line x1="12" y1="15" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="9" y2="12" />
                                <line x1="15" y1="12" x2="19" y2="12" />
                            </svg>
                        </motion.div>

                        <div className={`${styles.afLabel} ${animationPhase === 'locked' || animationPhase === 'snap' ? styles.afLabelLocked : ''}`}>
                            {animationPhase === 'focusing' ? 'SEARCHING AF...' : '[ AF-LOCKED 0.85m ]'}
                        </div>
                    </div>

                    {/* Bottom Exposure Bar */}
                    <div className={styles.hudBottomBar}>
                        <div className={styles.exposureStats}>
                            <span>ISO <strong>100</strong></span>
                            <span>SHUTTER <strong>1/250s</strong></span>
                            <span>IRIS <strong>f/1.2</strong></span>
                            <span>EXP <strong>+0.3 EV</strong></span>
                            <span>WB <strong>5600K GOLD</strong></span>
                        </div>
                        <div className={styles.brandSignature}>
                            STUDIO GIFT SHOP • LUXURY ATELIER
                        </div>
                    </div>
                </motion.div>

                {/* Central Optical Lens Assembly */}
                <motion.div 
                    className={styles.lensAssemblyContainer}
                    initial={{ scale: 0.9, filter: 'blur(8px)' }}
                    animate={{ 
                        scale: animationPhase === 'snap' ? 1.35 : 1,
                        filter: animationPhase === 'focusing' ? 'blur(6px)' : 'blur(0px)'
                    }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Outer Machined Metal Barrel */}
                    <div className={styles.lensBarrelOuter}>
                        {/* Rotating Aperture Scale Ring */}
                        <div className={styles.apertureScaleRing} />

                        {/* Glass Element Layer */}
                        <div className={styles.lensGlassElement}>
                            <div className={styles.glassReflection} />

                            {/* Center Brand In Focus */}
                            <motion.div 
                                className={styles.brandRevealBox}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ 
                                    opacity: animationPhase === 'focusing' ? 0.6 : 1, 
                                    y: 0,
                                    scale: animationPhase === 'locked' ? 1.05 : 1
                                }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className={styles.luxuryCrestIcon}>
                                    <Gift size={32} />
                                </div>
                                <h1 className={styles.brandTitle}>
                                    STUDIO <span>GIFT SHOP</span>
                                </h1>
                                <p className={styles.brandSubtext}>
                                    Luxury Boutique Gifting
                                </p>
                            </motion.div>
                        </div>

                        {/* Mechanical Aperture Iris Blades Overlay */}
                        <svg className={styles.apertureSvg} viewBox="0 0 400 400">
                            <motion.circle 
                                cx="200" 
                                cy="200" 
                                r="140"
                                fill="none"
                                stroke="url(#goldGradient)"
                                strokeWidth="2.5"
                                strokeDasharray="6 4"
                            />
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#F5C542" />
                                    <stop offset="50%" stopColor="#D4AF37" />
                                    <stop offset="100%" stopColor="#FFFDF5" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </motion.div>

                {/* Shutter Golden Flash Burst */}
                {flashActive && (
                    <motion.div 
                        className={styles.shutterFlash}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    />
                )}

                {/* Top/Bottom Controls: Sound Toggle & Skip */}
                <div className={styles.controlsRow}>
                    <button 
                        type="button" 
                        onClick={() => setIsMuted(!isMuted)} 
                        className={styles.audioToggleBtn}
                        title={isMuted ? 'Turn Sound On' : 'Mute Shutter Sound'}
                        aria-label="Toggle camera sound"
                    >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>

                    <button 
                        type="button" 
                        onClick={handleSkip} 
                        className={styles.skipBtn}
                    >
                        Skip Intro <ArrowRight size={14} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CameraIntro;
