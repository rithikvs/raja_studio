import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Heart, ShoppingBag, Star } from 'lucide-react';
import { useData } from '../context/DataContext';
import styles from './Works.module.css';

const Works = () => {
    const { products, cms } = useData();
    const [selectedFilter, setSelectedFilter] = useState('All');

    // Use product images as portfolio items
    const activeProducts = products.filter(p => p.status !== 'disabled' && (p.image || p.images?.length > 0));

    const categories = ['All', ...new Set(activeProducts.map(p => p.category).filter(Boolean))];

    const filteredWorks = selectedFilter === 'All' 
        ? activeProducts 
        : activeProducts.filter(p => p.category === selectedFilter);

    // Sample testimonials
    const testimonials = [
        {
            name: 'Priya Sharma',
            rating: 5,
            text: 'Amazing quality! The photo frame arrived perfectly packed and the print quality is outstanding. Highly recommend!',
            product: 'Wooden Photo Frame'
        },
        {
            name: 'Rahul Kumar',
            rating: 5,
            text: 'Ordered a customized LED gift for my parents anniversary. They absolutely loved it. Great service!',
            product: 'LED Acrylic Display'
        },
        {
            name: 'Anita Patel',
            rating: 5,
            text: 'Beautiful photo collage for our family. The customization options were perfect. Will order again!',
            product: 'Photo Collage Frame'
        }
    ];

    return (
        <div className={styles.worksPage}>
            {/* Hero Section */}
            <div className={styles.pageHeader}>
                <div className="container">
                    <h1>Our Work & Portfolio</h1>
                    <p>Browse through our collection of personalized gifts created for our happy customers</p>
                </div>
            </div>

            {/* Stats Section */}
            <section className={styles.statsSection}>
                <div className="container">
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>1000+</div>
                            <div className={styles.statLabel}>Happy Customers</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>5000+</div>
                            <div className={styles.statLabel}>Orders Delivered</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>50+</div>
                            <div className={styles.statLabel}>Product Varieties</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>4.9★</div>
                            <div className={styles.statLabel}>Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio Gallery */}
            <section className="section-padding" style={{ background: '#f9fafb' }}>
                <div className="container">
                    <h2 className="section-title text-center">Our Product Gallery</h2>
                    <p className="section-subtitle text-center">
                        Explore our range of personalized gifts and custom creations
                    </p>

                    {/* Category Filter */}
                    <div className={styles.filterButtons}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={selectedFilter === cat ? styles.active : ''}
                                onClick={() => setSelectedFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    {filteredWorks.length > 0 ? (
                        <div className={styles.gallery}>
                            {filteredWorks.map((product) => (
                                <Link 
                                    to={`/product/${product.id}`} 
                                    key={product.id} 
                                    className={styles.galleryItem}
                                >
                                    <div className={styles.imageWrapper}>
                                        <img 
                                            src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'} 
                                            alt={product.name} 
                                        />
                                        <div className={styles.overlay}>
                                            <h3>{product.name}</h3>
                                            <p className={styles.category}>{product.category}</p>
                                            <div className={styles.price}>₹{product.salePrice || product.price}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <ImageIcon size={64} color="#cbd5e1" />
                            <h3>No Works Available</h3>
                            <p>Products will appear here once added by admin</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Customer Testimonials */}
            <section className="section-padding">
                <div className="container">
                    <h2 className="section-title text-center">What Our Customers Say</h2>
                    <p className="section-subtitle text-center">Real reviews from our happy customers</p>

                    <div className={styles.testimonialsGrid}>
                        {testimonials.map((testimonial, idx) => (
                            <div key={idx} className={styles.testimonialCard}>
                                <div className={styles.stars}>
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={18} fill="#fbbf24" color="#fbbf24" />
                                    ))}
                                </div>
                                <p className={styles.testimonialText}>"{testimonial.text}"</p>
                                <div className={styles.testimonialAuthor}>
                                    <strong>{testimonial.name}</strong>
                                    <span>{testimonial.product}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className="container text-center">
                    <h2>Ready to Create Your Own?</h2>
                    <p>Start customizing your personalized gift today!</p>
                    <div className={styles.ctaButtons}>
                        <Link to="/shop" className={styles.primaryBtn}>
                            <ShoppingBag size={20} />
                            Browse Products
                        </Link>
                        <Link to="/personalized-gifts" className={styles.secondaryBtn}>
                            <Heart size={20} />
                            Explore Gifts
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Works;
