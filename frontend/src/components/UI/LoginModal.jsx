import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Phone, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import styles from './LoginModal.module.css';

const LoginModal = () => {
    const { loginModalOpen, setLoginModalOpen, pendingAction, setPendingAction, loginCustomer, registerCustomer } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

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

        if (isRegister) {
            if (!formData.name || !formData.email || !formData.password) {
                setError('Please fill in all required fields.');
                return;
            }
            const res = await registerCustomer(formData);
            if (res.success) {
                setSuccessMsg('Account created successfully!');
                setTimeout(() => handleSuccessAuth(), 500);
            } else {
                setError(res.message);
            }
        } else {
            if (!formData.email || !formData.password) {
                setError('Please enter your email/phone and password.');
                return;
            }
            const res = await loginCustomer(formData.email, formData.password);
            if (res.success) {
                setSuccessMsg('Login successful!');
                setTimeout(() => handleSuccessAuth(), 500);
            } else {
                setError(res.message);
            }
        }
    };

    return (
        <AnimatePresence>
            <div className={styles.backdrop} onClick={() => setLoginModalOpen(false)}>
                <motion.div
                    className={styles.modalContent}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className={styles.closeBtn} onClick={() => setLoginModalOpen(false)}>
                        <X size={20} />
                    </button>

                    <div className={styles.header}>
                        <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                        <p className={styles.subtitle}>
                            {pendingAction
                                ? '🔒 Login to continue your personalized gift order.'
                                : 'Login to manage your orders, saved photos, and wishlist.'}
                        </p>
                    </div>

                    {error && <div className={styles.errorAlert}>{error}</div>}
                    {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {isRegister && (
                            <div className={styles.inputGroup}>
                                <User className={styles.inputIcon} size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <Mail className={styles.inputIcon} size={18} />
                            <input
                                type="text"
                                name="email"
                                placeholder={isRegister ? "Email Address" : "Email Address or Mobile Number"}
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {isRegister && (
                            <div className={styles.inputGroup}>
                                <Phone className={styles.inputIcon} size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Mobile Number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <Lock className={styles.inputIcon} size={18} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {isRegister && (
                            <div className={styles.inputGroup}>
                                <Lock className={styles.inputIcon} size={18} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}

                        <button type="submit" className={styles.submitBtn}>
                            {isRegister ? <><UserPlus size={18} /> Create Account</> : <><LogIn size={18} /> Login to Continue</>}
                        </button>
                    </form>

                    <div className={styles.footerToggle}>
                        {isRegister ? (
                            <p>Already have an account? <span onClick={() => { setIsRegister(false); setError(''); }}>Sign In</span></p>
                        ) : (
                            <p>Don't have an account? <span onClick={() => { setIsRegister(true); setError(''); }}>Create One</span></p>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LoginModal;
