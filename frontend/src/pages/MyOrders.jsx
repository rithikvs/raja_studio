import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle, Eye, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import styles from './MyOrders.module.css';

const MyOrders = () => {
    const { customerUser, setLoginModalOpen } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Require login
    useEffect(() => {
        if (!customerUser) {
            alert('Please login to view your orders');
            setLoginModalOpen(true);
            navigate('/shop');
        }
    }, [customerUser, navigate, setLoginModalOpen]);

    const loadOrders = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const { orders: userOrders } = await api('/orders');
            setOrders(userOrders || []);
            console.log(`✅ Loaded ${userOrders?.length || 0} orders`);
        } catch (error) {
            console.error('Failed to load orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (customerUser) {
            loadOrders();
        }
    }, [customerUser]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadOrders(false);
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return <Clock size={18} color="#f59e0b" />;
            case 'confirmed':
                return <CheckCircle size={18} color="#3b82f6" />;
            case 'photo review':
                return <Eye size={18} color="#8b5cf6" />;
            case 'printing':
            case 'ready':
                return <Package size={18} color="#06b6d4" />;
            case 'shipped':
                return <Truck size={18} color="#10b981" />;
            case 'delivered':
                return <CheckCircle size={18} color="#059669" />;
            case 'cancelled':
                return <XCircle size={18} color="#ef4444" />;
            default:
                return <Package size={18} color="#6b7280" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return '#f59e0b';
            case 'confirmed':
                return '#3b82f6';
            case 'photo review':
                return '#8b5cf6';
            case 'printing':
            case 'ready':
                return '#06b6d4';
            case 'shipped':
                return '#10b981';
            case 'delivered':
                return '#059669';
            case 'cancelled':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className={styles.ordersPage}>
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1>My Orders</h1>
                    <p>Track and manage all your personalized gift orders</p>
                </div>
            </div>

            <div className="container section-padding">
                <div className={styles.topBar}>
                    <h2>Order History ({orders.length})</h2>
                    <button 
                        onClick={handleRefresh} 
                        className={styles.refreshBtn}
                        disabled={refreshing}
                    >
                        <RefreshCw size={16} className={refreshing ? styles.spinning : ''} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {orders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Package size={64} color="#cbd5e1" />
                        <h3>No Orders Yet</h3>
                        <p>You haven't placed any orders yet. Start shopping for personalized gifts!</p>
                        <button onClick={() => navigate('/shop')} className={styles.shopBtn}>
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className={styles.ordersList}>
                        {orders.map((order) => (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <div className={styles.orderInfo}>
                                        <h3>Order #{order.id}</h3>
                                        <p className={styles.orderDate}>
                                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className={styles.orderStatus} style={{ color: getStatusColor(order.status) }}>
                                        {getStatusIcon(order.status)}
                                        <span>{order.status}</span>
                                    </div>
                                </div>

                                <div className={styles.orderItems}>
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className={styles.orderItem}>
                                            <div className={styles.itemDetails}>
                                                <h4>{item.productName}</h4>
                                                <p className={styles.itemOptions}>
                                                    {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, value]) => 
                                                        `${key}: ${value}`
                                                    ).join(' • ')}
                                                </p>
                                                {item.customText && (
                                                    <p className={styles.customText}>
                                                        Custom Text: "{item.customText}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className={styles.itemPrice}>
                                                <span className={styles.qty}>Qty: {item.quantity}</span>
                                                <span className={styles.price}>₹{item.price * item.quantity}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {order.images && order.images.length > 0 && (
                                    <div className={styles.orderImages}>
                                        <p className={styles.imagesLabel}>
                                            📷 {order.images.length} photo(s) uploaded
                                        </p>
                                    </div>
                                )}

                                {order.address && (
                                    <div className={styles.deliveryAddress}>
                                        <strong>Delivery Address:</strong>
                                        <p>
                                            {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}
                                        </p>
                                    </div>
                                )}

                                <div className={styles.orderFooter}>
                                    <div className={styles.paymentInfo}>
                                        <span className={styles.paymentMethod}>{order.paymentMethod || 'COD'}</span>
                                        <span className={styles.totalAmount}>
                                            Total: <strong>₹{order.totalAmount}</strong>
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                        className={styles.viewDetailsBtn}
                                    >
                                        {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                                    </button>
                                </div>

                                {/* Expanded Details */}
                                {selectedOrder?.id === order.id && (
                                    <div className={styles.expandedDetails}>
                                        <h4>Order Timeline</h4>
                                        <div className={styles.timeline}>
                                            {order.statusHistory?.map((history, idx) => (
                                                <div key={idx} className={styles.timelineItem}>
                                                    <div className={styles.timelineDot} style={{ backgroundColor: getStatusColor(history.status) }}></div>
                                                    <div className={styles.timelineContent}>
                                                        <strong>{history.status}</strong>
                                                        <p className={styles.timelineDate}>
                                                            {new Date(history.created_at || history.timestamp).toLocaleString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={styles.contactInfo}>
                                            <h4>Contact Information</h4>
                                            <p><strong>Name:</strong> {order.customerName}</p>
                                            <p><strong>Email:</strong> {order.email}</p>
                                            <p><strong>Phone:</strong> {order.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
