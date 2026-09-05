import React from 'react';
import { useLocation } from 'react-router-dom';
import { HelpCircle, ShieldCheck, FileText, Truck, RefreshCw } from 'lucide-react';
import styles from './PolicyPages.module.css';

export const FAQPage = () => (
    <div className={styles.policyPage}>
        <div className={styles.header}>
            <div className="container">
                <h1><HelpCircle size={28} /> Frequently Asked Questions</h1>
            </div>
        </div>
        <div className="container section-padding">
            <div className={styles.policyContent}>
                <div className={styles.faqItem}>
                    <h3>Q: How do I upload my photo for customization?</h3>
                    <p>A: Simply open any product, select your frame size and options, then click the "Upload Original High-Res Photo" button before adding to cart.</p>
                </div>
                <div className={styles.faqItem}>
                    <h3>Q: Will I see a preview of my framed photo?</h3>
                    <p>A: Yes! Our interactive frame visualizer renders your photo live inside your chosen frame color and design.</p>
                </div>
                <div className={styles.faqItem}>
                    <h3>Q: How long does production and delivery take?</h3>
                    <p>A: Standard photo editing and framing takes 24-48 hours. Shipping usually takes 2-5 business days across India.</p>
                </div>
                <div className={styles.faqItem}>
                    <h3>Q: What if my uploaded photo quality is low?</h3>
                    <p>A: Our live quality checker alerts you immediately if the photo resolution is below optimal print standards.</p>
                </div>
            </div>
        </div>
    </div>
);

export const ShippingPage = () => (
    <div className={styles.policyPage}>
        <div className={styles.header}>
            <div className="container">
                <h1><Truck size={28} /> Shipping & Delivery Policy</h1>
            </div>
        </div>
        <div className="container section-padding">
            <div className={styles.policyContent}>
                <p>At <strong>Raja Studio & Raja Gifts</strong>, we ensure safe and express shipping for all handcrafted photo frames, acrylic gifts, and custom mugs.</p>
                <h3>1. Packaging & Protection</h3>
                <p>All frames are protected using multi-layer bubble wrap, foam corner protectors, and corrugated boxes to prevent glass breakage or scratches.</p>
                <h3>2. Shipping Partners & Timelines</h3>
                <p>We partner with leading couriers (Bluedart, DTDC, Delhivery). Delivery usually takes 2 to 5 business days after order confirmation.</p>
                <h3>3. Free Shipping Threshold</h3>
                <p>Orders above ₹999 qualify for FREE doorstep delivery across India.</p>
            </div>
        </div>
    </div>
);

export const ReturnsPage = () => (
    <div className={styles.policyPage}>
        <div className={styles.header}>
            <div className="container">
                <h1><RefreshCw size={28} /> Return & Cancellation Policy</h1>
            </div>
        </div>
        <div className="container section-padding">
            <div className={styles.policyContent}>
                <h3>1. Personalized Products Policy</h3>
                <p>Because all gifts are custom-printed with your uploaded photos and text, orders cannot be returned once photo printing has commenced.</p>
                <h3>2. Damage or Defect Replacement</h3>
                <p>If your frame arrives damaged or with printing errors, please share an unboxing video/photo on WhatsApp within 48 hours for an instant free replacement.</p>
                <h3>3. Order Cancellation</h3>
                <p>You may cancel your order within 2 hours of placement before photo processing begins.</p>
            </div>
        </div>
    </div>
);

export const PrivacyPage = () => (
    <div className={styles.policyPage}>
        <div className={styles.header}>
            <div className="container">
                <h1><ShieldCheck size={28} /> Privacy Policy</h1>
            </div>
        </div>
        <div className="container section-padding">
            <div className={styles.policyContent}>
                <p>Your photo privacy and personal details are of utmost importance to <strong>Raja Studio</strong>.</p>
                <h3>1. Photo Data Protection</h3>
                <p>Customer photos uploaded for customized gifts are strictly confidential and used solely for production. Photos are never shared publicly or used in promotional material without explicit written consent.</p>
                <h3>2. Account & Payment Data</h3>
                <p>Your address, phone number, and account information are stored securely and never sold to third parties.</p>
            </div>
        </div>
    </div>
);

export const TermsPage = () => (
    <div className={styles.policyPage}>
        <div className={styles.header}>
            <div className="container">
                <h1><FileText size={28} /> Terms & Conditions</h1>
            </div>
        </div>
        <div className="container section-padding">
            <div className={styles.policyContent}>
                <p>By using the <strong>Raja Studio & Raja Gifts</strong> website, you agree to comply with our terms of service regarding order placement, photo copyright, and customer account responsibilities.</p>
            </div>
        </div>
    </div>
);
