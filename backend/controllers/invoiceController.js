const Invoice = require("../models/Invoice");
const Activity = require("../models/Activity");

let invoiceCounter = 1;

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("po", "poId amount")
      .populate("vendor", "name")
      .populate("createdBy", "firstName lastName");

    res.status(200).json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("po")
      .populate("vendor")
      .populate("createdBy", "firstName lastName");

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const { po, vendor, amount, due } = req.body;

    if (!po || !vendor || !amount || !due) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    const invoiceId = `INV-${new Date().getFullYear()}-${String(invoiceCounter).padStart(4, "0")}`;
    invoiceCounter++;

    const invoice = await Invoice.create({
      invoiceId,
      po,
      vendor,
      amount,
      due,
      createdBy: req.user.id,
    });

    await Activity.create({
      user: req.user.id,
      action: `Created Invoice ${invoiceId}`,
      type: "Invoice",
      referenceId: invoice._id,
      referenceModel: "Invoice",
    });

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.payInvoice = async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    invoice.status = "Paid";
    invoice.paidOn = new Date();
    await invoice.save();

    await Activity.create({
      user: req.user.id,
      action: `Marked Invoice ${invoice.invoiceId} as Paid`,
      type: "Invoice",
      referenceId: invoice._id,
      referenceModel: "Invoice",
    });

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    res.status(200).json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
