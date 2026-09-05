import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastFetch, setLastFetch] = useState(null);
    const [refreshingOrders, setRefreshingOrders] = useState(false);
    const [refreshingProducts, setRefreshingProducts] = useState(false);
    const [refreshingCustomers, setRefreshingCustomers] = useState(false);
    
    // Use refs to track if we're on dashboard (only dashboard gets auto-refresh)
    const isDashboardActive = useRef(false);
    const refreshIntervalRef = useRef(null);

    // Fetch orders from MongoDB
    const fetchOrders = async (showLoading = false) => {
        if (showLoading) setLoading(true);
        
        try {
            const token = localStorage.getItem('raja_access_token');
            if (!token) {
                console.log('No admin token available');
                setOrders([]);
                return;
            }

            const response = await fetch('/api/admin/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
                setLastFetch(new Date());
                console.log(`✅ Loaded ${data.orders?.length || 0} orders from MongoDB`);
            } else {
                console.log('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    // Fetch products
    const fetchProducts = async (showLoading = false) => {
        if (showLoading) setRefreshingProducts(true);
        
        try {
            const token = localStorage.getItem('raja_access_token');
            if (!token) return;

            const response = await fetch('/api/admin/products', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data.products || []);
                console.log(`✅ Loaded ${data.products?.length || 0} products`);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            if (showLoading) setRefreshingProducts(false);
        }
    };

    // Fetch customers
    const fetchCustomers = async (showLoading = false) => {
        if (showLoading) setRefreshingCustomers(true);
        
        try {
            const token = localStorage.getItem('raja_access_token');
            if (!token) return;

            const response = await fetch('/api/admin/customers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCustomers(data.customers || []);
                console.log(`✅ Loaded ${data.customers?.length || 0} customers`);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            if (showLoading) setRefreshingCustomers(false);
        }
    };

    // Refresh all data
    const refreshAllData = async (showLoading = false) => {
        await Promise.all([
            fetchOrders(showLoading),
            fetchProducts(),
            fetchCustomers()
        ]);
    };

    // Start auto-refresh for dashboard only (every 10 seconds)
    const startDashboardAutoRefresh = () => {
        if (refreshIntervalRef.current) return; // Already running
        
        console.log('🔄 Starting dashboard auto-refresh every 10 seconds');
        isDashboardActive.current = true;
        
        refreshIntervalRef.current = setInterval(() => {
            if (isDashboardActive.current) {
                console.log('📊 Auto-refreshing dashboard data...');
                fetchOrders(false); // Silent refresh for dashboard
                fetchProducts();
                fetchCustomers();
            }
        }, 10000); // Every 10 seconds for dashboard only
    };

    // Stop auto-refresh when leaving dashboard
    const stopDashboardAutoRefresh = () => {
        console.log('⏸️ Stopping dashboard auto-refresh');
        isDashboardActive.current = false;
        
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }
    };

    // Initial load on mount
    useEffect(() => {
        const token = localStorage.getItem('raja_access_token');
        if (token) {
            refreshAllData(true);
        } else {
            setLoading(false);
        }

        // Cleanup on unmount
        return () => {
            stopDashboardAutoRefresh();
        };
    }, []);

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('raja_access_token');
            const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update local state immediately
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId
                            ? { ...order, status: newStatus }
                            : order
                    )
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating order status:', error);
            return false;
        }
    };

    // Delete order
    const deleteOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('raja_access_token');
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                // Remove from local state immediately
                setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting order:', error);
            return false;
        }
    };

    // Add new order to state (called after order placement)
    const addOrder = (newOrder) => {
        setOrders(prevOrders => [newOrder, ...prevOrders]);
    };

    return (
        <AdminContext.Provider
            value={{
                orders,
                products,
                customers,
                loading,
                refreshingOrders,
                refreshingProducts,
                refreshingCustomers,
                lastFetch,
                fetchOrders,
                fetchProducts,
                fetchCustomers,
                refreshAllData,
                updateOrderStatus,
                deleteOrder,
                addOrder,
                startDashboardAutoRefresh,
                stopDashboardAutoRefresh
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};
