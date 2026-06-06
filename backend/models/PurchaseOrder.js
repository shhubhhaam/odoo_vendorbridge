const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema(
  {
    poId: { type: String, unique: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation" },
    rfq: { type: mongoose.Schema.Types.ObjectId, ref: "RFQ" },
    amount: { type: Number, required: true },
    items: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Delivered"], default: "Pending" },
    date: { type: Date, default: Date.now },
    lineItems: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number,
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvalHistory: [
      {
        level: String,
        status: String,
        approvedBy: String,
        remarks: String,
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);
