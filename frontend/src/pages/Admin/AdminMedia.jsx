import React, { useState, useEffect } from 'react';
import { 
    Film, Palette, Image as ImageIcon, Plus, Edit2, Trash2, 
    Upload, Play, Eye, CheckCircle, Save, X, RefreshCw, 
    Clock, MonitorPlay, Sparkles, Layers, Sliders, ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { compressImage, uploadImageFile, uploadBase64Image } from '../../utils/imageUtils';
import { 
    uploadVideoWithProgress, 
    extractVideoMetadataAndThumbnail, 
    SafeVideo 
} from '../../utils/videoStorage';
import styles from './AdminMedia.module.css';

const AdminMedia = () => {
    const { 
        videoSamples, designSamples, cms, 
        addVideoSample, updateVideoSample, deleteVideoSample,
        addDesignSample, updateDesignSample, deleteDesignSample,
        saveCMS, refreshData 
    } = useData();

    // Active Section Tab: 'videos' | 'designs' | 'siteImages'
    const [activeTab, setActiveTab] = useState('videos');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isSavingSiteImages, setIsSavingSiteImages] = useState(false);
    const [uploadingImageField, setUploadingImageField] = useState(null);

    // Video Form State
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [editingVideoId, setEditingVideoId] = useState(null);
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatusMsg, setUploadStatusMsg] = useState('');
    const [uploadFileDetails, setUploadFileDetails] = useState(null);
    const [videoForm, setVideoForm] = useState({
        title: '',
        category: 'Wedding & Teasers',
        videoUrl: '',
        thumbnail: '',
        duration: '01:30',
        resolution: '4K UHD • 60 FPS',
        aspect: '16:9 Cinema',
        description: '',
        tools: 'Premiere Pro, DaVinci Resolve'
    });

    // Design Form State
    const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
    const [editingDesignId, setEditingDesignId] = useState(null);
    const [designForm, setDesignForm] = useState({
        title: '',
        category: 'Luxury Brand Logos',
        image: '',
        format: 'Vector AI, SVG, High-Res PNG',
        dimensions: 'A3 & Instagram 1:1',
        style: 'Gold Foil & Deep Emerald',
        description: '',
        colors: '#064E3B, #D4AF37, #145A42, #FFFDF5'
    });

    // Site Images State
    const [siteImages, setSiteImages] = useState({
        logoImage: cms?.logoImage || '',
        heroImage: cms?.heroImage || '',
        promoBannerImage: cms?.promoBannerImage || '',
        atelierImage: cms?.atelierImage || '',
        videoHeroImage: cms?.videoHeroImage || '',
        designHeroImage: cms?.designHeroImage || ''
    });

    // Keep siteImages state synced whenever CMS context updates
    useEffect(() => {
        if (cms) {
            setSiteImages({
                logoImage: cms.logoImage || '',
                heroImage: cms.heroImage || '',
                promoBannerImage: cms.promoBannerImage || '',
                atelierImage: cms.atelierImage || '',
                videoHeroImage: cms.videoHeroImage || '',
                designHeroImage: cms.designHeroImage || ''
            });
        }
    }, [cms]);

    const [alertMsg, setAlertMsg] = useState(null);

    const showAlert = (msg) => {
        setAlertMsg(msg);
        setTimeout(() => setAlertMsg(null), 3500);
    };

    // Helper: Upload image directly to server storage with client-side compression
    const handleImageUpload = async (file, callback, fieldName = '') => {
        if (!file) return;
        try {
            if (fieldName) setUploadingImageField(fieldName);
            showAlert(`Uploading ${fieldName || 'image'} to media server...`);
            const result = await uploadImageFile(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
            callback(result.url);
            showAlert(`✅ ${fieldName || 'Image'} uploaded successfully!`);
        } catch (err) {
            console.error('Image upload failed:', err);
            try {
                const compressed = await compressImage(file, { maxWidth: 1000, maxHeight: 1000, quality: 0.8 });
                callback(compressed);
            } catch (compErr) {
                alert('Failed to process image: ' + err.message);
            }
        } finally {
            if (fieldName) setUploadingImageField(null);
        }
    };

    // Alias for compatibility
    const handleFileToDataURL = handleImageUpload;

    // Helper: Update site image and automatically save so changes are immediately live
    const updateSiteImage = async (field, value, isUpload = false) => {
        let cleanValue = value;
        if (value && typeof value === 'string' && value.startsWith('data:image/')) {
            try {
                showAlert(`Optimizing ${field.replace('Image', '')}...`);
                const res = await uploadBase64Image(value);
                cleanValue = res.url;
            } catch (convErr) {
                console.warn('Base64 upload non-fatal warning:', convErr);
            }
        }
        const updated = { ...siteImages, [field]: cleanValue };
        setSiteImages(updated);
        if (isUpload || value === '') {
            await saveCMS({
                ...cms,
                ...updated
            });
            showAlert(`✅ ${field.replace('Image', '')} image updated & published live!`);
        }
    };

    // Video Handlers
    const openNewVideoModal = () => {
        setEditingVideoId(null);
        setVideoForm({
            title: '',
            category: 'Wedding & Teasers',
            videoUrl: '',
            thumbnail: '',
            duration: '01:30',
            resolution: '4K UHD • 60 FPS',
            aspect: '16:9 Cinema',
            description: '',
            tools: 'Premiere Pro, DaVinci Resolve'
        });
        setIsUploadingVideo(false);
        setUploadProgress(0);
        setUploadStatusMsg('');
        setUploadFileDetails(null);
        setIsVideoModalOpen(true);
    };

    const openEditVideoModal = (video) => {
        setEditingVideoId(video.id);
        setVideoForm({
            title: video.title || '',
            category: video.category || 'Wedding & Teasers',
            videoUrl: video.videoUrl || '',
            thumbnail: video.thumbnail || '',
            duration: video.duration || '01:30',
            resolution: video.resolution || '4K UHD • 60 FPS',
            aspect: video.aspect || '16:9 Cinema',
            description: video.description || '',
            tools: Array.isArray(video.tools) ? video.tools.join(', ') : (video.tools || '')
        });
        setIsUploadingVideo(false);
        setUploadProgress(0);
        setUploadStatusMsg('');
        setUploadFileDetails(null);
        setIsVideoModalOpen(true);
    };

    const handleVideoFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploadingVideo(true);
        setUploadProgress(0);
        setUploadStatusMsg('Analyzing video & extracting frame thumbnail...');
        const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setUploadFileDetails({
            name: file.name,
            size: `${fileSizeMb} MB`
        });

        // 1. Inspect metadata & extract frame thumbnail in background
        extractVideoMetadataAndThumbnail(file).then((meta) => {
            setVideoForm(prev => ({
                ...prev,
                duration: meta.duration || prev.duration,
                resolution: meta.resolution || prev.resolution,
                aspect: meta.aspect || prev.aspect,
                thumbnail: prev.thumbnail || meta.thumbnail || ''
            }));
        }).catch(err => console.warn('Metadata extraction non-fatal warning:', err));

        // 2. Upload video with live progress
        try {
            setUploadStatusMsg('Uploading video to media server...');
            const uploadResult = await uploadVideoWithProgress(file, (percent) => {
                setUploadProgress(percent);
                if (percent < 100) {
                    setUploadStatusMsg(`Uploading video (${percent}%)...`);
                } else {
                    setUploadStatusMsg('Processing & finalizing video stream...');
                }
            });

            setVideoForm(prev => ({
                ...prev,
                videoUrl: uploadResult.url
            }));

            setUploadStatusMsg(
                uploadResult.isRemote
                    ? `Uploaded to media server (${fileSizeMb} MB) • Ready to publish!`
                    : `Stored in browser Media DB (${fileSizeMb} MB) • Ready to publish!`
            );
        } catch (err) {
            console.error('Video upload error:', err);
            alert('Failed to upload video: ' + (err.message || 'Unknown error'));
            setUploadStatusMsg('Upload failed. Please check file format or server status.');
        } finally {
            setIsUploadingVideo(false);
        }
    };

    const handleSaveVideo = (e) => {
        e.preventDefault();
        if (isUploadingVideo) {
            alert('Please wait for the video upload to complete before saving.');
            return;
        }

        if (!videoForm.title || !videoForm.videoUrl) {
            alert('Please provide a title and video file or URL.');
            return;
        }

        const formattedVideo = {
            ...videoForm,
            tools: typeof videoForm.tools === 'string' 
                ? videoForm.tools.split(',').map(t => t.trim()).filter(Boolean)
                : videoForm.tools
        };

        if (editingVideoId) {
            updateVideoSample(editingVideoId, formattedVideo);
            showAlert('Video showcase updated successfully!');
        } else {
            addVideoSample(formattedVideo);
            showAlert('New sample video added to customer showcase!');
        }

        setIsVideoModalOpen(false);
    };

    const handleDeleteVideo = (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            deleteVideoSample(id);
            showAlert('Video removed from showcase.');
        }
    };

    // Design Handlers
    const openNewDesignModal = () => {
        setEditingDesignId(null);
        setDesignForm({
            title: '',
            category: 'Luxury Brand Logos',
            image: '',
            format: 'Vector AI, SVG, High-Res PNG',
            dimensions: 'A3 & Instagram 1:1',
            style: 'Gold Foil & Deep Emerald',
            description: '',
            colors: '#064E3B, #D4AF37, #145A42, #FFFDF5'
        });
        setIsDesignModalOpen(true);
    };

    const openEditDesignModal = (design) => {
        setEditingDesignId(design.id);
        setDesignForm({
            title: design.title || '',
            category: design.category || 'Luxury Brand Logos',
            image: design.image || '',
            format: design.format || 'Vector AI, SVG, High-Res PNG',
            dimensions: design.dimensions || 'A3 & Instagram 1:1',
            style: design.style || 'Gold Foil & Deep Emerald',
            description: design.description || '',
            colors: Array.isArray(design.colors) ? design.colors.join(', ') : (design.colors || '')
        });
        setIsDesignModalOpen(true);
    };

    const handleSaveDesign = (e) => {
        e.preventDefault();
        if (!designForm.title || !designForm.image) {
            alert('Please provide a title and artwork image file or URL.');
            return;
        }

        const formattedDesign = {
            ...designForm,
            colors: typeof designForm.colors === 'string'
                ? designForm.colors.split(',').map(c => c.trim()).filter(Boolean)
                : designForm.colors
        };

        if (editingDesignId) {
            updateDesignSample(editingDesignId, formattedDesign);
            showAlert('Design sample updated successfully!');
        } else {
            addDesignSample(formattedDesign);
            showAlert('New design sample added to customer portfolio!');
        }

        setIsDesignModalOpen(false);
    };

    const handleDeleteDesign = (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            deleteDesignSample(id);
            showAlert('Design sample removed from portfolio.');
        }
    };

    // Site Images Handler
    const handleSaveSiteImages = async (e) => {
        e.preventDefault();
        setIsSavingSiteImages(true);
        try {
            showAlert('Saving & publishing all website images...');
            const cleaned = { ...siteImages };
            for (const key of Object.keys(cleaned)) {
                if (typeof cleaned[key] === 'string' && cleaned[key].startsWith('data:image/')) {
                    const res = await uploadBase64Image(cleaned[key]);
                    cleaned[key] = res.url;
                }
            }
            setSiteImages(cleaned);
            await saveCMS({
                ...cms,
                ...cleaned
            });
            showAlert('✅ Website images, brand logo, and banners saved & updated live!');
        } catch (err) {
            console.error('Error saving site images:', err);
            showAlert('⚠️ Error saving images: ' + (err.message || 'Please try again'));
        } finally {
            setIsSavingSiteImages(false);
        }
    };

    // Filters
    const filteredVideos = (videoSamples || []).filter(v => {
        const matchesCategory = filterCategory === 'All' || v.category === filterCategory;
        const matchesSearch = !searchQuery || v.title?.toLowerCase().includes(searchQuery.toLowerCase()) || v.category?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const filteredDesigns = (designSamples || []).filter(d => {
        const matchesCategory = filterCategory === 'All' || d.category === filterCategory;
        const matchesSearch = !searchQuery || d.title?.toLowerCase().includes(searchQuery.toLowerCase()) || d.category?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={styles.mediaPage}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1>Media & Showcase Content Manager</h1>
                    <p>Upload, change, and control all user-side video editing reels, logos, posters, and brand banner images.</p>
                </div>

                <div className={styles.headerActions}>
                    {activeTab === 'videos' && (
                        <button onClick={openNewVideoModal} className={styles.addBtn}>
                            <Plus size={18} /> Add New Video Sample
                        </button>
                    )}
                    {activeTab === 'designs' && (
                        <button onClick={openNewDesignModal} className={styles.addBtn}>
                            <Plus size={18} /> Add New Logo / Poster
                        </button>
                    )}
                </div>
            </div>

            {/* Notification Alert */}
            {alertMsg && (
                <div className={styles.successAlert}>
                    <CheckCircle size={18} /> {alertMsg}
                </div>
            )}

            {/* Main Tabs */}
            <div className={styles.tabBar}>
                <button 
                    className={`${styles.tabBtn} ${activeTab === 'videos' ? styles.activeTab : ''}`}
                    onClick={() => { setActiveTab('videos'); setFilterCategory('All'); }}
                >
                    <Film size={18} />
                    <span>Sample Video Editing ({videoSamples?.length || 0})</span>
                </button>

                <button 
                    className={`${styles.tabBtn} ${activeTab === 'designs' ? styles.activeTab : ''}`}
                    onClick={() => { setActiveTab('designs'); setFilterCategory('All'); }}
                >
                    <Palette size={18} />
                    <span>Logos & Posters ({designSamples?.length || 0})</span>
                </button>

                <button 
                    className={`${styles.tabBtn} ${activeTab === 'siteImages' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('siteImages')}
                >
                    <ImageIcon size={18} />
                    <span>Brand Logo & Website Banners</span>
                </button>
            </div>

            {/* =========================================================
                TAB 1: VIDEO EDITING SAMPLES MANAGER
            ========================================================= */}
            {activeTab === 'videos' && (
                <div className={styles.tabContent}>
                    {/* Filter Bar */}
                    <div className={styles.filterBar}>
                        <input 
                            type="text" 
                            placeholder="Search video titles or tools..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />

                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={styles.categorySelect}
                        >
                            <option value="All">All Categories</option>
                            <option value="Wedding & Teasers">Wedding & Teasers</option>
                            <option value="Birthday & Celebrations">Birthday & Celebrations</option>
                            <option value="Gift Reveals & Unboxing">Gift Reveals & Unboxing</option>
                            <option value="Social Media Reels">Social Media Reels</option>
                            <option value="Brand Promos">Brand Promos</option>
                        </select>
                    </div>

                    {/* Videos Grid */}
                    <div className={styles.cardGrid}>
                        {filteredVideos.map((video) => (
                            <div key={video.id} className={styles.mediaItemCard}>
                                <div className={styles.videoPreviewBox}>
                                    {video.videoUrl ? (
                                        <SafeVideo 
                                            src={video.videoUrl} 
                                            poster={video.thumbnail} 
                                            controls 
                                            preload="metadata"
                                            className={styles.videoEl}
                                        />
                                    ) : (
                                        <div className={styles.emptyMedia}>
                                            <Film size={32} />
                                            <span>No video source</span>
                                        </div>
                                    )}
                                    <span className={styles.pillBadge}>{video.resolution || '4K UHD'}</span>
                                    <span className={styles.durationBadge}>{video.duration || '01:00'}</span>
                                </div>

                                <div className={styles.cardDetails}>
                                    <span className={styles.categoryTag}>{video.category}</span>
                                    <h3>{video.title}</h3>
                                    <p className={styles.desc}>{video.description}</p>
                                    
                                    <div className={styles.metaRow}>
                                        <span>Aspect: <strong>{video.aspect || '16:9'}</strong></span>
                                    </div>

                                    <div className={styles.actionBtns}>
                                        <button 
                                            onClick={() => openEditVideoModal(video)} 
                                            className={styles.editBtn}
                                            title="Edit video details"
                                        >
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteVideo(video.id, video.title)} 
                                            className={styles.deleteBtn}
                                            title="Delete this video"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredVideos.length === 0 && (
                        <div className={styles.emptyState}>
                            <Film size={48} className={styles.emptyIcon} />
                            <h3>No Video Samples Found</h3>
                            <p>Click "Add New Video Sample" to upload your first sample video file or link.</p>
                        </div>
                    )}
                </div>
            )}

            {/* =========================================================
                TAB 2: LOGOS & POSTERS SAMPLES MANAGER
            ========================================================= */}
            {activeTab === 'designs' && (
                <div className={styles.tabContent}>
                    {/* Filter Bar */}
                    <div className={styles.filterBar}>
                        <input 
                            type="text" 
                            placeholder="Search logo or poster titles..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />

                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={styles.categorySelect}
                        >
                            <option value="All">All Categories</option>
                            <option value="Luxury Brand Logos">Luxury Brand Logos</option>
                            <option value="Event & Party Posters">Event & Party Posters</option>
                            <option value="Festival & Social Flyers">Festival & Social Flyers</option>
                            <option value="Gift Packaging & Labels">Gift Packaging & Labels</option>
                            <option value="Monograms & Invitations">Monograms & Invitations</option>
                        </select>
                    </div>

                    {/* Designs Grid */}
                    <div className={styles.cardGrid}>
                        {filteredDesigns.map((design) => (
                            <div key={design.id} className={styles.mediaItemCard}>
                                <div className={styles.imagePreviewBox}>
                                    <img src={design.image} alt={design.title} className={styles.artworkImg} />
                                    <span className={styles.pillBadge}>{design.category}</span>
                                </div>

                                <div className={styles.cardDetails}>
                                    <h3>{design.title}</h3>
                                    <p className={styles.desc}>{design.description}</p>
                                    
                                    <div className={styles.metaRow}>
                                        <span>Style: <strong>{design.style}</strong></span>
                                        <span>Dimensions: <strong>{design.dimensions}</strong></span>
                                    </div>

                                    {/* Palette Swatches */}
                                    <div className={styles.swatchRow}>
                                        {(Array.isArray(design.colors) ? design.colors : (design.colors || '').split(',')).map((c, idx) => (
                                            <span 
                                                key={idx} 
                                                className={styles.colorDot} 
                                                style={{ backgroundColor: c.trim() }}
                                                title={c.trim()}
                                            />
                                        ))}
                                    </div>

                                    <div className={styles.actionBtns}>
                                        <button 
                                            onClick={() => openEditDesignModal(design)} 
                                            className={styles.editBtn}
                                            title="Edit design details"
                                        >
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteDesign(design.id, design.title)} 
                                            className={styles.deleteBtn}
                                            title="Delete this design"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredDesigns.length === 0 && (
                        <div className={styles.emptyState}>
                            <Palette size={48} className={styles.emptyIcon} />
                            <h3>No Design Samples Found</h3>
                            <p>Click "Add New Logo / Poster" to upload your first sample artwork.</p>
                        </div>
                    )}
                </div>
            )}

            {/* =========================================================
                TAB 3: BRAND LOGO & WEBSITE BANNER IMAGES
            ========================================================= */}
            {activeTab === 'siteImages' && (
                <div className={styles.tabContent}>
                    <form onSubmit={handleSaveSiteImages} className={styles.siteImagesForm}>
                        <div className={styles.sectionNotice}>
                            <Sparkles size={18} />
                            <span>
                                Any image uploaded or updated here instantly changes across the public website (Navbar, Hero, Footer, and Special Promotion sections).
                            </span>
                        </div>

                        {/* 1. Primary Brand Logo */}
                        <div className={styles.imageCard}>
                            <div className={styles.imageCardInfo}>
                                <h3>Primary Store Brand Logo</h3>
                                <p>Used in the top navigation tier, mobile drawer, and footer. Recommended transparent PNG or SVG.</p>
                                
                                <div className={styles.fileInputRow}>
                                    <label className={styles.fileUploadLabel}>
                                        <Upload size={16} /> Upload Logo File
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            hidden 
                                            onChange={(e) => handleFileToDataURL(e.target.files[0], (url) => updateSiteImage('logoImage', url, true))}
                                        />
                                    </label>
                                    <span className={styles.orText}>or paste URL:</span>
                                    <input 
                                        type="url" 
                                        placeholder="https://example.com/logo.png" 
                                        value={siteImages.logoImage}
                                        onChange={(e) => updateSiteImage('logoImage', e.target.value, false)}
                                        className={styles.urlInput}
                                    />
                                </div>
                            </div>

                            <div className={styles.liveThumbBox}>
                                {siteImages.logoImage ? (
                                    <div className={styles.logoPreviewContainer}>
                                        <img src={siteImages.logoImage} alt="Brand Logo Preview" />
                                        <button 
                                            type="button" 
                                            className={styles.clearBtn}
                                            onClick={() => updateSiteImage('logoImage', '', false)}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.placeholderThumb}>
                                        <ImageIcon size={24} />
                                        <span>Using Default Emblem Badge</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Homepage Hero Lifestyle Banner */}
                        <div className={styles.imageCard}>
                            <div className={styles.imageCardInfo}>
                                <h3>Homepage Hero Lifestyle Image</h3>
                                <p>The main large editorial gifting image in the hero section ("Make Every Moment Special"). Recommended 900x700px high quality.</p>
                                
                                <div className={styles.fileInputRow}>
                                    <label className={styles.fileUploadLabel}>
                                        <Upload size={16} /> Upload Hero File
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            hidden 
                                            onChange={(e) => handleFileToDataURL(e.target.files[0], (url) => updateSiteImage('heroImage', url, true))}
                                        />
                                    </label>
                                    <span className={styles.orText}>or paste URL:</span>
                                    <input 
                                        type="url" 
                                        placeholder="https://images.unsplash.com/..." 
                                        value={siteImages.heroImage}
                                        onChange={(e) => updateSiteImage('heroImage', e.target.value, false)}
                                        className={styles.urlInput}
                                    />
                                </div>
                            </div>

                            <div className={styles.liveThumbBox}>
                                {siteImages.heroImage ? (
                                    <div className={styles.bannerPreviewContainer}>
                                        <img src={siteImages.heroImage} alt="Hero Banner Preview" />
                                        <button 
                                            type="button" 
                                            className={styles.clearBtn}
                                            onClick={() => updateSiteImage('heroImage', '', false)}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.placeholderThumb}>
                                        <ImageIcon size={24} />
                                        <span>Default Luxury Trunk Photo</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Promotional Section Banner */}
                        <div className={styles.imageCard}>
                            <div className={styles.imageCardInfo}>
                                <h3>Special Promotion Background Banner</h3>
                                <p>Full-width backdrop for "The Art of Thoughtful Gifting" promotional section. High-contrast lifestyle photography recommended.</p>
                                
                                <div className={styles.fileInputRow}>
                                    <label className={styles.fileUploadLabel}>
                                        <Upload size={16} /> Upload Promo Banner
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            hidden 
                                            onChange={(e) => handleFileToDataURL(e.target.files[0], (url) => updateSiteImage('promoBannerImage', url, true))}
                                        />
                                    </label>
                                    <span className={styles.orText}>or paste URL:</span>
                                    <input 
                                        type="url" 
                                        placeholder="https://images.unsplash.com/..." 
                                        value={siteImages.promoBannerImage}
                                        onChange={(e) => updateSiteImage('promoBannerImage', e.target.value, false)}
                                        className={styles.urlInput}
                                    />
                                </div>
                            </div>

                            <div className={styles.liveThumbBox}>
                                {siteImages.promoBannerImage ? (
                                    <div className={styles.bannerPreviewContainer}>
                                        <img src={siteImages.promoBannerImage} alt="Promo Banner Preview" />
                                        <button 
                                            type="button" 
                                            className={styles.clearBtn}
                                            onClick={() => updateSiteImage('promoBannerImage', '', false)}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.placeholderThumb}>
                                        <ImageIcon size={24} />
                                        <span>Default Emerald Overlay</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. Video Editing Hero Poster */}
                        <div className={styles.imageCard}>
                            <div className={styles.imageCardInfo}>
                                <h3>Video Editing Page Hero Poster</h3>
                                <p>The showreel preview card thumbnail shown on the /video-editing page.</p>
                                
                                <div className={styles.fileInputRow}>
                                    <label className={styles.fileUploadLabel}>
                                        <Upload size={16} /> Upload Video Hero
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            hidden 
                                            onChange={(e) => handleFileToDataURL(e.target.files[0], (url) => updateSiteImage('videoHeroImage', url, true))}
                                        />
                                    </label>
                                    <span className={styles.orText}>or paste URL:</span>
                                    <input 
                                        type="url" 
                                        placeholder="https://images.unsplash.com/..." 
                                        value={siteImages.videoHeroImage}
                                        onChange={(e) => updateSiteImage('videoHeroImage', e.target.value, false)}
                                        className={styles.urlInput}
                                    />
                                </div>
                            </div>

                            <div className={styles.liveThumbBox}>
                                {siteImages.videoHeroImage ? (
                                    <div className={styles.bannerPreviewContainer}>
                                        <img src={siteImages.videoHeroImage} alt="Video Hero Preview" />
                                        <button 
                                            type="button" 
                                            className={styles.clearBtn}
                                            onClick={() => updateSiteImage('videoHeroImage', '', false)}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.placeholderThumb}>
                                        <ImageIcon size={24} />
                                        <span>Default Cinematic Suite Photo</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 5. Logo & Poster Page Hero Poster */}
                        <div className={styles.imageCard}>
                            <div className={styles.imageCardInfo}>
                                <h3>Logo & Poster Page Hero Artwork</h3>
                                <p>The main visual showcase card shown on the /logo-poster-editing page.</p>
                                
                                <div className={styles.fileInputRow}>
                                    <label className={styles.fileUploadLabel}>
                                        <Upload size={16} /> Upload Design Hero
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            hidden 
                                            onChange={(e) => handleFileToDataURL(e.target.files[0], (url) => updateSiteImage('designHeroImage', url, true))}
                                        />
                                    </label>
                                    <span className={styles.orText}>or paste URL:</span>
                                    <input 
                                        type="url" 
                                        placeholder="https://images.unsplash.com/..." 
                                        value={siteImages.designHeroImage}
                                        onChange={(e) => updateSiteImage('designHeroImage', e.target.value, false)}
                                        className={styles.urlInput}
                                    />
                                </div>
                            </div>

                            <div className={styles.liveThumbBox}>
                                {siteImages.designHeroImage ? (
                                    <div className={styles.bannerPreviewContainer}>
                                        <img src={siteImages.designHeroImage} alt="Design Hero Preview" />
                                        <button 
                                            type="button" 
                                            className={styles.clearBtn}
                                            onClick={() => updateSiteImage('designHeroImage', '', false)}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.placeholderThumb}>
                                        <ImageIcon size={24} />
                                        <span>Default Crest Artistry Photo</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.saveBar}>
                            <button 
                                type="submit" 
                                className={styles.primarySaveBtn} 
                                disabled={isSavingSiteImages}
                                style={{ opacity: isSavingSiteImages ? 0.75 : 1, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Save size={18} className={isSavingSiteImages ? styles.spinning : ''} />
                                {isSavingSiteImages ? 'Saving & Publishing Images...' : 'Save & Publish All Website Images'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* =========================================================
                MODAL: ADD / EDIT VIDEO SAMPLE
            ========================================================= */}
            {isVideoModalOpen && (
                <div className={styles.modalBackdrop} onClick={() => setIsVideoModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingVideoId ? 'Edit Video Sample' : 'Upload & Add New Video Sample'}</h2>
                            <button onClick={() => setIsVideoModalOpen(false)} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveVideo} className={styles.modalForm}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Video Title *</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="e.g. Royal Heritage Wedding Teaser"
                                        value={videoForm.title}
                                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Category *</label>
                                    <select 
                                        value={videoForm.category}
                                        onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                                    >
                                        <option>Wedding & Teasers</option>
                                        <option>Birthday & Celebrations</option>
                                        <option>Gift Reveals & Unboxing</option>
                                        <option>Social Media Reels</option>
                                        <option>Brand Promos</option>
                                    </select>
                                </div>
                            </div>

                            {/* Video Source Upload / URL */}
                            <div className={styles.formGroup}>
                                <label>
                                    Video File (Upload MP4 / WebM / QuickTime or enter URL) *
                                    {videoForm.resolution && (
                                        <span className={styles.autoTagPill}>
                                            <Sparkles size={11} /> {videoForm.resolution} • {videoForm.duration}
                                        </span>
                                    )}
                                </label>
                                <div className={styles.uploadRow}>
                                    <label className={styles.fileUploadBtn} style={{ opacity: isUploadingVideo ? 0.7 : 1 }}>
                                        {isUploadingVideo ? (
                                            <>
                                                <RefreshCw size={16} className={styles.spinning} /> Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={16} /> Choose Video File
                                            </>
                                        )}
                                        <input 
                                            type="file" 
                                            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*" 
                                            hidden 
                                            disabled={isUploadingVideo}
                                            onChange={handleVideoFileSelect}
                                        />
                                    </label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="or paste video URL (e.g. https://.../video.mp4)"
                                        value={videoForm.videoUrl}
                                        disabled={isUploadingVideo}
                                        onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                                    />
                                </div>

                                {/* Live Upload Progress Bar */}
                                {isUploadingVideo && (
                                    <div className={styles.uploadProgressWrapper}>
                                        <div className={styles.progressHeader}>
                                            <span>
                                                <RefreshCw size={13} className={styles.spinning} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                                {uploadStatusMsg || 'Uploading video to media server...'}
                                            </span>
                                            <span className={styles.progressPercent}>{uploadProgress}%</span>
                                        </div>
                                        <div className={styles.progressBarOuter}>
                                            <div 
                                                className={styles.progressBarInner} 
                                                style={{ width: `${uploadProgress}%` }} 
                                            />
                                        </div>
                                        {uploadFileDetails && (
                                            <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
                                                File: <strong>{uploadFileDetails.name}</strong> ({uploadFileDetails.size})
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Upload Complete Notification */}
                                {!isUploadingVideo && uploadStatusMsg && videoForm.videoUrl && (
                                    <div className={`${styles.uploadStatusBadge} ${styles.statusSuccess}`}>
                                        <CheckCircle size={14} /> {uploadStatusMsg}
                                    </div>
                                )}

                                {/* Live Video Player Preview */}
                                {videoForm.videoUrl && (
                                    <div className={styles.inlineVideoPreview}>
                                        <SafeVideo 
                                            src={videoForm.videoUrl} 
                                            poster={videoForm.thumbnail} 
                                            controls 
                                            className={styles.inlinePlayer} 
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Upload / URL */}
                            <div className={styles.formGroup}>
                                <label>Video Poster Thumbnail (Upload image or enter URL)</label>
                                <div className={styles.uploadRow}>
                                    <label className={styles.fileUploadBtn}>
                                        <Upload size={16} /> Choose Image
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            hidden 
                                            onChange={(e) => handleFileToDataURL(e.target.files[0], (url) => setVideoForm({ ...videoForm, thumbnail: url }))}
                                        />
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="Thumbnail Image URL (https://images.unsplash.com/...)"
                                        value={videoForm.thumbnail}
                                        onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                                    />
                                </div>
                                {videoForm.thumbnail && (
                                    <img src={videoForm.thumbnail} alt="Thumbnail preview" className={styles.thumbPreviewImg} />
                                )}
                            </div>

                            <div className={styles.gridThree}>
                                <div className={styles.formGroup}>
                                    <label>Duration</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 01:45"
                                        value={videoForm.duration}
                                        onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Resolution</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 4K UHD • 60 FPS"
                                        value={videoForm.resolution}
                                        onChange={(e) => setVideoForm({ ...videoForm, resolution: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Aspect Ratio</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 16:9 Cinema / 9:16 Reel"
                                        value={videoForm.aspect}
                                        onChange={(e) => setVideoForm({ ...videoForm, aspect: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Tools / Software Used (comma separated)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Premiere Pro, DaVinci Resolve, Sound FX"
                                    value={videoForm.tools}
                                    onChange={(e) => setVideoForm({ ...videoForm, tools: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <textarea 
                                    rows="3" 
                                    placeholder="Highlight color grading, music sync, speech clarity, or emotional pacing..."
                                    value={videoForm.description}
                                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsVideoModalOpen(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.saveSubmitBtn} disabled={isUploadingVideo}>
                                    {isUploadingVideo ? (
                                        <>
                                            <RefreshCw size={16} className={styles.spinning} /> Uploading Video ({uploadProgress}%)...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} /> {editingVideoId ? 'Update Video' : 'Save & Publish Video'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================
                MODAL: ADD / EDIT DESIGN SAMPLE (POSTER / LOGO)
            ========================================================= */}
            {isDesignModalOpen && (
                <div className={styles.modalBackdrop} onClick={() => setIsDesignModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingDesignId ? 'Edit Logo / Poster Sample' : 'Upload & Add New Logo / Poster'}</h2>
                            <button onClick={() => setIsDesignModalOpen(false)} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveDesign} className={styles.modalForm}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Artwork Title *</label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="e.g. Royal Crown Heritage Monogram"
                                        value={designForm.title}
                                        onChange={(e) => setDesignForm({ ...designForm, title: e.target.value })}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Category *</label>
                                    <select 
                                        value={designForm.category}
                                        onChange={(e) => setDesignForm({ ...designForm, category: e.target.value })}
                                    >
                                        <option>Luxury Brand Logos</option>
                                        <option>Event & Party Posters</option>
                                        <option>Festival & Social Flyers</option>
                                        <option>Gift Packaging & Labels</option>
                                        <option>Monograms & Invitations</option>
                                    </select>
                                </div>
                            </div>

                            {/* Artwork Image Upload / URL */}
                            <div className={styles.formGroup}>
                                <label>Artwork Image File or URL *</label>
                                <div className={styles.uploadRow}>
                                    <label className={styles.fileUploadBtn}>
                                        <Upload size={16} /> Choose Image File
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            hidden 
                                            onChange={(e) => handleFileToDataURL(e.target.files[0], (url) => setDesignForm({ ...designForm, image: url }))}
                                        />
                                    </label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="Paste image URL (https://images.unsplash.com/...)"
                                        value={designForm.image}
                                        onChange={(e) => setDesignForm({ ...designForm, image: e.target.value })}
                                    />
                                </div>
                                {designForm.image && (
                                    <img src={designForm.image} alt="Artwork preview" className={styles.thumbPreviewImg} />
                                )}
                            </div>

                            <div className={styles.gridThree}>
                                <div className={styles.formGroup}>
                                    <label>Format & Scalability</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Vector AI, SVG, High-Res PNG"
                                        value={designForm.format}
                                        onChange={(e) => setDesignForm({ ...designForm, format: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Dimensions</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. A3 (11.7 x 16.5 in) / 1080x1080"
                                        value={designForm.dimensions}
                                        onChange={(e) => setDesignForm({ ...designForm, dimensions: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Style Tag</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Gold Foil & Deep Emerald"
                                        value={designForm.style}
                                        onChange={(e) => setDesignForm({ ...designForm, style: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Color Palette Swatches (Hex codes, comma separated)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. #064E3B, #D4AF37, #145A42, #FFFDF5"
                                    value={designForm.colors}
                                    onChange={(e) => setDesignForm({ ...designForm, colors: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Artwork Description</label>
                                <textarea 
                                    rows="3" 
                                    placeholder="Describe design concept, typography, layout, or client industry..."
                                    value={designForm.description}
                                    onChange={(e) => setDesignForm({ ...designForm, description: e.target.value })}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsDesignModalOpen(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.saveSubmitBtn}>
                                    <Save size={16} /> {editingDesignId ? 'Update Design' : 'Save & Publish Design'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMedia;