import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import styles from './FloatingBasket.module.css';

const FloatingBasket = () => {
    const { cart } = useCart();
    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Link to="/cart" className={styles.basketFloatBtn} title="View Shopping Cart">
            <span className={styles.basketBadge}>{totalCartCount}</span>
            <div className={styles.basketBox}>
                <ShoppingBag size={22} color="#000000" />
            </div>
        </Link>
    );
};

export default FloatingBasket;
