/**
 * Utility functions for product price calculation and formatting.
 * Ensures products with 0 base price or variant pricing display the 1st frame rate.
 */

export const getProductDisplayPrice = (product) => {
    if (!product) return 0;

    const pricingMode = product.pricingMode || 'simple';
    const customizationConfig = product.customizationOptions || [
        {
            name: 'Frame Size',
            type: 'radio',
            options: [
                { label: '6x4 Inches', priceAdjustment: 50 },
                { label: '8x6 Inches', priceAdjustment: 100 },
                { label: '12x18 Inches', priceAdjustment: 350 }
            ]
        }
    ];

    // Find primary option group (e.g. Frame Size or first group with options)
    const primaryGroup = customizationConfig.find(g => g.options && g.options.length > 0) || customizationConfig[0];
    const firstOption = primaryGroup?.options?.[0];
    const firstOptPrice = firstOption ? Number(firstOption.price ?? firstOption.priceAdjustment ?? 0) : 0;

    if (pricingMode === 'variant') {
        if (firstOptPrice > 0) {
            return firstOptPrice;
        }
        // Fallback: check all options in all groups to find the first non-zero price
        for (const group of customizationConfig) {
            for (const opt of (group.options || [])) {
                const p = Number(opt.price ?? opt.priceAdjustment ?? 0);
                if (p > 0) return p;
            }
        }
        return Number(product.salePrice || product.price || 0);
    } else {
        const basePrice = Number(product.salePrice || product.price || 0);
        if (basePrice > 0) {
            return basePrice;
        } else if (firstOptPrice > 0) {
            return firstOptPrice;
        } else {
            for (const group of customizationConfig) {
                for (const opt of (group.options || [])) {
                    const p = Number(opt.price ?? opt.priceAdjustment ?? 0);
                    if (p > 0) return p;
                }
            }
            return 0;
        }
    }
};

export const getProductRegularPrice = (product) => {
    if (!product || !product.regularPrice) return 0;
    const regPrice = Number(product.regularPrice);
    const salePrice = getProductDisplayPrice(product);
    return regPrice > salePrice ? regPrice : 0;
};
