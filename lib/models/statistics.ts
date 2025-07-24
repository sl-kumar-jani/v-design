import mongoose from "mongoose";

const statisticsSchema = new mongoose.Schema(
  {
    happyClients: {
      type: Number,
      required: true,
      default: 0,
    },
    averageRating: {
      type: Number,
      required: true,
      default: 5.0,
      min: 0,
      max: 5,
    },
    satisfaction: {
      type: Number,
      required: true,
      default: 100,
      min: 0,
      max: 100,
    },
    awardsWon: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
statisticsSchema.index({ isActive: 1 });
statisticsSchema.index({ displayOrder: 1 });

export interface IStatistics {
  _id?: string;
  happyClients: number;
  averageRating: number;
  satisfaction: number;
  awardsWon: number;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export const Statistics =
  mongoose.models.Statistics || mongoose.model("Statistics", statisticsSchema);
