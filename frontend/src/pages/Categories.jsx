import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Package, Sparkles, ArrowRight, Gift } from 'lucide-react';
import { useData } from '../context/DataContext';
import styles from './Categories.module.css';

const Categories = () => {
    const { categories, products } = useData();
    const activeProducts = products.filter(p => p.status !== 'disabled');

    const categoryList = categories.length >= 8 ? categories : [
        {
            id: 'cat_birthday',
            name: 'Birthday Gifts',
            image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
            description: 'Curated celebration hampers, custom keepsakes & surprise luxury boxes.'
        },
        {
            id: 'cat_anniversary',
            name: 'Anniversary Gifts',
            image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80',
            description: 'Timeless romantic photo frames, engraved keepsakes & bespoke couple gifts.'
        },
        {
            id: 'cat_personalized',
            name: 'Personalized Gifts',
            image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
            description: 'Custom engraved frames, crystal acrylic blocks & customized mugs.'
        },
        {
            id: 'cat_wedding',
            name: 'Wedding Gifts',
            image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
            description: 'Opulent congratulations hampers, luxury memory books & premium presentation.'
        },
        {
            id: 'cat_corporate',
            name: 'Corporate Gifts',
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
            description: 'Sophisticated executive gifting, bespoke corporate hampers & custom branded gift sets.'
        },
        {
            id: 'cat_hampers',
            name: 'Luxury Gift Hampers',
            image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
            description: 'Handcrafted artisan hampers, premium chocolates, scented votives & gourmet delights.'
        },
        {
            id: 'cat_decor',
            name: 'Home Decor Gifts',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
            description: 'Handcrafted aesthetic frames, LED crystal art pieces & decorative wall keepsakes.'
        },
        {
            id: 'cat_festival',
            name: 'Festival Gifts',
            image: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=600&auto=format&fit=crop&q=80',
            description: 'Exquisite festive celebration boxes, auspicious keepsakes & ceremonial gifting.'
        }
    ];

    const getCategoryCount = (categoryName) => {
        return activeProducts.filter(p => p.category === categoryName).length;
    };

    return (
        <div className={styles.categoriesPage}>
            {/* Header Banner */}
            <div className={styles.pageHeader}>
                <div className="container">
                    <span className={styles.badge}>
                        <Sparkles size={14} /> BOUTIQUE CATALOG
                    </span>
                    <h1>Gift Collections & Categories</h1>
                    <p>Discover our meticulously organized gifting categories designed for life's most meaningful celebrations.</p>
                </div>
            </div>

            <div className="container section-padding">
                <div className={styles.categoriesGrid}>
                    {categoryList.map((category) => {
                        const productCount = getCategoryCount(category.name);
                        return (
                            <div key={category.id || category.name} className={styles.categoryCard}>
                                <div className={styles.categoryImage}>
                                    <img 
                                        src={category.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'} 
                                        alt={category.name} 
                                    />
                                    <div className={styles.overlay}></div>
                                    <span className={styles.countBadge}>
                                        {productCount} {productCount === 1 ? 'Gift' : 'Gifts'}
                                    </span>
                                </div>
                                <div className={styles.categoryInfo}>
                                    <h3>{category.name}</h3>
                                    <p className={styles.catDesc}>{category.description || 'Explore our exclusive handcrafted collections'}</p>
                                    <Link 
                                        to={`/shop?category=${encodeURIComponent(category.name)}`}
                                        className={styles.exploreBtn}
                                    >
                                        Explore Collection <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Navigation Assistance */}
                <div className={styles.quickBanner}>
                    <div className={styles.quickBannerText}>
                        <h3>Looking for Something Specially Handcrafted?</h3>
                        <p>Our gifting consultants are ready to tailor custom hampers, corporate orders, and large celebrations.</p>
                    </div>
                    <Link to="/contact" className={styles.quickBannerBtn}>
                        Contact Boutique Support <ChevronRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Categories;
