import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, DollarSign, QrCode, Building, CheckCircle, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { api } from '../services/api';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
    const { cart, grandTotal, subtotal, discountAmount, shipping, gst, clearCart } = useCart();
    const { customerUser, addresses, loadAddresses, setLoginModalOpen } = useAuth();
    const { cms, addOrder, coupons } = useData();
    const navigate = useNavigate();

    // Require login to access checkout
    useEffect(() => {
        if (!customerUser) {
            alert('Please login to proceed with checkout');
            setLoginModalOpen(true);
            navigate('/shop');
        }
    }, [customerUser, navigate, setLoginModalOpen]);

    const [formData, setFormData] = useState({
        customerName: customerUser?.name || '',
        phone: customerUser?.phone || '',
        email: customerUser?.email || '',
        street: '',
        city: '',
        state: 'Tamil Nadu',
        pincode: '',
        landmark: '',
        orderNotes: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [submitting, setSubmitting] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    
    // Coupon state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);

    // Load addresses when component mounts
    useEffect(() => {
        if (customerUser && addresses.length === 0) {
            console.log('Loading addresses for user...');
            loadAddresses();
        }
    }, [customerUser]);

    // Load first saved address when addresses are available
    useEffect(() => {
        console.log('Addresses updated:', addresses.length);
        
        if (addresses && addresses.length > 0) {
            if (!selectedAddressId) {
                const firstAddress = addresses[0];
                console.log('Auto-selecting first address:', firstAddress);
                setSelectedAddressId(firstAddress._id);
                setFormData(prev => ({
                    ...prev,
                    street: firstAddress.address_line_1 || '',
                    city: firstAddress.city || '',
                    state: firstAddress.state || 'Tamil Nadu',
                    pincode: firstAddress.postal_code || '',
                    landmark: firstAddress.address_line_2 || ''
                }));
                setShowNewAddressForm(false);
            }
        } else if (addresses && addresses.length === 0) {
            console.log('No saved addresses, showing new address form');
            setShowNewAddressForm(true);
        }
    }, [addresses]);

    // Handle address selection
    const handleAddressSelect = (e) => {
        const addressId = e.target.value;
        setSelectedAddressId(addressId);

        if (addressId === 'new') {
            setShowNewAddressForm(true);
            setFormData(prev => ({
                ...prev,
                street: '',
                city: '',
                state: 'Tamil Nadu',
                pincode: '',
                landmark: ''
            }));
        } else {
            setShowNewAddressForm(false);
            const address = addresses.find(a => a._id === addressId);
            if (address) {
                setFormData(prev => ({
                    ...prev,
                    street: address.address_line_1 || '',
                    city: address.city || '',
                    state: address.state || 'Tamil Nadu',
                    pincode: address.postal_code || '',
                    landmark: address.address_line_2 || ''
                }));
            }
        }
    };

    if (cart.length === 0) {
        return (
            <div className={`container section-padding ${styles.emptyState}`}>
                <h2>No items in checkout</h2>
                <p>Please add products to your cart before proceeding to checkout.</p>
                <button onClick={() => navigate('/shop')} className={styles.shopBtn}>Go to Shop</button>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Coupon handling functions
    const handleApplyCoupon = () => {
        setCouponError('');
        const code = couponCode.trim().toUpperCase();
        
        if (!code) {
            setCouponError('Please enter a coupon code');
            return;
        }

        // Find matching coupon
        const coupon = coupons.find(c => c.code === code && c.status === 'active');
        
        if (!coupon) {
            setCouponError('Invalid coupon code');
            return;
        }

        // Check minimum cart value
        if (subtotal < (coupon.minCartValue || 0)) {
            setCouponError(`Minimum cart value of ₹${coupon.minCartValue} required`);
            return;
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = Math.round((subtotal * coupon.discountValue) / 100);
        } else {
            discount = coupon.discountValue;
        }

        // Apply coupon
        setAppliedCoupon(coupon);
        setCouponDiscount(discount);
        setCouponError('');
        alert(`✅ Coupon applied successfully! You saved ₹${discount}`);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode('');
        setCouponError('');
    };

    // Calculate final total with coupon discount
    const finalSubtotal = subtotal - couponDiscount;
    const finalGst = Math.round(finalSubtotal * 0.18);
    const finalGrandTotal = finalSubtotal + shipping + finalGst;

    const createOrderData = (payment = paymentMethod) => ({
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            landmark: formData.landmark,
            country: 'India'
        },
        items: cart.map(item => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions || {},
            customText: item.customText || ''
        })),
        totalAmount: finalGrandTotal,
        paymentMethod: payment
    });

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            // Validate required fields
            if (!formData.customerName || !formData.phone || !formData.email) {
                alert('Please fill in all required fields: Name, Phone, and Email.');
                setSubmitting(false);
                return;
            }

            const orderData = createOrderData();
            
            // Always try to send to MongoDB Atlas API first
            const token = localStorage.getItem('raja_access_token');
            console.log('Placing order to MongoDB Atlas...');
            console.log('Auth token present:', !!token);
            console.log('Customer user:', customerUser);
            
            const formDataToSend = new FormData();
            formDataToSend.append('order', JSON.stringify(orderData));
            
            // Add any uploaded images
            cart.forEach((item, index) => {
                if (item.customPhotoFile) {
                    formDataToSend.append(`image_${index}`, item.customPhotoFile);
                }
            });

            // Use centralized API with correct base URL
            const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
            const response = await fetch(`${baseUrl}/api/orders`, {
                method: 'POST',
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : {},
                body: formDataToSend
            });

            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', errorData);
                throw new Error(errorData.message || `Failed to place order (Status: ${response.status})`);
            }

            const result = await response.json();
            console.log('✅ Order successfully placed to MongoDB Atlas:', result.order.id);
            
            // Clear cart after successful order
            clearCart();
            
            // Reload addresses to include the new one
            if (selectedAddressId === 'new' || showNewAddressForm) {
                await loadAddresses();
            }
            
            // Navigate to success page
            navigate(`/order-success/${result.order.id}`);
            
        } catch (error) {
            console.error('❌ Order placement error:', error);
            alert(`Failed to place order: ${error.message}\n\nPlease try again or contact support.`);
            setSubmitting(false);
        }
    };

    const handleWhatsAppOrder = async () => {
        try {
            // Create order data for WhatsApp
            const orderData = createOrderData('WhatsApp Order');
            
            // Save order to local storage
            const savedOrder = addOrder(orderData);
            
            // Create WhatsApp message
            const message = `🎁 New Order from ${formData.customerName}
            
Order ID: ${savedOrder.id}
Phone: ${formData.phone}
Email: ${formData.email}

Items:
${cart.map(item => `• ${item.productName} (Qty: ${item.quantity}) - ₹${item.price}`).join('\n')}

Subtotal: ₹${subtotal}
${appliedCoupon ? `Coupon (${appliedCoupon.code}): -₹${couponDiscount}\n` : ''}Shipping: ₹${shipping}
GST: ₹${finalGst}
Total Amount: ₹${finalGrandTotal}

Delivery Address:
${formData.street}
${formData.city}, ${formData.state} - ${formData.pincode}

Payment: Cash on Delivery
${formData.orderNotes ? `Notes: ${formData.orderNotes}` : ''}`;

            const whatsappUrl = `https://wa.me/${cms.whatsapp || '919876543210'}?text=${encodeURIComponent(message)}`;
            
            // Clear cart
            clearCart();
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Navigate to success page
            navigate(`/order-success/${savedOrder.id}`);
            
        } catch (error) {
            console.error('Error creating WhatsApp order:', error);
            alert('There was an error creating your order. Please try again.');
        }
    };

    return (
        <div className={styles.checkoutPage}>
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1>Checkout</h1>
                    <p>Review your order and provide delivery details</p>
                </div>
            </div>

            <div className="container section-padding">
                <div className={styles.checkoutLayout}>
                    {/* Left Column - Forms */}
                    <div className={styles.leftColumn}>
                        {/* Customer Information */}
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <ShieldCheck size={20} />
                                Customer Information
                            </h3>
                            
                            <form onSubmit={handlePlaceOrder}>
                                <div className={styles.formGrid}>
                                    <div className={styles.inputGroup}>
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className={styles.inputGroup}>
                                        <label>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                        <label>Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Delivery Address */}
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <Truck size={20} />
                                Delivery Address
                            </h3>
                            
                            {/* Address Selector */}
                            {addresses && addresses.length > 0 && (
                                <div className={styles.inputGroup} style={{ marginBottom: '1rem' }}>
                                    <label>Select Saved Address</label>
                                    <select value={selectedAddressId} onChange={handleAddressSelect} className={styles.addressSelect}>
                                        {addresses.map(addr => (
                                            <option key={addr._id} value={addr._id}>
                                                {addr.address_line_1}, {addr.city} - {addr.postal_code}
                                            </option>
                                        ))}
                                        <option value="new">+ Add New Address</option>
                                    </select>
                                </div>
                            )}
                            
                            {/* Address Form */}
                            {(showNewAddressForm || addresses.length === 0) && (
                                <div className={styles.formGrid}>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Street Address *</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className={styles.inputGroup}>
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className={styles.inputGroup}>
                                    <label>PIN Code *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                <div className={styles.inputGroup}>
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div className={styles.inputGroup}>
                                    <label>Landmark (Optional)</label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={formData.landmark}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Order Notes / Custom Instructions</label>
                                    <textarea
                                        name="orderNotes"
                                        value={formData.orderNotes}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Any special instructions for your order..."
                                    />
                                </div>
                            </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <CreditCard size={20} />
                                Payment Method
                            </h3>
                            
                            <div className={styles.paymentMethodsGrid}>
                                <label className={`${styles.paymentOption} ${paymentMethod === 'UPI' ? styles.activePayment : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="UPI"
                                        checked={paymentMethod === 'UPI'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <QrCode size={24} />
                                    <div>
                                        <strong>UPI Payment</strong>
                                        <p>Pay using Google Pay, PhonePe, Paytm, or any UPI app</p>
                                    </div>
                                </label>
                                
                                <label className={`${styles.paymentOption} ${paymentMethod === 'COD' ? styles.activePayment : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <DollarSign size={24} />
                                    <div>
                                        <strong>Cash on Delivery</strong>
                                        <p>Pay when you receive your personalized gift</p>
                                    </div>
                                </label>
                                
                                <label className={`${styles.paymentOption} ${paymentMethod === 'Card' ? styles.activePayment : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Card"
                                        checked={paymentMethod === 'Card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <CreditCard size={24} />
                                    <div>
                                        <strong>Credit/Debit Card</strong>
                                        <p>Pay securely with your bank card</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className={styles.summaryCard}>
                        <h3>Order Summary</h3>
                        
                        <div className={styles.itemsPreviewList}>
                            {cart.map((item, index) => (
                                <div key={index} className={styles.itemRow}>
                                    <img src={item.productImage} alt={item.productName} />
                                    <div className={styles.itemInfo}>
                                        <div className={styles.itemName}>{item.productName}</div>
                                        <div className={styles.itemQty}>
                                            Qty: {item.quantity}
                                            {item.selectedOptions && (
                                                <span> • {Object.entries(item.selectedOptions).map(([key, value]) => 
                                                    `${key}: ${value}`
                                                ).join(', ')}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.itemTotal}>₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>
                        
                        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0' }} />
                        
                        {/* Coupon Code Section */}
                        <div className={styles.couponSection}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#4A4036' }}>Apply Coupon Code</h4>
                            {!appliedCoupon ? (
                                <div className={styles.couponInputRow}>
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className={styles.couponInput}
                                        style={{
                                            flex: 1,
                                            padding: '0.6rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '4px',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className={styles.applyBtn}
                                        style={{
                                            padding: '0.6rem 1rem',
                                            backgroundColor: '#B76E79',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.appliedCoupon} style={{
                                    padding: '0.75rem',
                                    backgroundColor: '#d1fae5',
                                    border: '1px solid #10b981',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <span style={{ fontWeight: '600', color: '#065f46' }}>
                                            {appliedCoupon.code}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: '#047857', marginLeft: '0.5rem' }}>
                                            (-₹{couponDiscount})
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleRemoveCoupon}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#dc2626',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                            {couponError && (
                                <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: 0 }}>
                                    {couponError}
                                </p>
                            )}
                        </div>
                        
                        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0' }} />
                        
                        <div className={styles.summaryRow}>
                            <span>Subtotal:</span>
                            <span>₹{subtotal}</span>
                        </div>
                        
                        {couponDiscount > 0 && (
                            <div className={styles.summaryRow}>
                                <span>Coupon Discount:</span>
                                <span style={{ color: '#10b981' }}>-₹{couponDiscount}</span>
                            </div>
                        )}
                        
                        {discountAmount > 0 && (
                            <div className={styles.summaryRow}>
                                <span>Other Discount:</span>
                                <span style={{ color: '#10b981' }}>-₹{discountAmount}</span>
                            </div>
                        )}
                        
                        <div className={styles.summaryRow}>
                            <span>Shipping:</span>
                            <span>₹{shipping}</span>
                        </div>
                        
                        <div className={styles.summaryRow}>
                            <span>GST (18%):</span>
                            <span>₹{finalGst}</span>
                        </div>
                        
                        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1rem 0' }} />
                        
                        <div className={styles.summaryRow}>
                            <span className={styles.grandTotal}>Grand Total:</span>
                            <span className={styles.grandTotal}>₹{finalGrandTotal}</span>
                        </div>
                        
                        <button
                            onClick={handlePlaceOrder}
                            className={styles.placeOrderBtn}
                            disabled={submitting}
                        >
                            <CheckCircle size={20} />
                            {submitting ? 'Placing Order...' : 'Place Order'}
                        </button>
                        
                        <button
                            onClick={handleWhatsAppOrder}
                            className={styles.whatsappBtn}
                            disabled={submitting}
                        >
                            <MessageCircle size={18} />
                            Order via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;