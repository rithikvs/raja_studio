// Utility to clear all demo/existing data for a fresh start
// This ensures the application starts with 0 products, 0 orders, 0 customers, 0 categories

export const clearAllData = () => {
    try {
        // Clear all Raja Studio related localStorage data except CMS content
        const keysToKeep = ['raja_cms', 'raja_admin_session', 'raja_user_session'];
        
        // Get all localStorage keys
        const allKeys = Object.keys(localStorage);
        
        // Clear all Raja Studio data except sessions and CMS
        allKeys.forEach(key => {
            if (key.startsWith('raja_') && !keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        
        // Reinitialize with empty arrays
        localStorage.setItem('raja_products', JSON.stringify([]));
        localStorage.setItem('raja_categories', JSON.stringify([]));
        localStorage.setItem('raja_orders', JSON.stringify([]));
        localStorage.setItem('raja_customers', JSON.stringify([]));
        localStorage.setItem('raja_coupons', JSON.stringify([]));
        localStorage.setItem('raja_reviews', JSON.stringify([]));
        localStorage.setItem('raja_cart', JSON.stringify([]));
        localStorage.setItem('raja_wishlist', JSON.stringify([]));
        
        console.log('✅ All demo data cleared. Application reset to fresh state.');
        return true;
    } catch (error) {
        console.error('❌ Error clearing demo data:', error);
        return false;
    }
};

export const getDataStats = () => {
    try {
        const products = JSON.parse(localStorage.getItem('raja_products') || '[]');
        const categories = JSON.parse(localStorage.getItem('raja_categories') || '[]');
        const orders = JSON.parse(localStorage.getItem('raja_orders') || '[]');
        const customers = JSON.parse(localStorage.getItem('raja_customers') || '[]');
        const coupons = JSON.parse(localStorage.getItem('raja_coupons') || '[]');
        
        return {
            products: products.length,
            categories: categories.length,
            orders: orders.length,
            customers: customers.length,
            coupons: coupons.length,
            hasAdminSession: !!localStorage.getItem('raja_admin_session'),
            hasUserSession: !!localStorage.getItem('raja_user_session')
        };
    } catch (error) {
        console.error('Error getting data stats:', error);
        return null;
    }
};

// Auto-run on import (for testing purposes)
if (process.env.NODE_ENV === 'development') {
    console.log('📊 Current data stats:', getDataStats());
}