import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Tag, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './CartPage.module.css';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, subtotal, discountAmount, shipping, gst, grandTotal, appliedCoupon, applyCoupon, removeCoupon } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [couponMsg, setCouponMsg] = useState('');
    const navigate = useNavigate();

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        setCouponMsg('');
        const res = applyCoupon(couponCode);
        setCouponMsg(res.message);
        if (res.success) {
            setCouponCode('');
        }
    };

    if (cart.length === 0) {
        return (
            <div className={`container section-padding ${styles.emptyCartContainer}`}>
                <ShoppingBag size={64} color="#B76E79" />
                <h2>Your Shopping Cart is Empty</h2>
                <p>Looks like you haven't added any customized photo gifts to your cart yet.</p>
                <Link to="/shop" className={styles.continueBtn}>
                    <ArrowLeft size={18} /> Explore Products Now
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.cartPage}>
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1>Your Shopping Cart ({cart.length} items)</h1>
                </div>
            </div>

            <div className="container section-padding">
                <div className={styles.cartLayout}>
                    {/* Items List */}
                    <div className={styles.itemsList}>
                        {cart.map((item) => (
                            <div key={item.cartId} className={styles.cartItemCard}>
                                <div className={styles.itemImageGroup}>
                                    <img src={item.productImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80'} alt={item.productName} className={styles.mainImg} />
                                    {item.customPhoto && (
                                        <div className={styles.customerPhotoThumb} title="Customer Uploaded Photo">
                                            <img src={item.customPhoto} alt="Customer Upload" />
                                            <span className={styles.thumbLabel}>Uploaded Photo</span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.itemDetails}>
                                    <h3>{item.productName}</h3>

                                    {/* Options breakdown */}
                                    {item.selectedOptions && (
                                        <div className={styles.optionsChips}>
                                            {Object.entries(item.selectedOptions).map(([key, val]) => (
                                                <span key={key} className={styles.chip}>
                                                    {key}: <strong>{val}</strong>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {item.customText && (
                                        <p className={styles.customTextNote}>
                                            💬 Custom Text: <em>"{item.customText}"</em>
                                        </p>
                                    )}

                                    {item.giftPacking && <span className={styles.addonBadge}>🎁 Gift Packed (+₹50)</span>}
                                    {item.glitter && <span className={styles.addonBadge}>✨ Glitter Coated (+₹80)</span>}

                                    <div className={styles.priceRow}>
                                        <span className={styles.itemPrice}>₹{item.price}</span>
                                        <div className={styles.qtyControls}>
                                            <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className={styles.removeBtn} onClick={() => removeFromCart(item.cartId)} title="Remove Item">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className={styles.summarySidebar}>
                        <div className={styles.summaryCard}>
                            <h3>Order Summary</h3>

                            {/* Coupon input */}
                            <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                                <div className={styles.couponInputGroup}>
                                    <Tag size={16} className={styles.tagIcon} />
                                    <input
                                        type="text"
                                        placeholder="Coupon Code (e.g. RAJA10)"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <button type="submit">Apply</button>
                                </div>
                                {couponMsg && <p className={styles.couponMsg}>{couponMsg}</p>}
                            </form>

                            {appliedCoupon && (
                                <div className={styles.appliedCouponTag}>
                                    <span>Applied Coupon: <strong>{appliedCoupon.code}</strong></span>
                                    <button onClick={removeCoupon}>Remove</button>
                                </div>
                            )}

                            <hr />

                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className={styles.summaryRow} style={{ color: '#166534' }}>
                                    <span>Discount</span>
                                    <span>-₹{discountAmount}</span>
                                </div>
                            )}

                            <div className={styles.summaryRow}>
                                <span>Estimated Shipping</span>
                                <span>{shipping === 0 ? <strong style={{ color: '#166534' }}>FREE Shipping</strong> : `₹${shipping}`}</span>
                            </div>

                            <div className={styles.summaryRow}>
                                <span>Estimated GST (18%)</span>
                                <span>₹{gst}</span>
                            </div>

                            <hr />

                            <div className={`${styles.summaryRow} ${styles.grandTotalRow}`}>
                                <span>Total Amount</span>
                                <span>₹{grandTotal}</span>
                            </div>

                            <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>
                                PROCEED TO CHECKOUT <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
