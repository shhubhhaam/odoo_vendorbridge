const Activity = require("../models/Activity");

exports.getActivityLogs = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActivitiesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const activities = await Activity.find({ type })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
