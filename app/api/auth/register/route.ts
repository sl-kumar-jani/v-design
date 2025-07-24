import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Admin from "@/lib/models/admin";
import connectToDatabase from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    await connectToDatabase();
    const adminCount = await Admin.countDocuments();
    return NextResponse.json({ adminExists: adminCount > 0 });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { adminEmail, adminPassword } = await request.json();

    // Validate request
    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();

    // If this is the first admin, create as super-admin without requiring authentication
    if (adminCount === 0) {
      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      // Create super-admin
      const newAdmin = await Admin.create({
        adminEmail,
        adminPassword: hashedPassword,
        role: "super-admin", // First user is always super-admin
      });

      // Generate token
      const token = jwt.sign(
        { adminId: newAdmin._id },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );

      // Remove password from response
      const adminResponse = {
        _id: newAdmin._id,
        adminEmail: newAdmin.adminEmail,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
        token,
      };

      return NextResponse.json(adminResponse, { status: 201 });
    }

    // For subsequent registrations, require super-admin authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // Verify token
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
        adminId: string;
      };
    } catch (error) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Check if the requesting user is a super-admin
    const requestingAdmin = await Admin.findById(decodedToken.adminId);
    if (!requestingAdmin || requestingAdmin.role !== "super-admin") {
      return NextResponse.json(
        { error: "Unauthorized - Only super-admin can register new admins" },
        { status: 403 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ adminEmail });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create new admin
    const newAdmin = await Admin.create({
      adminEmail,
      adminPassword: hashedPassword,
      role: "admin", // New admins are always created with 'admin' role
    });

    // Remove password from response
    const adminResponse = {
      _id: newAdmin._id,
      adminEmail: newAdmin.adminEmail,
      role: newAdmin.role,
      createdAt: newAdmin.createdAt,
    };

    return NextResponse.json(adminResponse, { status: 201 });
  } catch (error) {
    console.error("Error in admin registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
