import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone, Facebook, Youtube, Gift, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { useData } from '../../context/DataContext';
import styles from './Footer.module.css';

const Footer = () => {
    const { cms } = useData();

    return (
        <footer className={styles.footer}>
            {/* Top Value Strip */}
            <div className={styles.footerTopStrip}>
                <div className={`container ${styles.topStripContainer}`}>
                    <div className={styles.topStripItem}>
                        <Sparkles size={20} className={styles.goldIcon} />
                        <div>
                            <h4>Bespoke Luxury Craftsmanship</h4>
                            <p>Every keepsake handcrafted with utmost care</p>
                        </div>
                    </div>
                    <div className={styles.topStripItem}>
                        <ShieldCheck size={20} className={styles.goldIcon} />
                        <div>
                            <h4>100% Quality Guaranteed</h4>
                            <p>Studio-grade HD prints & premium framing</p>
                        </div>
                    </div>
                    <div className={styles.topStripItem}>
                        <Gift size={20} className={styles.goldIcon} />
                        <div>
                            <h4>Signature Velvet Packaging</h4>
                            <p>Ready to delight in royal emerald & gold trunks</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className={`container ${styles.footerContainer}`}>
                {/* Brand Column */}
                <div className={styles.brandCol}>
                    <div className={styles.footerLogo}>
                        {cms.logoImage ? (
                            <img src={cms.logoImage} alt={cms.businessName || "Studio Gift Shop"} style={{ maxHeight: '44px', maxWidth: '180px', objectFit: 'contain' }} />
                        ) : (
                            <>
                                <div className={styles.logoBadge}>
                                    <Gift size={24} color="#D4AF37" />
                                </div>
                                <div className={styles.logoText}>
                                    <span className={styles.brandName}>{cms.businessName || 'STUDIO GIFT SHOP'}</span>
                                    <span className={styles.brandSubtitle}>{cms.giftDivision || 'LUXURY BOUTIQUE GIFTING'}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <p className={styles.brandStory}>
                        Discover thoughtfully curated gifts and bespoke memory keepsakes that turn ordinary moments into unforgettable memories. Handcrafted with royal elegance, personalized care, and love.
                    </p>

                    <div className={styles.socialGroup}>
                        <a href={cms.instagram || 'https://instagram.com/studiogiftshop'} target="_blank" rel="noopener noreferrer" className={styles.socialCircle} title="Instagram">
                            <Instagram size={17} />
                        </a>
                        <a href={cms.facebook || 'https://facebook.com/studiogiftshop'} target="_blank" rel="noopener noreferrer" className={styles.socialCircle} title="Facebook">
                            <Facebook size={17} />
                        </a>
                        <a href={cms.youtube || 'https://youtube.com/studiogiftshop'} target="_blank" rel="noopener noreferrer" className={styles.socialCircle} title="YouTube">
                            <Youtube size={17} />
                        </a>
                    </div>
                </div>

                {/* Quick Links Column */}
                <div className={styles.linksCol}>
                    <h3 className={styles.colTitle}>Quick Links</h3>
                    <div className={styles.goldUnderline}></div>
                    <ul className={styles.linksList}>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop All Collections</Link></li>
                        <li><Link to="/personalized-gifts">Personalized Gifts</Link></li>
                        <li><Link to="/video-editing">Video Editing Services</Link></li>
                        <li><Link to="/logo-poster-editing">Logo & Poster Design</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact Support</Link></li>
                        <li><Link to="/faq">Frequently Asked Questions</Link></li>
                    </ul>
                </div>

                {/* Customer Support Column */}
                <div className={styles.linksCol}>
                    <h3 className={styles.colTitle}>Customer Support</h3>
                    <div className={styles.goldUnderline}></div>
                    <ul className={styles.linksList}>
                        <li><Link to="/track-order">Track Your Order</Link></li>
                        <li><Link to="/shipping">Shipping Information</Link></li>
                        <li><Link to="/returns">Return & Refund Policy</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms and Conditions</Link></li>
                        <li><Link to="/services">Bespoke Framing Services</Link></li>
                        <li><Link to="/works">Client Gallery & Portfolio</Link></li>
                    </ul>
                </div>

                {/* Contact Column */}
                <div className={styles.contactCol}>
                    <h3 className={styles.colTitle}>Boutique Atelier</h3>
                    <div className={styles.goldUnderline}></div>
                    <ul className={styles.contactList}>
                        <li>
                            <Phone size={17} className={styles.contactIcon} />
                            <div>
                                <span className={styles.contactLabel}>Customer Care:</span>
                                <a href={`tel:${cms.phone || '+917708552461'}`} className={styles.contactVal}>
                                    {cms.phone || '+91 77085 52461'}
                                </a>
                            </div>
                        </li>
                        <li>
                            <Mail size={17} className={styles.contactIcon} />
                            <div>
                                <span className={styles.contactLabel}>Email Inquiries:</span>
                                <a href={`mailto:${cms.email || 'contact@studiogiftshop.com'}`} className={styles.contactVal}>
                                    {cms.email || 'contact@studiogiftshop.com'}
                                </a>
                            </div>
                        </li>
                        <li>
                            <MapPin size={17} className={styles.contactIcon} />
                            <div>
                                <span className={styles.contactLabel}>Atelier Address:</span>
                                <span className={styles.contactVal}>
                                    {cms.address || 'Studio Gift Shop, Main Road, City Center, Tamil Nadu, India'}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Copyright & Security Strip */}
            <div className={styles.copyrightStrip}>
                <div className={`container ${styles.copyrightContainer}`}>
                    <p className={styles.copyrightText}>
                        &copy; {new Date().getFullYear()} <strong>Studio Gift Shop</strong>. All Rights Reserved. Handcrafted with <Heart size={13} fill="#D4AF37" color="#D4AF37" style={{ verticalAlign: 'middle', margin: '0 2px' }} /> for your precious memories.
                    </p>
                    <div className={styles.paymentMethods}>
                        <span className={styles.payBadge}>UPI</span>
                        <span className={styles.payBadge}>RuPay</span>
                        <span className={styles.payBadge}>Visa</span>
                        <span className={styles.payBadge}>MasterCard</span>
                        <span className={styles.payBadge}>Net Banking</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
