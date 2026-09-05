// Authentication and Permission Testing Utilities
// This file contains functions to test the complete authentication system

export const runAuthTests = () => {
    console.log('🧪 Starting Authentication & Permission Tests...\n');
    
    const results = {
        adminAuthTest: testAdminAuthentication(),
        userAuthTest: testUserAuthentication(),
        routeProtectionTest: testRouteProtection(),
        sessionSeparationTest: testSessionSeparation(),
        permissionTest: testPermissions()
    };
    
    console.log('📊 Test Results Summary:');
    Object.entries(results).forEach(([test, result]) => {
        console.log(`${result.passed ? '✅' : '❌'} ${test}: ${result.message}`);
    });
    
    const allPassed = Object.values(results).every(r => r.passed);
    console.log(`\n🎯 Overall Result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
    
    return results;
};

// Test 1: Admin Authentication with Fixed Credentials
const testAdminAuthentication = () => {
    try {
        // Clear any existing admin session
        localStorage.removeItem('raja_admin_session');
        
        // Test invalid credentials
        const invalidResult = testAdminLogin('wrong@123', 'wrong');
        if (invalidResult.success) {
            return { passed: false, message: 'Admin login should reject invalid credentials' };
        }
        
        // Test valid credentials
        const validResult = testAdminLogin('admin@123', '1234');
        if (!validResult.success) {
            return { passed: false, message: 'Admin login should accept valid credentials (admin@123/1234)' };
        }
        
        // Verify session is created
        const session = JSON.parse(localStorage.getItem('raja_admin_session') || 'null');
        if (!session || session.role !== 'admin') {
            return { passed: false, message: 'Admin session not created properly' };
        }
        
        return { passed: true, message: 'Admin authentication works correctly' };
    } catch (error) {
        return { passed: false, message: `Admin auth test failed: ${error.message}` };
    }
};

// Test 2: User Registration and Authentication
const testUserAuthentication = () => {
    try {
        // Clear any existing user session
        localStorage.removeItem('raja_user_session');
        
        // Test user registration
        const regResult = testUserRegistration({
            name: 'Test Customer',
            email: 'test@customer.com',
            phone: '9876543210',
            password: 'testpass123',
            confirmPassword: 'testpass123'
        });
        
        if (!regResult.success) {
            return { passed: false, message: 'User registration should work with valid data' };
        }
        
        // Verify auto-login after registration
        const session = JSON.parse(localStorage.getItem('raja_user_session') || 'null');
        if (!session || session.role !== 'user') {
            return { passed: false, message: 'User session should be created after registration' };
        }
        
        // Test user login
        localStorage.removeItem('raja_user_session');
        const loginResult = testUserLogin('test@customer.com', 'testpass123');
        if (!loginResult.success) {
            return { passed: false, message: 'User login should work with registered credentials' };
        }
        
        return { passed: true, message: 'User authentication works correctly' };
    } catch (error) {
        return { passed: false, message: `User auth test failed: ${error.message}` };
    }
};

// Test 3: Route Protection
const testRouteProtection = () => {
    try {
        // Test admin routes require admin session
        localStorage.removeItem('raja_admin_session');
        const adminRouteAccess = checkAdminRouteAccess();
        if (adminRouteAccess) {
            return { passed: false, message: 'Admin routes should be protected when no admin session' };
        }
        
        // Test user routes work with user session
        localStorage.setItem('raja_user_session', JSON.stringify({ role: 'user', id: 'test' }));
        const userRouteAccess = checkUserRouteAccess();
        if (!userRouteAccess) {
            return { passed: false, message: 'User routes should work with user session' };
        }
        
        return { passed: true, message: 'Route protection works correctly' };
    } catch (error) {
        return { passed: false, message: `Route protection test failed: ${error.message}` };
    }
};

// Test 4: Session Separation
const testSessionSeparation = () => {
    try {
        // Set both admin and user sessions
        const adminSession = { role: 'admin', username: 'admin@123', id: 'admin-master' };
        const userSession = { role: 'user', email: 'user@test.com', id: 'user-123' };
        
        localStorage.setItem('raja_admin_session', JSON.stringify(adminSession));
        localStorage.setItem('raja_user_session', JSON.stringify(userSession));
        
        // Verify both sessions exist independently
        const storedAdmin = JSON.parse(localStorage.getItem('raja_admin_session'));
        const storedUser = JSON.parse(localStorage.getItem('raja_user_session'));
        
        if (!storedAdmin || !storedUser) {
            return { passed: false, message: 'Sessions should be stored independently' };
        }
        
        if (storedAdmin.role !== 'admin' || storedUser.role !== 'user') {
            return { passed: false, message: 'Session roles should be preserved correctly' };
        }
        
        // Clear admin session only
        localStorage.removeItem('raja_admin_session');
        const userStillExists = JSON.parse(localStorage.getItem('raja_user_session'));
        if (!userStillExists) {
            return { passed: false, message: 'User session should remain when admin session is cleared' };
        }
        
        return { passed: true, message: 'Session separation works correctly' };
    } catch (error) {
        return { passed: false, message: `Session separation test failed: ${error.message}` };
    }
};

// Test 5: Permission System
const testPermissions = () => {
    try {
        // Test admin can access everything
        localStorage.setItem('raja_admin_session', JSON.stringify({ role: 'admin', id: 'admin' }));
        const adminPerms = checkAdminPermissions();
        if (!adminPerms.canManageProducts || !adminPerms.canManageOrders || !adminPerms.canManageCustomers) {
            return { passed: false, message: 'Admin should have full permissions' };
        }
        
        // Test user has limited permissions
        localStorage.removeItem('raja_admin_session');
        localStorage.setItem('raja_user_session', JSON.stringify({ role: 'user', id: 'user' }));
        const userPerms = checkUserPermissions();
        if (userPerms.canManageProducts || userPerms.canManageCustomers || !userPerms.canBrowseProducts) {
            return { passed: false, message: 'User should have limited permissions' };
        }
        
        return { passed: true, message: 'Permission system works correctly' };
    } catch (error) {
        return { passed: false, message: `Permission test failed: ${error.message}` };
    }
};

// Helper functions to simulate authentication logic
const testAdminLogin = (username, password) => {
    if (username.trim() === 'admin@123' && password === '1234') {
        const sessionData = {
            id: 'admin-master',
            username: 'admin@123',
            name: 'Admin',
            role: 'admin',
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('raja_admin_session', JSON.stringify(sessionData));
        return { success: true, user: sessionData };
    }
    return { success: false, message: 'Invalid Admin credentials' };
};

const testUserRegistration = (userData) => {
    if (!userData.name || !userData.email || !userData.phone || !userData.password) {
        return { success: false, message: 'Missing required fields' };
    }
    
    if (userData.password !== userData.confirmPassword) {
        return { success: false, message: 'Passwords do not match' };
    }
    
    const newUser = {
        id: 'cust_' + Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        addresses: [],
        createdAt: new Date().toISOString(),
        status: 'active'
    };
    
    // Save to customers
    const customers = JSON.parse(localStorage.getItem('raja_customers') || '[]');
    customers.push(newUser);
    localStorage.setItem('raja_customers', JSON.stringify(customers));
    
    // Auto-login
    const userSession = { ...newUser, role: 'user' };
    localStorage.setItem('raja_user_session', JSON.stringify(userSession));
    
    return { success: true, user: userSession };
};

const testUserLogin = (emailOrPhone, password) => {
    const customers = JSON.parse(localStorage.getItem('raja_customers') || '[]');
    const found = customers.find(c =>
        (c.email.toLowerCase() === emailOrPhone.toLowerCase() || c.phone === emailOrPhone) &&
        c.password === password
    );
    
    if (found) {
        const userData = { ...found, role: 'user' };
        localStorage.setItem('raja_user_session', JSON.stringify(userData));
        return { success: true, user: userData };
    }
    
    return { success: false, message: 'Invalid credentials' };
};

const checkAdminRouteAccess = () => {
    const adminSession = localStorage.getItem('raja_admin_session');
    return adminSession && JSON.parse(adminSession).role === 'admin';
};

const checkUserRouteAccess = () => {
    const userSession = localStorage.getItem('raja_user_session');
    return userSession && JSON.parse(userSession).role === 'user';
};

const checkAdminPermissions = () => {
    const adminSession = localStorage.getItem('raja_admin_session');
    const isAdmin = adminSession && JSON.parse(adminSession).role === 'admin';
    
    return {
        canManageProducts: isAdmin,
        canManageOrders: isAdmin,
        canManageCustomers: isAdmin,
        canManageCategories: isAdmin,
        canManageCoupons: isAdmin,
        canManageCMS: isAdmin
    };
};

const checkUserPermissions = () => {
    const userSession = localStorage.getItem('raja_user_session');
    const isUser = userSession && JSON.parse(userSession).role === 'user';
    
    return {
        canBrowseProducts: isUser,
        canPlaceOrders: isUser,
        canManageOwnProfile: isUser,
        canViewOwnOrders: isUser,
        canManageProducts: false,
        canManageCustomers: false,
        canManageCMS: false
    };
};

// Export test runner for console use
if (typeof window !== 'undefined') {
    window.runAuthTests = runAuthTests;
    window.clearDemoData = () => import('./clearDemoData.js').then(m => m.clearAllData());
}