/**
 * Raja Studios — Cloudflare R2 Media Synchronization Script
 * 
 * Safely inspects and synchronizes sample media (machinery videos, video editing samples)
 * to Cloudflare R2 object storage.
 * 
 * Idempotent: Can be run multiple times safely without creating duplicates.
 * Safe: Never touches private customer files or deletes local originals.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { S3Client, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const config = {
    accountId: (process.env.CLOUDFLARE_ACCOUNT_ID || process.env.R2_ACCOUNT_ID || '').trim(),
    accessKeyId: (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || '').trim(),
    secretAccessKey: (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || '').trim(),
    bucketName: (process.env.CLOUDFLARE_R2_BUCKET_NAME || process.env.R2_BUCKET_NAME || '').trim(),
    publicUrl: (process.env.CLOUDFLARE_R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || '').trim().replace(/\/$/, ''),
    region: (process.env.CLOUDFLARE_R2_REGION || process.env.R2_REGION || 'auto').trim()
};

const isR2Configured = Boolean(config.accountId && config.accessKeyId && config.secretAccessKey && config.bucketName);

export async function syncSampleMedia() {
    console.log('=====================================================');
    console.log('   RAJA STUDIOS — R2 MEDIA SYNCHRONIZATION AUDIT    ');
    console.log('=====================================================');

    if (!isR2Configured) {
        console.log('ℹ️  Cloudflare R2 is currently not fully configured in backend/.env:');
        console.log('   - Account ID:', config.accountId ? 'OK' : 'MISSING (CLOUDFLARE_ACCOUNT_ID)');
        console.log('   - Access Key:', config.accessKeyId ? 'OK' : 'MISSING (CLOUDFLARE_R2_ACCESS_KEY_ID)');
        console.log('   - Secret Key:', config.secretAccessKey ? 'OK' : 'MISSING (CLOUDFLARE_R2_SECRET_ACCESS_KEY)');
        console.log('   - Bucket Name:', config.bucketName ? 'OK' : 'MISSING (CLOUDFLARE_R2_BUCKET_NAME)');
        console.log('\n💡 System gracefully falling back to local public storage (/service-videos/ and /samples/).');
        console.log('   When Cloudflare R2 credentials are provided in .env, rerun this script to upload immediately.');
        return {
            success: false,
            reason: 'unconfigured_credentials',
            syncedCount: 0,
            fallbackActive: true
        };
    }

    const s3 = new S3Client({
        region: config.region,
        endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey
        }
    });

    console.log(`🔌 Connected to R2 bucket: "${config.bucketName}"`);

    // List existing objects
    const listCmd = new ListObjectsV2Command({ Bucket: config.bucketName, MaxKeys: 500 });
    const listRes = await s3.send(listCmd);
    const existingKeys = new Set((listRes.Contents || []).map(o => o.Key));
    console.log(`📦 Existing objects in bucket: ${existingKeys.size}`);

    const mediaDir = path.resolve(__dirname, '../frontend/public/service-videos');
    if (!fs.existsSync(mediaDir)) {
        console.log('⚠️ No local service-videos folder found.');
        return { success: true, syncedCount: 0 };
    }

    const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.mp4'));
    let uploadedCount = 0;

    for (const file of files) {
        const r2Key = `services/machinery/${file}`;
        if (existingKeys.has(r2Key)) {
            console.log(`⏭️  Already in R2 (skipping duplicate): ${r2Key}`);
            continue;
        }

        const filePath = path.join(mediaDir, file);
        const buffer = fs.readFileSync(filePath);
        console.log(`⬆️  Uploading ${file} (${Math.round(buffer.length / 1024)} KB) -> ${r2Key}...`);

        await s3.send(new PutObjectCommand({
            Bucket: config.bucketName,
            Key: r2Key,
            Body: buffer,
            ContentType: 'video/mp4'
        }));

        console.log(`✅ Uploaded to R2: ${r2Key}`);
        uploadedCount++;
    }

    console.log(`🎉 Sync completed. ${uploadedCount} new files uploaded to Cloudflare R2.`);
    return {
        success: true,
        syncedCount: uploadedCount,
        fallbackActive: false
    };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    syncSampleMedia().catch(console.error);
}
