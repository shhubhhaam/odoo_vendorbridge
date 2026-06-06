# VendorBridge Procurement Workflow Guide

Complete step-by-step guide for the end-to-end procurement process.

---

## 📋 Workflow Overview

```
1. RFQ Creation
    ↓
2. Publish RFQ to Vendors
    ↓
3. Vendors Submit Quotations
    ↓
4. Compare Quotations
    ↓
5. Select Best Quote & Create PO
    ↓
6. Multi-Level Approval
    ↓
7. Generate Invoice
    ↓
8. Print/Email Invoice
    ↓
9. Track Activities & Analytics
```

---

## 🔄 Step-by-Step Process

### Step 1: Create RFQ (Request for Quotation)
**Location:** RFQs → "+ Create RFQ" button

1. Click "Create RFQ" button
2. Fill in the following details:
   - **RFQ Title:** What you're requesting (e.g., "Office Supplies Request")
   - **Category:** Select from dropdown (IT Services, Software, Hardware, etc.)
   - **Description:** Detailed requirements for vendors
   - **Deadline:** When vendors should submit quotations
3. Click "Create RFQ"
4. RFQ will be created in **Draft** status

**Activity Logged:** "Created RFQ - {RFQ_ID}"

---

### Step 2: Publish RFQ to Vendors
**Location:** RFQs → Draft RFQ → "Publish" button

1. Navigate to RFQs page
2. Find your new RFQ (status: Draft)
3. Click "Publish" button
4. RFQ status changes to **Published**
5. Vendors receive notification and can view/submit quotes

**Activity Logged:** "Published RFQ - {RFQ_ID}"

---

### Step 3: Vendors Submit Quotations
**What Happens:** Vendors receive notification and submit quotation responses
- Vendor provides pricing, delivery time, and payment terms
- Each response creates a **Quotation** record
- RFQ tracks number of responses received

---

### Step 4: Compare Quotations
**Location:** Quotations → "View Quotes" (or select RFQ)

1. Go to **Quotations** page
2. Click "View Quotes" on published RFQ
3. See all quotations side-by-side:
   - **Vendor Name & Rating**
   - **Quote Amount** (with GST calculation)
   - **Total (incl. GST)**
   - **Delivery Time**
   - **Payment Terms**
4. Click quotation card to select (checkmark appears)
5. Compare based on price, delivery, and terms

**Selection Criteria:**
- Lowest total cost
- Fastest delivery
- Best payment terms
- Vendor rating/reputation

---

### Step 5: Convert Quotation to Purchase Order
**Location:** Quotations → Selected Quote → "Convert to PO →" button

1. Select best quotation by clicking on it
2. Click "Convert to PO →" button
3. Modal appears with:
   - Selected Vendor details
   - Quote amount
   - Number of items field
   - Optional comments
4. Confirm and click "Create PO"
5. **Purchase Order** is created in **Pending** status

**What's Generated:**
- PO ID: Auto-generated (e.g., "PO-2024-0001")
- Linked to quotation and vendor
- Amount from quotation (including GST)
- Ready for approval workflow

---

### Step 6: Multi-Level Approval Workflow
**Location:** Approvals → Queue of Pending POs

1. Go to **Approvals** page
2. View all pending purchase orders requiring approval
3. Click "Review →" to open PO details
4. Review:
   - PO amount and vendor
   - Line items and quantities
   - Previous approval levels (if any)
5. Add approval remarks (optional)
6. Click "Approve PO →"
   - Status changes to **Approved**
   - Your name + remarks added to approval history
   - Next level can now approve (if applicable)

**Approval Levels:**
- Level 1: Procurement Manager
- Level 2: Finance Head (optional)
- Level 3: Operations Director (optional)

**Activity Logged:** "Approved PO - {PO_ID}"

---

### Step 7: Generate Invoice
**Location:** Purchase Orders & Invoices → "Invoices" tab

1. Navigate to **Purchase Orders & Invoices**
2. Go to **Invoices** tab
3. View all invoices linked to approved POs
4. Invoice details show:
   - Invoice ID (auto-generated)
   - Vendor name
   - Amount and due date
   - Payment status

**Automatic Generation:**
- Invoice created when PO status = "Approved"
- Amount = PO total (including GST)
- Due date calculated based on payment terms
- Initial status = "Pending"

---

### Step 8: Print or Email Invoice
**Location:** Purchase Orders & Invoices → Invoices Tab → Invoice Actions

#### Print Invoice
1. Find invoice in list
2. Click "🖨️ Print" button
3. Professional invoice preview appears showing:
   - Invoice number and date
   - From/To details
   - Amount breakdown (subtotal, tax, total)
   - Due date and payment status
4. Click "Print Invoice" or use browser print (Ctrl+P)

#### Email Invoice
1. Find invoice in list
2. Click "📧 Email" button
3. Modal appears with:
   - **To:** Vendor email (pre-filled)
   - **Subject:** Invoice number (editable)
   - **Message:** Custom message (optional)
4. Fill details and click "Send Email"
5. Email sent to vendor with invoice attached

---

### Step 9: Track Procurement Activities
**Location:** Activity Logs → View all activities

Activity Log tracks every action:
- ✅ RFQ Created
- ✅ RFQ Published
- ✅ Quotation Submitted (by vendor)
- ✅ PO Created
- ✅ PO Approved (with approver name & remarks)
- ✅ Invoice Created
- ✅ Invoice Paid

**Filter by Type:**
- **All:** All activities
- **RFQ:** RFQ-related events
- **Approvals:** Approval workflow events
- **Invoice:** Invoice events
- **Vendors:** Vendor-related events

---

## 📊 Dashboard Metrics

The **Dashboard** shows real-time KPIs:

1. **Active RFQs:** Number of published RFQs
2. **Pending Approvals:** POs awaiting approval
3. **Monthly Spend:** Total procurement spending (this month)
4. **Overdue Invoices:** Amount of unpaid, overdue invoices

**Charts:**
- Monthly Procurement Spend (Bar chart trend)
- Spend by Category (Donut chart breakdown)

---

## 👥 Vendor Management

**Location:** Vendors → Management Interface

### Register Vendors
1. Click "+ Add Vendor" button
2. Fill vendor details:
   - Company name
   - GST number (unique)
   - Category
   - Email, phone, contact person
   - City
   - Address
3. Status defaults to "Active"
4. Click "Save Vendor"

### Manage Vendors
- **View:** Click "View" to see vendor details
- **Edit:** Update vendor information
- **Delete:** Remove vendor from system
- **Filter:** By status (Active/Pending/Inactive) or category

### Vendor Information
- Vendor ID and name
- GST number
- Contact details
- Rating (1-5 stars)
- Total orders
- Total spend
- Current status

---

## 📈 Reports & Analytics

**Location:** Dashboard

### Metrics Displayed
1. **Procurement Spend Trend**
   - Monthly spend for last 6 months
   - Helps identify spending patterns
   - Budget planning tool

2. **Spend by Category**
   - Breakdown by procurement categories
   - Identifies top spending areas
   - Category-wise analysis

3. **Vendor Performance**
   - Rating-based vendor selection
   - Repeat order tracking
   - Vendor reliability metrics

---

## 🔒 Security & Access Control

### Role-Based Access
- **Procurement Manager:** Create/manage RFQs
- **Finance Head:** Approve invoices
- **Operations Director:** Approve POs
- **Vendor Manager:** Manage vendor relationships
- **Admin:** Full system access

### Authentication
- Secure login with JWT tokens
- Password encryption with bcryptjs
- Session management
- Automatic logout on inactivity

---

## 💡 Best Practices

### RFQ Creation
- ✓ Clear, detailed requirements
- ✓ Realistic deadlines (minimum 7 days)
- ✓ Specific categories for better vendor matching
- ✓ Include quality standards

### Quotation Comparison
- ✓ Compare total cost (including GST)
- ✓ Consider delivery timeline
- ✓ Evaluate vendor reputation
- ✓ Check payment terms

### Approval Workflow
- ✓ Review all PO details before approval
- ✓ Add meaningful remarks
- ✓ Follow approval levels
- ✓ Maintain audit trail

### Invoice Management
- ✓ Verify invoice against PO
- ✓ Process payments on time
- ✓ Send reminders for overdue invoices
- ✓ Maintain payment records

---

## ⚠️ Common Issues & Solutions

### Issue: RFQ Not Receiving Quotations
**Solution:**
- Verify RFQ is Published (not Draft)
- Check deadline hasn't passed
- Ensure vendors were notified
- Verify vendor email addresses

### Issue: PO Stuck in Pending Approval
**Solution:**
- Check approval level requirements
- Verify approver has required role
- Review approval remarks for rejection reasons
- Contact approver if needed

### Issue: Invoice Amount Mismatch
**Solution:**
- Verify GST percentage (18% default)
- Check line items quantity
- Confirm unit prices with quotation
- Review approval history

### Issue: Email Not Sending
**Solution:**
- Verify vendor email is correct
- Check email server configuration
- Verify no typos in recipient email
- Try again or resend

---

## 📝 Workflow Checklist

Use this checklist to ensure all steps are completed:

- [ ] RFQ created with clear requirements
- [ ] RFQ published to qualified vendors
- [ ] Vendors submit quotations (minimum 3)
- [ ] Quotations compared on price, delivery, terms
- [ ] Best quotation selected
- [ ] PO created and sent to vendor
- [ ] PO approved by Finance Head
- [ ] PO approved by Operations Director (if required)
- [ ] Invoice generated
- [ ] Invoice verified against PO
- [ ] Invoice printed/emailed to vendor
- [ ] Payment processed
- [ ] Activity logs reviewed for audit trail

---

## 🎯 Key Performance Indicators (KPIs)

Track these metrics to measure procurement efficiency:

1. **RFQ-to-PO Cycle Time**
   - Average days from RFQ creation to PO approval
   - Target: < 15 days

2. **Quotation Response Rate**
   - % of vendors responding with quotations
   - Target: > 70%

3. **Cost Savings**
   - Average negotiated discount from initial quote
   - Target: > 10%

4. **On-Time Delivery Rate**
   - % of purchases delivered by promised date
   - Target: > 95%

5. **Invoice Processing Time**
   - Average days from PO approval to invoice payment
   - Target: < 30 days

6. **Vendor Rating**
   - Average vendor performance rating
   - Target: > 4.0/5.0

---

## 📞 Support & Contact

For issues or questions:
- **Email:** support@vendorbridge.com
- **Phone:** +91-XXXX-XXXX-XXXX
- **Portal:** Check Activity Logs for error details
- **Documentation:** Refer to workflow guide

---

**Last Updated:** June 2026
**Version:** 1.0.0

