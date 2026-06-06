const express = require("express");
const { getAllUsers, getUser, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");

const router = express.Router();

router.get("/", protect, authorizeRoles("Admin"), getAllUsers);
router.get("/:id", protect, authorizeRoles("Admin"), getUser);
router.delete("/:id", protect, authorizeRoles("Admin"), deleteUser);

module.exports = router;
