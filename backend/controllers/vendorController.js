const Vendor = require("../models/Vendor");

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("createdBy", "firstName lastName");
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createVendor = async (req, res) => {
  try {
    const { name, category, gst, email, phone, contact, address, city, status } = req.body;

    if (!name || !category || !gst || !email || !phone || !contact || !city) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const vendor = await Vendor.create({
      name,
      category,
      gst,
      email,
      phone,
      contact,
      address,
      city,
      status,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    let vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, message: "Vendor deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
