import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
    Search, Filter, Sparkles, Heart, Gift, LayoutGrid, List, 
    Star, ArrowRight, ShoppingBag, X, Check, SlidersHorizontal, 
    RotateCcw, ChevronRight
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { getProductDisplayPrice, getProductRegularPrice } from '../utils/productUtils';
import styles from './Shop.module.css';

const Shop = () => {
    const { products, categories } = useData();
    const { toggleWishlist, isInWishlist } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    // Query parameters reader
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category') || 'All';
    const searchParam = queryParams.get('search') || '';
    const filterParam = queryParams.get('filter') || '';

    // Search, Filter & View state
    const [searchQuery, setSearchQuery] = useState(searchParam);
    const [selectedCategory, setSelectedCategory] = useState(categoryParam);
    const [maxPrice, setMaxPrice] = useState(5000);
    const [sortBy, setSortBy] = useState(filterParam === 'bestsellers' ? 'popular' : 'newest');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [filterBestSellersOnly, setFilterBestSellersOnly] = useState(filterParam === 'bestsellers');
    const [filterNewOnly, setFilterNewOnly] = useState(false);
    const [filterFourStarsOnly, setFilterFourStarsOnly] = useState(false);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Sync with location search parameters
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const cat = params.get('category');
        const search = params.get('search');
        const filt = params.get('filter');

        if (cat) setSelectedCategory(cat);
        if (search !== null) setSearchQuery(search);
        if (filt === 'bestsellers') {
            setFilterBestSellersOnly(true);
            setSortBy('popular');
        }
    }, [location.search]);

    // Active published products only
    const activeProducts = products.filter(p => p.status !== 'disabled');

    // Filtering logic
    const filteredProducts = activeProducts.filter(product => {
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch = !query || 
            (product.name || '').toLowerCase().includes(query) ||
            (product.description || '').toLowerCase().includes(query) ||
            (product.shortDescription || '').toLowerCase().includes(query) ||
            (product.category || '').toLowerCase().includes(query);

        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const displayPrice = getProductDisplayPrice(product);
        const matchesPrice = displayPrice <= maxPrice;

        const matchesBestSeller = !filterBestSellersOnly || Boolean(product.bestSeller || product.isBestSeller);
        const matchesNew = !filterNewOnly || Boolean(product.newArrival || product.isNewArrival);
        const matchesRating = !filterFourStarsOnly || Number(product.rating || 5) >= 4;

        return matchesSearch && matchesCategory && matchesPrice && matchesBestSeller && matchesNew && matchesRating;
    }).sort((a, b) => {
        if (sortBy === 'price-low') return getProductDisplayPrice(a) - getProductDisplayPrice(b);
        if (sortBy === 'price-high') return getProductDisplayPrice(b) - getProductDisplayPrice(a);
        if (sortBy === 'popular') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All');
        setMaxPrice(5000);
        setSortBy('newest');
        setFilterBestSellersOnly(false);
        setFilterNewOnly(false);
        setFilterFourStarsOnly(false);
        navigate('/shop');
    };

    // 8 Required Gifting Categories Fallback
    const giftingCategories = categories.length > 0 ? categories : [
        { id: '1', name: 'Birthday Gifts' },
        { id: '2', name: 'Anniversary Gifts' },
        { id: '3', name: 'Personalized Gifts' },
        { id: '4', name: 'Wedding Gifts' },
        { id: '5', name: 'Corporate Gifts' },
        { id: '6', name: 'Luxury Gift Hampers' },
        { id: '7', name: 'Home Decor Gifts' },
        { id: '8', name: 'Festival Gifts' }
    ];

    return (
        <div className={styles.shopPage}>
            {/* Header Banner */}
            <div className={styles.pageHeader}>
                <div className="container">
                    <div className={styles.headerContent}>
                        <span className={styles.headerBadge}>
                            <Sparkles size={14} /> LUXURY BOUTIQUE STORE
                        </span>
                        <h1>Discover Curated Gifts & Keepsakes</h1>
                        <p>Explore handcrafted personalized frames, luxury hampers, crystal acrylic keepsakes & bespoke treasures.</p>
                    </div>
                </div>
            </div>

            <div className="container section-padding">
                {/* Mobile Filter Toggle Button */}
                <div className={styles.mobileFilterToggleBar}>
                    <button 
                        className={styles.mobileFilterBtn}
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    >
                        <Filter size={18} />
                        <span>Filter & Sort Products ({filteredProducts.length})</span>
                    </button>

                    <div className={styles.viewToggle}>
                        <button 
                            className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.activeView : ''}`}
                            onClick={() => setViewMode('grid')}
                            aria-label="Grid view"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button 
                            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.activeView : ''}`}
                            onClick={() => setViewMode('list')}
                            aria-label="List view"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                <div className={styles.shopLayout}>
                    {/* Sidebar Filters */}
                    <aside className={`${styles.sidebar} ${mobileFiltersOpen ? styles.mobileSidebarOpen : ''}`}>
                        <div className={styles.sidebarHeaderMobile}>
                            <h3>Filter Products</h3>
                            <button 
                                className={styles.closeMobileFiltersBtn}
                                onClick={() => setMobileFiltersOpen(false)}
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Search Input Filter */}
                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>
                                <Search size={18} className={styles.goldAccent} /> Search Collection
                            </h3>
                            <div className={styles.searchBox}>
                                <input
                                    type="text"
                                    placeholder="Search by gift name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button 
                                        className={styles.clearSearchBtn}
                                        onClick={() => setSearchQuery('')}
                                        title="Clear search"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>
                                <Gift size={18} className={styles.goldAccent} /> Categories
                            </h3>
                            <ul className={styles.categoryList}>
                                <li
                                    className={selectedCategory === 'All' ? styles.activeCat : ''}
                                    onClick={() => setSelectedCategory('All')}
                                >
                                    <span>All Gifts</span>
                                    <span className={styles.catCount}>({activeProducts.length})</span>
                                </li>
                                {giftingCategories.map(cat => {
                                    const count = activeProducts.filter(p => p.category === cat.name).length;
                                    return (
                                        <li
                                            key={cat.id || cat.name}
                                            className={selectedCategory === cat.name ? styles.activeCat : ''}
                                            onClick={() => setSelectedCategory(cat.name)}
                                        >
                                            <span>{cat.name}</span>
                                            <span className={styles.catCount}>({count})</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Price Range Filter */}
                        <div className={styles.filterSection}>
                            <div className={styles.priceHeader}>
                                <h3 className={styles.filterTitle}>Max Budget: ₹{maxPrice}</h3>
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="5000"
                                step="50"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className={styles.rangeSlider}
                            />
                            <div className={styles.rangeLabels}>
                                <span>₹100</span>
                                <span>₹2500</span>
                                <span>₹5000+</span>
                            </div>
                        </div>

                        {/* Special Filter Checkboxes */}
                        <div className={styles.filterSection}>
                            <h3 className={styles.filterTitle}>
                                <SlidersHorizontal size={18} className={styles.goldAccent} /> Refine Options
                            </h3>
                            <div className={styles.checkboxGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input 
                                        type="checkbox"
                                        checked={filterBestSellersOnly}
                                        onChange={(e) => setFilterBestSellersOnly(e.target.checked)}
                                    />
                                    <span>Best Sellers Only</span>
                                </label>

                                <label className={styles.checkboxLabel}>
                                    <input 
                                        type="checkbox"
                                        checked={filterNewOnly}
                                        onChange={(e) => setFilterNewOnly(e.target.checked)}
                                    />
                                    <span>New Arrivals Only</span>
                                </label>

                                <label className={styles.checkboxLabel}>
                                    <input 
                                        type="checkbox"
                                        checked={filterFourStarsOnly}
                                        onChange={(e) => setFilterFourStarsOnly(e.target.checked)}
                                    />
                                    <span>Top Rated (4★ & Above)</span>
                                </label>
                            </div>
                        </div>

                        {/* Reset Filters Button */}
                        <button onClick={resetFilters} className={styles.resetFiltersBtn}>
                            <RotateCcw size={16} /> Reset All Filters
                        </button>
                    </aside>

                    {/* Main Products Content */}
                    <main className={styles.mainContent}>
                        {/* Top Toolbar */}
                        <div className={styles.toolbar}>
                            <div className={styles.resultsCount}>
                                Showing <strong>{filteredProducts.length}</strong> of {activeProducts.length} curated gifts
                                {selectedCategory !== 'All' && <span className={styles.activeFilterPill}>in {selectedCategory}</span>}
                            </div>

                            <div className={styles.toolbarRight}>
                                {/* Sorting Dropdown */}
                                <div className={styles.sortBox}>
                                    <label>Sort By:</label>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <option value="newest">Newest First</option>
                                        <option value="popular">Popular Products</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                </div>

                                {/* Desktop Grid / List Toggle */}
                                <div className={`${styles.viewToggle} ${styles.desktopOnly}`}>
                                    <button 
                                        className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.activeView : ''}`}
                                        onClick={() => setViewMode('grid')}
                                        title="Grid View"
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button 
                                        className={`${styles.viewBtn} ${viewMode === 'list' ? styles.activeView : ''}`}
                                        onClick={() => setViewMode('list')}
                                        title="List View"
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Cards: Grid or List */}
                        {filteredProducts.length > 0 ? (
                            <div className={viewMode === 'grid' ? styles.productsGrid : styles.productsList}>
                                {filteredProducts.map(product => {
                                    const displayPrice = getProductDisplayPrice(product);
                                    const regPrice = getProductRegularPrice(product);
                                    const hasDiscount = regPrice > displayPrice;
                                    const discountPercent = hasDiscount 
                                        ? Math.round(((regPrice - displayPrice) / regPrice) * 100) 
                                        : 0;

                                    return (
                                        <div 
                                            key={product.id} 
                                            className={viewMode === 'grid' ? styles.productCard : styles.productCardList}
                                        >
                                            {/* Header Badges & Wishlist */}
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

                                                <button 
                                                    type="button"
                                                    className={`${styles.wishlistIconBtn} ${isInWishlist(product.id) ? styles.inWishlist : ''}`}
                                                    onClick={() => toggleWishlist(product)}
                                                    title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                                >
                                                    <Heart 
                                                        size={18} 
                                                        fill={isInWishlist(product.id) ? '#D4AF37' : 'none'} 
                                                        color={isInWishlist(product.id) ? '#D4AF37' : '#064E3B'} 
                                                    />
                                                </button>
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

                                            {/* Product Information */}
                                            <div className={styles.productCardBody}>
                                                <span className={styles.productCategoryLabel}>
                                                    {product.category || 'Luxury Gifting'}
                                                </span>

                                                <div className={styles.ratingRow}>
                                                    <div className={styles.starCluster}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                size={13} 
                                                                fill="#F5C542" 
                                                                color="#F5C542" 
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className={styles.ratingText}>5.0 ({product.reviewsCount || 24})</span>
                                                </div>

                                                <h3 className={styles.productName}>
                                                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                                                </h3>

                                                <p className={styles.productShortDesc}>
                                                    {product.shortDescription || product.description || 'Personalized gift crafted with studio-grade printing and luxury presentation.'}
                                                </p>

                                                <div className={styles.priceRow}>
                                                    <span className={styles.currentPrice}>₹{displayPrice.toFixed(2)}</span>
                                                    {hasDiscount && (
                                                        <span className={styles.originalPrice}>₹{regPrice.toFixed(2)}</span>
                                                    )}
                                                </div>

                                                <div className={styles.cardActions}>
                                                    <Link 
                                                        to={`/product/${product.id}`} 
                                                        className={styles.addToCartBtn}
                                                    >
                                                        <ShoppingBag size={17} />
                                                        <span>Select Options</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIconBox}>
                                    <Gift size={48} color="#D4AF37" />
                                </div>
                                <h3>No Gifts Found</h3>
                                <p>We couldn't find any gifts matching your selected criteria. Try adjusting your search query, budget range, or category filter.</p>
                                <button onClick={resetFilters} className={styles.emptyResetBtn}>
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
