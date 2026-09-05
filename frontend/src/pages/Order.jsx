import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Camera, Ruler, Send } from 'lucide-react';
import styles from './Order.module.css';
import Button from '../components/UI/Button';
import { useData } from '../context/DataContext';

const Order = () => {
    const { cms } = useData();
    const steps = [
        {
            icon: <Camera size={32} />,
            title: "1. Choose a Gift",
            description: "Browse our catalog of wooden frames, acrylic blocks, LED lights, and mugs."
        },
        {
            icon: <Ruler size={32} />,
            title: "2. Select Custom Options",
            description: "Choose your frame size, color, design, and finish."
        },
        {
            icon: <Send size={32} />,
            title: "3. Upload High-Res Photo",
            description: "Upload your original photo and check quality score live."
        },
        {
            icon: <MessageCircle size={32} />,
            title: "4. Confirm & Order",
            description: "Place your order securely for doorstep delivery."
        }
    ];

    return (
        <div className={styles.orderPage}>
            <div className={styles.pageHeader}>
                <div className="container">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        How to Order Customized Gifts
                    </motion.h1>
                </div>
            </div>

            <section className="section-padding">
                <div className="container">
                    <div className={styles.stepsContainer}>
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                className={styles.stepCard}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className={styles.stepIcon}>{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className={styles.ctaBox} data-aos="zoom-in">
                        <h2>Ready to place an order?</h2>
                        <p>Click below to chat with us directly on WhatsApp or browse our catalog online.</p>
                        <Button
                            variant="primary"
                            style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
                            href={`https://wa.me/${cms.whatsapp || '919876543210'}?text=Hello%20Raja%20Studio,%20I%20would%20like%20to%20place%20an%20order.`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MessageCircle size={20} /> Order via WhatsApp
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Order;
