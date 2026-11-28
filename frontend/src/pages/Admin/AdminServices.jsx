import React, { useState } from 'react';
import { 
    Video, Layers, Cpu, Plus, Edit2, Trash2, Upload, Play, 
    CheckCircle, Save, X, ExternalLink, Clock, Sparkles, 
    CheckCircle2, AlertCircle, ArrowUp, ArrowDown, Eye, RefreshCw
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { 
    SafeVideo, 
    uploadVideoWithProgress, 
    extractVideoMetadataAndThumbnail, 
    getYouTubeId, 
    getAutoThumbnail 
} from '../../utils/videoStorage';
import { uploadImageFile } from '../../utils/imageUtils';
import styles from './AdminServices.module.css';

const AdminServices = () => {
    const { 
        services = [], 
        equipment = [], 
        machineryVideos = [],
        addService, 
        updateService, 
        deleteService,
        addEquipment, 
        updateEquipment, 
        deleteEquipment,
        addMachineryVideo, 
        updateMachineryVideo, 
        deleteMachineryVideo,
        refreshData
    } = useData();

    // Active Tab: 'videos' | 'services' | 'equipment'
    const [activeTab, setActiveTab] = useState('videos');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [alertMsg, setAlertMsg] = useState(null);

    const showAlert = (msg) => {
        setAlertMsg(msg);
        setTimeout(() => setAlertMsg(null), 3500);
    };

    // ==========================================
    // 1. MACHINERY VIDEOS STATE & MODAL
    // ==========================================
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [editingVideoId, setEditingVideoId] = useState(null);
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatusMsg, setUploadStatusMsg] = useState('');
    const [videoForm, setVideoForm] = useState({
        title: '',
        category: 'UV Printing',
        machineModel: '',
        videoUrl: '',
        thumbnail: '',
        duration: '01:00',
        resolution: '4K UHD • 60 FPS',
        aspect: '16:9 Cinema',
        description: '',
        features: ''
    });

    const openNewVideoModal = () => {
        setEditingVideoId(null);
        setVideoForm({
            title: '',
            category: 'UV Printing',
            machineModel: '',
            videoUrl: '',
            thumbnail: '',
            duration: '01:00',
            resolution: '4K UHD • 60 FPS',
            aspect: '16:9 Cinema',
            description: '',
            features: ''
        });
        setIsUploadingVideo(false);
        setUploadProgress(0);
        setUploadStatusMsg('');
        setIsVideoModalOpen(true);
    };

    const openEditVideoModal = (v) => {
        setEditingVideoId(v.id || v._id);
        setVideoForm({
            title: v.title || '',
            category: v.category || 'UV Printing',
            machineModel: v.machineModel || '',
            videoUrl: v.videoUrl || '',
            thumbnail: v.thumbnail || '',
            duration: v.duration || '01:00',
            resolution: v.resolution || '4K UHD • 60 FPS',
            aspect: v.aspect || '16:9 Cinema',
            description: v.description || '',
            features: Array.isArray(v.features) ? v.features.join(', ') : (v.features || '')
        });
        setIsUploadingVideo(false);
        setUploadProgress(0);
        setUploadStatusMsg('');
        setIsVideoModalOpen(true);
    };

    const handleVideoFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploadingVideo(true);
        setUploadProgress(0);
        setUploadStatusMsg('Analyzing video & extracting frame thumbnail...');

        // 1. Inspect metadata & extract frame thumbnail in background
        extractVideoMetadataAndThumbnail(file).then((meta) => {
            setVideoForm(prev => ({
                ...prev,
                duration: meta.duration || prev.duration,
                resolution: meta.resolution || prev.resolution,
                aspect: meta.aspect || prev.aspect,
                thumbnail: prev.thumbnail || meta.thumbnail || ''
            }));
        }).catch(err => console.warn('Thumbnail extraction non-fatal:', err));

        // 2. Upload video with live progress to R2 services/machinery folder
        try {
            setUploadStatusMsg('Uploading video to media storage...');
            const uploadResult = await uploadVideoWithProgress(file, (percent) => {
                setUploadProgress(percent);
                setUploadStatusMsg(percent < 100 ? `Uploading (${percent}%)...` : 'Processing video stream...');
            }, 'services/machinery');

            setVideoForm(prev => ({
                ...prev,
                videoUrl: uploadResult.url
            }));
            setUploadStatusMsg(`✅ Video ready: ${file.name}`);
        } catch (err) {
            console.error('Video upload error:', err);
            alert('Video upload failed: ' + (err.message || 'Unknown error'));
            setUploadStatusMsg('Upload failed. You can paste a video URL or YouTube link manually.');
        } finally {
            setIsUploadingVideo(false);
        }
    };

    const handleVideoUrlChange = (val) => {
        const autoThumb = getAutoThumbnail(val);
        setVideoForm(prev => ({
            ...prev,
            videoUrl: val,
            thumbnail: (!prev.thumbnail || prev.thumbnail.includes('youtube.com')) && autoThumb ? autoThumb : prev.thumbnail
        }));
    };

    const handleSaveVideo = async (e) => {
        e.preventDefault();
        if (isUploadingVideo) {
            alert('Please wait for the video upload to finish.');
            return;
        }
        if (!videoForm.title || !videoForm.videoUrl) {
            alert('Please provide at least a Title and Video URL.');
            return;
        }

        const payload = {
            ...videoForm,
            features: typeof videoForm.features === 'string'
                ? videoForm.features.split(',').map(f => f.trim()).filter(Boolean)
                : videoForm.features
        };

        if (editingVideoId) {
            await updateMachineryVideo(editingVideoId, payload);
            showAlert('Machinery video updated successfully!');
        } else {
            await addMachineryVideo(payload);
            showAlert('New machinery video published!');
        }
        setIsVideoModalOpen(false);
    };

    const handleDeleteVideo = async (id, title) => {
        if (window.confirm(`Delete machinery video "${title}"?`)) {
            await deleteMachineryVideo(id);
            showAlert('Machinery video deleted.');
        }
    };

    // ==========================================
    // 2. SERVICES CATALOG STATE & MODAL
    // ==========================================
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [serviceForm, setServiceForm] = useState({
        title: '',
        slug: '',
        category: 'Printing & Fabrication',
        shortDesc: '',
        description: '',
        startingPrice: '₹299',
        turnaround: 'Same-Day / 24 Hours',
        badge: 'Popular',
        equipmentUsed: '',
        image: '',
        videoUrl: '',
        features: '',
        active: true
    });

    const openNewServiceModal = () => {
        setEditingServiceId(null);
        setServiceForm({
            title: '',
            slug: '',
            category: 'Printing & Fabrication',
            shortDesc: '',
            description: '',
            startingPrice: '₹299',
            turnaround: 'Same-Day / 24 Hours',
            badge: 'Industrial Grade',
            equipmentUsed: '',
            image: '',
            videoUrl: '',
            features: '',
            active: true
        });
        setIsServiceModalOpen(true);
    };

    const openEditServiceModal = (s) => {
        setEditingServiceId(s.id || s._id);
        setServiceForm({
            title: s.title || '',
            slug: s.slug || '',
            category: s.category || 'Printing & Fabrication',
            shortDesc: s.shortDesc || '',
            description: s.description || '',
            startingPrice: s.startingPrice || '₹299',
            turnaround: s.turnaround || '24 Hours',
            badge: s.badge || '',
            equipmentUsed: s.equipmentUsed || '',
            image: s.image || '',
            videoUrl: s.videoUrl || '',
            features: Array.isArray(s.features) ? s.features.join(', ') : (s.features || ''),
            active: s.active !== false
        });
        setIsServiceModalOpen(true);
    };

    const handleServiceImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            showAlert('Uploading service image...');
            const res = await uploadImageFile(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
            setServiceForm(prev => ({ ...prev, image: res.url }));
            showAlert('✅ Service image uploaded!');
        } catch (err) {
            alert('Failed to upload image: ' + err.message);
        }
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        if (!serviceForm.title) {
            alert('Please provide a service title.');
            return;
        }

        const autoSlug = serviceForm.slug || serviceForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const payload = {
            ...serviceForm,
            slug: autoSlug,
            features: typeof serviceForm.features === 'string'
                ? serviceForm.features.split(',').map(f => f.trim()).filter(Boolean)
                : serviceForm.features
        };

        if (editingServiceId) {
            await updateService(editingServiceId, payload);
            showAlert('Service catalog item updated!');
        } else {
            await addService(payload);
            showAlert('New service added to catalog!');
        }
        setIsServiceModalOpen(false);
    };

    const handleDeleteService = async (id, title) => {
        if (window.confirm(`Delete service "${title}" from catalog?`)) {
            await deleteService(id);
            showAlert('Service deleted from catalog.');
        }
    };

    // ==========================================
    // 3. EQUIPMENT & HARDWARE STATE & MODAL
    // ==========================================
    const [isEquipModalOpen, setIsEquipModalOpen] = useState(false);
    const [editingEquipId, setEditingEquipId] = useState(null);
    const [equipForm, setEquipForm] = useState({
        name: '',
        category: 'UV Printing',
        status: 'Operational',
        description: '',
        specs: '',
        image: '',
        videoUrl: ''
    });

    const openNewEquipModal = () => {
        setEditingEquipId(null);
        setEquipForm({
            name: '',
            category: 'UV Printing',
            status: 'Operational',
            description: '',
            specs: '',
            image: '',
            videoUrl: ''
        });
        setIsEquipModalOpen(true);
    };

    const openEditEquipModal = (eq) => {
        setEditingEquipId(eq.id || eq._id);
        setEquipForm({
            name: eq.name || '',
            category: eq.category || 'UV Printing',
            status: eq.status || 'Operational',
            description: eq.description || '',
            specs: Array.isArray(eq.specs) ? eq.specs.join(', ') : (eq.specs || ''),
            image: eq.image || '',
            videoUrl: eq.videoUrl || ''
        });
        setIsEquipModalOpen(true);
    };

    const handleEquipImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            showAlert('Uploading equipment photo...');
            const res = await uploadImageFile(file, { maxWidth: 1920, maxHeight: 1080, quality: 0.85 });
            setEquipForm(prev => ({ ...prev, image: res.url }));
            showAlert('✅ Equipment photo uploaded!');
        } catch (err) {
            alert('Failed to upload image: ' + err.message);
        }
    };

    const handleSaveEquipment = async (e) => {
        e.preventDefault();
        if (!equipForm.name) {
            alert('Please provide equipment name.');
            return;
        }

        const payload = {
            ...equipForm,
            specs: typeof equipForm.specs === 'string'
                ? equipForm.specs.split(',').map(s => s.trim()).filter(Boolean)
                : equipForm.specs
        };

        if (editingEquipId) {
            await updateEquipment(editingEquipId, payload);
            showAlert('Equipment updated successfully!');
        } else {
            await addEquipment(payload);
            showAlert('New equipment logged in workshop registry!');
        }
        setIsEquipModalOpen(false);
    };

    const handleDeleteEquipment = async (id, name) => {
        if (window.confirm(`Delete equipment "${name}"?`)) {
            await deleteEquipment(id);
            showAlert('Equipment removed.');
        }
    };

    // ==========================================
    // FILTERED LISTS
    // ==========================================
    const filteredVideos = (machineryVideos || []).filter(v => {
        const matchCat = filterCategory === 'All' || v.category === filterCategory;
        const matchSearch = !searchQuery || 
            v.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            v.machineModel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.category?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const filteredServices = (services || []).filter(s => {
        const matchCat = filterCategory === 'All' || s.category === filterCategory;
        const matchSearch = !searchQuery || 
            s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.equipmentUsed?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const filteredEquipment = (equipment || []).filter(eq => {
        const matchCat = filterCategory === 'All' || eq.category === filterCategory;
        const matchSearch = !searchQuery || 
            eq.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            eq.category?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className={styles.servicesPage}>
            {/* Page Header */}
            <div className={styles.header}>
                <div>
                    <h1>Our Services & Machinery Production Hub</h1>
                    <p>Manage customer-facing service categories, live production machinery videos, and verified workshop hardware.</p>
                </div>

                <div className={styles.headerActions}>
                    <button onClick={refreshData} className={styles.actionBtn} title="Sync Live Data">
                        <RefreshCw size={18} />
                    </button>
                    {activeTab === 'videos' && (
                        <button onClick={openNewVideoModal} className={styles.addBtn}>
                            <Plus size={18} /> Add Machinery Video
                        </button>
                    )}
                    {activeTab === 'services' && (
                        <button onClick={openNewServiceModal} className={styles.addBtn}>
                            <Plus size={18} /> Add Service Category
                        </button>
                    )}
                    {activeTab === 'equipment' && (
                        <button onClick={openNewEquipModal} className={styles.addBtn}>
                            <Plus size={18} /> Add Equipment
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

            {/* Tabs */}
            <div className={styles.tabBar}>
                <button 
                    className={`${styles.tabBtn} ${activeTab === 'videos' ? styles.activeTab : ''}`}
                    onClick={() => { setActiveTab('videos'); setFilterCategory('All'); }}
                >
                    <Video size={18} />
                    <span>Machinery in Action Videos ({machineryVideos?.length || 0})</span>
                </button>

                <button 
                    className={`${styles.tabBtn} ${activeTab === 'services' ? styles.activeTab : ''}`}
                    onClick={() => { setActiveTab('services'); setFilterCategory('All'); }}
                >
                    <Layers size={18} />
                    <span>Services Catalog ({services?.length || 0})</span>
                </button>

                <button 
                    className={`${styles.tabBtn} ${activeTab === 'equipment' ? styles.activeTab : ''}`}
                    onClick={() => { setActiveTab('equipment'); setFilterCategory('All'); }}
                >
                    <Cpu size={18} />
                    <span>Workshop Equipment ({equipment?.length || 0})</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <input 
                    type="text" 
                    placeholder={`Search ${activeTab === 'videos' ? 'videos by title or machine...' : activeTab === 'services' ? 'services by name or equipment...' : 'equipment by name...'}`}
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
                    <option value="UV Printing">UV Printing</option>
                    <option value="Laser Cutting">Laser Cutting</option>
                    <option value="Epson Printing">Epson Printing</option>
                    <option value="Laptop Servicing">Laptop Servicing</option>
                    <option value="Live Streaming">Live Streaming</option>
                    <option value="Custom Gifts">Custom Gifts</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Logo & Poster Design">Logo & Poster Design</option>
                    <option value="Photography">Photography</option>
                </select>
            </div>

            {/* =========================================================
                TAB 1: MACHINERY VIDEOS
            ========================================================= */}
            {activeTab === 'videos' && (
                <div className={styles.tabContent}>
                    {filteredVideos.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No Machinery Videos Found</h3>
                            <p>Upload a video clip or add a YouTube link to show your machines running in real production.</p>
                            <button onClick={openNewVideoModal} className={styles.addBtn} style={{ marginTop: '1rem' }}>
                                <Plus size={18} /> Add First Machinery Video
                            </button>
                        </div>
                    ) : (
                        <div className={styles.cardsGrid}>
                            {filteredVideos.map((v) => {
                                const id = v.id || v._id;
                                return (
                                    <div key={id} className={styles.card}>
                                        <div className={styles.previewBox}>
                                            <SafeVideo 
                                                src={v.videoUrl} 
                                                poster={v.thumbnail} 
                                                controls={true}
                                                className={styles.previewVideo}
                                            />
                                            <span className={styles.pillBadge}>{v.category}</span>
                                            {v.duration && <span className={styles.durationBadge}><Clock size={11} style={{ marginRight: 3, verticalAlign: 'middle' }} />{v.duration}</span>}
                                        </div>

                                        <div className={styles.cardDetails}>
                                            <span className={styles.categoryTag}>{v.category}</span>
                                            <h3>{v.title}</h3>
                                            {v.machineModel && (
                                                <div className={styles.machineModel}>
                                                    <Cpu size={14} />
                                                    <span>{v.machineModel}</span>
                                                </div>
                                            )}
                                            {v.description && <p className={styles.desc}>{v.description}</p>}

                                            {v.features && v.features.length > 0 && (
                                                <div className={styles.specsList}>
                                                    {(Array.isArray(v.features) ? v.features : [v.features]).map((f, i) => (
                                                        <span key={i} className={styles.specPill}>{f}</span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className={styles.cardMeta}>
                                                <span className={styles.turnaroundTag}>{v.resolution || '4K UHD'} • {v.aspect || '16:9'}</span>
                                                <div className={styles.cardActions}>
                                                    <button onClick={() => openEditVideoModal(v)} className={styles.actionBtn} title="Edit Video">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteVideo(id, v.title)} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete Video">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* =========================================================
                TAB 2: SERVICES CATALOG
            ========================================================= */}
            {activeTab === 'services' && (
                <div className={styles.tabContent}>
                    {filteredServices.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No Services Found</h3>
                            <p>Add service offerings to show on the customer-facing /services page.</p>
                            <button onClick={openNewServiceModal} className={styles.addBtn} style={{ marginTop: '1rem' }}>
                                <Plus size={18} /> Add First Service
                            </button>
                        </div>
                    ) : (
                        <div className={styles.cardsGrid}>
                            {filteredServices.map((s) => {
                                const id = s.id || s._id;
                                return (
                                    <div key={id} className={styles.card}>
                                        <div className={styles.previewBox}>
                                            {s.image ? (
                                                <img src={s.image} alt={s.title} className={styles.previewImg} />
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b', gap: '0.5rem' }}>
                                                    <Layers size={36} color="var(--color-champagne-gold)" />
                                                    <span>Service Offering</span>
                                                </div>
                                            )}
                                            {s.badge && <span className={styles.pillBadge}>{s.badge}</span>}
                                        </div>

                                        <div className={styles.cardDetails}>
                                            <span className={styles.categoryTag}>{s.category}</span>
                                            <h3>{s.title}</h3>
                                            {s.equipmentUsed && (
                                                <div className={styles.machineModel}>
                                                    <Cpu size={14} />
                                                    <span>{s.equipmentUsed}</span>
                                                </div>
                                            )}
                                            <p className={styles.desc}>{s.shortDesc || s.description}</p>

                                            {s.features && s.features.length > 0 && (
                                                <div className={styles.specsList}>
                                                    {(Array.isArray(s.features) ? s.features : [s.features]).map((f, i) => (
                                                        <span key={i} className={styles.specPill}>✓ {f}</span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className={styles.cardMeta}>
                                                <div>
                                                    <div className={styles.priceTag}>{s.startingPrice || 'Custom Quote'}</div>
                                                    <div className={styles.turnaroundTag}>{s.turnaround || 'Fast Delivery'}</div>
                                                </div>
                                                <div className={styles.cardActions}>
                                                    <button onClick={() => openEditServiceModal(s)} className={styles.actionBtn} title="Edit Service">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteService(id, s.title)} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete Service">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* =========================================================
                TAB 3: WORKSHOP EQUIPMENT & MACHINES
            ========================================================= */}
            {activeTab === 'equipment' && (
                <div className={styles.tabContent}>
                    {filteredEquipment.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No Equipment Logged</h3>
                            <p>Register your studio's machinery and hardware to build trust with customers.</p>
                            <button onClick={openNewEquipModal} className={styles.addBtn} style={{ marginTop: '1rem' }}>
                                <Plus size={18} /> Add Equipment
                            </button>
                        </div>
                    ) : (
                        <div className={styles.cardsGrid}>
                            {filteredEquipment.map((eq) => {
                                const id = eq.id || eq._id;
                                const statusClass = 
                                    eq.status === 'Operational' ? styles.statusOperational :
                                    eq.status === 'Maintenance' ? styles.statusMaintenance :
                                    styles.statusStandby;

                                return (
                                    <div key={id} className={styles.card}>
                                        <div className={styles.previewBox}>
                                            {eq.image ? (
                                                <img src={eq.image} alt={eq.name} className={styles.previewImg} />
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748b', gap: '0.5rem' }}>
                                                    <Cpu size={36} color="var(--color-champagne-gold)" />
                                                    <span>Hardware Machine</span>
                                                </div>
                                            )}
                                            <span className={`${styles.pillBadge} ${statusClass}`}>{eq.status || 'Operational'}</span>
                                        </div>

                                        <div className={styles.cardDetails}>
                                            <span className={styles.categoryTag}>{eq.category}</span>
                                            <h3>{eq.name}</h3>
                                            {eq.description && <p className={styles.desc}>{eq.description}</p>}

                                            {eq.specs && eq.specs.length > 0 && (
                                                <div className={styles.specsList}>
                                                    {(Array.isArray(eq.specs) ? eq.specs : [eq.specs]).map((sp, i) => (
                                                        <span key={i} className={styles.specPill}>{sp}</span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className={styles.cardMeta}>
                                                <span className={styles.turnaroundTag}>Status: <strong>{eq.status || 'Operational'}</strong></span>
                                                <div className={styles.cardActions}>
                                                    <button onClick={() => openEditEquipModal(eq)} className={styles.actionBtn} title="Edit Equipment">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDeleteEquipment(id, eq.name)} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Delete Equipment">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* =========================================================
                MODAL 1: ADD / EDIT MACHINERY VIDEO
            ========================================================= */}
            {isVideoModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>{editingVideoId ? 'Edit Machinery Video' : 'Add Machinery Video'}</h2>
                            <button onClick={() => setIsVideoModalOpen(false)} className={styles.closeModalBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveVideo} className={styles.modalBody}>
                            {/* File Upload Zone */}
                            <div className={styles.formGroup}>
                                <label><Upload size={14} /> Upload Video File (R2 Storage or Local Stream)</label>
                                <div className={styles.uploadZone}>
                                    <input 
                                        type="file" 
                                        accept="video/*" 
                                        onChange={handleVideoFileSelect}
                                        style={{ display: 'none' }}
                                        id="machineryVideoFileInput"
                                    />
                                    <label htmlFor="machineryVideoFileInput" style={{ cursor: 'pointer', display: 'block' }}>
                                        <Video size={28} color="var(--color-emerald-deep)" style={{ marginBottom: '0.35rem' }} />
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                                            Click to select MP4 / WebM / MOV video
                                        </div>
                                        <div className={styles.helperText}>
                                            Uploads directly to Cloudflare R2 / Server storage with frame extraction
                                        </div>
                                    </label>

                                    {isUploadingVideo && (
                                        <div className={styles.uploadProgressWrapper}>
                                            <div className={styles.progressBar}>
                                                <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
                                            </div>
                                            <div className={styles.uploadStatus}>{uploadStatusMsg}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Direct Video URL / YouTube Input */}
                            <div className={styles.formGroup}>
                                <label>Or Enter Video URL (YouTube, Vimeo, R2 URL, or /service-videos/...)</label>
                                <input 
                                    type="text" 
                                    value={videoForm.videoUrl} 
                                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                                    placeholder="e.g. /service-videos/uv-printing.mp4 or https://youtube.com/watch?v=..."
                                    required
                                />
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Video Title *</label>
                                    <input 
                                        type="text" 
                                        value={videoForm.title} 
                                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                                        placeholder="e.g. UV Flatbed Printing Live Production"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Service Category</label>
                                    <select 
                                        value={videoForm.category}
                                        onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                                    >
                                        <option value="UV Printing">UV Printing</option>
                                        <option value="Laser Cutting">Laser Cutting</option>
                                        <option value="Epson Printing">Epson Printing</option>
                                        <option value="Laptop Servicing">Laptop Servicing</option>
                                        <option value="Live Streaming">Live Streaming</option>
                                        <option value="Custom Gifts">Custom Gifts</option>
                                        <option value="Video Editing">Video Editing</option>
                                        <option value="Logo & Poster Design">Logo & Poster Design</option>
                                        <option value="Photography">Photography</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Machine Model</label>
                                    <input 
                                        type="text" 
                                        value={videoForm.machineModel} 
                                        onChange={(e) => setVideoForm({ ...videoForm, machineModel: e.target.value })}
                                        placeholder="e.g. Mimaki UJF-3042 MkII EX"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Duration & Resolution</label>
                                    <input 
                                        type="text" 
                                        value={videoForm.duration} 
                                        onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                                        placeholder="01:15 • 4K UHD"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Custom Thumbnail URL (Optional)</label>
                                <input 
                                    type="text" 
                                    value={videoForm.thumbnail} 
                                    onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                                    placeholder="https://... or /samples/thumbnails/..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <textarea 
                                    rows="2"
                                    value={videoForm.description} 
                                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                                    placeholder="Brief overview of what the machine does in this video..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Highlight Features (Comma separated)</label>
                                <input 
                                    type="text" 
                                    value={videoForm.features} 
                                    onChange={(e) => setVideoForm({ ...videoForm, features: e.target.value })}
                                    placeholder="e.g. White ink layer, Embossed tactile finish, Rotary bottle jig"
                                />
                            </div>

                            {/* Live Preview before save */}
                            {videoForm.videoUrl && (
                                <div className={styles.formGroup}>
                                    <label><Eye size={14} /> Live Video Player Preview</label>
                                    <div style={{ maxHeight: '200px', overflow: 'hidden', borderRadius: '12px' }}>
                                        <SafeVideo 
                                            src={videoForm.videoUrl} 
                                            poster={videoForm.thumbnail} 
                                            controls={true} 
                                            style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', background: '#000' }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setIsVideoModalOpen(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.saveBtn} disabled={isUploadingVideo}>
                                    <Save size={16} /> {editingVideoId ? 'Save Changes' : 'Publish Video'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================
                MODAL 2: ADD / EDIT SERVICE CATEGORY
            ========================================================= */}
            {isServiceModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>{editingServiceId ? 'Edit Service' : 'Add New Service Category'}</h2>
                            <button onClick={() => setIsServiceModalOpen(false)} className={styles.closeModalBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveService} className={styles.modalBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Service Title *</label>
                                    <input 
                                        type="text" 
                                        value={serviceForm.title} 
                                        onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                                        placeholder="e.g. UV Flatbed Printing"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Slug (URL identifier)</label>
                                    <input 
                                        type="text" 
                                        value={serviceForm.slug} 
                                        onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })}
                                        placeholder="e.g. uv-printing"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Category Group</label>
                                    <input 
                                        type="text" 
                                        value={serviceForm.category} 
                                        onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                                        placeholder="e.g. Printing & Fabrication"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Badge Tag</label>
                                    <input 
                                        type="text" 
                                        value={serviceForm.badge} 
                                        onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                                        placeholder="e.g. Industrial Grade / Popular"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Starting Price</label>
                                    <input 
                                        type="text" 
                                        value={serviceForm.startingPrice} 
                                        onChange={(e) => setServiceForm({ ...serviceForm, startingPrice: e.target.value })}
                                        placeholder="e.g. ₹299"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Turnaround Time</label>
                                    <input 
                                        type="text" 
                                        value={serviceForm.turnaround} 
                                        onChange={(e) => setServiceForm({ ...serviceForm, turnaround: e.target.value })}
                                        placeholder="e.g. Same-Day / 24 Hours"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Equipment Used</label>
                                <input 
                                    type="text" 
                                    value={serviceForm.equipmentUsed} 
                                    onChange={(e) => setServiceForm({ ...serviceForm, equipmentUsed: e.target.value })}
                                    placeholder="e.g. Mimaki UJF-3042 MkII EX"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Cover Image (Upload or URL)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input 
                                        type="text" 
                                        value={serviceForm.image} 
                                        onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                                        placeholder="https://... or /samples/..."
                                        style={{ flex: 1 }}
                                    />
                                    <label className={styles.actionBtn} style={{ cursor: 'pointer', width: 'auto', padding: '0 0.8rem', gap: '0.35rem' }}>
                                        <Upload size={14} /> Upload
                                        <input type="file" accept="image/*" onChange={handleServiceImageUpload} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Machinery Video Link (Optional)</label>
                                <input 
                                    type="text" 
                                    value={serviceForm.videoUrl} 
                                    onChange={(e) => setServiceForm({ ...serviceForm, videoUrl: e.target.value })}
                                    placeholder="/service-videos/... or YouTube link"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Short Description (for cards)</label>
                                <textarea 
                                    rows="2"
                                    value={serviceForm.shortDesc} 
                                    onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                                    placeholder="Quick punchy summary..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Key Features & Capabilities (Comma separated)</label>
                                <input 
                                    type="text" 
                                    value={serviceForm.features} 
                                    onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                                    placeholder="e.g. Up to 1200 DPI, Acrylic and Wood, Scratch Resistant"
                                />
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setIsServiceModalOpen(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.saveBtn}>
                                    <Save size={16} /> {editingServiceId ? 'Save Changes' : 'Create Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* =========================================================
                MODAL 3: ADD / EDIT EQUIPMENT
            ========================================================= */}
            {isEquipModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>{editingEquipId ? 'Edit Equipment' : 'Add Workshop Equipment'}</h2>
                            <button onClick={() => setIsEquipModalOpen(false)} className={styles.closeModalBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEquipment} className={styles.modalBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Machine / Equipment Name *</label>
                                    <input 
                                        type="text" 
                                        value={equipForm.name} 
                                        onChange={(e) => setEquipForm({ ...equipForm, name: e.target.value })}
                                        placeholder="e.g. Mimaki UJF-3042 MkII EX"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Operational Status</label>
                                    <select 
                                        value={equipForm.status}
                                        onChange={(e) => setEquipForm({ ...equipForm, status: e.target.value })}
                                    >
                                        <option value="Operational">Operational (Active)</option>
                                        <option value="Maintenance">Under Maintenance</option>
                                        <option value="Standby">Standby</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Category</label>
                                    <select 
                                        value={equipForm.category}
                                        onChange={(e) => setEquipForm({ ...equipForm, category: e.target.value })}
                                    >
                                        <option value="UV Printing">UV Printing</option>
                                        <option value="Laser Cutting">Laser Cutting</option>
                                        <option value="Epson Printing">Epson Printing</option>
                                        <option value="Laptop Servicing">Laptop Servicing</option>
                                        <option value="Live Streaming">Live Streaming</option>
                                        <option value="Custom Gifts">Custom Gifts</option>
                                        <option value="Video Editing">Video Editing</option>
                                        <option value="Photography">Photography</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Demo Video Link (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={equipForm.videoUrl} 
                                        onChange={(e) => setEquipForm({ ...equipForm, videoUrl: e.target.value })}
                                        placeholder="/service-videos/... or YouTube link"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Photo (Upload or URL)</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input 
                                        type="text" 
                                        value={equipForm.image} 
                                        onChange={(e) => setEquipForm({ ...equipForm, image: e.target.value })}
                                        placeholder="https://... or /samples/..."
                                        style={{ flex: 1 }}
                                    />
                                    <label className={styles.actionBtn} style={{ cursor: 'pointer', width: 'auto', padding: '0 0.8rem', gap: '0.35rem' }}>
                                        <Upload size={14} /> Upload
                                        <input type="file" accept="image/*" onChange={handleEquipImageUpload} style={{ display: 'none' }} />
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Description & Purpose</label>
                                <textarea 
                                    rows="2"
                                    value={equipForm.description} 
                                    onChange={(e) => setEquipForm({ ...equipForm, description: e.target.value })}
                                    placeholder="Machine capabilities, materials handled, precision..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Hardware Specifications (Comma separated)</label>
                                <input 
                                    type="text" 
                                    value={equipForm.specs} 
                                    onChange={(e) => setEquipForm({ ...equipForm, specs: e.target.value })}
                                    placeholder="e.g. Bed: 300x420mm, Resolution: 1200 DPI, Ink: LH-100 UV"
                                />
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setIsEquipModalOpen(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.saveBtn}>
                                    <Save size={16} /> {editingEquipId ? 'Save Changes' : 'Log Equipment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminServices;
