import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, initDB } from '../services/db';
import { api } from '../services/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [cms, setCms] = useState(db.getCMS());

    const refreshData = async () => {
        try {
            const [{ products: remoteProducts }, ordersResult, customersResult] = await Promise.all([
                api('/admin/products').catch(() => api('/products')), api('/admin/orders').catch(() => api('/orders').catch(() => ({ orders: [] }))), api('/admin/customers').catch(() => ({ customers: [] }))
            ]);
            setProducts(remoteProducts);
            setOrders(ordersResult.orders);
            setCustomers(customersResult.customers);
        } catch {
            // Keeps non-production visual content usable before the API is configured.
            setProducts(db.getProducts()); setOrders([]); setCustomers([]);
        }
        setCategories(db.getCategories());
        setCoupons(db.getCoupons());
        setCms(db.getCMS());
    };

    useEffect(() => {
        initDB();
        refreshData();

        const handleDbChange = (e) => {
            refreshData();
        };

        window.addEventListener('raja_db_change', handleDbChange);
        window.addEventListener('raja_auth_change', handleDbChange);
        window.addEventListener('storage', handleDbChange);

        return () => {
            window.removeEventListener('raja_db_change', handleDbChange);
            window.removeEventListener('raja_auth_change', handleDbChange);
            window.removeEventListener('storage', handleDbChange);
        };
    }, []);

    return (
        <DataContext.Provider value={{
            products,
            categories,
            orders,
            customers,
            coupons,
            cms,
            refreshData,
            // Action shortcuts
            addProduct: async (product) => { 
                const result = await api('/admin/products', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(product) 
                }); 
                // Optimistic update - add immediately without full refresh
                setProducts(prev => [result.product, ...prev]);
                return result.product;
            },
            updateProduct: async (productId, product) => { 
                const result = await api(`/admin/products/${productId}`, { 
                    method: 'PATCH', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(product) 
                }); 
                // Optimistic update - update immediately without full refresh
                setProducts(prev => prev.map(p => p.id === productId ? result.product : p));
                return result.product;
            },
            deleteProduct: async (productId) => { 
                await api(`/admin/products/${productId}`, { method: 'DELETE' }); 
                // Optimistic update - remove immediately without full refresh
                setProducts(prev => prev.filter(p => p.id !== productId));
            },
            addCategory: db.addCategory,
            updateCategory: db.updateCategory,
            deleteCategory: db.deleteCategory,
            addOrder: db.addOrder,
            updateOrderStatus: async (id, status) => { 
                await api(`/admin/orders/${id}/status`, { 
                    method: 'PATCH', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ status }) 
                }); 
                // Optimistic update - update immediately without full refresh
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
            },
            saveCustomer: db.saveCustomer,
            deleteCustomer: db.deleteCustomer,
            addCoupon: db.addCoupon,
            deleteCoupon: db.deleteCoupon,
            saveCMS: db.saveCMS
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
