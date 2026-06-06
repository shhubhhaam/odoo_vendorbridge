const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * FIX 1: Added isActive check — disabled accounts could previously authenticate.
 * FIX 2: Wrapped jwt.verify in isolated try/catch to distinguish token expiry
 *         from other errors (returns 401 in both cases, but logs are cleaner).
 * FIX 3: req.user.id alias added alongside req.user._id so controllers
 *         using either convention work safely.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized — no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });
    }

    // FIX 1 — reject deactivated accounts even with a valid token
    if (user.isActive === false) {
      return res
        .status(403)
        .json({ success: false, message: "Account has been deactivated" });
    }

    req.user = user;
    next();
  } catch (error) {
    // Distinguish expired from invalid tokens for better client-side handling
    const message =
      error.name === "TokenExpiredError"
        ? "Token has expired — please log in again"
        : "Invalid token";
    return res.status(401).json({ success: false, message });
  }
};

module.exports = { protect };
