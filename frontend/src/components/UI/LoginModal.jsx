import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Phone, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import styles from './LoginModal.module.css';

const LoginModal = () => {
    const { loginModalOpen, setLoginModalOpen, pendingAction, setPendingAction, loginCustomer, registerCustomer } = useAuth();
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
            const res = await registerCustomer({
                ...formData,
                confirmPassword: formData.confirmPassword || formData.password
            });
            if (res.success) {
                setSuccessMsg('Account created successfully!');
                setTimeout(() => handleSuccessAuth(), 500);
            } else {
                setError(res.message);
            }
        } else {
            if (!formData.email || !formData.password) {
                setError('Please enter your username/email and password.');
                return;
            }
            const res = await loginCustomer(formData.email, formData.password);
            if (res.success) {
                setSuccessMsg('Login successful!');
                setTimeout(() => {
                    handleSuccessAuth();
                    if (!pendingAction || pendingAction.type !== 'BUY_NOW') {
                        navigate('/account');
                    }
                }, 500);
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

                    <h2 className={styles.title}>{isRegister ? 'Register' : 'Login'}</h2>

                    <div className={styles.dashedBox}>
                        {error && <div className={styles.errorAlert}>{error}</div>}
                        {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {isRegister && (
                                <div className={styles.fieldGroup}>
                                    <label>Full Name <span className={styles.req}>*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            )}

                            <div className={styles.fieldGroup}>
                                <label>Username or email address <span className={styles.req}>*</span></label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            {isRegister && (
                                <div className={styles.fieldGroup}>
                                    <label>Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )}

                            <div className={styles.fieldGroup}>
                                <label>Password <span className={styles.req}>*</span></label>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className={styles.eyeToggle}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {!isRegister && (
                                <div className={styles.checkboxRow}>
                                    <label className={styles.rememberCheck}>
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <span>Remember me</span>
                                    </label>
                                </div>
                            )}

                            <button type="submit" className={styles.orangeSubmitBtn}>
                                {isRegister ? 'Register' : 'Log in'}
                            </button>

                            {!isRegister && (
                                <div className={styles.lostPasswordLink}>
                                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email.'); }}>
                                        Lost your password?
                                    </a>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className={styles.footerToggle}>
                        {isRegister ? (
                            <p>Already have an account? <span onClick={() => { setIsRegister(false); setError(''); }}>Log in</span></p>
                        ) : (
                            <p>Don't have an account? <span onClick={() => { setIsRegister(true); setError(''); }}>Register</span></p>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LoginModal;
