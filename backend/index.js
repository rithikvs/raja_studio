import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
dotenv.config();

const app = express(); const port = Number(process.env.PORT || 8787); const maxUploadBytes = Number(process.env.MAX_UPLOAD_BYTES || 26214400);
const statuses = ['Pending', 'Confirmed', 'Photo Review', 'Printing', 'Ready', 'Shipped', 'Delivered', 'Cancelled'];
const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://invalid'); let database;
const r2 = new S3Client({ region: process.env.CLOUDFLARE_R2_REGION || 'auto', endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '', secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '' } });
app.use(cors({ 
  origin: process.env.CLIENT_ORIGIN?.split(',').map(origin => origin.trim()) || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Accept all image formats - jpg, jpeg, png, gif, bmp, webp, svg, heic, heif, etc.
const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { 
        fileSize: maxUploadBytes,
        fieldSize: 50 * 1024 * 1024, // 50MB for large base64 images
        fields: 50, // Max number of non-file fields
        files: 20 // Max number of file uploads
    }, 
    fileFilter: (_req, file, cb) => {
        // Accept if no mimetype specified OR if mimetype starts with 'image/'
        // This allows all common image formats
        if (!file.mimetype || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
const fail = (res, status, message) => res.status(status).json({ message }); const id = (value) => new ObjectId(value);
const publicUser = (user) => ({ id: user._id.toString(), name: user.full_name, email: user.email, phone: user.phone || '', role: user.is_admin ? 'admin' : 'user', createdAt: user.created_at });
function auth(req, res, next) { const token = req.headers.authorization?.replace(/^Bearer\s+/i, ''); if (!token) return fail(res, 401, 'Please sign in to continue.'); try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); } catch { return fail(res, 401, 'Your session is invalid or expired. Please sign in again.'); } }
function admin(req, res, next) { if (!req.user.is_admin) return fail(res, 403, 'Administrator access is required.'); next(); }
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

app.get('/api/health', (_req, res) => res.json({ ok: true, database: 'raja_studio' }));
app.post('/api/auth/register', async (req, res) => { const { name, email, phone, password } = req.body; if (!name || !email || !phone || !password) return fail(res, 400, 'Name, email, phone, and password are required.'); if (password.length < 8) return fail(res, 400, 'Password must have at least 8 characters.'); const normalized = email.trim().toLowerCase(); if (await database.collection('users').findOne({ $or: [{ email: normalized }, { phone }] })) return fail(res, 409, 'An account with this email or phone already exists.'); const user = { full_name: name.trim(), email: normalized, phone, password_hash: await bcrypt.hash(password, 12), is_admin: false, created_at: new Date(), updated_at: new Date() }; const result = await database.collection('users').insertOne(user); user._id = result.insertedId; const token = jwt.sign({ id: user._id.toString(), is_admin: false }, process.env.JWT_SECRET, { expiresIn: '365d' }); res.status(201).json({ token, user: publicUser(user) }); });
app.post('/api/auth/login', async (req, res) => { 
  try {
    console.log('Login attempt from:', req.headers.origin);
    const email = req.body.email?.trim().toLowerCase(); 
    const user = await database.collection('users').findOne({ $or: [{ email }, { phone: req.body.email }] }); 
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password_hash))) {
      console.log('Login failed: Invalid credentials for', email);
      return fail(res, 401, 'Invalid email/phone or password.');
    }
    const token = jwt.sign({ id: user._id.toString(), is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '365d' }); 
    console.log('Login successful for:', user.email);
    res.json({ token, user: publicUser(user) }); 
  } catch (error) {
    console.error('Login error:', error);
    return fail(res, 500, 'An error occurred during login. Please try again.');
  }
});
app.get('/api/products', async (_req, res) => { const products = await database.collection('products').find({ is_active: { $ne: false } }).sort({ created_at: -1 }).toArray(); res.json({ products: products.map((p) => ({ ...p, id: p._id.toString(), _id: undefined, image: p.image_url, createdAt: p.created_at })) }); });
const productDto = (product) => ({ ...product, id: product._id.toString(), _id: undefined, image: product.image || product.image_url || '', image_url: product.image || product.image_url || '', price: Number(product.salePrice ?? product.price ?? 0), createdAt: product.created_at, updatedAt: product.updated_at });
const productInput = (body) => ({ ...body, name: body.name?.trim(), price: Number(body.salePrice ?? body.price), regularPrice: Number(body.regularPrice ?? body.salePrice ?? body.price), salePrice: Number(body.salePrice ?? body.price), stock: Number(body.stock ?? 0), image_url: body.image || body.image_url || '', is_active: body.status !== 'disabled', status: body.status === 'disabled' ? 'disabled' : 'active', updated_at: new Date() });
app.get('/api/admin/products', auth, admin, async (_req, res) => { const products = await database.collection('products').find({}).sort({ created_at: -1 }).toArray(); res.json({ products: products.map(productDto) }); });
app.post('/api/admin/products', auth, admin, async (req, res) => { const product = productInput(req.body); if (!product.name || !Number.isFinite(product.price) || product.price < 0) return fail(res, 400, 'Product name and a valid sale price are required.'); product.created_at = new Date(); const result = await database.collection('products').insertOne(product); product._id = result.insertedId; res.status(201).json({ product: productDto(product) }); });
app.patch('/api/admin/products/:productId', auth, admin, async (req, res) => { if (!ObjectId.isValid(req.params.productId)) return fail(res, 400, 'Invalid product.'); const product = productInput(req.body); delete product.created_at; const result = await database.collection('products').findOneAndUpdate({ _id: id(req.params.productId) }, { $set: product }, { returnDocument: 'after' }); if (!result) return fail(res, 404, 'Product not found.'); res.json({ product: productDto(result) }); });
app.delete('/api/admin/products/:productId', auth, admin, async (req, res) => { if (!ObjectId.isValid(req.params.productId)) return fail(res, 400, 'Invalid product.'); await database.collection('products').deleteOne({ _id: id(req.params.productId) }); res.status(204).end(); });
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
    
    // Create order items
    const itemRows = input.items.map((item) => ({ 
        order_id: order._id, 
        product_id: ObjectId.isValid(item.productId) ? id(item.productId) : null, 
        product_name: item.productName, 
        quantity: Number(item.quantity), 
        price: Number(item.price), 
        customization: item.selectedOptions || {}, 
        custom_text: item.customText || '', 
        created_at: now 
    })); 
    const inserted = await database.collection('order_items').insertMany(itemRows); 
    const savedItems = itemRows.map((item, index) => ({ ...item, _id: inserted.insertedIds[index] })); 
    
    // Handle image uploads (only if R2 is configured AND files are present)
    const hasR2Config = process.env.CLOUDFLARE_ACCOUNT_ID && 
                       process.env.CLOUDFLARE_R2_ACCESS_KEY_ID && 
                       process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY && 
                       process.env.CLOUDFLARE_R2_BUCKET_NAME;
    
    if (req.files && req.files.length > 0) {
        if (hasR2Config) {
            // Upload to R2 storage
            const keys = []; 
            try { 
                for (const file of req.files) { 
                    const item = savedItems[Number(file.fieldname.replace('image_', ''))]; 
                    if (!item) continue; 
                    const ext = file.mimetype === 'image/jpeg' ? 'jpg' : (file.mimetype?.split('/')[1] || 'jpg'); 
                    const key = `customer/${userId}/orders/${order._id}/${crypto.randomUUID()}.${ext}`; 
                    await r2.send(new PutObjectCommand({ 
                        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME, 
                        Key: key, 
                        Body: file.buffer, 
                        ContentType: file.mimetype 
                    })); 
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
                // Clean up uploaded files
                await Promise.all(keys.map((Key) => r2.send(new DeleteObjectCommand({ 
                    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME, 
                    Key 
                })).catch(() => null))); 
                // Clean up order
                await database.collection('orders').deleteOne({ _id: order._id }); 
                await database.collection('order_items').deleteMany({ order_id: order._id }); 
                // Don't delete address - it might be reused
                return fail(res, 502, 'Photo upload failed; no order was placed. Please try again.'); 
            }
        } else {
            // Store images as base64 in MongoDB (fallback when R2 is not configured)
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
            // R2 storage - generate signed URL
            try {
                const url = await getSignedUrl(r2, new GetObjectCommand({ 
                    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME, 
                    Key: image.r2_object_key, 
                    ResponseContentDisposition: `attachment; filename="${image.original_file_name.replace(/[\r\n"]/g, '')}"` 
                }), { expiresIn: 300 }); 
                res.json({ url, expiresIn: 300 });
            } catch (error) {
                console.error('R2 signed URL error:', error);
                return fail(res, 502, 'Failed to generate download URL');
            }
        } else if (image.image_data) {
            // MongoDB storage - return base64 data URL
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
    
    if (error.message === 'Only image files are allowed') {
        return fail(res, 400, 'Only image files are allowed. Supported formats: JPG, PNG, GIF, WEBP, BMP, SVG, HEIC, HEIF');
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
  const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',').map(origin => origin.trim()) || ['http://localhost:5173', 'http://localhost:5174'];
  console.log('🌐 CORS enabled for origins:', allowedOrigins);
  console.log('🚀 Raja Studio MongoDB API listening on port', port);
  
  app.listen(port);
}).catch((error) => { 
  console.error('❌ MongoDB connection failed:', error.message); 
  process.exit(1); 
});
