import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Filter, Sparkles, Heart, Gift } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { getProductDisplayPrice, getProductRegularPrice } from '../utils/productUtils';
import styles from './Shop.module.css';

const Shop = () => {
    const { products, categories } = useData();
    const { toggleWishlist, isInWishlist } = useCart();
    const location = useLocation();

    // Query Param reader
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category') || 'All';

    // Search & Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [maxPrice, setMaxPrice] = useState(5000);
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const cat = new URLSearchParams(location.search).get('category');
        if (cat) {
            setSelectedCategory(cat);
        }
    }, [location.search]);

    // Active published products only
    const activeProducts = products.filter(p => p.status !== 'disabled');

    const filteredProducts = activeProducts.filter(product => {
        const matchesSearch = (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const displayPrice = getProductDisplayPrice(product);
        const matchesPrice = displayPrice <= maxPrice;
        return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
        if (sortBy === 'price-low') return getProductDisplayPrice(a) - getProductDisplayPrice(b);
        if (sortBy === 'price-high') return getProductDisplayPrice(b) - getProductDisplayPrice(a);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return (
        <div className={styles.shopPage}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1>Explore All Personalized Gifts</h1>
                    <p>Discover handcrafted frames, acrylic gifts, mugs, and customized memory keepsakes.</p>
                </div>
            </div>

            <div className="container section-padding">
                <div className={styles.shopLayout}>
                    {/* Sidebar Filters */}
                    <aside className={styles.sidebar}>
                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}><Filter size={18} /> Search</h3>
                            <div className={styles.searchBox}>
                                <Search size={18} className={styles.searchIcon} />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>Categories</h3>
                            <ul className={styles.categoryList}>
                                <li
                                    className={selectedCategory === 'All' ? styles.activeCat : ''}
                                    onClick={() => setSelectedCategory('All')}
                                >
                                    All Categories ({activeProducts.length})
                                </li>
                                {categories.map(cat => {
                                    const count = activeProducts.filter(p => p.category === cat.name).length;
                                    return (
                                        <li
                                            key={cat.id}
                                            className={selectedCategory === cat.name ? styles.activeCat : ''}
                                            onClick={() => setSelectedCategory(cat.name)}
                                        >
                                            {cat.name} ({count})
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>Max Price: ₹{maxPrice}</h3>
                            <input
                                type="range"
                                min="100"
                                max="10000"
                                step="100"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className={styles.rangeSlider}
                            />
                        </div>
                    </aside>

                    {/* Main Products Grid */}
                    <main className={styles.mainContent}>
                        <div className={styles.toolbar}>
                            <span>Showing {filteredProducts.length} of {activeProducts.length} products</span>
                            <div className={styles.sortBox}>
                                <label>Sort By:</label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className={styles.productsGrid}>
                                {filteredProducts.map(product => (
                                    <div key={product.id} className={styles.productCard}>
                                        <div className={styles.productImageWrapper}>
                                            <img
                                                src={product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'}
                                                alt={product.name}
                                            />
                                        </div>
                                        <div className={styles.productContent}>
                                            <h3 className={styles.productName}>{product.name}</h3>
                                            <div className={styles.priceRow}>
                                                {getProductRegularPrice(product) > 0 && (
                                                    <span className={styles.regularPrice}>₹ {getProductRegularPrice(product).toFixed(2)}</span>
                                                )}
                                                <span className={styles.salePrice}>₹ {getProductDisplayPrice(product).toFixed(2)}</span>
                                            </div>
                                            <Link to={`/product/${product.id}`} className={styles.selectOptionsBtn}>
                                                <ShoppingBag size={16} /> Select options
                                            </Link>
                                            <button
                                                type="button"
                                                className={`${styles.wishlistSubLink} ${isInWishlist(product.id) ? styles.inWishlist : ''}`}
                                                onClick={() => toggleWishlist(product)}
                                            >
                                                <Heart size={16} fill={isInWishlist(product.id) ? '#ff6600' : 'none'} color={isInWishlist(product.id) ? '#ff6600' : '#374151'} />
                                                <span>{isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <Gift size={48} color="#ff6600" />
                                <h3>No matching products found</h3>
                                <p>Try adjusting your search query or category filter.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
