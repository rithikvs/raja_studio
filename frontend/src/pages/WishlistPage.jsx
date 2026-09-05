import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Sparkles, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './WishlistPage.module.css';

const WishlistPage = () => {
    const { wishlist, toggleWishlist } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className={`container section-padding ${styles.emptyWishlist}`}>
                <Heart size={64} color="#B76E79" />
                <h2>Your Wishlist is Empty</h2>
                <p>Explore our personalized gifts and click the heart icon to save your favorite items.</p>
                <Link to="/shop" className={styles.shopBtn}>
                    <ArrowLeft size={16} /> Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.wishlistPage}>
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1>My Favorite Wishlist ({wishlist.length} items)</h1>
                </div>
            </div>

            <div className="container section-padding">
                <div className={styles.productsGrid}>
                    {wishlist.map(product => (
                        <div key={product.id} className={styles.productCard}>
                            <div className={styles.imageWrapper}>
                                <img src={product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80'} alt={product.name} />
                                <button className={styles.removeBtn} onClick={() => toggleWishlist(product)} title="Remove from Wishlist">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className={styles.cardBody}>
                                <span className={styles.catTag}>{product.category || 'Personalized Gift'}</span>
                                <h3>{product.name}</h3>
                                <p className={styles.price}>₹{product.salePrice || product.price}</p>
                                <Link to={`/product/${product.id}`} className={styles.customizeBtn}>
                                    <Sparkles size={16} /> Customize & Order
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
