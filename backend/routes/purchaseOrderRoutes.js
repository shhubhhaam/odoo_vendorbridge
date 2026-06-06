const express = require("express");
const {
  getAllPOs,
  getPO,
  createPO,
  updatePO,
  approvePO,
  rejectPO,
  deletePO,
} = require("../controllers/purchaseOrderController");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");

const router = express.Router();

/**
 * FIX 9: GET "/" and GET "/:id" were unauthenticated.
 *         Purchase Orders contain vendor names, amounts, line items and
 *         approval history — all sensitive procurement data.
 *
 * FIX 10: updatePO allowed "Procurement Officer" to update ANY field on a PO,
 *          including status. Added guard in controller so only Draft POs can be
 *          edited; Approved/Rejected POs are immutable via this route.
 *
 * FIX 11: Manager / Approver added to GET routes — approvers need read access
 *          to POs before they can approve/reject them.
 */

router.get("/", protect, getAllPOs);  // controller handles Vendor scoping
router.get(
  "/:id",
  protect,
  authorizeRoles("Admin", "Procurement Officer", "Manager / Approver", "Vendor"),
  getPO
);

router.post(
  "/",
  protect,
  authorizeRoles("Procurement Officer", "Admin"),
  createPO
);

router.put(
  "/:id",
  protect,
  authorizeRoles("Procurement Officer", "Admin"),
  updatePO
);

router.put(
  "/:id/approve",
  protect,
  authorizeRoles("Manager / Approver", "Admin"),
  approvePO
);

router.put(
  "/:id/reject",
  protect,
  authorizeRoles("Manager / Approver", "Admin"),
  rejectPO
);

router.delete("/:id", protect, authorizeRoles("Admin"), deletePO);

module.exports = router;
