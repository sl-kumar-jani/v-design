import mongoose from "mongoose";

export interface IFounder {
  _id?: string;
  founderName: string;
  founderTitle: string;
  founderDescription: string;
  founderPhotoUrl: string;
  projectsCompleted: number;
  yearsOfExperience: number;
  clientSatisfaction: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const FounderSchema = new mongoose.Schema(
  {
    founderName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    founderTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    founderDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    founderPhotoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    projectsCompleted: {
      type: Number,
      required: true,
      min: 0,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    clientSatisfaction: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Founder ||
  mongoose.model("Founder", FounderSchema);
