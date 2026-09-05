# Deployment Guide - Raja Studio

This guide covers deploying the Raja Studio application with Frontend on Vercel and Backend on Render.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Cloudflare R2 bucket created (optional, for image storage)
- [ ] GitHub repository set up
- [ ] All environment variables documented
- [ ] Local testing completed successfully

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Ensure `frontend/package.json` has correct build script:
   ```json
   "scripts": {
     "build": "vite build"
   }
   ```

2. Test local build:
   ```bash
   cd frontend
   npm run build
   ```

### Step 2: Deploy to Vercel

1. **Via Vercel Dashboard**:
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your Git repository
   - Configure project:

2. **Build & Development Settings**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables** (Vercel Dashboard → Settings → Environment Variables):
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

4. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend

1. Ensure `backend/package.json` has start script:
   ```json
   "scripts": {
     "start": "node index.js"
   }
   ```

2. Verify port binding in `backend/index.js`:
   ```javascript
   const port = Number(process.env.PORT || 8787);
   app.listen(port, '0.0.0.0', () => {
     console.log(`✅ Raja Studio API running on port ${port}`);
   });
   ```

### Step 2: Deploy to Render

1. **Create New Web Service**:
   - Go to https://render.com
   - Click "New" → "Web Service"
   - Connect your Git repository

2. **Configure Service**:
   ```
   Name: raja-studio-backend
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables** (Add in Render Dashboard):
   ```
   PORT=10000
   NODE_ENV=production
   
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/raja_studio
   MONGODB_DB_NAME=raja_studio
   
   # JWT
   JWT_SECRET=your-super-secure-random-secret-key-min-32-characters
   
   # Cloudflare R2 (if using)
   CLOUDFLARE_ACCOUNT_ID=your-account-id
   CLOUDFLARE_R2_ACCESS_KEY_ID=your-r2-access-key
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-r2-secret-key
   CLOUDFLARE_R2_BUCKET_NAME=raja-studio-images
   CLOUDFLARE_R2_REGION=auto
   
   # Limits
   MAX_UPLOAD_BYTES=26214400
   
   # CORS (your Vercel frontend URL)
   CLIENT_ORIGIN=https://your-frontend.vercel.app
   ```

4. Click "Create Web Service"

### Step 3: Update CORS After First Deploy

Once backend is deployed, get the Render URL (e.g., `https://raja-studio-backend.onrender.com`)

Update `CLIENT_ORIGIN` in Render environment variables to include your frontend URL.

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create Cluster

1. Go to https://cloud.mongodb.com
2. Create new cluster (Free tier is sufficient for starting)
3. Choose region closest to your Render deployment

### Step 2: Configure Security

1. **Network Access**:
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add specific Render IP addresses

2. **Database User**:
   - Go to Database Access
   - Add New Database User
   - Set username and secure password
   - Give "Read and write to any database" permission

### Step 3: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Add to Render environment variables as `MONGODB_URI`

---

## 📦 Image Storage Setup (Cloudflare R2)

### Step 1: Create R2 Bucket

1. Go to Cloudflare Dashboard → R2
2. Create new bucket: `raja-studio-images`
3. Set bucket to allow public access (for product images)

### Step 2: Generate API Tokens

1. Go to R2 → Manage R2 API Tokens
2. Create API Token with permissions:
   - Object Read & Write
3. Save the Access Key ID and Secret Access Key

### Step 3: Configure CORS

Add CORS policy to your R2 bucket:
```json
[
  {
    "AllowedOrigins": [
      "https://your-frontend.vercel.app",
      "http://localhost:5173"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## 🔄 Post-Deployment Steps

### 1. Update Frontend API URL

After backend is deployed, update Vercel environment variable:
```
VITE_API_URL=https://your-backend.onrender.com
```

Then redeploy frontend in Vercel.

### 2. Create Admin Account

SSH into Render or run locally with production database:
```bash
cd backend
node createAdmin.cjs
```

Or manually create admin in MongoDB:
```javascript
{
  full_name: "Admin",
  email: "admin@rajastudio.com",
  phone: "1234567890",
  password_hash: "<bcrypt hash of your password>",
  is_admin: true,
  created_at: new Date(),
  updated_at: new Date()
}
```

### 3. Test Complete Flow

1. ✅ Open frontend URL
2. ✅ Browse products (should be empty initially)
3. ✅ Login as admin (`/admin/login`)
4. ✅ Create category
5. ✅ Create product with image
6. ✅ Product appears on shop page
7. ✅ Register as customer
8. ✅ Customize product and upload photo
9. ✅ Add to cart
10. ✅ Checkout and create order
11. ✅ Admin can view order with customer photo
12. ✅ Update order status
13. ✅ Customer sees updated status

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

**Problem**: "Unable to reach the Raja Studio server"

**Solutions**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Verify backend is running (visit backend URL in browser)
3. Check backend logs in Render for errors
4. Verify CORS configuration in backend

### Database Connection Failed

**Problem**: "MongoServerError: Authentication failed"

**Solutions**:
1. Verify `MONGODB_URI` is correct in Render
2. Check database user has correct permissions
3. Ensure IP whitelist includes `0.0.0.0/0`
4. Test connection string locally

### Image Upload Not Working

**Problem**: Images not uploading or displaying

**Solutions**:
1. Verify all Cloudflare R2 credentials in Render
2. Check R2 bucket CORS configuration
3. Ensure bucket name matches environment variable
4. Check backend logs for S3/R2 errors

### CORS Errors in Browser

**Problem**: "Access-Control-Allow-Origin" error

**Solutions**:
1. Update `CLIENT_ORIGIN` in Render to include your Vercel URL
2. Ensure no trailing slashes in URLs
3. Restart backend service after environment changes
4. Check browser console for exact error

### Build Failures

**Frontend Build Fails**:
1. Check for syntax errors in React components
2. Verify all imports are correct
3. Check Vercel build logs for specific errors

**Backend Won't Start**:
1. Check Render logs for error messages
2. Verify all required environment variables are set
3. Test start command locally: `npm start`

---

## 📊 Monitoring

### Vercel Monitoring
- Dashboard → Your Project → Analytics
- Monitor page views, performance, errors

### Render Monitoring
- Dashboard → Your Service → Metrics
- Monitor CPU, memory, response times
- Check logs for errors

### MongoDB Atlas Monitoring
- Dashboard → Metrics
- Monitor database performance
- Set up alerts for high usage

---

## 🔒 Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files
   - Use strong, unique passwords
   - Rotate JWT_SECRET periodically

2. **Database**:
   - Use strong database passwords
   - Enable MongoDB authentication
   - Regular backups

3. **API Security**:
   - Keep dependencies updated
   - Monitor for security vulnerabilities
   - Use HTTPS only in production

4. **User Data**:
   - Hash passwords with bcrypt
   - Sanitize user inputs
   - Implement rate limiting

---

## 📈 Scaling Considerations

### When to Scale

**Frontend (Vercel)**:
- Automatically scales with traffic
- Consider upgrading plan for:
  - Custom domains
  - Higher bandwidth
  - Team collaboration

**Backend (Render)**:
- Free tier: Limited hours, sleeps after inactivity
- Starter tier ($7/mo): Always on, better performance
- Consider upgrading when:
  - Response times increase
  - CPU/memory usage high
  - Need zero downtime

**Database (MongoDB Atlas)**:
- Free tier: 512MB storage
- Upgrade when:
  - Storage > 400MB
  - Need backups
  - Need analytics

---

## ✅ Launch Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] Admin account created and tested
- [ ] Sample products added
- [ ] Complete order flow tested
- [ ] Image uploads working
- [ ] Payment integration configured (if applicable)
- [ ] Email notifications set up (if applicable)
- [ ] Custom domain configured
- [ ] SSL certificates active
- [ ] Analytics/monitoring enabled
- [ ] Error tracking set up (optional: Sentry)
- [ ] Backup strategy in place
- [ ] Documentation updated

---

## 🆘 Support Resources

- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **Cloudflare R2**: https://developers.cloudflare.com/r2/

---

**Ready to Deploy?** Follow the steps above carefully, and your Raja Studio will be live! 🚀
