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
    WISHLIST: 'raja_wishlist',
    VIDEOS: 'raja_video_samples',
    DESIGNS: 'raja_design_samples'
};

const defaultCategories = [
    { id: 'cat_birthday', name: 'Birthday Gifts', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80', description: 'Curated celebration hampers, custom keepsakes & surprise luxury boxes.' },
    { id: 'cat_anniversary', name: 'Anniversary Gifts', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80', description: 'Timeless romantic photo frames, engraved keepsakes & bespoke couple gifts.' },
    { id: 'cat_personalized', name: 'Personalized Gifts', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80', description: 'Custom engraved frames, crystal acrylic blocks & customized mugs.' },
    { id: 'cat_wedding', name: 'Wedding Gifts', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80', description: 'Opulent congratulations hampers, luxury memory books & premium presentation.' },
    { id: 'cat_corporate', name: 'Corporate Gifts', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80', description: 'Sophisticated executive gifting, bespoke corporate hampers & custom branded gift sets.' },
    { id: 'cat_hampers', name: 'Luxury Gift Hampers', image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80', description: 'Handcrafted artisan hampers, premium chocolates, scented votives & gourmet delights.' },
    { id: 'cat_decor', name: 'Home Decor Gifts', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80', description: 'Handcrafted aesthetic frames, LED crystal art pieces & decorative wall keepsakes.' },
    { id: 'cat_festival', name: 'Festival Gifts', image: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=600&auto=format&fit=crop&q=80', description: 'Exquisite festive celebration boxes, auspicious keepsakes & ceremonial gifting.' }
];

const defaultInitialProducts = [
    {
        id: '6a9a6d900e4cc90d478e36fb',
        name: 'Premium Bespoke Photo Frame',
        sku: 'SGS-PF-001',
        category: 'Personalized Gifts',
        pricingMode: 'simple',
        price: 80,
        salePrice: 80,
        regularPrice: 100,
        stock: 50,
        rating: 5.0,
        reviewsCount: 38,
        featured: true,
        bestSeller: true,
        newArrival: true,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
        images: [
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=800&auto=format&fit=crop&q=80'
        ],
        shortDescription: 'Handcrafted wooden & acrylic luxury frame with ultra-HD photo printing.',
        fullDescription: 'Our signature bespoke photo frame features studio-grade HD printing, crystal-clear protective acrylic layer, and premium solid framing. Perfect for turning your favorite memories into lasting gallery-grade art.',
        customizationOptions: [
            {
                name: 'Frame Size',
                type: 'radio',
                options: [
                    { label: '6x4 Inches', priceAdjustment: 0 },
                    { label: '8x6 Inches', priceAdjustment: 100 },
                    { label: '12x18 Inches', priceAdjustment: 350 }
                ]
            },
            {
                name: 'Frame Color',
                type: 'radio',
                options: [
                    { label: 'Champagne Gold', priceAdjustment: 50 },
                    { label: 'Deep Emerald Green', priceAdjustment: 30 },
                    { label: 'Classic Walnut Wood', priceAdjustment: 0 }
                ]
            }
        ]
    },
    {
        id: '6a9cfba257471e89a15250cb',
        name: 'Round Clock Murugar Acrylic Keepsake',
        sku: 'SGS-CK-002',
        category: 'Home Decor Gifts',
        pricingMode: 'simple',
        price: 450,
        salePrice: 450,
        regularPrice: 900,
        stock: 45,
        rating: 4.9,
        reviewsCount: 24,
        featured: true,
        bestSeller: true,
        newArrival: false,
        image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80',
        images: [
            'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80'
        ],
        shortDescription: 'Illuminated crystal acrylic clock with precision silent quartz movement.',
        fullDescription: 'Elegantly laser-etched round acrylic timepiece with golden Roman numerals and serene artwork. Crafted for elegant home decor and auspicious gifting.',
        customizationOptions: [
            {
                name: 'Dial Diameter',
                type: 'radio',
                options: [
                    { label: '10 Inches Standard', priceAdjustment: 0 },
                    { label: '14 Inches Grand', priceAdjustment: 250 }
                ]
            }
        ]
    },
    {
        id: '6ab283670b508dfa4a810136',
        name: 'Personalized Glazed Ceramic Mug',
        sku: 'SGS-MG-003',
        category: 'Personalized Gifts',
        pricingMode: 'simple',
        price: 299,
        salePrice: 299,
        regularPrice: 399,
        stock: 80,
        rating: 4.8,
        reviewsCount: 52,
        featured: true,
        bestSeller: false,
        newArrival: true,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
        images: [
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
        ],
        shortDescription: 'Microwave-safe ceramic mug with vibrant permanent photo and quote print.',
        fullDescription: 'Start every morning with love. Dishwasher-safe high-gloss ceramic coffee mug personalized with your uploaded photo, custom name, and special date.',
        customizationOptions: [
            {
                name: 'Mug Interior Color',
                type: 'radio',
                options: [
                    { label: 'Emerald Green', priceAdjustment: 0 },
                    { label: 'Champagne Gold', priceAdjustment: 30 },
                    { label: 'Pure Cream', priceAdjustment: 0 }
                ]
            }
        ]
    },
    {
        id: 'sgs_hamper_004',
        name: 'Royal Celebration Luxury Gift Hamper',
        sku: 'SGS-HP-004',
        category: 'Luxury Gift Hampers',
        pricingMode: 'simple',
        price: 1499,
        salePrice: 1499,
        regularPrice: 1899,
        stock: 30,
        rating: 5.0,
        reviewsCount: 19,
        featured: true,
        bestSeller: true,
        newArrival: true,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
        images: [
            'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80'
        ],
        shortDescription: 'Handcrafted luxury gift box with gourmet treats, scented candle & gold keepsakes.',
        fullDescription: 'An opulent gifting experience in our emerald and champagne gold luxury trunk. Packed with artisanal chocolates, pure soy scented candle, custom message card, and ribbon presentation.',
        customizationOptions: [
            {
                name: 'Hamper Size',
                type: 'radio',
                options: [
                    { label: 'Classic Box', priceAdjustment: 0 },
                    { label: 'Royal Grand Trunk', priceAdjustment: 500 }
                ]
            }
        ]
    }
];

// In-memory cache ensures zero data loss even if browser localStorage quota is reached
const memoryStore = {};

const notifyChange = (key, data) => {
    window.dispatchEvent(new CustomEvent('raja_db_change', { detail: { key, data } }));
};

const getStorageItem = (key, fallback) => {
    if (memoryStore[key] !== undefined) {
        return memoryStore[key];
    }
    try {
        const item = localStorage.getItem(key);
        if (item) {
            const parsed = JSON.parse(item);
            memoryStore[key] = parsed;
            return parsed;
        }
        return fallback;
    } catch (e) {
        console.error(`Error reading ${key} from storage:`, e);
        return fallback;
    }
};

const setStorageItem = (key, data, options = {}) => {
    memoryStore[key] = data;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn(`localStorage write failed for ${key} (quota limit). Preserved in memoryStore:`, e);
    }
    if (!options.skipNotify) {
        notifyChange(key, data);
    }
};

const defaultCMS = {
    businessName: 'Studio Gift Shop',
    giftDivision: 'Luxury Boutique Gifting',
    tagline: 'Make Every Moment Special',
    heroHeadline: 'Make Every Moment Special',
    heroSubheadline: 'Discover thoughtfully curated gifts that turn ordinary moments into unforgettable memories.',
    phone: '+91 77085 52461',
    whatsapp: '917708552461',
    email: 'contact@studiogiftshop.com',
    address: 'Studio Gift Shop, Main Road, City Center, Tamil Nadu, India',
    instagram: 'https://instagram.com/studiogiftshop',
    facebook: 'https://facebook.com/studiogiftshop',
    youtube: 'https://youtube.com/studiogiftshop',
    aboutStory: 'At Studio Gift Shop, we craft luxury gifting experiences that transform treasured memories into bespoke physical keepsakes with exquisite precision, museum-grade framing, and handcrafted elegance.',
    aboutMission: 'To curate premium, timeless gifts and bespoke personalized keepsakes that celebrate life’s most cherished relationships with elegance and royal luxury.',
    announcementBanner: 'Free delivery on selected orders • Premium gifting collections • Special seasonal offers',
    logoImage: '',
    heroImage: '',
    promoBannerImage: '',
    atelierImage: '',
    videoHeroImage: '',
    designHeroImage: ''
};

export const defaultVideoSamples = [
    {
        id: 'v1',
        title: 'Royal Heritage Wedding Teaser',
        category: 'Wedding & Teasers',
        duration: '01:45',
        resolution: '4K UHD • 60 FPS',
        aspect: '16:9 Cinema',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        description: 'Cinematic color grading with soft film glow, emotional violin sound design, slow-motion drone sweeps, and bespoke typography for royal vows.',
        tools: ['Premiere Pro', 'DaVinci Resolve', 'Sound FX']
    },
    {
        id: 'v2',
        title: 'Golden 25th Anniversary Memory Reel',
        category: 'Wedding & Teasers',
        duration: '02:15',
        resolution: '4K UHD • 60 FPS',
        aspect: '16:9 Cinema',
        thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        description: 'Nostalgic photo-to-video montage transition with vintage light leaks, restored old photographs, and heartwarming narration sync.',
        tools: ['After Effects', 'Photo Restoration', 'Audio Clean']
    },
    {
        id: 'v3',
        title: 'Magical 1st Birthday Celebration Highlight',
        category: 'Birthday & Celebrations',
        duration: '01:10',
        resolution: '1080p FHD',
        aspect: '9:16 Reel / 16:9',
        thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        description: 'Uplifting joyful rhythm cuts synced with baby laughter, confetti burst motion graphics, and animated cartoon name title cards.',
        tools: ['Premiere Pro', 'Motion Graphics', 'Beat Sync']
    },
    {
        id: 'v4',
        title: 'Luxury Velvet Hamper Unboxing Film',
        category: 'Gift Reveals & Unboxing',
        duration: '00:55',
        resolution: '4K UHD • 60 FPS',
        aspect: '9:16 Vertical Reel',
        thumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        description: 'Crisp macro b-roll, satisfying ASMR ribbon cuts, gold particle sparkles, and upbeat acoustic background music.',
        tools: ['Macro Focus', 'Color Grading', 'ASMR Audio']
    },
    {
        id: 'v5',
        title: 'LED Personalized Photo Frame Showcase',
        category: 'Gift Reveals & Unboxing',
        duration: '00:45',
        resolution: '4K UHD • 60 FPS',
        aspect: '9:16 Vertical Reel',
        thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        description: 'Dark ambient room reveal, glowing LED illumination zoom, emotional music swell, and personalized customer reaction caption.',
        tools: ['Light FX', 'LUT Master', 'DaVinci Resolve']
    },
    {
        id: 'v6',
        title: 'Boutique Fashion & Lifestyle Viral Reel',
        category: 'Social Media Reels',
        duration: '00:30',
        resolution: '1080p FHD • 60 FPS',
        aspect: '9:16 Instagram Reel',
        thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        description: 'High-energy quick cuts, trending sound sync, kinetic animated typography, seamless swipe transitions, and high-retention pacing.',
        tools: ['Kinetic Type', 'Trending Audio', 'Reel Optimization']
    },
    {
        id: 'v7',
        title: 'Grand Brand Story & Atelier Commercial',
        category: 'Brand Promos',
        duration: '02:00',
        resolution: '4K UHD • Cinema Scope',
        aspect: '21:9 Widescreen',
        thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        description: 'Behind-the-scenes craftsman footage, voiceover mixing, orchestral backing score, corporate lower thirds, and studio logo animation.',
        tools: ['Voiceover EQ', 'Color Match', 'Premiere Pro']
    },
    {
        id: 'v8',
        title: 'Surprise Romantic Proposal Highlight',
        category: 'Wedding & Teasers',
        duration: '01:20',
        resolution: '4K UHD • 60 FPS',
        aspect: '16:9 Cinema',
        thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
        description: 'Sunset beach setting, drone aerial approach, live audio capture enhancement, and soft golden hour color grading.',
        tools: ['Drone Footage', 'Audio Cleanup', '4K Master']
    }
];

export const defaultDesignSamples = [
    {
        id: 'd1',
        title: 'Royal Crown Heritage Monogram',
        category: 'Luxury Brand Logos',
        format: 'Vector AI, SVG, High-Res PNG',
        dimensions: 'Infinite Scalability',
        style: 'Gold Foil & Deep Emerald',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
        description: 'Custom intertwined serif monogram with heraldic lion emblems, sculpted royal crown, and champagne gold metallic finish for luxury boutiques and jewelry houses.',
        colors: ['#064E3B', '#D4AF37', '#145A42', '#FFFDF5']
    },
    {
        id: 'd2',
        title: 'Studio Gift Shop Modern Crest',
        category: 'Luxury Brand Logos',
        format: 'Vector AI, EPS, SVG, WebP',
        dimensions: 'Square & Horizontal Lockups',
        style: 'Modern Minimalist Luxury',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        description: 'Refined geometric gift box silhouette intertwined with clean editorial serif typography. Balanced spacing and timeless symmetry.',
        colors: ['#0B3D2E', '#D4AF37', '#F5C542', '#FFFFFF']
    },
    {
        id: 'd3',
        title: 'Grand Classical Music & Gala Night',
        category: 'Event & Party Posters',
        format: 'Print-Ready PDF (300 DPI) & JPG',
        dimensions: 'A3 (11.7 x 16.5 in) & Instagram 4:5',
        style: 'Dramatic Contrast & Gold Accents',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
        description: 'High-impact editorial event poster with dark atmospheric lighting, bold serif headlines, gold foil accent ribbons, and clean sponsor footer layout.',
        colors: ['#09090b', '#D4AF37', '#F59E0B', '#F8FAFC']
    },
    {
        id: 'd4',
        title: 'Diwali Festival of Lights Grand Celebration',
        category: 'Festival & Social Flyers',
        format: 'Digital Social (1080x1080) & Story (1080x1920)',
        dimensions: '1:1 Square & 9:16 Vertical',
        style: 'Golden Sparkles & Traditional Festive',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
        description: 'Warm glowing diya illustrations, intricate golden mandala borders, festive calligraphy, and customizable gift voucher discount tags.',
        colors: ['#78350F', '#F59E0B', '#D4AF37', '#FEF3C7']
    },
    {
        id: 'd5',
        title: 'Handcrafted Botanical Candle & Hamper Label',
        category: 'Gift Packaging & Labels',
        format: 'Die-Cut Vector PDF & Mockup',
        dimensions: 'Custom Die-Cut Jar & Box Sleeves',
        style: 'Apothecary Luxury & Organic Floral',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
        description: 'Delicate fine-line hand-drawn lavender and rose botanicals paired with embossed gold hot-stamp foil text for luxury gifting boxes.',
        colors: ['#064E3B', '#D4AF37', '#E2E8F0', '#FFFDF5']
    },
    {
        id: 'd6',
        title: 'Silver Jubilee 25th Wedding Anniversary Card',
        category: 'Monograms & Invitations',
        format: 'Print Ready PDF & Digital Invitation',
        dimensions: '5 x 7 in Double-Sided',
        style: 'Silver Foil & Pearl White Calligraphy',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
        description: 'Embossed couple monogram, romantic script typography, QR code for RSVP/live location, and matching thank you gift tags.',
        colors: ['#334155', '#94A3B8', '#D4AF37', '#FFFFFF']
    },
    {
        id: 'd7',
        title: 'Retro Neon Birthday Bash Party Poster',
        category: 'Event & Party Posters',
        format: 'Print PDF & WhatsApp Invite PNG',
        dimensions: 'A4 & Mobile Wallpaper',
        style: 'Neon Glow & Electric Typography',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
        description: 'Vibrant neon lettering, photo cutout integration of the birthday star, disco lighting flares, and celebration party schedule breakdown.',
        colors: ['#0B132B', '#10B981', '#F59E0B', '#EC4899']
    },
    {
        id: 'd8',
        title: 'Acrylic Clock Dial & Memorial Plaque Artwork',
        category: 'Gift Packaging & Labels',
        format: 'Laser Vector DXF, SVG & PDF',
        dimensions: '12x12 in Circular & Custom Cut',
        style: 'Laser Engraved Precision',
        image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80',
        description: 'High-precision circular artwork designed for laser engraving and UV printing on acrylic, wood, and metal clocks with personalized dedication text.',
        colors: ['#1E293B', '#D4AF37', '#F8FAFC', '#E2E8F0']
    }
];

export const initDB = () => {
    // Initialize or migrate CMS brand name to Studio Gift Shop
    const currentCms = getStorageItem(KEYS.CMS, null);
    if (!currentCms || currentCms.businessName === 'RAJA STUDIO') {
        setStorageItem(KEYS.CMS, { ...defaultCMS, ...(currentCms || {}) });
    }

    const currentProds = getStorageItem(KEYS.PRODUCTS, []);
    if (!currentProds || currentProds.length === 0) {
        setStorageItem(KEYS.PRODUCTS, defaultInitialProducts);
    }

    const currentCats = getStorageItem(KEYS.CATEGORIES, []);
    if (!currentCats || currentCats.length < 8) {
        setStorageItem(KEYS.CATEGORIES, defaultCategories);
    }
    
    if (!localStorage.getItem(KEYS.ORDERS)) {
        setStorageItem(KEYS.ORDERS, []);
    }
    if (!localStorage.getItem(KEYS.CUSTOMERS)) {
        setStorageItem(KEYS.CUSTOMERS, []);
    }
    // Initialize default coupons if none exist
    if (!localStorage.getItem(KEYS.COUPONS)) {
        const defaultCoupons = [
            {
                id: 'coup_default_1',
                code: 'LED10',
                discountType: 'percentage',
                discountValue: 10,
                minCartValue: 500,
                status: 'active',
                createdAt: new Date().toISOString(),
                description: '10% off on orders above ₹500'
            },
            {
                id: 'coup_default_2',
                code: 'GOLD15',
                discountType: 'percentage',
                discountValue: 15,
                minCartValue: 1000,
                status: 'active',
                createdAt: new Date().toISOString(),
                description: '15% off on luxury hampers above ₹1000'
            }
        ];
        setStorageItem(KEYS.COUPONS, defaultCoupons);
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
        setStorageItem(KEYS.REVIEWS, []);
    }

    const currentVideos = getStorageItem(KEYS.VIDEOS, null);
    if (!currentVideos || currentVideos.length === 0) {
        setStorageItem(KEYS.VIDEOS, defaultVideoSamples);
    }

    const currentDesigns = getStorageItem(KEYS.DESIGNS, null);
    if (!currentDesigns || currentDesigns.length === 0) {
        setStorageItem(KEYS.DESIGNS, defaultDesignSamples);
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
    saveCMS: (cms, options = {}) => setStorageItem(KEYS.CMS, cms, options),

    // Video Samples Management
    getVideoSamples: () => getStorageItem(KEYS.VIDEOS, defaultVideoSamples),
    saveVideoSamples: (videos) => setStorageItem(KEYS.VIDEOS, videos),
    addVideoSample: (video) => {
        const videos = getStorageItem(KEYS.VIDEOS, defaultVideoSamples);
        const newVideo = { 
            ...video, 
            id: video.id || 'vid_' + Date.now(), 
            createdAt: new Date().toISOString() 
        };
        const updated = [newVideo, ...videos];
        setStorageItem(KEYS.VIDEOS, updated);
        return newVideo;
    },
    updateVideoSample: (id, fields) => {
        const videos = getStorageItem(KEYS.VIDEOS, defaultVideoSamples);
        const updated = videos.map(v => v.id === id ? { ...v, ...fields, updatedAt: new Date().toISOString() } : v);
        setStorageItem(KEYS.VIDEOS, updated);
        return updated.find(v => v.id === id);
    },
    deleteVideoSample: (id) => {
        const videos = getStorageItem(KEYS.VIDEOS, defaultVideoSamples);
        const updated = videos.filter(v => v.id !== id);
        setStorageItem(KEYS.VIDEOS, updated);
    },

    // Logo & Poster Design Samples Management
    getDesignSamples: () => getStorageItem(KEYS.DESIGNS, defaultDesignSamples),
    saveDesignSamples: (designs) => setStorageItem(KEYS.DESIGNS, designs),
    addDesignSample: (design) => {
        const designs = getStorageItem(KEYS.DESIGNS, defaultDesignSamples);
        const newDesign = { 
            ...design, 
            id: design.id || 'des_' + Date.now(), 
            createdAt: new Date().toISOString() 
        };
        const updated = [newDesign, ...designs];
        setStorageItem(KEYS.DESIGNS, updated);
        return newDesign;
    },
    updateDesignSample: (id, fields) => {
        const designs = getStorageItem(KEYS.DESIGNS, defaultDesignSamples);
        const updated = designs.map(d => d.id === id ? { ...d, ...fields, updatedAt: new Date().toISOString() } : d);
        setStorageItem(KEYS.DESIGNS, updated);
        return updated.find(d => d.id === id);
    },
    deleteDesignSample: (id) => {
        const designs = getStorageItem(KEYS.DESIGNS, defaultDesignSamples);
        const updated = designs.filter(d => d.id !== id);
        setStorageItem(KEYS.DESIGNS, updated);
    },

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
