import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Printer, Sparkles, Package, Truck, ShieldCheck, Heart, Palette } from 'lucide-react';
import { useData } from '../context/DataContext';
import styles from './Services.module.css';

const Services = () => {
    const { cms } = useData();

    const services = [
        {
            icon: <Camera size={48} />,
            title: 'Photo Printing',
            description: 'High-resolution HD photo printing on premium quality paper with vivid colors and sharp details.',
            features: ['Studio-grade printing', 'Multiple paper types', 'UV resistant', 'Long-lasting prints']
        },
        {
            icon: <Palette size={48} />,
            title: 'Custom Framing',
            description: 'Handcrafted wooden and synthetic frames in various sizes, colors, and finishes.',
            features: ['Wooden frames', 'Acrylic frames', 'Multiple colors', 'Custom sizes']
        },
        {
            icon: <Sparkles size={48} />,
            title: 'Photo Customization',
            description: 'Add custom text, apply filters, and enhance your photos before printing.',
            features: ['Text engraving', 'Photo editing', 'Color correction', 'Background removal']
        },
        {
            icon: <Heart size={48} />,
            title: 'Gift Packaging',
            description: 'Premium gift wrapping and packaging services for special occasions.',
            features: ['Gift wrapping', 'Greeting cards', 'Custom messages', 'Bulk orders']
        },
        {
            icon: <Printer size={48} />,
            title: 'Bulk Orders',
            description: 'Special pricing and services for corporate orders, events, and bulk printing.',
            features: ['Corporate gifts', 'Event photography', 'Bulk discounts', 'Priority processing']
        },
        {
            icon: <Package size={48} />,
            title: 'Photo Restoration',
            description: 'Restore and enhance old damaged photos with our professional editing services.',
            features: ['Damage repair', 'Color restoration', 'Scratch removal', 'Digital archiving']
        }
    ];

    const process = [
        {
            step: '01',
            title: 'Choose Service',
            description: 'Select the service you need from our catalog'
        },
        {
            step: '02',
            title: 'Upload Photos',
            description: 'Upload your high-resolution photos securely'
        },
        {
            step: '03',
            title: 'Customize',
            description: 'Select options like size, frame, finish, and text'
        },
        {
            step: '04',
            title: 'Review & Order',
            description: 'Review your customization and place your order'
        },
        {
            step: '05',
            title: 'Production',
            description: 'We print, frame, and pack your order carefully'
        },
        {
            step: '06',
            title: 'Delivery',
            description: 'Fast doorstep delivery with tracking'
        }
    ];

    return (
        <div className={styles.servicesPage}>
            {/* Hero Section */}
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1>Our Services</h1>
                    <p>Professional photo printing, framing, and customization services</p>
                </div>
            </div>

            {/* Services Grid */}
            <section className="section-padding">
                <div className="container">
                    <h2 className="section-title text-center">What We Offer</h2>
                    <p className="section-subtitle text-center">
                        Complete photo customization and personalized gift creation services
                    </p>

                    <div className={styles.servicesGrid}>
                        {services.map((service, idx) => (
                            <div key={idx} className={styles.serviceCard}>
                                <div className={styles.iconWrapper}>
                                    {service.icon}
                                </div>
                                <h3>{service.title}</h3>
                                <p className={styles.description}>{service.description}</p>
                                <ul className={styles.featuresList}>
                                    {service.features.map((feature, i) => (
                                        <li key={i}>✓ {feature}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="section-padding" style={{ background: '#f9fafb' }}>
                <div className="container">
                    <h2 className="section-title text-center">How It Works</h2>
                    <p className="section-subtitle text-center">
                        Simple 6-step process from order to delivery
                    </p>

                    <div className={styles.processGrid}>
                        {process.map((item, idx) => (
                            <div key={idx} className={styles.processStep}>
                                <div className={styles.stepNumber}>{item.step}</div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding">
                <div className="container">
                    <h2 className="section-title text-center">Why Choose Us</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.feature}>
                            <Truck size={40} color="#B76E79" />
                            <h3>Fast Delivery</h3>
                            <p>Express shipping available for urgent orders with safe packaging</p>
                        </div>
                        <div className={styles.feature}>
                            <ShieldCheck size={40} color="#B76E79" />
                            <h3>Quality Guarantee</h3>
                            <p>100% satisfaction guaranteed or full refund on defective products</p>
                        </div>
                        <div className={styles.feature}>
                            <Sparkles size={40} color="#B76E79" />
                            <h3>HD Printing</h3>
                            <p>Studio-grade printers ensure vibrant colors and sharp details</p>
                        </div>
                        <div className={styles.feature}>
                            <Heart size={40} color="#B76E79" />
                            <h3>Affordable Pricing</h3>
                            <p>Competitive prices with special discounts on bulk orders</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container text-center">
                    <h2>Ready to Get Started?</h2>
                    <p>Browse our products and start creating your personalized gifts today</p>
                    <div className={styles.ctaButtons}>
                        <Link to="/shop" className={styles.primaryBtn}>
                            Browse Products
                        </Link>
                        <Link to="/contact" className={styles.secondaryBtn}>
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
