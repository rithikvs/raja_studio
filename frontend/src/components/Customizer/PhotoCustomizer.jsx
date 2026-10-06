import React, { useState, useEffect } from 'react';
import { Upload, Check, AlertTriangle, Eye, Sparkles, Gift, ChevronLeft, ChevronRight, Maximize2, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { getProductDisplayPrice, getProductRegularPrice } from '../../utils/productUtils';
import styles from './PhotoCustomizer.module.css';

const PhotoCustomizer = ({ product }) => {
    const { requireAuthForAction } = useAuth();
    const { addToCart, toggleWishlist, isInWishlist } = useCart();
    const navigate = useNavigate();

    // Setup product images array for carousel
    const productImages = (product.images && product.images.length > 0)
        ? product.images
        : [product.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'];

    const [activeImageIdx, setActiveImageIdx] = useState(0);

    // Setup initial customization options from product config or default fallback
    const customizationConfig = product.customizationOptions || [
        {
            name: 'COLORS',
            type: 'dropdown',
            options: [
                { label: 'Choose an option', priceAdjustment: 0 },
                { label: 'Silver', priceAdjustment: 0 },
                { label: 'Gold', priceAdjustment: 0 },
                { label: 'Rose Gold', priceAdjustment: 50 }
            ]
        }
    ];

    // State
    const [selectedOptions, setSelectedOptions] = useState({});
    const [customPhoto, setCustomPhoto] = useState(null);
    const [customPhotoFile, setCustomPhotoFile] = useState(null);
    const [photoQuality, setPhotoQuality] = useState(null);
    const [customText, setCustomText] = useState('');
    const [giftPacking, setGiftPacking] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [calculatedPrice, setCalculatedPrice] = useState(() => getProductDisplayPrice(product));

    // Default selection initializer
    useEffect(() => {
        const initial = {};
        customizationConfig.forEach(opt => {
            if (opt.options && opt.options.length > 0) {
                initial[opt.name] = opt.options[0].label;
            }
        });
        setSelectedOptions(initial);
    }, [product]);

    // Live Price Recalculation
    useEffect(() => {
        let base = Number(product.salePrice || product.price || 0) || getProductDisplayPrice(product);

        customizationConfig.forEach(optGroup => {
            const selectedVal = selectedOptions[optGroup.name];
            if (selectedVal && optGroup.options) {
                const match = optGroup.options.find(o => o.label === selectedVal);
                if (match && match.priceAdjustment) {
                    base += Number(match.priceAdjustment);
                }
            }
        });

        if (giftPacking) base += 50;
        setCalculatedPrice(base > 0 ? base : getProductDisplayPrice(product));
    }, [selectedOptions, giftPacking, product]);

    const handleOptionSelect = (optionName, optionLabel) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: optionLabel }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCustomPhotoFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            setCustomPhoto(dataUrl);

            const img = new Image();
            img.onload = () => {
                const w = img.width;
                const h = img.height;
                let quality = 'Good Quality';
                if (w >= 1800 && h >= 1200) {
                    quality = 'Excellent Quality';
                } else if (w < 800 || h < 600) {
                    quality = 'Low Quality';
                }
                setPhotoQuality({ width: w, height: h, quality, fileName: file.name });
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    };

    const handleAction = (isBuyNow = false) => {
        if (product.photoRequired === true && !customPhoto) {
            alert('Please upload your photo to customize this gift.');
            return;
        }

        const cartItem = {
            productId: product.id,
            productName: product.name,
            productImage: productImages[activeImageIdx] || '',
            price: calculatedPrice,
            basePrice: product.price,
            selectedOptions,
            customPhoto,
            customPhotoFile,
            photoQuality,
            customText,
            giftPacking,
            quantity
        };

        const actionType = isBuyNow ? 'BUY_NOW' : 'ADD_TO_CART';
        const isAuthorized = requireAuthForAction({ type: actionType, cartItem });

        if (isAuthorized) {
            addToCart(cartItem);
            if (isBuyNow) {
                navigate('/checkout');
            } else {
                alert('Product added to cart!');
            }
        }
    };

    const prevImage = () => {
        setActiveImageIdx((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setActiveImageIdx((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className={styles.productDetailsContainer}>
            {/* Left Gallery Column */}
            <div className={styles.galleryColumn}>
                <div className={styles.mainImageFrame}>
                    <img src={customPhoto || productImages[activeImageIdx]} alt={product.name} className={styles.mainImg} />

                    {productImages.length > 1 && (
                        <>
                            <button type="button" className={styles.arrowLeft} onClick={prevImage} aria-label="Previous image">
                                <ChevronLeft size={22} />
                            </button>
                            <button type="button" className={styles.arrowRight} onClick={nextImage} aria-label="Next image">
                                <ChevronRight size={22} />
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        className={styles.expandBtn}
                        onClick={() => window.open(customPhoto || productImages[activeImageIdx], '_blank')}
                        title="Expand Image"
                    >
                        <Maximize2 size={18} />
                    </button>
                </div>

                {/* Thumbnails Row */}
                <div className={styles.thumbnailsRow}>
                    {productImages.map((imgUrl, idx) => (
                        <div
                            key={idx}
                            className={`${styles.thumbBox} ${activeImageIdx === idx ? styles.activeThumb : ''}`}
                            onClick={() => setActiveImageIdx(idx)}
                        >
                            <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Product Details & Customizer Form Column */}
            <div className={styles.detailsColumn}>
                <h1 className={styles.productTitle}>{product.name}</h1>

                <div className={styles.priceRow}>
                    {getProductRegularPrice(product) > 0 && (
                        <span className={styles.regularPrice}>₹ {getProductRegularPrice(product).toFixed(2)}</span>
                    )}
                    <span className={styles.salePrice}>₹ {calculatedPrice.toFixed(2)}</span>
                </div>

                {/* Specifications Bullets */}
                <ul className={styles.specsList}>
                    <li>• <strong>Material:</strong> High-quality premium silver, gold, acrylic & wood construction</li>
                    <li>• <strong>Size:</strong> Custom fitted or one size adjustable</li>
                    <li>• <strong>Usage:</strong> Suitable for personal memories, casual and festive occasions</li>
                </ul>

                {/* Customization Upload if required */}
                {product.photoRequired !== false && (
                    <div className={styles.fieldSection}>
                        <label className={styles.fieldLabel}>
                            Upload Custom Photo {product.photoRequired && <span className={styles.req}>*</span>}
                        </label>
                        <div className={styles.uploadArea}>
                            <input type="file" accept="image/*" id="photo-upload" onChange={handlePhotoUpload} className={styles.fileInput} />
                            <label htmlFor="photo-upload" className={styles.uploadBtn}>
                                <Upload size={18} /> {customPhoto ? 'Change Photo' : 'Choose Original High-Res Photo'}
                            </label>
                        </div>
                    </div>
                )}

                {/* Dynamic Options Dropdowns / Inputs */}
                {customizationConfig.map((optGroup) => (
                    <div key={optGroup.name} className={styles.fieldSection}>
                        <label className={styles.fieldLabel}>{optGroup.name}</label>
                        <select
                            value={selectedOptions[optGroup.name] || ''}
                            onChange={(e) => handleOptionSelect(optGroup.name, e.target.value)}
                            className={styles.selectInput}
                        >
                            {optGroup.options.map(opt => (
                                <option key={opt.label} value={opt.label}>
                                    {opt.label} {opt.priceAdjustment ? `(+₹${opt.priceAdjustment})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                {/* Custom Name Input */}
                <div className={styles.fieldSection}>
                    <label className={styles.fieldLabel}>Name <span className={styles.req}>*</span></label>
                    <input
                        type="text"
                        placeholder="Enter Your Text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className={styles.textInput}
                    />
                </div>

                {/* Gift Wrapping Checkbox */}
                <div className={styles.fieldSection}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={giftPacking}
                            onChange={(e) => setGiftPacking(e.target.checked)}
                        />
                        <span>Gift Wrapping <strong>(+ ₹ 50.00)</strong></span>
                    </label>
                </div>

                {/* Quantity & Add To Cart Row */}
                <div className={styles.cartActionRow}>
                    <div className={styles.qtyPill}>
                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>

                    <button type="button" className={styles.addToCartBtn} onClick={() => handleAction(false)}>
                        ADD TO CART
                    </button>
                </div>

                {/* Sub Wishlist Button */}
                <button
                    type="button"
                    className={`${styles.wishlistSubBtn} ${isInWishlist(product.id) ? styles.inWishlist : ''}`}
                    onClick={() => toggleWishlist(product)}
                >
                    <Heart size={18} fill={isInWishlist(product.id) ? '#ff6600' : 'none'} color={isInWishlist(product.id) ? '#ff6600' : '#4b5563'} />
                    <span>{isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>

                {/* Large Buy Now Button */}
                <button type="button" className={styles.buyNowLargeBtn} onClick={() => handleAction(true)}>
                    BUY NOW
                </button>
            </div>

            {/* Accordion / Details Tabs Section */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabsHeader}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'description' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Description
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'additional' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('additional')}
                    >
                        Additional information
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews (0)
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'description' && (
                        <div>
                            <p>{product.fullDescription || product.description || 'Customized photo gift handcrafted with extreme care and precision.'}</p>
                        </div>
                    )}
                    {activeTab === 'additional' && (
                        <div>
                            <p><strong>Package Content:</strong> Customized item in protective bubble wrap gift packaging.</p>
                            <p><strong>Care Instructions:</strong> Clean gently with soft microfibre cloth.</p>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div>
                            <p>There are no reviews yet for this customized gift.</p>
                            <p style={{ marginTop: '0.5rem', color: '#666' }}>Be the first to review "{product.name}"!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhotoCustomizer;
