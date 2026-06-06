# VendorBridge Quick Reference

One-page guide to all procurement workflow features.

---

## 🎯 Main Pages

| Page | Purpose | Key Actions |
|------|---------|-------------|
| **Dashboard** | Overview & metrics | View KPIs, spend trends, analytics |
| **Vendors** | Supplier management | Add/edit vendors, filter by status |
| **RFQs** | Request quotations | Create, publish, track responses |
| **Quotations** | Compare bids | View 3+ quotes, select best, create PO |
| **Approvals** | Review POs | Multi-level approval with remarks |
| **Purchase Orders** | Track orders | View POs, invoices, print/email |
| **Activity Logs** | Audit trail | Filter by type, track all actions |

---

## 🔄 Procurement Workflow

```
CREATE RFQ (Draft)
    ↓ [Publish]
PUBLISH RFQ (Published)
    ↓
COLLECT QUOTATIONS (3+ received)
    ↓ [View Quotes]
COMPARE QUOTATIONS (Side-by-side)
    ↓ [Select Best] [Convert to PO]
CREATE PURCHASE ORDER (Pending)
    ↓ [Review]
APPROVE PURCHASE ORDER (Approved)
    ↓
AUTO-GENERATE INVOICE
    ↓ [Print/Email]
SEND TO VENDOR
    ↓
TRACK & ANALYTICS
```

---

## 📋 Page Features

### Dashboard
- 📊 **KPI Cards:** RFQs, Approvals, Spend, Overdue
- 📈 **Spend Chart:** 6-month trend (bar chart)
- 🎯 **Category Chart:** Spend breakdown (donut chart)

### Vendors
- ➕ Add vendor with details (name, GST, city, category)
- 🔍 Search by name or email
- 🏷️ Filter by status (Active/Pending/Inactive)
- 📂 Filter by category
- ⭐ View vendor ratings

### RFQs
- ➕ Create RFQ with title, description, deadline
- 📢 Publish to vendors
- 📝 Track quotation responses
- 🔄 Filter by status (Draft/Published/Closed)

### Quotations
- 📊 View 3+ vendor quotes side-by-side
- 💰 Compare total cost (with GST)
- ⏱️ Delivery time comparison
- 💳 Payment terms review
- ✅ Select best quote (visual checkmark)
- ➡️ Convert to PO with item count

### Approvals
- 📋 Queue of pending POs
- ✔️ Review PO details and history
- ✍️ Add approval remarks
- ✅ Approve or reject
- 📜 View approval history timeline

### Purchase Orders & Invoices
- **POs Tab:**
  - View all purchase orders
  - Track status progression
  - See vendor and amount
- **Invoices Tab:**
  - List all invoices with status
  - 🖨️ **Print:** Professional invoice preview
  - 📧 **Email:** Send invoice to vendor

### Activity Logs
- 🔄 Complete audit trail
- 🔍 Filter by type (All, RFQ, Approvals, Invoice, Vendors)
- ⏰ Timestamp for each action
- 👤 User who performed action
- 💬 Action details (RFQ created, PO approved, etc.)

---

## 📊 Data Flow

### RFQ Creation
```
Input: Title, Category, Description, Deadline
↓
Output: RFQ with auto-ID (RFQ-2024-001)
Status: Draft
```

### Quotation to PO
```
Input: Selected quotation + item count
↓
Output: Purchase Order with auto-ID (PO-2024-0001)
Amount: Quote amount + 18% GST
Status: Pending
```

### PO to Invoice
```
Input: Approved PO
↓
Output: Invoice with auto-ID (INV-2024-0001)
Amount: PO total
Status: Pending
Due: PO date + payment terms
```

---

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| **Procurement Manager** | Create/publish RFQs, create POs |
| **Finance Head** | Approve invoices, view reports |
| **Operations Director** | Approve POs, override decisions |
| **Vendor Manager** | Manage vendors, track relationships |
| **Admin** | Full system access |

---

## ⚡ Quick Actions

### Create RFQ (2 min)
1. Click RFQs → "+ Create RFQ"
2. Enter title, category, description, deadline
3. Click "Create RFQ"
4. Click "Publish" on draft RFQ

### Convert Quote to PO (1 min)
1. Go Quotations → Select RFQ
2. Click quotation card (gets checkmark)
3. Click "Convert to PO →"
4. Enter items count
5. Click "Create PO"

### Approve PO (1 min)
1. Go Approvals → PO from queue
2. Click "Review →"
3. Add remarks (optional)
4. Click "Approve PO →"

### Email Invoice (30 sec)
1. Go Purchase Orders → Invoices
2. Click "📧 Email"
3. Verify email address
4. Click "Send Email"

---

## 🎨 Status Colors

| Status | Color | Meaning |
|--------|-------|---------|
| **Draft** | Gray | Not yet published |
| **Published** | Blue | Active, waiting for quotes |
| **Submitted** | Indigo | Quotation received |
| **Pending** | Amber | Awaiting approval |
| **Approved** | Green | Approved, ready for invoice |
| **Rejected** | Red | Rejected, requires revision |
| **Paid** | Green | Invoice paid |
| **Overdue** | Red | Payment past due |

---

## 📱 Mobile Support

✅ Responsive design works on:
- **Desktop** (1920x1080)
- **Tablet** (768x1024)
- **Mobile** (375x667)

---

## 🔗 API Endpoints Used

```
POST   /api/v1/auth/login              → Login
GET    /api/v1/rfqs                    → List RFQs
POST   /api/v1/rfqs                    → Create RFQ
PUT    /api/v1/rfqs/:id/publish        → Publish RFQ
GET    /api/v1/vendors                 → List vendors
POST   /api/v1/vendors                 → Create vendor
GET    /api/v1/purchase-orders         → List POs
POST   /api/v1/purchase-orders         → Create PO
PUT    /api/v1/purchase-orders/:id/approve  → Approve
GET    /api/v1/invoices                → List invoices
POST   /api/v1/invoices                → Create invoice
GET    /api/v1/activities              → Activity logs
```

---

## 🆘 Common Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+P | Print current page |
| Escape | Close modal |
| Ctrl+K | Search (if implemented) |
| F12 | Open developer tools |

---

## 💡 Pro Tips

1. **Create 3+ Quotes** → Better comparison and cost savings
2. **Add Remarks** → Maintains audit trail for approvals
3. **Use Categories** → Makes vendor filtering easier
4. **Set Realistic Deadlines** → Allow vendors time to quote
5. **Print Before Emailing** → Verify invoice looks correct
6. **Check Activity Logs** → Troubleshoot process issues

---

## ✅ Success Indicators

You'll know the system is working when:

- ✅ RFQ publishes successfully
- ✅ Quotations appear in comparison
- ✅ PO converts from quote
- ✅ Approval workflow completes
- ✅ Invoice auto-generates
- ✅ Email sends to vendor
- ✅ Activity log shows all actions
- ✅ Dashboard KPIs update

---

## 🐛 Quick Diagnostics

| Issue | Check |
|-------|-------|
| Can't login | Backend running? MongoDB connected? |
| No RFQs showing | Did you publish any RFQs? |
| Can't convert quote | Did you click the quotation first? |
| PO stuck pending | Is approver role correct? |
| Invoice not emailing | Vendor email correct? API error? |

---

## 📞 Getting Help

1. **Check Console** (F12) for error messages
2. **View Activity Logs** to trace where process failed
3. **Review Workflow Guide** for step-by-step process
4. **Check Testing Guide** for troubleshooting

---

## 🎓 Learning Path

**New User:**
1. Read this quick reference
2. Login with test credentials
3. Follow Testing Guide - Test Case 1-4
4. Review your created data

**Advanced User:**
1. Complete full workflow (Test Case 9)
2. Understand approval levels
3. Review KPIs on dashboard
4. Analyze activity patterns

**Administrator:**
1. Add/manage vendors
2. Monitor metrics
3. Review audit trails
4. Generate reports

---

## 📊 KPI Formulas

```
Active RFQs = COUNT(RFQ WHERE status = "Published")

Pending Approvals = COUNT(PO WHERE status = "Pending")

Monthly Spend = SUM(PO.amount WHERE createdAt THIS MONTH)

Overdue Invoices = SUM(Invoice.amount WHERE status = "Overdue")

Avg Quote Response = Total Quotes / Total RFQs

Cost Savings = (First Quote - Selected Quote) / First Quote * 100%
```

---

**Quick Reference Version:** 1.0.0
**Last Updated:** June 2026
**For Full Documentation:** See WORKFLOW.md

