# 🔧 Mobile Login Issue - Troubleshooting Guide

## ✅ Changes Made

### 1. Improved Error Handling
- ✅ Better error messages in `AuthContext.jsx`
- ✅ Enhanced API error handling in `api.js`
- ✅ More user-friendly error messages
- ✅ Console logging for debugging

### 2. Phone Number Updated
- ✅ Changed from: `+91 98765 43210`
- ✅ Changed to: `+91 77085 52461`
- ✅ WhatsApp updated: `917708552461`

---

## 🐛 Common Mobile Login Issues

### Issue 1: "Something went wrong" Error

**Possible Causes:**
1. **CORS not configured** for Vercel URL
2. **Network connectivity** issue on mobile
3. **Backend not responding**
4. **Invalid credentials**

**Solutions:**

#### Check 1: Verify Backend CORS
Go to your **Render backend** dashboard:

1. Navigate to Environment Variables
2. Find `CLIENT_ORIGIN`
3. Make sure it includes your Vercel URL:
```
CLIENT_ORIGIN=http://localhost:5173,https://your-vercel-url.vercel.app
```

4. **Save and redeploy backend**

#### Check 2: Test Backend API
Open this URL in mobile browser:
```
https://raja-studio.onrender.com/api/health
```

Should return:
```json
{"ok":true,"database":"raja_studio"}
```

If this doesn't work, backend is down.

#### Check 3: Check Frontend Environment Variable
In **Vercel dashboard**:
1. Go to Settings → Environment Variables
2. Verify `VITE_API_URL` is set to:
```
https://raja-studio.onrender.com
```
3. Redeploy if you changed it

#### Check 4: Test with Developer Tools
On mobile (Android Chrome):
1. Open `chrome://inspect` on desktop
2. Connect your phone via USB
3. Inspect the page
4. Check Console for errors
5. Check Network tab for failed requests

---

## 🔍 Debugging Steps

### Step 1: Check Browser Console (Mobile)

**On Android:**
1. Enable USB Debugging on phone
2. Connect to computer
3. Open Chrome DevTools → Remote Devices
4. Inspect your Vercel page
5. Look for errors in Console

**On iPhone:**
1. Settings → Safari → Advanced → Web Inspector
2. Connect to Mac
3. Safari → Develop → [Your iPhone] → Vercel page
4. Check Console for errors

### Step 2: Test API Connection

Open your Vercel URL in mobile browser and test:
```javascript
// Open browser console and run:
fetch('https://raja-studio.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

Expected: `{ok: true, database: 'raja_studio'}`

If this fails, it's a CORS or network issue.

### Step 3: Check Network Tab

1. Open DevTools Network tab
2. Try to login
3. Look for the POST request to `/api/auth/login`
4. Check:
   - Status code (should be 200 or 401)
   - Response body (should show error message)
   - Request headers (should have correct origin)

---

## 🔧 Most Likely Fixes

### Fix 1: Update Backend CORS (Most Common)

**Problem**: Backend doesn't allow requests from Vercel URL

**Solution**:
1. Go to Render dashboard
2. Your backend service → Environment
3. Update `CLIENT_ORIGIN` to include your Vercel URL:
```
CLIENT_ORIGIN=http://localhost:5173,https://raja-studio-frontend.vercel.app
```
(Replace with your actual Vercel URL)

4. Save
5. Backend will auto-redeploy
6. Wait 2-3 minutes
7. Try login again

### Fix 2: Redeploy Frontend

**Problem**: Environment variable not picked up

**Solution**:
1. Go to Vercel dashboard
2. Your project → Deployments
3. Click on latest deployment → "..." → Redeploy
4. Wait for deployment
5. Try again

### Fix 3: Check Render Backend Status

**Problem**: Backend might be sleeping (free tier)

**Solution**:
1. Go to https://raja-studio.onrender.com/api/health
2. If slow or times out, backend was sleeping
3. Wait 30-60 seconds for it to wake up
4. Try login again

**Note**: Render free tier sleeps after 15 minutes of inactivity

---

## ✅ Verification Checklist

After making changes, verify:

- [ ] Backend health endpoint works: https://raja-studio.onrender.com/api/health
- [ ] CORS includes Vercel URL in Render env vars
- [ ] `VITE_API_URL` set correctly in Vercel
- [ ] Frontend redeployed after env changes
- [ ] Backend redeployed after CORS changes
- [ ] No errors in mobile browser console
- [ ] Network tab shows successful API calls
- [ ] Login works on desktop browser
- [ ] Login works on mobile browser

---

## 📱 Test Login Flow

### Desktop Test:
1. Go to your Vercel URL
2. Click Login
3. Enter email and password
4. Should work ✅

### Mobile Test:
1. Go to your Vercel URL on mobile
2. Click Login
3. Enter email and password
4. Should work ✅

If desktop works but mobile doesn't:
- **Check CORS** (most likely issue)
- **Check mobile network** (try WiFi vs 4G/5G)
- **Clear browser cache** on mobile

---

## 🚨 Emergency Rollback

If nothing works, temporarily use localhost backend for testing:

**In Vercel**:
```
VITE_API_URL=http://your-computer-ip:8787
```

**In your backend .env**:
```
CLIENT_ORIGIN=*
```

This allows all origins (development only, not secure for production).

---

## 📞 Still Having Issues?

### Collect This Information:

1. **Error message** (exact text)
2. **Browser console errors** (screenshot)
3. **Network tab screenshot** (the failed request)
4. **Your Vercel URL**
5. **Mobile device** (iPhone/Android, browser)

### Check These:

1. Backend logs in Render dashboard
2. Frontend build logs in Vercel
3. Environment variables in both platforms
4. CORS configuration

---

## ✅ Updated Files

These files have improved error handling:

1. `frontend/src/context/AuthContext.jsx`
   - Better error messages
   - Console logging

2. `frontend/src/services/api.js`
   - Network error handling
   - Response parsing errors
   - User-friendly messages

3. `frontend/src/services/db.js`
   - Phone number: 7708552461
   - WhatsApp: 917708552461

---

## 🔄 Next Steps

1. **Rebuild frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Fix mobile login error handling and update phone number"
   git push
   ```

3. **Vercel auto-deploys** from Git

4. **Update Render CORS** with your Vercel URL

5. **Test on mobile** after deployment

---

**The most common issue is missing Vercel URL in backend CORS configuration!**

Make sure to update `CLIENT_ORIGIN` in Render after you get your Vercel URL! 🎯
