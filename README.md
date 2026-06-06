# 🚀 VendorBridge - Smart Vendor Management & Procurement ERP

> Streamlining Procurement, Vendor Collaboration, and Approval Workflows for Modern Businesses.

🌐 **Live Demo:** https://odoo-vendorbridge-2livbte2u.vercel.app/

---

## 📌 Problem Statement

Traditional procurement systems rely heavily on emails, spreadsheets, and manual approvals. This leads to:

* Delayed vendor communication
* Lack of quotation transparency
* Slow approval cycles
* Poor purchase order tracking
* Inefficient invoice management
* Limited visibility into procurement activities

Organizations need a centralized platform that connects procurement teams, vendors, and approvers in one place.

---

## 💡 Solution

VendorBridge is a full-stack procurement and vendor management ERP built using the MERN stack.

The platform enables organizations to:

* Manage vendors efficiently
* Create and publish RFQs
* Collect and compare quotations
* Automate approval workflows
* Generate purchase orders
* Track invoices
* Monitor procurement activities through analytics and reports

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* JWT-based Authentication
* Secure Login & Registration
* Role-Based Access Control
* Protected Routes

### 🏢 Vendor Management

* Add/Edit/Delete Vendors
* Vendor Directory
* Vendor Performance Tracking
* Vendor Information Management

### 📄 RFQ Management

* Create Request for Quotations
* Publish RFQs
* Manage RFQ Status
* Vendor RFQ Participation

### 💰 Quotation Management

* Receive Vendor Quotations
* Compare Quotations
* Select Best Vendor
* Pricing Analysis

### ✅ Approval Workflow

* Multi-Level Approval Process
* Approval History Tracking
* Approval/Rejection Notes
* Status Monitoring

### 🛒 Purchase Order Management

* Create Purchase Orders
* Approval-Based PO Generation
* PO Tracking
* Order Lifecycle Management

### 🧾 Invoice Management

* Invoice Upload & Tracking
* Payment Status Monitoring
* Invoice Approval Flow
* Invoice History

### 📊 Reports & Analytics

* Procurement Dashboard
* Activity Monitoring
* Spend Analysis
* Vendor Performance Insights

### 📜 Activity Logs

* System-wide Audit Trail
* User Activity Tracking
* Procurement Event Logging

---

## 🏗️ System Architecture

Frontend (React + Vite + TailwindCSS)

⬇

REST API Layer (Express.js)

⬇

Business Logic & Controllers

⬇

MongoDB Database

⬇

JWT Authentication & Role Management

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* JWT Authentication
* Mongoose ODM

### Database

* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Vercel

---

## 📂 Project Structure

```bash
VendorBridge/
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── routes/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── config/
│   └── utils/
│
└── README.md
```

## 🔄 Procurement Workflow

```text
Vendor Registration
        ↓
RFQ Creation
        ↓
RFQ Publication
        ↓
Quotation Submission
        ↓
Quotation Evaluation
        ↓
Approval Workflow
        ↓
Purchase Order Generation
        ↓
Invoice Submission
        ↓
Payment Processing
```

## 🔐 Security Features

* JWT Authentication
* Protected API Routes
* Password Hashing
* CORS Protection
* Environment Variable Configuration
* Role-Based Access Control

---

## ⚡ Installation

### Clone Repository

```bash
git clone <repository-url>
cd VendorBridge
```

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

### Backend

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🎯 Future Enhancements

* AI-Powered Vendor Recommendation
* Supplier Risk Analysis
* Automated Quotation Comparison
* Email Notification System
* Real-Time Chat Between Vendors & Buyers
* Multi-Tenant Organization Support
* Advanced Analytics Dashboard
* Mobile Application

---

## 📈 Impact

VendorBridge reduces procurement complexity by:

* Improving procurement visibility
* Accelerating approval workflows
* Increasing vendor transparency
* Reducing manual effort
* Centralizing procurement operations

---

## 👨‍💻 Developed By

Shubham Prajapati
Harsh Mistri
Shadab saiyed
Dwij Patel

Second Year Computer Engineering Student


---

## 📄 License

This project is developed for educational and hackathon purposes.
