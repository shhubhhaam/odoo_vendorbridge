# VendorBridge - Procurement ERP

Full-stack Procurement & Vendor Management System with real backend integration.

## Quick Setup Guide

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm

---

## Backend Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
The `.env` file is already created. Update if needed:
```
MONGODB_URI=mongodb://localhost:27017/vendorbridge
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

### 3. Start MongoDB (if local)
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

### 4. Start Backend Server
```bash
npm start
# or for development with auto-reload:
npm install -g nodemon
npm run dev
```

Backend will run on: **http://localhost:5000/api/v1**

---

## Frontend Setup

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Frontend will run on: **http://localhost:5174**

---

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Vendors
- `GET /vendors` - Get all vendors
- `POST /vendors` - Create vendor (protected)
- `PUT /vendors/:id` - Update vendor (protected)
- `DELETE /vendors/:id` - Delete vendor (protected)

### RFQs
- `GET /rfqs` - Get all RFQs
- `POST /rfqs` - Create RFQ (protected)
- `PUT /rfqs/:id/publish` - Publish RFQ (protected)

### Purchase Orders
- `GET /purchase-orders` - Get all POs
- `POST /purchase-orders` - Create PO (protected)
- `PUT /purchase-orders/:id/approve` - Approve PO (protected)
- `PUT /purchase-orders/:id/reject` - Reject PO (protected)

### Invoices
- `GET /invoices` - Get all invoices
- `POST /invoices` - Create invoice (protected)
- `PUT /invoices/:id/pay` - Mark as paid (protected)

### Activity Logs
- `GET /activities` - Get all activities
- `GET /activities/type/:type` - Get activities by type

---

## Default Test Credentials

```
Email: admin@vendorbridge.com
Password: password
```

To create another user, use the registration screen.

---

## Features

✅ **User Authentication**
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Registration & Login

✅ **Vendor Management**
- Register and manage vendors
- Track vendor information (GST, contact, category, rating)
- Filter by status and category

✅ **RFQ Management**
- Create Request for Quotations
- Publish RFQs to vendors
- Track responses

✅ **Purchase Orders**
- Create POs linked to quotations
- Multi-level approval workflow
- Track status (Pending, Approved, Rejected)

✅ **Invoice Management**
- Create invoices from POs
- Track payment status
- Manage overdue invoices

✅ **Activity Logs**
- Complete audit trail
- Filter by activity type
- Real-time updates

✅ **Dashboard**
- KPI cards with metrics
- Spend analysis charts
- Recent activity overview

---

## Technology Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18+
- Vite
- Tailwind CSS
- Axios for API calls
- Context API for state management

---

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, use connection string: `mongodb+srv://username:password@cluster.mongodb.net/vendorbridge`

### Port Already in Use
```bash
# Kill process on port 5000 (Backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5174 (Frontend)
lsof -ti:5174 | xargs kill -9
```

### API Not Responding
- Check backend logs for errors
- Verify `VITE_API_URL` in frontend `.env`
- Ensure CORS is enabled in backend

---

## File Structure

```
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth & custom middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── .env           # Environment variables
│   └── server.js      # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── context/    # React Context (Auth)
│   │   ├── services/   # API service layer
│   │   ├── pages/      # Page components
│   │   ├── App.jsx     # Main app
│   │   └── main.jsx    # Entry point
│   ├── .env            # Environment variables
│   └── vite.config.js  # Vite configuration
```

---

## Next Steps

1. Test authentication by registering a new user
2. Add vendors through the UI
3. Create RFQs and manage quotations
4. Test the approval workflow
5. Generate reports from the dashboard

---

## Support

For issues or improvements, please check the API response messages and browser console for detailed error logs.

