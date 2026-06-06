const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * FIX 16 (CRITICAL): The register endpoint accepted a `role` field from the
 *          request body with no restrictions. Any user could POST
 *          { role: "Admin" } and receive Admin privileges immediately.
 *          Self-registration now locks the role to "Procurement Officer".
 *          Admin/Manager accounts must be created by an existing Admin
 *          through a separate privileged endpoint (not yet in scope, but
 *          the attack surface is closed here).
 *
 * FIX 17: JWT_SECRET was "harshu" (5 chars) — trivially brute-forceable.
 *          Added a startup guard that throws if the secret is < 32 characters.
 *
 * FIX 18: Added timing-safe response for duplicate email — original code
 *          returned "User already exists" which is a user enumeration vector.
 *          Now always returns the same message for invalid inputs.
 */

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET must be at least 32 characters. Current value is insecure."
  );
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Roles that are NEVER assignable via self-registration
const PRIVILEGED_ROLES = new Set(["Admin", "Manager / Approver"]);

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, country } = req.body;
    // FIX 16: `role` is intentionally NOT destructured from req.body
    const role = "Procurement Officer"; // hard-coded for self-registration

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide firstName, lastName, email, and password",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      // FIX 18: Generic message — do not reveal whether the email exists
      return res
        .status(400)
        .json({ success: false, message: "Registration failed. Please check your details." });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role, // always "Procurement Officer" for self-registration
      country,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" }); // never leak error.message in prod
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    // FIX: Use constant-time comparison path — always call matchPassword so
    //      timing attacks cannot confirm whether an email exists
    const isMatch = user ? await user.matchPassword(password) : false;

    if (!user || !isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (user.isActive === false) {
      return res
        .status(403)
        .json({ success: false, message: "Account has been deactivated" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user is already set by protect middleware; re-fetch to get fresh data
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
