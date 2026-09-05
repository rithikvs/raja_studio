# 🚀 Vercel Deployment Guide - Raja Studio Frontend

## ✅ Pre-Deployment Checklist

Your backend is already deployed at: **https://raja-studio.onrender.com**

Now we'll deploy the frontend to Vercel.

---

## 📦 Step 1: Prepare Frontend for Deployment

### ✅ Already Done:
- ✅ Frontend `.env` updated with Render URL
- ✅ Project structure ready
- ✅ Build tested locally

### Verify Build Works:
```bash
cd frontend
npm run build
```

Should complete successfully without errors.

---

## 🌐 Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub/GitLab/Bitbucket

2. **Create New Project**
   - Click "Add New" → "Project"
   - Import your Git repository

3. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Go to: Settings → Environment Variables
   - Add this variable:
   ```
   Name: VITE_API_URL
   Value: https://raja-studio.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing? No
# - Project name? raja-studio-frontend
# - Directory? ./
# - Override settings? Yes
#   - Build Command: npm run build
#   - Output Directory: dist
#   - Development Command: npm run dev
```

---

## 🔧 Step 3: Update Backend CORS

After your Vercel deployment, you'll get a URL like:
```
https://raja-studio-frontend.vercel.app
```

### Update Render Backend Environment:

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Open your backend service

2. **Add Environment Variable**
   - Go to: Environment → Environment Variables
   - Update `CLIENT_ORIGIN` to include your Vercel URL:
   ```
   CLIENT_ORIGIN=http://localhost:5173,https://raja-studio-frontend.vercel.app
   ```

3. **Save and Redeploy**
   - Render will automatically redeploy with new CORS settings

---

## ✅ Step 4: Verify Deployment

### Test Your Deployed App:

1. **Homepage**
   - Visit: `https://your-vercel-url.vercel.app`
   - Should load without errors

2. **API Connection**
   - Open browser console (F12)
   - Check for CORS errors
   - Should connect to Render backend

3. **Admin Login**
   - Visit: `https://your-vercel-url.vercel.app/admin/login`
   - Login with: admin@123 / 1234
   - Should work without errors

4. **Create Product**
   - Admin Panel → Products → Add Product
   - Add test product
   - Should save successfully

5. **Customer Flow**
   - Register new customer
   - Browse products
   - Add to cart
   - Checkout
   - Should work end-to-end

---

## 🔧 Troubleshooting

### Issue: CORS Error
**Error**: "Access to fetch blocked by CORS policy"

**Solution**:
1. Check `CLIENT_ORIGIN` in Render includes your Vercel URL
2. Make sure there's no trailing slash
3. Redeploy backend after updating

### Issue: API Not Found (404)
**Error**: "Unable to reach the Raja Studio server"

**Solution**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Should be: `https://raja-studio.onrender.com`
3. Redeploy frontend after updating

### Issue: Build Failed
**Error**: Build process fails in Vercel

**Solution**:
1. Check Vercel build logs
2. Verify `Root Directory: frontend`
3. Verify `Build Command: npm run build`
4. Check for syntax errors in code

### Issue: Environment Variable Not Working
**Error**: Still using localhost in production

**Solution**:
1. Ensure variable name is exactly: `VITE_API_URL`
2. Must have `VITE_` prefix
3. Redeploy after adding variables

---

## 🎨 Custom Domain (Optional)

### Add Your Own Domain:

1. **In Vercel Dashboard**
   - Go to: Project Settings → Domains
   - Click "Add"
   - Enter your domain: `www.rajastudio.com`

2. **Configure DNS**
   - Add CNAME record:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Update Backend CORS**
   - Add your domain to `CLIENT_ORIGIN` in Render:
   ```
   CLIENT_ORIGIN=http://localhost:5173,https://raja-studio-frontend.vercel.app,https://www.rajastudio.com
   ```

---

## 📊 Monitoring

### Vercel Analytics
- Dashboard → Your Project → Analytics
- Monitor page views, performance, errors

### Real User Monitoring
- Check response times
- Monitor 4xx/5xx errors
- Track deployment frequency

---

## 🔄 Continuous Deployment

Vercel automatically redeploys when you:
- Push to main branch
- Merge pull request
- Make changes via Git

**No manual deployment needed after setup!**

---

## 📝 Important URLs

### Your Services:
- **Backend (Render)**: https://raja-studio.onrender.com
- **Frontend (Vercel)**: https://[your-project].vercel.app
- **Database**: MongoDB Atlas
- **Storage**: Cloudflare R2

### Dashboards:
- **Vercel**: https://vercel.com/dashboard
- **Render**: https://dashboard.render.com
- **MongoDB**: https://cloud.mongodb.com

---

## ⚙️ Environment Variables Summary

### Vercel (Frontend)
```
VITE_API_URL=https://raja-studio.onrender.com
```

### Render (Backend)
```
CLIENT_ORIGIN=http://localhost:5173,https://your-vercel-url.vercel.app
(Plus all other backend variables already set)
```

---

## 🎯 Deployment Checklist

Before going live:

- [ ] Frontend builds locally without errors
- [ ] Backend is running on Render
- [ ] Environment variables set in Vercel
- [ ] Vercel project deployed successfully
- [ ] CORS updated in Render backend
- [ ] Backend redeployed with new CORS
- [ ] Frontend loads without errors
- [ ] API calls work (check browser console)
- [ ] Admin login works
- [ ] Customer registration works
- [ ] Products display correctly
- [ ] Cart works
- [ ] Checkout works
- [ ] Orders are created
- [ ] Images upload successfully
- [ ] No console errors

---

## 🚨 After Deployment

### Update Your Local Development:

If you want to switch back to local development:

**Frontend `.env`** (change to localhost):
```env
VITE_API_URL=http://localhost:8787
```

**Backend** (already has localhost in `CLIENT_ORIGIN`)

### Keep Production Running:

- Frontend (Vercel) points to: https://raja-studio.onrender.com
- Backend (Render) allows: Vercel URL in CORS
- Both services communicate perfectly

---

## ✅ Success Indicators

Your deployment is successful when:

1. ✅ Vercel URL loads without errors
2. ✅ No CORS errors in browser console
3. ✅ API calls work (Network tab shows 200 responses)
4. ✅ Admin panel accessible
5. ✅ Products load correctly
6. ✅ Orders can be placed
7. ✅ Images upload successfully

---

## 🎊 You're Live!

Once deployed, your Raja Studio will be accessible at:

**https://[your-project-name].vercel.app**

- ✅ Fast global CDN delivery
- ✅ Automatic HTTPS
- ✅ Continuous deployment from Git
- ✅ Free SSL certificate
- ✅ Zero downtime deployments

**Congratulations! Your e-commerce platform is now live!** 🎉

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Deployment Issues**: Check troubleshooting section above

**Your project is ready to deploy!** 🚀
