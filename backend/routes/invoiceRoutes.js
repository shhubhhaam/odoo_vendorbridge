const express = require("express");
const {
  getAllInvoices,
  getInvoice,
  createInvoice,
  payInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");

const router = express.Router();

/**
 * FIX 6: GET "/" and GET "/:id" were unauthenticated — any anonymous caller
 *         could read invoice amounts and vendor details.
 *
 * FIX 7: payInvoice previously allowed the "Vendor" role.
 *         A vendor marking their own invoice as Paid is a serious financial
 *         control failure — only Procurement Officers and Admins may do this.
 *
 * FIX 8: getInvoice (single) also needed Vendor scoping; moved scoping
 *         logic to controller (see invoiceController fix).
 */

router.get("/", protect, getAllInvoices);  // controller handles Vendor scoping
router.get("/:id", protect, getInvoice);  // controller validates ownership for Vendors

router.post(
  "/",
  protect,
  authorizeRoles("Procurement Officer", "Admin"),
  createInvoice
);

// REMOVED "Vendor" from payInvoice — vendors must NOT self-approve payments
router.put(
  "/:id/pay",
  protect,
  authorizeRoles("Procurement Officer", "Admin"),
  payInvoice
);

router.delete("/:id", protect, authorizeRoles("Admin"), deleteInvoice);

module.exports = router;
