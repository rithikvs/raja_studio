import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate, Link } from 'react-router-dom';
import { 
    LayoutDashboard, Package, Grid, ShoppingBag, Users, Tag, 
    FileText, Home, LogOut, ShieldCheck, Film, Menu, X, ArrowLeft, Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    const { adminUser, logoutAdmin, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Show clean loader while determining authentication state
    if (loading) {
        return (
            <div className={styles.loadingScreen}>
                <ShieldCheck size={48} className={styles.spinningIcon} />
                <p>Verifying Administrator Privileges...</p>
            </div>
        );
    }

    // ROUTE SECURITY: Redirect to /admin/login if not authenticated as Admin
    if (!adminUser) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleAdminLogout = () => {
        logoutAdmin();
        navigate('/admin/login');
    };

    const closeSidebarOnNavigate = () => {
        setSidebarOpen(false);
    };

    return (
        <div className={styles.adminContainer}>
            {/* Mobile Top Header */}
            <div className={styles.mobileTopBar}>
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)} 
                    className={styles.mobileMenuToggle}
                    aria-label="Toggle admin menu"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className={styles.mobileBarBrand}>
                    <ShieldCheck size={20} color="#D4AF37" />
                    <span>STUDIO GIFT SHOP ADMIN</span>
                </div>
                <Link to="/" className={styles.mobileHomeLink} title="Customer Site">
                    <Home size={20} />
                </Link>
            </div>

            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div className={styles.mobileBackdrop} onClick={() => setSidebarOpen(false)} />
            )}

            {/* Admin Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarBrand}>
                    <ShieldCheck size={28} className={styles.brandIcon} />
                    <div>
                        <h2>STUDIO GIFT SHOP</h2>
                        <span>ADMIN CONTROL PANEL</span>
                    </div>
                </div>

                <nav className={styles.navMenu}>
                    <NavLink to="/admin" end onClick={closeSidebarOnNavigate} className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <LayoutDashboard size={18} /> Dashboard
                    </NavLink>

                    <NavLink to="/admin/products" onClick={closeSidebarOnNavigate} className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Package size={18} /> Products
                    </NavLink>

                    <NavLink to="/admin/categories" onClick={closeSidebarOnNavigate} className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Grid size={18} /> Categories
                    </NavLink>

                    <NavLink to="/admin/orders" onClick={closeSidebarOnNavigate} className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <ShoppingBag size={18} /> Orders & Photos
                    </NavLink>

                    <NavLink to="/admin/customers" onClick={closeSidebarOnNavigate} className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Users size={18} /> Customers
                    </NavLink>

                    <NavLink to="/admin/coupons" onClick={closeSidebarOnNavigate} className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Tag size={18} /> Coupons
                    </NavLink>

                    <NavLink to="/admin/cms" onClick={closeSidebarOnNavigate} className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <FileText size={18} /> Website Content & CMS
                    </NavLink>

                    <NavLink to="/admin/services" onClick={closeSidebarOnNavigate} className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Cpu size={18} /> Our Services & Machinery
                    </NavLink>

                    <NavLink to="/admin/media" onClick={closeSidebarOnNavigate} className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Film size={18} /> Video & Design Media
                    </NavLink>
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link to="/" className={styles.footerLink}>
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
