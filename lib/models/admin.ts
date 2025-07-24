import mongoose from "mongoose";

export interface IAdmin {
  _id?: string;
  adminEmail: string;
  adminPassword: string;
  role: "admin" | "super-admin";
  createdAt?: Date;
  updatedAt?: Date;
}

const AdminSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    adminPassword: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "super-admin"],
      default: "admin",
      required: true,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
