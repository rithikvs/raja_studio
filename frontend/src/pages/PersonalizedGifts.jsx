import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Camera, Gift, Star, ArrowRight, ShieldCheck, Truck, Clock, Palette } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { getProductDisplayPrice, getProductRegularPrice } from '../utils/productUtils';
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
            icon: <Camera size={28} className={styles.giftIconGold} />,
            title: 'Custom Photo Frames',
            description: 'Handcrafted wooden and acrylic luxury frames with museum-grade UV protection and HD printing.',
            features: ['Multiple bespoke sizes', 'Matte, Glossy & Glitter finish', 'Custom text & date engraving']
        },
        {
            icon: <Sparkles size={28} className={styles.giftIconGold} />,
            title: 'Personalized Mugs',
            description: 'Ceramic heirloom mugs with vibrant permanent photo prints and royal metallic interiors.',
            features: ['Microwave & dishwasher safe', 'High-gloss glaze finish', 'Bespoke custom photo & quote']
        },
        {
            icon: <Palette size={28} className={styles.giftIconGold} />,
            title: 'Illuminated LED Keepsakes',
            description: 'Laser-etched optical acrylic displays seated in handcrafted wooden warm LED light bases.',
            features: ['Warm ambient glow', 'USB powered convenience', 'Bespoke name & icon engraving']
        },
        {
            icon: <ShieldCheck size={28} className={styles.giftIconGold} />,
            title: 'Crystal Acrylic Blocks',
            description: 'Ultra-clear freestanding acrylic blocks that magnify your favorite photographic memories.',
            features: ['Water & scratch resistant', 'Diamond-polished bevel edges', 'Modern boutique aesthetic']
        },
        {
            icon: <Clock size={28} className={styles.giftIconGold} />,
            title: 'Bespoke Wall Clocks',
            description: 'Decorative artistic timepieces with personalized photo centers and silent sweep movement.',
            features: ['Silent quartz movement', 'Golden Roman numerals', 'Auspicious home decor']
        },
        {
            icon: <Gift size={28} className={styles.giftIconGold} />,
            title: 'Luxury Gift Hampers',
            description: 'Opulent curated gift trunks packed with customized treats, artisanal candles & personalized cards.',
            features: ['Signature emerald & gold box', 'Hand-tied champagne ribbons', 'Personalized message scroll']
        }
    ];

    return (
        <div className={styles.personalizedPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <div className={`container ${styles.heroContent}`}>
                    <span className={styles.badge}>
                        <Sparkles size={14} /> BESPOKE STUDIO ATELIER
                    </span>
                    <h1>Create Unique Gifts With Your Photos</h1>
                    <p>Transform your cherished memories into luxurious, handcrafted keepsakes that preserve life's finest milestones forever.</p>
                    
                    <div className={styles.heroFeatures}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIconWrap}><Camera size={22} /></div>
                            <span>1. Upload High-Res Photo</span>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIconWrap}><Palette size={22} /></div>
                            <span>2. Customize Options & Name</span>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIconWrap}><Gift size={22} /></div>
                            <span>3. Luxury Doorstep Delivery</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gift Types Grid */}
            <section className="section-padding" style={{ background: '#FFFDF5' }}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.subTitle}>EXCLUSIVE GIFT STYLES</span>
                        <h2 className={styles.mainTitle}>Explore Personalized Gift Collections</h2>
                        <div className={styles.goldDivider}></div>
                        <p className={styles.leadText}>Each gift is handcrafted to order with tailored personal touches and bespoke presentation.</p>
                    </div>

                    <div className={styles.giftTypesGrid}>
                        {giftTypes.map((type, idx) => (
                            <div key={idx} className={styles.giftTypeCard}>
                                <div className={styles.iconCircle}>{type.icon}</div>
                                <h3>{type.title}</h3>
                                <p className={styles.giftDesc}>{type.description}</p>
                                <ul className={styles.featuresList}>
                                    {type.features.map((feature, i) => (
                                        <li key={i}>• {feature}</li>
                                    ))}
                                </ul>
                                <Link to="/shop" className={styles.cardExploreLink}>
                                    Customize Now <ArrowRight size={15} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <section className="section-padding">
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.subTitle}>LIVE PRODUCT CATALOG</span>
                        <h2 className={styles.mainTitle}>Order Your Custom Gift Today</h2>
                        <div className={styles.goldDivider}></div>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className={styles.productsGrid}>
                            {filteredProducts.map((product) => {
                                const displayPrice = getProductDisplayPrice(product);
                                const regPrice = getProductRegularPrice(product);
                                const hasDiscount = regPrice > displayPrice;

                                return (
                                    <div key={product.id} className={styles.productCard}>
                                        <div className={styles.imgWrapper}>
                                            <img 
                                                src={product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'} 
                                                alt={product.name} 
                                            />
                                        </div>
                                        <div className={styles.productInfo}>
                                            <span className={styles.catLabel}>{product.category}</span>
                                            <h4>{product.name}</h4>
                                            <p className={styles.shortDesc}>{product.shortDescription || product.description}</p>
                                            <div className={styles.priceRow}>
                                                <span className={styles.salePrice}>₹{displayPrice.toFixed(2)}</span>
                                                {hasDiscount && (
                                                    <span className={styles.regPrice}>₹{regPrice.toFixed(2)}</span>
                                                )}
                                            </div>
                                            <Link to={`/product/${product.id}`} className={styles.customizeBtn}>
                                                Start Personalizing
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            </section>
        </div>
    );
};

export default PersonalizedGifts;
