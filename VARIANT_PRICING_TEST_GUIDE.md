# Variant Pricing & Image Download - Test Guide

## ✅ IMPLEMENTATION COMPLETE

### What Was Fixed

#### 1. Variant Pricing System
- **Problem**: Frame prices were ADDING to product price (₹80 + ₹100 = ₹180)
- **Solution**: Variant pricing mode where frame price REPLACES product price (Frame ₹100 = ₹100)

#### 2. Admin Image Download
- **Status**: Already working! No changes needed.
- **Feature**: Admin can download original customer images from R2 storage

---

## 🧪 TESTING CHECKLIST

### Part 1: Variant Pricing Tests

#### Test Case 1: Simple Pricing Mode (Existing Products)
**Product**: Customized Mug (simple pricing)
1. Go to product page
2. Base price: ₹299
3. Select options (if any add-ons exist)
4. **Expected**: Price = ₹299 + add-ons
5. Add to cart
6. **Verify**: Cart shows correct total

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test Case 2: Create Variant Pricing Product
**Create**: Premium Photo Frame
1. Login to Admin Panel
2. Go to Products → Add New Product
3. Fill in:
   - Name: Premium Photo Frame
   - Category: Photo Frames
   - **Pricing Mode**: Variant Pricing ✓
4. **Notice**: Base price fields are disabled (greyed out)
5. Add customization option:
   - Name: Frame Size
   - Type: Radio Buttons
   - Options:
     - 6x4 Inches: ₹100
     - 8x6 Inches: ₹150
     - 12x18 Inches: ₹250
6. **Important**: Enter FULL prices (₹100, ₹150, ₹250), not adjustments
7. Save Product

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test Case 3: Variant Price Display (Frame ₹100 = ₹100)
**Product**: Premium Photo Frame (variant mode)
1. Go to product page
2. **Before selection**: "Select options to view price"
3. Select 6x4 Inches frame
4. **Expected**: Shows ₹100 (NOT ₹80 + ₹100 = ₹180)
5. Change to 8x6 Inches
6. **Expected**: Shows ₹150
7. Change to 12x18 Inches
8. **Expected**: Shows ₹250

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test Case 4: Variant Price + Add-ons
**Product**: Premium Photo Frame
1. Select frame: 8x6 Inches (₹150)
2. **Current price**: ₹150
3. Enable add-on: Gift Packing (+₹50)
4. **Expected**: ₹150 + ₹50 = ₹200
5. Enable add-on: Glitter (+₹80)
6. **Expected**: ₹150 + ₹50 + ₹80 = ₹280
7. **NOT**: ₹80 (base) + ₹150 (frame) + ₹50 + ₹80 = ₹360

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test Case 5: Cart Total with Variant Pricing
**Product**: Premium Photo Frame
1. Select frame: 8x6 Inches (₹150)
2. Quantity: 2
3. Add to cart
4. **Cart shows**:
   - Unit price: ₹150
   - Quantity: 2
   - Line total: ₹300
5. **NOT**: ₹460 (if it was adding base price)

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test Case 6: Multiple Variant Products in Cart
1. Add Frame 1 (6x4): ₹100 × 1 = ₹100
2. Add Frame 2 (8x6): ₹150 × 2 = ₹300
3. Add Frame 3 (12x18): ₹250 × 1 = ₹250
4. **Cart subtotal**: ₹650
5. **Verify**: Each line shows correct variant price

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test Case 7: Checkout with Variant Products
1. Cart: Frame ₹150 × 2 = ₹300
2. Go to checkout
3. Apply coupon LED10 (if cart > ₹500)
4. **Verify**: Discount calculates correctly
5. **Verify**: Final total is correct
6. Place order
7. **Expected**: Order created successfully

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test Case 8: Admin Order View - Variant Pricing
1. Login to Admin Panel
2. Go to Orders
3. Open recent variant product order
4. **Verify**: 
   - Product name shown
   - Variant selection shown (e.g., "Frame Size: 8x6 Inches")
   - Unit price: ₹150 (variant price)
   - Quantity: 2
   - Line total: ₹300
5. **Invoice**: Print invoice and verify pricing

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

### Part 2: Admin Image Download Tests

#### Test Case 9: Upload Customer Image
**User Flow**:
1. Login as customer
2. Select personalized product
3. Upload high-resolution image:
   - Minimum 1800×1200px recommended
   - Large file size (5-10MB)
4. Fill customization
5. Place order
6. **Expected**: Order created with image

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test Case 10: Admin View Customer Image
**Admin Flow**:
1. Login to Admin Panel
2. Go to Orders
3. Find order with uploaded image
4. **Verify "Customer Original Photo" column shows**:
   - Image icon
   - Original filename
   - Download button

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test Case 11: Admin Download Original Image
1. Click "Download Photo" button
2. **Expected**: 
   - File downloads immediately
   - Original filename preserved
   - Original quality preserved
   - File opens correctly
   - Resolution matches uploaded image
3. **Verify file properties**:
   - Check file size (should be original size)
   - Check resolution (should be original resolution)
   - Check format (JPEG/PNG as uploaded)

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test Case 12: Admin View Image Details in Modal
1. Click order to open details modal
2. Scroll to "Customer Uploaded Photos" section
3. **Verify shows**:
   - Original filename
   - File size (in KB/MB)
   - MIME type
   - Download button
4. Click "Download Photo" from modal
5. **Expected**: Downloads original image

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

#### Test Case 13: Multiple Images in Order
1. Place order with multiple customized items
2. Each item has different uploaded photo
3. Admin opens order
4. **Verify**: All images shown with download buttons
5. Download each image
6. **Expected**: Each downloads with correct filename

**Status**: ⬜ Not Tested | ✅ Pass | ❌ Fail

---

## 🔍 VALIDATION CHECKLIST

### Pricing Validation
- [ ] Variant products show ONLY variant price (not base + variant)
- [ ] Simple products still work with base + adjustments
- [ ] Add-ons correctly add to both pricing modes
- [ ] Cart calculates correct totals
- [ ] Checkout shows correct amounts
- [ ] Orders save correct prices
- [ ] Admin can create variant pricing products
- [ ] Price changes immediately on variant selection

### Image Download Validation
- [ ] Admin can see customer uploaded images
- [ ] Download button appears for each image
- [ ] Downloads work without errors
- [ ] Original filename preserved
- [ ] Original quality preserved (not compressed)
- [ ] Large files (10MB+) download successfully
- [ ] R2 signed URLs expire after 5 minutes (security)
- [ ] Non-admin users cannot access download endpoint

---

## 🚨 COMMON ISSUES & FIXES

### Issue 1: Price Still Adding Instead of Replacing
**Symptom**: Frame ₹100 shows as ₹180
**Check**:
1. Product has `pricingMode: "variant"` set in database
2. Option has `priceAdjustment: 100` (will be treated as full price in variant mode)
3. Clear browser cache and refresh
4. Check browser console for errors

**Fix**: Edit product in Admin, ensure "Variant Pricing" is selected

---

### Issue 2: "Select options to view price" Never Changes
**Symptom**: Price stays at "Select options to view price"
**Check**:
1. At least one customization option has priceAdjustment > 0
2. Options are properly configured
3. Check browser console for JavaScript errors

**Fix**: Edit product, ensure variant options have prices set

---

### Issue 3: Image Download Button Missing
**Symptom**: No download button in admin orders
**Check**:
1. Order actually has images (check database)
2. Admin is logged in (check JWT token)
3. Backend is running and accessible

**Fix**: Already implemented, should work out of the box

---

### Issue 4: Image Download Fails or Shows Error
**Symptom**: Click download, nothing happens or error
**Check**:
1. Check browser console for error messages
2. Check backend logs for R2 errors
3. Verify R2 credentials are set correctly
4. Check network tab for failed requests

**Fix**: 
- If R2 error: Verify environment variables on Render
- If 404: Image might not exist in R2
- If 401/403: Admin authentication issue

---

## 📊 EXPECTED RESULTS

### Correct Pricing Examples

#### Example 1: Variant Product Only
```
Product: Premium Photo Frame
Pricing Mode: Variant
Base Price: (ignored)

Frame 6x4: ₹100
Customer selects 6x4
Final Price: ₹100 ✅
```

#### Example 2: Variant Product with Add-ons
```
Product: Premium Photo Frame
Pricing Mode: Variant

Frame 8x6: ₹150
Gift Packing: +₹50
Glitter: +₹80

Final Price: ₹150 + ₹50 + ₹80 = ₹280 ✅
```

#### Example 3: Simple Product (Old Behavior)
```
Product: Customized Mug
Pricing Mode: Simple
Base Price: ₹299

Extra Design: +₹50
Final Price: ₹299 + ₹50 = ₹349 ✅
```

---

## 🎯 SUCCESS CRITERIA

### Variant Pricing Success
✅ Frame ₹100 displays as ₹100 (not ₹180)
✅ Frame ₹150 displays as ₹150 (not ₹230)
✅ Frame ₹250 displays as ₹250 (not ₹330)
✅ Add-ons correctly add to variant price
✅ Cart totals are accurate
✅ Orders save correct prices
✅ Admin can create variant products easily

### Image Download Success
✅ Admin sees customer uploaded images
✅ Download button works
✅ Original quality preserved
✅ Original filename preserved
✅ Large files download successfully
✅ Secure (only admin can download)
✅ Works for multiple images per order

---

## 🔐 SECURITY NOTES

### Backend Price Validation
- Backend logs pricingMode for each order item
- Backend validates product exists
- Backend warns if variant price seems suspicious
- Future enhancement: Full price recalculation from MongoDB

### Image Download Security
- R2 signed URLs expire after 5 minutes
- Only admin users can request signed URLs
- JWT authentication required
- R2 bucket remains private

---

## 📝 DEPLOYMENT CHECKLIST

Before testing in production:

- [ ] Frontend built successfully (`npm run build`)
- [ ] No TypeScript/ESLint errors
- [ ] Backend starts without errors
- [ ] MongoDB connection working
- [ ] R2 credentials configured on Render
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Environment variables set correctly
- [ ] Test with one real order first
- [ ] Verify admin panel accessible

---

## 🆘 SUPPORT

If any test fails:
1. Check browser console (F12 → Console)
2. Check backend logs on Render
3. Verify MongoDB data structure
4. Clear browser cache and retry
5. Test in incognito mode
6. Check network requests (F12 → Network)

---

**Implementation Date**: December 2024
**Status**: Ready for Testing
**Next Step**: Run all test cases and mark pass/fail
