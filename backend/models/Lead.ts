import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  title: string;
  description: string;
  status: "New" | "Contacted" | "Converted" | "Lost";
  value: number;
  customerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    title: {
      type: String,
      required: [true, "Lead title is required"],
      trim: true,
      minlength: [5, "Lead title must be at least 5 characters"],
      maxlength: [200, "Lead title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Lead description is required"],
      trim: true,
      minlength: [10, "Lead description must be at least 10 characters"],
      maxlength: [1000, "Lead description cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted", "Lost"],
      default: "New",
    },
    value: {
      type: Number,
      required: [true, "Lead value is required"],
      min: [0, "Lead value cannot be negative"],
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for customerId for faster queries
LeadSchema.index({ customerId: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ createdAt: -1 });

export default mongoose.model<ILead>("Lead", LeadSchema);
