require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const rfqRoutes = require("./routes/rfqRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const activityRoutes = require("./routes/activityRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect to Database
connectDB();

// ─── SECURITY MIDDLEWARE ──────────────────────────────────────────────────────

/**
 * FIX 2: CORS was wide-open (`cors()` with no options).
 *         Now restricted to VITE_FRONTEND_URL (or localhost:5173 in dev).
 *         Any cross-origin request from an unknown origin is rejected.
 */
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl in dev)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" })); // FIX: Limit request body size

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/rfqs", rfqRoutes);
app.use("/api/v1/purchase-orders", purchaseOrderRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/activities", activityRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "VendorBridge API" });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
// FIX: Centralized error handler so unhandled errors don't leak stack traces
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});
