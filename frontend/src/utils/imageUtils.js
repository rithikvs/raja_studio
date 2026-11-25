/**
 * Utility for client-side image compression and conversion
 * Resizes large images (e.g. from camera/phones) to reasonable web dimensions
 * reducing file size from 5MB+ to ~50KB-120KB, preventing localStorage quota overflow.
 */
export const compressImage = (file, options = {}) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return reject(new Error('No file provided for compression.'));
        }

        // SVGs don't need canvas rasterization - preserve vector format
        if (file.type === 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
            return;
        }

        const isPng = file.type === 'image/png';
        const {
            maxWidth = 1200,
            maxHeight = 1200,
            quality = 0.82,
            mimeType = isPng ? 'image/png' : 'image/jpeg'
        } = options;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Scale proportionally if dimensions exceed max limits
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    // Fallback to raw base64 if canvas context is unavailable
                    return resolve(event.target.result);
                }

                // If converting to JPEG, fill white background to handle transparent pixels cleanly
                if (mimeType === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, width, height);
                }

                ctx.drawImage(img, 0, 0, width, height);

                try {
                    const compressedDataUrl = canvas.toDataURL(mimeType, quality);
                    resolve(compressedDataUrl);
                } catch (canvasErr) {
                    console.warn('Canvas export error, using fallback:', canvasErr);
                    resolve(event.target.result);
                }
            };

            img.onerror = (imgErr) => {
                console.warn('Image load error during compression, fallback to raw read:', imgErr);
                resolve(event.target.result);
            };

            img.src = event.target.result;
        };

        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
};
