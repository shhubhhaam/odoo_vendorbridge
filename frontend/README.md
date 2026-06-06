# Odoo VendorBridge

A full-stack vendor management platform built with **React**, **Vite**, **Node.js**, and **Express.js** that simplifies vendor onboarding, management, and communication through a modern web interface and scalable backend architecture.

## 🌐 Live Demo

**Application URL:**
https://8a09-49-36-81-168.ngrok-free.app/

> **Note:** The current demo is hosted using an ngrok tunnel and may change when the tunnel is restarted.

---

## 🚀 Features

* Vendor registration and onboarding
* Vendor profile management
* Secure backend API architecture
* Modern React frontend
* Express.js REST APIs
* Middleware-based request processing
* Environment-based configuration
* Modular and scalable project structure
* Database integration support
* Responsive user interface

---

## 🏗️ Architecture

```text
Frontend (React + Vite)
          │
          ▼
Backend API (Node.js + Express)
          │
          ▼
       Database
```

---

## 📁 Project Structure

```text
odoo_vendorbridge/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
│
├── CHANGES.md
├── IMPLEMENTATION_SUMMARY.md
├── QUICK_REFERENCE.md
├── README.md
├── SETUP.md
├── TESTING.md
└── WORKFLOW.md
```

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js

### Development Tools

* Git
* npm
* Environment Variables

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shhubhhaam/odoo_vendorbridge.git
cd odoo_vendorbridge
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm start
```

or

```bash
node server.js
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Frontend will be available at:

```text
http://localhost:5173
```

---

## 🚀 Running the Project

### Start Backend

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 🔗 API Integration

The frontend communicates with the backend through REST APIs.

Example request:

```javascript
fetch("/api/vendors")
```

Update API endpoints through environment variables for production deployments.

---

## 🧪 Testing

Refer to:

```text
TESTING.md
```

for detailed testing instructions and validation procedures.

---

## 📚 Documentation

Additional project documentation:

| File                      | Description                  |
| ------------------------- | ---------------------------- |
| SETUP.md                  | Installation and setup guide |
| QUICK_REFERENCE.md        | Quick development reference  |
| WORKFLOW.md               | Development workflow         |
| IMPLEMENTATION_SUMMARY.md | Implementation details       |
| TESTING.md                | Testing procedures           |
| CHANGES.md                | Project changes and updates  |

---

## 🚀 Deployment

### Build Frontend

```bash
cd frontend
npm run build
```

### Production Backend

```bash
cd backend
npm install --production
npm start
```

### Deployment Platforms

* Vercel (Frontend)
* Netlify (Frontend)
* Render
* Railway
* DigitalOcean
* AWS
* Azure

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

Feel free to use, modify, and distribute this software in accordance with the license terms.


**Happy Coding! 🚀**
