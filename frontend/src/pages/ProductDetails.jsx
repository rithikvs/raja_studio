import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ShieldCheck, Truck, Clock, Heart, Star, ShoppingBag, Gift } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import PhotoCustomizer from '../components/Customizer/PhotoCustomizer';
import { getProductDisplayPrice, getProductRegularPrice } from '../utils/productUtils';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { products } = useData();
    const { toggleWishlist, isInWishlist } = useCart();

    const product = products.find(p => p.id === id || p.slug === id);

    if (!product) {
        return (
            <div className={`container section-padding ${styles.notFound}`}>
                <div className={styles.notFoundBox}>
                    <Gift size={48} color="#D4AF37" />
                    <h2>Product Not Found</h2>
                    <p>The gift you are looking for does not exist or may have been updated in our catalog.</p>
                    <Link to="/shop" className={styles.backBtn}>
                        <ArrowLeft size={18} /> Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    // Related products in same category or general catalog
    const relatedProducts = products
        .filter(p => p.id !== product.id && p.status !== 'disabled')
        .slice(0, 4);

    return (
        <div className={styles.detailsPage}>
            <div className="container section-padding">
                {/* Breadcrumb / Back Link */}
                <div className={styles.breadcrumbBar}>
                    <Link to="/shop" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to All Collections
                    </Link>
                    <span className={styles.breadcrumbDivider}>/</span>
                    <span className={styles.breadcrumbCurrent}>{product.category}</span>
                    <span className={styles.breadcrumbDivider}>/</span>
                    <span className={styles.breadcrumbProduct}>{product.name}</span>
                </div>

                {/* Customizer Component (Large Gallery, Variants, Price, Add to Cart, Buy Now) */}
                <PhotoCustomizer product={product} />

                {/* Additional Trust Information Cards */}
                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoIconBox}>
                            <ShieldCheck size={26} />
                        </div>
                        <div>
                            <h4>100% Quality Guaranteed</h4>
                            <p>Studio-grade HD prints with crystal acrylic shield & solid luxury framing.</p>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoIconBox}>
                            <Truck size={26} />
                        </div>
                        <div>
                            <h4>Express Doorstep Delivery</h4>
                            <p>Packed in multi-layer velvet packaging and shipped via fast courier partners.</p>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoIconBox}>
                            <Clock size={26} />
                        </div>
                        <div>
                            <h4>Bespoke Atelier Crafting</h4>
                            <p>Artisanal printing, mounting, and gift boxing completed within 24-48 hours.</p>
                        </div>
                    </div>
                </div>

                {/* Full Description & Specifications */}
                {product.fullDescription && (
                    <div className={styles.fullDescBox}>
                        <div className={styles.descHeader}>
                            <Sparkles size={20} color="#D4AF37" />
                            <h3>Product Specifications & Presentation Details</h3>
                        </div>
                        <p>{product.fullDescription}</p>
                    </div>
                )}

                {/* Related Products Showcase */}
                {relatedProducts.length > 0 && (
                    <div className={styles.relatedSection}>
                        <div className={styles.relatedHeader}>
                            <span className={styles.relatedPre}>CURATED FOR YOU</span>
                            <h2>You May Also Adore</h2>
                            <div className={styles.goldLine}></div>
                        </div>

                        <div className={styles.relatedGrid}>
                            {relatedProducts.map(rel => {
                                const relPrice = getProductDisplayPrice(rel);
                                const relRegPrice = getProductRegularPrice(rel);
                                const hasDiscount = relRegPrice > relPrice;

                                return (
                                    <div key={rel.id} className={styles.relatedCard}>
                                        <div className={styles.relatedImgWrapper}>
                                            <img 
                                                src={rel.image || (rel.images && rel.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80'} 
                                                alt={rel.name} 
                                            />
                                            <button 
                                                type="button"
                                                className={styles.relatedWishlistBtn}
                                                onClick={() => toggleWishlist(rel)}
                                                title={isInWishlist(rel.id) ? 'In Wishlist' : 'Add to Wishlist'}
                                            >
                                                <Heart 
                                                    size={16} 
                                                    fill={isInWishlist(rel.id) ? '#D4AF37' : 'none'} 
                                                    color={isInWishlist(rel.id) ? '#D4AF37' : '#064E3B'} 
                                                />
                                            </button>
                                        </div>
                                        <div className={styles.relatedCardBody}>
                                            <span className={styles.relatedCategory}>{rel.category}</span>
                                            <h4><Link to={`/product/${rel.id}`}>{rel.name}</Link></h4>
                                            <div className={styles.relatedPriceRow}>
                                                <span className={styles.relatedCurrentPrice}>₹{relPrice.toFixed(2)}</span>
                                                {hasDiscount && (
                                                    <span className={styles.relatedOldPrice}>₹{relRegPrice.toFixed(2)}</span>
                                                )}
                                            </div>
                                            <Link to={`/product/${rel.id}`} className={styles.relatedSelectBtn}>
                                                <ShoppingBag size={15} /> Select Options
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
