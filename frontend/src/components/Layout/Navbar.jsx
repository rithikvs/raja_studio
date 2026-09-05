import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Heart, User, LogOut, Search, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // EXCLUSIVELY access customerUser for customer header dropdown
    const { customerUser, logoutCustomer, setLoginModalOpen } = useAuth();
    const { cart, wishlist } = useCart();
    const { cms } = useData();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop All', path: '/shop' },
        { name: 'Categories', path: '/categories' },
        { name: 'Personalized Gifts', path: '/personalized-gifts' },
        { name: 'Track Order', path: '/track-order' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`container ${styles.navContainer}`}>
                {/* Brand Logo */}
                <Link to="/" className={styles.logo}>
                    <span className={styles.brandPrimary}>{cms.businessName || 'RAJA STUDIO'}</span>
                    <span className={styles.brandSub}>{cms.giftDivision || 'RAJA GIFTS'}</span>
                </Link>

                {/* Desktop Nav Links */}
                <ul className={styles.desktopMenu}>
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Header Action Icons */}
                <div className={styles.headerActions}>
                    <Link to="/shop" className={styles.iconBtn} title="Search Products">
                        <Search size={20} />
                    </Link>

                    <Link to="/wishlist" className={styles.iconBtn} title="Wishlist">
                        <Heart size={20} />
                        {wishlist.length > 0 && <span className={styles.badge}>{wishlist.length}</span>}
                    </Link>

                    <Link to="/cart" className={styles.iconBtn} title="Shopping Cart">
                        <ShoppingBag size={20} />
                        {totalCartCount > 0 && <span className={styles.badge}>{totalCartCount}</span>}
                    </Link>

                    {/* Customer Account Header Dropdown - ONLY CUSTOMERS */}
                    <div className={styles.userMenuWrapper}>
                        {customerUser ? (
                            <button className={styles.userBtn} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                                <User size={20} />
                                <span className={styles.userName}>{customerUser.name || 'My Account'}</span>
                            </button>
                        ) : (
                            <button className={styles.loginBtn} onClick={() => setLoginModalOpen(true)}>
                                Login
                            </button>
                        )}

                        <AnimatePresence>
                            {userMenuOpen && customerUser && (
                                <motion.div
                                    className={styles.userDropdown}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                >
                                    <div className={styles.userDropdownHeader}>
                                        <p className={styles.userRoleTag}>CUSTOMER</p>
                                        <p className={styles.userEmail}>{customerUser.email}</p>
                                    </div>
                                    <hr />
                                    <Link to="/account" onClick={() => setUserMenuOpen(false)} className={styles.dropdownItem}>
                                        <User size={16} /> My Account Dashboard
                                    </Link>
                                    <Link to="/account/orders" onClick={() => setUserMenuOpen(false)} className={styles.dropdownItem}>
                                        <Package size={16} /> My Orders
                                    </Link>
                                    <button onClick={() => { logoutCustomer(); setUserMenuOpen(false); navigate('/'); }} className={styles.dropdownItemLogout}>
                                        <LogOut size={16} /> Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className={styles.menuToggle} onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={styles.mobileMenu}
                        >
                            <ul>
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <NavLink
                                            to={link.path}
                                            className={({ isActive }) => isActive ? `${styles.mobileLink} ${styles.active}` : styles.mobileLink}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}

                                {customerUser ? (
                                    <>
                                        <li>
                                            <Link to="/account" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                                                My Account Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <button onClick={() => { logoutCustomer(); setIsOpen(false); }} className={styles.mobileBtn}>
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <button onClick={() => { setLoginModalOpen(true); setIsOpen(false); }} className={styles.mobileBtn}>
                                            Login / Register
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
