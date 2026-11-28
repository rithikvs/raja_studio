import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Cpu, Film, X, Layers, Sparkles } from 'lucide-react';
import { TiltCard, SpotlightEffect } from '../Motion';
import UnifiedVideoPlayer from './UnifiedVideoPlayer';
import styles from './MachineryVideoGallery.module.css';

const FILTER_CATEGORIES = [
    { label: 'All', key: 'all' },
    { label: 'UV Printing', key: 'uv-printing' },
    { label: 'Laser Cutting', key: 'laser-cutting' },
    { label: 'Epson Printing', key: 'epson-printing' },
    { label: 'Gift Production', key: 'gifts' },
    { label: 'Laptop Servicing', key: 'laptop-repair' },
    { label: 'Live Production', key: 'live-streaming' }
];

const MachineryVideoGallery = ({ videos = [] }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeVideoModal, setActiveVideoModal] = useState(null);

    const filteredVideos = selectedCategory === 'all'
        ? videos
        : videos.filter(v => v.categoryKey === selectedCategory || v.serviceCategory?.toLowerCase().includes(selectedCategory.replace('-', ' ')));

    return (
        <section id="machinery-gallery" className={styles.gallerySection}>
            <div className="container">
                {/* Header */}
                <div className={styles.sectionHeader}>
                    <div className={styles.eyebrow}>
                        <Film size={15} className={styles.goldIcon} />
                        <span>WORKSHOP FOOTAGE</span>
                    </div>
                    <h2 className={styles.sectionTitle}>
                        Behind the Craft — <span className={styles.goldAccent}>Our Machines in Action</span>
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        Watch raw manufacturing footage, precision laser cuts, and high-definition UV ink curing direct from our studio floor.
                    </p>

                    {/* Filter Pills */}
                    <div className={styles.filterPillsContainer}>
                        {FILTER_CATEGORIES.map(cat => (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`${styles.filterPill} ${selectedCategory === cat.key ? styles.activePill : ''}`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Video Grid */}
                {filteredVideos.length > 0 ? (
                    <motion.div 
                        layout 
                        className={styles.videoGrid}
                    >
                        {filteredVideos.map((video) => (
                            <motion.div
                                key={video.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.4 }}
                            >
                                <TiltCard 
                                    className={styles.videoCard}
                                    maxTilt={5}
                                    glareOpacity={0.15}
                                    scale={1.02}
                                >
                                    <SpotlightEffect color="rgba(217, 175, 69, 0.15)" radius={240}>
                                        <div 
                                            className={styles.videoCardInner}
                                            onClick={() => setActiveVideoModal(video)}
                                        >
                                            {/* Thumbnail Container */}
                                            <div className={styles.thumbWrapper}>
                                                <img 
                                                    src={video.thumbnailUrl} 
                                                    alt={video.title} 
                                                    className={styles.thumbImage}
                                                    loading="lazy"
                                                />
                                                <div className={styles.thumbGradient} />

                                                {/* Play Button */}
                                                <div className={styles.playCenterAura}>
                                                    <div className={styles.playButton}>
                                                        <Play size={22} fill="currentColor" style={{ marginLeft: 2 }} />
                                                    </div>
                                                </div>

                                                {/* Category & Duration Badges */}
                                                <div className={styles.topBadge}>
                                                    <span>{video.serviceCategory}</span>
                                                </div>

                                                {video.duration && (
                                                    <div className={styles.durationBadge}>
                                                        <Clock size={12} />
                                                        <span>{video.duration}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Card Details */}
                                            <div className={styles.cardInfo}>
                                                <h3 className={styles.videoTitle}>{video.title}</h3>
                                                <p className={styles.videoDesc}>{video.description}</p>
                                                
                                                {video.equipmentName && (
                                                    <div className={styles.equipmentMeta}>
                                                        <Cpu size={14} className={styles.goldIcon} />
                                                        <span>{video.equipmentName}</span>
                                                    </div>
                                                )}

                                                <div className={styles.watchPrompt}>
                                                    <span>Watch Demonstration</span>
                                                    <Play size={14} fill="currentColor" />
                                                </div>
                                            </div>
                                        </div>
                                    </SpotlightEffect>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    /* Empty State */
                    <div className={styles.emptyState}>
                        <Layers size={48} className={styles.emptyIcon} />
                        <h3>No Demonstration Footage In This Category</h3>
                        <p>We are currently uploading new machinery footage. Check back shortly or contact our team for live workshop samples.</p>
                        <button 
                            type="button" 
                            onClick={() => setSelectedCategory('all')}
                            className={styles.resetFilterBtn}
                        >
                            View All Videos
                        </button>
                    </div>
                )}
            </div>

            {/* Video Modal Player */}
            <AnimatePresence>
                {activeVideoModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalBackdrop}
                        onClick={() => setActiveVideoModal(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className={styles.modalDialog}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className={styles.modalHeader}>
                                <div>
                                    <span className={styles.modalCategoryBadge}>{activeVideoModal.serviceCategory}</span>
                                    <h3 className={styles.modalTitle}>{activeVideoModal.title}</h3>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setActiveVideoModal(null)}
                                    className={styles.modalCloseBtn}
                                    aria-label="Close video player"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Player Wrapper */}
                            <div className={styles.modalPlayerWrapper}>
                                <UnifiedVideoPlayer
                                    videoUrl={activeVideoModal.videoUrl}
                                    thumbnailUrl={activeVideoModal.thumbnailUrl}
                                    title={activeVideoModal.title}
                                    autoplay={true}
                                    controls={true}
                                />
                            </div>

                            {/* Modal Description */}
                            <div className={styles.modalFooter}>
                                <p className={styles.modalDesc}>{activeVideoModal.description}</p>
                                {activeVideoModal.equipmentName && (
                                    <div className={styles.modalTechTag}>
                                        <Cpu size={14} color="#D9AF45" />
                                        <span>Technology: {activeVideoModal.equipmentName}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default MachineryVideoGallery;
