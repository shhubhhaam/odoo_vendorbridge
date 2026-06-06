const RFQ = require("../models/RFQ");
const Vendor = require("../models/Vendor");
const Activity = require("../models/Activity");

// In-memory counter is reset on server restart — use DB sequence in production
let rfqCounter = 1;

/**
 * FIX 19: getAllRFQs previously ran `if (req.user && ...)` — the `&&` implied
 *          req.user could be undefined, meaning an unauthenticated caller got
 *          ALL RFQs with query = {} (no filter at all), including Draft RFQs
 *          with confidential pricing.
 *          Now that the route is protected, req.user is always present.
 *          Vendor role is scoped to Published + invited-only RFQs.
 *          All other roles see everything (Admins, Officers, Managers).
 *
 * FIX 20: updateRFQ — previously allowed updating any field including `status`,
 *          meaning a Procurement Officer could self-approve by setting
 *          status = "Approved". Now status changes are blocked via this route;
 *          use the dedicated /publish, /approve, /reject endpoints.
 */

exports.getAllRFQs = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "Vendor") {
      const vendor = await Vendor.findOne({ email: req.user.email });

      if (!vendor) {
        // Vendor user has no vendor profile — return empty list
        return res.status(200).json({ success: true, rfqs: [] });
      }

      // Vendors see only Published RFQs where they are invited (or open invitation)
      query = {
        status: "Published",
        $or: [{ vendors: { $size: 0 } }, { vendors: vendor._id }],
      };
    }
    // Admin / Procurement Officer / Manager see all RFQs without restriction

    const rfqs = await RFQ.find(query)
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

    // FIX: Vendors can only see Published RFQs they are invited to
    if (req.user.role === "Vendor") {
      if (rfq.status !== "Published") {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      const vendor = await Vendor.findOne({ email: req.user.email });
      if (
        vendor &&
        rfq.vendors.length > 0 &&
        !rfq.vendors.some((v) => v._id.equals(vendor._id))
      ) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    res.status(200).json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRFQ = async (req, res) => {
  try {
    const { title, category, description, deadline, vendors, lineItems } =
      req.body;

    if (!title || !category || !deadline) {
      return res
        .status(400)
        .json({ success: false, message: "title, category, and deadline are required" });
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
      createdBy: req.user._id,
    });

    await Activity.create({
      user: req.user._id,
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

    // FIX 20: Block status manipulation through the generic update endpoint
    const { status, ...safeUpdates } = req.body;
    if (status) {
      return res.status(400).json({
        success: false,
        message: "Use the dedicated /publish endpoint to change RFQ status",
      });
    }

    // FIX: Only allow editing Draft RFQs — Published/Closed RFQs are locked
    if (rfq.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: `Cannot edit an RFQ with status "${rfq.status}"`,
      });
    }

    rfq = await RFQ.findByIdAndUpdate(req.params.id, safeUpdates, { new: true, runValidators: true });

    res.status(200).json({ success: true, rfq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.publishRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);

    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ not found" });
    }

    if (rfq.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: `RFQ is already in "${rfq.status}" state`,
      });
    }

    rfq.status = "Published";
    await rfq.save();

    await Activity.create({
      user: req.user._id,
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
