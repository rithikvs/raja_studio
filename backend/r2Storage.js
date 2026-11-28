import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Cloudflare R2 Object Storage Service for Raja Studios
 * 
 * Supports both R2_* and CLOUDFLARE_R2_* environment variables.
 * Storage structure:
 *  - products/
 *  - photo-frames/
 *  - posters/
 *  - logos/
 *  - portfolio/
 *  - website-assets/
 *  - customer-uploads/
 */

export const R2_FOLDERS = {
    PRODUCTS: 'products',
    PHOTO_FRAMES: 'photo-frames',
    POSTERS: 'posters',
    LOGOS: 'logos',
    PORTFOLIO: 'portfolio',
    WEBSITE_ASSETS: 'website-assets',
    CUSTOMER_UPLOADS: 'customer-uploads',
    SERVICES: 'services',
    SERVICES_MACHINERY: 'services/machinery',
    SERVICES_THUMBNAILS: 'services/thumbnails',
    VIDEO_EDITING: 'video-editing/samples'
};

export function getR2Config() {
    const accountId = (process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID || '').trim();
    const accessKeyId = (process.env.R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '').trim();
    const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '').trim();
    const bucketName = (process.env.R2_BUCKET_NAME || process.env.CLOUDFLARE_R2_BUCKET_NAME || '').trim();
    const publicUrl = (process.env.R2_PUBLIC_URL || process.env.CLOUDFLARE_R2_PUBLIC_URL || '').trim().replace(/\/$/, '');
    const region = (process.env.R2_REGION || process.env.CLOUDFLARE_R2_REGION || 'auto').trim();

    const isConfigured = Boolean(accountId && accessKeyId && secretAccessKey && bucketName);

    return {
        accountId,
        accessKeyId,
        secretAccessKey,
        bucketName,
        publicUrl,
        region,
        isConfigured
    };
}

let s3ClientInstance = null;
let lastConfigHash = '';

export function getR2Client() {
    const config = getR2Config();
    if (!config.isConfigured) return null;

    const configHash = `${config.accountId}:${config.accessKeyId}:${config.bucketName}:${config.region}`;
    if (!s3ClientInstance || lastConfigHash !== configHash) {
        s3ClientInstance = new S3Client({
            region: config.region,
            endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey
            }
        });
        lastConfigHash = configHash;
    }

    return s3ClientInstance;
}

export function hasR2Config() {
    return getR2Config().isConfigured;
}

/**
 * Returns public URL for a given object key in Cloudflare R2
 */
export function getPublicR2Url(key) {
    const { publicUrl, bucketName, accountId } = getR2Config();
    if (!key) return '';
    const cleanKey = key.replace(/^\/+/, '');

    if (publicUrl) {
        return `${publicUrl}/${cleanKey}`;
    }
    // If no custom domain is provided, fallback to standard R2 dev or storage endpoint
    return `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${cleanKey}`;
}

/**
 * Extracts the R2 object key from a full URL or relative path
 */
export function extractR2Key(urlOrKey) {
    if (!urlOrKey || typeof urlOrKey !== 'string') return null;
    const clean = urlOrKey.trim();

    // Already a plain key
    for (const folder of Object.values(R2_FOLDERS)) {
        if (clean.startsWith(`${folder}/`)) return clean;
    }

    // Try parsing as URL
    try {
        const parsed = new URL(clean);
        const pathname = parsed.pathname.replace(/^\/+/, '');
        for (const folder of Object.values(R2_FOLDERS)) {
            if (pathname.startsWith(`${folder}/`)) return pathname;
            if (pathname.includes(`/${folder}/`)) {
                return pathname.substring(pathname.indexOf(`${folder}/`));
            }
        }
        // If path has media/ prefix
        if (pathname.startsWith('media/')) return pathname;
        return pathname || null;
    } catch {
        return null;
    }
}

/**
 * Upload a raw Buffer directly to Cloudflare R2
 */
export async function uploadBufferToR2({ buffer, key, contentType = 'application/octet-stream', isPublic = true }) {
    const client = getR2Client();
    const config = getR2Config();
    if (!client || !config.isConfigured) {
        throw new Error('Cloudflare R2 is not configured. Please set R2 credentials in backend/.env.');
    }

    const cleanKey = key.replace(/^\/+/, '');
    const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: cleanKey,
        Body: buffer,
        ContentType: contentType
    });

    await client.send(command);

    return {
        key: cleanKey,
        url: isPublic ? getPublicR2Url(cleanKey) : null,
        bucket: config.bucketName,
        size: buffer.length,
        contentType
    };
}

/**
 * Upload a Base64 Data URL to Cloudflare R2
 */
export async function uploadBase64ToR2({ dataUrl, folder = R2_FOLDERS.PRODUCTS, filename = null, isPublic = true }) {
    if (!dataUrl || typeof dataUrl !== 'string') {
        throw new Error('No base64 data provided.');
    }

    // If it's already an HTTP URL or clean R2 key, return it directly
    if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
        return { url: dataUrl, key: extractR2Key(dataUrl), isAlreadyUploaded: true };
    }

    const matches = dataUrl.match(/^data:([a-zA-Z0-9.+/-]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 Data URL format.');
    }

    const contentType = matches[1];
    let ext = contentType.split('/')[1] || 'jpg';
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg+xml') ext = 'svg';

    const buffer = Buffer.from(matches[2], 'base64');
    const safeFilename = filename || `${crypto.randomUUID()}.${ext}`;
    const key = `${folder.replace(/\/$/, '')}/${safeFilename}`;

    return await uploadBufferToR2({
        buffer,
        key,
        contentType,
        isPublic
    });
}

/**
 * Delete an object from Cloudflare R2 (prevents orphaned files)
 */
export async function deleteR2Object(keyOrUrl) {
    const key = extractR2Key(keyOrUrl);
    if (!key) return false;

    const client = getR2Client();
    const config = getR2Config();
    if (!client || !config.isConfigured) return false;

    try {
        await client.send(new DeleteObjectCommand({
            Bucket: config.bucketName,
            Key: key
        }));
        console.log(`🗑️ Deleted R2 object: ${key}`);
        return true;
    } catch (err) {
        console.warn(`Failed to delete R2 object (${key}):`, err.message);
        return false;
    }
}

/**
 * Generate a presigned download URL for private customer assets
 */
export async function getSignedDownloadUrl(key, originalFileName = 'download', expiresIn = 300) {
    const client = getR2Client();
    const config = getR2Config();
    if (!client || !config.isConfigured) {
        throw new Error('Cloudflare R2 is not configured.');
    }

    const cleanKey = key.replace(/^\/+/, '');
    const safeFilename = (originalFileName || 'image.jpg').replace(/[\r\n"]/g, '');

    const command = new GetObjectCommand({
        Bucket: config.bucketName,
        Key: cleanKey,
        ResponseContentDisposition: `attachment; filename="${safeFilename}"`
    });

    const url = await getSignedUrl(client, command, { expiresIn });
    return { url, expiresIn, key: cleanKey };
}

/**
 * Generate a presigned PUT upload URL for direct browser-to-R2 uploads (Vercel-compatible)
 */
export async function getPresignedUploadUrl({ folder = R2_FOLDERS.PRODUCTS, originalName = 'upload', contentType = 'image/jpeg', expiresIn = 600 }) {
    const client = getR2Client();
    const config = getR2Config();
    if (!client || !config.isConfigured) {
        throw new Error('Cloudflare R2 is not configured.');
    }

    const rawExt = originalName.split('.').pop() || 'jpg';
    const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const key = `${folder.replace(/\/$/, '')}/${crypto.randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: key,
        ContentType: contentType
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn });
    const publicUrl = getPublicR2Url(key);

    return {
        uploadUrl,
        key,
        publicUrl,
        expiresIn
    };
}
