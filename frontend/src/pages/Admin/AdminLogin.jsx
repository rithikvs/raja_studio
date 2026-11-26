import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginAdmin, adminUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If admin is already logged in, redirect to dashboard
        if (adminUser) {
            navigate('/admin/dashboard');
        }
    }, [adminUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username || !password) {
            setError('Please enter both username and password.');
            setLoading(false);
            return;
        }

        const result = await loginAdmin(username, password);
        
        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.message);
        }
        
        setLoading(false);
    };

    const handleQuickFill = () => {
        setUsername('admin@123');
        setPassword('1234');
        setError('');
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <ShieldCheck size={48} className={styles.adminIcon} />
                    <span className={styles.boutiqueSub}>LUXURY BOUTIQUE GIFTING</span>
                    <h1>STUDIO GIFT SHOP</h1>
                    <h2>ADMINISTRATOR LOGIN</h2>
                    <p>Exclusive Control Panel Access for Store Owners</p>
                </div>

                {error && (
                    <div className={styles.errorAlert}>
                        {error}
                    </div>
                )}

                <div className={styles.adminInfoBanner}>
                    <div className={styles.adminInfoIcon}>👑</div>
                    <div className={styles.adminInfoText}>
                        <strong>Default Admin Credentials:</strong>
                        <span>Username: <code>admin@123</code> &nbsp;|&nbsp; Password: <code>1234</code></span>
                    </div>
                    <button 
                        type="button" 
                        onClick={handleQuickFill} 
                        className={styles.quickFillBtn}
                        title="Click to automatically fill credentials"
                    >
                        Auto-Fill
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Admin Username or Email</label>
                        <div className={styles.inputWrapper}>
                            <User size={20} className={styles.inputIcon} />
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin@123"
                                required
                                disabled={loading}
                                autoCapitalize="none"
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Admin Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={20} className={styles.inputIcon} />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                required
                                disabled={loading}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? 'Authenticating Admin...' : 'Login to Admin Dashboard'}
                    </button>
                </form>

                <div className={styles.backToSite}>
                    <button 
                        onClick={() => navigate('/')} 
                        className={styles.backButton}
                    >
                        ← Back to Studio Gift Shop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
