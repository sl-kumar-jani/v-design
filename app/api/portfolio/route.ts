import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Portfolio from "@/lib/models/portfolio";
import { verifyToken } from "@/lib/auth";

// GET - Fetch all portfolio items (public)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const activeOnly = searchParams.get("active") !== "false";

    let query: any = {};

    if (activeOnly) {
      query.isActive = true;
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const portfolioItems = await Portfolio.find(query).sort({
      order: 1,
      createdAt: -1,
    });

    return NextResponse.json(portfolioItems);
  } catch (error) {
    console.error("Error fetching portfolio items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new portfolio item (Admin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      category,
      image,
      description,
      order = 0,
      isActive = true,
    } = body;

    if (!title || !category || !image || !description) {
      return NextResponse.json(
        { error: "Title, category, image, and description are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const portfolio = new Portfolio({
      title,
      category,
      image,
      description,
      order,
      isActive,
    });
    await portfolio.save();

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
