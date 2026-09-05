import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Grid, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import styles from './AdminCategories.module.css';

const AdminCategories = () => {
    const { categories, addCategory, updateCategory, deleteCategory, refreshCategories } = useData();
    const [refreshing, setRefreshing] = useState(false);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCatId, setEditingCatId] = useState(null);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            if (refreshCategories) {
                await refreshCategories();
            }
        } finally {
            setRefreshing(false);
        }
    };

    const handleOpenAdd = () => {
        setEditingCatId(null);
        setName('');
        setImage('');
        setIsFormOpen(true);
    };

    const handleOpenEdit = (cat) => {
        setEditingCatId(cat.id);
        setName(cat.name);
        setImage(cat.image || '');
        setIsFormOpen(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => setImage(evt.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (editingCatId) {
            updateCategory(editingCatId, { name, image });
        } else {
            addCategory({ name, image });
        }

        setIsFormOpen(false);
        setName('');
        setImage('');
    };

    return (
        <div className={styles.categoriesPage}>
            <div className={styles.topHeader}>
                <div>
                    <h1>Category Management</h1>
                    <p>Create and manage personalized gift categories displayed on the customer website.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={handleRefresh} 
                        className={styles.refreshBtn}
                        disabled={refreshing}
                        title="Refresh Categories"
                        style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <RefreshCw size={16} className={refreshing ? styles.spinning : ''} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button onClick={handleOpenAdd} className={styles.addBtn}>
                        <Plus size={18} /> Add New Category
                    </button>
                </div>
            </div>

            {categories.length > 0 ? (
                <div className={styles.grid}>
                    {categories.map(cat => (
                        <div key={cat.id} className={styles.catCard}>
                            <img src={cat.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80'} alt={cat.name} />
                            <div className={styles.cardBody}>
                                <h3>{cat.name}</h3>
                                <div className={styles.cardActions}>
                                    <button onClick={() => handleOpenEdit(cat)} className={styles.editBtn}><Edit size={14} /> Edit</button>
                                    <button onClick={() => { if (confirm('Delete category?')) deleteCategory(cat.id); }} className={styles.deleteBtn}><Trash2 size={14} /> Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <Grid size={48} color="#cbd5e1" />
                    <h3>No categories created yet</h3>
                    <p>Click "Add New Category" to create product categories e.g. Acrylic Photo Frames, Mugs, Wooden Frames.</p>
                </div>
            )}

            {isFormOpen && (
                <div className={styles.backdrop} onClick={() => setIsFormOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>{editingCatId ? 'Edit Category' : 'Add New Category'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.group}>
                                <label>Category Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Acrylic Photo Frames"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.group}>
                                <label>Category Image</label>
                                <div className={styles.uploadBox}>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} id="cat-img" hidden />
                                    <label htmlFor="cat-img" className={styles.uploadBtn}>
                                        <Upload size={16} /> Choose Image File
                                    </label>
                                    {image && <img src={image} alt="Preview" className={styles.previewImg} />}
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" onClick={() => setIsFormOpen(false)} className={styles.cancelBtn}>Cancel</button>
                                <button type="submit" className={styles.saveBtn}>Save Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
