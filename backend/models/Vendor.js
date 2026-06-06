const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    gst: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    contact: { type: String, required: true },
    address: String,
    city: { type: String, required: true },
    status: { type: String, enum: ["Active", "Pending", "Inactive"], default: "Pending" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalOrders: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
