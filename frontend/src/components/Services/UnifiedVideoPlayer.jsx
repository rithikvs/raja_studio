import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import styles from './UnifiedVideoPlayer.module.css';

/**
 * Extracts YouTube Video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 */
function getYouTubeId(url) {
    if (!url || typeof url !== 'string') return null;
    const clean = url.trim();
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = clean.match(regExp);
    return match ? match[1] : null;
}

const UnifiedVideoPlayer = ({
    videoUrl,
    thumbnailUrl,
    title = 'Studio Machinery Demonstration',
    autoplay = false,
    controls = true,
    muted = false,
    loop = false,
    onEnded = () => {},
    className = ''
}) => {
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [isMuted, setIsMuted] = useState(muted);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const videoRef = useRef(null);

    const ytId = getYouTubeId(videoUrl);
    const isYouTube = Boolean(ytId);

    // Sync play state if parent controls it
    useEffect(() => {
        if (!isYouTube && videoRef.current) {
            if (autoplay) {
                videoRef.current.play().catch(() => {
                    // Autoplay prevented by browser, fallback to muted play
                    videoRef.current.muted = true;
                    setIsMuted(true);
                    videoRef.current.play().catch(() => setIsPlaying(false));
                });
            }
        }
    }, [autoplay, isYouTube]);

    const togglePlay = () => {
        if (isYouTube) return;
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    // If no video URL is provided at all
    if (!videoUrl) {
        return (
            <div className={`${styles.playerContainer} ${styles.placeholderContainer} ${className}`}>
                {thumbnailUrl && (
                    <img 
                        src={thumbnailUrl} 
                        alt={title} 
                        className={styles.posterFallback} 
                        loading="lazy" 
                    />
                )}
                <div className={styles.placeholderOverlay}>
                    <p className={styles.placeholderTitle}>{title}</p>
                    <span className={styles.placeholderBadge}>Footage Being Prepared By Admin</span>
                </div>
            </div>
        );
    }

    // Render YouTube Embed
    if (isYouTube) {
        const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`;
        return (
            <div className={`${styles.playerContainer} ${styles.youtubeRatio} ${className}`}>
                <iframe
                    src={embedUrl}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className={styles.youtubeIframe}
                    loading="lazy"
                />
            </div>
        );
    }

    // Render HTML5 Native Player (Cloudflare R2 or Local Public MP4)
    return (
        <div 
            className={`${styles.playerContainer} ${className}`}
            onClick={togglePlay}
        >
            {/* Loading Indicator */}
            {isLoading && !videoReady && (
                <div className={styles.loadingOverlay}>
                    <Loader2 size={36} className={styles.spinner} />
                    <span>Loading High-Definition Footage...</span>
                </div>
            )}

            {/* Error Notice */}
            {hasError && (
                <div className={styles.errorOverlay}>
                    <AlertCircle size={32} color="#fca5a5" />
                    <p>Unable to load media clip.</p>
                    {thumbnailUrl && <img src={thumbnailUrl} alt={title} className={styles.errorPoster} />}
                </div>
            )}

            <video
                ref={videoRef}
                src={videoUrl}
                poster={thumbnailUrl}
                preload="metadata"
                playsInline
                muted={muted}
                loop={loop}
                onLoadedData={() => {
                    setIsLoading(false);
                    setVideoReady(true);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                    setIsPlaying(false);
                    onEnded();
                }}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
                className={styles.nativeVideo}
            />

            {/* Custom Overlay Controls (Visible on hover or when paused) */}
            {controls && videoReady && !hasError && (
                <div className={`${styles.controlsOverlay} ${!isPlaying ? styles.visible : ''}`}>
                    <button 
                        type="button"
                        onClick={togglePlay}
                        className={styles.centerPlayBtn}
                        aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
                    >
                        {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
                    </button>

                    <div className={styles.bottomBar}>
                        <span className={styles.videoTitle}>{title}</span>
                        <button 
                            type="button" 
                            onClick={toggleMute} 
                            className={styles.muteBtn}
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnifiedVideoPlayer;
