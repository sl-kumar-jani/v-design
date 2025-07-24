import mongoose from "mongoose";

export interface ICategory {
  _id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
