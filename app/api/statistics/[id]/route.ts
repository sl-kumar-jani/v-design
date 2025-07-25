import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Statistics } from "@/lib/models/statistics";
import { verifyToken } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const statistics = await Statistics.findById(params.id);
    if (!statistics) {
      return NextResponse.json(
        { error: "Statistics not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Must await params

    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const {
      happyClients,
      averageRating,
      satisfaction,
      awardsWon,
      isActive,
      displayOrder,
    } = body;

    if (
      happyClients === undefined ||
      averageRating === undefined ||
      satisfaction === undefined ||
      awardsWon === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (averageRating < 0 || averageRating > 5) {
      return NextResponse.json(
        { error: "Average rating must be between 0 and 5" },
        { status: 400 }
      );
    }

    if (satisfaction < 0 || satisfaction > 100) {
      return NextResponse.json(
        { error: "Satisfaction must be between 0 and 100" },
        { status: 400 }
      );
    }

    let statistics;

    if (!id || id === "undefined") {
      statistics = await Statistics.create({
        happyClients,
        averageRating,
        satisfaction,
        awardsWon,
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder || 0,
      });
    } else {
      statistics = await Statistics.findByIdAndUpdate(
        id,
        {
          happyClients,
          averageRating,
          satisfaction,
          awardsWon,
          isActive: isActive !== undefined ? isActive : true,
          displayOrder: displayOrder || 0,
        },
        { new: true }
      );
    }

    if (!statistics) {
      return NextResponse.json(
        { error: "Statistics not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Error updating statistics:", error);
    return NextResponse.json(
      { error: "Failed to update statistics" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();

    const statistics = await Statistics.findByIdAndDelete(params.id);
    if (!statistics) {
      return NextResponse.json(
        { error: "Statistics not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Statistics deleted successfully" });
  } catch (error) {
    console.error("Error deleting statistics:", error);
    return NextResponse.json(
      { error: "Failed to delete statistics" },
      { status: 500 }
    );
  }
}
