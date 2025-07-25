import mongoose from "mongoose";

export interface IVideo {
  _id?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    thumbnailUrl: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
VideoSchema.index({ order: 1 });
VideoSchema.index({ isActive: 1 });

export default mongoose.models.Video || mongoose.model("Video", VideoSchema);
