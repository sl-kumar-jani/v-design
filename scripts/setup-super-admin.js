require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define Admin Schema
const AdminSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    adminPassword: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "super-admin"],
      default: "admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function setupSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log(
        "Admin users already exist. This script is only for initial setup."
      );
      process.exit(1);
    }

    // Create super-admin
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.log(
        "Usage: node scripts/setup-super-admin.js <email> <password>"
      );
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create super-admin user
    const superAdmin = await Admin.create({
      adminEmail: email,
      adminPassword: hashedPassword,
      role: "super-admin",
    });

    console.log("Super-admin created successfully:", {
      email: superAdmin.adminEmail,
      role: superAdmin.role,
    });
  } catch (error) {
    console.error("Error setting up super-admin:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

setupSuperAdmin();
