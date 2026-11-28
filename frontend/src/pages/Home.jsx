import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    ChevronRight, Star, Heart, Camera, Gift, ShieldCheck, Truck, 
    Sparkles, ShoppingBag, Award, HeartHandshake, ArrowRight,
    CheckCircle, ChevronLeft, Send, Sparkle, Tag, Clock, RefreshCw
} from 'lucide-react';
import styles from './Home.module.css';
import Button from '../components/UI/Button';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { getProductDisplayPrice, getProductRegularPrice } from '../utils/productUtils';
import { 
    TiltCard, 
    MagneticButton, 
    SpotlightEffect, 
    StaggerReveal, 
    StaggerItem, 
    AnimatedSection, 
    TextReveal 
} from '../components/Motion';

const Home = () => {
    const { products, categories, cms } = useData();
    const { toggleWishlist, isInWishlist, addToCart } = useCart();
    const navigate = useNavigate();

    // Active Tab for Featured Products
    const [activeTab, setActiveTab] = useState('all');

    // Review Carousel State
    const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

    // Newsletter State
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState(null); // 'success' | 'error' | null
    const [newsletterMsg, setNewsletterMsg] = useState('');

    // Interactive Hero Mouse Parallax State
    const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0 });

    const handleHeroMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const rect = currentTarget.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        setHeroMouse({ x, y });
    };

    const activeProducts = products.filter(p => p.status !== 'disabled');

    // Filter products for tabs
    const getTabProducts = () => {
        switch (activeTab) {
            case 'new':
                return activeProducts.filter(p => p.newArrival || p.isNewArrival).length > 0 
                    ? activeProducts.filter(p => p.newArrival || p.isNewArrival)
                    : activeProducts.slice(0, 8);
            case 'bestseller':
                return activeProducts.filter(p => p.bestSeller || p.isBestSeller).length > 0
                    ? activeProducts.filter(p => p.bestSeller || p.isBestSeller)
                    : activeProducts.slice(0, 8);
            case 'trending':
                return activeProducts.filter(p => p.featured).length > 0
                    ? activeProducts.filter(p => p.featured)
                    : activeProducts.slice(0, 8);
            case 'offers':
                return activeProducts.filter(p => getProductRegularPrice(p) > getProductDisplayPrice(p)).length > 0
                    ? activeProducts.filter(p => getProductRegularPrice(p) > getProductDisplayPrice(p))
                    : activeProducts.slice(0, 8);
            case 'all':
            default:
                return activeProducts.slice(0, 8);
        }
    };

    const tabProducts = getTabProducts();

    // 8 Required Gifting Categories
    const categoryList = categories.length >= 8 ? categories : [
        {
            id: 'cat_birthday',
            name: 'Birthday Gifts',
            image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
            description: 'Curated celebration hampers, custom keepsakes & surprise luxury boxes.'
        },
        {
            id: 'cat_anniversary',
            name: 'Anniversary Gifts',
            image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
            description: 'Timeless romantic photo frames, engraved keepsakes & bespoke couple gifts.'
        },
        {
            id: 'cat_personalized',
            name: 'Personalized Gifts',
            image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
            description: 'Custom engraved frames, crystal acrylic blocks & customized mugs.'
        },
        {
            id: 'cat_wedding',
            name: 'Wedding Gifts',
            image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
            description: 'Opulent congratulations hampers, luxury memory books & premium presentation.'
        },
        {
            id: 'cat_corporate',
            name: 'Corporate Gifts',
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
            description: 'Sophisticated executive gifting, bespoke corporate hampers & custom branded gift sets.'
        },
        {
            id: 'cat_hampers',
            name: 'Luxury Gift Hampers',
            image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
            description: 'Handcrafted artisan hampers, premium chocolates, scented votives & gourmet delights.'
        },
        {
            id: 'cat_decor',
            name: 'Home Decor Gifts',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
            description: 'Handcrafted aesthetic frames, LED crystal art pieces & decorative wall keepsakes.'
        },
        {
            id: 'cat_festival',
            name: 'Festival Gifts',
            image: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=600&auto=format&fit=crop&q=80',
            description: 'Exquisite festive celebration boxes, auspicious keepsakes & ceremonial gifting.'
        }
    ];

    // Customer Reviews
    const customerReviews = [
        {
            name: 'Priya Sharma',
            rating: 5,
            product: 'Wooden Photo Frame',
            text: 'Amazing quality! The photo frame arrived perfectly packed in emerald gift wrap and the print quality is outstanding. Highly recommend Studio Gift Shop!',
            date: 'Verified Buyer'
        },
        {
            name: 'Rahul Kumar',
            rating: 5,
            product: 'LED Acrylic Display',
            text: 'Ordered a customized LED gift for my parents anniversary. They absolutely loved the golden glow and craftsmanship. Exceptional service!',
            date: 'Verified Buyer'
        },
        {
            name: 'Anita Patel',
            rating: 5,
            product: 'Photo Collage Frame',
            text: 'Beautiful photo collage for our family celebration. The customization options and frame finishing were truly royal. Will definitely order again!',
            date: 'Verified Buyer'
        }
    ];

    const nextReview = () => {
        setCurrentReviewIdx((prev) => (prev + 1) % customerReviews.length);
    };

    const prevReview = () => {
        setCurrentReviewIdx((prev) => (prev - 1 + customerReviews.length) % customerReviews.length);
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            setNewsletterStatus('error');
            setNewsletterMsg('Please enter a valid email address.');
            return;
        }
        setNewsletterStatus('success');
        setNewsletterMsg('Thank you for subscribing! Your exclusive welcome gift code is on its way.');
        setNewsletterEmail('');
    };

    return (
        <div className={styles.homeContainer}>
            {/* ===================================================
               3. HERO SECTION – CINEMATIC 3D LUXURY
            =================================================== */}
            <section className={styles.heroSection} onMouseMove={handleHeroMouseMove}>
                {/* Ambient dynamic gold & emerald lighting */}
                <div 
                    className={styles.heroGlowOrb1} 
                    style={{
                        transform: `translate(${heroMouse.x * -35}px, ${heroMouse.y * -35}px)`
                    }}
                />
                <div 
                    className={styles.heroGlowOrb2} 
                    style={{
                        transform: `translate(${heroMouse.x * 45}px, ${heroMouse.y * 45}px)`
                    }}
                />

                <div className={`container ${styles.heroContainer}`}>
                    {/* Left Editorial Content */}
                    <motion.div 
                        className={styles.heroTextCol}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className={styles.heroBadge}>
                            <Sparkles size={15} className={styles.goldGlow} />
                            <span>STUDIO GIFT SHOP LUXURY COLLECTION</span>
                        </div>

                        <div className={styles.heroHeadingWrapper}>
                            <TextReveal 
                                text="Make Every Moment" 
                                className={styles.heroHeading} 
                                tag="h1" 
                            />
                            <motion.span 
                                className={styles.goldText}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            >
                                Special
                            </motion.span>
                        </div>

                        <p className={styles.heroDescription}>
                            Discover thoughtfully curated gifts that turn ordinary moments into unforgettable memories. Handcrafted with museum-grade precision, bespoke personalization, and royal presentation.
                        </p>

                        <div className={styles.heroCtaGroup}>
                            <MagneticButton strength={0.22}>
                                <Link to="/categories" className={styles.primaryHeroBtn}>
                                    <span>Explore Collections</span> <ChevronRight size={18} />
                                </Link>
                            </MagneticButton>
                            <MagneticButton strength={0.22}>
                                <Link to="/shop" className={styles.secondaryHeroBtn}>
                                    Shop Best Sellers
                                </Link>
                            </MagneticButton>
                        </div>

                        {/* Trust Micro-Metrics */}
                        <div className={styles.heroMetrics}>
                            <div className={styles.metricItem}>
                                <span className={styles.metricValue}>10,000+</span>
                                <span className={styles.metricLabel}>Gifts Delivered</span>
                            </div>
                            <div className={styles.metricDivider}></div>
                            <div className={styles.metricItem}>
                                <span className={styles.metricValue}>4.9 ★</span>
                                <span className={styles.metricLabel}>Customer Rating</span>
                            </div>
                            <div className={styles.metricDivider}></div>
                            <div className={styles.metricItem}>
                                <span className={styles.metricValue}>100%</span>
                                <span className={styles.metricLabel}>Handcrafted Care</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Visual 3D Tilt Collage */}
                    <motion.div 
                        className={styles.heroVisualCol}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <TiltCard 
                            maxTilt={8} 
                            perspective={1200} 
                            scale={1.02} 
                            glare={true} 
                            className={styles.heroTiltCard}
                        >
                            <div className={styles.heroMainImageWrapper}>
                                <img 
                                    src={cms.heroImage || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=900&auto=format&fit=crop&q=80"} 
                                    alt="Studio Gift Shop Luxury Presentation"
                                    className={styles.heroMainImg}
                                />
                                <div className={styles.heroImageGlow}></div>
                            </div>

                            {/* Floating Floating Badge 1 */}
                            <motion.div 
                                className={`${styles.floatingCard} ${styles.floatingCardTop}`}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
                                style={{
                                    transform: `translate(${heroMouse.x * 20}px, ${heroMouse.y * 20}px)`
                                }}
                            >
                                <div className={styles.floatingCardIcon}>
                                    <Gift size={20} color="#D9AF45" />
                                </div>
                                <div>
                                    <p className={styles.floatingCardTitle}>Signature Hampers</p>
                                    <p className={styles.floatingCardSub}>Royal Velvet & Gold Packaging</p>
                                </div>
                            </motion.div>

                            {/* Floating Badge 2 */}
                            <motion.div 
                                className={`${styles.floatingCard} ${styles.floatingCardBottom}`}
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
                                style={{
                                    transform: `translate(${heroMouse.x * -25}px, ${heroMouse.y * -25}px)`
                                }}
                            >
                                <div className={styles.floatingCardIcon}>
                                    <Sparkles size={20} color="#D9AF45" />
                                </div>
                                <div>
                                    <p className={styles.floatingCardTitle}>Live Photo Upload</p>
                                    <p className={styles.floatingCardSub}>HD Laser & Studio Printing</p>
                                </div>
                            </motion.div>
                        </TiltCard>
                    </motion.div>
                </div>
            </section>

            {/* ===================================================
               4. SHOP BY CATEGORY SECTION
            =================================================== */}
            <AnimatedSection className="section-padding">
                <div className="container">
                    <div className={styles.sectionHeaderWrap}>
                        <span className={styles.sectionPreTitle}>CURATED SELECTIONS</span>
                        <h2 className={styles.mainSectionTitle}>Shop By Category</h2>
                        <div className={styles.goldDivider}></div>
                        <p className={styles.sectionLeadText}>
                            Explore our meticulously organized gifting categories designed for life's most meaningful celebrations.
                        </p>
                    </div>

                    <StaggerReveal staggerDuration={0.07} className={styles.categoryGrid}>
                        {categoryList.map((cat, idx) => (
                            <StaggerItem key={cat.id || idx}>
                                <TiltCard maxTilt={6} scale={1.03} glare={false} className={styles.categoryTiltCard}>
                                    <SpotlightEffect spotlightColor="rgba(217, 175, 69, 0.16)" className={styles.categorySpotlight}>
                                        <div className={styles.categoryCard}>
                                            <div className={styles.categoryImageContainer}>
                                                <img 
                                                    src={cat.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'} 
                                                    alt={cat.name}
                                                    className={styles.categoryImg}
                                                />
                                                <div className={styles.categoryOverlay}></div>
                                            </div>

                                            <div className={styles.categoryDetails}>
                                                <h3 className={styles.categoryTitle}>{cat.name}</h3>
                                                <p className={styles.categoryDesc}>{cat.description}</p>
                                                <Link 
                                                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                                                    className={styles.categoryExploreBtn}
                                                >
                                                    Explore Collection <ArrowRight size={15} />
                                                </Link>
                                            </div>
                                        </div>
                                    </SpotlightEffect>
                                </TiltCard>
                            </StaggerItem>
                        ))}
                    </StaggerReveal>
                </div>
            </AnimatedSection>

            {/* ===================================================
               5. FEATURED PRODUCTS – SPECIAL COLLECTIONS
            =================================================== */}
            <AnimatedSection className={styles.featuredSection}>
                <div className="container">
                    <div className={styles.sectionHeaderWrap}>
                        <span className={styles.sectionPreTitle}>BOUTIQUE SHOWCASE</span>
                        <h2 className={styles.mainSectionTitle}>Discover Our Special Collections</h2>
                        <div className={styles.goldDivider}></div>
                        <p className={styles.sectionLeadText}>
                            Each gift is made with authentic craftsmanship, premium finishes, and transparent pricing.
                        </p>
                    </div>

                    {/* Animated Tab Nav with Spring Glider */}
                    <div className={styles.tabsNav}>
                        {[
                            { id: 'all', label: 'All Collections' },
                            { id: 'new', label: 'New Arrivals' },
                            { id: 'bestseller', label: 'Best Sellers' },
                            { id: 'trending', label: 'Trending Gifts' },
                            { id: 'offers', label: 'Special Offers' }
                        ].map((tab) => (
                            <button 
                                key={tab.id}
                                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {activeTab === tab.id && (
                                    <motion.div 
                                        layoutId="activeTabPill" 
                                        className={styles.tabPillGlider}
                                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                                    />
                                )}
                                <span style={{ position: 'relative', zIndex: 2 }}>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Staggered Products Grid */}
                    {tabProducts.length > 0 ? (
                        <StaggerReveal staggerDuration={0.06} className={styles.productsGrid}>
                            {tabProducts.map((product) => {
                                const displayPrice = getProductDisplayPrice(product);
                                const regPrice = getProductRegularPrice(product);
                                const hasDiscount = regPrice > displayPrice;
                                const discountPercent = hasDiscount 
                                    ? Math.round(((regPrice - displayPrice) / regPrice) * 100) 
                                    : 0;

                                return (
                                    <StaggerItem key={product.id}>
                                        <TiltCard maxTilt={5} scale={1.02} glare={true} className={styles.productTiltWrap}>
                                            <SpotlightEffect spotlightColor="rgba(217, 175, 69, 0.14)" className={styles.productCardSpotlight}>
                                                <div className={styles.productCard}>
                                                    {/* Badges & Wishlist Trigger */}
                                                    <div className={styles.cardHeaderArea}>
                                                        <div className={styles.badgeCluster}>
                                                            {product.bestSeller && (
                                                                <span className={styles.bestSellerBadge}>Best Seller</span>
                                                            )}
                                                            {product.newArrival && (
                                                                <span className={styles.newArrivalBadge}>New Arrival</span>
                                                            )}
                                                            {hasDiscount && (
                                                                <span className={styles.discountBadge}>{discountPercent}% OFF</span>
                                                            )}
                                                        </div>

                                                        <motion.button 
                                                            type="button"
                                                            whileTap={{ scale: 0.85 }}
                                                            className={`${styles.wishlistIconBtn} ${isInWishlist(product.id) ? styles.inWishlist : ''}`}
                                                            onClick={() => toggleWishlist(product)}
                                                            title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                                            aria-label="Wishlist toggle"
                                                        >
                                                            <Heart 
                                                                size={18} 
                                                                fill={isInWishlist(product.id) ? '#D9AF45' : 'none'} 
                                                                color={isInWishlist(product.id) ? '#D9AF45' : '#064A3B'} 
                                                            />
                                                        </motion.button>
                                                    </div>

                                                    {/* Product Image */}
                                                    <Link to={`/product/${product.id}`} className={styles.productImgLink}>
                                                        <div className={styles.productImgWrapper}>
                                                            <img 
                                                                src={product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'} 
                                                                alt={product.name}
                                                                className={styles.productCardImg}
                                                            />
                                                        </div>
                                                    </Link>

                                                    {/* Card Body */}
                                                    <div className={styles.productCardBody}>
                                                        <span className={styles.productCategoryLabel}>{product.category || 'Luxury Gift'}</span>
                                                        
                                                        <div className={styles.ratingRow}>
                                                            <div className={styles.starCluster}>
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star 
                                                                        key={i} 
                                                                        size={13} 
                                                                        fill="#F5D77F" 
                                                                        color="#D9AF45" 
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className={styles.ratingText}>5.0 ({product.reviewsCount || 28})</span>
                                                        </div>

                                                        <h3 className={styles.productName}>
                                                            <Link to={`/product/${product.id}`}>{product.name}</Link>
                                                        </h3>

                                                        <p className={styles.productShortDesc}>
                                                            {product.shortDescription || product.description || 'Personalized keepsake crafted with studio-grade printing and luxury presentation.'}
                                                        </p>

                                                        {/* Price Row */}
                                                        <div className={styles.priceRow}>
                                                            <span className={styles.currentPrice}>₹{displayPrice.toFixed(2)}</span>
                                                            {hasDiscount && (
                                                                <span className={styles.originalPrice}>₹{regPrice.toFixed(2)}</span>
                                                            )}
                                                        </div>

                                                        {/* Action Button with Magnetic Feel */}
                                                        <div className={styles.cardActions}>
                                                            <MagneticButton strength={0.16} style={{ width: '100%' }}>
                                                                <Link 
                                                                    to={`/product/${product.id}`}
                                                                    className={styles.addToCartBtn}
                                                                >
                                                                    <ShoppingBag size={17} />
                                                                    <span>Select Options</span>
                                                                </Link>
                                                            </MagneticButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SpotlightEffect>
                                        </TiltCard>
                                    </StaggerItem>
                                );
                            })}
                        </StaggerReveal>
                    ) : (
                        <div className={styles.emptyProducts}>
                            <Gift size={48} className={styles.goldGlow} />
                            <h3>No gifts available in this category yet</h3>
                            <p>Explore all available products in our boutique collection.</p>
                            <Link to="/shop" className={styles.exploreAllBtn}>Browse All Products</Link>
                        </div>
                    )}
                </div>
            </AnimatedSection>

            {/* ===================================================
               7. SPECIAL PROMOTIONAL SECTION
            =================================================== */}
            <section 
                className={styles.promoBannerSection}
                style={cms.promoBannerImage ? { backgroundImage: `url(${cms.promoBannerImage})` } : {}}
            >
                <div className={styles.promoBannerOverlay}></div>
                <div className={`container ${styles.promoBannerContainer}`}>
                    <motion.div 
                        className={styles.promoContent}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className={styles.promoBadge}>
                            <Sparkle size={15} /> THE ART OF THOUGHTFUL GIFTING
                        </span>
                        
                        <h2 className={styles.promoHeading}>
                            The Art of Thoughtful Gifting
                        </h2>

                        <p className={styles.promoDesc}>
                            Beautifully selected gifts, designed to make your loved ones feel special. Each bespoke piece is packaged in royal emerald & gold presentation trunks, ready to kindle cherished memories.
                        </p>

                        <MagneticButton strength={0.25}>
                            <Link to="/shop" className={styles.promoCtaBtn}>
                                Explore Premium Gifts <ArrowRight size={18} />
                            </Link>
                        </MagneticButton>
                    </motion.div>
                </div>
            </section>

            {/* ===================================================
               8. PERSONALIZED GIFTING DEDICATED SECTION
            =================================================== */}
            <AnimatedSection className="section-padding">
                <div className="container">
                    <div className={styles.sectionHeaderWrap}>
                        <span className={styles.sectionPreTitle}>BESPOKE CRAFTSMANSHIP</span>
                        <h2 className={styles.mainSectionTitle}>Create Your Personalized Gift</h2>
                        <div className={styles.goldDivider}></div>
                        <p className={styles.sectionLeadText}>
                            Tailor every single detail with personal photographs, engraved family names, special milestones, and luxury accents.
                        </p>
                    </div>

                    <StaggerReveal staggerDuration={0.08} className={styles.personalizedGrid}>
                        <StaggerItem>
                            <TiltCard maxTilt={5} scale={1.02} className={styles.categoryTiltCard}>
                                <div className={styles.personalCard}>
                                    <div className={styles.personalIconWrap}>
                                        <Camera size={30} color="#064A3B" />
                                    </div>
                                    <h3>Customized Photo Frames</h3>
                                    <p>Hand-built wooden and synthetic frames with crystal lamination and gallery UV protection.</p>
                                    <Link to="/shop?category=Personalized%20Gifts" className={styles.personalLink}>
                                        Customize Frame <ChevronRight size={15} />
                                    </Link>
                                </div>
                            </TiltCard>
                        </StaggerItem>

                        <StaggerItem>
                            <TiltCard maxTilt={5} scale={1.02} className={styles.categoryTiltCard}>
                                <div className={styles.personalCard}>
                                    <div className={styles.personalIconWrap}>
                                        <Sparkles size={30} color="#064A3B" />
                                    </div>
                                    <h3>Personalized Ceramic Mugs</h3>
                                    <p>Microwave and dishwasher safe luxury ceramic mugs imprinted with vibrant memories.</p>
                                    <Link to="/shop?category=Personalized%20Gifts" className={styles.personalLink}>
                                        Customize Mug <ChevronRight size={15} />
                                    </Link>
                                </div>
                            </TiltCard>
                        </StaggerItem>

                        <StaggerItem>
                            <TiltCard maxTilt={5} scale={1.02} className={styles.categoryTiltCard}>
                                <div className={styles.personalCard}>
                                    <div className={styles.personalIconWrap}>
                                        <Award size={30} color="#064A3B" />
                                    </div>
                                    <h3>Name Keepsakes & Acrylic Blocks</h3>
                                    <p>Laser cut 3D acrylic blocks with golden text engraving and soft LED ambient illumination.</p>
                                    <Link to="/shop?category=Home%20Decor%20Gifts" className={styles.personalLink}>
                                        Customize Acrylic <ChevronRight size={15} />
                                    </Link>
                                </div>
                            </TiltCard>
                        </StaggerItem>

                        <StaggerItem>
                            <TiltCard maxTilt={5} scale={1.02} className={styles.categoryTiltCard}>
                                <div className={styles.personalCard}>
                                    <div className={styles.personalIconWrap}>
                                        <Gift size={30} color="#064A3B" />
                                    </div>
                                    <h3>Customized Luxury Gift Boxes</h3>
                                    <p>Bespoke hampers customized with favorite treats, scented candles, and personalized notes.</p>
                                    <Link to="/shop?category=Luxury%20Gift%20Hampers" className={styles.personalLink}>
                                        Build Hamper <ChevronRight size={15} />
                                    </Link>
                                </div>
                            </TiltCard>
                        </StaggerItem>
                    </StaggerReveal>

                    <div className={styles.personalizedCtaWrap}>
                        <MagneticButton strength={0.22}>
                            <Link to="/personalized-gifts" className={styles.largeGoldCta}>
                                Create Your Personalized Gift <ArrowRight size={20} />
                            </Link>
                        </MagneticButton>
                    </div>
                </div>
            </AnimatedSection>

            {/* ===================================================
               9. WHY CHOOSE US – 4 LUXURY PILLARS
            =================================================== */}
            <section className={styles.whyChooseSection}>
                <div className="container">
                    <div className={styles.sectionHeaderWrap}>
                        <span className={styles.sectionPreTitle} style={{ color: '#F5D77F' }}>OUR COMMITMENT</span>
                        <h2 className={styles.mainSectionTitle} style={{ color: '#FAF7EF' }}>Why Choose Studio Gift Shop</h2>
                        <div className={styles.goldDivider}></div>
                        <p className={styles.sectionLeadText} style={{ color: 'rgba(250, 247, 239, 0.88)' }}>
                            We pride ourselves on offering an unrivaled gifting experience rooted in quality, presentation, and warmth.
                        </p>
                    </div>

                    <StaggerReveal staggerDuration={0.08} className={styles.whyGrid}>
                        <StaggerItem>
                            <TiltCard maxTilt={4} scale={1.02} className={styles.categoryTiltCard}>
                                <div className={styles.whyCard}>
                                    <div className={styles.whyIconBox}>
                                        <Award size={32} />
                                    </div>
                                    <h3>1. Premium Quality</h3>
                                    <p>Carefully selected gifts with beautiful presentation, studio-grade HD printing, and durable craftsmanship.</p>
                                </div>
                            </TiltCard>
                        </StaggerItem>

                        <StaggerItem>
                            <TiltCard maxTilt={4} scale={1.02} className={styles.categoryTiltCard}>
                                <div className={styles.whyCard}>
                                    <div className={styles.whyIconBox}>
                                        <Gift size={32} />
                                    </div>
                                    <h3>2. Beautiful Packaging</h3>
                                    <p>Every gift deserves an elegant presentation in royal emerald trunks, champagne ribbons, and protective care.</p>
                                </div>
                            </TiltCard>
                        </StaggerItem>

                        <StaggerItem>
                            <TiltCard maxTilt={4} scale={1.02} className={styles.categoryTiltCard}>
                                <div className={styles.whyCard}>
                                    <div className={styles.whyIconBox}>
                                        <ShoppingBag size={32} />
                                    </div>
                                    <h3>3. Easy Shopping</h3>
                                    <p>A simple and convenient online shopping experience with live previews, fast search, and instant checkout.</p>
                                </div>
                            </TiltCard>
                        </StaggerItem>

                        <StaggerItem>
                            <TiltCard maxTilt={4} scale={1.02} className={styles.categoryTiltCard}>
                                <div className={styles.whyCard}>
                                    <div className={styles.whyIconBox}>
                                        <HeartHandshake size={32} />
                                    </div>
                                    <h3>4. Customer Satisfaction</h3>
                                    <p>Making every gifting experience memorable with 100% satisfaction guarantee and dedicated support.</p>
                                </div>
                            </TiltCard>
                        </StaggerItem>
                    </StaggerReveal>
                </div>
            </section>

            {/* ===================================================
               10. CUSTOMER REVIEWS – TESTIMONIAL CAROUSEL
            =================================================== */}
            <AnimatedSection className="section-padding">
                <div className="container">
                    <div className={styles.sectionHeaderWrap}>
                        <span className={styles.sectionPreTitle}>VERIFIED WORDS</span>
                        <h2 className={styles.mainSectionTitle}>What Our Patrons Say</h2>
                        <div className={styles.goldDivider}></div>
                        <p className={styles.sectionLeadText}>
                            Authentic reviews from customers who celebrated their life milestones with Studio Gift Shop.
                        </p>
                    </div>

                    <div className={styles.carouselContainer}>
                        <button 
                            className={styles.carouselArrowBtn} 
                            onClick={prevReview}
                            aria-label="Previous review"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentReviewIdx}
                                className={styles.reviewCard}
                                initial={{ opacity: 0, x: 25 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -25 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className={styles.reviewStarCluster}>
                                    {[...Array(customerReviews[currentReviewIdx].rating)].map((_, i) => (
                                        <Star key={i} size={20} fill="#F5D77F" color="#D9AF45" />
                                    ))}
                                </div>

                                <p className={styles.reviewBody}>
                                    "{customerReviews[currentReviewIdx].text}"
                                </p>

                                <div className={styles.reviewAuthorGroup}>
                                    <h4 className={styles.reviewAuthorName}>
                                        {customerReviews[currentReviewIdx].name}
                                    </h4>
                                    <span className={styles.reviewProductBadge}>
                                        {customerReviews[currentReviewIdx].product} • {customerReviews[currentReviewIdx].date}
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <button 
                            className={styles.carouselArrowBtn} 
                            onClick={nextReview}
                            aria-label="Next review"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Carousel Dots */}
                    <div className={styles.dotsRow}>
                        {customerReviews.map((_, idx) => (
                            <button 
                                key={idx}
                                className={`${styles.dot} ${currentReviewIdx === idx ? styles.activeDot : ''}`}
                                onClick={() => setCurrentReviewIdx(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* ===================================================
               11. NEWSLETTER SECTION
            =================================================== */}
            <AnimatedSection className={styles.newsletterSection}>
                <div className={`container ${styles.newsletterContainer}`}>
                    <div className={styles.newsletterContent}>
                        <span className={styles.newsletterTag}>VIP INSIDER CLUB</span>
                        <h2 className={styles.newsletterHeading}>Stay Inspired. Stay Connected.</h2>
                        <p className={styles.newsletterDesc}>
                            Subscribe to discover exclusive gifts, special offers, and exciting new collections before anyone else.
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
                            <input 
                                type="email"
                                placeholder="Enter your email address..."
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                className={styles.newsletterInput}
                            />
                            <MagneticButton strength={0.2}>
                                <button type="submit" className={styles.newsletterBtn}>
                                    Subscribe <Send size={16} />
                                </button>
                            </MagneticButton>
                        </form>

                        {newsletterMsg && (
                            <p className={newsletterStatus === 'success' ? styles.newsSuccess : styles.newsError}>
                                {newsletterMsg}
                            </p>
                        )}
                    </div>
                </div>
            </AnimatedSection>
        </div>
    );
};

export default Home;
