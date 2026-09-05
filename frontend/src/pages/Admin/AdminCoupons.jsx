import React, { useState } from 'react';
import { Tag, Plus, Trash2, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import styles from './AdminCoupons.module.css';

const AdminCoupons = () => {
    const { coupons, addCoupon, deleteCoupon, refreshCoupons } = useData();
    const [refreshing, setRefreshing] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        minCartValue: 499
    });

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            if (refreshCoupons) {
                await refreshCoupons();
            }
        } finally {
            setRefreshing(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.code.trim()) return;
        addCoupon({
            ...formData,
            code: formData.code.toUpperCase().trim()
        });
        setIsModalOpen(false);
        setFormData({ code: '', discountType: 'percentage', discountValue: 10, minCartValue: 499 });
    };

    return (
        <div className={styles.couponsPage}>
            <div className={styles.topHeader}>
                <div>
                    <h1>Discount Coupons & Offers</h1>
                    <p>Create promotional codes for customers to apply at checkout.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={handleRefresh} 
                        className={styles.refreshBtn}
                        disabled={refreshing}
                        title="Refresh Coupons"
                        style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <RefreshCw size={16} className={refreshing ? styles.spinning : ''} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className={styles.addBtn}>
                        <Plus size={18} /> Create New Coupon
                    </button>
                </div>
            </div>

            <div className={styles.grid}>
                {coupons.map(c => (
                    <div key={c.id} className={styles.couponCard}>
                        <div className={styles.couponHeader}>
                            <Tag size={20} className={styles.icon} />
                            <span className={styles.code}>{c.code}</span>
                        </div>
                        <p className={styles.discountText}>
                            {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                        </p>
                        <p className={styles.minVal}>Min Cart Value: ₹{c.minCartValue || 0}</p>
                        <button onClick={() => deleteCoupon(c.id)} className={styles.deleteBtn}>
                            <Trash2 size={14} /> Remove Code
                        </button>
                    </div>
                ))}
            </div>

            {coupons.length === 0 && (
                <div className={styles.emptyState}>
                    <Tag size={48} color="#cbd5e1" />
                    <p>No active coupon codes created yet.</p>
                </div>
            )}

            {isModalOpen && (
                <div className={styles.backdrop} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>Create New Coupon Code</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.group}>
                                <label>Coupon Code *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. RAJA10"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.group}>
                                <label>Discount Type</label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₹)</option>
                                </select>
                            </div>

                            <div className={styles.group}>
                                <label>Discount Value ({formData.discountType === 'percentage' ? '%' : '₹'}) *</label>
                                <input
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className={styles.group}>
                                <label>Minimum Cart Value (₹)</label>
                                <input
                                    type="number"
                                    value={formData.minCartValue}
                                    onChange={(e) => setFormData({ ...formData, minCartValue: Number(e.target.value) })}
                                />
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
                                <button type="submit" className={styles.saveBtn}>Save Coupon</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoupons;
