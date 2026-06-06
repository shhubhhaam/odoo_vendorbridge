const PurchaseOrder = require("../models/PurchaseOrder");
const Vendor = require("../models/Vendor");
const Activity = require("../models/Activity");

let poCounter = 1;

exports.getAllPOs = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role === "Vendor") {
      const vendor = await Vendor.findOne({ email: req.user.email });
      if (vendor) {
        query = { vendor: vendor._id };
      } else {
        return res.status(200).json({ success: true, pos: [] });
      }
    }

    const pos = await PurchaseOrder.find(query)
      .populate("vendor", "name email")
      .populate("quotation")
      .populate("createdBy", "firstName lastName");

    res.status(200).json({ success: true, pos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPO = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id)
      .populate("vendor")
      .populate("quotation")
      .populate("createdBy", "firstName lastName");

    if (!po) {
      return res.status(404).json({ success: false, message: "PO not found" });
    }

    res.status(200).json({ success: true, po });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPO = async (req, res) => {
  try {
    const { vendor, quotation, amount, items, lineItems } = req.body;

    if (!vendor || !amount) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const poId = `PO-${new Date().getFullYear()}-${String(poCounter).padStart(4, "0")}`;
    poCounter++;

    const po = await PurchaseOrder.create({
      poId,
      vendor,
      quotation,
      amount,
      items: items || 0,
      lineItems: lineItems || [],
      createdBy: req.user.id,
    });

    await Activity.create({
      user: req.user.id,
      action: `Created PO ${poId}`,
      type: "PurchaseOrder",
      referenceId: po._id,
      referenceModel: "PurchaseOrder",
    });

    res.status(201).json({ success: true, po });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePO = async (req, res) => {
  try {
    let po = await PurchaseOrder.findById(req.params.id);

    if (!po) {
      return res.status(404).json({ success: false, message: "PO not found" });
    }

    po = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ success: true, po });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approvePO = async (req, res) => {
  try {
    const { remarks } = req.body;
    let po = await PurchaseOrder.findById(req.params.id);

    if (!po) {
      return res.status(404).json({ success: false, message: "PO not found" });
    }

    po.status = "Approved";
    po.approvalHistory.push({
      level: "L2",
      status: "Approved",
      approvedBy: req.user.id,
      remarks,
      date: new Date(),
    });

    await po.save();

    await Activity.create({
      user: req.user.id,
      action: `Approved PO ${po.poId}`,
      type: "Approvals",
      referenceId: po._id,
      referenceModel: "PurchaseOrder",
    });

    res.status(200).json({ success: true, po });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectPO = async (req, res) => {
  try {
    const { remarks } = req.body;
    let po = await PurchaseOrder.findById(req.params.id);

    if (!po) {
      return res.status(404).json({ success: false, message: "PO not found" });
    }

    po.status = "Rejected";
    po.approvalHistory.push({
      level: "L2",
      status: "Rejected",
      approvedBy: req.user.id,
      remarks,
      date: new Date(),
    });

    await po.save();

    await Activity.create({
      user: req.user.id,
      action: `Rejected PO ${po.poId} with remarks`,
      type: "Approvals",
      referenceId: po._id,
      referenceModel: "PurchaseOrder",
    });

    res.status(200).json({ success: true, po });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePO = async (req, res) => {
  try {
    const po = await PurchaseOrder.findByIdAndDelete(req.params.id);

    if (!po) {
      return res.status(404).json({ success: false, message: "PO not found" });
    }

    res.status(200).json({ success: true, message: "PO deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
