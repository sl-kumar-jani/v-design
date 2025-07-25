import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Testimonial } from "@/lib/models/testimonial";
import { verifyToken } from "@/lib/auth";

// GET /api/testimonials - Public endpoint
export async function GET() {
  try {
    await connectToDatabase();

    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Admin only
export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const {
      name,
      location,
      project,
      rating,
      review,
      image,
      isActive = true,
      order = 0,
    } = body;

    // Validation
    if (!name || !location || !project || !rating || !review || !image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const testimonial = new Testimonial({
      name,
      location,
      project,
      rating,
      review,
      image,
      isActive,
      order,
    });

    const savedTestimonial = await testimonial.save();

    return NextResponse.json(savedTestimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
