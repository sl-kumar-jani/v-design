import mongoose from "mongoose";

export interface IPortfolio {
  _id?: string;
  title: string;
  category: string;
  image: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PortfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
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
PortfolioSchema.index({ category: 1, order: 1 });
PortfolioSchema.index({ isActive: 1 });

export default mongoose.models.Portfolio ||
  mongoose.model("Portfolio", PortfolioSchema);
