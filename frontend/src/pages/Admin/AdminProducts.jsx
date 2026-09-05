import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Copy, Search, Upload, Sliders, Image as ImageIcon, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAdmin } from '../../context/AdminContext';
import styles from './AdminProducts.module.css';

const AdminProducts = () => {
    const { products, categories, addProduct, updateProduct, deleteProduct } = useData();
    const { fetchProducts, refreshingProducts } = useAdmin();
    const location = useLocation();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    // Initial check for /admin/products/new
    useEffect(() => {
        if (location.pathname.endsWith('/new')) {
            resetForm();
            setIsFormOpen(true);
        }
    }, [location.pathname]);

    // Product Form State
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        subcategory: '',
        regularPrice: '',
        salePrice: '',
        gstPercent: 18,
        stock: 50,
        image: '',
        galleryImages: [],
        shortDescription: '',
        fullDescription: '',
        featured: false,
        bestSeller: false,
        newArrival: true,
        personalized: true,
        photoRequired: true,
        textCustomization: true,
        status: 'active',
        customizationOptions: [
            {
                name: 'Frame Size',
                type: 'radio',
                options: [
                    { label: '6x4 Inches', priceAdjustment: 0, stock: 50, available: true },
                    { label: '8x6 Inches', priceAdjustment: 100, stock: 50, available: true },
                    { label: '12x18 Inches', priceAdjustment: 350, stock: 50, available: true }
                ]
            },
            {
                name: 'Frame Color',
                type: 'color',
                options: [
                    { label: 'Black', hex: '#1a1a1a', priceAdjustment: 0, stock: 50, available: true },
                    { label: 'Gold', hex: '#d4af37', priceAdjustment: 50, stock: 50, available: true },
                    { label: 'White', hex: '#f8f9fa', priceAdjustment: 0, stock: 50, available: true }
                ]
            }
        ]
    });

    const resetForm = () => {
        setFormData({
            name: '',
            sku: '',
            category: categories[0]?.name || '',
            subcategory: '',
            regularPrice: '',
            salePrice: '',
            gstPercent: 18,
            stock: 50,
            image: '',
            galleryImages: [],
            shortDescription: '',
            fullDescription: '',
            featured: false,
            bestSeller: false,
            newArrival: true,
            personalized: true,
            photoRequired: true,
            textCustomization: true,
            status: 'active',
            customizationOptions: [
                {
                    name: 'Frame Size',
                    type: 'radio',
                    options: [
                        { label: '6x4 Inches', priceAdjustment: 0, stock: 50, available: true },
                        { label: '8x6 Inches', priceAdjustment: 100, stock: 50, available: true },
                        { label: '12x18 Inches', priceAdjustment: 350, stock: 50, available: true }
                    ]
                }
            ]
        });
        setEditingProductId(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsFormOpen(true);
        navigate('/admin/products/new');
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        resetForm();
        navigate('/admin/products');
    };

    const handleOpenEdit = (product) => {
        setEditingProductId(product.id);
        setFormData({
            ...product,
            customizationOptions: product.customizationOptions || [],
            galleryImages: product.galleryImages || []
        });
        setIsFormOpen(true);
    };

    const handleMainImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Compress image before converting to base64
        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Resize image to max 800x800 for faster upload
                let width = img.width;
                let height = img.height;
                const maxSize = 800;
                
                if (width > height && width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                } else if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with compression (0.8 quality)
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                setFormData(prev => ({ ...prev, image: compressedBase64 }));
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (evt) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Resize gallery images to max 600x600
                    let width = img.width;
                    let height = img.height;
                    const maxSize = 600;
                    
                    if (width > height && width > maxSize) {
                        height = (height * maxSize) / width;
                        width = maxSize;
                    } else if (height > maxSize) {
                        width = (width * maxSize) / height;
                        height = maxSize;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to base64 with compression
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    setFormData(prev => ({
                        ...prev,
                        galleryImages: [...prev.galleryImages, compressedBase64]
                    }));
                };
                img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, idx) => idx !== index)
        }));
    };

    // Customization Builder Handlers
    const handleAddOptionGroup = () => {
        setFormData(prev => ({
            ...prev,
            customizationOptions: [
                ...prev.customizationOptions,
                { name: 'New Customization', type: 'radio', options: [{ label: 'Choice 1', priceAdjustment: 0, stock: 50, available: true }] }
            ]
        }));
    };

    const handleRemoveOptionGroup = (groupIdx) => {
        setFormData(prev => ({
            ...prev,
            customizationOptions: prev.customizationOptions.filter((_, idx) => idx !== groupIdx)
        }));
    };

    const handleAddOptionVal = (groupIdx) => {
        const updated = [...formData.customizationOptions];
        updated[groupIdx].options.push({ label: 'New Choice', priceAdjustment: 0, stock: 50, available: true });
        setFormData({ ...formData, customizationOptions: updated });
    };

    const handleRemoveOptionVal = (groupIdx, valIdx) => {
        const updated = [...formData.customizationOptions];
        updated[groupIdx].options = updated[groupIdx].options.filter((_, idx) => idx !== valIdx);
        setFormData({ ...formData, customizationOptions: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.salePrice) {
            alert('Please fill in Product Name and Sale Price.');
            return;
        }

        // Show immediate feedback
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';

        const payload = {
            ...formData,
            regularPrice: Number(formData.regularPrice || formData.salePrice),
            salePrice: Number(formData.salePrice),
            stock: Number(formData.stock || 50),
            sku: formData.sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000)
        };

        try {
            if (editingProductId) {
                await updateProduct(editingProductId, payload);
            } else {
                await addProduct(payload);
            }
            handleCloseForm();
        } catch (error) {
            alert(error.message || 'Unable to save the product. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    };

    const handleDuplicate = async (product) => {
        const dup = {
            ...product,
            id: undefined,
            name: `${product.name} (Copy)`,
            sku: `${product.sku}-COPY`
        };
        try { await addProduct(dup); } catch (error) { alert(error.message || 'Unable to duplicate the product.'); }
    };

    const filteredProducts = products.filter(p => {
        const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
        return matchSearch && matchCat;
    });

    return (
        <div className={styles.productsPage}>
            <div className={styles.topHeader}>
                <div>
                    <h1>Product & Customization Control</h1>
                    <p>Add, edit, unpublish, and configure customized options for Raja Studio gifts.</p>
                </div>
                <button onClick={handleOpenAdd} className={styles.addBtn}>
                    <Plus size={18} /> + ADD NEW PRODUCT
                </button>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="All">All Categories ({products.length})</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                
                <button 
                    onClick={() => fetchProducts(true)} 
                    className={styles.refreshBtn}
                    disabled={refreshingProducts}
                    title="Refresh Products"
                    style={{ marginLeft: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <RefreshCw size={16} className={refreshingProducts ? styles.spinning : ''} />
                    {refreshingProducts ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Products Table */}
            <div className={styles.tableCard}>
                {filteredProducts.length > 0 ? (
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Regular MRP</th>
                                <th>Sale Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => (
                                <tr key={p.id}>
                                    <td className={styles.productCell}>
                                        <img src={p.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&auto=format&fit=crop&q=80'} alt={p.name} />
                                        <div>
                                            <strong>{p.name}</strong>
                                            <p className={styles.skuText}>SKU: {p.sku || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td>{p.category || 'Uncategorized'}</td>
                                    <td>₹{p.regularPrice || p.price}</td>
                                    <td className={styles.salePriceCol}>₹{p.salePrice || p.price}</td>
                                    <td>{p.stock}</td>
                                    <td>
                                        <button
                                            onClick={() => updateProduct(p.id, { status: p.status === 'active' ? 'disabled' : 'active' })}
                                            className={p.status === 'active' ? styles.statusActive : styles.statusDisabled}
                                        >
                                            {p.status === 'active' ? 'Active / Published' : 'Disabled / Hidden'}
                                        </button>
                                    </td>
                                    <td>
                                        <div className={styles.actionRow}>
                                            <button onClick={() => handleOpenEdit(p)} className={styles.iconBtn} title="Edit Product">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDuplicate(p)} className={styles.iconBtn} title="Duplicate Product">
                                                <Copy size={16} />
                                            </button>
                                            <button onClick={() => { if (confirm('Delete product?')) deleteProduct(p.id); }} className={`${styles.iconBtn} ${styles.deleteIcon}`} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No products found. Click "+ ADD NEW PRODUCT" to create your first gift item!</p>
                    </div>
                )}
            </div>

            {/* Add / Edit Product Modal or Full Form */}
            {isFormOpen && (
                <div className={styles.backdrop} onClick={handleCloseForm}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>{editingProductId ? 'Edit Product Details' : 'Add New Raja Studio Product'}</h2>

                        <form onSubmit={handleSubmit} className={styles.productForm}>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>SKU / Product ID</label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        placeholder="Auto-generated if empty"
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Subcategory</label>
                                    <input
                                        type="text"
                                        value={formData.subcategory}
                                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                                        placeholder="e.g. Wooden Frames, Acrylic"
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Regular Price (MRP ₹)</label>
                                    <input
                                        type="number"
                                        value={formData.regularPrice}
                                        onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Customer Sale Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={formData.salePrice}
                                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>GST %</label>
                                    <input
                                        type="number"
                                        value={formData.gstPercent}
                                        onChange={(e) => setFormData({ ...formData, gstPercent: Number(e.target.value) })}
                                    />
                                </div>

                                {/* Main Image Upload */}
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Main Product Image</label>
                                    <div className={styles.imageUploadRow}>
                                        <input type="file" accept="image/*" onChange={handleMainImageUpload} id="product-main-img" hidden />
                                        <label htmlFor="product-main-img" className={styles.uploadLabel}>
                                            <Upload size={16} /> Choose Main Image File
                                        </label>
                                        {formData.image && <img src={formData.image} alt="Preview" className={styles.imgPreview} />}
                                    </div>
                                </div>

                                {/* Gallery Images Upload */}
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Gallery & Variation Images</label>
                                    <div className={styles.imageUploadRow}>
                                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} id="product-gallery-imgs" hidden />
                                        <label htmlFor="product-gallery-imgs" className={styles.uploadLabel}>
                                            <Upload size={16} /> Upload Gallery Images
                                        </label>
                                    </div>
                                    {formData.galleryImages.length > 0 && (
                                        <div className={styles.galleryPreviewGrid}>
                                            {formData.galleryImages.map((imgUrl, idx) => (
                                                <div key={idx} className={styles.galleryThumbBox}>
                                                    <img src={imgUrl} alt={`Gallery ${idx + 1}`} />
                                                    <button type="button" onClick={() => handleRemoveGalleryImage(idx)}>×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Short Description</label>
                                    <input
                                        type="text"
                                        value={formData.shortDescription}
                                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                    />
                                </div>

                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Full Description & Product Specifications</label>
                                    <textarea
                                        rows="3"
                                        value={formData.fullDescription}
                                        onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className={`${styles.checkboxRow} ${styles.fullWidth}`}>
                                    <label><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} /> Featured Product</label>
                                    <label><input type="checkbox" checked={formData.bestSeller} onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })} /> Best Seller</label>
                                    <label><input type="checkbox" checked={formData.newArrival} onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })} /> New Arrival</label>
                                    <label><input type="checkbox" checked={formData.photoRequired} onChange={(e) => setFormData({ ...formData, photoRequired: e.target.checked })} /> Customer Photo Required</label>
                                </div>
                            </div>

                            {/* DYNAMIC CUSTOMIZATION OPTIONS BUILDER */}
                            <div className={styles.customizerBuilderSection}>
                                <div className={styles.cBuilderHeader}>
                                    <h3><Sliders size={18} /> Admin Customization Builder</h3>
                                    <button type="button" onClick={handleAddOptionGroup} className={styles.addOptGroupBtn}>
                                        + Add Option (Size / Frame / Color)
                                    </button>
                                </div>

                                {formData.customizationOptions.map((group, groupIdx) => (
                                    <div key={groupIdx} className={styles.optionGroupCard}>
                                        <div className={styles.groupTopRow}>
                                            <input
                                                type="text"
                                                value={group.name}
                                                onChange={(e) => {
                                                    const updated = [...formData.customizationOptions];
                                                    updated[groupIdx].name = e.target.value;
                                                    setFormData({ ...formData, customizationOptions: updated });
                                                }}
                                                className={styles.groupNameInput}
                                            />
                                            <select
                                                value={group.type}
                                                onChange={(e) => {
                                                    const updated = [...formData.customizationOptions];
                                                    updated[groupIdx].type = e.target.value;
                                                    setFormData({ ...formData, customizationOptions: updated });
                                                }}
                                            >
                                                <option value="radio">Radio Buttons / Chips</option>
                                                <option value="color">Color Swatches</option>
                                                <option value="dropdown">Dropdown Menu</option>
                                                <option value="text">Text Input</option>
                                                <option value="toggle">Toggle / Checkbox</option>
                                            </select>
                                            <button type="button" onClick={() => handleRemoveOptionGroup(groupIdx)} className={styles.removeGroupBtn}>
                                                Remove Option Group
                                            </button>
                                        </div>

                                        {/* Values list */}
                                        <div className={styles.valuesList}>
                                            {group.options.map((val, valIdx) => (
                                                <div key={valIdx} className={styles.valRow}>
                                                    <input
                                                        type="text"
                                                        placeholder="Value (e.g. 12x18 Inches)"
                                                        value={val.label}
                                                        onChange={(e) => {
                                                            const updated = [...formData.customizationOptions];
                                                            updated[groupIdx].options[valIdx].label = e.target.value;
                                                            setFormData({ ...formData, customizationOptions: updated });
                                                        }}
                                                    />
                                                    {group.type === 'color' && (
                                                        <input
                                                            type="color"
                                                            value={val.hex || '#000000'}
                                                            onChange={(e) => {
                                                                const updated = [...formData.customizationOptions];
                                                                updated[groupIdx].options[valIdx].hex = e.target.value;
                                                                setFormData({ ...formData, customizationOptions: updated });
                                                            }}
                                                        />
                                                    )}
                                                    <input
                                                        type="number"
                                                        placeholder="Final Price (₹)"
                                                        value={val.priceAdjustment}
                                                        onChange={(e) => {
                                                            const updated = [...formData.customizationOptions];
                                                            updated[groupIdx].options[valIdx].priceAdjustment = Number(e.target.value);
                                                            setFormData({ ...formData, customizationOptions: updated });
                                                        }}
                                                        className={styles.adjInput}
                                                        title="Enter the complete price for this option (not an adjustment)"
                                                    />
                                                    <button type="button" onClick={() => handleRemoveOptionVal(groupIdx, valIdx)} className={styles.removeValBtn}>
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => handleAddOptionVal(groupIdx)} className={styles.addValBtn}>
                                                + Add Choice Value
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" onClick={handleCloseForm} className={styles.cancelBtn}>Cancel</button>
                                <button type="submit" className={styles.saveBtn}>Save & Publish Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
