const express = require("express");
const { getAllInvoices, getInvoice, createInvoice, payInvoice, deleteInvoice } = require("../controllers/invoiceController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllInvoices);
router.get("/:id", getInvoice);
router.post("/", protect, createInvoice);
router.put("/:id/pay", protect, payInvoice);
router.delete("/:id", protect, deleteInvoice);

module.exports = router;
