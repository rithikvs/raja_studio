import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, Truck, Package, ShieldCheck, Printer, Camera } from 'lucide-react';
import { useData } from '../context/DataContext';
import styles from './TrackOrderPage.module.css';

const STEPS = [
    'Order Received',
    'Payment Confirmed',
    'Photo Verification',
    'Design / Editing',
    'Printing',
    'Framing / Production',
    'Quality Check',
    'Shipped',
    'Delivered'
];

const TrackOrderPage = () => {
    const { orders } = useData();
    const [searchId, setSearchId] = useState('');
    const [searchedOrder, setSearchedOrder] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleTrack = (e) => {
        e.preventDefault();
        setSearched(true);
        const match = orders.find(o => o.id.trim().toUpperCase() === searchId.trim().toUpperCase());
        setSearchedOrder(match || null);
    };

    const getStepIndex = (status) => {
        const idx = STEPS.indexOf(status);
        return idx > -1 ? idx : 0;
    };

    return (
        <div className={styles.trackPage}>
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1>Track Your Gift Order</h1>
                    <p>Enter your Order ID (e.g. ORD-123456) to view real-time production & shipping status.</p>
                </div>
            </div>

            <div className="container section-padding">
                <div className={styles.trackCard}>
                    <form onSubmit={handleTrack} className={styles.searchForm}>
                        <div className={styles.inputGroup}>
                            <Search className={styles.icon} size={20} />
                            <input
                                type="text"
                                placeholder="Enter Order ID (e.g. ORD-789456)"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.trackBtn}>Track Status</button>
                    </form>

                    {searched && (
                        <div className={styles.resultsArea}>
                            {searchedOrder ? (
                                <div className={styles.orderSummary}>
                                    <div className={styles.orderMetaRow}>
                                        <div>
                                            <h2>Order #{searchedOrder.id}</h2>
                                            <p className={styles.customerMeta}>Customer: <strong>{searchedOrder.customerName}</strong> ({searchedOrder.phone})</p>
                                            <p className={styles.dateMeta}>Placed on: {new Date(searchedOrder.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className={styles.currentStatusBadge}>
                                            Current Status: <strong>{searchedOrder.status}</strong>
                                        </div>
                                    </div>

                                    {/* Timeline Visualizer */}
                                    <h3 className={styles.timelineTitle}>Production & Delivery Timeline</h3>
                                    <div className={styles.timelineGrid}>
                                        {STEPS.map((stepName, index) => {
                                            const currentIdx = getStepIndex(searchedOrder.status);
                                            const isCompleted = index <= currentIdx;
                                            const isCurrent = index === currentIdx;

                                            return (
                                                <div key={stepName} className={`${styles.timelineStep} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.active : ''}`}>
                                                    <div className={styles.stepDot}>
                                                        {isCompleted ? <CheckCircle2 size={16} /> : <span>{index + 1}</span>}
                                                    </div>
                                                    <span className={styles.stepName}>{stepName}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Item Details */}
                                    <div className={styles.itemsBox}>
                                        <h3>Ordered Gifts:</h3>
                                        <div className={styles.itemsList}>
                                            {(searchedOrder.items || []).map((item, idx) => (
                                                <div key={idx} className={styles.itemCard}>
                                                    <img src={item.productImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=100&auto=format&fit=crop&q=80'} alt={item.productName} />
                                                    <div>
                                                        <strong>{item.productName}</strong>
                                                        <p>Qty: {item.quantity} | Total: ₹{item.price * item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.notFoundBox}>
                                    <h3>No Order Found for "{searchId}"</h3>
                                    <p>Please double-check your Order ID or check your confirmation message.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;
