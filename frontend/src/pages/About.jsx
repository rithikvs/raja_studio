import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ShieldCheck, Heart, Award } from 'lucide-react';
import { useData } from '../context/DataContext';
import styles from './About.module.css';

const About = () => {
    const { cms } = useData();

    return (
        <div className={styles.aboutPage}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <div className="container">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        About {cms.businessName || 'RAJA STUDIO'}
                    </motion.h1>
                    <p>{cms.tagline || 'Personalized Photo Gifts & Memories'}</p>
                </div>
            </div>

            {/* Story Section */}
            <section className="section-padding">
                <div className="container">
                    <div className={styles.storyGrid}>
                        <div className={styles.storyImage} data-aos="fade-right">
                            <img src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80" alt="Raja Studio Workshop" />
                        </div>
                        <div className={styles.storyContent} data-aos="fade-left">
                            <h2 className="section-title">Crafting Your Cherished Memories</h2>
                            <p>
                                {cms.aboutStory || 'At Raja Studio & Raja Gifts, we turn your cherished photos into lasting physical memories with high-precision printing, premium framing, and handcrafted personalized gifts.'}
                            </p>
                            <p>
                                Specializing in customized wooden frames, crystal-clear acrylic photo blocks, illuminated LED frames, and personalized mugs, our mission is to ensure every gift brings a radiant smile to your loved ones.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className={styles.missionSection} data-aos="fade-up">
                <div className="container text-center">
                    <h2 className="section-title">Our Core Promise</h2>
                    <p className={styles.missionText}>
                        "{cms.aboutMission || 'To combine high-resolution studio printing with handcrafted frames, delivering personalized gifts that preserve your happiest moments with love and elegance.'}"
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <section className="section-padding" style={{ background: '#f9fafb' }}>
                <div className="container">
                    <h2 className="section-title text-center">Our Core Values</h2>
                    <p className="section-subtitle text-center">What drives us to deliver excellence</p>

                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <Camera size={48} />
                            </div>
                            <h3>Quality Craftsmanship</h3>
                            <p>Every product is crafted with attention to detail using studio-grade equipment and premium materials.</p>
                        </div>

                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <Heart size={48} />
                            </div>
                            <h3>Customer Satisfaction</h3>
                            <p>Your happiness is our priority. We ensure every order meets your expectations and delivers joy.</p>
                        </div>

                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <ShieldCheck size={48} />
                            </div>
                            <h3>Trust & Reliability</h3>
                            <p>Safe packaging, timely delivery, and quality guarantee on all our personalized products.</p>
                        </div>

                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>
                                <Award size={48} />
                            </div>
                            <h3>Innovation</h3>
                            <p>Constantly exploring new designs, materials, and techniques to bring you the best gifts.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/Process Section */}
            <section className="section-padding">
                <div className="container">
                    <h2 className="section-title text-center">How We Work</h2>
                    <p className="section-subtitle text-center">From your photo to the perfect gift</p>

                    <div className={styles.processSteps}>
                        <div className={styles.processStep}>
                            <div className={styles.stepBadge}>1</div>
                            <h3>Photo Review</h3>
                            <p>We carefully review your uploaded photos to ensure optimal print quality</p>
                        </div>

                        <div className={styles.processStep}>
                            <div className={styles.stepBadge}>2</div>
                            <h3>Professional Editing</h3>
                            <p>Our team enhances colors, adjusts brightness, and optimizes your images</p>
                        </div>

                        <div className={styles.processStep}>
                            <div className={styles.stepBadge}>3</div>
                            <h3>HD Printing</h3>
                            <p>Using studio-grade printers for vibrant, long-lasting, high-definition prints</p>
                        </div>

                        <div className={styles.processStep}>
                            <div className={styles.stepBadge}>4</div>
                            <h3>Custom Framing</h3>
                            <p>Handcrafted frames built to your specifications with premium materials</p>
                        </div>

                        <div className={styles.processStep}>
                            <div className={styles.stepBadge}>5</div>
                            <h3>Quality Check</h3>
                            <p>Final inspection to ensure every detail meets our quality standards</p>
                        </div>

                        <div className={styles.processStep}>
                            <div className={styles.stepBadge}>6</div>
                            <h3>Safe Delivery</h3>
                            <p>Multi-layer packaging ensures your gift arrives in perfect condition</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.statsSection}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>5+</div>
                            <div className={styles.statLabel}>Years of Experience</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>10,000+</div>
                            <div className={styles.statLabel}>Happy Customers</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>50,000+</div>
                            <div className={styles.statLabel}>Orders Completed</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>4.9★</div>
                            <div className={styles.statLabel}>Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
