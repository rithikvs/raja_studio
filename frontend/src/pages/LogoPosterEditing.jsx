import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Palette, Sparkles, Image as ImageIcon, ZoomIn, CheckCircle2, 
    ArrowRight, Layers, FileCheck, Printer, Brush, Eye, MessageSquare, 
    PhoneCall, X, PenTool, LayoutTemplate
} from 'lucide-react';
import { useData } from '../context/DataContext';
import styles from './LogoPosterEditing.module.css';

const LogoPosterEditing = () => {
    const { cms, designSamples = [] } = useData();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeLightbox, setActiveLightbox] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        designType: 'Luxury Brand Logo',
        purpose: 'Brand Identity',
        notes: ''
    });

    const categories = [
        'All',
        ...new Set([
            'Luxury Brand Logos',
            'Event & Party Posters',
            'Festival & Social Flyers',
            'Gift Packaging & Labels',
            'Monograms & Invitations',
            ...designSamples.map(d => d.category).filter(Boolean)
        ])
    ];

    const filteredSamples = selectedCategory === 'All'
        ? designSamples
        : designSamples.filter(s => s.category === selectedCategory);

    const packages = [
        {
            name: 'Boutique Event Poster / Flyer',
            tag: 'Fast Turnaround',
            price: '₹599',
            description: 'Perfect for birthday bashes, store announcements, music concerts, and festive promotional sales.',
            deliverables: [
                'Print-Ready 300 DPI CMYK PDF format',
                'Optimized RGB JPG & PNG for Instagram / WhatsApp',
                '2 Unique layout design concepts',
                '2 Free Revision rounds',
                'Express delivery within 24 to 48 Hours'
            ]
        },
        {
            name: 'Custom Brand Logo Identity',
            tag: 'Most Popular',
            price: '₹999',
            featured: true,
            description: 'Distinctive, memorable, and vector-perfect logo identity designed for your boutique or personal brand.',
            deliverables: [
                '3 Distinct creative concepts to choose from',
                '100% Scalable Vector Source Files (AI, SVG, EPS, PDF)',
                'Transparent background PNGs (Dark & Light modes)',
                'Color palette hexadecimal codes & typography guide',
                '3 Revision cycles included',
                'Full commercial copyright transfer'
            ]
        },
        {
            name: 'Full Luxury Packaging & Brand Suite',
            tag: 'Complete Solution',
            price: '₹2,499',
            description: 'The ultimate branding package for luxury gift shops, artisan products, and premium event stationery.',
            deliverables: [
                'Primary Logo, Secondary Submark & Monogram Icon',
                'Product Box Sleeve / Label Die-Cut Vector Artwork',
                'Custom Business Card & Thank You Card Layouts',
                'Social Media Profile & Banner Brand Kit',
                'Comprehensive Brand Style Guide PDF',
                'Unlimited revisions & direct lead designer WhatsApp line'
            ]
        }
    ];

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const msg = `Hi Studio Gift Shop, I would like to commission a Design Project!%0A- Name: ${encodeURIComponent(formData.name)}%0A- Phone: ${encodeURIComponent(formData.phone)}%0A- Service: ${encodeURIComponent(formData.designType)}%0A- Purpose: ${encodeURIComponent(formData.purpose)}%0A- Details: ${encodeURIComponent(formData.notes)}`;
        const whatsappNumber = cms.phone?.replace(/[^0-9]/g, '') || '917708552461';
        window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    };

    return (
        <div className={styles.designPage}>
            {/* 1. HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={`container ${styles.heroContainer}`}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroBadge}>
                            <Brush size={16} className={styles.goldSparkle} />
                            <span>GRAPHIC DESIGN & BRANDING ATELIER</span>
                        </div>
                        <h1 className={styles.heroTitle}>
                            Iconic Logos, Captivating Posters & <span className={styles.goldText}>Bespoke Artwork</span>
                        </h1>
                        <p className={styles.heroDescription}>
                            Elevate your gifting brand, celebratory occasions, and special events with artisan graphic design. From royal monogram logos to print-ready event posters and luxury packaging labels.
                        </p>
                        
                        <div className={styles.heroActions}>
                            <a href="#portfolio" className={styles.primaryBtn}>
                                <Eye size={18} />
                                <span>Browse Design Samples</span>
                            </a>
                            <a href="#commission" className={styles.secondaryBtn}>
                                <PenTool size={18} />
                                <span>Commission a Design</span>
                            </a>
                        </div>

                        {/* Trust Metrics */}
                        <div className={styles.trustStrip}>
                            <div className={styles.trustItem}>
                                <strong>100% Vector</strong>
                                <span>Infinite Scalability</span>
                            </div>
                            <div className={styles.trustDivider} />
                            <div className={styles.trustItem}>
                                <strong>300 DPI</strong>
                                <span>Print-Ready Quality</span>
                            </div>
                            <div className={styles.trustDivider} />
                            <div className={styles.trustItem}>
                                <strong>Full Rights</strong>
                                <span>Commercial Ownership</span>
                            </div>
                            <div className={styles.trustDivider} />
                            <div className={styles.trustItem}>
                                <strong>Fast VIP</strong>
                                <span>Direct Designer Chat</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.heroVisual}>
                        <div className={styles.designShowcaseCard}>
                            <img 
                                src={cms.designHeroImage || "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80"} 
                                alt="Studio Logo & Poster Design Atelier" 
                                className={styles.heroCardImg}
                            />
                            <div className={styles.designCardOverlay}>
                                <span className={styles.overlayTag}>BESPOKE DESIGN ATELIER</span>
                                <h3>Royal Crest & Monogram Artistry</h3>
                                <p>Custom vector logos crafted with heraldic elegance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. PORTFOLIO SHOWCASE */}
            <section id="portfolio" className={styles.portfolioSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionKicker}>DESIGN SHOWCASE</span>
                        <h2 className={styles.sectionTitle}>Explore Our Sample Portfolio</h2>
                        <p className={styles.sectionSubtitle}>
                            Click on any artwork below to view high-resolution details, typography specifications, and color palettes.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className={styles.categoryTabs}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`${styles.categoryTab} ${selectedCategory === cat ? styles.activeTab : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Design Cards Grid */}
                    <div className={styles.designGrid}>
                        {filteredSamples.map((sample) => (
                            <motion.div
                                key={sample.id}
                                className={styles.designCard}
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div 
                                    className={styles.imageWrapper}
                                    onClick={() => setActiveLightbox(sample)}
                                >
                                    <img src={sample.image} alt={sample.title} className={styles.artworkImage} />
                                    <div className={styles.imageOverlay}>
                                        <div className={styles.zoomCircle}>
                                            <ZoomIn size={22} />
                                        </div>
                                    </div>
                                    <span className={styles.categoryPill}>{sample.category}</span>
                                </div>

                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{sample.title}</h3>
                                    <p className={styles.cardDesc}>{sample.description}</p>

                                    <div className={styles.specsRow}>
                                        <span className={styles.specItem}>
                                            <FileCheck size={14} className={styles.goldText} /> {sample.format}
                                        </span>
                                    </div>

                                    {/* Color Swatches */}
                                    {sample.colors && (
                                        <div className={styles.paletteRow}>
                                            <span className={styles.paletteLabel}>Palette:</span>
                                            <div className={styles.swatches}>
                                                {(Array.isArray(sample.colors) ? sample.colors : [sample.colors]).map((c, i) => (
                                                    <span 
                                                        key={i} 
                                                        className={styles.swatch} 
                                                        style={{ backgroundColor: c }}
                                                        title={c}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.cardActions}>
                                        <button 
                                            className={styles.viewDetailBtn}
                                            onClick={() => setActiveLightbox(sample)}
                                        >
                                            <ZoomIn size={16} /> View Details
                                        </button>
                                        <a 
                                            href="#commission"
                                            className={styles.orderStyleBtn}
                                            onClick={() => setFormData({ ...formData, designType: sample.category })}
                                        >
                                            Order Similar Design
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. DESIGN STANDARDS */}
            <section className={styles.standardsSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionKicker}>OUR ATELIER STANDARDS</span>
                        <h2 className={styles.sectionTitle}>What Every Design Delivery Includes</h2>
                        <p className={styles.sectionSubtitle}>
                            We provide comprehensive industry-standard deliverables ready for printing, digital marketing, laser cutting, and embossing.
                        </p>
                    </div>

                    <div className={styles.standardsGrid}>
                        <div className={styles.standardCard}>
                            <div className={styles.standardIcon}>
                                <PenTool size={26} />
                            </div>
                            <h3>100% Vector Scalability</h3>
                            <p>Delivered in Adobe Illustrator (.AI), SVG, and EPS. Scale your logo from a tiny perfume bottle to a massive billboard without loss of crispness.</p>
                        </div>

                        <div className={styles.standardCard}>
                            <div className={styles.standardIcon}>
                                <Printer size={26} />
                            </div>
                            <h3>Print-Ready 300 DPI (CMYK)</h3>
                            <p>Calibrated for high-precision commercial printers with crop marks, bleed margins, and color-accurate CMYK profiles for paper, canvas, and acrylic.</p>
                        </div>

                        <div className={styles.standardCard}>
                            <div className={styles.standardIcon}>
                                <LayoutTemplate size={26} />
                            </div>
                            <h3>Multi-Format Social Kits</h3>
                            <p>Pre-sized assets formatted for Instagram Feed (1:1), Stories (9:16), WhatsApp Display Pictures, and Facebook Banners for effortless sharing.</p>
                        </div>

                        <div className={styles.standardCard}>
                            <div className={styles.standardIcon}>
                                <Sparkles size={26} />
                            </div>
                            <h3>Metallic & Foil Mockups</h3>
                            <p>See your design in realistic photorealistic environments with gold foil stamping, embossed paper textures, and luxury velvet gift packaging simulations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. PACKAGES & PRICING */}
            <section className={styles.packagesSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionKicker}>TRANSPARENT INVESTMENT</span>
                        <h2 className={styles.sectionTitle}>Curated Design Packages</h2>
                        <p className={styles.sectionSubtitle}>
                            Invest in timeless design for your celebrations, personalized gifts, or business brand.
                        </p>
                    </div>

                    <div className={styles.packagesGrid}>
                        {packages.map((pkg, idx) => (
                            <div 
                                key={idx}
                                className={`${styles.packageCard} ${pkg.featured ? styles.featuredCard : ''}`}
                            >
                                {pkg.tag && (
                                    <span className={styles.cardTag}>{pkg.tag}</span>
                                )}
                                <h3 className={styles.packageName}>{pkg.name}</h3>
                                <div className={styles.priceRow}>
                                    <span className={styles.packagePrice}>{pkg.price}</span>
                                    <span className={styles.pricePeriod}>/ project</span>
                                </div>
                                <p className={styles.packageDesc}>{pkg.description}</p>

                                <ul className={styles.deliverableList}>
                                    {pkg.deliverables.map((deliv, dIdx) => (
                                        <li key={dIdx}>
                                            <CheckCircle2 size={16} className={styles.checkGlyph} />
                                            <span>{deliv}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={`https://wa.me/${cms.phone?.replace(/[^0-9]/g, '') || '917708552461'}?text=${encodeURIComponent(`Hi Studio Gift Shop, I would like to order the "${pkg.name}" (${pkg.price}) Graphic Design Package.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${styles.selectBtn} ${pkg.featured ? styles.featuredSelectBtn : ''}`}
                                >
                                    <span>Select {pkg.name}</span>
                                    <ArrowRight size={16} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. COMMISSION FORM */}
            <section id="commission" className={styles.commissionSection}>
                <div className="container">
                    <div className={styles.commissionBox}>
                        <div className={styles.commissionIntro}>
                            <span className={styles.commissionKicker}>START YOUR DESIGN</span>
                            <h2>Commission Your Bespoke Design Today</h2>
                            <p>
                                Share your design vision, preferred style, text/name to include, or inspiration images. We will review your brief and begin crafting your unique concepts immediately.
                            </p>

                            <div className={styles.contactHighlights}>
                                <div className={styles.contactHighlightItem}>
                                    <PhoneCall size={20} className={styles.goldText} />
                                    <div>
                                        <span>Direct Designer Helpline</span>
                                        <strong>{cms.phone || '+91 77085 52461'}</strong>
                                    </div>
                                </div>
                                <div className={styles.contactHighlightItem}>
                                    <MessageSquare size={20} className={styles.goldText} />
                                    <div>
                                        <span>WhatsApp Design Consultation</span>
                                        <strong>Instant Response</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleFormSubmit} className={styles.commissionForm}>
                            <h3>Design Brief & Inquiry</h3>

                            <div className={styles.inputGroup}>
                                <label>Your Full Name *</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="e.g. Ananya Sen"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>WhatsApp / Mobile Number *</label>
                                <input 
                                    type="tel" 
                                    required 
                                    placeholder="e.g. +91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className={styles.gridTwo}>
                                <div className={styles.inputGroup}>
                                    <label>Design Service</label>
                                    <select
                                        value={formData.designType}
                                        onChange={(e) => setFormData({ ...formData, designType: e.target.value })}
                                    >
                                        <option>Luxury Brand Logo</option>
                                        <option>Event & Party Poster</option>
                                        <option>Festival & Social Flyer</option>
                                        <option>Gift Box Packaging & Labels</option>
                                        <option>Monogram & Invitation</option>
                                        <option>Custom Graphic Artwork</option>
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Purpose</label>
                                    <select
                                        value={formData.purpose}
                                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                    >
                                        <option>Personal Gifting / Family</option>
                                        <option>Brand Identity / Startup</option>
                                        <option>Special Event / Wedding</option>
                                        <option>Festival / Holiday Sale</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Describe Your Vision & Exact Text (Optional)</label>
                                <textarea 
                                    rows="3" 
                                    placeholder="Mention names, slogans, color preferences, or link to reference samples..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <button type="submit" className={styles.submitCommissionBtn}>
                                <MessageSquare size={18} />
                                <span>Send Brief via WhatsApp & Discuss</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* 6. LIGHTBOX MODAL */}
            <AnimatePresence>
                {activeLightbox && (
                    <div className={styles.lightboxBackdrop} onClick={() => setActiveLightbox(null)}>
                        <motion.div 
                            className={styles.lightboxContainer}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                className={styles.closeLightboxBtn}
                                onClick={() => setActiveLightbox(null)}
                                aria-label="Close design lightbox"
                            >
                                <X size={22} />
                            </button>

                            <div className={styles.lightboxImageWrapper}>
                                <img src={activeLightbox.image} alt={activeLightbox.title} className={styles.lightboxImg} />
                            </div>

                            <div className={styles.lightboxDetails}>
                                <div className={styles.lightboxHeader}>
                                    <div>
                                        <span className={styles.lightboxCat}>{activeLightbox.category}</span>
                                        <h3 className={styles.lightboxTitle}>{activeLightbox.title}</h3>
                                    </div>
                                    <span className={styles.lightboxStyleBadge}>{activeLightbox.style}</span>
                                </div>

                                <p className={styles.lightboxDesc}>{activeLightbox.description}</p>

                                <div className={styles.lightboxSpecs}>
                                    <div>
                                        <strong>Format:</strong>
                                        <span>{activeLightbox.format}</span>
                                    </div>
                                    <div>
                                        <strong>Dimensions:</strong>
                                        <span>{activeLightbox.dimensions}</span>
                                    </div>
                                </div>

                                {activeLightbox.colors && (
                                    <div className={styles.lightboxPalette}>
                                        <strong>Color Harmony:</strong>
                                        <div className={styles.lightboxSwatches}>
                                            {(Array.isArray(activeLightbox.colors) ? activeLightbox.colors : [activeLightbox.colors]).map((c, i) => (
                                                <div key={i} className={styles.lightboxSwatchItem}>
                                                    <span className={styles.swatchBox} style={{ backgroundColor: c }} />
                                                    <code>{c}</code>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className={styles.lightboxFooter}>
                                    <a
                                        href={`https://wa.me/${cms.phone?.replace(/[^0-9]/g, '') || '917708552461'}?text=${encodeURIComponent(`Hi Studio Gift Shop, I loved your sample design "${activeLightbox.title}". I would like to commission a design in this style!`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.lightboxOrderBtn}
                                    >
                                        <PenTool size={16} /> Order This Style On WhatsApp
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LogoPosterEditing;