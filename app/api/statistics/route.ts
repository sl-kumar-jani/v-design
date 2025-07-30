import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Statistics } from "@/lib/models/statistics";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    const statistics = await Statistics.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .limit(1);

    if (statistics.length === 0) {
      // Return default statistics if none exist
      return NextResponse.json({
        happyClients: 50,
        averageRating: 5.0,
        satisfaction: 100,
        awardsWon: 15,
        isActive: true,
        displayOrder: 0,
      });
    }

    return NextResponse.json(statistics[0]);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      happyClients,
      averageRating,
      satisfaction,
      awardsWon,
      isActive,
      displayOrder,
    } = body;

    // Validate required fields
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

    // Validate rating range
    if (averageRating < 0 || averageRating > 5) {
      return NextResponse.json(
        { error: "Average rating must be between 0 and 5" },
        { status: 400 }
      );
    }

    // Validate satisfaction range
    if (satisfaction < 0 || satisfaction > 100) {
      return NextResponse.json(
        { error: "Satisfaction must be between 0 and 100" },
        { status: 400 }
      );
    }

    const statistics = new Statistics({
      happyClients,
      averageRating,
      satisfaction,
      awardsWon,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    await statistics.save();
    return NextResponse.json(statistics, { status: 201 });
  } catch (error) {
    console.error("Error creating statistics:", error);
    return NextResponse.json(
      { error: "Failed to create statistics" },
      { status: 500 }
    );
  }
}
