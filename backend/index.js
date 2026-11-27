import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';
import {
  getR2Config,
  hasR2Config,
  getPublicR2Url,
  extractR2Key,
  uploadBufferToR2,
  uploadBase64ToR2,
  deleteR2Object,
  getSignedDownloadUrl,
  getPresignedUploadUrl,
  R2_FOLDERS
} from './r2Storage.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure local media upload directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const imagesDir = path.join(uploadsDir, 'images');
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
} catch (dirErr) {
  console.warn('Could not initialize uploads directory:', dirErr.message);
}

const app = express(); 
const port = Number(process.env.PORT || 8787); 
// Default upload limit: 100MB for 4K/FHD video reels and high-res posters
const maxUploadBytes = Number(process.env.MAX_UPLOAD_BYTES || 104857600);
const statuses = ['Pending', 'Confirmed', 'Photo Review', 'Printing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'];
const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://invalid'); let database;
console.log('Cloudflare R2 Status:', hasR2Config() ? 'Configured & Enabled' : 'Not configured (using local storage fallback)');
// Safe dynamic CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Serve static uploads (videos and images) with caching and streaming support
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '7d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4') || filePath.endsWith('.webm') || filePath.endsWith('.mov')) {
      res.setHeader('Accept-Ranges', 'bytes');
    }
  }
}));
// Accept all image and video formats
const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { 
        fileSize: maxUploadBytes,
        fieldSize: 50 * 1024 * 1024, // 50MB for large base64 media
        fields: 50, // Max number of non-file fields
        files: 20 // Max number of file uploads
    }, 
    fileFilter: (_req, file, cb) => {
        // Accept images and video files
        if (!file.mimetype || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'));
        }
    }
});
const fail = (res, status, message) => res.status(status).json({ message }); const id = (value) => new ObjectId(value);
const publicUser = (user) => ({ id: user._id.toString(), name: user.full_name, email: user.email, phone: user.phone || '', role: user.is_admin ? 'admin' : 'user', createdAt: user.created_at });
function auth(req, res, next) { const token = req.headers.authorization?.replace(/^Bearer\s+/i, ''); if (!token) return fail(res, 401, 'Please sign in to continue.'); try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); } catch { return fail(res, 401, 'Your session is invalid or expired. Please sign in again.'); } }
function admin(req, res, next) { if (!req.user.is_admin) return fail(res, 403, 'Administrator access is required.'); next(); }
function adminOrLocal(req, res, next) {
    const remoteIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '';
    const isLocal = remoteIp.includes('127.0.0.1') || remoteIp.includes('::1') || req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
            if (req.user?.is_admin) return next();
        } catch {
            // Token invalid or expired, continue to check isLocal
        }
    }
    if (isLocal) {
        req.user = { is_admin: true, id: 'local_admin', role: 'admin' };
        return next();
    }
    return fail(res, 401, 'Administrator access or local loopback connection is required.');
}

function saveBase64ToImageFile(dataUrl, req) {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
        return dataUrl;
    }
    try {
        const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) return dataUrl;
        
        let ext = matches[1].toLowerCase();
        if (ext === 'jpeg') ext = 'jpg';
        if (ext === 'svg+xml') ext = 'svg';
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `${crypto.randomUUID()}.${ext}`;
        const targetPath = path.join(imagesDir, filename);
        fs.writeFileSync(targetPath, buffer);

        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
        const host = req.get('host') || `localhost:${port}`;
        const publicUrl = `${protocol}://${host}/uploads/images/${filename}`;
        console.log(`✅ Base64 image saved to disk: ${publicUrl} (${Math.round(buffer.length / 1024)} KB)`);
        return publicUrl;
    } catch (err) {
        console.error('Error saving base64 to image file:', err);
        return dataUrl;
    }
}
async function actualUser(req) { return database.collection('users').findOne({ _id: id(req.user.id) }); }
const mapOrder = async (order) => {
  const [user, address, items, images, history] = await Promise.all([
    database.collection('users').findOne({ _id: order.user_id }), database.collection('addresses').findOne({ _id: order.address_id }),
    database.collection('order_items').find({ order_id: order._id }).toArray(), database.collection('order_images').find({ order_id: order._id }).toArray(),
    database.collection('order_status_history').find({ order_id: order._id }).sort({ created_at: -1 }).toArray()
  ]);
  
  // Use stored customer details from order, fallback to user table
  return { 
    id: order._id.toString(), 
    customerId: order.user_id.toString(), 
    customerName: order.customer_name || user?.full_name,  // Prioritize order's stored name
    email: order.customer_email || user?.email,            // Prioritize order's stored email
    phone: order.customer_phone || user?.phone,            // Prioritize order's stored phone
    address: address && { street: [address.address_line_1, address.address_line_2].filter(Boolean).join(', '), city: address.city, state: address.state, pincode: address.postal_code, country: address.country },
    totalAmount: order.total_amount, status: order.order_status, createdAt: order.created_at, updatedAt: order.updated_at, paymentMethod: order.payment_method,
    statusHistory: history.map((entry) => ({ ...entry, id: entry._id.toString() })),
    items: items.map((item) => ({ id: item._id.toString(), productId: item.product_id?.toString(), productName: item.product_name, price: item.price, quantity: item.quantity, selectedOptions: item.customization || {}, customText: item.custom_text })),
    images: images.map((image) => ({ id: image._id.toString(), original_file_name: image.original_file_name, file_size: image.file_size, mime_type: image.mime_type, created_at: image.created_at }))
  };
};

app.get('/api/health', (_req, res) => {
  console.log('🏥 Health check requested');
  res.json({ ok: true, database: 'connected' });
});
app.post('/api/auth/register', async (req, res) => { 
  const { name, email, phone, password } = req.body; 
  console.log('📝 Registration attempt:', { email, phone });
  
  if (!name || !email || !password) return fail(res, 400, 'Name, email, and password are required.'); 
  if (password.length < 6) return fail(res, 400, 'Password must have at least 6 characters.'); 
  
  const normalized = email.trim().toLowerCase(); 
  const userPhone = phone ? phone.trim() : '';
  const query = userPhone ? { $or: [{ email: normalized }, { phone: userPhone }] } : { email: normalized };

  if (await database.collection('users').findOne(query)) {
    console.log('❌ Registration failed: Email or phone already exists');
    return fail(res, 409, 'An account with this email or phone already exists.');
  }
  
  const user = { full_name: name.trim(), email: normalized, phone: userPhone, password_hash: await bcrypt.hash(password, 12), is_admin: false, created_at: new Date(), updated_at: new Date() }; 
  const result = await database.collection('users').insertOne(user); 
  user._id = result.insertedId; 
  const token = jwt.sign({ id: user._id.toString(), is_admin: false }, process.env.JWT_SECRET, { expiresIn: '365d' }); 
  
  console.log('✅ Registration successful:', user.email);
  res.status(201).json({ token, user: publicUser(user) }); 
});
app.post('/api/auth/login', async (req, res) => { 
  try {
    const origin = req.headers.origin || 'no-origin';
    const userAgent = req.headers['user-agent'] || 'unknown';
    console.log('🔐 Login attempt from:', origin);
    console.log('   User-Agent:', userAgent.substring(0, 100));
    
    const rawInput = (req.body.email || '').trim();
    const normalizedEmail = rawInput.toLowerCase();
    const phoneDigits = rawInput.replace(/\D/g, '');

    const user = await database.collection('users').findOne({
      $or: [
        { email: normalizedEmail },
        { email: new RegExp('^' + normalizedEmail.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '$', 'i') },
        ...(phoneDigits ? [{ phone: phoneDigits }, { phone: rawInput }, { phone: rawInput.replace(/^0+/, '') }] : [])
      ]
    });
    
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password_hash))) {
      console.log('❌ Login failed: Invalid credentials for', rawInput);
      return fail(res, 401, 'Invalid email/phone or password.');
    }
    
    const token = jwt.sign({ id: user._id.toString(), is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '365d' }); 
    console.log('✅ Login successful:', user.email, `(${user.is_admin ? 'admin' : 'user'})`);
    res.json({ token, user: publicUser(user) }); 
  } catch (error) {
    console.error('💥 Login error:', error);
    return fail(res, 500, 'An error occurred during login. Please try again.');
  }
});
app.get('/api/products', async (_req, res) => { const products = await database.collection('products').find({ is_active: { $ne: false } }).sort({ created_at: -1 }).toArray(); res.json({ products: products.map((p) => ({ ...p, id: p._id.toString(), _id: undefined, image: p.image_url, createdAt: p.created_at })) }); });
const productDto = (product) => ({ ...product, id: product._id.toString(), _id: undefined, image: product.image || product.image_url || '', image_url: product.image || product.image_url || '', price: Number(product.salePrice ?? product.price ?? 0), createdAt: product.created_at, updatedAt: product.updated_at });

async function processProductPayload(body, req) {
    const rawMain = body.image || body.image_url || '';
    let mainImageUrl = rawMain;

    // Convert any Base64 main image to Cloudflare R2 (or local fallback)
    if (rawMain && typeof rawMain === 'string' && rawMain.startsWith('data:image/')) {
        if (hasR2Config()) {
            const res = await uploadBase64ToR2({
                dataUrl: rawMain,
                folder: R2_FOLDERS.PRODUCTS,
                isPublic: true
            });
            mainImageUrl = res.url;
        } else {
            mainImageUrl = saveBase64ToImageFile(rawMain, req);
        }
    }

    // Convert any Base64 gallery images to Cloudflare R2 (or local fallback)
    let cleanGallery = [];
    if (Array.isArray(body.galleryImages)) {
        for (const item of body.galleryImages) {
            if (typeof item === 'string' && item.startsWith('data:image/')) {
                if (hasR2Config()) {
                    const res = await uploadBase64ToR2({
                        dataUrl: item,
                        folder: R2_FOLDERS.PRODUCTS,
                        isPublic: true
                    });
                    cleanGallery.push(res.url);
                } else {
                    cleanGallery.push(saveBase64ToImageFile(item, req));
                }
            } else if (item && typeof item === 'string') {
                cleanGallery.push(item);
            }
        }
    }

    return {
        ...body,
        name: body.name?.trim(),
        price: Number(body.salePrice ?? body.price),
        regularPrice: Number(body.regularPrice ?? body.salePrice ?? body.price),
        salePrice: Number(body.salePrice ?? body.price),
        stock: Number(body.stock ?? 0),
        image: mainImageUrl,
        image_url: mainImageUrl,
        galleryImages: cleanGallery,
        is_active: body.status !== 'disabled',
        status: body.status === 'disabled' ? 'disabled' : 'active',
        updated_at: new Date()
    };
}

app.get('/api/admin/products', auth, admin, async (_req, res) => { const products = await database.collection('products').find({}).sort({ created_at: -1 }).toArray(); res.json({ products: products.map(productDto) }); });

app.post('/api/admin/products', auth, admin, async (req, res) => { 
    try {
        const product = await processProductPayload(req.body, req); 
        if (!product.name || !Number.isFinite(product.price) || product.price < 0) {
            return fail(res, 400, 'Product name and a valid sale price are required.');
        }
        product.created_at = new Date(); 
        const result = await database.collection('products').insertOne(product); 
        product._id = result.insertedId; 
        res.status(201).json({ product: productDto(product) });
    } catch (err) {
        console.error('Failed to create product:', err);
        return fail(res, 500, 'Failed to create product: ' + err.message);
    }
});

app.patch('/api/admin/products/:productId', auth, admin, async (req, res) => { 
    if (!ObjectId.isValid(req.params.productId)) return fail(res, 400, 'Invalid product.'); 
    try {
        const existing = await database.collection('products').findOne({ _id: id(req.params.productId) });
        if (!existing) return fail(res, 404, 'Product not found.');

        const product = await processProductPayload(req.body, req); 
        delete product.created_at; 

        // Cleanup replaced R2 images to avoid orphaned files
        if (hasR2Config()) {
            const oldImages = [existing.image, existing.image_url, ...(existing.galleryImages || [])].filter(Boolean);
            const newImages = [product.image, product.image_url, ...(product.galleryImages || [])].filter(Boolean);
            const replaced = oldImages.filter(oldUrl => !newImages.includes(oldUrl));
            for (const oldUrl of replaced) {
                await deleteR2Object(oldUrl);
            }
        }

        const result = await database.collection('products').findOneAndUpdate({ _id: id(req.params.productId) }, { $set: product }, { returnDocument: 'after' }); 
        res.json({ product: productDto(result) });
    } catch (err) {
        console.error('Failed to update product:', err);
        return fail(res, 500, 'Failed to update product: ' + err.message);
    }
});

app.delete('/api/admin/products/:productId', auth, admin, async (req, res) => { 
    if (!ObjectId.isValid(req.params.productId)) return fail(res, 400, 'Invalid product.'); 
    try {
        const product = await database.collection('products').findOne({ _id: id(req.params.productId) });
        if (product) {
            // Delete R2 images associated with product to prevent orphaned storage
            if (hasR2Config()) {
                const imagesToDelete = [product.image, product.image_url, ...(product.galleryImages || [])].filter(Boolean);
                for (const imgUrl of imagesToDelete) {
                    await deleteR2Object(imgUrl);
                }
            }
            await database.collection('products').deleteOne({ _id: id(req.params.productId) }); 
        }
        res.status(204).end();
    } catch (err) {
        console.error('Failed to delete product:', err);
        return fail(res, 500, 'Failed to delete product: ' + err.message);
    }
});
app.get('/api/me', auth, async (req, res) => { const user = await actualUser(req); if (!user) return fail(res, 401, 'Account not found.'); res.json({ user: publicUser(user) }); });
app.put('/api/me', auth, async (req, res) => { const fields = { updated_at: new Date() }; if (req.body.full_name) fields.full_name = req.body.full_name; if (req.body.phone) fields.phone = req.body.phone; await database.collection('users').updateOne({ _id: id(req.user.id) }, { $set: fields }); res.json({ ok: true }); });
app.get('/api/addresses', auth, async (req, res) => { const addresses = await database.collection('addresses').find({ user_id: id(req.user.id) }).sort({ created_at: -1 }).toArray(); res.json({ addresses }); });
app.get('/api/orders', auth, async (req, res) => { const orders = await database.collection('orders').find({ user_id: id(req.user.id) }).sort({ created_at: -1 }).toArray(); res.json({ orders: await Promise.all(orders.map(mapOrder)) }); });
app.post('/api/orders', auth, upload.any(), async (req, res) => { 
    let input; 
    try { 
        input = JSON.parse(req.body.order); 
    } catch { 
        return fail(res, 400, 'Invalid order data.'); 
    } 
    
    if (!input.address?.street || !input.address?.city || !input.items?.length) {
        return fail(res, 400, 'A shipping address and at least one item are required.'); 
    }
    
    const userId = id(req.user.id); 
    const now = new Date(); 
    
    // Check if address already exists for this user (reuse existing address)
    // Match on user_id AND complete address details to ensure uniqueness
    let existingAddress = await database.collection('addresses').findOne({
        user_id: userId,
        address_line_1: input.address.street.trim(),
        city: input.address.city.trim(),
        postal_code: input.address.pincode.trim()
    });
    
    let addressId;
    if (existingAddress) {
        // Reuse existing address - update it with latest info
        await database.collection('addresses').updateOne(
            { _id: existingAddress._id },
            { 
                $set: { 
                    full_name: input.customerName,
                    phone: input.phone,
                    address_line_2: input.address.landmark || '',
                    state: input.address.state,
                    country: input.address.country || 'India',
                    updated_at: now
                }
            }
        );
        addressId = existingAddress._id;
        console.log(`♻️ Reusing existing address ${addressId} for user ${userId}`);
    } else {
        // Create new address only if it doesn't exist
        const address = { 
            user_id: userId, 
            full_name: input.customerName, 
            phone: input.phone, 
            address_line_1: input.address.street.trim(), 
            address_line_2: input.address.landmark || '', 
            city: input.address.city.trim(), 
            state: input.address.state, 
            postal_code: input.address.pincode.trim(), 
            country: input.address.country || 'India', 
            created_at: now, 
            updated_at: now 
        }; 
        const addressResult = await database.collection('addresses').insertOne(address);
        addressId = addressResult.insertedId;
        console.log(`✨ Created new address ${addressId} for user ${userId}`);
    } 
    
    // Create order
    const order = { 
        user_id: userId, 
        customer_name: input.customerName,  // Store customer name directly
        customer_email: input.email,         // Store email directly  
        customer_phone: input.phone,         // Store phone directly
        address_id: addressId, 
        total_amount: Number(input.totalAmount), 
        order_status: 'Pending', 
        payment_method: input.paymentMethod, 
        payment_metadata: {}, 
        created_at: now, 
        updated_at: now 
    }; 
    const orderResult = await database.collection('orders').insertOne(order); 
    order._id = orderResult.insertedId; 
    
    // Create order items (with price validation for security)
    const itemRows = await Promise.all(input.items.map(async (item) => {
        // Optional: Validate product exists and pricing mode
        if (ObjectId.isValid(item.productId)) {
            try {
                const product = await database.collection('products').findOne({ _id: id(item.productId) });
                if (product) {
                    console.log(`✓ Order item validated: ${product.name} (pricingMode: ${product.pricingMode || 'simple'})`);
                    // Future enhancement: Recalculate price based on product.pricingMode and selectedOptions
                    // For now, log a warning if prices seem suspicious
                    if (product.pricingMode === 'variant' && item.price < 50) {
                        console.warn(`⚠️ Variant product with suspiciously low price: ${item.price}`);
                    }
                }
            } catch (err) {
                console.warn('Product validation skipped:', err.message);
            }
        }
        
        return { 
            order_id: order._id, 
            product_id: ObjectId.isValid(item.productId) ? id(item.productId) : null, 
            product_name: item.productName, 
            quantity: Number(item.quantity), 
            price: Number(item.price), 
            customization: item.selectedOptions || {}, 
            custom_text: item.customText || '', 
            created_at: now 
        };
    })); 
    const inserted = await database.collection('order_items').insertMany(itemRows); 
    const savedItems = itemRows.map((item, index) => ({ ...item, _id: inserted.insertedIds[index] })); 
    
    // Handle image uploads
    if (req.files && req.files.length > 0) {
        if (hasR2Config()) {
            // Upload to Cloudflare R2 storage in customer-uploads/orders/<orderId>/
            const keys = []; 
            try { 
                for (const file of req.files) { 
                    const item = savedItems[Number(file.fieldname.replace('image_', ''))]; 
                    if (!item) continue; 
                    const ext = file.mimetype === 'image/jpeg' ? 'jpg' : (file.mimetype?.split('/')[1] || 'jpg'); 
                    const safeExt = ext.replace(/[^a-z0-9]/gi, '') || 'jpg';
                    const key = `${R2_FOLDERS.CUSTOMER_UPLOADS}/orders/${order._id}/${crypto.randomUUID()}.${safeExt}`; 
                    await uploadBufferToR2({
                        buffer: file.buffer,
                        key,
                        contentType: file.mimetype,
                        isPublic: false
                    });
                    keys.push(key); 
                    await database.collection('order_images').insertOne({ 
                        order_id: order._id, 
                        order_item_id: item._id, 
                        user_id: userId, 
                        r2_object_key: key, 
                        original_file_name: file.originalname, 
                        file_size: file.size, 
                        mime_type: file.mimetype, 
                        created_at: now 
                    }); 
                } 
            } catch (uploadError) { 
                console.error('Image upload to R2 failed:', uploadError);
                // Clean up uploaded files in R2
                await Promise.all(keys.map((k) => deleteR2Object(k).catch(() => null))); 
                // Clean up order
                await database.collection('orders').deleteOne({ _id: order._id }); 
                await database.collection('order_items').deleteMany({ order_id: order._id }); 
                return fail(res, 502, 'Photo upload failed; no order was placed. Please try again.'); 
            }
        } else {
            // Temporary fallback when R2 is not configured
            console.log('R2 not configured, storing images in MongoDB');
            for (const file of req.files) {
                const item = savedItems[Number(file.fieldname.replace('image_', ''))];
                if (!item) continue;
                await database.collection('order_images').insertOne({
                    order_id: order._id,
                    order_item_id: item._id,
                    user_id: userId,
                    image_data: file.buffer.toString('base64'),
                    original_file_name: file.originalname,
                    file_size: file.size,
                    mime_type: file.mimetype,
                    created_at: now
                });
            }
        }
    }
    
    // Create initial status history
    await database.collection('order_status_history').insertOne({ 
        order_id: order._id, 
        status: 'Pending', 
        changed_by: userId, 
        created_at: now 
    }); 
    
    console.log(`✅ Order ${order._id.toString()} created successfully`);
    
    // Return full mapped order for immediate reflection
    const fullOrder = await mapOrder(order);
    res.status(201).json({ order: fullOrder }); 
});
app.get('/api/admin/authorize', auth, admin, async (req, res) => { const user = await actualUser(req); res.json({ user: publicUser(user) }); });
app.get('/api/admin/orders', auth, admin, async (_req, res) => { const orders = await database.collection('orders').find({}).sort({ created_at: -1 }).toArray(); res.json({ orders: await Promise.all(orders.map(mapOrder)) }); });
app.patch('/api/admin/orders/:orderId/status', auth, admin, async (req, res) => { if (!statuses.includes(req.body.status)) return fail(res, 400, 'Invalid order status.'); const orderId = id(req.params.orderId); await database.collection('orders').updateOne({ _id: orderId }, { $set: { order_status: req.body.status, updated_at: new Date() } }); await database.collection('order_status_history').insertOne({ order_id: orderId, status: req.body.status, changed_by: id(req.user.id), created_at: new Date() }); res.json({ ok: true }); });
app.delete('/api/admin/orders/:orderId', auth, admin, async (req, res) => { 
    try {
        if (!ObjectId.isValid(req.params.orderId)) {
            return fail(res, 400, 'Invalid order ID');
        }
        
        const orderId = id(req.params.orderId); 
        
        // Delete order and all related data
        await database.collection('order_status_history').deleteMany({ order_id: orderId });
        await database.collection('order_images').deleteMany({ order_id: orderId });
        await database.collection('order_items').deleteMany({ order_id: orderId });
        const orderResult = await database.collection('orders').deleteOne({ _id: orderId });
        
        if (orderResult.deletedCount === 0) {
            return fail(res, 404, 'Order not found');
        }
        
        console.log(`✅ Deleted order ${req.params.orderId} and all related data`);
        res.status(204).end(); 
    } catch (error) {
        console.error('Delete order error:', error);
        return fail(res, 500, 'Failed to delete order');
    }
});
app.get('/api/admin/customers', auth, admin, async (_req, res) => { const users = await database.collection('users').find({ is_admin: { $ne: true } }).sort({ created_at: -1 }).toArray(); const customers = await Promise.all(users.map(async (user) => ({ ...publicUser(user), addresses: (await database.collection('addresses').find({ user_id: user._id }).toArray()).map((a) => ({ street: a.address_line_1, city: a.city, state: a.state, pincode: a.postal_code, country: a.country })) }))); res.json({ customers }); });
app.delete('/api/admin/addresses/cleanup', auth, admin, async (_req, res) => {
    try {
        const result = await database.collection('addresses').deleteMany({});
        console.log(`🗑️ Deleted ${result.deletedCount} addresses from database`);
        res.json({ deleted: result.deletedCount, message: 'All addresses deleted successfully' });
    } catch (error) {
        console.error('Error deleting addresses:', error);
        return fail(res, 500, 'Failed to delete addresses');
    }
});
app.get('/api/admin/images/:imageId/url', auth, admin, async (req, res) => { 
    try {
        if (!ObjectId.isValid(req.params.imageId)) {
            return fail(res, 400, 'Invalid image ID');
        }
        
        const image = await database.collection('order_images').findOne({ _id: id(req.params.imageId) }); 
        if (!image) return fail(res, 404, 'Image not found.'); 
        
        // Check if image is stored in R2 or MongoDB
        if (image.r2_object_key) {
            // R2 storage - generate secure temporary signed URL (private customer asset)
            try {
                const signed = await getSignedDownloadUrl(image.r2_object_key, image.original_file_name, 300);
                res.json({ url: signed.url, expiresIn: 300 });
            } catch (error) {
                console.error('R2 signed URL error:', error);
                return fail(res, 502, 'Failed to generate download URL');
            }
        } else if (image.image_data) {
            // Legacy MongoDB storage - return base64 data URL
            const dataUrl = `data:${image.mime_type};base64,${image.image_data}`;
            res.json({ url: dataUrl, expiresIn: null, format: 'base64' });
        } else {
            return fail(res, 404, 'Image data not found');
        }
    } catch (error) {
        console.error('Get image URL error:', error);
        return fail(res, 500, 'Failed to retrieve image');
    }
});

// Presigned Direct Upload URL endpoint (for Vercel & large file browser-to-R2 uploads)
app.post('/api/admin/uploads/presigned-url', adminOrLocal, async (req, res) => {
    try {
        if (!hasR2Config()) {
            return fail(res, 503, 'Cloudflare R2 is not configured.');
        }
        const { folder = R2_FOLDERS.PRODUCTS, originalName = 'upload.jpg', contentType = 'image/jpeg' } = req.body || {};
        const safeFolder = Object.values(R2_FOLDERS).includes(folder) ? folder : R2_FOLDERS.PRODUCTS;
        const result = await getPresignedUploadUrl({
            folder: safeFolder,
            originalName,
            contentType,
            expiresIn: 600
        });
        res.json(result);
    } catch (err) {
        console.error('Presigned upload URL generation error:', err);
        return fail(res, 500, 'Failed to generate upload URL: ' + err.message);
    }
});

// Admin Media Upload endpoint (for products, videos, posters, logos, & banners)
app.post('/api/admin/media/upload', adminOrLocal, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return fail(res, 400, 'No file was uploaded.');
        }
        const file = req.file;
        const isVideo = file.mimetype?.startsWith('video/');
        const reqFolder = (req.body?.folder || req.query?.folder || '').toLowerCase().trim();
        
        let targetFolder = reqFolder || (isVideo ? 'videos' : R2_FOLDERS.PRODUCTS);
        if (!Object.values(R2_FOLDERS).includes(targetFolder) && targetFolder !== 'videos' && targetFolder !== 'media') {
            targetFolder = isVideo ? 'videos' : R2_FOLDERS.PRODUCTS;
        }

        const rawExt = file.originalname?.split('.').pop() || '';
        const ext = rawExt ? rawExt.toLowerCase() : (isVideo ? 'mp4' : 'jpg');
        const filename = `${crypto.randomUUID()}.${ext}`;

        if (hasR2Config()) {
            const key = `${targetFolder}/${filename}`;
            const result = await uploadBufferToR2({
                buffer: file.buffer,
                key,
                contentType: file.mimetype,
                isPublic: targetFolder !== R2_FOLDERS.CUSTOMER_UPLOADS
            });
            return res.json({ 
                url: result.url || result.key, 
                key: result.key, 
                filename: file.originalname, 
                mimetype: file.mimetype, 
                size: file.size, 
                isRemote: true 
            });
        } else {
            // Save directly to backend/uploads directory on disk and serve via streaming HTTP
            const targetSubdir = isVideo ? videosDir : imagesDir;
            const targetPath = path.join(targetSubdir, filename);
            fs.writeFileSync(targetPath, file.buffer);

            const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
            const host = req.get('host') || `localhost:${port}`;
            const subfolder = isVideo ? 'videos' : 'images';
            const publicUrl = `${protocol}://${host}/uploads/${subfolder}/${filename}`;
            console.log(`✅ Media saved successfully: ${publicUrl} (${Math.round(file.size / 1024)} KB)`);
            return res.json({ url: publicUrl, filename: file.originalname, mimetype: file.mimetype, size: file.size, isRemote: false });
        }
    } catch (err) {
        console.error('Media upload error:', err);
        return fail(res, 500, 'Failed to process media upload: ' + err.message);
    }
});

app.post('/api/admin/media/upload-base64', adminOrLocal, async (req, res) => {
    try {
        const { dataUrl, base64, folder = R2_FOLDERS.WEBSITE_ASSETS } = req.body || {};
        const imgData = dataUrl || base64;
        if (!imgData) return fail(res, 400, 'No base64 image data provided.');

        if (hasR2Config()) {
            const safeFolder = Object.values(R2_FOLDERS).includes(folder) ? folder : R2_FOLDERS.WEBSITE_ASSETS;
            const result = await uploadBase64ToR2({
                dataUrl: imgData,
                folder: safeFolder,
                isPublic: true
            });
            return res.json({ url: result.url, key: result.key, isRemote: true });
        } else {
            const publicUrl = saveBase64ToImageFile(imgData, req);
            res.json({ url: publicUrl, isRemote: false });
        }
    } catch (err) {
        return fail(res, 500, 'Failed to convert base64 image: ' + err.message);
    }
});

// Video Samples API (MongoDB Cloud Persistence with Fallback)
app.get('/api/videos', async (_req, res) => {
    try {
        const videos = await database.collection('video_samples').find({}).sort({ created_at: -1 }).toArray();
        res.json({ videos: videos.map(v => ({ ...v, id: v._id.toString() })) });
    } catch {
        res.json({ videos: [] });
    }
});

app.post('/api/admin/videos', adminOrLocal, async (req, res) => {
    try {
        const video = { ...req.body, created_at: new Date(), updated_at: new Date() };
        delete video.id;
        delete video._id;
        const result = await database.collection('video_samples').insertOne(video);
        res.status(201).json({ video: { ...video, id: result.insertedId.toString() } });
    } catch (err) {
        fail(res, 500, 'Failed to save video sample');
    }
});

app.patch('/api/admin/videos/:id', adminOrLocal, async (req, res) => {
    try {
        const { id: videoId, ...fields } = req.body;
        fields.updated_at = new Date();
        await database.collection('video_samples').updateOne({ _id: id(req.params.id) }, { $set: fields });
        res.json({ ok: true });
    } catch (err) {
        fail(res, 500, 'Failed to update video sample');
    }
});

app.delete('/api/admin/videos/:id', adminOrLocal, async (req, res) => {
    try {
        await database.collection('video_samples').deleteOne({ _id: id(req.params.id) });
        res.json({ ok: true });
    } catch (err) {
        fail(res, 500, 'Failed to delete video sample');
    }
});

// Design Samples API (MongoDB Cloud Persistence with Fallback)
app.get('/api/designs', async (_req, res) => {
    try {
        const designs = await database.collection('design_samples').find({}).sort({ created_at: -1 }).toArray();
        res.json({ designs: designs.map(d => ({ ...d, id: d._id.toString() })) });
    } catch {
        res.json({ designs: [] });
    }
});

app.post('/api/admin/designs', adminOrLocal, async (req, res) => {
    try {
        const design = { ...req.body, created_at: new Date(), updated_at: new Date() };
        delete design.id;
        delete design._id;
        const result = await database.collection('design_samples').insertOne(design);
        res.status(201).json({ design: { ...design, id: result.insertedId.toString() } });
    } catch (err) {
        fail(res, 500, 'Failed to save design sample');
    }
});

app.patch('/api/admin/designs/:id', adminOrLocal, async (req, res) => {
    try {
        const { id: designId, ...fields } = req.body;
        fields.updated_at = new Date();
        await database.collection('design_samples').updateOne({ _id: id(req.params.id) }, { $set: fields });
        res.json({ ok: true });
    } catch (err) {
        fail(res, 500, 'Failed to update design sample');
    }
});

app.delete('/api/admin/designs/:id', adminOrLocal, async (req, res) => {
    try {
        await database.collection('design_samples').deleteOne({ _id: id(req.params.id) });
        res.json({ ok: true });
    } catch (err) {
        fail(res, 500, 'Failed to delete design sample');
    }
});

// CMS Configuration Cloud Endpoints
app.get('/api/cms', async (_req, res) => {
    try {
        const cmsDoc = await database.collection('cms').findOne({ _id: 'studio_gift_shop_cms' });
        res.json({ cms: cmsDoc ? cmsDoc.data : null });
    } catch (err) {
        res.json({ cms: null });
    }
});

app.put('/api/cms', adminOrLocal, async (req, res) => {
    try {
        const data = req.body || {};
        // Automatically save any base64 images to static uploads files so DB stays lightweight
        for (const key of Object.keys(data)) {
            if (typeof data[key] === 'string' && data[key].startsWith('data:image/')) {
                data[key] = saveBase64ToImageFile(data[key], req);
            }
        }
        await database.collection('cms').updateOne(
            { _id: 'studio_gift_shop_cms' },
            { $set: { data, updated_at: new Date() } },
            { upsert: true }
        );
        res.json({ ok: true, data });
    } catch (err) {
        console.error('Failed to save CMS data:', err);
        return fail(res, 500, 'Failed to save CMS data.');
    }
});
app.use((error, _req, res, next) => { 
    void next; 
    console.error('Server error:', error);
    
    if (error?.type === 'entity.too.large') {
        return fail(res, 413, 'Product data is too large. Use a smaller image (maximum 10 MB).'); 
    }
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return fail(res, 400, `Image is too large. Maximum size is ${Math.round(maxUploadBytes / 1024 / 1024)} MB.`);
        }
        return fail(res, 400, `Image upload error: ${error.message}`); 
    }
    
    if (error.message === 'Only image files are allowed' || error.message === 'Only image and video files are allowed') {
        return fail(res, 400, 'Only image and video files are allowed.');
    }
    
    return fail(res, 500, error.message || 'Internal server error'); 
});
client.connect().then(async () => { 
  database = client.db(process.env.MONGODB_DB_NAME || 'raja_studio'); 
  await Promise.all(['users', 'addresses', 'products', 'orders', 'order_items', 'order_images', 'order_status_history'].map((name) => database.createCollection(name).catch(() => null))); 
  await Promise.all([
    database.collection('users').createIndex({ email: 1 }, { unique: true }), 
    database.collection('users').createIndex({ phone: 1 }, { unique: true }), 
    database.collection('orders').createIndex({ user_id: 1, created_at: -1 }), 
    database.collection('order_images').createIndex({ order_id: 1 })
  ]); 
  
  // Log CORS configuration
  console.log('🌐 CORS enabled for all origins');
  console.log('🚀 Raja Studio MongoDB API listening on port', port);
  
  // Bind to 0.0.0.0 to accept connections from any network interface (required for Render)
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server successfully bound to 0.0.0.0:${port}`);
  });
}).catch((error) => { 
  console.error('❌ MongoDB connection failed:', error.message); 
  process.exit(1); 
});
