const express = require("express");
const {
  getAllVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
} = require("../controllers/vendorController");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");

const router = express.Router();

/**
 * FIX 12: GET "/" and GET "/:id" were unauthenticated.
 *          Vendor GST numbers, contact details, and ratings are PII/business
 *          data that must be behind authentication.
 *
 * FIX 13: Procurement Officers must be able to READ vendors to assign them to
 *          RFQs — added them to GET routes (read-only; write routes stay Admin).
 *
 * FIX 14: Manager / Approver needs read access to validate vendor details
 *          during the approval workflow.
 */

router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Procurement Officer", "Manager / Approver"),
  getAllVendors
);

router.get(
  "/:id",
  protect,
  authorizeRoles("Admin", "Procurement Officer", "Manager / Approver"),
  getVendor
);

// Write operations remain Admin-only
router.post("/", protect, authorizeRoles("Admin"), createVendor);
router.put("/:id", protect, authorizeRoles("Admin"), updateVendor);
router.delete("/:id", protect, authorizeRoles("Admin"), deleteVendor);

module.exports = router;
