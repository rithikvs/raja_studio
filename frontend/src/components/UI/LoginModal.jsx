import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Lock, Mail, User, Phone, LogIn, UserPlus, Eye, EyeOff, 
    ShieldCheck, Sparkles, Gift, ArrowRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import styles from './LoginModal.module.css';

const LoginModal = () => {
    const { loginModalOpen, setLoginModalOpen, pendingAction, setPendingAction, loginCustomer, registerCustomer, loginAdmin } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    if (!loginModalOpen) return null;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSuccessAuth = () => {
        if (pendingAction) {
            if (pendingAction.type === 'ADD_TO_CART' || pendingAction.type === 'BUY_NOW') {
                addToCart(pendingAction.cartItem);
                setPendingAction(null);
                setLoginModalOpen(false);
                if (pendingAction.type === 'BUY_NOW') {
                    navigate('/checkout');
                }
                return;
            }
        }
        setLoginModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                if (!formData.name || !formData.email || !formData.password) {
                    setError('Please fill in all required fields.');
                    setLoading(false);
                    return;
                }
                const res = await registerCustomer({
                    ...formData,
                    confirmPassword: formData.confirmPassword || formData.password
                });
                if (res.success) {
                    setSuccessMsg('Account created successfully! Welcome to Studio Gift Shop.');
                    setTimeout(() => handleSuccessAuth(), 600);
                } else {
                    setError(res.message || 'Registration failed. Please check your details.');
                }
            } else {
                if (!formData.email || !formData.password) {
                    setError('Please enter your email and password.');
                    setLoading(false);
                    return;
                }
                const cleanEmail = (formData.email || '').trim().toLowerCase();
                // Check if user is signing in with administrator credentials
                if (cleanEmail === 'admin@123' || cleanEmail === 'admin' || cleanEmail === 'admin@studiogiftshop.com') {
                    const adminRes = await loginAdmin(formData.email, formData.password);
                    if (adminRes.success) {
                        setSuccessMsg('Welcome, Administrator! Redirecting to Control Panel...');
                        setTimeout(() => {
                            setLoginModalOpen(false);
                            navigate('/admin/dashboard');
                        }, 600);
                        return;
                    }
                }

                const res = await loginCustomer(formData.email, formData.password);
                if (res.success) {
                    if (res.user?.role === 'admin') {
                        setSuccessMsg('Welcome, Administrator! Redirecting to Control Panel...');
                        setTimeout(() => {
                            setLoginModalOpen(false);
                            navigate('/admin/dashboard');
                        }, 600);
                    } else {
                        setSuccessMsg('Welcome back! Login successful.');
                        setTimeout(() => {
                            handleSuccessAuth();
                            if (!pendingAction || pendingAction.type !== 'BUY_NOW') {
                                navigate('/account');
                            }
                        }, 600);
                    }
                } else {
                    // Fallback attempt for admin if customer login failed
                    const adminRes = await loginAdmin(formData.email, formData.password);
                    if (adminRes.success) {
                        setSuccessMsg('Welcome, Administrator! Redirecting to Control Panel...');
                        setTimeout(() => {
                            setLoginModalOpen(false);
                            navigate('/admin/dashboard');
                        }, 600);
                        return;
                    }
                    setError(res.message || 'Invalid credentials. Please verify your email & password.');
                }
            }
        } catch (err) {
            setError('An error occurred during authentication. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className={styles.backdrop} onClick={() => setLoginModalOpen(false)}>
                <motion.div
                    className={styles.modalContent}
                    initial={{ opacity: 0, scale: 0.94, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 16 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button 
                        className={styles.closeBtn} 
                        onClick={() => setLoginModalOpen(false)}
                        aria-label="Close dialog"
                    >
                        <X size={18} />
                    </button>

                    {/* Brand Crest Header */}
                    <div className={styles.modalHeader}>
                        <div className={styles.brandBadge}>
                            <Gift size={26} className={styles.badgeIcon} />
                        </div>
                        <span className={styles.boutiqueTag}>STUDIO GIFT SHOP</span>
                        <h2 className={styles.title}>
                            {isRegister ? 'Join Our Boutique' : 'Welcome Back'}
                        </h2>
                        <p className={styles.subtitle}>
                            {isRegister 
                                ? 'Create an account to personalize gifts, save wishlist & track deliveries.'
                                : 'Sign in to access your saved gifts, orders, and exclusive privileges.'}
                        </p>
                    </div>

                    {/* Mode Tabs */}
                    <div className={styles.tabSwitcher}>
                        <button
                            type="button"
                            className={`${styles.tabBtn} ${!isRegister ? styles.activeTab : ''}`}
                            onClick={() => { setIsRegister(false); setError(''); }}
                        >
                            <LogIn size={16} />
                            <span>Sign In</span>
                        </button>
                        <button
                            type="button"
                            className={`${styles.tabBtn} ${isRegister ? styles.activeTab : ''}`}
                            onClick={() => { setIsRegister(true); setError(''); }}
                        >
                            <UserPlus size={16} />
                            <span>Create Account</span>
                        </button>
                    </div>

                    {/* Alert Notifications */}
                    {error && (
                        <div className={styles.errorAlert}>
                            <span>{error}</span>
                        </div>
                    )}
                    {successMsg && (
                        <div className={styles.successAlert}>
                            <Sparkles size={16} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {/* Authentication Form */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {isRegister && (
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>
                                    Full Name <span className={styles.req}>*</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <User size={18} className={styles.inputIcon} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="e.g. Priya Sharma"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        autoComplete="name"
                                    />
                                </div>
                            </div>
                        )}

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>
                                Email or Username <span className={styles.req}>*</span>
                            </label>
                            <div className={styles.inputWrapper}>
                                <Mail size={18} className={styles.inputIcon} />
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="e.g. name@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {isRegister && (
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Phone Number</label>
                                <div className={styles.inputWrapper}>
                                    <Phone size={18} className={styles.inputIcon} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="e.g. +91 98765 43210"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>
                        )}

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>
                                Password <span className={styles.req}>*</span>
                            </label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your secret password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    autoComplete={isRegister ? "new-password" : "current-password"}
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {!isRegister && (
                            <div className={styles.rememberRow}>
                                <label className={styles.rememberLabel}>
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className={styles.customCheckbox}
                                    />
                                    <span>Remember me on this device</span>
                                </label>

                                <a 
                                    href="#forgot" 
                                    className={styles.forgotLink}
                                    onClick={(e) => { 
                                        e.preventDefault(); 
                                        alert('If an account exists for this email, password reset instructions have been sent.'); 
                                    }}
                                >
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className={styles.primaryAuthBtn}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className={styles.btnContent}>Authenticating...</span>
                            ) : (
                                <span className={styles.btnContent}>
                                    {isRegister ? 'Complete Registration' : 'Sign In to Boutique'}
                                    <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>

                    {/* Footer Reassurance & Mode Switcher */}
                    <div className={styles.modalFooter}>
                        <div className={styles.switchModePrompt}>
                            {isRegister ? (
                                <p>
                                    Already have an account?{' '}
                                    <button 
                                        type="button"
                                        className={styles.switchLink} 
                                        onClick={() => { setIsRegister(false); setError(''); }}
                                    >
                                        Sign In
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Don't have an account yet?{' '}
                                    <button 
                                        type="button"
                                        className={styles.switchLink} 
                                        onClick={() => { setIsRegister(true); setError(''); }}
                                    >
                                        Register Now
                                    </button>
                                </p>
                            )}
                        </div>

                        <div className={styles.securitySeal}>
                            <ShieldCheck size={14} className={styles.securityIcon} />
                            <span>256-Bit SSL Encrypted & Confidential</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LoginModal;