const express = require("express");
const { getAllRFQs, getRFQ, createRFQ, updateRFQ, publishRFQ, deleteRFQ } = require("../controllers/rfqController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllRFQs);
router.get("/:id", getRFQ);
router.post("/", protect, createRFQ);
router.put("/:id", protect, updateRFQ);
router.put("/:id/publish", protect, publishRFQ);
router.delete("/:id", protect, deleteRFQ);

module.exports = router;
