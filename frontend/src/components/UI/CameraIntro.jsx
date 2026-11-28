import React, { useEffect, useState, useRef } from 'react';
import './CameraIntro.css';

/**
 * Web Audio API Mechanical Camera Shutter Sound Synthesizer
 * Produces an authentic dual-click mechanical camera shutter snap in sync with the iris blades.
 */
function playRealisticShutterSound() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
        const now = ctx.currentTime;

        // 1. Mechanical Aperture blade squeeze
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(160, now);
        osc1.frequency.exponentialRampToValueAtTime(40, now + 0.04);
        gain1.gain.setValueAtTime(0.14, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.04);

        // 2. High-speed shutter curtain release (Bandpass white noise texture)
        const bufferSize = Math.floor(ctx.sampleRate * 0.06);
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2100, now + 0.04);
        filter.Q.setValueAtTime(3.0, now + 0.04);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.setValueAtTime(0.18, now + 0.04);
        noiseGain.exponentialRampToValueAtTime(0.001, now + 0.10);
        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        whiteNoise.start(now + 0.04);
        whiteNoise.stop(now + 0.10);

        // 3. Crisp mechanical click snap
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(950, now + 0.09);
        osc2.frequency.exponentialRampToValueAtTime(220, now + 0.14);
        gain2.gain.setValueAtTime(0.001, now);
        gain2.gain.setValueAtTime(0.12, now + 0.09);
        gain2.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.09);
        osc2.stop(now + 0.14);
    } catch {
        // Silently skip if audio context is blocked by browser policy
    }
}

const CameraIntro = ({ onFinish }) => {
    const [visible, setVisible] = useState(true);
    const [hasClicked, setHasClicked] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const triggeredRef = useRef(false);

    const triggerClickAndOpen = () => {
        if (triggeredRef.current) return;
        triggeredRef.current = true;

        // 1. Shutter click mechanical snap + audio
        setHasClicked(true);
        playRealisticShutterSound();

        // 2. Mild photographic light flash
        setShowFlash(true);

        // 3. Dissolve overlay to reveal website
        setTimeout(() => {
            setIsExiting(true);
        }, 220);

        // 4. Fully unmount intro
        setTimeout(() => {
            setVisible(false);
            if (onFinish) onFinish();
        }, 620);
    };

    useEffect(() => {
        const seen = "raja-studio-intro-v1";
        try {
            // Check if page was reloaded by user (F5 / Refresh)
            const navEntries = window.performance?.getEntriesByType?.('navigation');
            const isReload = navEntries && navEntries[0] && navEntries[0].type === 'reload';

            if (isReload) {
                sessionStorage.removeItem(seen);
            }

            if (sessionStorage.getItem(seen)) {
                setVisible(false);
                if (onFinish) onFinish();
                return;
            }
            sessionStorage.setItem(seen, "1");
        } catch {
            // Keep the intro available when browser storage is disabled.
        }

        // Auto-trigger camera click + mild flash at 750ms
        const autoClickTimer = setTimeout(() => {
            triggerClickAndOpen();
        }, 750);

        return () => {
            clearTimeout(autoClickTimer);
        };
    }, [onFinish]);

    if (!visible) return null;

    return (
        <div 
            id="raja-intro" 
            className={`${hasClicked ? 'rs-clicked' : ''} ${isExiting ? 'rs-exiting' : ''}`}
            aria-hidden="true"
            onClick={triggerClickAndOpen}
        >
            {showFlash && <div className="rs-mild-flash" />}
            <div className="rs-stage">
                <div className={`rs-camera ${hasClicked ? 'rs-snap' : ''}`}>
                    <div className="rs-lens">
                        <div className="rs-iris">
                            {[0, 60, 120, 180, 240, 300].map((deg) => (
                                <div key={deg} className="rs-blade" style={{ '--turn': `${deg}deg` }} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="rs-name">
                    RAJA <span>STUDIO</span>
                </div>
            </div>
        </div>
    );
};

export default CameraIntro;
