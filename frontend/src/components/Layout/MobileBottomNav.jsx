import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './MobileBottomNav.module.css';

const MobileBottomNav = () => {
    const { cart, wishlist } = useCart();
    const { customerUser, setLoginModalOpen } = useAuth();
    const navigate = useNavigate();

    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleAccountClick = (e) => {
        if (!customerUser) {
            e.preventDefault();
            setLoginModalOpen(true);
        }
    };

    return (
        <div className={styles.bottomNavContainer}>
            <NavLink
                to="/shop"
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                <ShoppingBag size={20} />
                <span className={styles.label}>Shop</span>
            </NavLink>

            <NavLink
                to="/wishlist"
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                <div className={styles.iconWrapper}>
                    <Heart size={20} />
                    <span className={styles.badge}>{wishlist.length}</span>
                </div>
                <span className={styles.label}>Wishlist</span>
            </NavLink>

            <NavLink
                to="/shop"
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                <Search size={20} />
                <span className={styles.label}>Search</span>
            </NavLink>

            <NavLink
                to="/cart"
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                <div className={styles.iconWrapper}>
                    <ShoppingCart size={20} />
                    <span className={styles.badge}>{totalCartCount}</span>
                </div>
                <span className={styles.label}>Cart</span>
            </NavLink>

            <NavLink
                to="/account"
                onClick={handleAccountClick}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                <User size={20} />
                <span className={styles.label}>My Account</span>
            </NavLink>
        </div>
    );
};

export default MobileBottomNav;
