import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { TiltCard, SpotlightEffect } from '../Motion';
import styles from './EquipmentShowcase.module.css';

const EquipmentShowcase = ({ equipmentList = [], onEnquireEquipment }) => {
    return (
        <section className={styles.equipmentSection}>
            <div className="container">
                {/* Section Header */}
                <div className={styles.sectionHeader}>
                    <div className={styles.eyebrow}>
                        <Cpu size={15} className={styles.goldIcon} />
                        <span>HARDWARE &amp; OPTICS</span>
                    </div>
                    <h2 className={styles.sectionTitle}>
                        Our Equipment &amp; <span className={styles.goldAccent}>Production Technology</span>
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        Precision flatbed beds, laser optical cutters, wide-format pigment engines, and 4K cinema gear maintained to the highest standards.
                    </p>
                </div>

                {/* Equipment Grid */}
                <div className={styles.equipmentGrid}>
                    {equipmentList.map((item, idx) => (
                        <TiltCard 
                            key={item.id || idx}
                            className={styles.equipCard}
                            maxTilt={4}
                            glareOpacity={0.12}
                            scale={1.01}
                        >
                            <SpotlightEffect color="rgba(217, 175, 69, 0.12)" radius={240}>
                                <div className={styles.equipCardInner}>
                                    {/* Photo Preview */}
                                    <div className={styles.photoContainer}>
                                        <img 
                                            src={item.photoUrl} 
                                            alt={item.name} 
                                            className={styles.equipPhoto}
                                            loading="lazy"
                                        />
                                        <div className={styles.photoOverlay} />
                                        <span className={styles.categoryBadge}>{item.category}</span>
                                    </div>

                                    {/* Details */}
                                    <div className={styles.equipBody}>
                                        <h3 className={styles.equipName}>{item.name}</h3>
                                        <p className={styles.equipDesc}>{item.description}</p>

                                        {/* Capabilities List */}
                                        {item.capabilities && item.capabilities.length > 0 && (
                                            <div className={styles.capsWrapper}>
                                                <h4 className={styles.capsTitle}>
                                                    <ShieldCheck size={14} className={styles.shieldIcon} />
                                                    <span>Verified Capabilities</span>
                                                </h4>
                                                <ul className={styles.capsList}>
                                                    {item.capabilities.map((cap, cIdx) => (
                                                        <li key={cIdx}>
                                                            <CheckCircle2 size={13} className={styles.checkIcon} />
                                                            <span>{cap}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Enquiry Trigger */}
                                        <button
                                            type="button"
                                            onClick={() => onEnquireEquipment(item)}
                                            className={styles.specEnquireBtn}
                                        >
                                            <span>Enquire For This Machine</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </SpotlightEffect>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EquipmentShowcase;
