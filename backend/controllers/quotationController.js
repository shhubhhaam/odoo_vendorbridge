const Quotation = require("../models/Quotation");
const RFQ = require("../models/RFQ");
const Vendor = require("../models/Vendor");
const Activity = require("../models/Activity");

exports.createQuotation = async (req, res) => {
  try {
    const rfqId = req.params.id;
    const rfq = await RFQ.findById(rfqId);
    if (!rfq) return res.status(404).json({ success: false, message: "RFQ not found" });
    if (rfq.status !== "Published") return res.status(400).json({ success: false, message: "RFQ is not published" });

    // Find vendor record linked to this user by email
    const vendor = await Vendor.findOne({ email: req.user.email });
    if (!vendor) return res.status(400).json({ success: false, message: "Vendor profile not found for this user" });

    // If RFQ has an invitation list, ensure vendor is invited
    if (rfq.vendors && rfq.vendors.length > 0 && !rfq.vendors.includes(vendor._id)) {
      return res.status(403).json({ success: false, message: "You are not invited to quote for this RFQ" });
    }

    const { subtotal, gst, delivery, paymentTerms, notes } = req.body;
    if (subtotal == null || gst == null || delivery == null) {
      return res.status(400).json({ success: false, message: "Missing quotation fields" });
    }

    const gstAmount = (subtotal * gst) / 100;
    const total = subtotal + gstAmount;

    const quotation = await Quotation.create({
      rfq: rfq._id,
      vendor: vendor._id,
      subtotal,
      gst,
      gstAmount,
      total,
      delivery,
      paymentTerms,
      notes,
      createdBy: req.user._id,
    });

    rfq.responses = (rfq.responses || 0) + 1;
    await rfq.save();

    await Activity.create({
      user: req.user._id,
      action: `Submitted quotation for ${rfq.rfqId}`,
      type: "Quotation",
      referenceId: quotation._id,
      referenceModel: "Quotation",
    });

    res.status(201).json({ success: true, quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getQuotationsByRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);
    if (!rfq) return res.status(404).json({ success: false, message: "RFQ not found" });

    const quotations = await Quotation.find({ rfq: rfq._id }).populate("vendor", "name city rating").populate("createdBy", "firstName lastName");
    res.status(200).json({ success: true, quotations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
