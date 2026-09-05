import React, { useState } from 'react';
import { Save, CheckCircle, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import styles from './AdminCMS.module.css';

const AdminCMS = () => {
    const { cms, saveCMS, refreshCMS } = useData();

    const [formData, setFormData] = useState(cms);
    const [savedMsg, setSavedMsg] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            if (refreshCMS) {
                await refreshCMS();
                setFormData(cms); // Update form with refreshed data
            }
        } finally {
            setRefreshing(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        saveCMS(formData);
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 2500);
    };

    return (
        <div className={styles.cmsPage}>
            <div className={styles.header}>
                <div>
                    <h1>Website Content & CMS Management</h1>
                    <p>Modify store branding, contact info, hero banners, and social links in real time.</p>
                </div>
                <button 
                    onClick={handleRefresh} 
                    className={styles.refreshBtn}
                    disabled={refreshing}
                    title="Refresh CMS Data"
                    style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <RefreshCw size={16} className={refreshing ? styles.spinning : ''} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {savedMsg && (
                <div className={styles.successAlert}>
                    <CheckCircle size={18} /> Website CMS settings updated and published live!
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.cmsForm}>
                {/* Brand Details */}
                <div className={styles.card}>
                    <h2>Store Branding & Names</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Primary Business Name</label>
                            <input type="text" name="businessName" value={formData.businessName || ''} onChange={handleChange} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Gift Division Tag</label>
                            <input type="text" name="giftDivision" value={formData.giftDivision || ''} onChange={handleChange} />
                        </div>
                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>Tagline</label>
                            <input type="text" name="tagline" value={formData.tagline || ''} onChange={handleChange} />
                        </div>
                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>Announcement Bar Banner Text</label>
                            <input type="text" name="announcementBanner" value={formData.announcementBanner || ''} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Hero Section Banner */}
                <div className={styles.card}>
                    <h2>Homepage Hero Banner Text</h2>
                    <div className={styles.formGrid}>
                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>Hero Headline</label>
                            <input type="text" name="heroHeadline" value={formData.heroHeadline || ''} onChange={handleChange} />
                        </div>
                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>Hero Subheadline</label>
                            <textarea rows="2" name="heroSubheadline" value={formData.heroSubheadline || ''} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className={styles.card}>
                    <h2>Studio Contact Information</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Customer Support Phone</label>
                            <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>WhatsApp Number (without +)</label>
                            <input type="text" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                        </div>
                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>Studio Physical Address</label>
                            <textarea rows="2" name="address" value={formData.address || ''} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className={styles.card}>
                    <h2>Social Media Links</h2>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Instagram URL</label>
                            <input type="text" name="instagram" value={formData.instagram || ''} onChange={handleChange} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Facebook URL</label>
                            <input type="text" name="facebook" value={formData.facebook || ''} onChange={handleChange} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>YouTube URL</label>
                            <input type="text" name="youtube" value={formData.youtube || ''} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className={styles.saveRow}>
                    <button type="submit" className={styles.saveBtn}>
                        <Save size={18} /> Save & Publish Live Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminCMS;
