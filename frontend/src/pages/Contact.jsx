import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import styles from './Contact.module.css';
import Button from '../components/UI/Button';

const Contact = () => {
    const { cms } = useData();

    return (
        <div className={styles.contactPage}>
            <div className={styles.pageHeader}>
                <div className="container">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        Contact {cms.businessName || 'RAJA STUDIO'}
                    </motion.h1>
                    <p>Have questions about your custom photo order? Reach out to us!</p>
                </div>
            </div>

            <section className="section-padding">
                <div className="container">
                    <div className={styles.contactGrid}>
                        {/* Info Column */}
                        <motion.div
                            className={styles.infoColumn}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2>Get in Touch with Our Studio</h2>
                            <p className={styles.introText}>
                                We are here to help you customize the perfect gift. Contact us via Phone, Email, or WhatsApp!
                            </p>

                            <div className={styles.infoItem}>
                                <div className={styles.iconBox}><Phone size={24} /></div>
                                <div>
                                    <h3>Phone / Customer Support</h3>
                                    <p>{cms.phone || '+91 98765 43210'}</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.iconBox}><Mail size={24} /></div>
                                <div>
                                    <h3>Email Address</h3>
                                    <p>{cms.email || 'contact@rajastudio.com'}</p>
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <div className={styles.iconBox}><MapPin size={24} /></div>
                                <div>
                                    <h3>Studio Address</h3>
                                    <p>{cms.address || 'Raja Studio, Main Road, City Center, Tamil Nadu, India'}</p>
                                </div>
                            </div>

                            <div className={styles.socialLinks}>
                                <h3>Follow Our Creations</h3>
                                <div className={styles.socialIcons}>
                                    {cms.instagram && (
                                        <a href={cms.instagram} className={styles.socialBtn} target="_blank" rel="noopener noreferrer">
                                            <Instagram size={20} />
                                        </a>
                                    )}
                                    {cms.facebook && (
                                        <a href={cms.facebook} className={styles.socialBtn} target="_blank" rel="noopener noreferrer">
                                            <Facebook size={20} />
                                        </a>
                                    )}
                                    {cms.youtube && (
                                        <a href={cms.youtube} className={styles.socialBtn} target="_blank" rel="noopener noreferrer">
                                            <Youtube size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* WhatsApp Direct Chat Box */}
                        <div className={styles.chatBox}>
                            <h2>Fast WhatsApp Inquiry</h2>
                            <p>Send us your photo customization queries or order ID directly on WhatsApp for instant assistance.</p>
                            <Button
                                variant="primary"
                                href={`https://wa.me/${cms.whatsapp || '919876543210'}?text=Hello%20Raja%20Studio,%20I%20have%20an%20inquiry%20regarding%20personalized%20gifts.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                            >
                                <MessageCircle size={20} /> Chat on WhatsApp Now
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
