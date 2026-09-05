import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';
import PhotoCustomizer from '../components/Customizer/PhotoCustomizer';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { products } = useData();

    const product = products.find(p => p.id === id || p.slug === id);

    if (!product) {
        return (
            <div className={`container section-padding ${styles.notFound}`}>
                <h2>Product Not Found</h2>
                <p>The product you are looking for does not exist or has been removed by Admin.</p>
                <Link to="/shop" className={styles.backBtn}>
                    <ArrowLeft size={18} /> Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.detailsPage}>
            <div className="container section-padding">
                <Link to="/shop" className={styles.backLink}>
                    <ArrowLeft size={16} /> Back to All Products
                </Link>

                <div className={styles.headerInfo}>
                    <span className={styles.catBadge}>{product.category || 'Personalized Gift'}</span>
                    <h1 className={styles.title}>{product.name}</h1>
                    <p className={styles.shortDesc}>{product.shortDescription || product.description || 'Personalized gift crafted specially with high-quality printing and framing.'}</p>
                </div>

                {/* Customizer Component */}
                <PhotoCustomizer product={product} />

                {/* Additional Information */}
                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <ShieldCheck size={28} color="#B76E79" />
                        <div>
                            <h4>100% Quality Guaranteed</h4>
                            <p>Studio-grade HD prints with acrylic glass & solid wooden frame construction.</p>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <Truck size={28} color="#B76E79" />
                        <div>
                            <h4>Express Delivery Available</h4>
                            <p>Safely packed in multi-layered bubble packaging and shipped via fast courier.</p>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <Clock size={28} color="#B76E79" />
                        <div>
                            <h4>Fast Production Time</h4>
                            <p>Orders are edited, printed, and framed within 24-48 hours of photo submission.</p>
                        </div>
                    </div>
                </div>

                {/* Full Description */}
                {product.fullDescription && (
                    <div className={styles.fullDescBox}>
                        <h3>Product Specifications & Details</h3>
                        <p>{product.fullDescription}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
