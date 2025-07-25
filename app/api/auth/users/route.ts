import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/lib/models/admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper function to verify super admin
async function verifySuperAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      adminId: string;
    };
    const admin = await Admin.findById(decodedToken.adminId);
    return admin?.role === "super-admin" ? admin : null;
  } catch (error) {
    return null;
  }
}

// Get all admin users
export async function GET(request: NextRequest) {
  try {
    const superAdmin = await verifySuperAdmin(request);
    if (!superAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Only super-admin can view users" },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const users = await Admin.find({}, { adminPassword: 0 }); // Exclude password
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update admin user
export async function PATCH(request: NextRequest) {
  try {
    const superAdmin = await verifySuperAdmin(request);
    if (!superAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Only super-admin can update users" },
        { status: 403 }
      );
    }

    const { userId, adminEmail, currentPassword, newPassword } =
      await request.json();

    await connectToDatabase();
    const user = await Admin.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update email if provided
    if (adminEmail && adminEmail !== user.adminEmail) {
      const existingUser = await Admin.findOne({ adminEmail });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
      user.adminEmail = adminEmail;
    }

    // Update password if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.adminPassword = hashedPassword;
      user.passwordChangedAt = new Date().getTime();
    }

    await user.save();

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        adminEmail: user.adminEmail,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete admin user
export async function DELETE(request: NextRequest) {
  try {
    const superAdmin = await verifySuperAdmin(request);
    if (!superAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Only super-admin can delete users" },
        { status: 403 }
      );
    }

    const { userId } = await request.json();

    await connectToDatabase();
    const user = await Admin.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "super-admin") {
      return NextResponse.json(
        { error: "Cannot delete super-admin user" },
        { status: 403 }
      );
    }

    await Admin.findByIdAndDelete(userId);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
