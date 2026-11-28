import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Sparkles, ShieldCheck, Clock, Award, Phone, MessageSquare, 
    Layers, ArrowRight, ExternalLink, Cpu, CheckCircle2 
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { PageTransition, StaggerReveal, StaggerItem, AnimatedSection } from '../components/Motion';
import ServicesHero from '../components/Services/ServicesHero';
import ServiceCategoryCard from '../components/Services/ServiceCategoryCard';
import MachineryVideoGallery from '../components/Services/MachineryVideoGallery';
import EquipmentShowcase from '../components/Services/EquipmentShowcase';
import ServiceEnquiryModal from '../components/Services/ServiceEnquiryModal';
import { INITIAL_SERVICES, INITIAL_MACHINERY_VIDEOS, INITIAL_EQUIPMENT } from '../components/Services/servicesData';
import styles from './Services.module.css';

const Services = () => {
    const { cms, services: ctxServices, machineryVideos: ctxVideos, equipment: ctxEquipment } = useData();

    // Live data from MongoDB API with instant verified fallback
    const servicesList = (ctxServices && ctxServices.length > 0) ? ctxServices : INITIAL_SERVICES;
    const machineryVideos = (ctxVideos && ctxVideos.length > 0) ? ctxVideos : INITIAL_MACHINERY_VIDEOS;
    const equipmentList = (ctxEquipment && ctxEquipment.length > 0) ? ctxEquipment : INITIAL_EQUIPMENT;

    // Modal state
    const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
    const [selectedServiceForEnquiry, setSelectedServiceForEnquiry] = useState(null);

    const handleOpenEnquiry = (service = null) => {
        setSelectedServiceForEnquiry(service);
        setEnquiryModalOpen(true);
    };

    const handleWatchVideo = (service) => {
        // Smooth scroll to machinery video gallery
        const gallery = document.getElementById('machinery-gallery');
        if (gallery) {
            gallery.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToCategories = () => {
        const el = document.getElementById('services-categories');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToGallery = () => {
        const el = document.getElementById('machinery-gallery');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <PageTransition>
            <div className={styles.servicesPageWrapper}>
                {/* 1. CINEMATIC HERO SECTION */}
                <ServicesHero 
                    onOpenEnquiry={handleOpenEnquiry}
                    onExploreClick={scrollToCategories}
                    onWatchWorkClick={scrollToGallery}
                />

                {/* 2. CORE SERVICE CATEGORIES SECTION */}
                <section id="services-categories" className={styles.categoriesSection}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <div className={styles.eyebrowBadge}>
                                <Sparkles size={14} className={styles.goldIcon} />
                                <span>COMPREHENSIVE CAPABILITIES</span>
                            </div>
                            <h2 className={styles.sectionHeading}>
                                Specialized Production &amp; <span className={styles.goldText}>Creative Services</span>
                            </h2>
                            <p className={styles.sectionSubtext}>
                                Every discipline is executed in-house with dedicated industrial machinery, certified technicians, and museum-grade quality standards.
                            </p>
                        </div>

                        {/* Responsive Services Grid */}
                        <div className={styles.servicesGrid}>
                            {servicesList.map((service, index) => (
                                <motion.div 
                                    key={service.id || index}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <ServiceCategoryCard
                                        service={service}
                                        onEnquire={handleOpenEnquiry}
                                        onWatchVideo={handleWatchVideo}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. MACHINERY IN ACTION — FEATURED VIDEO GALLERY */}
                <MachineryVideoGallery videos={machineryVideos} />

                {/* 4. HARDWARE & EQUIPMENT SHOWCASE */}
                <EquipmentShowcase 
                    equipmentList={equipmentList}
                    onEnquireEquipment={(eq) => handleOpenEnquiry({ title: `${eq.name} (${eq.category})`, enquiryType: 'printing' })}
                />

                {/* 5. STUDIO PILLARS OF EXCELLENCE */}
                <section className={styles.pillarsSection}>
                    <div className="container">
                        <div className={styles.pillarsGrid}>
                            <div className={styles.pillarCard}>
                                <div className={styles.pillarIcon}>
                                    <Cpu size={32} />
                                </div>
                                <h3>Direct Workshop Control</h3>
                                <p>We don't outsource. All UV printing, laser profiling, and fine-art framing take place on our own shop floor in Rajapalayam.</p>
                            </div>

                            <div className={styles.pillarCard}>
                                <div className={styles.pillarIcon}>
                                    <Award size={32} />
                                </div>
                                <h3>Archival Grade Materials</h3>
                                <p>Genuine UV LED pigments, fade-proof Epson inks, and optical cast acrylic guaranteed to retain color fidelity for years.</p>
                            </div>

                            <div className={styles.pillarCard}>
                                <div className={styles.pillarIcon}>
                                    <Clock size={32} />
                                </div>
                                <h3>Prompt Turnaround</h3>
                                <p>From single prototype personalized gifts to bulk corporate batches and weekend event coverages, we honor your schedules.</p>
                            </div>

                            <div className={styles.pillarCard}>
                                <div className={styles.pillarIcon}>
                                    <ShieldCheck size={32} />
                                </div>
                                <h3>Consultative Service</h3>
                                <p>Unsure whether your artwork needs UV curing or laser engraving? Our technical artisans advise you on the optimal finish.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. CALL TO ACTION BANNER */}
                <section className={styles.ctaBannerSection}>
                    <div className="container">
                        <div className={styles.ctaBannerBox}>
                            <div className={styles.ctaContent}>
                                <span className={styles.ctaEyebrow}>START YOUR PROJECT TODAY</span>
                                <h2>Have a Custom Design or Special Event in Mind?</h2>
                                <p>Talk directly with our fabrication engineers and cinematographers to receive an accurate timeline and estimate.</p>
                                
                                <div className={styles.ctaButtonsGroup}>
                                    <button 
                                        type="button" 
                                        onClick={() => handleOpenEnquiry(null)}
                                        className={styles.ctaPrimaryBtn}
                                    >
                                        <span>Request a Custom Quote</span>
                                        <ArrowRight size={18} />
                                    </button>
                                    <a 
                                        href="https://wa.me/917708552461?text=Hello%20Raja%20Studios,%20I%20would%20like%20to%20enquire%20about%20your%20services."
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.ctaWhatsAppBtn}
                                    >
                                        <MessageSquare size={18} />
                                        <span>Chat on WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contextual Enquiry Modal */}
                <ServiceEnquiryModal
                    isOpen={enquiryModalOpen}
                    onClose={() => setEnquiryModalOpen(false)}
                    selectedService={selectedServiceForEnquiry}
                />
            </div>
        </PageTransition>
    );
};

export default Services;
