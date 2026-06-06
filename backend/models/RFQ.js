const mongoose = require("mongoose");

const rfqSchema = new mongoose.Schema(
  {
    rfqId: { type: String, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["Draft", "Published", "Closed"], default: "Draft" },
    vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
    lineItems: [
      {
        name: String,
        quantity: Number,
        unit: String,
      },
    ],
    responses: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RFQ", rfqSchema);
