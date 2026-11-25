import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Save, CheckCircle, RefreshCw, Upload, Film, Palette, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { compressImage } from '../../utils/imageUtils';
import styles from './AdminCMS.module.css';

const AdminCMS = () => {
    const { cms, saveCMS, refreshCMS } = useData();

    const [formData, setFormData] = useState(cms || {});
    const [savedMsg, setSavedMsg] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Keep formData synced whenever CMS context updates
    useEffect(() => {
        if (cms) {
            setFormData(cms);
        }
    }, [cms]);

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

    const handleFileUpload = async (field, file) => {
        if (!file) return;
        try {
            const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 });
            const updated = { ...formData, [field]: compressed };
            setFormData(updated);
            saveCMS(updated); // Instantly auto-save uploaded image
            setSavedMsg(true);
            setTimeout(() => setSavedMsg(false), 2500);
        } catch (err) {
            console.error('Error compressing CMS image:', err);
            const reader = new FileReader();
            reader.onload = (e) => {
                const updated = { ...formData, [field]: e.target.result };
                setFormData(updated);
                saveCMS(updated);
                setSavedMsg(true);
                setTimeout(() => setSavedMsg(false), 2500);
            };
            reader.readAsDataURL(file);
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

            {/* Quick Media Manager Banner */}
            <div className={styles.mediaBannerCard} style={{ 
                background: 'linear-gradient(135deg, var(--color-emerald-deep), var(--color-forest-green))', 
                color: 'white', 
                padding: '1.5rem 2rem', 
                borderRadius: '16px', 
                marginBottom: '2rem',
                border: '1.5px solid var(--color-champagne-gold)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h3 style={{ margin: '0 0 0.35rem 0', color: 'var(--color-golden-yellow)', fontFamily: 'var(--font-heading)', fontSize: '1.35rem' }}>
                        Video Editing & Graphic Design Manager
                    </h3>
                    <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.92rem' }}>
                        Upload and manage all customer-facing video reels, posters, logos, and dimensions.
                    </p>
                </div>
                <Link to="/admin/media" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--color-champagne-gold)',
                    color: 'var(--color-forest-green)',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none'
                }}>
                    <Film size={16} /> Open Media Manager <ArrowRight size={16} />
                </Link>
            </div>

            <form onSubmit={handleSubmit} className={styles.cmsForm}>
                {/* Brand & Website Images Upload */}
                <div className={styles.card}>
                    <h2>Website Images & Brand Logo</h2>
                    <div className={styles.formGrid}>
                        {/* Primary Brand Logo */}
                        <div className={styles.inputGroup}>
                            <label>Store Brand Logo (PNG / SVG / JPG)</label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.35rem' }}>
                                <label style={{ 
                                    padding: '0.6rem 1rem', 
                                    background: 'var(--color-emerald-deep)', 
                                    color: 'white', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <Upload size={15} /> Upload Logo
                                    <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload('logoImage', e.target.files[0])} />
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="or paste logo URL" 
                                    name="logoImage" 
                                    value={formData.logoImage || ''} 
                                    onChange={handleChange} 
                                    style={{ flex: 1 }}
                                />
                            </div>
                            {formData.logoImage && (
                                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                    <img src={formData.logoImage} alt="Logo Preview" style={{ maxHeight: '50px', objectFit: 'contain' }} />
                                </div>
                            )}
                        </div>

                        {/* Homepage Hero Image */}
                        <div className={styles.inputGroup}>
                            <label>Homepage Hero Lifestyle Image</label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.35rem' }}>
                                <label style={{ 
                                    padding: '0.6rem 1rem', 
                                    background: 'var(--color-emerald-deep)', 
                                    color: 'white', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <Upload size={15} /> Upload Hero
                                    <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload('heroImage', e.target.files[0])} />
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="or paste hero image URL" 
                                    name="heroImage" 
                                    value={formData.heroImage || ''} 
                                    onChange={handleChange} 
                                    style={{ flex: 1 }}
                                />
                            </div>
                            {formData.heroImage && (
                                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                    <img src={formData.heroImage} alt="Hero Preview" style={{ maxHeight: '80px', objectFit: 'cover', width: '100%', borderRadius: '4px' }} />
                                </div>
                            )}
                        </div>

                        {/* Promotional Section Banner */}
                        <div className={styles.inputGroup}>
                            <label>Promotional Banner Background Image</label>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.35rem' }}>
                                <label style={{ 
                                    padding: '0.6rem 1rem', 
                                    background: 'var(--color-emerald-deep)', 
                                    color: 'white', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    whiteSpace: 'nowrap'
                                }}>
                                    <Upload size={15} /> Upload Banner
                                    <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload('promoBannerImage', e.target.files[0])} />
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="or paste promo banner URL" 
                                    name="promoBannerImage" 
                                    value={formData.promoBannerImage || ''} 
                                    onChange={handleChange} 
                                    style={{ flex: 1 }}
                                />
                            </div>
                            {formData.promoBannerImage && (
                                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                    <img src={formData.promoBannerImage} alt="Promo Banner Preview" style={{ maxHeight: '80px', objectFit: 'cover', width: '100%', borderRadius: '4px' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

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
