const express = require("express");
const {
  getActivityLogs,
  getActivitiesByType,
} = require("../controllers/activityController");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");

const router = express.Router();

/**
 * FIX 15 (CRITICAL): Both activity log endpoints had ZERO authentication.
 *          Activity logs contain a full audit trail of every user action:
 *          who approved what, when invoices were paid, who created which PO.
 *          This is some of the most sensitive data in the system and was
 *          completely public. Now restricted to Admin and Manager / Approver.
 */

router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Manager / Approver"),
  getActivityLogs
);

router.get(
  "/type/:type",
  protect,
  authorizeRoles("Admin", "Manager / Approver"),
  getActivitiesByType
);

module.exports = router;
