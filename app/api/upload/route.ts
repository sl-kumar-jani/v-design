import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileType = formData.get("fileType") as string; // 'image' or 'video'
    const folder = (formData.get("folder") as string) || "v-design/general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine resource type and transformations based on file type
    const isVideo = fileType === "video" || file.type.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    let uploadOptions: any = {
      resource_type: resourceType,
      folder: folder,
    };

    // Add transformations based on file type
    if (isVideo) {
      uploadOptions.transformation = [{ quality: "auto" }, { format: "mp4" }];
    } else {
      uploadOptions.transformation = [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto" },
      ];
    }

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    const result = uploadResponse as any;

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
