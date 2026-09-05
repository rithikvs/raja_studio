import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';
import { useData } from '../context/DataContext';
import styles from './Categories.module.css';

const Categories = () => {
    const { categories, products } = useData();
    const activeProducts = products.filter(p => p.status !== 'disabled');

    // Get product count for each category
    const getCategoryCount = (categoryName) => {
        return activeProducts.filter(p => p.category === categoryName).length;
    };

    return (
        <div className={styles.categoriesPage}>
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1>Product Categories</h1>
                    <p>Browse our curated collection of personalized gift categories</p>
                </div>
            </div>

            <div className="container section-padding">
                {categories.length > 0 ? (
                    <div className={styles.categoriesGrid}>
                        {categories.map((category) => {
                            const productCount = getCategoryCount(category.name);
                            return (
                                <Link 
                                    key={category.id} 
                                    to={`/shop?category=${encodeURIComponent(category.name)}`}
                                    className={styles.categoryCard}
                                >
                                    <div className={styles.categoryImage}>
                                        {category.image ? (
                                            <img src={category.image} alt={category.name} />
                                        ) : (
                                            <div className={styles.placeholderImage}>
                                                <Package size={48} color="#B76E79" />
                                            </div>
                                        )}
                                        <div className={styles.overlay}>
                                            <span className={styles.exploreBtn}>
                                                Explore <ChevronRight size={18} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.categoryInfo}>
                                        <h3>{category.name}</h3>
                                        <p className={styles.productCount}>
                                            {productCount} {productCount === 1 ? 'Product' : 'Products'}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <Package size={64} color="#cbd5e1" />
                        <h3>No Categories Available</h3>
                        <p>Categories will be added by the admin soon.</p>
                        <Link to="/shop" className={styles.shopBtn}>
                            Browse All Products
                        </Link>
                    </div>
                )}

                {/* Quick Links */}
                <div className={styles.quickLinks}>
                    <h2>Quick Navigation</h2>
                    <div className={styles.linksGrid}>
                        <Link to="/shop" className={styles.quickLink}>
                            <Package size={24} />
                            <span>All Products</span>
                        </Link>
                        <Link to="/personalized-gifts" className={styles.quickLink}>
                            <Package size={24} />
                            <span>Personalized Gifts</span>
                        </Link>
                        <Link to="/track-order" className={styles.quickLink}>
                            <Package size={24} />
                            <span>Track Order</span>
                        </Link>
                        <Link to="/contact" className={styles.quickLink}>
                            <Package size={24} />
                            <span>Contact Us</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
