import { NextResponse } from "next/server";
import { instagramService } from "@/lib/instagram";

// Static fallback data in case Instagram API is unavailable
const fallbackReels = [
  {
    id: "fallback-1",
    title: "Modern Bedroom Design Process",
    description: "Watch how we transform a simple bedroom into a luxury suite",
    videoUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-06-30%20at%204.17.45%20PM-Sqt8Zv0LdIIx5IiG1X4dIHRU4a2yE1.mp4",
    thumbnail: "/placeholder.svg?height=600&width=400",
    views: "2.5K",
    likes: "156",
    permalink: "#",
    timestamp: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    title: "Kitchen Renovation Timelapse",
    description: "Complete kitchen makeover in 60 seconds",
    videoUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-06-30%20at%204.50.58%20PM-AxoNwdK3f5fjWt52Htw6RkRLf1HBEn.mp4",
    thumbnail: "/placeholder.svg?height=600&width=400",
    views: "3.2K",
    likes: "203",
    permalink: "#",
    timestamp: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    title: "Living Room Styling Tips",
    description: "Quick tips for styling your living space",
    videoUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-06-30%20at%204.50.57%20PM-ir9f70bhghC6afBuTF7DTuKYHwzYzx.mp4",
    thumbnail: "/placeholder.svg?height=600&width=400",
    views: "1.8K",
    likes: "124",
    permalink: "#",
    timestamp: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    title: "Lighting Design Secrets",
    description: "How lighting transforms any space",
    videoUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-06-30%20at%204.50.58%20PM%20%282%29-zOG3UIVw3P8NO3suNY5U6AmfyK5nkL.mp4",
    thumbnail: "/placeholder.svg?height=600&width=400",
    views: "4.1K",
    likes: "287",
    permalink: "#",
    timestamp: new Date().toISOString(),
  },
  {
    id: "fallback-5",
    title: "Color Palette Selection",
    description: "Choosing the perfect colors for your home",
    videoUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-06-30%20at%204.50.57%20PM%20%281%29-92aaBTybn0hWiuEL96Jf890rQ35BWY.mp4",
    thumbnail: "/placeholder.svg?height=600&width=400",
    views: "2.9K",
    likes: "178",
    permalink: "#",
    timestamp: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");
    const useCache = searchParams.get("cache") !== "false";

    // Check if we have a cached version (implement caching if needed)
    if (useCache) {
      // You can implement Redis or other caching here
      // For now, we'll always fetch fresh data
    }

    // Try to fetch from Instagram API
    try {
      const reels = await instagramService.getReels(limit);

      if (reels.length === 0) {
        // If no reels found, use fallback
        return NextResponse.json({
          success: true,
          // data: fallbackReels.slice(0, limit),
          data: [],
          source: "fallback",
          message: "No Instagram reels found, using fallback data",
        });
      }

      return NextResponse.json({
        success: true,
        data: reels,
        source: "instagram",
        message: "Successfully fetched Instagram reels",
      });
    } catch (instagramError) {
      console.error("Instagram API error:", instagramError);

      // Return fallback data if Instagram API fails
      return NextResponse.json({
        success: true,
        // data: fallbackReels.slice(0, limit),
        data: [],
        source: "fallback",
        message: "Instagram API unavailable, using fallback data",
        error:
          instagramError instanceof Error
            ? instagramError.message
            : "Unknown error",
      });
    }
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      {
        success: false,
        // data: fallbackReels.slice(0, 5),
        data: [],
        source: "fallback",
        message: "API error occurred, using fallback data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: Add a POST endpoint to refresh the Instagram access token
export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === "refresh_token") {
      const newToken = await instagramService.refreshAccessToken();

      return NextResponse.json({
        success: true,
        message: "Access token refreshed successfully",
        // Don't return the actual token for security
        tokenRefreshed: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid action",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Token refresh error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to refresh token",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
