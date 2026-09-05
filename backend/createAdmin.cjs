require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function run() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required.');
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || 'raja_studio');
  
  // Delete existing admin users
  await db.collection('users').deleteMany({ is_admin: true });
  
  const now = new Date();
  await db.collection('users').insertOne({
    full_name: 'Administrator',
    email: email.toLowerCase(),
    phone: '1234567890',
    password_hash: await bcrypt.hash(password, 12),
    is_admin: true,
    created_at: now,
    updated_at: now
  });
  
  await client.close();
  console.log('Admin account created in Atlas.');
}
run().catch((error) => { console.error('Admin setup failed:', error.message); process.exit(1); });
