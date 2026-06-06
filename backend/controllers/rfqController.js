const RFQ = require("../models/RFQ");
const Activity = require("../models/Activity");

let rfqCounter = 1;

exports.getAllRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find()
      .populate("vendors", "name category")
      .populate("createdBy", "firstName lastName");
    res.status(200).json({ success: true, rfqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id)
      .populate("vendors", "name category")
      .populate("createdBy", "firstName lastName");

    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ not found" });
    }

    res.status(200).json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRFQ = async (req, res) => {
  try {
    const { title, category, description, deadline, vendors, lineItems } = req.body;

    if (!title || !category || !deadline) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const rfqId = `RFQ-${new Date().getFullYear()}-${String(rfqCounter).padStart(3, "0")}`;
    rfqCounter++;

    const rfq = await RFQ.create({
      rfqId,
      title,
      category,
      description,
      deadline,
      vendors: vendors || [],
      lineItems: lineItems || [],
      createdBy: req.user.id,
    });

    await Activity.create({
      user: req.user.id,
      action: `Created RFQ ${rfqId}`,
      type: "RFQ",
      referenceId: rfq._id,
      referenceModel: "RFQ",
    });

    res.status(201).json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRFQ = async (req, res) => {
  try {
    let rfq = await RFQ.findById(req.params.id);

    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ not found" });
    }

    rfq = await RFQ.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.publishRFQ = async (req, res) => {
  try {
    let rfq = await RFQ.findById(req.params.id);

    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ not found" });
    }

    rfq.status = "Published";
    await rfq.save();

    await Activity.create({
      user: req.user.id,
      action: `Published RFQ ${rfq.rfqId}`,
      type: "RFQ",
      referenceId: rfq._id,
      referenceModel: "RFQ",
    });

    res.status(200).json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findByIdAndDelete(req.params.id);

    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ not found" });
    }

    res.status(200).json({ success: true, message: "RFQ deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
