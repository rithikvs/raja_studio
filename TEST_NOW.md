# 🧪 TEST NOW - Quick Guide

## ⏱️ Wait 1-2 Minutes

Vercel is deploying your fixes right now. Check: https://vercel.com/dashboard

Look for: ✅ Green checkmark

---

## 🧪 Test 1: Order Placement (2 minutes)

1. **Open**: https://raja-studio-gmys.vercel.app
2. **Add a product** to cart (any product)
3. **Go to checkout**
4. **Fill in your details**:
   - Name, Phone, Email, Address
5. **Select payment**: UPI or Cash on Delivery
6. **Click "Place Order"**
7. **Expected**: ✅ Success page appears

**If it works**: Order placement is fixed! ✅

**If it fails**: 
- Check browser console (F12) for errors
- Share the error message
- Try hard refresh: Ctrl+Shift+R

---

## 🧪 Test 2: Coupon (1 minute)

1. **Add products worth ₹500+** to cart
2. **Go to checkout**
3. **Enter coupon code**: `LED10`
4. **Click "Apply"**
5. **Expected**: ✅ "Coupon applied successfully! You saved ₹XX"

**If it works**: Coupon system is fixed! ✅

**If it fails**:
- Go to Admin → Coupons
- Check if LED10 exists
- If not, create it:
  - Code: `LED10`
  - Type: Percentage  
  - Value: 10
  - Min Cart: 500
  - Status: Active

---

## 🧪 Test 3: Admin Orders (1 minute)

1. **Go to**: https://raja-studio-gmys.vercel.app/admin/login
2. **Login**:
   - Email: `admin@123`
   - Password: `1234`
3. **Click "Orders"**
4. **Expected**: ✅ See your test order from Test 1

**If it works**: End-to-end flow is working! ✅

---

## ✅ Success Criteria

All these should work:

- [ ] Can place order from checkout
- [ ] Order appears in admin panel
- [ ] Coupon LED10 applies 10% discount
- [ ] No error messages in browser console

---

## 📸 If Something Doesn't Work

**Take screenshots of**:
1. Browser console errors (F12 → Console tab)
2. Network tab (F12 → Network tab → failed requests)
3. The error message on screen

**And check**:
- Vercel deployment completed?
- Backend awake? Visit: https://raja-studio.onrender.com/api/health

---

## 🎯 What Should Happen

### Order Placement Flow:
```
Add to Cart → Checkout → Fill Form → Place Order
       ↓
Success Page: "Order #123456 placed successfully!"
       ↓
Admin Panel → Orders → Your order appears
```

### Coupon Flow:
```
Cart Total: ₹850
Enter Coupon: LED10
Apply Coupon
       ↓
"✅ Coupon applied! You saved ₹85"
New Total: ₹765
```

---

## 🚀 After Testing

**If everything works**:
- ✅ Mobile login: Working
- ✅ Admin panel: Working  
- ✅ Order placement: Working
- ✅ Coupons: Working
- 🎉 **Your site is fully functional!**

**If something doesn't work**:
- Share the error details
- I'll fix it immediately

---

## ⚡ Quick Links

- **Frontend**: https://raja-studio-gmys.vercel.app
- **Admin**: https://raja-studio-gmys.vercel.app/admin/login
- **Backend Health**: https://raja-studio.onrender.com/api/health
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Start testing in 1-2 minutes!** ⏱️
