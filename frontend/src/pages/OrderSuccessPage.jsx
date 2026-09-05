import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Printer, ArrowRight, Truck } from 'lucide-react';
import { useData } from '../context/DataContext';
import InvoiceModal from '../components/UI/InvoiceModal';
import styles from './OrderSuccessPage.module.css';

const OrderSuccessPage = () => {
    const { orderId } = useParams();
    const { orders } = useData();
    const [showInvoice, setShowInvoice] = useState(false);

    const order = orders.find(o => o.id === orderId);

    return (
        <div className={`container section-padding ${styles.successPage}`}>
            <div className={styles.card}>
                <CheckCircle size={64} className={styles.checkIcon} />
                <h1>Order Placed Successfully!</h1>
                <p className={styles.subtitle}>
                    Thank you for choosing <strong>RAJA STUDIO / RAJA GIFTS</strong>. Your order ID is <strong>{orderId}</strong>.
                </p>

                <div className={styles.infoBox}>
                    <p>📸 Our production team is reviewing your uploaded photo resolution.</p>
                    <p>🚚 You will receive live status updates in your customer dashboard.</p>
                </div>

                <div className={styles.btnRow}>
                    <button onClick={() => setShowInvoice(true)} className={styles.invoiceBtn}>
                        <Printer size={18} /> View & Print Invoice
                    </button>
                    <Link to="/track-order" className={styles.trackBtn}>
                        <Truck size={18} /> Track Order Status
                    </Link>
                    <Link to="/shop" className={styles.shopBtn}>
                        Continue Shopping <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {showInvoice && order && (
                <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />
            )}
        </div>
    );
};

export default OrderSuccessPage;
