import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Grid, Heart, Package, Image as ImageIcon, MapPin, User, LogOut, Search, Printer, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import InvoiceModal from '../components/UI/InvoiceModal';
import styles from './CustomerDashboard.module.css';

const CustomerDashboard = () => {
    const { customerUser, logoutCustomer } = useAuth();
    const { products, categories, orders } = useData();
    const { cart, wishlist, toggleWishlist, isInWishlist } = useCart();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

    // Filters for "ALL PRODUCTS" tab inside Dashboard
    const [dashSearch, setDashSearch] = useState('');
    const [dashCategory, setDashCategory] = useState('All');

    // Redirect if no customer is logged in
    if (!customerUser) {
        return (
            <div className={`container section-padding ${styles.loginRequired}`}>
                <h2>Customer Login Required</h2>
                <p>Please log in to access your customer dashboard and manage your orders.</p>
                <Link to="/" className={styles.homeLink}>Return to Home</Link>
            </div>
        );
    }

    // Get only this customer's orders
    const myOrders = orders.filter(o => o.customerId === customerUser.id || o.email === customerUser.email);

    // Collect all uploaded photos from customer's orders
    const uploadedPhotosList = myOrders.flatMap(o => (o.items || []).filter(i => i.customPhoto).map(i => ({
        photoUrl: i.customPhoto,
        productName: i.productName,
        orderId: o.id,
        date: o.createdAt,
        quality: i.photoQuality?.quality || 'Uploaded Photo'
    })));

    // Only show products that Admin has added and published
    const availableProducts = products.filter(p => p.status === 'active');
    const filteredDashProducts = availableProducts.filter(p => {
        const matchesSearch = (p.name || '').toLowerCase().includes(dashSearch.toLowerCase());
        const matchesCat = dashCategory === 'All' || p.category === dashCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <div className={styles.dashboardPage}>
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1>Welcome, {customerUser.name || customerUser.email}!</h1>
                    <p>Manage your orders, customized gifts, uploaded photos, and profile.</p>
                </div>
            </div>

            <div className="container section-padding">
                <div className={styles.dashboardLayout}>
                    {/* Sidebar Nav */}
                    <aside className={styles.sidebar}>
                        <div className={styles.userInfoBox}>
                            <div className={styles.avatar}>{customerUser.name ? customerUser.name[0].toUpperCase() : 'U'}</div>
                            <div>
                                <h3>{customerUser.name || 'Valued Customer'}</h3>
                                <p>{customerUser.email}</p>
                            </div>
                        </div>

                        <ul className={styles.navMenuList}>
                            <li className={activeTab === 'overview' ? styles.activeTab : ''} onClick={() => setActiveTab('overview')}>
                                <LayoutDashboard size={18} /> Dashboard
                            </li>
                            <li className={activeTab === 'all-products' ? styles.activeTab : ''} onClick={() => setActiveTab('all-products')}>
                                <ShoppingBag size={18} /> Browse Products
                            </li>
                            <li className={activeTab === 'categories' ? styles.activeTab : ''} onClick={() => setActiveTab('categories')}>
                                <Grid size={18} /> Categories
                            </li>
                            <li>
                                <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <ShoppingBag size={18} /> Cart ({cart.length})
                                </Link>
                            </li>
                            <li>
                                <Link to="/wishlist" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Heart size={18} /> Wishlist ({wishlist.length})
                                </Link>
                            </li>
                            <li className={activeTab === 'orders' ? styles.activeTab : ''} onClick={() => setActiveTab('orders')}>
                                <Package size={18} /> My Orders ({myOrders.length})
                            </li>
                            <li>
                                <Link to="/track-order" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Search size={18} /> Track Order
                                </Link>
                            </li>
                            <li className={activeTab === 'photos' ? styles.activeTab : ''} onClick={() => setActiveTab('photos')}>
                                <ImageIcon size={18} /> Uploaded Photos ({uploadedPhotosList.length})
                            </li>
                            <li className={activeTab === 'addresses' ? styles.activeTab : ''} onClick={() => setActiveTab('addresses')}>
                                <MapPin size={18} /> Saved Addresses
                            </li>
                            <li className={activeTab === 'profile' ? styles.activeTab : ''} onClick={() => setActiveTab('profile')}>
                                <User size={18} /> Manage Profile
                            </li>
                            <li className={styles.logoutBtn} onClick={() => { logoutCustomer(); navigate('/'); }}>
                                <LogOut size={18} /> Logout
                            </li>
                        </ul>
                    </aside>

                    {/* Main Content Area */}
                    <main className={styles.mainContent}>
                        {/* TAB 1: OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className={styles.tabSection}>
                                <h2>Customer Dashboard Overview</h2>
                                <p className={styles.welcomeText}>Welcome to your personalized dashboard! Here you can browse products, manage orders, and track your custom gift creations.</p>
                                
                                <div className={styles.statsGrid}>
                                    <div className={styles.statCard}>
                                        <h3>{myOrders.length}</h3>
                                        <p>Total Orders Placed</p>
                                    </div>
                                    <div className={styles.statCard}>
                                        <h3>{uploadedPhotosList.length}</h3>
                                        <p>Photos Uploaded</p>
                                    </div>
                                    <div className={styles.statCard}>
                                        <h3>{wishlist.length}</h3>
                                        <p>Wishlist Items</p>
                                    </div>
                                    <div className={styles.statCard}>
                                        <h3>{cart.length}</h3>
                                        <p>Items in Cart</p>
                                    </div>
                                </div>

                                <div className={styles.quickActionsGrid}>
                                    <Link to="/shop" className={styles.quickActionCard}>
                                        <ShoppingBag size={24} />
                                        <div>
                                            <h4>Browse Products</h4>
                                            <p>Explore personalized gifts</p>
                                        </div>
                                    </Link>
                                    <Link to="/cart" className={styles.quickActionCard}>
                                        <Package size={24} />
                                        <div>
                                            <h4>View Cart</h4>
                                            <p>{cart.length} items ready to checkout</p>
                                        </div>
                                    </Link>
                                    <Link to="/track-order" className={styles.quickActionCard}>
                                        <Search size={24} />
                                        <div>
                                            <h4>Track Order</h4>
                                            <p>Check order status</p>
                                        </div>
                                    </Link>
                                </div>

                                <div className={styles.recentOrdersBlock}>
                                    <h3>Recent Orders</h3>
                                    {myOrders.length > 0 ? (
                                        <div className={styles.ordersTableWrapper}>
                                            <table className={styles.dashTable}>
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                        <th>Total</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {myOrders.slice(0, 5).map(o => (
                                                        <tr key={o.id}>
                                                            <td><strong>{o.id}</strong></td>
                                                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                                            <td><span className={styles.statusBadge}>{o.status}</span></td>
                                                            <td>₹{o.totalAmount}</td>
                                                            <td>
                                                                <button onClick={() => setSelectedOrderForInvoice(o)} className={styles.invoiceSmallBtn}>
                                                                    <Printer size={14} /> Invoice
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className={styles.emptyOrdersState}>
                                            <Package size={48} color="#ccc" />
                                            <p>No orders placed yet. Browse our personalized gifts to place your first order!</p>
                                            <Link to="/shop" className={styles.shopNowBtn}>Shop Now</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* TAB 2: BROWSE PRODUCTS (Admin-Added Only) */}
                        {activeTab === 'all-products' && (
                            <div className={styles.tabSection}>
                                <div className={styles.tabHeaderFlex}>
                                    <h2>Browse Products ({filteredDashProducts.length})</h2>
                                    <div className={styles.dashSearchRow}>
                                        <div className={styles.searchBox}>
                                            <Search size={16} />
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                value={dashSearch}
                                                onChange={(e) => setDashSearch(e.target.value)}
                                            />
                                        </div>
                                        <select value={dashCategory} onChange={(e) => setDashCategory(e.target.value)}>
                                            <option value="All">All Categories</option>
                                            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {filteredDashProducts.length > 0 ? (
                                    <div className={styles.productsGrid}>
                                        {filteredDashProducts.map(p => (
                                            <div key={p.id} className={styles.productCard}>
                                                <img src={p.image || (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&auto=format&fit=crop&q=80'} alt={p.name} />
                                                <div className={styles.pCardBody}>
                                                    <h4>{p.name}</h4>
                                                    <p className={styles.productPrice}>₹{p.salePrice || p.price}</p>
                                                    <div className={styles.productActions}>
                                                        <Link to={`/product/${p.id}`} className={styles.customizeBtn}>
                                                            Customize & Order
                                                        </Link>
                                                        <button 
                                                            onClick={() => toggleWishlist(p)}
                                                            className={`${styles.wishlistBtn} ${isInWishlist(p.id) ? styles.inWishlist : ''}`}
                                                        >
                                                            <Heart size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.emptyProductsState}>
                                        <ShoppingBag size={48} color="#ccc" />
                                        <p>No products available right now. Admin hasn't added any products yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: CATEGORIES */}
                        {activeTab === 'categories' && (
                            <div className={styles.tabSection}>
                                <h2>Gift Categories</h2>
                                {categories.length > 0 ? (
                                    <div className={styles.categoryCardsGrid}>
                                        {categories.map(c => (
                                            <Link key={c.id} to={`/shop?category=${encodeURIComponent(c.name)}`} className={styles.catCard}>
                                                <img src={c.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80'} alt={c.name} />
                                                <h3>{c.name}</h3>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={styles.emptyText}>No categories defined yet.</p>
                                )}
                            </div>
                        )}

                        {/* TAB 4: MY ORDERS */}
                        {activeTab === 'orders' && (
                            <div className={styles.tabSection}>
                                <h2>My Orders</h2>
                                {myOrders.length > 0 ? (
                                    <div className={styles.ordersListFlex}>
                                        {myOrders.map(o => (
                                            <div key={o.id} className={styles.orderCardDetail}>
                                                <div className={styles.oCardHeader}>
                                                    <div>
                                                        <strong>Order #{o.id}</strong>
                                                        <span className={styles.oDate}>{new Date(o.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    <span className={styles.statusBadge}>{o.status}</span>
                                                </div>

                                                <div className={styles.oItemsList}>
                                                    {(o.items || []).map((item, idx) => (
                                                        <div key={idx} className={styles.oItemRow}>
                                                            <img src={item.productImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&auto=format&fit=crop&q=80'} alt={item.productName} />
                                                            <div>
                                                                <p><strong>{item.productName}</strong> (Qty: {item.quantity})</p>
                                                                {item.selectedOptions && (
                                                                    <p className={styles.oOptSummary}>
                                                                        {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className={styles.oCardFooter}>
                                                    <span>Total: <strong>₹{o.totalAmount}</strong></span>
                                                    <button onClick={() => setSelectedOrderForInvoice(o)} className={styles.invoiceSmallBtn}>
                                                        <Printer size={14} /> Download Invoice
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={styles.emptyText}>No orders placed yet.</p>
                                )}
                            </div>
                        )}

                        {/* TAB 5: UPLOADED PHOTOS */}
                        {activeTab === 'photos' && (
                            <div className={styles.tabSection}>
                                <h2>Your Uploaded Original Photos</h2>
                                <p className={styles.subHead}>Photos you uploaded for personalized gift orders are preserved here securely.</p>
                                {uploadedPhotosList.length > 0 ? (
                                    <div className={styles.photoGalleryGrid}>
                                        {uploadedPhotosList.map((item, idx) => (
                                            <div key={idx} className={styles.photoItemCard}>
                                                <img src={item.photoUrl} alt="Uploaded" />
                                                <div className={styles.photoMeta}>
                                                    <p className={styles.pProdName}>{item.productName}</p>
                                                    <span className={styles.pQualityTag}>{item.quality}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={styles.emptyText}>No photos uploaded yet.</p>
                                )}
                            </div>
                        )}

                        {/* TAB 6: SAVED ADDRESSES */}
                        {activeTab === 'addresses' && (
                            <div className={styles.tabSection}>
                                <h2>Saved Shipping Addresses</h2>
                                {customerUser.addresses && customerUser.addresses.length > 0 ? (
                                    <div className={styles.addressList}>
                                        {customerUser.addresses.map((addr, idx) => (
                                            <div key={idx} className={styles.addrCard}>
                                                <p><strong>{customerUser.name}</strong></p>
                                                <p>{addr.street}</p>
                                                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                <p>Phone: {customerUser.phone}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={styles.emptyText}>No saved addresses found. Add an address during checkout to save it for future orders.</p>
                                )}
                            </div>
                        )}

                        {/* TAB 7: PROFILE */}
                        {activeTab === 'profile' && (
                            <div className={styles.tabSection}>
                                <h2>Profile Settings</h2>
                                <div className={styles.profileBox}>
                                    <div className={styles.profileRow}>
                                        <span>Full Name:</span>
                                        <strong>{customerUser.name || 'Not provided'}</strong>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <span>Email Address:</span>
                                        <strong>{customerUser.email}</strong>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <span>Mobile Phone:</span>
                                        <strong>{customerUser.phone || 'Not provided'}</strong>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <span>Account Type:</span>
                                        <strong style={{ color: 'var(--color-primary)' }}>CUSTOMER</strong>
                                    </div>
                                    <div className={styles.profileRow}>
                                        <span>Member Since:</span>
                                        <strong>{new Date(customerUser.createdAt).toLocaleDateString()}</strong>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {selectedOrderForInvoice && (
                <InvoiceModal order={selectedOrderForInvoice} onClose={() => setSelectedOrderForInvoice(null)} />
            )}
        </div>
    );
};

export default CustomerDashboard;
