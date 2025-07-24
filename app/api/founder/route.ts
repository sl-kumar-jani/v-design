import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Founder from "@/lib/models/founder";
import { verifyToken } from "@/lib/auth";

// GET - Fetch founder data
export async function GET() {
  try {
    await connectToDatabase();

    const founder = await Founder.findOne().sort({ createdAt: -1 });

    if (!founder) {
      return NextResponse.json(
        { error: "Founder data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(founder);
  } catch (error) {
    console.error("Error fetching founder data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create founder data (Admin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      founderName,
      founderDescription,
      founderTitle,
      founderPhotoUrl,
      projectsCompleted,
      yearsOfExperience,
      clientSatisfaction,
    } = body;

    if (
      !founderName ||
      !founderDescription ||
      !founderTitle ||
      !founderPhotoUrl ||
      projectsCompleted === undefined ||
      yearsOfExperience === undefined ||
      clientSatisfaction === undefined
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Delete existing founder data (assuming only one founder)
    await Founder.deleteMany({});

    const founder = new Founder({
      founderName,
      founderDescription,
      founderTitle,
      founderPhotoUrl,
      projectsCompleted,
      yearsOfExperience,
      clientSatisfaction,
    });

    await founder.save();

    return NextResponse.json(founder, { status: 201 });
  } catch (error) {
    console.error("Error creating founder data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update founder data (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      founderName,
      founderDescription,
      founderTitle,
      founderPhotoUrl,
      projectsCompleted,
      yearsOfExperience,
      clientSatisfaction,
    } = body;

    if (
      !founderName ||
      !founderDescription ||
      !founderTitle ||
      !founderPhotoUrl ||
      projectsCompleted === undefined ||
      yearsOfExperience === undefined ||
      clientSatisfaction === undefined
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const founder = await Founder.findOneAndUpdate(
      {},
      {
        founderName,
        founderDescription,
        founderTitle,
        founderPhotoUrl,
        projectsCompleted,
        yearsOfExperience,
        clientSatisfaction,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(founder);
  } catch (error) {
    console.error("Error updating founder data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
