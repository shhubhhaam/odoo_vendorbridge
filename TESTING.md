# VendorBridge - Testing Guide

Complete guide to test the end-to-end procurement workflow.

---

## 🚀 Quick Start

### 1. Verify Both Servers Running
```bash
# Backend Terminal
npm run dev
# Should show: ✓ Server Running on Port 5000

# Frontend Terminal  
npm run dev
# Should show: ➜ Local: http://localhost:5173/
```

### 2. Access the Application
- Open browser: **http://localhost:5173**
- Should see Login page

---

## 🔐 Login

### Default Credentials
```
Email: admin@vendorbridge.com
Password: password
```

### Expected Result
- ✅ Login successful
- ✅ Redirected to Dashboard
- ✅ User name shown in top-right
- ✅ Sidebar displays with all menu items

---

## 📋 Test Case 1: RFQ Creation & Publishing

### Step 1: Create an RFQ
1. Navigate to **RFQs** page
2. Click "+ Create RFQ" button
3. Fill form:
   - **Title:** "Office Laptops Request"
   - **Category:** "Hardware"
   - **Description:** "Need 5 enterprise laptops with i7 processor"
   - **Deadline:** Select date 2 weeks from now
4. Click "Create RFQ"

**Expected Result:**
- ✅ Modal closes
- ✅ New RFQ appears in list with Draft status
- ✅ RFQ ID appears (e.g., RFQ-2024-001)
- ✅ Browser console shows no errors

### Step 2: Publish RFQ
1. Find your created RFQ (Draft status)
2. Click "Publish" button
3. Confirm action

**Expected Result:**
- ✅ Status changes to "Published"
- ✅ "Responses" column shows available
- ✅ Activity log updated

---

## 👥 Test Case 2: Vendor Management

### Step 1: Add a Vendor
1. Navigate to **Vendors** page
2. Click "+ Add Vendor" button
3. Fill form:
   - **Company Name:** "TechVendor Inc."
   - **GST Number:** "GST123456789"
   - **Category:** "Hardware"
   - **Email:** "vendor@techvendor.com"
   - **Phone:** "+91-9876543210"
   - **Contact Person:** "Rajesh Kumar"
   - **City:** "Bangalore"
4. Click "Save Vendor"

**Expected Result:**
- ✅ Vendor added to list
- ✅ Vendor card shows with logo
- ✅ Status badge shows "Active"
- ✅ Can search for vendor by name

### Step 2: Test Vendor Filters
1. Add 2-3 more vendors with different categories
2. Use filter dropdown to filter by category
3. Use search bar to find by name

**Expected Result:**
- ✅ Filters work correctly
- ✅ Only matching vendors display
- ✅ Search is case-insensitive

---

## 💬 Test Case 3: Quotations Comparison

### Step 1: View Quotations
1. Navigate to **Quotations** page
2. Click "View Quotes" on published RFQ

**Expected Result:**
- ✅ Shows list of 3 mock quotations
- ✅ Each quotation shows:
  - Vendor name and rating
  - Quote amount (with GST)
  - Total including GST
  - Delivery days
  - Payment terms

### Step 2: Select Quotation
1. Click on any quotation card
2. Checkmark should appear on selected card

**Expected Result:**
- ✅ Selected card highlighted in blue
- ✅ Checkmark visible
- ✅ "Convert to PO →" button appears

### Step 3: Convert to PO
1. Click "Convert to PO →" button
2. Modal appears with quotation details
3. Enter number of items (e.g., 5)
4. Click "Create PO"

**Expected Result:**
- ✅ Modal closes
- ✅ PO created successfully message
- ✅ PO appears in "Purchase Orders" tab
- ✅ PO status is "Pending"

---

## ✅ Test Case 4: Approval Workflow

### Step 1: View Pending Approvals
1. Navigate to **Approvals** page
2. Should see PO created in previous test

**Expected Result:**
- ✅ Pending PO displayed
- ✅ Shows vendor, amount, status
- ✅ Shows approval history (empty for new PO)

### Step 2: Approve PO
1. Click "Review →" button on PO
2. Review PO details
3. Click "Approve PO →" button
4. Modal appears for approval
5. Enter remarks: "Approved - Budget confirmed"
6. Click "Approve" button

**Expected Result:**
- ✅ PO status changes to "Approved"
- ✅ Approval history shows:
  - Your approval level
  - Your name
  - Remarks
  - Timestamp
- ✅ PO removed from pending queue

---

## 📄 Test Case 5: Invoice Management

### Step 1: View Invoices
1. Navigate to **Purchase Orders & Invoices**
2. Click "Invoices" tab
3. Should see invoice from approved PO

**Expected Result:**
- ✅ Invoice displays with:
  - Invoice ID
  - Vendor name
  - Amount (including GST)
  - Due date
  - Status: "Pending"

### Step 2: Print Invoice
1. Click "🖨️ Print" button on invoice
2. Professional preview modal appears
3. Review invoice layout:
   - Header with invoice number
   - From/To details
   - Amount breakdown
   - Total with tax

**Expected Result:**
- ✅ Invoice preview shows correctly
- ✅ All details accurate
- ✅ Print button available
- ✅ Can click "Close" to dismiss

### Step 3: Email Invoice
1. Click "📧 Email" button on invoice
2. Email modal appears with:
   - Vendor email (pre-filled)
   - Subject line
   - Message field
3. Update subject to: "Invoice Attached"
4. Click "Send Email"

**Expected Result:**
- ✅ Modal closes
- ✅ Confirmation message appears
- ✅ No errors in console

---

## 📊 Test Case 6: Dashboard Analytics

### Step 1: View Dashboard
1. Navigate to **Dashboard** page
2. Should display KPI cards:
   - Active RFQs: 1
   - Pending Approvals: 0 (after approval)
   - Monthly Spend: Amount from PO
   - Overdue Invoices: 0

**Expected Result:**
- ✅ All KPIs display correct values
- ✅ Numbers match actual data
- ✅ Charts render correctly

### Step 2: View Charts
1. Scroll down to see charts
2. **Monthly Spend Chart:** Bar chart showing 6-month trend
3. **Category Spend:** Donut chart breakdown

**Expected Result:**
- ✅ Charts display with data
- ✅ Hover shows values
- ✅ Legend displays correctly

---

## 🕐 Test Case 7: Activity Logs

### Step 1: View All Activities
1. Navigate to **Activity Logs** page
2. Should see timeline of all events:
   - RFQ Created
   - RFQ Published
   - PO Created
   - PO Approved
   - Invoice Created

**Expected Result:**
- ✅ Timeline displays chronologically
- ✅ Each activity shows:
  - User who performed it
  - Action description
  - Activity type badge
  - Timestamp
- ✅ No errors in console

### Step 2: Filter Activities
1. Click filter buttons at top
2. Select "Approvals" filter
3. Should show only approval-related activities

**Expected Result:**
- ✅ List filters correctly
- ✅ Only approval activities shown
- ✅ Can click other filters to switch

---

## 🧪 Test Case 8: Error Handling

### Test Missing Required Fields
1. Go to **RFQs** → "+ Create RFQ"
2. Leave title empty
3. Try to click "Create RFQ"

**Expected Result:**
- ✅ Button disabled or error shown
- ✅ Clear error message
- ✅ Form not submitted

### Test Duplicate GST Number
1. Go to **Vendors**
2. Try to add vendor with duplicate GST from earlier
3. Click "Save Vendor"

**Expected Result:**
- ✅ Error message shown
- ✅ Vendor not added
- ✅ Error explains duplicate GST

---

## 🔄 Test Case 9: Complete Workflow End-to-End

Execute full workflow in order:

```
1. Create 3 Vendors ✅
2. Create RFQ ✅
3. Publish RFQ ✅
4. View 3 Quotations ✅
5. Select best quote ✅
6. Convert to PO ✅
7. Approve PO ✅
8. View generated Invoice ✅
9. Print Invoice ✅
10. Email Invoice ✅
11. Check Activity Logs ✅
12. Verify Dashboard metrics ✅
```

**Expected Result:**
- ✅ All steps complete without errors
- ✅ Data flows through all pages
- ✅ No console errors
- ✅ All statuses update correctly
- ✅ Activities logged for each action

---

## 📱 Test Case 10: Responsive Design

### Desktop (1920x1080)
1. All content visible
2. Sidebar on left
3. Tables scrollable
4. Buttons aligned

### Tablet (768x1024)
1. Sidebar may collapse
2. Tables responsive
3. Modals centered
4. Touch-friendly buttons

### Mobile (375x667)
1. Responsive layout
2. Sidebar stacks
3. Tables horizontal scroll
4. Readable text

**Expected Result:**
- ✅ App works on all screen sizes
- ✅ No overlapping elements
- ✅ Touch interactions smooth

---

## 🔍 Browser Console Checks

While testing, open Developer Tools (F12) and check:

### No JavaScript Errors
- Should see no red error messages
- Network requests should return 200/201
- Console should be clean

### Network Tab
1. Click "Network" tab
2. Perform actions (create RFQ, approve PO, etc.)
3. Verify requests:
   - POST /auth/login → 200
   - POST /rfqs → 201
   - PUT /purchase-orders/{id}/approve → 200
   - GET /invoices → 200

**Expected Result:**
- ✅ All API calls successful
- ✅ No 4xx/5xx errors
- ✅ Response times reasonable (< 2 seconds)

---

## 📝 Testing Checklist

Print or follow this checklist:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can login with default credentials
- [ ] Can create RFQ
- [ ] Can publish RFQ
- [ ] Can add vendors
- [ ] Can view quotations
- [ ] Can convert quotation to PO
- [ ] Can approve PO
- [ ] Invoice created automatically
- [ ] Can print invoice
- [ ] Can email invoice
- [ ] Activity logs show all actions
- [ ] Dashboard metrics accurate
- [ ] No console errors
- [ ] All API calls successful
- [ ] Responsive on mobile
- [ ] Can logout successfully

---

## 🐛 Troubleshooting

### Issue: Cannot login
**Solution:**
1. Verify backend is running: `npm run dev`
2. Check VITE_API_URL in frontend/.env
3. Ensure MongoDB connected (check backend logs)
4. Try default credentials again

### Issue: Pages not loading
**Solution:**
1. Check Network tab for failed requests
2. Verify API endpoints in console
3. Check backend logs for errors
4. Restart both frontend and backend

### Issue: Data not persisting
**Solution:**
1. Verify MongoDB connection
2. Check backend logs for save errors
3. Verify .env has correct MongoDB URI
4. Try reseeding database: `npm run seed`

### Issue: Modal not closing
**Solution:**
1. Check browser console for errors
2. Try pressing Escape key
3. Reload page if stuck
4. Check for overlapping Z-index issues

---

## ✨ Performance Testing

### Load Testing
1. Create 10 RFQs
2. Add 20 vendors
3. Create 5 POs
4. Check if pages still responsive

**Expected Result:**
- ✅ Pages load within 2 seconds
- ✅ Tables scroll smoothly
- ✅ No lag when filtering
- ✅ Search works quickly

---

## 📞 Support

If tests fail:
1. Check backend logs: `npm run dev` output
2. Check frontend console: F12 → Console tab
3. Verify database connection
4. Try reseeding: `npm run seed`
5. Restart both services

---

**Testing Version:** 1.0.0
**Last Updated:** June 2026

