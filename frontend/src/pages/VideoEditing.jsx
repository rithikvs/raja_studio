import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Film, Play, Pause, Volume2, VolumeX, Sparkles, Clock, 
    CheckCircle2, ArrowRight, Video, Scissors, Wand2, Music2, 
    Layers, MonitorPlay, MessageSquare, PhoneCall, Star, X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { SafeVideo } from '../utils/videoStorage';
import styles from './VideoEditing.module.css';

const VideoEditing = () => {
    const { cms, videoSamples = [] } = useData();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeVideoModal, setActiveVideoModal] = useState(null);
    const [inquiryData, setInquiryData] = useState({
        name: '',
        phone: '',
        videoType: 'Wedding & Teasers',
        duration: '1-3 Minutes',
        notes: ''
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Dynamic Categories from available samples
    const categories = [
        'All',
        ...new Set([
            'Wedding & Teasers',
            'Birthday & Celebrations',
            'Gift Reveals & Unboxing',
            'Social Media Reels',
            'Brand Promos',
            ...videoSamples.map(v => v.category).filter(Boolean)
        ])
    ];

    const filteredSamples = selectedCategory === 'All'
        ? videoSamples
        : videoSamples.filter(v => v.category === selectedCategory);

    // Pricing Packages
    const packages = [
        {
            name: 'Viral Social Reel',
            tag: 'Most Popular',
            price: '₹499',
            duration: 'Up to 60 Seconds',
            features: [
                'Optimized for 9:16 Instagram Reels / YouTube Shorts',
                'Beat-synced cuts with trending music',
                'Engaging animated subtitles & captions',
                'Smooth transitions & sound effects (SFX)',
                '1 Free Revision cycle',
                'Delivery in 24 - 48 Hours'
            ],
            color: 'var(--color-emerald-deep)'
        },
        {
            name: 'Cinematic Story Teaser',
            tag: 'Recommended',
            price: '₹1,499',
            duration: '2 to 4 Minutes',
            features: [
                'Full 4K UHD 60 FPS Master Export',
                'Hollywood-grade LUT color grading',
                'Emotional storytelling narrative flow',
                'Advanced audio mixing & speech clarity cleanup',
                'Custom animated titles & lower thirds',
                '3 Revision cycles included',
                'Delivery in 48 - 72 Hours'
            ],
            color: 'var(--color-champagne-gold)',
            featured: true
        },
        {
            name: 'Full Event Masterpiece',
            tag: 'Luxury Boutique',
            price: '₹2,999',
            duration: 'Full Event / Unlimited',
            features: [
                'Multi-camera angle synchronization',
                'Full event documentary or comprehensive highlight',
                'Comprehensive speech audio cleanup & sound design',
                'Drone & b-roll enhancement',
                'Raw project file archive upon request',
                'Unlimited revisions until delighted',
                'Priority VIP support & fast turnaround'
            ],
            color: 'var(--color-forest-green)'
        }
    ];

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        // Pre-fill WhatsApp message
        const msg = `Hi Studio Gift Shop, I would like to book a Video Editing Project!%0A- Name: ${encodeURIComponent(inquiryData.name)}%0A- Phone: ${encodeURIComponent(inquiryData.phone)}%0A- Type: ${encodeURIComponent(inquiryData.videoType)}%0A- Duration: ${encodeURIComponent(inquiryData.duration)}%0A- Notes: ${encodeURIComponent(inquiryData.notes)}`;
        const whatsappNumber = cms.phone?.replace(/[^0-9]/g, '') || '917708552461';
        window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    };

    return (
        <div className={styles.videoPage}>
            {/* 1. EDITORIAL HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={`container ${styles.heroContainer}`}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroBadge}>
                            <Sparkles size={16} className={styles.goldSparkle} />
                            <span>STUDIO CINEMATIC ATELIER</span>
                        </div>
                        <h1 className={styles.heroTitle}>
                            Transforming Moments into <span className={styles.goldText}>Cinematic Masterpieces</span>
                        </h1>
                        <p className={styles.heroDescription}>
                            From royal wedding highlights and heartfelt birthday tributes to viral boutique reels and luxury gift reveals. Our professional video editors turn your raw footage into unforgettable visual stories.
                        </p>
                        
                        <div className={styles.heroActions}>
                            <a href="#samples" className={styles.primaryBtn}>
                                <Film size={18} />
                                <span>Watch Sample Videos</span>
                            </a>
                            <a href="#inquiry" className={styles.secondaryBtn}>
                                <Scissors size={18} />
                                <span>Book Video Project</span>
                            </a>
                        </div>

                        {/* Quick Trust Metrics */}
                        <div className={styles.trustStrip}>
                            <div className={styles.trustItem}>
                                <strong>500+</strong>
                                <span>Films Edited</span>
                            </div>
                            <div className={styles.trustDivider} />
                            <div className={styles.trustItem}>
                                <strong>4K UHD</strong>
                                <span>Mastered Delivery</span>
                            </div>
                            <div className={styles.trustDivider} />
                            <div className={styles.trustItem}>
                                <strong>24 - 48h</strong>
                                <span>Fast Turnaround</span>
                            </div>
                            <div className={styles.trustDivider} />
                            <div className={styles.trustItem}>
                                <strong>4.9★</strong>
                                <span>Client Rating</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.heroVisual}>
                        <div className={styles.videoPlayerCard}>
                            <div className={styles.videoPoster}>
                                <img 
                                    src={cms.videoHeroImage || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80"} 
                                    alt="Video Editing Suite" 
                                />
                                <div className={styles.playPulse} onClick={() => setActiveVideoModal(videoSamples[0])}>
                                    <Play size={28} className={styles.pulseIcon} />
                                </div>
                                <span className={styles.liveTag}>WATCH REEL SHOWREEL</span>
                            </div>
                            <div className={styles.cardFooter}>
                                <div>
                                    <h4>Studio Cinematic Showreel 2026</h4>
                                    <p>Featuring color grading, beat sync & motion sound</p>
                                </div>
                                <span className={styles.badge4K}>4K HDR</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. SAMPLES SHOWCASE SECTION */}
            <section id="samples" className={styles.samplesSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionKicker}>PORTFOLIO SHOWCASE</span>
                        <h2 className={styles.sectionTitle}>Explore Sample Video Edits</h2>
                        <p className={styles.sectionSubtitle}>
                            Click on any sample video below to experience our color grading, sound design, transitions, and pacing.
                        </p>
                    </div>

                    {/* Filter Category Pills */}
                    <div className={styles.categoryTabs}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`${styles.categoryTab} ${selectedCategory === cat ? styles.activeTab : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Video Cards Grid */}
                    <div className={styles.videoGrid}>
                        {filteredSamples.map((sample) => (
                            <motion.div
                                key={sample.id}
                                className={styles.sampleCard}
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div 
                                    className={styles.cardThumbnailWrapper}
                                    onClick={() => setActiveVideoModal(sample)}
                                >
                                    <img src={sample.thumbnail} alt={sample.title} className={sample.aspect.includes('9:16') ? styles.verticalImg : styles.cardThumbnail} />
                                    <div className={styles.thumbnailOverlay}>
                                        <div className={styles.playButtonCircle}>
                                            <Play size={24} className={styles.playGlyph} />
                                        </div>
                                    </div>
                                    <span className={styles.durationPill}>
                                        <Clock size={12} /> {sample.duration}
                                    </span>
                                    <span className={styles.aspectPill}>
                                        {sample.aspect}
                                    </span>
                                </div>

                                <div className={styles.sampleInfo}>
                                    <div className={styles.sampleHeaderRow}>
                                        <span className={styles.sampleCategoryBadge}>{sample.category}</span>
                                        <span className={styles.sampleResBadge}>{sample.resolution}</span>
                                    </div>

                                    <h3 className={styles.sampleTitle}>{sample.title}</h3>
                                    <p className={styles.sampleDesc}>{sample.description}</p>

                                    <div className={styles.toolsRow}>
                                        {sample.tools.map((t, idx) => (
                                            <span key={idx} className={styles.toolTag}>#{t}</span>
                                        ))}
                                    </div>

                                    <div className={styles.sampleActions}>
                                        <button 
                                            className={styles.playBtnAction}
                                            onClick={() => setActiveVideoModal(sample)}
                                        >
                                            <Play size={16} /> Watch Sample
                                        </button>
                                        <a 
                                            href="#inquiry" 
                                            className={styles.requestSimilarBtn}
                                            onClick={() => setInquiryData({ ...inquiryData, videoType: sample.category })}
                                        >
                                            Order Similar Style
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. CAPABILITIES / WHAT WE DO */}
            <section className={styles.capabilitiesSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionKicker}>OUR CRAFT</span>
                        <h2 className={styles.sectionTitle}>Why Our Video Editing Stands Out</h2>
                        <p className={styles.sectionSubtitle}>
                            Every project undergoes rigorous post-production to ensure high emotion, cinematic beauty, and social virality.
                        </p>
                    </div>

                    <div className={styles.featureGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <Wand2 size={28} />
                            </div>
                            <h3>Hollywood Color Grading</h3>
                            <p>Rich film emulation, vibrant skin-tone perfection, and customized cinematic LUTs tailored to your celebration atmosphere.</p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <Music2 size={28} />
                            </div>
                            <h3>Immersive Sound Design</h3>
                            <p>Layered foley sound effects, ambient environmental tracks, speech cleanup, and licensed royalty-free background music.</p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <Scissors size={28} />
                            </div>
                            <h3>Rhythmic Beat Synchronization</h3>
                            <p>Dynamic cuts synchronized to music beats with seamless speed ramping, whip pans, and gentle emotional dissolves.</p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>
                                <MonitorPlay size={28} />
                            </div>
                            <h3>Animated Kinetic Typography</h3>
                            <p>Handcrafted title animations, heartfelt message overlays, lower thirds, and modern subtitles tailored for Instagram and TikTok.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. PRICING PACKAGES */}
            <section className={styles.pricingSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionKicker}>TRANSPARENT RATES</span>
                        <h2 className={styles.sectionTitle}>Simple, Value-Packed Editing Packages</h2>
                        <p className={styles.sectionSubtitle}>
                            Select the ideal tier for your reels, celebrations, or family milestones.
                        </p>
                    </div>

                    <div className={styles.pricingGrid}>
                        {packages.map((pkg, idx) => (
                            <div 
                                key={idx} 
                                className={`${styles.pricingCard} ${pkg.featured ? styles.featuredPricing : ''}`}
                            >
                                {pkg.tag && (
                                    <span className={styles.packageTag}>{pkg.tag}</span>
                                )}
                                <h3 className={styles.packageName}>{pkg.name}</h3>
                                <div className={styles.priceContainer}>
                                    <span className={styles.priceVal}>{pkg.price}</span>
                                    <span className={styles.priceDuration}>/ project</span>
                                </div>
                                <p className={styles.durationNote}>{pkg.duration}</p>

                                <ul className={styles.featureList}>
                                    {pkg.features.map((feat, fIdx) => (
                                        <li key={fIdx}>
                                            <CheckCircle2 size={16} className={styles.checkIcon} />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={`https://wa.me/${cms.phone?.replace(/[^0-9]/g, '') || '917708552461'}?text=${encodeURIComponent(`Hi Studio Gift Shop, I would like to book the "${pkg.name}" (${pkg.price}) Video Editing package.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${styles.selectPackageBtn} ${pkg.featured ? styles.featuredBtn : ''}`}
                                >
                                    <span>Choose {pkg.name}</span>
                                    <ArrowRight size={16} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. PROJECT INQUIRY FORM */}
            <section id="inquiry" className={styles.inquirySection}>
                <div className="container">
                    <div className={styles.inquiryBox}>
                        <div className={styles.inquiryText}>
                            <span className={styles.inquiryKicker}>START YOUR PROJECT</span>
                            <h2>Have Footage to Edit? Let's Create Magic.</h2>
                            <p>
                                Tell us about your video requirements, event type, and timeline. Our lead video editor will review your project and get back to you immediately via WhatsApp or phone.
                            </p>

                            <div className={styles.directContactRow}>
                                <div className={styles.directContactItem}>
                                    <PhoneCall size={20} className={styles.goldText} />
                                    <div>
                                        <span>Direct Helpline</span>
                                        <strong>{cms.phone || '+91 77085 52461'}</strong>
                                    </div>
                                </div>
                                <div className={styles.directContactItem}>
                                    <MessageSquare size={20} className={styles.goldText} />
                                    <div>
                                        <span>Instant WhatsApp</span>
                                        <strong>Available 24/7</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleFormSubmit} className={styles.inquiryForm}>
                            <h3>Submit Video Editing Request</h3>

                            <div className={styles.formGroup}>
                                <label>Your Full Name *</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. Rahul Sharma"
                                    value={inquiryData.name}
                                    onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>WhatsApp / Phone Number *</label>
                                <input 
                                    type="tel" 
                                    required 
                                    placeholder="e.g. +91 98765 43210"
                                    value={inquiryData.phone}
                                    onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Video Type</label>
                                    <select
                                        value={inquiryData.videoType}
                                        onChange={(e) => setInquiryData({ ...inquiryData, videoType: e.target.value })}
                                    >
                                        <option>Wedding & Teasers</option>
                                        <option>Birthday & Celebrations</option>
                                        <option>Gift Reveals & Unboxing</option>
                                        <option>Social Media Reels</option>
                                        <option>Brand Promos</option>
                                        <option>Other Custom Video</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Estimated Length</label>
                                    <select
                                        value={inquiryData.duration}
                                        onChange={(e) => setInquiryData({ ...inquiryData, duration: e.target.value })}
                                    >
                                        <option>30 - 60 Seconds (Reel)</option>
                                        <option>1 - 3 Minutes (Highlight)</option>
                                        <option>5 - 10 Minutes (Full Story)</option>
                                        <option>15+ Minutes (Full Event)</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Project Details / Google Drive Link (Optional)</label>
                                <textarea 
                                    rows="3" 
                                    placeholder="Describe your vision, music preferences, or paste a link to raw footage files..."
                                    value={inquiryData.notes}
                                    onChange={(e) => setInquiryData({ ...inquiryData, notes: e.target.value })}
                                />
                            </div>

                            <button type="submit" className={styles.submitInquiryBtn}>
                                <MessageSquare size={18} />
                                <span>Continue on WhatsApp & Send Request</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* 6. SAMPLE VIDEO PLAYBACK MODAL */}
            <AnimatePresence>
                {activeVideoModal && (
                    <div className={styles.modalBackdrop} onClick={() => setActiveVideoModal(null)}>
                        <motion.div 
                            className={styles.modalPlayerContainer}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                className={styles.closeModalBtn}
                                onClick={() => setActiveVideoModal(null)}
                                aria-label="Close video preview"
                            >
                                <X size={22} />
                            </button>

                            <div className={styles.videoPlayerWrapper}>
                                <SafeVideo
                                    src={activeVideoModal.videoUrl}
                                    controls
                                    autoPlay
                                    playsInline
                                    className={styles.activeVideoElement}
                                    poster={activeVideoModal.thumbnail}
                                >
                                    Your browser does not support HTML5 video preview.
                                </SafeVideo>
                            </div>

                            <div className={styles.modalMetaInfo}>
                                <div className={styles.modalMetaHeader}>
                                    <div>
                                        <span className={styles.modalCat}>{activeVideoModal.category}</span>
                                        <h3 className={styles.modalTitle}>{activeVideoModal.title}</h3>
                                    </div>
                                    <span className={styles.modalBadge}>{activeVideoModal.resolution}</span>
                                </div>

                                <p className={styles.modalDesc}>{activeVideoModal.description}</p>

                                <div className={styles.modalFooterActions}>
                                    <div className={styles.modalTags}>
                                        {activeVideoModal.tools.map((tool, idx) => (
                                            <span key={idx} className={styles.modalToolTag}>#{tool}</span>
                                        ))}
                                    </div>
                                    <a
                                        href={`https://wa.me/${cms.phone?.replace(/[^0-9]/g, '') || '917708552461'}?text=${encodeURIComponent(`Hi Studio Gift Shop, I loved your sample video "${activeVideoModal.title}". I would like to create something similar!`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.modalBookBtn}
                                    >
                                        <Scissors size={16} /> Book This Editing Style
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VideoEditing;