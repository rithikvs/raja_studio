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

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <ShieldCheck size={48} className={styles.adminIcon} />
                    <h1>RAJA STUDIO</h1>
                    <h2>ADMIN LOGIN</h2>
                    <p>Administrative Control Panel Access</p>
                </div>

                {error && (
                    <div className={styles.errorAlert}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Admin Username</label>
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
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login to Admin Dashboard'}
                    </button>
                </form>

                <div className={styles.credentialsHint}><p>Sign in with a Supabase account granted administrator access.</p></div>

                <div className={styles.backToSite}>
                    <button 
                        onClick={() => navigate('/')} 
                        className={styles.backButton}
                    >
                        ← Back to Main Website
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
