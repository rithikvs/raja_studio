import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(db.getCart());
    const [wishlist, setWishlist] = useState(db.getWishlist());
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    useEffect(() => {
        db.saveCart(cart);
    }, [cart]);

    useEffect(() => {
        db.saveWishlist(wishlist);
    }, [wishlist]);

    const addToCart = (cartItem) => {
        setCart(prev => {
            // Check if exact same product with same customizations exists
            const existingIndex = prev.findIndex(item =>
                item.productId === cartItem.productId &&
                JSON.stringify(item.selectedOptions) === JSON.stringify(cartItem.selectedOptions) &&
                item.customText === cartItem.customText &&
                item.customPhoto === cartItem.customPhoto
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += (cartItem.quantity || 1);
                return updated;
            } else {
                const newItem = {
                    ...cartItem,
                    cartId: 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                    quantity: cartItem.quantity || 1
                };
                return [...prev, newItem];
            }
        });
    };

    const removeFromCart = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(cartId);
            return;
        }
        setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
    };

    const clearCart = () => {
        setCart([]);
        setAppliedCoupon(null);
    };

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.some(item => item.id === product.id);
            if (exists) {
                return prev.filter(item => item.id !== product.id);
            } else {
                return [...prev, product];
            }
        });
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    // Calculate Totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = appliedCoupon ? (
        appliedCoupon.discountType === 'percentage'
            ? Math.round((subtotal * appliedCoupon.discountValue) / 100)
            : Math.min(subtotal, appliedCoupon.discountValue)
    ) : 0;
    const shipping = subtotal > 0 ? (subtotal > 999 ? 0 : 70) : 0;
    const gst = Math.round((subtotal - discountAmount) * 0.18); // 18% GST estimate
    const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

    const applyCoupon = (code) => {
        const coupons = db.getCoupons();
        const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.status === 'active');
        if (!found) {
            return { success: false, message: 'Invalid or expired coupon code.' };
        }
        if (found.minCartValue && subtotal < found.minCartValue) {
            return { success: false, message: `Minimum cart value of ₹${found.minCartValue} required for this coupon.` };
        }
        setAppliedCoupon(found);
        return { success: true, coupon: found, message: `Coupon '${found.code}' applied successfully!` };
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    return (
        <CartContext.Provider value={{
            cart,
            wishlist,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            toggleWishlist,
            isInWishlist,
            subtotal,
            shipping,
            gst,
            discountAmount,
            grandTotal,
            appliedCoupon,
            applyCoupon,
            removeCoupon
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
