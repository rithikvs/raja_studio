import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [customerUser, setCustomerUser] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);

  const loadUser = async () => {
    const token = localStorage.getItem('raja_access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { user } = await api('/me');
      console.log('✅ User loaded from token:', user.name, user.role);
      
      if (user.role === 'admin') {
        setAdminUser(user);
        setCustomerUser(null);
      } else {
        setCustomerUser(user);
        setAdminUser(null);
        // Load user addresses
        loadAddresses();
      }
    } catch (error) {
      // NEVER auto-logout - keep user logged in at all times
      // User must manually click logout button to sign out
      console.log('⚠️ Could not verify session, keeping login (user must manually logout):', error.message);
      // Keep token and user state - only manual logout can clear it
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const { addresses: userAddresses } = await api('/addresses');
      setAddresses(userAddresses || []);
      console.log(`✅ Loaded ${userAddresses?.length || 0} addresses for user`);
    } catch (error) {
      console.log('Failed to load addresses:', error.message);
      setAddresses([]);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const authenticate = async (endpoint, body) => {
    try {
      const { token, user } = await api(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      localStorage.setItem('raja_access_token', token);
      console.log('✅ Login successful:', user.name, user.role);

      if (user.role === 'admin') {
        setAdminUser(user);
        setCustomerUser(null);
      } else {
        setCustomerUser(user);
        setAdminUser(null);
        // Load addresses after login
        setTimeout(() => loadAddresses(), 100);
      }

      window.dispatchEvent(new Event('raja_auth_change'));
      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const loginCustomer = (email, password) => authenticate('/auth/login', { email, password });

  const registerCustomer = ({ name, email, phone, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      return Promise.resolve({ success: false, message: 'Password and Confirm Password do not match.' });
    }
    return authenticate('/auth/register', { name, email, phone, password });
  };

  const loginAdmin = async (email, password) => {
    const result = await loginCustomer(email, password);
    if (!result.success) return result;

    if (result.user.role !== 'admin') {
      localStorage.removeItem('raja_access_token');
      setCustomerUser(null);
      setAdminUser(null);
      return { success: false, message: 'This account is not authorized for the admin panel.' };
    }

    return result;
  };

  const signOut = () => {
    console.log('🔒 User logged out');
    localStorage.removeItem('raja_access_token');
    setCustomerUser(null);
    setAdminUser(null);
    setAddresses([]);
    setPendingAction(null);
    window.dispatchEvent(new Event('raja_auth_change'));
  };

  const requireAuthForAction = (payload) => {
    if (customerUser) return true;
    setPendingAction(payload);
    setLoginModalOpen(true);
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        customerUser,
        loading,
        addresses,
        loadAddresses,
        loginModalOpen,
        setLoginModalOpen,
        pendingAction,
        setPendingAction,
        loginAdmin,
        logoutAdmin: signOut,
        isAdmin: () => Boolean(adminUser),
        loginCustomer,
        registerCustomer,
        logoutCustomer: signOut,
        isCustomer: () => Boolean(customerUser),
        requireAuthForAction,
        executePendingAction: () => pendingAction
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
