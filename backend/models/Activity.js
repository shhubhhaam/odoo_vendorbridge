const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    type: { type: String, enum: ["RFQ", "Quotation", "PurchaseOrder", "Invoice", "Vendors", "Approvals"], required: true },
    referenceId: String,
    referenceModel: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
