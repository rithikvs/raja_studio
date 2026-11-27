import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function inspect() {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB_NAME || 'raja_studio');

    console.log('=== 1. PRODUCTS ===');
    const products = await db.collection('products').find({}).toArray();
    console.log(`Found ${products.length} products.`);
    products.forEach((p, i) => {
        const main = p.image || p.image_url || '';
        const mainType = main.startsWith('data:image/') ? `BASE64 (${Math.round(main.length/1024)}KB)` : (main.startsWith('http') ? 'HTTP_URL' : 'EMPTY/OTHER');
        const gallery = p.galleryImages || p.images || [];
        console.log(`[${i+1}] "${p.name}" (ID: ${p._id}) - Main: ${mainType} | Gallery items: ${gallery.length}`);
        if (gallery.length > 0) {
            gallery.forEach((g, gi) => {
                const gType = g.startsWith('data:image/') ? `BASE64 (${Math.round(g.length/1024)}KB)` : (g.startsWith('http') ? 'HTTP_URL' : 'OTHER');
                console.log(`     Gallery [${gi+1}]: ${gType}`);
            });
        }
    });

    console.log('\n=== 2. ORDER IMAGES ===');
    const orderImages = await db.collection('order_images').find({}).toArray();
    console.log(`Found ${orderImages.length} order images.`);
    orderImages.forEach((img, i) => {
        console.log(`[${i+1}] Order: ${img.order_id} | R2 Key: ${img.r2_object_key || 'NONE'} | Data: ${img.image_data ? 'BASE64' : 'NONE'} | File: ${img.original_file_name || 'N/A'}`);
    });

    console.log('\n=== 3. CMS ===');
    const cmsDoc = await db.collection('cms').findOne({ _id: 'studio_gift_shop_cms' });
    if (cmsDoc?.data) {
        ['logoImage', 'heroImage', 'promoBannerImage', 'atelierImage', 'videoHeroImage', 'designHeroImage'].forEach(key => {
            const val = cmsDoc.data[key];
            if (val) {
                const type = val.startsWith('data:image/') ? `BASE64 (${Math.round(val.length/1024)}KB)` : (val.startsWith('http') ? 'HTTP_URL' : 'OTHER');
                console.log(`  CMS ${key}: ${type}`);
            }
        });
    }

    console.log('\n=== 4. DESIGN SAMPLES ===');
    const designs = await db.collection('design_samples').find({}).toArray();
    console.log(`Found ${designs.length} design samples.`);
    designs.forEach((d, i) => {
        const type = (d.image || '').startsWith('data:image/') ? `BASE64` : ((d.image || '').startsWith('http') ? 'HTTP_URL' : 'OTHER');
        console.log(`[${i+1}] "${d.title}" - ${type}`);
    });

    console.log('\n=== 5. LOCAL DISK UPLOADS ===');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (fs.existsSync(uploadsDir)) {
        const listFiles = (dir) => {
            let results = [];
            const list = fs.readdirSync(dir);
            list.forEach(file => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat && stat.isDirectory()) {
                    results = results.concat(listFiles(fullPath));
                } else {
                    results.push({ path: path.relative(uploadsDir, fullPath), size: Math.round(stat.size / 1024) + ' KB' });
                }
            });
            return results;
        };
        const files = listFiles(uploadsDir);
        console.log(`Found ${files.length} local files in backend/uploads/:`);
        files.forEach(f => console.log(`  - ${f.path} (${f.size})`));
    } else {
        console.log('No backend/uploads directory found.');
    }

    await client.close();
}

inspect().catch(console.error);
