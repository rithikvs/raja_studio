import React, { useState, useEffect } from 'react';
import { Download, Eye, Printer, Search, CheckCircle, Clock, Image as ImageIcon, RefreshCw, Trash2, Edit, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import InvoiceModal from '../../components/UI/InvoiceModal';
import styles from './AdminOrders.module.css';

const AdminOrders = () => {
    const { 
        orders, 
        loading, 
        updateOrderStatus, 
        deleteOrder, 
        refreshAllData,
        startAutoRefresh,
        stopAutoRefresh
    } = useAdmin();
    
    const [search, setSearch] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

    // Start auto-refresh when component mounts (handled by AdminContext now)
    useEffect(() => {
        // Just mark that Orders page is active
        console.log('📦 Orders page mounted - auto-refresh active');
        
        return () => {
            console.log('📦 Orders page unmounted');
        };
    }, []);

    // Use orders from AdminContext
    const allOrders = orders.map(order => ({ ...order, source: 'MongoDB Atlas' }));

    const filteredOrders = allOrders.filter(o => {
        const matchesSearch = (o.id || '').toLowerCase().includes(search.toLowerCase()) ||
            (o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
            (o.phone || '').toLowerCase().includes(search.toLowerCase());
        const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const handleStatusUpdate = async (orderId, newStatus, orderSource) => {
        const success = await updateOrderStatus(orderId, newStatus);
        if (!success) {
            alert('Failed to update order status. Please try again.');
        }
    };

    const handleDeleteOrder = async (orderId, orderSource) => {
        if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            return;
        }

        const success = await deleteOrder(orderId);
        if (success) {
            alert('Order deleted successfully');
        } else {
            alert('Failed to delete order. Please try again.');
        }
    };

    const handleDownloadPhoto = async (image, filename = 'customer_photo.jpg') => {
        try {
            if (typeof image === 'string') {
                // Local storage image (base64)
                const link = document.createElement('a');
                link.href = image;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (image?.id) {
                // MongoDB image - get URL and download
                const token = localStorage.getItem('raja_access_token');
                const response = await fetch(`/api/admin/images/${image.id}/url`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Check if it's a base64 data URL or a regular URL
                    if (data.format === 'base64' || data.url.startsWith('data:')) {
                        // Base64 data URL - download directly
                        const link = document.createElement('a');
                        link.href = data.url;
                        link.download = filename || image.original_file_name || 'download.jpg';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        // Regular URL - fetch and download
                        const imageResponse = await fetch(data.url);
                        const blob = await imageResponse.blob();
                        const blobUrl = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = filename || image.original_file_name || 'download.jpg';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(blobUrl);
                    }
                } else {
                    throw new Error('Failed to get image URL');
                }
            }
        } catch (error) {
            console.error('Error downloading photo:', error);
            alert('Failed to download photo. Please try again.');
        }
    };

    return (
        <div className={styles.ordersPage}>
            <div className={styles.header}>
                <h1>Order & High-Res Photo Production Management</h1>
                <p>Track incoming gift orders, update statuses, and download original customer photos for framing & printing.</p>
            </div>

            {/* Filter Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Customer Name, or Phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                    <option value="All">All Statuses ({allOrders.length})</option>
                    <option value="Order Received">Order Received</option>
                    <option value="Payment Confirmed">Payment Confirmed</option>
                    <option value="Photo Verification">Photo Verification</option>
                    <option value="Design / Editing">Design / Editing</option>
                    <option value="Printing">Printing</option>
                    <option value="Framing / Production">Framing / Production</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                </select>

                <button 
                    onClick={() => refreshAllData(true)} 
                    className={styles.refreshBtn}
                    disabled={loading}
                    title="Refresh MongoDB Orders"
                >
                    <RefreshCw size={16} className={loading ? styles.spinning : ''} />
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
                
                <div className={styles.sourceStats}>
                    MongoDB Atlas: {orders.length}
                </div>
            </div>

            {/* Orders Table */}
            <div className={styles.tableCard}>
                {filteredOrders.length > 0 ? (
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Order ID & Date</th>
                                <th>Customer & Contact</th>
                                <th>Items & Customization</th>
                                <th>Customer Original Photo</th>
                                <th>Total</th>
                                <th>Order Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td>
                                        <strong>{order.id}</strong>
                                        <p className={styles.dateText}>{new Date(order.createdAt).toLocaleString()}</p>
                                    </td>
                                    <td>
                                        <strong>{order.customerName}</strong>
                                        <p className={styles.subText}>{order.phone}</p>
                                        <p className={styles.subText}>{order.address?.city}, {order.address?.pincode}</p>
                                    </td>
                                    <td>
                                        {(order.items || []).map((item, idx) => (
                                            <div key={idx} className={styles.itemSummaryBox}>
                                                <strong>{item.productName} (x{item.quantity})</strong>
                                                {item.selectedOptions && (
                                                    <p className={styles.optText}>
                                                        {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                                    </p>
                                                )}
                                                {item.customText && <p className={styles.customText}>Msg: "{item.customText}"</p>}
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        {/* Original Photo Download Box */}
                                        {(order.images || []).length > 0 ? (
                                            (order.images || []).map((image, idx) => (
                                                <div key={idx} className={styles.photoDownloadBox}>
                                                    <div className={styles.photoThumb}><ImageIcon size={20} /></div>
                                                    <div>
                                                        <span className={styles.qualityTag}>{image.original_file_name || 'High Res'}</span>
                                                        <button
                                                            onClick={() => handleDownloadPhoto(image, image.original_file_name)}
                                                            className={styles.downloadBtn}
                                                            title="Download Customer Original Photo"
                                                        >
                                                            <Download size={12} /> Download Photo
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <span className={styles.noPhotoTag}>No photo uploaded</span>
                                        )}
                                    </td>
                                    <td className={styles.totalCol}>₹{order.totalAmount}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value, order.source)}
                                            className={styles.statusSelect}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Photo Review">Photo Review</option>
                                            <option value="Printing">Printing</option>
                                            <option value="Ready">Ready</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className={styles.actionRow}>
                                            <button onClick={() => setSelectedOrder(order)} className={styles.viewBtn} title="View Details">
                                                <Eye size={14} /> Details
                                            </button>
                                            <button onClick={() => setSelectedOrderForInvoice(order)} className={styles.invoiceBtn} title="Tax Invoice">
                                                <Printer size={14} /> Invoice
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteOrder(order.id, order.source)} 
                                                className={styles.deleteBtn} 
                                                title="Delete Order"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No orders found matching criteria.</p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className={styles.backdrop} onClick={() => setSelectedOrder(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Order Details: #{selectedOrder.id}</h2>
                            <button onClick={() => setSelectedOrder(null)} className={styles.closeIcon}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.orderInfoBanner}>
                            <div className={styles.infoBannerItem}>
                                <span className={styles.label}>Source:</span>
                                <span className={styles.value}>{selectedOrder.source}</span>
                            </div>
                            <div className={styles.infoBannerItem}>
                                <span className={styles.label}>Order Date:</span>
                                <span className={styles.value}>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.infoBannerItem}>
                                <span className={styles.label}>Payment Method:</span>
                                <span className={styles.value}>{selectedOrder.paymentMethod}</span>
                            </div>
                        </div>

                        <div className={styles.modalGrid}>
                            <div className={styles.modalSection}>
                                <h3>Customer Information</h3>
                                <div className={styles.detailsBox}>
                                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                                    <p><strong>Email:</strong> {selectedOrder.email}</p>
                                    {selectedOrder.customerId && <p><strong>Customer ID:</strong> {selectedOrder.customerId}</p>}
                                </div>
                            </div>

                            <div className={styles.modalSection}>
                                <h3>Shipping Address</h3>
                                <div className={styles.detailsBox}>
                                    <p>{selectedOrder.address?.street}</p>
                                    {selectedOrder.address?.landmark && <p>Landmark: {selectedOrder.address.landmark}</p>}
                                    <p>{selectedOrder.address?.city}, {selectedOrder.address?.state}</p>
                                    <p>PIN: {selectedOrder.address?.pincode}</p>
                                    <p>{selectedOrder.address?.country || 'India'}</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalSection}>
                            <h3>Order Items</h3>
                            <div className={styles.itemsDetailList}>
                                {(selectedOrder.items || []).map((item, idx) => (
                                    <div key={idx} className={styles.itemDetailCard}>
                                        <div className={styles.itemDetailHeader}>
                                            <strong>{item.productName}</strong>
                                            <span>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</span>
                                        </div>
                                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                            <div className={styles.itemOptions}>
                                                <strong>Customization:</strong>
                                                <ul>
                                                    {Object.entries(item.selectedOptions).map(([key, value]) => (
                                                        <li key={key}>{key}: {value}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {item.customText && (
                                            <div className={styles.itemCustomText}>
                                                <strong>Custom Message:</strong> "{item.customText}"
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.modalSection}>
                            <h3>Order Summary</h3>
                            <div className={styles.orderSummary}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal:</span>
                                    <span>₹{selectedOrder.subtotal || selectedOrder.totalAmount}</span>
                                </div>
                                {selectedOrder.discountAmount > 0 && (
                                    <div className={styles.summaryRow}>
                                        <span>Discount:</span>
                                        <span className={styles.discount}>-₹{selectedOrder.discountAmount}</span>
                                    </div>
                                )}
                                {selectedOrder.shipping > 0 && (
                                    <div className={styles.summaryRow}>
                                        <span>Shipping:</span>
                                        <span>₹{selectedOrder.shipping}</span>
                                    </div>
                                )}
                                {selectedOrder.gst > 0 && (
                                    <div className={styles.summaryRow}>
                                        <span>GST (18%):</span>
                                        <span>₹{selectedOrder.gst}</span>
                                    </div>
                                )}
                                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                    <strong>Total Amount:</strong>
                                    <strong>₹{selectedOrder.totalAmount}</strong>
                                </div>
                            </div>
                        </div>

                        {selectedOrder.orderNotes && (
                            <div className={styles.modalSection}>
                                <h3>Special Instructions</h3>
                                <div className={styles.notesBox}>
                                    {selectedOrder.orderNotes}
                                </div>
                            </div>
                        )}

                        <div className={styles.modalSection}>
                            <h3>Status & Payment</h3>
                            <div className={styles.statusPaymentGrid}>
                                <div>
                                    <strong>Current Status:</strong>
                                    <span className={styles.statusBadge}>{selectedOrder.status}</span>
                                </div>
                                <div>
                                    <strong>Payment Method:</strong>
                                    <span>{selectedOrder.paymentMethod}</span>
                                </div>
                            </div>
                        </div>

                        {(selectedOrder.images || []).length > 0 && (
                            <div className={styles.modalSection}>
                                <h3>Customer Uploaded Photos ({selectedOrder.images.length})</h3>
                                <div className={styles.photoGalleryModal}>
                                    {selectedOrder.images.map((image, idx) => (
                                        <div key={idx} className={styles.photoCardModal}>
                                            <div className={styles.photoThumb}><ImageIcon size={24} /></div>
                                            <div className={styles.pCardModalBody}>
                                                <p><strong>File:</strong> {image.original_file_name || `Image ${idx + 1}`}</p>
                                                {image.file_size && <p><strong>Size:</strong> {Math.round(image.file_size / 1024)} KB</p>}
                                                {image.mime_type && <p><strong>Type:</strong> {image.mime_type}</p>}
                                                <button
                                                    onClick={() => handleDownloadPhoto(image, image.original_file_name)}
                                                    className={styles.modalDownloadBtn}
                                                >
                                                    <Download size={14} /> Download Photo
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(selectedOrder.statusHistory || []).length > 0 && (
                            <div className={styles.modalSection}>
                                <h3>Status History</h3>
                                <div className={styles.historyList}>
                                    {selectedOrder.statusHistory.map((history, idx) => (
                                        <div key={idx} className={styles.historyItem}>
                                            <span className={styles.historyStatus}>{history.status}</span>
                                            <span className={styles.historyDate}>
                                                {new Date(history.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={styles.modalFooter}>
                            <button 
                                onClick={() => {
                                    setSelectedOrder(null);
                                    setSelectedOrderForInvoice(selectedOrder);
                                }} 
                                className={styles.printInvoiceBtn}
                            >
                                <Printer size={16} /> Print Invoice
                            </button>
                            <button 
                                onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.source)} 
                                className={styles.deleteOrderBtn}
                            >
                                <Trash2 size={16} /> Delete Order
                            </button>
                            <button onClick={() => setSelectedOrder(null)} className={styles.closeModalBtn}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedOrderForInvoice && (
                <InvoiceModal order={selectedOrderForInvoice} onClose={() => setSelectedOrderForInvoice(null)} />
            )}
        </div>
    );
};

export default AdminOrders;
