import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Heart, Camera, Gift, ShieldCheck, Truck, Sparkles, Image as ImageIcon, ShoppingBag } from 'lucide-react';
import styles from './Home.module.css';
import Button from '../components/UI/Button';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';

const Home = () => {
    const { products, categories, cms } = useData();
    const { toggleWishlist, isInWishlist } = useCart();

    const activeProducts = products.filter(p => p.status !== 'disabled');
    const featuredProducts = activeProducts.filter(p => p.featured);
    const bestSellers = activeProducts.filter(p => p.bestSeller || p.isBestSeller);
    const newArrivals = activeProducts.slice(0, 4);

    return (
        <div className={styles.home}>
            {/* Announcement Banner */}
            {cms.announcementBanner && (
                <div className={styles.announcementBar}>
                    {cms.announcementBanner}
                </div>
            )}

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <div className={`container ${styles.heroContent}`}>
                    <motion.span
                        className={styles.heroBadge}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        ✨ {cms.giftDivision || 'RAJA GIFTS'}
                    </motion.span>
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        {cms.heroHeadline || 'Turn Your Memories Into Beautiful Gifts'}
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {cms.heroSubheadline || 'Create personalized photo gifts made specially for the people and moments you love.'}
                    </motion.p>
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className={styles.heroButtons}
                    >
                        <Link to="/shop">
                            <Button variant="primary">
                                SHOP NOW <ChevronRight size={18} />
                            </Button>
                        </Link>
                        <Link to="/personalized-gifts">
                            <Button variant="secondary" style={{ backgroundColor: 'white', color: '#4A4036' }}>
                                EXPLORE PERSONALIZED GIFTS
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Intro / Welcome Section */}
            <section className="section-padding">
                <div className="container">
                    <div className={styles.intro} data-aos="fade-up">
                        <h2 className="section-title text-center">Welcome to {cms.businessName || 'RAJA STUDIO'}</h2>
                        <p className="section-subtitle text-center">Customized Photo Frames, Mugs, Acrylic & LED Keepsakes</p>
                        <p className={styles.introText}>
                            At {cms.businessName || 'Raja Studio'}, we specialize in turning your favorite moments into stunning, high-definition physical gifts.
                            From elegant wooden frames and transparent acrylic art to photo mugs and sparkling LED displays, we bring quality and craftsmanship to every order.
                        </p>
                    </div>
                </div>
            </section>

            {/* Shop by Category Section */}
            <section className={styles.featuresSection}>
                <div className="container">
                    <h2 className="section-title text-center" style={{ marginBottom: '0.5rem' }}>Shop by Category</h2>
                    <p className="section-subtitle text-center" style={{ marginBottom: '2rem' }}>Explore our specialized personalized gift categories</p>

                    {categories.length > 0 ? (
                        <div className={styles.categoryGrid}>
                            {categories.map((cat, idx) => (
                                <div key={cat.id || idx} className={styles.categoryCard} data-aos="zoom-in" data-aos-delay={idx * 100}>
                                    <img src={cat.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'} alt={cat.name} />
                                    <div className={styles.categoryOverlay}>
                                        <h3>{cat.name}</h3>
                                        <Link to={`/shop?category=${encodeURIComponent(cat.name)}`}>Explore Collection</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyStateBox}>
                            <ImageIcon size={48} color="#B76E79" />
                            <h3>No categories created yet</h3>
                            <p>Categories added by Admin will appear here instantly.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured / Best Seller Products Grid */}
            <section className="section-padding">
                <div className="container">
                    <div className={styles.sectionHeaderFlex}>
                        <div>
                            <h2 className="section-title">Best Sellers & Featured Gifts</h2>
                            <p className="section-subtitle">Handpicked personalized designs loved by our customers</p>
                        </div>
                        <Link to="/shop" className={styles.viewAllLink}>
                            View All Products <ChevronRight size={16} />
                        </Link>
                    </div>

                    {activeProducts.length > 0 ? (
                        <div className={styles.productsGrid}>
                            {(featuredProducts.length > 0 ? featuredProducts : activeProducts).map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <div className={styles.productImageWrapper}>
                                        <img src={product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'} alt={product.name} />
                                        <button
                                            className={`${styles.wishlistBtn} ${isInWishlist(product.id) ? styles.inWishlist : ''}`}
                                            onClick={() => toggleWishlist(product)}
                                            title="Add to Wishlist"
                                        >
                                            <Heart size={18} fill={isInWishlist(product.id) ? '#B76E79' : 'none'} />
                                        </button>
                                        <span className={styles.customBadge}>✨ Customizable</span>
                                    </div>
                                    <div className={styles.productContent}>
                                        <span className={styles.categoryTag}>{product.category || 'Personalized Gift'}</span>
                                        <h3 className={styles.productName}>{product.name}</h3>
                                        <div className={styles.priceRow}>
                                            <span className={styles.salePrice}>₹{product.salePrice || product.price}</span>
                                            {product.regularPrice && product.regularPrice > (product.salePrice || product.price) && (
                                                <span className={styles.regularPrice}>₹{product.regularPrice}</span>
                                            )}
                                        </div>
                                        <Link to={`/product/${product.id}`} className={styles.customizeBtn}>
                                            <Sparkles size={16} /> Customize & Order
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyStateBox}>
                            <Gift size={48} color="#B76E79" />
                            <h3>No Products Available Currently</h3>
                            <p>Products added by Admin will appear here immediately for customers to browse and order.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            <section className={styles.howItWorksSection}>
                <div className="container">
                    <h2 className="section-title text-center">How It Works</h2>
                    <p className="section-subtitle text-center">4 Simple Steps to Create Your Personalized Gift</p>

                    <div className={styles.stepsGrid}>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>1</div>
                            <Gift size={32} className={styles.stepIcon} />
                            <h3>Choose Product</h3>
                            <p>Select your favorite photo frame, acrylic design, LED display, or mug.</p>
                        </div>

                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>2</div>
                            <Camera size={32} className={styles.stepIcon} />
                            <h3>Upload Your Photo</h3>
                            <p>Upload your original high-res photo and preview quality score live.</p>
                        </div>

                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>3</div>
                            <Sparkles size={32} className={styles.stepIcon} />
                            <h3>Select Custom Options</h3>
                            <p>Choose frame size, color, design, finish, and custom text.</p>
                        </div>

                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>4</div>
                            <Truck size={32} className={styles.stepIcon} />
                            <h3>Fast Doorstep Delivery</h3>
                            <p>We craft, frame, pack, and courier your customized gift safely to your home.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Raja Studio */}
            <section className="section-padding">
                <div className="container">
                    <h2 className="section-title text-center">Why Choose Raja Studio?</h2>
                    <p className="section-subtitle text-center">Premium Quality & Guaranteed Customer Satisfaction</p>

                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitCard}>
                            <ShieldCheck size={36} color="#B76E79" />
                            <h3>Ultra HD Printing</h3>
                            <p>We use studio-grade photo printers ensuring vivid colors, sharp detail, and long-lasting non-fading print quality.</p>
                        </div>
                        <div className={styles.benefitCard}>
                            <Gift size={36} color="#B76E79" />
                            <h3>Custom Framing & Finishes</h3>
                            <p>Hand-built wooden and synthetic frames with matte, glossy, and glitter protective lamination coatings.</p>
                        </div>
                        <div className={styles.benefitCard}>
                            <Truck size={36} color="#B76E79" />
                            <h3>Safe & Express Shipping</h3>
                            <p>Multi-layer bubble wrap gift packaging ensuring your personalized frames arrive safely without scratches or breakage.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className={styles.ctaSection} data-aos="fade-up">
                <div className="container text-center">
                    <h2>Ready to Create a Gift for Someone Special?</h2>
                    <p>Browse our catalog, upload your photos, and place your personalized order in minutes.</p>
                    <Link to="/shop">
                        <Button variant="dark">
                            EXPLORE ALL PRODUCTS NOW
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
