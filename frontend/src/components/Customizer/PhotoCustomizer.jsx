import React, { useState, useEffect } from 'react';
import { Upload, Check, AlertTriangle, Eye, Sparkles, Gift, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import styles from './PhotoCustomizer.module.css';

const PhotoCustomizer = ({ product }) => {
    const { requireAuthForAction } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Setup initial customization options from product config or default fallback
    const customizationConfig = product.customizationOptions || [
        {
            name: 'Frame Size',
            type: 'radio',
            options: [
                { label: '6x4 Inches', priceAdjustment: 0 },
                { label: '8x6 Inches', priceAdjustment: 100 },
                { label: '10x8 Inches', priceAdjustment: 180 },
                { label: '12x18 Inches', priceAdjustment: 350 }
            ]
        },
        {
            name: 'Frame Color',
            type: 'color',
            options: [
                { label: 'Black', hex: '#1a1a1a', priceAdjustment: 0 },
                { label: 'Gold', hex: '#d4af37', priceAdjustment: 50 },
                { label: 'White', hex: '#f8f9fa', priceAdjustment: 0 },
                { label: 'Brown', hex: '#5c4033', priceAdjustment: 30 }
            ]
        },
        {
            name: 'Frame Design',
            type: 'dropdown',
            options: [
                { label: 'Classic Smooth', priceAdjustment: 0 },
                { label: 'Textured Carved', priceAdjustment: 70 },
                { label: 'Modern Slim', priceAdjustment: 40 }
            ]
        },
        {
            name: 'Finish',
            type: 'radio',
            options: [
                { label: 'Matte Finish', priceAdjustment: 0 },
                { label: 'Glossy Finish', priceAdjustment: 30 }
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
    const [glitter, setGlitter] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [calculatedPrice, setCalculatedPrice] = useState(product.salePrice || product.price || 399);

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
        let base = 0;
        
        // Check if product uses variant pricing mode
        const pricingMode = product.pricingMode || 'simple';
        
        if (pricingMode === 'variant') {
            // VARIANT PRICING: Use selected variant price, NOT product base price
            // Example: Frame 1 = ₹100 (final price ₹100, not ₹80 + ₹100)
            let variantPrice = 0;
            let foundVariant = false;
            
            customizationConfig.forEach(optGroup => {
                const selectedVal = selectedOptions[optGroup.name];
                if (selectedVal && optGroup.options) {
                    const match = optGroup.options.find(o => o.label === selectedVal);
                    if (match && match.price !== undefined) {
                        // This option has a full price (variant pricing)
                        variantPrice = Number(match.price);
                        foundVariant = true;
                    } else if (match && match.priceAdjustment && foundVariant) {
                        // Add adjustments from other options
                        variantPrice += Number(match.priceAdjustment);
                    }
                }
            });
            
            base = variantPrice > 0 ? variantPrice : Number(product.salePrice || product.price || 0);
        } else {
            // SIMPLE PRICING: Start with product base price and add adjustments
            base = Number(product.salePrice || product.price || 399);
            
            customizationConfig.forEach(optGroup => {
                const selectedVal = selectedOptions[optGroup.name];
                if (selectedVal && optGroup.options) {
                    const match = optGroup.options.find(o => o.label === selectedVal);
                    if (match && match.priceAdjustment) {
                        base += Number(match.priceAdjustment);
                    }
                }
            });
        }

        // Add-ons are ALWAYS additive (for both simple and variant pricing)
        if (giftPacking) base += 50;
        if (glitter) base += 80;

        setCalculatedPrice(base);
    }, [selectedOptions, giftPacking, glitter, product]);

    const handleOptionSelect = (optionName, optionLabel) => {
        setSelectedOptions(prev => ({ ...prev, [optionName]: optionLabel }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > Number(import.meta.env.VITE_MAX_UPLOAD_BYTES || 26214400)) { alert('This image exceeds the maximum upload size.'); return; }
        setCustomPhotoFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            setCustomPhoto(dataUrl);

            // Analyze resolution
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
                setPhotoQuality({ width: w, height: h, quality, fileName: file.name, fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB' });
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    };

    const handleAction = (isBuyNow = false) => {
        if (product.photoRequired !== false && !customPhoto) {
            alert('Please upload your photo to customize this gift.');
            return;
        }

        const cartItem = {
            productId: product.id,
            productName: product.name,
            productImage: product.image || (product.images && product.images[0]) || '',
            price: calculatedPrice,
            basePrice: product.price,
            pricingMode: product.pricingMode || 'simple',
            selectedOptions,
            customPhoto,
            customPhotoFile,
            photoQuality,
            customText,
            giftPacking,
            glitter,
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

    return (
        <div className={styles.customizerContainer}>
            {/* Live Frame Preview Column */}
            <div className={styles.previewColumn}>
                <div className={styles.framePreviewBox} style={{
                    borderColor: selectedOptions['Frame Color'] === 'Gold' ? '#d4af37' :
                        selectedOptions['Frame Color'] === 'White' ? '#e2e8f0' :
                            selectedOptions['Frame Color'] === 'Brown' ? '#5c4033' : '#1a1a1a'
                }}>
                    {customPhoto ? (
                        <div className={styles.photoContainer}>
                            <img src={customPhoto} alt="Uploaded Customer Photo" className={styles.previewImage} />
                            {customText && <div className={styles.overlayText}>{customText}</div>}
                        </div>
                    ) : (
                        <div className={styles.placeholderBox}>
                            <ImageIcon size={48} className={styles.placeholderIcon} />
                            <p>Upload photo to see live frame preview</p>
                        </div>
                    )}
                </div>

                {photoQuality && (
                    <div className={`${styles.qualityBadge} ${photoQuality.quality === 'Excellent Quality' ? styles.excellent :
                        photoQuality.quality === 'Good Quality' ? styles.good : styles.low
                        }`}>
                        {photoQuality.quality === 'Low Quality' ? (
                            <><AlertTriangle size={16} /> Photo quality may be low for selected size ({photoQuality.width}x{photoQuality.height}px)</>
                        ) : (
                            <><Check size={16} /> {photoQuality.quality} ({photoQuality.width}x{photoQuality.height}px - {photoQuality.fileSize})</>
                        )}
                    </div>
                )}
            </div>

            {/* Configurator Controls Column */}
            <div className={styles.optionsColumn}>
                <h3 className={styles.sectionHeading}>Configure Your Customization</h3>

                {/* 1. Photo Upload */}
                <div className={styles.optionGroup}>
                    <label className={styles.groupLabel}>
                        1. Upload Your Photo {product.photoRequired !== false && <span className={styles.required}>*</span>}
                    </label>
                    <div className={styles.uploadArea}>
                        <input type="file" accept="image/*" id="photo-upload-input" onChange={handlePhotoUpload} className={styles.fileInput} />
                        <label htmlFor="photo-upload-input" className={styles.uploadBtn}>
                            <Upload size={18} /> {customPhoto ? 'Change Uploaded Photo' : 'Choose Original High-Res Photo'}
                        </label>
                    </div>
                </div>

                {/* 2. Custom Text / Name */}
                <div className={styles.optionGroup}>
                    <label className={styles.groupLabel}>2. Custom Name or Message (Optional)</label>
                    <input
                        type="text"
                        placeholder="e.g. Happy Anniversary Rahul & Priya ❤️"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className={styles.textInput}
                    />
                </div>

                {/* 3. Dynamic Customization Options */}
                {customizationConfig.map((optGroup) => (
                    <div key={optGroup.name} className={styles.optionGroup}>
                        <label className={styles.groupLabel}>
                            {optGroup.name}: <span className={styles.selectedVal}>{selectedOptions[optGroup.name]}</span>
                        </label>

                        {/* Render Radios / Buttons */}
                        {optGroup.type === 'color' ? (
                            <div className={styles.swatchGrid}>
                                {optGroup.options.map(opt => (
                                    <button
                                        key={opt.label}
                                        type="button"
                                        className={`${styles.colorSwatch} ${selectedOptions[optGroup.name] === opt.label ? styles.activeSwatch : ''}`}
                                        style={{ backgroundColor: opt.hex || '#333' }}
                                        onClick={() => handleOptionSelect(optGroup.name, opt.label)}
                                        title={`${opt.label} ${opt.priceAdjustment ? `(₹${opt.priceAdjustment})` : ''}`}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.chipGrid}>
                                {optGroup.options.map(opt => (
                                    <button
                                        key={opt.label}
                                        type="button"
                                        className={`${styles.chipBtn} ${selectedOptions[optGroup.name] === opt.label ? styles.activeChip : ''}`}
                                        onClick={() => handleOptionSelect(optGroup.name, opt.label)}
                                    >
                                        {opt.label} {opt.priceAdjustment > 0 && <span className={styles.extraPrice}>₹{opt.priceAdjustment}</span>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* 4. Add-ons */}
                <div className={styles.optionGroup}>
                    <label className={styles.groupLabel}>4. Special Add-ons</label>
                    <div className={styles.addonList}>
                        <label className={styles.checkboxRow}>
                            <input type="checkbox" checked={giftPacking} onChange={(e) => setGiftPacking(e.target.checked)} />
                            <span><Gift size={16} /> Premium Gift Packing (+₹50)</span>
                        </label>
                        <label className={styles.checkboxRow}>
                            <input type="checkbox" checked={glitter} onChange={(e) => setGlitter(e.target.checked)} />
                            <span><Sparkles size={16} /> Diamond Glitter Lamination Coating (+₹80)</span>
                        </label>
                    </div>
                </div>

                {/* Live Total & CTA Buttons */}
                <div className={styles.priceContainer}>
                    <div className={styles.priceHeader}>
                        <span>Calculated Total Price:</span>
                        <div className={styles.calculatedAmount}>
                            {product.pricingMode === 'variant' && calculatedPrice === 0 ? (
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>Select options to view price</span>
                            ) : (
                                `₹${calculatedPrice * quantity}`
                            )}
                        </div>
                    </div>

                    <div className={styles.quantityRow}>
                        <span>Quantity:</span>
                        <div className={styles.qtyBox}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>

                    <div className={styles.ctaRow}>
                        <button type="button" className={styles.addToCartBtn} onClick={() => handleAction(false)}>
                            ADD TO CART
                        </button>
                        <button type="button" className={styles.buyNowBtn} onClick={() => handleAction(true)}>
                            BUY NOW
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoCustomizer;
