import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, DollarSign, Users, TrendingUp, AlertCircle, Eye, Plus, Settings, BarChart3, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAdmin } from '../../context/AdminContext';
import InvoiceModal from '../../components/UI/InvoiceModal';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const { products, orders, customers, categories, coupons, updateOrderStatus } = useData();
    const { refreshAllData, loading, startDashboardAutoRefresh, stopDashboardAutoRefresh } = useAdmin();
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Start auto-refresh only for dashboard
    useEffect(() => {
        console.log('📊 Dashboard mounted - starting auto-refresh');
        startDashboardAutoRefresh();
        
        return () => {
            console.log('📊 Dashboard unmounted - stopping auto-refresh');
            stopDashboardAutoRefresh();
        };
    }, []);

    // Calculate comprehensive business metrics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalCategories = categories.length;
    const activeCoupons = coupons.filter(c => c.status === 'active').length;

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
    const completedOrders = orders.filter(o => o.status === 'Delivered').length;
    
    // Recent activity
    const recentOrders = orders.slice(0, 5);
    const lowStockProducts = products.filter(p => (p.stock || 0) < 5);
    
    // Monthly revenue (simplified - using current month)
    const currentMonth = new Date().getMonth();
    const monthlyOrders = orders.filter(o => new Date(o.createdAt).getMonth() === currentMonth);
    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return (
        <div className={styles.dashboardPage}>
            <div className={styles.header}>
                <div>
                    <h1>Admin Business Control Dashboard</h1>
                    <p>Complete business management, analytics, and operational control for Raja Studio.</p>
                </div>
                <button 
                    onClick={() => refreshAllData(true)} 
                    className={styles.refreshBtn}
                    disabled={loading}
                    title="Refresh All Data"
                    style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <RefreshCw size={16} className={loading ? styles.spinning : ''} />
                    {loading ? 'Refreshing...' : 'Refresh Dashboard'}
                </button>
            </div>

            {/* Primary Business Metrics */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                        <Package size={24} />
                    </div>
                    <div>
                        <h3>{totalProducts}</h3>
                        <p>Total Products</p>
                        <span className={styles.subDetail}>{activeProducts} Active</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <h3>{totalOrders}</h3>
                        <p>Total Orders</p>
                        <span className={styles.subDetail}>{pendingOrders} Pending, {completedOrders} Completed</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h3>₹{totalRevenue.toLocaleString()}</h3>
                        <p>Total Revenue</p>
                        <span className={styles.subDetail}>₹{monthlyRevenue.toLocaleString()} This Month</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <h3>{totalCustomers}</h3>
                        <p>Registered Customers</p>
                        <span className={styles.subDetail}>{totalCategories} Categories, {activeCoupons} Coupons</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions & Management Links */}
            <div className={styles.quickActions}>
                <h2>Quick Business Actions</h2>
                <div className={styles.actionGrid}>
                    <Link to="/admin/products/new" className={styles.actionCard}>
                        <Plus size={20} />
                        <span>Add New Product</span>
                    </Link>
                    <Link to="/admin/categories" className={styles.actionCard}>
                        <Settings size={20} />
                        <span>Manage Categories</span>
                    </Link>
                    <Link to="/admin/orders" className={styles.actionCard}>
                        <ShoppingBag size={20} />
                        <span>View All Orders</span>
                    </Link>
                    <Link to="/admin/customers" className={styles.actionCard}>
                        <Users size={20} />
                        <span>Customer Management</span>
                    </Link>
                    <Link to="/admin/coupons" className={styles.actionCard}>
                        <DollarSign size={20} />
                        <span>Pricing & Coupons</span>
                    </Link>
                    <Link to="/admin/cms" className={styles.actionCard}>
                        <BarChart3 size={20} />
                        <span>Website Content</span>
                    </Link>
                </div>
            </div>

            {/* Business Overview Grid */}
            <div className={styles.overviewGrid}>
                {/* Recent Orders */}
                <div className={styles.sectionCard}>
                    <div className={styles.cardHeader}>
                        <h3>Recent Customer Orders</h3>
                        <Link to="/admin/orders" className={styles.viewAllLink}>View All</Link>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className={styles.tableWrapper}>
                            <table className={styles.compactTable}>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(o => (
                                        <tr key={o.id}>
                                            <td><strong>{o.id}</strong></td>
                                            <td>
                                                <div className={styles.customerInfo}>
                                                    <strong>{o.customerName}</strong>
                                                    <small>{o.phone}</small>
                                                </div>
                                            </td>
                                            <td>
                                                <select
                                                    value={o.status}
                                                    onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                    className={styles.statusSelect}
                                                >
                                                    <option value="Order Received">Order Received</option>
                                                    <option value="Payment Pending">Payment Pending</option>
                                                    <option value="Payment Confirmed">Payment Confirmed</option>
                                                    <option value="Photo Verification">Photo Verification</option>
                                                    <option value="Design / Editing">Design / Editing</option>
                                                    <option value="Printing">Printing</option>
                                                    <option value="Framing / Production">Framing / Production</option>
                                                    <option value="Quality Check">Quality Check</option>
                                                    <option value="Packed">Packed</option>
                                                    <option value="Ready for Pickup">Ready for Pickup</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Out for Delivery">Out for Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                    <option value="Refunded">Refunded</option>
                                                </select>
                                            </td>
                                            <td><strong>₹{o.totalAmount}</strong></td>
                                            <td>
                                                <button onClick={() => setSelectedOrder(o)} className={styles.viewBtn}>
                                                    <Eye size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <ShoppingBag size={32} color="#ccc" />
                            <p>No customer orders yet. Orders will appear here once customers start purchasing.</p>
                        </div>
                    )}
                </div>

                {/* Inventory Alerts */}
                <div className={styles.sectionCard}>
                    <div className={styles.cardHeader}>
                        <h3>Inventory Alerts</h3>
                        <Link to="/admin/products" className={styles.viewAllLink}>Manage</Link>
                    </div>

                    {lowStockProducts.length > 0 ? (
                        <div className={styles.alertList}>
                            {lowStockProducts.slice(0, 5).map(p => (
                                <div key={p.id} className={styles.alertItem}>
                                    <AlertCircle size={16} color="#f59e0b" />
                                    <div>
                                        <strong>{p.name}</strong>
                                        <p>Stock: {p.stock || 0} units</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <Package size={32} color="#10b981" />
                            <p>All products are well stocked!</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedOrder && (
                <InvoiceModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};

export default AdminDashboard;
