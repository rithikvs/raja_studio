# Raja Studio - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account (or connection string ready)
- Code editor (VS Code recommended)

---

## 📦 Installation

### Step 1: Clone or Navigate to Project
```bash
cd raja-studio
```

### Step 2: Install All Dependencies
```bash
npm run install:all
```

Or install separately:
```bash
cd frontend && npm install
cd ../backend && npm install
```

### Step 3: Configure Environment Variables

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8787
```

**Backend** - Create `backend/.env`:
```env
PORT=8787
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/raja_studio
MONGODB_DB_NAME=raja_studio
JWT_SECRET=your-super-secure-random-secret-at-least-32-characters-long
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_REGION=auto
MAX_UPLOAD_BYTES=26214400
CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

⚠️ **Important**: Replace `your-username`, `your-password`, and `JWT_SECRET` with actual values!

---

## ▶️ Running the Application

### Option A: Run Everything Together (Easiest)
```bash
npm run dev
```

This starts:
- 🎨 Frontend on http://localhost:5173 (or next available port)
- 🔧 Backend on http://localhost:8787

### Option B: Run Separately

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

---

## 🎯 Access the Application

- **Frontend**: http://localhost:5173 (or the port shown in terminal)
- **Backend API**: http://localhost:8787
- **Health Check**: http://localhost:8787/api/health
- **Admin Panel**: http://localhost:5173/admin/login

---

## 👤 Create Admin Account

### Method 1: Using Script (Recommended)
```bash
cd backend
node createAdmin.cjs
```

### Method 2: Manual MongoDB Insert
Add this document to the `users` collection:
```javascript
{
  full_name: "Administrator",
  email: "admin@rajastudio.com",
  phone: "1234567890",
  password_hash: "$2a$12$...", // Use bcrypt hash
  is_admin: true,
  created_at: new Date(),
  updated_at: new Date()
}
```

Default credentials (from `.env`):
- Email: `admin@123`
- Password: `1234`

---

## ✅ Verify Everything Works

### Test Checklist

1. **Backend Health**:
   - Visit: http://localhost:8787/api/health
   - Should see: `{"ok":true,"database":"raja_studio"}`

2. **Frontend Loads**:
   - Visit: http://localhost:5173
   - Homepage should display

3. **Admin Login**:
   - Go to: http://localhost:5173/admin/login
   - Login with admin credentials
   - Should reach admin dashboard

4. **Database Connection**:
   - Check backend terminal for "Raja Studio MongoDB API listening on 8787"
   - No connection errors

5. **Create Test Product**:
   - Admin Panel → Products → Add Product
   - Fill details and save
   - Product should appear on shop page

---

## 🔧 Common Issues & Solutions

### Issue: "Unable to reach the Raja Studio server"
**Solution**: 
- Ensure backend is running (`cd backend && npm run dev`)
- Check `VITE_API_URL` in `frontend/.env`
- Verify port 8787 is not in use

### Issue: Database Connection Failed
**Solution**:
- Check `MONGODB_URI` in `backend/.env`
- Verify MongoDB Atlas IP whitelist includes your IP
- Test connection string in MongoDB Compass

### Issue: Port Already in Use
**Solution**:
- Frontend: Vite will automatically try next available port
- Backend: Change `PORT` in `backend/.env`

### Issue: "Cannot find module"
**Solution**:
```bash
# Reinstall dependencies
cd frontend && npm install
cd ../backend && npm install
```

### Issue: CORS Errors
**Solution**:
- Update `CLIENT_ORIGIN` in `backend/.env` to match your frontend port
- Restart backend after changes

---

## 📚 Next Steps

1. **Add Products**: Login as admin, add categories and products
2. **Customize**: Modify colors, logos, content in admin CMS
3. **Test Orders**: Register as customer, place test order
4. **Deploy**: Follow `DEPLOYMENT.md` when ready to go live

---

## 📖 Documentation

- **Full README**: `README.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Migration Report**: `MIGRATION_REPORT.md`

---

## 🆘 Need Help?

### Check These First:
1. Backend terminal for error messages
2. Frontend browser console for errors
3. MongoDB Atlas connection status
4. Environment variables are set correctly

### Still Stuck?
1. Check `MIGRATION_REPORT.md` for detailed info
2. Review `DEPLOYMENT.md` for configuration details
3. Ensure all prerequisites are installed

---

## 🎉 You're Ready!

Your Raja Studio is now running locally. Start by:
1. Creating admin account
2. Adding categories
3. Adding products
4. Testing the complete order flow

**Happy coding!** 🚀
