import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Play, ExternalLink, Cpu } from 'lucide-react';
import { TiltCard, SpotlightEffect, MagneticButton } from '../Motion';
import styles from './ServiceCategoryCard.module.css';

const ServiceCategoryCard = ({ service, onEnquire, onWatchVideo }) => {
    const hasVideo = Boolean(service.videoUrl);
    const hasExternalLink = Boolean(service.externalRoute);

    return (
        <TiltCard 
            className={styles.cardWrapper}
            maxTilt={6}
            glareOpacity={0.12}
            scale={1.01}
        >
            <SpotlightEffect color="rgba(217, 175, 69, 0.16)" radius={280}>
                <div className={styles.cardInner}>
                    {/* Visual Media Header */}
                    <div className={styles.mediaContainer}>
                        <img 
                            src={service.coverImage || service.videoThumbnail} 
                            alt={service.title}
                            className={styles.coverImage}
                            loading="lazy"
                        />
                        <div className={styles.mediaOverlay} />

                        {/* Top Category Badge */}
                        <div className={styles.topBadgeRow}>
                            <span className={styles.categoryBadge}>{service.category}</span>
                            {service.badge && (
                                <span className={styles.accentBadge}>{service.badge}</span>
                            )}
                        </div>

                        {/* Video Play Button Overlay if Video is Available */}
                        {hasVideo && (
                            <button
                                type="button"
                                onClick={() => onWatchVideo(service)}
                                className={styles.playFloatingBtn}
                                aria-label={`Watch ${service.title} in action`}
                            >
                                <Play size={20} fill="currentColor" style={{ marginLeft: 2 }} />
                                <span>Watch Machine</span>
                            </button>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className={styles.contentBody}>
                        <h3 className={styles.serviceTitle}>{service.title}</h3>
                        <p className={styles.tagline}>{service.tagline}</p>
                        <p className={styles.description}>{service.description}</p>

                        {/* Equipment Tag */}
                        {service.equipmentName && (
                            <div className={styles.equipmentRow}>
                                <Cpu size={15} className={styles.equipmentIcon} />
                                <span className={styles.equipmentText}>
                                    <strong>Technology:</strong> {service.equipmentName}
                                </span>
                            </div>
                        )}

                        {/* Key Features Bullet List */}
                        {service.features && service.features.length > 0 && (
                            <ul className={styles.featuresList}>
                                {service.features.map((feature, idx) => (
                                    <li key={idx}>
                                        <CheckCircle2 size={15} className={styles.checkIcon} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Action Buttons */}
                        <div className={styles.cardActions}>
                            <MagneticButton
                                onClick={() => onEnquire(service)}
                                className={styles.enquireBtn}
                                strength={0.15}
                            >
                                <span>{service.actionLabel || 'Enquire Now'}</span>
                                <ArrowRight size={16} />
                            </MagneticButton>

                            {hasExternalLink ? (
                                <Link 
                                    to={service.externalRoute} 
                                    className={styles.secondaryActionBtn}
                                >
                                    <span>Explore Page</span>
                                    <ExternalLink size={14} />
                                </Link>
                            ) : hasVideo ? (
                                <button
                                    type="button"
                                    onClick={() => onWatchVideo(service)}
                                    className={styles.secondaryActionBtn}
                                >
                                    <Play size={14} fill="currentColor" />
                                    <span>Watch Video</span>
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </SpotlightEffect>
        </TiltCard>
    );
};

export default ServiceCategoryCard;
