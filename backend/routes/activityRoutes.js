const express = require("express");
const { getActivityLogs, getActivitiesByType } = require("../controllers/activityController");

const router = express.Router();

router.get("/", getActivityLogs);
router.get("/type/:type", getActivitiesByType);

module.exports = router;
