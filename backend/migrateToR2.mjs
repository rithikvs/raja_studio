import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    getR2Config,
    getR2Client,
    uploadBase64ToR2,
    uploadBufferToR2,
    R2_FOLDERS
} from './r2Storage.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
    const args = process.argv.slice(2);
    const isExecute = args.includes('--execute');
    const rollbackFileIndex = args.indexOf('--rollback');

    console.log('====================================================');
    console.log('  RAJA STUDIOS - CLOUDFLARE R2 MIGRATION SCRIPT    ');
    console.log('====================================================');

    const config = getR2Config();
    console.log(`Cloudflare R2 Configured: ${config.isConfigured ? 'YES' : 'NO'}`);
    console.log(`Bucket Name: ${config.bucketName || '(not set)'}`);
    console.log(`Public Base URL: ${config.publicUrl || '(not set)'}`);
    console.log(`Mode: ${isExecute ? '🚀 EXECUTE (LIVE MIGRATION)' : (rollbackFileIndex !== -1 ? '⏪ ROLLBACK' : '🔍 DRY RUN (Simulated)')}`);
    console.log('----------------------------------------------------\n');

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('❌ MONGODB_URI is missing from environment variables.');
        process.exit(1);
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || 'raja_studio');

    // Handle Rollback
    if (rollbackFileIndex !== -1) {
        const backupFileName = args[rollbackFileIndex + 1];
        if (!backupFileName) {
            console.error('❌ Please specify backup JSON file: node migrateToR2.mjs --rollback <filename>');
            process.exit(1);
        }
        const backupPath = path.isAbsolute(backupFileName) ? backupFileName : path.join(__dirname, backupFileName);
        if (!fs.existsSync(backupPath)) {
            console.error(`❌ Backup file not found at: ${backupPath}`);
            process.exit(1);
        }
        console.log(`Reading backup file from: ${backupPath}`);
        const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

        console.log(`Restoring ${backupData.products?.length || 0} products...`);
        for (const p of backupData.products || []) {
            const { _id, ...rest } = p;
            await db.collection('products').replaceOne({ _id: new ObjectId(_id) }, rest);
        }

        console.log(`Restoring ${backupData.order_images?.length || 0} order images...`);
        for (const img of backupData.order_images || []) {
            const { _id, ...rest } = img;
            await db.collection('order_images').replaceOne({ _id: new ObjectId(_id) }, rest);
        }

        if (backupData.cms) {
            console.log('Restoring CMS settings...');
            const { _id, ...rest } = backupData.cms;
            await db.collection('cms').replaceOne({ _id }, rest);
        }

        console.log('✅ Rollback successfully completed!');
        await client.close();
        process.exit(0);
    }

    if (!config.isConfigured) {
        console.error('❌ Cloudflare R2 credentials are missing or incomplete in backend/.env.');
        console.error('Please configure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL.');
        console.error('Migration aborted.');
        await client.close();
        process.exit(1);
    }

    // 1. Audit Products
    const products = await db.collection('products').find({}).toArray();
    const productsToMigrate = [];
    products.forEach((p) => {
        const main = p.image || p.image_url || '';
        const gallery = p.galleryImages || [];
        const isMainBase64 = main.startsWith('data:image/');
        const base64GalleryCount = gallery.filter(g => typeof g === 'string' && g.startsWith('data:image/')).length;
        if (isMainBase64 || base64GalleryCount > 0) {
            productsToMigrate.push({ product: p, isMainBase64, base64GalleryCount });
        }
    });

    // 2. Audit Order Images
    const orderImages = await db.collection('order_images').find({}).toArray();
    const orderImagesToMigrate = orderImages.filter(img => Boolean(img.image_data) && !img.r2_object_key);

    // 3. Audit CMS
    const cmsDoc = await db.collection('cms').findOne({ _id: 'studio_gift_shop_cms' });
    const cmsBase64Fields = [];
    if (cmsDoc?.data) {
        Object.entries(cmsDoc.data).forEach(([key, val]) => {
            if (typeof val === 'string' && val.startsWith('data:image/')) {
                cmsBase64Fields.push({ field: key, dataUrl: val });
            }
        });
    }

    console.log(`Found ${productsToMigrate.length} product(s) with Base64 images to migrate.`);
    console.log(`Found ${orderImagesToMigrate.length} order image(s) with Base64 data to migrate.`);
    console.log(`Found ${cmsBase64Fields.length} CMS field(s) with Base64 images to migrate.\n`);

    if (productsToMigrate.length === 0 && orderImagesToMigrate.length === 0 && cmsBase64Fields.length === 0) {
        console.log('🎉 No Base64 images found in MongoDB! Database is already clean.');
        await client.close();
        process.exit(0);
    }

    if (!isExecute) {
        console.log('ℹ️  DRY RUN complete. No changes made to MongoDB or Cloudflare R2.');
        console.log('To execute the migration, run: node migrateToR2.mjs --execute');
        await client.close();
        process.exit(0);
    }

    // CREATE BACKUP BEFORE EXECUTING
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `migration-backup-${timestamp}.json`;
    const backupFilePath = path.join(__dirname, backupFileName);
    fs.writeFileSync(backupFilePath, JSON.stringify({
        timestamp,
        products,
        order_images: orderImages,
        cms: cmsDoc
    }, null, 2));
    console.log(`📦 Safety backup written to: ${backupFilePath}\n`);

    // EXECUTE PRODUCT MIGRATION
    console.log('--- Migrating Products to R2 ---');
    for (const item of productsToMigrate) {
        const p = item.product;
        const updates = {};
        console.log(`Processing product "${p.name}" (ID: ${p._id})...`);

        if (item.isMainBase64) {
            const mainData = p.image || p.image_url;
            const res = await uploadBase64ToR2({
                dataUrl: mainData,
                folder: R2_FOLDERS.PRODUCTS,
                filename: `${p._id}-main.jpg`,
                isPublic: true
            });
            updates.image = res.url;
            updates.image_url = res.url;
            console.log(`  ✓ Main image uploaded -> ${res.url}`);
        }

        if (item.base64GalleryCount > 0) {
            const newGallery = [];
            for (let i = 0; i < (p.galleryImages || []).length; i++) {
                const g = p.galleryImages[i];
                if (typeof g === 'string' && g.startsWith('data:image/')) {
                    const res = await uploadBase64ToR2({
                        dataUrl: g,
                        folder: R2_FOLDERS.PRODUCTS,
                        filename: `${p._id}-gallery-${i + 1}.jpg`,
                        isPublic: true
                    });
                    newGallery.push(res.url);
                    console.log(`  ✓ Gallery [${i + 1}] uploaded -> ${res.url}`);
                } else {
                    newGallery.push(g);
                }
            }
            updates.galleryImages = newGallery;
        }

        updates.updated_at = new Date();
        await db.collection('products').updateOne({ _id: p._id }, { $set: updates });
        console.log(`  ✅ Product ${p._id} updated in MongoDB.\n`);
    }

    // EXECUTE ORDER IMAGES MIGRATION
    console.log('--- Migrating Order Customer Images to R2 (Private Storage) ---');
    for (const img of orderImagesToMigrate) {
        console.log(`Processing order image for order ${img.order_id}...`);
        const buffer = Buffer.from(img.image_data, 'base64');
        const ext = img.mime_type?.split('/')[1] || 'jpg';
        const safeExt = ext === 'jpeg' ? 'jpg' : ext;
        const key = `${R2_FOLDERS.CUSTOMER_UPLOADS}/orders/${img.order_id}/${img._id}.${safeExt}`;

        await uploadBufferToR2({
            buffer,
            key,
            contentType: img.mime_type || 'image/jpeg',
            isPublic: false
        });

        // Update MongoDB: set r2_object_key and unset image_data
        await db.collection('order_images').updateOne(
            { _id: img._id },
            {
                $set: { r2_object_key: key, updated_at: new Date() },
                $unset: { image_data: "" }
            }
        );
        console.log(`  ✅ Order image ${img._id} uploaded to R2 (${key}) & base64 purged from MongoDB.\n`);
    }

    // EXECUTE CMS MIGRATION
    if (cmsBase64Fields.length > 0) {
        console.log('--- Migrating CMS Images to R2 ---');
        const cmsUpdates = {};
        for (const item of cmsBase64Fields) {
            console.log(`Processing CMS ${item.field}...`);
            const res = await uploadBase64ToR2({
                dataUrl: item.dataUrl,
                folder: R2_FOLDERS.WEBSITE_ASSETS,
                filename: `${item.field}.jpg`,
                isPublic: true
            });
            cmsUpdates[`data.${item.field}`] = res.url;
            console.log(`  ✓ CMS ${item.field} uploaded -> ${res.url}`);
        }
        await db.collection('cms').updateOne({ _id: 'studio_gift_shop_cms' }, { $set: cmsUpdates });
        console.log('  ✅ CMS updated in MongoDB.\n');
    }

    console.log('🎉 Migration completed successfully!');
    console.log(`Backup file for rollback: ${backupFilePath}`);
    await client.close();
}

run().catch(err => {
    console.error('💥 Migration failed with error:', err);
    process.exit(1);
});
