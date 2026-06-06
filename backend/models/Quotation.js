const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema(
  {
    quotationId: { type: String, unique: true },
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ", required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    gstAmount: { type: Number, required: true },
    total: { type: Number, required: true },
    delivery: { type: Number, required: true },
    paymentTerms: String,
    notes: String,
    status: { type: String, enum: ["Submitted", "Approved", "Rejected"], default: "Submitted" },
    rating: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", quotationSchema);
