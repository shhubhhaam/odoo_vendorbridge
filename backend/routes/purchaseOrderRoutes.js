const express = require("express");
const { getAllPOs, getPO, createPO, updatePO, approvePO, rejectPO, deletePO } = require("../controllers/purchaseOrderController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllPOs);
router.get("/:id", getPO);
router.post("/", protect, createPO);
router.put("/:id", protect, updatePO);
router.put("/:id/approve", protect, approvePO);
router.put("/:id/reject", protect, rejectPO);
router.delete("/:id", protect, deletePO);

module.exports = router;
