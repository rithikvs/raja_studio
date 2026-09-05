import React, { useState } from 'react';
import { Users, Search, Trash2, Mail, Phone, ShoppingBag, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAdmin } from '../../context/AdminContext';
import styles from './AdminCustomers.module.css';

const AdminCustomers = () => {
    const { customers, deleteCustomer, orders } = useData();
    const { fetchCustomers, refreshingCustomers } = useAdmin();
    const [search, setSearch] = useState('');

    const filtered = customers.filter(c =>
        (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.phone || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.customersPage}>
            <div className={styles.header}>
                <h1>Customer Directory & Accounts</h1>
                <p>View registered customer details, address records, and purchase history.</p>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search customers by name, email, or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <button 
                    onClick={() => fetchCustomers(true)} 
                    className={styles.refreshBtn}
                    disabled={refreshingCustomers}
                    title="Refresh Customers"
                    style={{ marginLeft: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                    <RefreshCw size={16} className={refreshingCustomers ? styles.spinning : ''} />
                    {refreshingCustomers ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            <div className={styles.tableCard}>
                {filtered.length > 0 ? (
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Contact Information</th>
                                <th>Saved Address</th>
                                <th>Total Orders</th>
                                <th>Registered Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => {
                                const custOrders = orders.filter(o => o.customerId === c.id || o.email === c.email);
                                return (
                                    <tr key={c.id}>
                                        <td><strong>{c.name || 'N/A'}</strong></td>
                                        <td>
                                            <p><Mail size={12} /> {c.email}</p>
                                            <p className={styles.subText}><Phone size={12} /> {c.phone || 'N/A'}</p>
                                        </td>
                                        <td>
                                            {c.addresses && c.addresses[0] ? (
                                                <p className={styles.addrText}>{c.addresses[0].street}, {c.addresses[0].city} ({c.addresses[0].pincode})</p>
                                            ) : (
                                                <span className={styles.subText}>No address recorded</span>
                                            )}
                                        </td>
                                        <td><strong>{custOrders.length} Order(s)</strong></td>
                                        <td>{new Date(c.createdAt || Date.now()).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => { if (confirm('Delete customer?')) deleteCustomer(c.id); }} className={styles.deleteBtn}>
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <Users size={48} color="#cbd5e1" />
                        <p>No customers found matching search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomers;
