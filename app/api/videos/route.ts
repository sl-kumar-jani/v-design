import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Video from "@/lib/models/video";
import { verifyToken } from "@/lib/auth";

// GET - Fetch all videos (public)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";

    let query: any = {};

    if (activeOnly) {
      query.isActive = true;
    }

    const videos = await Video.find(query).sort({
      order: 1,
      createdAt: -1,
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new video (Admin only)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      thumbnailUrl,
      videoUrl,
      order = 0,
      isActive = true,
    } = body;

    if (!title || !description || !thumbnailUrl || !videoUrl) {
      return NextResponse.json(
        {
          error:
            "Title, description, thumbnail URL, and video URL are required",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const video = new Video({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      order,
      isActive,
    });
    await video.save();

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
