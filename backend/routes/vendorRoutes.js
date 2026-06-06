const express = require("express");
const { getAllVendors, getVendor, createVendor, updateVendor, deleteVendor } = require("../controllers/vendorController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllVendors);
router.get("/:id", getVendor);
router.post("/", protect, createVendor);
router.put("/:id", protect, updateVendor);
router.delete("/:id", protect, deleteVendor);

module.exports = router;
