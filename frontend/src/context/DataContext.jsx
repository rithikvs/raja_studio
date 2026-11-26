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
    const [videoSamples, setVideoSamples] = useState(db.getVideoSamples());
    const [designSamples, setDesignSamples] = useState(db.getDesignSamples());

    const refreshData = async () => {
        try {
            // Fetch products (public endpoint /api/products works for everyone, logged in or guest)
            let loadedProducts = [];
            try {
                const res = await api('/products');
                loadedProducts = res.products || [];
            } catch (pErr) {
                try {
                    const res = await api('/admin/products');
                    loadedProducts = res.products || [];
                } catch {
                    loadedProducts = db.getProducts();
                }
            }

            if (!loadedProducts || loadedProducts.length === 0) {
                loadedProducts = db.getProducts();
            }

            setProducts(loadedProducts);
        } catch (err) {
            console.error('Failed to load products:', err);
            setProducts(db.getProducts());
        }

        // Fetch orders and customers if authenticated (non-blocking for guests)
        try {
            const ordersRes = await api('/admin/orders').catch(() => api('/orders').catch(() => ({ orders: [] })));
            setOrders(ordersRes.orders || []);
        } catch {
            setOrders([]);
        }

        try {
            const customersRes = await api('/admin/customers').catch(() => ({ customers: [] }));
            setCustomers(customersRes.customers || []);
        } catch {
            setCustomers([]);
        }

        setCategories(db.getCategories());
        setCoupons(db.getCoupons());
        try {
            const cmsRes = await api('/cms').catch(() => null);
            if (cmsRes && cmsRes.cms && Object.keys(cmsRes.cms).length > 0) {
                db.saveCMS(cmsRes.cms);
                setCms(cmsRes.cms);
            } else {
                setCms(db.getCMS());
            }
        } catch {
            setCms(db.getCMS());
        }
        try {
            const vRes = await api('/videos').catch(() => null);
            if (vRes && vRes.videos && vRes.videos.length > 0) {
                setVideoSamples(vRes.videos);
            } else {
                setVideoSamples(db.getVideoSamples());
            }
        } catch {
            setVideoSamples(db.getVideoSamples());
        }

        try {
            const dRes = await api('/designs').catch(() => null);
            if (dRes && dRes.designs && dRes.designs.length > 0) {
                setDesignSamples(dRes.designs);
            } else {
                setDesignSamples(db.getDesignSamples());
            }
        } catch {
            setDesignSamples(db.getDesignSamples());
        }
    };

    useEffect(() => {
        initDB();
        refreshData();

        const handleDbChange = (e) => {
            if (e?.detail?.key === 'raja_cms') {
                return;
            }
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
            refreshCMS: async () => {
                try {
                    const res = await api('/cms').catch(() => null);
                    if (res && res.cms && Object.keys(res.cms).length > 0) {
                        db.saveCMS(res.cms);
                        setCms(res.cms);
                        return res.cms;
                    }
                } catch (e) {
                    console.warn('refreshCMS fallback to local db:', e);
                }
                const localCms = db.getCMS();
                setCms(localCms);
                return localCms;
            },
            refreshCategories: async () => {
                setCategories(db.getCategories());
            },
            // Action shortcuts
            addProduct: async (product) => { 
                try {
                    const result = await api('/admin/products', { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify(product) 
                    }); 
                    const saved = result.product || product;
                    setProducts(prev => [saved, ...prev]);
                    db.addProduct(saved);
                    return saved;
                } catch (err) {
                    console.warn('API add product fallback to local DB:', err);
                    const saved = db.addProduct(product);
                    setProducts(prev => [saved, ...prev]);
                    return saved;
                }
            },
            updateProduct: async (productId, product) => { 
                try {
                    const result = await api(`/admin/products/${productId}`, { 
                        method: 'PATCH', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify(product) 
                    }); 
                    const saved = result.product || { ...product, id: productId };
                    setProducts(prev => prev.map(p => p.id === productId ? saved : p));
                    db.updateProduct(productId, product);
                    return saved;
                } catch (err) {
                    console.warn('API update product fallback to local DB:', err);
                    db.updateProduct(productId, product);
                    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...product } : p));
                    return { ...product, id: productId };
                }
            },
            deleteProduct: async (productId) => { 
                try {
                    await api(`/admin/products/${productId}`, { method: 'DELETE' }); 
                } catch (err) {
                    console.warn('API delete product fallback to local DB:', err);
                }
                db.deleteProduct(productId);
                setProducts(prev => prev.filter(p => p.id !== productId));
            },
            addCategory: (category) => {
                const newCat = db.addCategory(category);
                setCategories(prev => [...prev, newCat]);
                return newCat;
            },
            updateCategory: (id, fields) => {
                db.updateCategory(id, fields);
                setCategories(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c));
            },
            deleteCategory: (id) => {
                db.deleteCategory(id);
                setCategories(prev => prev.filter(c => c.id !== id));
            },
            addOrder: db.addOrder,
            updateOrderStatus: async (id, status) => { 
                try {
                    await api(`/admin/orders/${id}/status`, { 
                        method: 'PATCH', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify({ status }) 
                    }); 
                } catch (err) {
                    console.warn('API status update fallback to local DB:', err);
                }
                db.updateOrderStatus(id, status);
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
            },
            saveCustomer: db.saveCustomer,
            deleteCustomer: (id) => {
                db.deleteCustomer(id);
                setCustomers(prev => prev.filter(c => c.id !== id));
            },
            addCoupon: (coupon) => {
                const newCoup = db.addCoupon(coupon);
                setCoupons(prev => [...prev, newCoup]);
                return newCoup;
            },
            deleteCoupon: (id) => {
                db.deleteCoupon(id);
                setCoupons(prev => prev.filter(c => c.id !== id));
            },
            saveCMS: async (newCms) => {
                setCms(newCms);
                db.saveCMS(newCms, { skipNotify: true });
                try {
                    const res = await api('/cms', { 
                        method: 'PUT', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify(newCms) 
                    });
                    if (res && res.data) {
                        setCms(res.data);
                        db.saveCMS(res.data, { skipNotify: true });
                        return res.data;
                    }
                } catch (err) {
                    console.warn('API saveCMS fallback to local storage:', err);
                }
                return newCms;
            },
            videoSamples,
            designSamples,
            addVideoSample: async (video) => {
                try {
                    const res = await api('/admin/videos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(video)
                    }).catch(() => null);
                    const saved = res?.video || video;
                    const newVid = db.addVideoSample(saved);
                    setVideoSamples(prev => [newVid, ...prev]);
                    return newVid;
                } catch {
                    const newVid = db.addVideoSample(video);
                    setVideoSamples(prev => [newVid, ...prev]);
                    return newVid;
                }
            },
            updateVideoSample: async (id, fields) => {
                api(`/admin/videos/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fields)
                }).catch(() => {});
                const updated = db.updateVideoSample(id, fields);
                setVideoSamples(prev => prev.map(v => v.id === id ? { ...v, ...fields } : v));
                return updated;
            },
            deleteVideoSample: async (id) => {
                api(`/admin/videos/${id}`, { method: 'DELETE' }).catch(() => {});
                db.deleteVideoSample(id);
                setVideoSamples(prev => prev.filter(v => v.id !== id));
            },
            addDesignSample: async (design) => {
                try {
                    const res = await api('/admin/designs', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(design)
                    }).catch(() => null);
                    const saved = res?.design || design;
                    const newDes = db.addDesignSample(saved);
                    setDesignSamples(prev => [newDes, ...prev]);
                    return newDes;
                } catch {
                    const newDes = db.addDesignSample(design);
                    setDesignSamples(prev => [newDes, ...prev]);
                    return newDes;
                }
            },
            updateDesignSample: async (id, fields) => {
                api(`/admin/designs/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fields)
                }).catch(() => {});
                const updated = db.updateDesignSample(id, fields);
                setDesignSamples(prev => prev.map(d => d.id === id ? { ...d, ...fields } : d));
                return updated;
            },
            deleteDesignSample: async (id) => {
                api(`/admin/designs/${id}`, { method: 'DELETE' }).catch(() => {});
                db.deleteDesignSample(id);
                setDesignSamples(prev => prev.filter(d => d.id !== id));
            }
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
