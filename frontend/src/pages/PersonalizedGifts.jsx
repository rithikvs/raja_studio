import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Camera, Image as ImageIcon, Gift } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import styles from './PersonalizedGifts.module.css';

const PersonalizedGifts = () => {
    const { products, categories } = useData();
    const { toggleWishlist, isInWishlist } = useCart();
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Filter active products only
    const activeProducts = products.filter(p => p.status !== 'disabled');

    // Filter by category
    const filteredProducts = selectedCategory === 'All' 
        ? activeProducts 
        : activeProducts.filter(p => p.category === selectedCategory);

    const giftTypes = [
        {
            icon: '🖼️',
            title: 'Photo Frames',
            description: 'Premium wooden and acrylic frames with HD printing',
            features: ['Multiple sizes available', 'Matte & glossy finish', 'Custom text engraving']
        },
        {
            icon: '☕',
            title: 'Custom Mugs',
            description: 'Personalized ceramic mugs with vibrant photo prints',
            features: ['Microwave safe', 'Dishwasher friendly', 'High-quality ceramic']
        },
        {
            icon: '💡',
            title: 'LED Gifts',
            description: 'Illuminated acrylic displays with LED base',
            features: ['Multiple color modes', 'USB powered', 'Energy efficient']
        },
        {
            icon: '🎨',
            title: 'Acrylic Prints',
            description: 'Crystal clear acrylic photo displays',
            features: ['Water resistant', 'UV protected', 'Modern aesthetic']
        },
        {
            icon: '🖼️',
            title: 'Photo Collages',
            description: 'Multiple photos beautifully arranged in one frame',
            features: ['Various layouts', 'Family collections', 'Special occasions']
        },
        {
            icon: '🎁',
            title: 'Gift Combos',
            description: 'Bundled personalized gift packages',
            features: ['Special occasions', 'Premium packaging', 'Bulk discounts']
        }
    ];

    return (
        <div className={styles.personalizedPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <div className={`container ${styles.heroContent}`}>
                    <span className={styles.badge}>✨ PERSONALIZED GIFTS</span>
                    <h1>Create Unique Gifts with Your Photos</h1>
                    <p>Transform your cherished memories into beautiful, customized gifts that last forever</p>
                    <div className={styles.heroFeatures}>
                        <div className={styles.featureItem}>
                            <Camera size={24} />
                            <span>Upload Your Photos</span>
                        </div>
                        <div className={styles.featureItem}>
                            <Sparkles size={24} />
                            <span>Customize Design</span>
                        </div>
                        <div className={styles.featureItem}>
                            <Gift size={24} />
                            <span>Get Delivered</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gift Types Grid */}
            <section className="section-padding" style={{ background: '#f9fafb' }}>
                <div className="container">
                    <h2 className="section-title text-center">Explore Personalized Gift Options</h2>
                    <p className="section-subtitle text-center">Choose from our wide range of customizable gifts</p>

                    <div className={styles.giftTypesGrid}>
                        {giftTypes.map((type, idx) => (
                            <div key={idx} className={styles.giftTypeCard}>
                                <div className={styles.giftIcon}>{type.icon}</div>
                                <h3>{type.title}</h3>
                                <p className={styles.giftDesc}>{type.description}</p>
                                <ul className={styles.featuresList}>
                                    {type.features.map((feature, i) => (
                                        <li key={i}>✓ {feature}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section-padding">
                <div className="container">
                    <h2 className="section-title text-center">How to Create Your Gift</h2>
                    <p className="section-subtitle text-center">Simple 4-step process to personalize your gifts</p>

                    <div className={styles.stepsGrid}>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>1</div>
                            <h3>Choose Product</h3>
                            <p>Browse our catalog and select the gift type you want to personalize</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>2</div>
                            <h3>Upload Photo</h3>
                            <p>Upload your high-resolution photos. Our system checks quality automatically</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>3</div>
                            <h3>Customize</h3>
                            <p>Select size, color, finish, and add custom text or messages</p>
                        </div>
                        <div className={styles.step}>
                            <div className={styles.stepNumber}>4</div>
                            <h3>Order & Deliver</h3>
                            <p>Place order and get it delivered safely to your doorstep</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="section-padding" style={{ background: '#f9fafb' }}>
                <div className="container">
                    <h2 className="section-title text-center">Browse Personalized Products</h2>
                    
                    <div className={styles.categoryFilter}>
                        <button 
                            className={selectedCategory === 'All' ? styles.active : ''}
                            onClick={() => setSelectedCategory('All')}
                        >
                            All Products ({activeProducts.length})
                        </button>
                        {categories.map(cat => {
                            const count = activeProducts.filter(p => p.category === cat.name).length;
                            return (
                                <button 
                                    key={cat.id}
                                    className={selectedCategory === cat.name ? styles.active : ''}
                                    onClick={() => setSelectedCategory(cat.name)}
                                >
                                    {cat.name} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className={styles.productsGrid}>
                            {filteredProducts.map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <div className={styles.productImageWrapper}>
                                        <img 
                                            src={product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'} 
                                            alt={product.name} 
                                        />
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
                        <div className={styles.emptyState}>
                            <ImageIcon size={64} color="#cbd5e1" />
                            <h3>No Products in This Category</h3>
                            <p>Check back soon or browse other categories</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section-padding">
                <div className="container">
                    <h2 className="section-title text-center">Why Personalize with Us?</h2>
                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefit}>
                            <div className={styles.benefitIcon}>🎨</div>
                            <h3>HD Quality Printing</h3>
                            <p>Professional-grade printers ensure vibrant colors and sharp details</p>
                        </div>
                        <div className={styles.benefit}>
                            <div className={styles.benefitIcon}>⚡</div>
                            <h3>Fast Production</h3>
                            <p>Orders printed and framed within 24-48 hours</p>
                        </div>
                        <div className={styles.benefit}>
                            <div className={styles.benefitIcon}>📦</div>
                            <h3>Safe Packaging</h3>
                            <p>Multi-layer bubble wrap protection for damage-free delivery</p>
                        </div>
                        <div className={styles.benefit}>
                            <div className={styles.benefitIcon}>✅</div>
                            <h3>Quality Guarantee</h3>
                            <p>100% satisfaction or full refund on defective products</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container text-center">
                    <h2>Ready to Create Your Perfect Gift?</h2>
                    <p>Start customizing your personalized gifts now!</p>
                    <Link to="/shop" className={styles.ctaBtn}>
                        Browse All Products
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default PersonalizedGifts;
