// Local Storage DB Manager for Raja Studio / Raja Gifts - Dual Role (ADMIN & USER)
const KEYS = {
    PRODUCTS: 'raja_products',
    CATEGORIES: 'raja_categories',
    ORDERS: 'raja_orders',
    CUSTOMERS: 'raja_customers',
    COUPONS: 'raja_coupons',
    REVIEWS: 'raja_reviews',
    CMS: 'raja_cms',
    ADMIN_SESSION: 'raja_admin_session',
    USER_SESSION: 'raja_user_session',
    CART: 'raja_cart',
    WISHLIST: 'raja_wishlist'
};

const defaultCategories = [
    { id: 'cat_frames', name: 'Photo Frames', image: '' },
    { id: 'cat_acrylic', name: 'Acrylic Gifts', image: '' },
    { id: 'cat_mugs', name: 'Personalized Mugs', image: '' },
    { id: 'cat_led', name: 'LED Gifts', image: '' },
    { id: 'cat_collages', name: 'Photo Collages', image: '' }
];

const notifyChange = (key, data) => {
    window.dispatchEvent(new CustomEvent('raja_db_change', { detail: { key, data } }));
};

const getStorageItem = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Error reading ${key} from storage:`, e);
        return fallback;
    }
};

const setStorageItem = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        notifyChange(key, data);
    } catch (e) {
        console.error(`Error writing ${key} to storage:`, e);
    }
};

const defaultCMS = {
    businessName: 'RAJA STUDIO',
    giftDivision: 'RAJA GIFTS',
    tagline: 'Personalized Gifts & Memories',
    heroHeadline: 'Turn Your Memories Into Beautiful Gifts',
    heroSubheadline: 'Create personalized photo gifts made specially for the people and moments you love.',
    phone: '+91 77085 52461',
    whatsapp: '917708552461',
    email: 'contact@rajastudio.com',
    address: 'Raja Studio, Main Road, City Center, Tamil Nadu, India',
    instagram: 'https://instagram.com/rajastudio',
    facebook: 'https://facebook.com/rajastudio',
    youtube: 'https://youtube.com/rajastudio',
    aboutStory: 'At Raja Studio & Raja Gifts, we turn your cherished photos into lasting physical memories with high-precision printing, premium framing, and handcrafted personalized gifts.',
    aboutMission: 'To offer affordable, premium quality photo customization that preserves your happiest moments with love and elegance.',
    announcementBanner: '✨ Special Customized Photo Frames & LED Gifts Available Now! Express Courier Shipping Available.'
};

export const initDB = () => {
    if (!localStorage.getItem(KEYS.CMS)) {
        setStorageItem(KEYS.CMS, defaultCMS);
    }
    if (!localStorage.getItem(KEYS.PRODUCTS)) {
        setStorageItem(KEYS.PRODUCTS, []);
    }
    if (!localStorage.getItem(KEYS.CATEGORIES)) {
        setStorageItem(KEYS.CATEGORIES, defaultCategories);
    } else if (!localStorage.getItem('raja_categories_seeded')) {
        const categories = getStorageItem(KEYS.CATEGORIES, []);
        if (categories.length === 0) {
            setStorageItem(KEYS.CATEGORIES, defaultCategories);
        }
        localStorage.setItem('raja_categories_seeded', 'true');
    }
    if (!localStorage.getItem(KEYS.ORDERS)) {
        setStorageItem(KEYS.ORDERS, []);
    }
    if (!localStorage.getItem(KEYS.CUSTOMERS)) {
        setStorageItem(KEYS.CUSTOMERS, []);
    }
    if (!localStorage.getItem(KEYS.COUPONS)) {
        setStorageItem(KEYS.COUPONS, []);
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
        setStorageItem(KEYS.REVIEWS, []);
    }
};

// Data API
export const db = {
    // Products
    getProducts: () => getStorageItem(KEYS.PRODUCTS, []),
    saveProducts: (products) => setStorageItem(KEYS.PRODUCTS, products),
    addProduct: (product) => {
        const products = getStorageItem(KEYS.PRODUCTS, []);
        const newProduct = {
            ...product,
            id: product.id || 'prod_' + Date.now(),
            createdAt: new Date().toISOString(),
            status: product.status || 'active'
        };
        const updated = [newProduct, ...products];
        setStorageItem(KEYS.PRODUCTS, updated);
        return newProduct;
    },
    updateProduct: (id, updatedFields) => {
        const products = getStorageItem(KEYS.PRODUCTS, []);
        const updated = products.map(p => p.id === id ? { ...p, ...updatedFields, updatedAt: new Date().toISOString() } : p);
        setStorageItem(KEYS.PRODUCTS, updated);
    },
    deleteProduct: (id) => {
        const products = getStorageItem(KEYS.PRODUCTS, []);
        const updated = products.filter(p => p.id !== id);
        setStorageItem(KEYS.PRODUCTS, updated);
    },

    // Categories
    getCategories: () => getStorageItem(KEYS.CATEGORIES, []),
    saveCategories: (categories) => setStorageItem(KEYS.CATEGORIES, categories),
    addCategory: (category) => {
        const categories = getStorageItem(KEYS.CATEGORIES, []);
        const newCategory = {
            ...category,
            id: category.id || 'cat_' + Date.now(),
            createdAt: new Date().toISOString()
        };
        const updated = [...categories, newCategory];
        setStorageItem(KEYS.CATEGORIES, updated);
        return newCategory;
    },
    updateCategory: (id, fields) => {
        const categories = getStorageItem(KEYS.CATEGORIES, []);
        const updated = categories.map(c => c.id === id ? { ...c, ...fields } : c);
        setStorageItem(KEYS.CATEGORIES, updated);
    },
    deleteCategory: (id) => {
        const categories = getStorageItem(KEYS.CATEGORIES, []);
        const updated = categories.filter(c => c.id !== id);
        setStorageItem(KEYS.CATEGORIES, updated);
    },

    // Orders
    getOrders: () => getStorageItem(KEYS.ORDERS, []),
    addOrder: (order) => {
        const orders = getStorageItem(KEYS.ORDERS, []);
        const newOrder = {
            ...order,
            id: order.id || 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            createdAt: new Date().toISOString(),
            status: order.status || 'Order Received',
            statusHistory: [
                { status: 'Order Received', timestamp: new Date().toISOString(), note: 'Order placed successfully.' }
            ]
        };
        const updated = [newOrder, ...orders];
        setStorageItem(KEYS.ORDERS, updated);
        return newOrder;
    },
    updateOrderStatus: (id, newStatus, note = '') => {
        const orders = getStorageItem(KEYS.ORDERS, []);
        const updated = orders.map(o => {
            if (o.id === id) {
                const history = o.statusHistory || [];
                return {
                    ...o,
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                    statusHistory: [...history, { status: newStatus, timestamp: new Date().toISOString(), note }]
                };
            }
            return o;
        });
        setStorageItem(KEYS.ORDERS, updated);
    },

    // Customers
    getCustomers: () => getStorageItem(KEYS.CUSTOMERS, []),
    saveCustomer: (customer) => {
        const customers = getStorageItem(KEYS.CUSTOMERS, []);
        const existing = customers.find(c => c.id === customer.id || c.email === customer.email);
        let updated;
        if (existing) {
            updated = customers.map(c => (c.id === customer.id || c.email === customer.email) ? { ...c, ...customer } : c);
        } else {
            updated = [...customers, { ...customer, id: customer.id || 'cust_' + Date.now(), createdAt: new Date().toISOString() }];
        }
        setStorageItem(KEYS.CUSTOMERS, updated);
    },
    deleteCustomer: (id) => {
        const customers = getStorageItem(KEYS.CUSTOMERS, []);
        const updated = customers.filter(c => c.id !== id);
        setStorageItem(KEYS.CUSTOMERS, updated);
    },

    // Coupons
    getCoupons: () => getStorageItem(KEYS.COUPONS, []),
    addCoupon: (coupon) => {
        const coupons = getStorageItem(KEYS.COUPONS, []);
        const newCoupon = { ...coupon, id: 'coup_' + Date.now(), status: 'active', createdAt: new Date().toISOString() };
        setStorageItem(KEYS.COUPONS, [...coupons, newCoupon]);
        return newCoupon;
    },
    deleteCoupon: (id) => {
        const coupons = getStorageItem(KEYS.COUPONS, []);
        setStorageItem(KEYS.COUPONS, coupons.filter(c => c.id !== id));
    },

    // CMS
    getCMS: () => getStorageItem(KEYS.CMS, defaultCMS),
    saveCMS: (cms) => setStorageItem(KEYS.CMS, cms),

    // Separate Authentication Sessions
    getAdminSession: () => getStorageItem(KEYS.ADMIN_SESSION, null),
    setAdminSession: (adminData) => setStorageItem(KEYS.ADMIN_SESSION, adminData),

    getUserSession: () => getStorageItem(KEYS.USER_SESSION, null),
    setUserSession: (userData) => setStorageItem(KEYS.USER_SESSION, userData),

    // Cart & Wishlist
    getCart: () => getStorageItem(KEYS.CART, []),
    saveCart: (cart) => setStorageItem(KEYS.CART, cart),
    getWishlist: () => getStorageItem(KEYS.WISHLIST, []),
    saveWishlist: (wishlist) => setStorageItem(KEYS.WISHLIST, wishlist)
};

// Initialize DB immediately
initDB();
