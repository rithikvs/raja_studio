import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import styles from './InvoiceModal.module.css';

const InvoiceModal = ({ order, onClose }) => {
    if (!order) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.actionsBar}>
                    <button onClick={handlePrint} className={styles.printBtn}>
                        <Printer size={18} /> Print / Save PDF
                    </button>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.invoicePaper} id="printable-invoice">
                    {/* Header */}
                    <div className={styles.invoiceHeader}>
                        <div>
                            <h1 className={styles.brandTitle}>RAJA STUDIO</h1>
                            <p className={styles.brandSubtitle}>RAJA GIFTS • Personalized Photo Gifts & Memories</p>
                            <p className={styles.contactDetails}>Phone/WhatsApp: +91 98765 43210 | Email: contact@rajastudio.com</p>
                        </div>
                        <div className={styles.metaRight}>
                            <h2 className={styles.invoiceTitle}>TAX INVOICE</h2>
                            <p><strong>Invoice No:</strong> INV-{order.id}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Status:</strong> <span className={styles.statusBadge}>{order.status}</span></p>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* Customer & Shipping Info */}
                    <div className={styles.addressGrid}>
                        <div>
                            <h3>Billed / Shipped To:</h3>
                            <p><strong>{order.customerName}</strong></p>
                            <p>{order.phone}</p>
                            <p>{order.email}</p>
                            <p>{order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                        </div>
                        {order.agentId && (
                            <div>
                                <h3>Agent Info:</h3>
                                <p><strong>Agent Code:</strong> {order.agentId}</p>
                                <p><strong>Agent Note:</strong> {order.agentNote || 'N/A'}</p>
                            </div>
                        )}
                    </div>

                    {/* Order Items Table */}
                    <table className={styles.itemsTable}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item & Customization Details</th>
                                <th className="text-center">Qty</th>
                                <th className="text-right">Unit Price</th>
                                <th className="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.items || []).map((item, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <strong>{item.productName}</strong>
                                        {item.selectedOptions && (
                                            <div className={styles.optionsList}>
                                                {Object.entries(item.selectedOptions).map(([k, v]) => (
                                                    <span key={k}>{k}: <strong>{v}</strong> | </span>
                                                ))}
                                            </div>
                                        )}
                                        {item.customText && <p className={styles.customText}>Text: "{item.customText}"</p>}
                                        {item.giftPacking && <span className={styles.addonTag}>🎁 Gift Packing</span>}
                                        {item.glitter && <span className={styles.addonTag}>✨ Glitter Finish</span>}
                                    </td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-right">₹{item.price}</td>
                                    <td className="text-right">₹{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Total Summary */}
                    <div className={styles.summaryContainer}>
                        <div className={styles.paymentInfo}>
                            <p><strong>Payment Method:</strong> {order.paymentMethod || 'UPI / Online'}</p>
                            <p><strong>Payment Status:</strong> Paid</p>
                        </div>
                        <div className={styles.totalsBox}>
                            <div className={styles.totalRow}>
                                <span>Subtotal:</span>
                                <span>₹{order.subtotal || order.totalAmount}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className={styles.totalRow}>
                                    <span>Discount:</span>
                                    <span>-₹{order.discountAmount}</span>
                                </div>
                            )}
                            <div className={styles.totalRow}>
                                <span>Estimated Shipping:</span>
                                <span>₹{order.shipping || 0}</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>GST (Included):</span>
                                <span>₹{order.gst || 0}</span>
                            </div>
                            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                                <span>Grand Total:</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.invoiceFooter}>
                        <p>Thank you for shopping with <strong>RAJA STUDIO / RAJA GIFTS</strong>!</p>
                        <p>This is a computer-generated invoice. For queries, contact support on WhatsApp +91 98765 43210.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
