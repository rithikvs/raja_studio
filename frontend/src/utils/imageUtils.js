/**
 * Comprehensive Image Utility for Studio Gift Shop
 * 
 * Supports:
 * 1. High-efficiency client-side image compression using HTML5 Canvas
 * 2. Upload to server-side static media storage (/api/admin/media/upload)
 * 3. Base64-to-server-URL conversion to prevent localStorage quota exhaustion
 */

const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8787';
        }
    }
    return (import.meta.env?.VITE_API_URL || 'http://localhost:8787').replace(/\/$/, '');
};

/**
 * Converts a base64 Data URL to a Blob
 */
export function dataURLToBlob(dataurl) {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

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

/**
 * Upload an image File or Blob to backend media storage
 * Automatically compresses first if it's large, then uploads to /api/admin/media/upload.
 * Returns { url: string, filename: string, isRemote: boolean }
 */
export async function uploadImageFile(file, options = {}) {
    if (!file) throw new Error('No file provided for upload.');

    // 1. Compress image to clean web dimensions
    let uploadBlob = file;
    try {
        const compressedDataUrl = await compressImage(file, options);
        if (compressedDataUrl && compressedDataUrl.startsWith('data:image/')) {
            uploadBlob = dataURLToBlob(compressedDataUrl);
        }
    } catch (compErr) {
        console.warn('Image compression before upload non-fatal warning:', compErr);
        uploadBlob = file;
    }

    // 2. Prepare FormData
    const formData = new FormData();
    const filename = file.name || `image_${Date.now()}.jpg`;
    formData.append('file', uploadBlob, filename);

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('raja_access_token') : null;
    const targetUrl = `${getApiBaseUrl()}/api/admin/media/upload`;

    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const res = await fetch(targetUrl, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.message || `Upload failed with status ${res.status}`);
        }

        const data = await res.json();
        return {
            url: data.url,
            filename: data.filename || filename,
            isRemote: true
        };
    } catch (err) {
        console.error('Remote image upload error, using fallback:', err);
        // Fallback: If remote upload failed, return compressed Data URL
        const dataUrl = await compressImage(file, { maxWidth: 800, maxHeight: 800, quality: 0.75 });
        return {
            url: dataUrl,
            filename,
            isRemote: false
        };
    }
}

/**
 * Upload an existing base64 string or dataURL to backend media storage
 * Returns the clean static URL.
 */
export async function uploadBase64Image(dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
        return { url: dataUrl, isRemote: false };
    }

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('raja_access_token') : null;
    const targetUrl = `${getApiBaseUrl()}/api/admin/media/upload-base64`;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const res = await fetch(targetUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({ dataUrl })
        });

        if (res.ok) {
            const data = await res.json();
            if (data?.url) {
                return { url: data.url, isRemote: true };
            }
        }
    } catch (err) {
        console.warn('Failed to upload base64 to server endpoint:', err);
    }

    // Secondary attempt: Convert to Blob and upload via FormData
    try {
        const blob = dataURLToBlob(dataUrl);
        return await uploadImageFile(blob);
    } catch (fallbackErr) {
        console.warn('Fallback base64 conversion failed:', fallbackErr);
        return { url: dataUrl, isRemote: false };
    }
}
