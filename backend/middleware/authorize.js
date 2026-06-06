/**
 * FIX: Previous version only checked role presence in the allowed list.
 *      Added explicit check that req.user.role is a non-empty string to
 *      guard against malformed user objects that somehow pass the protect
 *      middleware (e.g. during unit-test mocking).
 */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — required role(s): ${roles.join(", ")}`,
      });
    }

    next();
  };
};
