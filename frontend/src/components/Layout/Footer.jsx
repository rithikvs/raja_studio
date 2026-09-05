import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone, Facebook, Youtube } from 'lucide-react';
import { useData } from '../../context/DataContext';
import styles from './Footer.module.css';

const Footer = () => {
    const { cms } = useData();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>

                {/* Brand Section */}
                <div className={styles.brandSection}>
                    <h2 className={styles.logo}>{cms.businessName || 'RAJA STUDIO'}</h2>
                    <p className={styles.tagline}>{cms.tagline || 'Personalized Gifts & Memories'}<br />
                        <span style={{ fontWeight: 500 }}>Turn your happiest photos into handcrafted wooden & acrylic frames, LED gifts, and mugs.</span></p>
                    <div className={styles.socials}>
                        {cms.instagram && (
                            <a href={cms.instagram} className={styles.socialIcon} target="_blank" rel="noopener noreferrer" title="Instagram">
                                <Instagram size={18} />
                            </a>
                        )}
                        {cms.facebook && (
                            <a href={cms.facebook} className={styles.socialIcon} target="_blank" rel="noopener noreferrer" title="Facebook">
                                <Facebook size={18} />
                            </a>
                        )}
                        {cms.youtube && (
                            <a href={cms.youtube} className={styles.socialIcon} target="_blank" rel="noopener noreferrer" title="YouTube">
                                <Youtube size={18} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Links Section */}
                <div className={styles.linksSection}>
                    <h3>Explore</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop All Products</Link></li>
                        <li><Link to="/categories">Categories</Link></li>
                        <li><Link to="/personalized-gifts">Personalized Gifts</Link></li>
                        <li><Link to="/track-order">Track Your Order</Link></li>
                        <li><Link to="/about">About Raja Studio</Link></li>
                    </ul>
                </div>

                {/* Policies Section */}
                <div className={styles.linksSection}>
                    <h3>Policies & Support</h3>
                    <ul>
                        <li><Link to="/faq">Frequently Asked Questions</Link></li>
                        <li><Link to="/shipping">Shipping & Delivery Policy</Link></li>
                        <li><Link to="/returns">Returns & Cancellations</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                        <li><Link to="/contact">Contact Support</Link></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className={styles.contactSection}>
                    <h3>Contact Us</h3>
                    <ul>
                        <li>
                            <Phone size={16} /> <span>{cms.phone || '+91 98765 43210'}</span>
                        </li>
                        <li>
                            <Mail size={16} /> <span>{cms.email || 'contact@rajastudio.com'}</span>
                        </li>
                        <li>
                            <MapPin size={16} /> <span>{cms.address || 'Raja Studio, Main Road, City Center, Tamil Nadu'}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={styles.copyright}>
                <p>&copy; {new Date().getFullYear()} {cms.businessName || 'RAJA STUDIO'} / {cms.giftDivision || 'RAJA GIFTS'}. All Rights Reserved. Crafted with ❤️ for your special memories.</p>
            </div>
        </footer>
    );
};

export default Footer;
