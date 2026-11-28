import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Menu, X, ShoppingBag, Heart, User, LogOut, Search, Package, 
    Gift, ChevronDown, Sparkles, Phone, ShieldCheck, ArrowRight,
    SlidersHorizontal, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { MagneticButton } from '../Motion';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
    
    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('All');
    const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
    const searchRef = useRef(null);

    const { customerUser, logoutCustomer, adminUser, logoutAdmin, setLoginModalOpen } = useAuth();
    const { cart, wishlist, subtotal } = useCart();
    const { cms, categories, products } = useData();
    const navigate = useNavigate();
    const location = useLocation();

    // Close menus on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
        setCategoryDropdownOpen(false);
        setSearchSuggestionsOpen(false);
    }, [location.pathname, location.search]);

    // Sticky scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close search suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchSuggestionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        let targetUrl = '/shop?';
        const params = new URLSearchParams();
        if (trimmed) params.set('search', trimmed);
        if (searchCategory && searchCategory !== 'All') params.set('category', searchCategory);
        
        setSearchSuggestionsOpen(false);
        navigate(params.toString() ? `/shop?${params.toString()}` : '/shop');
    };

    // Live search suggestions
    const matchingProducts = searchQuery.trim().length > 1
        ? products.filter(p => 
            p.status !== 'disabled' && 
            (p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
             p.category?.toLowerCase().includes(searchQuery.toLowerCase()))
          ).slice(0, 5)
        : [];

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Personalized Gifts', path: '/personalized-gifts' },
        { name: 'Video Editing', path: '/video-editing' },
        { name: 'Logo & Posters', path: '/logo-poster-editing' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

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
        <header className={styles.headerWrapper}>
            {/* 1. TOP ANNOUNCEMENT BAR */}
            <div className={styles.topBar}>
                <div className={`container ${styles.topBarContainer}`}>
                    <div className={styles.announcementRotator}>
                        <span className={styles.announcementItem}>
                            <Sparkles size={14} className={styles.goldIcon} /> Free delivery on selected orders
                        </span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.announcementItem}>
                            <Gift size={14} className={styles.goldIcon} /> Premium luxury gifting collections
                        </span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.announcementItem}>
                            Special seasonal offers: Use code <strong className={styles.highlightCode}>LED10</strong> for 10% OFF
                        </span>
                    </div>

                    <div className={styles.topBarRight}>
                        <Link to="/track-order" className={styles.topBarLink}>
                            Track Order
                        </Link>
                        <span className={styles.separator}>|</span>
                        <a href={`tel:${cms.phone || '+917708552461'}`} className={styles.topBarLink}>
                            <Phone size={13} /> {cms.phone || '+91 77085 52461'}
                        </a>
                    </div>
                </div>
            </div>

            {/* 2. MAIN HEADER (Logo, Large Search, Actions) */}
            <div className={styles.mainHeader}>
                <div className={`container ${styles.mainHeaderContainer}`}>
                    {/* Mobile Menu Hamburger */}
                    <button 
                        className={styles.mobileMenuToggle} 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>

                    {/* Brand Logo */}
                    <Link to="/" className={styles.brandLogo}>
                        {cms.logoImage ? (
                            <img src={cms.logoImage} alt={cms.businessName || "Studio Gift Shop"} style={{ maxHeight: '42px', maxWidth: '200px', objectFit: 'contain' }} />
                        ) : (
                            <>
                                <div className={styles.logoEmblem}>
                                    <Gift size={26} className={styles.emblemIcon} />
                                </div>
                                <div className={styles.logoTextGroup}>
                                    <span className={styles.logoTitle}>{cms.businessName || 'STUDIO GIFT SHOP'}</span>
                                    <span className={styles.logoTagline}>{cms.giftDivision || 'LUXURY BOUTIQUE GIFTING'}</span>
                                </div>
                            </>
                        )}
                    </Link>

                    {/* Large Nest-style Product Search Bar */}
                    <div className={styles.searchContainer} ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                            <div className={styles.categorySelectWrapper}>
                                <select 
                                    value={searchCategory}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                    className={styles.categorySelect}
                                    aria-label="Filter by category"
                                >
                                    <option value="All">All Categories</option>
                                    {giftingCategories.map((c, i) => (
                                        <option key={c.id || i} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className={styles.selectChevron} />
                            </div>

                            <span className={styles.searchDivider}></span>

                            <input 
                                type="text"
                                placeholder="Search luxury gifts, photo frames, hampers..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setSearchSuggestionsOpen(true);
                                }}
                                onFocus={() => setSearchSuggestionsOpen(true)}
                                className={styles.searchInput}
                            />

                            <MagneticButton strength={0.25}>
                                <button type="submit" className={styles.searchBtn} aria-label="Search">
                                    <Search size={18} />
                                </button>
                            </MagneticButton>
                        </form>

                        {/* Search Live Suggestions */}
                        <AnimatePresence>
                            {searchSuggestionsOpen && matchingProducts.length > 0 && (
                                <motion.div 
                                    className={styles.suggestionsDropdown}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                >
                                    <div className={styles.suggestionsHeader}>
                                        <span>Suggested Gifts</span>
                                        <span className={styles.matchesCount}>{matchingProducts.length} results</span>
                                    </div>
                                    <ul className={styles.suggestionsList}>
                                        {matchingProducts.map((prod) => (
                                            <li key={prod.id}>
                                                <Link 
                                                    to={`/product/${prod.id}`}
                                                    onClick={() => setSearchSuggestionsOpen(false)}
                                                    className={styles.suggestionItem}
                                                >
                                                    <img 
                                                        src={prod.image || (prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&auto=format&fit=crop&q=80'} 
                                                        alt={prod.name}
                                                        className={styles.suggestionThumb}
                                                    />
                                                    <div className={styles.suggestionInfo}>
                                                        <span className={styles.suggestionName}>{prod.name}</span>
                                                        <span className={styles.suggestionCategory}>{prod.category}</span>
                                                    </div>
                                                    <span className={styles.suggestionPrice}>₹{prod.salePrice || prod.price}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link 
                                        to={`/shop?search=${encodeURIComponent(searchQuery)}`}
                                        onClick={() => setSearchSuggestionsOpen(false)}
                                        className={styles.viewAllResultsBtn}
                                    >
                                        View all results <ArrowRight size={14} />
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Action Icons (Account, Wishlist, Cart) */}
                    <div className={styles.headerActions}>
                        {/* Account Menu (Handles both Admin and Customer) */}
                        <div className={styles.userActionWrapper}>
                            {adminUser ? (
                                <button 
                                    className={`${styles.actionBtn} ${styles.adminActionBtn}`} 
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    title="Administrator Control Panel"
                                >
                                    <div className={`${styles.actionIconBadge} ${styles.adminIconBadge}`}>
                                        <ShieldCheck size={22} color="#D4AF37" />
                                    </div>
                                    <div className={styles.actionTextCol}>
                                        <span className={styles.actionSubtext}>Owner</span>
                                        <span className={styles.actionMaintext}>Admin</span>
                                    </div>
                                </button>
                            ) : customerUser ? (
                                <button 
                                    className={styles.actionBtn} 
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    title="My Account"
                                >
                                    <div className={styles.actionIconBadge}>
                                        <User size={22} />
                                    </div>
                                    <div className={styles.actionTextCol}>
                                        <span className={styles.actionSubtext}>Account</span>
                                        <span className={styles.actionMaintext}>{customerUser.name?.split(' ')[0] || 'My Profile'}</span>
                                    </div>
                                </button>
                            ) : (
                                <button 
                                    className={styles.actionBtn} 
                                    onClick={() => setLoginModalOpen(true)}
                                    title="Sign In / Register"
                                >
                                    <div className={styles.actionIconBadge}>
                                        <User size={22} />
                                    </div>
                                    <div className={styles.actionTextCol}>
                                        <span className={styles.actionSubtext}>Sign In</span>
                                        <span className={styles.actionMaintext}>Account</span>
                                    </div>
                                </button>
                            )}

                            {/* User Account / Admin Dropdown */}
                            <AnimatePresence>
                                {userMenuOpen && (adminUser || customerUser) && (
                                    <motion.div
                                        className={styles.accountDropdown}
                                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                    >
                                        {adminUser ? (
                                            <>
                                                <div className={styles.dropdownUserBanner} style={{ background: 'linear-gradient(135deg, #0B3D2E, #064E3B)', borderBottom: '1px solid #D4AF37' }}>
                                                    <p className={styles.dropdownUserName} style={{ color: '#F5C542', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <ShieldCheck size={16} /> Administrator
                                                    </p>
                                                    <p className={styles.dropdownUserEmail} style={{ color: '#e2e8f0' }}>{adminUser.email}</p>
                                                </div>
                                                <div className={styles.dropdownMenuLinks}>
                                                    <Link to="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className={styles.dropdownLink} style={{ fontWeight: 700, color: '#064E3B' }}>
                                                        <ShieldCheck size={16} color="#D4AF37" /> Admin Dashboard
                                                    </Link>
                                                    <Link to="/admin/products" onClick={() => setUserMenuOpen(false)} className={styles.dropdownLink}>
                                                        <Package size={16} /> Products Manager
                                                    </Link>
                                                    <Link to="/admin/orders" onClick={() => setUserMenuOpen(false)} className={styles.dropdownLink}>
                                                        <ShoppingBag size={16} /> Orders & Photos
                                                    </Link>
                                                    <Link to="/admin/media" onClick={() => setUserMenuOpen(false)} className={styles.dropdownLink}>
                                                        <Layers size={16} /> Video & Design Media
                                                    </Link>
                                                    <Link to="/admin/cms" onClick={() => setUserMenuOpen(false)} className={styles.dropdownLink}>
                                                        <SlidersHorizontal size={16} /> Website Content & CMS
                                                    </Link>
                                                    <button 
                                                        onClick={() => { 
                                                            logoutAdmin(); 
                                                            setUserMenuOpen(false); 
                                                            navigate('/'); 
                                                        }} 
                                                        className={styles.dropdownLogoutBtn}
                                                    >
                                                        <LogOut size={16} /> Sign Out Admin
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={styles.dropdownUserBanner}>
                                                    <p className={styles.dropdownUserName}>{customerUser.name || 'Valued Guest'}</p>
                                                    <p className={styles.dropdownUserEmail}>{customerUser.email}</p>
                                                </div>
                                                <div className={styles.dropdownMenuLinks}>
                                                    <Link to="/account" onClick={() => setUserMenuOpen(false)} className={styles.dropdownLink}>
                                                        <User size={16} /> My Account Dashboard
                                                    </Link>
                                                    <Link to="/account/orders" onClick={() => setUserMenuOpen(false)} className={styles.dropdownLink}>
                                                        <Package size={16} /> My Order History
                                                    </Link>
                                                    <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className={styles.dropdownLink}>
                                                        <Heart size={16} /> My Wishlist ({wishlist.length})
                                                    </Link>
                                                    <button 
                                                        onClick={() => { 
                                                            logoutCustomer(); 
                                                            setUserMenuOpen(false); 
                                                            navigate('/'); 
                                                        }} 
                                                        className={styles.dropdownLogoutBtn}
                                                    >
                                                        <LogOut size={16} /> Sign Out
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Wishlist Icon */}
                        <Link to="/wishlist" className={styles.actionBtn} title="View Wishlist">
                            <div className={styles.actionIconBadge}>
                                <Heart size={22} />
                                {wishlist.length > 0 && (
                                    <span className={styles.counterBadge}>{wishlist.length}</span>
                                )}
                            </div>
                            <div className={styles.actionTextCol}>
                                <span className={styles.actionSubtext}>Favorites</span>
                                <span className={styles.actionMaintext}>Wishlist</span>
                            </div>
                        </Link>

                        {/* Shopping Cart Icon with Subtotal */}
                        <Link to="/cart" className={styles.actionBtn} title="View Shopping Cart">
                            <div className={styles.actionIconBadge}>
                                <ShoppingBag size={22} />
                                <motion.span 
                                    key={totalCartCount}
                                    initial={{ scale: 0.6 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 350, damping: 15 }}
                                    className={styles.counterBadge}
                                >
                                    {totalCartCount}
                                </motion.span>
                            </div>
                            <div className={styles.actionTextCol}>
                                <span className={styles.actionSubtext}>Your Cart</span>
                                <span className={styles.actionMaintext}>₹{subtotal.toFixed(0)}</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 3. STICKY NAVIGATION BAR (Deep Emerald Green + Gold Indicators) */}
            <nav className={`${styles.navBar} ${scrolled ? styles.navBarSticky : ''}`}>
                <div className={`container ${styles.navContainer}`}>
                    {/* Browse Categories Mega Dropdown Trigger */}
                    <div 
                        className={styles.browseCategoriesWrapper}
                        onMouseEnter={() => setCategoryDropdownOpen(true)}
                        onMouseLeave={() => setCategoryDropdownOpen(false)}
                    >
                        <button 
                            className={styles.browseCategoriesBtn}
                            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                        >
                            <Layers size={18} />
                            <span>Browse Categories</span>
                            <ChevronDown size={16} className={`${styles.catChevron} ${categoryDropdownOpen ? styles.rotate : ''}`} />
                        </button>

                        {/* Nest-style Mega Dropdown */}
                        <AnimatePresence>
                            {categoryDropdownOpen && (
                                <motion.div 
                                    className={styles.categoryMegaDropdown}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 12 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className={styles.megaGrid}>
                                        {giftingCategories.map((cat, idx) => (
                                            <Link 
                                                key={cat.id || idx}
                                                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                                                className={styles.megaCard}
                                                onClick={() => setCategoryDropdownOpen(false)}
                                            >
                                                <div className={styles.megaCardImg}>
                                                    <img 
                                                        src={cat.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=150&auto=format&fit=crop&q=80'} 
                                                        alt={cat.name} 
                                                    />
                                                </div>
                                                <div className={styles.megaCardContent}>
                                                    <h4>{cat.name}</h4>
                                                    <p>{cat.description || 'Explore premium collections'}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className={styles.megaFooter}>
                                        <Link to="/categories" onClick={() => setCategoryDropdownOpen(false)} className={styles.allCatsLink}>
                                            View All Gift Collections <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Desktop Menu Navigation Links */}
                    <ul className={styles.navMenu}>
                        {navLinks.map((link) => (
                            <li key={link.name} className={styles.navItem}>
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) => 
                                        isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span>{link.name}</span>
                                            {isActive && (
                                                <motion.span 
                                                    layoutId="navActiveGlider"
                                                    className={styles.activeGlider}
                                                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Support Callout on right */}
                    <div className={styles.navSupportCallout}>
                        <ShieldCheck size={18} className={styles.goldIcon} />
                        <span>100% Quality Guarantee</span>
                    </div>
                </div>
            </nav>

            {/* 4. MOBILE SLIDE-OUT DRAWER */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            className={styles.mobileBackdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <motion.aside 
                            className={styles.mobileDrawer}
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        >
                            <div className={styles.mobileDrawerHeader}>
                                <div className={styles.mobileBrand}>
                                    {cms.logoImage ? (
                                        <img src={cms.logoImage} alt={cms.businessName || "Studio Gift Shop"} style={{ maxHeight: '34px', maxWidth: '160px', objectFit: 'contain' }} />
                                    ) : (
                                        <>
                                            <Gift size={24} color="#D4AF37" />
                                            <span>{cms.businessName || 'STUDIO GIFT SHOP'}</span>
                                        </>
                                    )}
                                </div>
                                <button 
                                    className={styles.closeDrawerBtn} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Mobile Search */}
                            <form onSubmit={handleSearchSubmit} className={styles.mobileSearchForm}>
                                <input 
                                    type="text"
                                    placeholder="Search gifts & collections..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={styles.mobileSearchInput}
                                />
                                <button type="submit" className={styles.mobileSearchBtn}>
                                    <Search size={18} />
                                </button>
                            </form>

                            {/* Mobile Links */}
                            <div className={styles.mobileDrawerContent}>
                                <div className={styles.mobileCategorySection}>
                                    <button 
                                        className={styles.mobileCategoryHeader}
                                        onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                                    >
                                        <span>Gift Categories</span>
                                        <ChevronDown size={18} className={mobileCategoryOpen ? styles.rotate : ''} />
                                    </button>
                                    
                                    {mobileCategoryOpen && (
                                        <ul className={styles.mobileCategoryList}>
                                            {giftingCategories.map((c, i) => (
                                                <li key={c.id || i}>
                                                    <Link 
                                                        to={`/shop?category=${encodeURIComponent(c.name)}`}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={styles.mobileCategoryLink}
                                                    >
                                                        {c.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <ul className={styles.mobileNavLinks}>
                                    {navLinks.map((link) => (
                                        <li key={link.name}>
                                            <NavLink
                                                to={link.path}
                                                className={({ isActive }) => 
                                                    isActive ? `${styles.mobileNavLink} ${styles.mobileNavActive}` : styles.mobileNavLink
                                                }
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {link.name}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>

                                {/* Mobile User & Admin Section */}
                                <div className={styles.mobileUserFooter}>
                                    {adminUser ? (
                                        <div className={styles.mobileAdminBanner}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                                                <div style={{ background: '#F5C542', color: '#064E3B', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                                                    <ShieldCheck size={20} />
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#FFFDF5' }}>Store Admin Active</p>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#F5C542', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminUser.email}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <Link 
                                                    to="/admin/dashboard" 
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={styles.mobileAdminDashboardBtn}
                                                >
                                                    <LayoutDashboard size={15} /> Dashboard
                                                </Link>
                                                <Link 
                                                    to="/admin/products" 
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={styles.mobileAdminSubBtn}
                                                >
                                                    <Package size={15} /> Products
                                                </Link>
                                                <Link 
                                                    to="/admin/media" 
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={styles.mobileAdminSubBtn}
                                                >
                                                    <Layers size={15} /> Media
                                                </Link>
                                                <Link 
                                                    to="/admin/cms" 
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={styles.mobileAdminSubBtn}
                                                >
                                                    <SlidersHorizontal size={15} /> CMS
                                                </Link>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    logoutAdmin();
                                                    setMobileMenuOpen(false);
                                                    navigate('/');
                                                }}
                                                className={styles.mobileLogoutBtn}
                                                style={{ color: '#fca5a5' }}
                                            >
                                                <LogOut size={16} /> Sign Out Admin
                                            </button>
                                        </div>
                                    ) : customerUser ? (
                                        <div className={styles.mobileLoggedIn}>
                                            <p className={styles.mobileGreeting}>Signed in as <strong>{customerUser.name}</strong></p>
                                            <Link 
                                                to="/account" 
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={styles.mobileActionBtn}
                                            >
                                                <User size={16} /> Dashboard
                                            </Link>
                                            <Link 
                                                to="/account/orders" 
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={styles.mobileActionBtn}
                                            >
                                                <Package size={16} /> My Orders
                                            </Link>
                                            <button 
                                                onClick={() => {
                                                    logoutCustomer();
                                                    setMobileMenuOpen(false);
                                                    navigate('/');
                                                }}
                                                className={styles.mobileLogoutBtn}
                                            >
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    setLoginModalOpen(true);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className={styles.mobileSignInBtn}
                                            >
                                                <User size={18} /> Sign In / Register
                                            </button>
                                            <div style={{ textAlign: 'center', marginTop: '0.85rem' }}>
                                                <Link 
                                                    to="/admin/login" 
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    style={{ 
                                                        display: 'inline-flex', 
                                                        alignItems: 'center', 
                                                        gap: '6px', 
                                                        fontSize: '0.8rem', 
                                                        color: 'var(--color-champagne-gold)', 
                                                        fontWeight: 700, 
                                                        textDecoration: 'none' 
                                                    }}
                                                >
                                                    <ShieldCheck size={14} /> Administrator Portal Login →
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
