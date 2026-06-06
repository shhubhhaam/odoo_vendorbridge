const express = require("express");
const {
  getAllRFQs,
  getRFQ,
  createRFQ,
  updateRFQ,
  publishRFQ,
  deleteRFQ,
} = require("../controllers/rfqController");
const {
  createQuotation,
  getQuotationsByRFQ,
} = require("../controllers/quotationController");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");

const router = express.Router();

/**
 * FIX 3: GET "/" and GET "/:id" were completely unauthenticated — any
 *         anonymous HTTP client could enumerate all RFQs (including Draft
 *         ones with confidential line-item pricing).
 *         Now protected; the controller already handles Vendor-scoped filtering.
 *
 * FIX 4: Manager / Approver role added to GET quotations — they need to see
 *         quotations in order to run the approval workflow.
 *
 * FIX 5: Vendor role REMOVED from updateRFQ and publishRFQ — those were
 *         accidentally inheritable through the "Manager / Approver" label
 *         ambiguity in the original code; now explicit.
 */

// List & detail — authenticated, role-filtered inside controller
router.get("/", protect, getAllRFQs);
router.get("/:id", protect, getRFQ);

// Create / Edit — Procurement Officers and Admins only
router.post(
  "/",
  protect,
  authorizeRoles("Procurement Officer", "Admin"),
  createRFQ
);
router.put(
  "/:id",
  protect,
  authorizeRoles("Procurement Officer", "Admin"),
  updateRFQ
);

// Publish — Procurement Officer or Admin (Manager can view but not publish)
router.put(
  "/:id/publish",
  protect,
  authorizeRoles("Procurement Officer", "Admin"),
  publishRFQ
);

// Submit quotation — Vendors only
router.post(
  "/:id/quotations",
  protect,
  authorizeRoles("Vendor"),
  createQuotation
);

// View quotations — internal roles only (NOT Vendor — vendors should not see competitors)
router.get(
  "/:id/quotations",
  protect,
  authorizeRoles("Admin", "Procurement Officer", "Manager / Approver"),
  getQuotationsByRFQ
);

// Delete — Admin only
router.delete("/:id", protect, authorizeRoles("Admin"), deleteRFQ);

module.exports = router;
