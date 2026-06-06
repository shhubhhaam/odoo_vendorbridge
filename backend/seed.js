// Seed script to create default admin user
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ MongoDB Connected");

    // Check if admin exists
    const adminExists = await User.findOne({ email: "admin@vendorbridge.com" });
    if (adminExists) {
      console.log("✓ Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      firstName: "Admin",
      lastName: "User",
      email: "admin@vendorbridge.com",
      password: "password", // Will be hashed by pre-save hook
      phone: "+91 9876543210",
      role: "Admin",
      country: "India",
      isActive: true,
    });

    await admin.save();
    console.log("✓ Admin user created successfully!");
    console.log("  Email: admin@vendorbridge.com");
    console.log("  Password: password");
    
    process.exit(0);
  } catch (error) {
    console.error("✗ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedAdmin();
