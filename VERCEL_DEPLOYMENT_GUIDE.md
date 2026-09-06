# 🚀 Vercel Frontend Deployment Guide

## Current Production Setup

**Frontend URL**: https://raja-studio-gmys.vercel.app  
**Backend URL**: https://raja-studio.onrender.com  
**Framework**: React + Vite

---

## 📋 Required Environment Variables on Vercel

Go to: **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

### Production Environment Variable

```
VITE_API_URL=https://raja-studio.onrender.com
```

**Important**: 
- ✅ Variable name must be: `VITE_API_URL` (Vite requires `VITE_` prefix)
- ✅ Value: `https://raja-studio.onrender.com` (no trailing slash)
- ✅ Set for: **Production**, **Preview**, and **Development** environments

---

## 🔧 Vercel Project Configuration

### Build Settings

**Framework Preset**: Vite  
**Root Directory**: `frontend`  
**Build Command**: `npm run build`  
**Output Directory**: `dist`  
**Install Command**: `npm install`

### Environment Variables

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_API_URL` | `https://raja-studio.onrender.com` | Production, Preview, Development |

---

## 📦 Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`  
   - **Output Directory**: `dist`
5. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://raja-studio.onrender.com`
   - Environments: Check all (Production, Preview, Development)
6. Click **"Deploy"**

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod

# Or deploy from project root
vercel --prod --cwd frontend
```

### Method 3: Deploy via Git Push (Auto-deploy)

1. Connect GitHub repo to Vercel (one-time setup)
2. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```
3. Vercel automatically deploys

---

## 🔄 Update Environment Variables

### Via Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** → **Environment Variables**
4. Find `VITE_API_URL`
5. Click **Edit** → Update value → **Save**
6. **Important**: Redeploy for changes to take effect

### Via Vercel CLI

```bash
# Set environment variable
vercel env add VITE_API_URL production

# When prompted, enter: https://raja-studio.onrender.com

# Redeploy to apply changes
vercel --prod
```

---

## ✅ Verification After Deployment

### 1. Check Build Logs

In Vercel Dashboard → Your Deployment → **View Build Logs**

Look for:
```
✓ built in 15.68s
dist/index.html                   0.81 kB
dist/assets/index-xxx.css       140.62 kB
dist/assets/index-xxx.js        593.49 kB
```

### 2. Verify Environment Variable

Check the build logs for:
```
VITE_API_URL=https://raja-studio.onrender.com
```

### 3. Test Production Site

1. Open: https://raja-studio-gmys.vercel.app
2. Open browser console (F12)
3. Check for API calls to `https://raja-studio.onrender.com`
4. Try to login - should work!

### 4. Test Mobile

1. Open production URL on mobile browser
2. Try to login
3. Should work without "Unable to connect" error

---

## 🔍 Vercel Deployment URLs

Vercel provides multiple URLs for your deployment:

### Production URL
```
https://raja-studio-gmys.vercel.app
```
This is your main production URL.

### Preview URLs (for branches)
```
https://raja-studio-gmys-git-main-yourname.vercel.app
https://raja-studio-gmys-git-dev-yourname.vercel.app
```

### Deployment-specific URLs
```
https://raja-studio-gmys-xyz123.vercel.app
```

⚠️ **Important**: If mobile login fails, check if you're accessing a preview URL. You may need to add preview URLs to backend CORS:

```
CLIENT_ORIGIN=http://localhost:5173,https://raja-studio-gmys.vercel.app,https://raja-studio-gmys-git-main-yourname.vercel.app
```

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Error**: `ENOENT: no such file or directory`

**Solution**:
1. Verify Root Directory is set to `frontend`
2. Check `package.json` exists in frontend directory
3. Verify build command is `npm run build`

**Error**: `Module not found`

**Solution**:
```bash
# Clean install locally
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build

# Push to trigger redeploy
git add .
git commit -m "Fix dependencies"
git push
```

### Issue: Environment Variable Not Working

**Symptoms**: 
- API calls go to undefined or wrong URL
- Console shows `undefined/api/auth/login`

**Solution**:
1. Verify variable name is exactly `VITE_API_URL` (case-sensitive)
2. Verify variable is set for Production environment
3. Redeploy after adding/updating variables
4. Check build logs to confirm variable is present

### Issue: Mobile Login Fails After Deploy

**Error**: "Unable to connect to server" or CORS error

**Solution**:
1. Get your actual Vercel URL from dashboard
2. Update Render backend `CLIENT_ORIGIN` to include it:
   ```
   CLIENT_ORIGIN=http://localhost:5173,https://raja-studio-gmys.vercel.app
   ```
3. Wait for Render to redeploy (2-3 minutes)
4. Clear mobile browser cache
5. Try login again

### Issue: Old Domain Still Works

If you want to redirect `rajastudio-rosy.vercel.app` → `raja-studio-gmys.vercel.app`:

1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add `rajastudio-rosy.vercel.app` as a domain
3. Vercel will automatically redirect to primary domain

---

## 🔐 Security Best Practices

### 1. Environment Variables

✅ **Do**:
- Set `VITE_API_URL` in Vercel dashboard
- Only include public-safe variables (API URL is safe)

❌ **Don't**:
- Never put secrets in frontend environment variables
- Never commit `.env` to Git

### 2. API Security

- Frontend only knows the API URL
- Backend handles all secrets (MongoDB, R2, JWT)
- CORS on backend controls which domains can access API

### 3. Domain Security

- Use HTTPS only (Vercel provides this automatically)
- Verify you own the domain
- Set up proper CORS on backend

---

## 📊 Build Configuration Files

### vite.config.js

Should already be configured. If not, create in `frontend/`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
```

### vercel.json (Optional)

Create in `frontend/` for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🎯 Deployment Checklist

### Before First Deploy

- [ ] Code is pushed to GitHub
- [ ] Backend is deployed on Render
- [ ] Backend health endpoint works: `https://raja-studio.onrender.com/api/health`

### During Deploy

- [ ] Connected GitHub repo to Vercel
- [ ] Set Root Directory to `frontend`
- [ ] Set Build Command to `npm run build`
- [ ] Set Output Directory to `dist`
- [ ] Added `VITE_API_URL=https://raja-studio.onrender.com`
- [ ] Selected all environments for variable

### After Deploy

- [ ] Build completed successfully
- [ ] Got production URL: `https://raja-studio-gmys.vercel.app`
- [ ] Opened production URL - site loads
- [ ] Tested on desktop - login works
- [ ] Added Vercel URL to Render backend CORS
- [ ] Waited for Render redeploy
- [ ] Tested on mobile - login works ✅

---

## 🔄 Update Workflow

### Code Changes

```bash
# Make changes to frontend
cd frontend
# ... edit files ...

# Test locally
npm run dev

# Build locally to verify
npm run build

# Commit and push
git add .
git commit -m "Update frontend"
git push origin main

# Vercel auto-deploys
# Check deployment: https://vercel.com/dashboard
```

### Environment Variable Changes

1. Vercel Dashboard → Settings → Environment Variables
2. Edit `VITE_API_URL` if backend URL changes
3. Redeploy: Deployments → **⋯** → **Redeploy**

---

## 📱 Testing Mobile

### On Real Device

1. Open https://raja-studio-gmys.vercel.app on mobile browser
2. Try to login
3. Check mobile browser console:
   - Chrome Android: chrome://inspect
   - Safari iOS: Safari → Develop → iPhone

### Using Browser DevTools

1. Open https://raja-studio-gmys.vercel.app on desktop
2. Open DevTools (F12)
3. Click device toolbar (Ctrl+Shift+M)
4. Select mobile device
5. Test login

---

## 🚨 Critical After Deployment

1. **Get your actual Vercel production URL** from dashboard
2. **Update Render backend CORS** to include it:
   ```
   CLIENT_ORIGIN=http://localhost:5173,https://raja-studio-gmys.vercel.app
   ```
3. **Wait 2-3 minutes** for Render to redeploy
4. **Test mobile login** - should work!

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Status**: https://www.vercel-status.com
- **Vite Docs**: https://vitejs.dev
- **Deployment Logs**: Vercel Dashboard → Your Deployment

---

## 🎉 Success Indicators

After successful deployment:

✅ Build completes without errors  
✅ Site loads at production URL  
✅ API calls go to `https://raja-studio.onrender.com`  
✅ Login works on desktop  
✅ Login works on mobile  
✅ No CORS errors in console  
✅ Products load correctly  
✅ Checkout works  
✅ Orders are created  

**Your production site is live and fully functional!** 🚀
