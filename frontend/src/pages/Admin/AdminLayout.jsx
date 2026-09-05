import React from 'react';
import { NavLink, Outlet, Navigate, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Grid, ShoppingBag, Users, Tag, FileText, Home, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    const { adminUser, logoutAdmin } = useAuth();
    const navigate = useNavigate();

    // ROUTE SECURITY: Redirect to /admin/login if not authenticated as Admin
    if (!adminUser) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleAdminLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    return (
        <div className={styles.adminContainer}>
            {/* Admin Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarBrand}>
                    <ShieldCheck size={28} className={styles.brandIcon} />
                    <div>
                        <h2>RAJA STUDIO</h2>
                        <span>ADMIN CONTROL PANEL</span>
                    </div>
                </div>

                <nav className={styles.navMenu}>
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <LayoutDashboard size={18} /> Dashboard
                    </NavLink>

                    <NavLink to="/admin/products" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Package size={18} /> Products
                    </NavLink>

                    <NavLink to="/admin/categories" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Grid size={18} /> Categories
                    </NavLink>

                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <ShoppingBag size={18} /> Orders & Photos
                    </NavLink>

                    <NavLink to="/admin/customers" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Users size={18} /> Customers
                    </NavLink>

                    <NavLink to="/admin/coupons" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Tag size={18} /> Coupons
                    </NavLink>

                    <NavLink to="/admin/cms" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <FileText size={18} /> Website Content & CMS
                    </NavLink>
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link to="/" className={styles.footerLink} target="_blank">
                        <Home size={16} /> Open Customer Site
                    </Link>
                    <button onClick={handleAdminLogout} className={styles.logoutBtn}>
                        <LogOut size={16} /> Admin Logout
                    </button>
                </div>
            </aside>

            {/* Main Admin Area */}
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
