# 🚀 Render Backend Deployment Guide

## Current Production Setup

**Backend URL**: https://raja-studio.onrender.com  
**Database**: MongoDB Atlas  
**Image Storage**: Cloudflare R2  
**New Frontend Domain**: https://raja-studio-gmys.vercel.app

---

## ⚠️ CRITICAL: Update Required for Mobile Login Fix

Your backend CORS must be updated to allow the new Vercel domain.

---

## 🔧 Required Environment Variables on Render

Go to: **https://dashboard.render.com** → Your Backend Service → **Environment** tab

### 1. DATABASE CONFIGURATION

```
MONGODB_URI=mongodb+srv://rithik:rithik2111@cluster0.dy1cheo.mongodb.net/raja_studio?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=raja_studio
```

### 2. AUTHENTICATION

```
JWT_SECRET=your-secure-random-secret-here
ADMIN_EMAIL=admin@123
ADMIN_PASSWORD=1234
```

⚠️ **IMPORTANT**: Change `JWT_SECRET` to a long random string in production!

### 3. CORS CONFIGURATION (CRITICAL FOR MOBILE LOGIN)

```
CLIENT_ORIGIN=http://localhost:5173,https://raja-studio-gmys.vercel.app,https://rajastudio-rosy.vercel.app
```

**Explanation**:
- `http://localhost:5173` - Local development
- `https://raja-studio-gmys.vercel.app` - **NEW production domain** (required!)
- `https://rajastudio-rosy.vercel.app` - Old domain (optional, can remove later)

⚠️ **NO SPACES after commas!**  
⚠️ **Use HTTPS for production domains!**  
⚠️ **No trailing slashes!**

### 4. CLOUDFLARE R2 STORAGE (Image Uploads)

```
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_REGION=auto
```

⚠️ If R2 is not configured, images will be stored in MongoDB as base64 (fallback).

### 5. SERVER CONFIGURATION

```
PORT=8787
MAX_UPLOAD_BYTES=26214400
```

**Note**: `PORT` is automatically set by Render, but defaults to 8787 locally.

---

## 📋 Complete Environment Variables Checklist

Copy this to your Render dashboard:

```bash
# Database
MONGODB_URI=mongodb+srv://rithik:rithik2111@cluster0.dy1cheo.mongodb.net/raja_studio?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=raja_studio

# Authentication
JWT_SECRET=replace_this_with_a_long_random_secret_before_deploying
ADMIN_EMAIL=admin@123
ADMIN_PASSWORD=1234

# CORS - MUST include new Vercel domain
CLIENT_ORIGIN=http://localhost:5173,https://raja-studio-gmys.vercel.app,https://rajastudio-rosy.vercel.app

# Cloudflare R2 Storage
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_REGION=auto

# Server
PORT=8787
MAX_UPLOAD_BYTES=26214400
```

---

## 🔄 How to Update Environment Variables

### Method 1: Using Render Dashboard

1. Go to https://dashboard.render.com
2. Click on your backend service
3. Click **"Environment"** in the left sidebar
4. For each variable:
   - If it exists: Click **Edit** → Update value → **Save**
   - If it doesn't exist: Click **Add Environment Variable** → Enter key and value
5. After saving, Render will automatically redeploy (2-3 minutes)

### Method 2: Using Render CLI

```bash
render env set CLIENT_ORIGIN="http://localhost:5173,https://raja-studio-gmys.vercel.app"
```

---

## ✅ Verification After Deployment

### 1. Check Deployment Logs

In Render dashboard → **Logs** tab, look for:

```
🌐 CORS enabled for origins: [ 'http://localhost:5173', 'https://raja-studio-gmys.vercel.app', 'https://rajastudio-rosy.vercel.app' ]
✅ Server successfully bound to 0.0.0.0:8787
🚀 Raja Studio MongoDB API listening on port 8787
```

If you see your Vercel URL in the CORS list, configuration is correct!

### 2. Test Health Endpoint

```bash
curl https://raja-studio.onrender.com/api/health
```

Expected response:
```json
{"ok":true,"database":"connected"}
```

### 3. Test from Production Frontend

Open: https://raja-studio-gmys.vercel.app

Try to login. Should work without errors!

---

## 🐛 Troubleshooting

### Issue: "CORS rejected origin"

**Check logs for**:
```
❌ CORS rejected origin: https://raja-studio-gmys.vercel.app
```

**Solution**: 
1. Verify `CLIENT_ORIGIN` includes your Vercel URL
2. Check for typos (no `www.`, no trailing `/`)
3. Redeploy backend after changes

### Issue: "Unable to connect to server"

**Possible causes**:
1. Backend is sleeping (Render free tier) - visit health endpoint to wake it
2. CORS blocking the request
3. Network issue

**Solution**:
```bash
# Wake up backend
curl https://raja-studio.onrender.com/api/health

# Wait 30 seconds, then try login again
```

### Issue: Login works on desktop but not mobile

**Cause**: Browser cache or different Vercel preview URL

**Solution**:
1. Clear mobile browser cache
2. Use incognito/private mode
3. Check if mobile is using a different Vercel URL (e.g., `raja-studio-gmys-git-main.vercel.app`)
4. Add all Vercel URLs to `CLIENT_ORIGIN`

### Issue: MongoDB connection failed

**Check**:
1. MongoDB Atlas network access allows Render's IP (or allow `0.0.0.0/0`)
2. `MONGODB_URI` is correct and properly encoded
3. Database user has correct permissions

---

## 🔐 Security Best Practices

### 1. Use Strong JWT Secret

❌ **Bad**: `JWT_SECRET=replace_this_with_a_long_random_secret_before_deploying`

✅ **Good**: Generate a secure random string:
```bash
# On Linux/Mac
openssl rand -base64 64

# On Windows PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 2. Restrict CORS Origins

Only include domains you control:
```
CLIENT_ORIGIN=http://localhost:5173,https://raja-studio-gmys.vercel.app
```

❌ **Never use**: `CLIENT_ORIGIN=*` in production!

### 3. MongoDB Atlas Network Access

- Add Render's IP ranges, or
- Allow `0.0.0.0/0` (less secure but works for dynamic IPs)

### 4. Environment Variables

- Never commit `.env` files to Git
- Use Render's secure environment variable storage
- Rotate secrets periodically

---

## 📊 Render Service Configuration

**Build Command**: `npm install`  
**Start Command**: `npm start`  
**Root Directory**: `backend`  
**Region**: Choose closest to your users  
**Instance Type**: Free or Starter (for better performance)

---

## 🔄 Deployment Workflow

### Initial Deployment

1. Connect GitHub repo to Render
2. Set root directory to `backend`
3. Add all environment variables
4. Deploy

### Updates

1. Push code to GitHub:
   ```bash
   git add backend/
   git commit -m "Update backend"
   git push
   ```

2. Render auto-deploys (if enabled)
3. Check logs for successful deployment
4. Test health endpoint

### Manual Deploy

Render Dashboard → Your Service → **Manual Deploy** → **Deploy latest commit**

---

## 🎯 Testing Checklist After Deployment

- [ ] Health endpoint returns `{"ok":true}`
- [ ] CORS logs show your Vercel domain
- [ ] Desktop login works
- [ ] Mobile login works
- [ ] Registration works
- [ ] Product list loads
- [ ] Admin login works
- [ ] Order creation works
- [ ] Image upload works (if R2 configured)
- [ ] No errors in Render logs

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Render Status**: https://status.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Backend Logs**: Render Dashboard → Your Service → Logs

---

## 🚨 Critical Reminder

**After updating `CLIENT_ORIGIN` on Render**:

1. ✅ Wait for deployment to complete (2-3 minutes)
2. ✅ Clear browser cache on mobile
3. ✅ Test login from https://raja-studio-gmys.vercel.app
4. ✅ Mobile login should work!

**Your mobile login will work once CLIENT_ORIGIN includes the new Vercel domain!** 🎉
