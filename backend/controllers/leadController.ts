import { Request, Response } from "express";
import Lead from "../models/Lead";
import Customer from "../models/Customer";
import { leadSchema, leadUpdateSchema, leadQuerySchema } from "../utils/validation";
import connectDB from "../database/connection/mongoose";

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const userId = (req as any).user._id;

    // Validate request body
    const { error, value } = leadSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    await connectDB();

    // Verify customer exists and belongs to user
    const customer = await Customer.findOne({ _id: customerId, ownerId: userId });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    // Create lead
    const lead = new Lead({
      ...value,
      customerId,
    });

    await lead.save();

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error("Create lead error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const userId = (req as any).user._id;

    // Validate query parameters
    const { error, value } = leadQuerySchema.validate(req.query);
    if (error) {
      res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    await connectDB();

    // Verify customer exists and belongs to user
    const customer = await Customer.findOne({ _id: customerId, ownerId: userId });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    const { page, limit, status, sortBy, sortOrder } = value;

    // Build query
    const query: any = { customerId };
    if (status) {
      query.status = status;
    }

    // Build sort object
    const sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default sort by creation date
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get leads with pagination
    const leads = await Lead.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Lead.countDocuments(query);

    res.status(200).json({
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get leads error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, leadId } = req.params;
    const userId = (req as any).user._id;

    await connectDB();

    // Verify customer exists and belongs to user
    const customer = await Customer.findOne({ _id: customerId, ownerId: userId });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    // Find lead
    const lead = await Lead.findOne({ _id: leadId, customerId });
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    res.status(200).json({
      lead,
    });
  } catch (error) {
    console.error("Get lead by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, leadId } = req.params;
    const userId = (req as any).user._id;

    // Validate request body
    const { error, value } = leadUpdateSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    await connectDB();

    // Verify customer exists and belongs to user
    const customer = await Customer.findOne({ _id: customerId, ownerId: userId });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    // Check if lead exists
    const lead = await Lead.findOne({ _id: leadId, customerId });
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    // Update lead
    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      { $set: value },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Lead updated successfully",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Update lead error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, leadId } = req.params;
    const userId = (req as any).user._id;

    await connectDB();

    // Verify customer exists and belongs to user
    const customer = await Customer.findOne({ _id: customerId, ownerId: userId });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    // Check if lead exists
    const lead = await Lead.findOne({ _id: leadId, customerId });
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    // Delete lead
    await Lead.findByIdAndDelete(leadId);

    res.status(200).json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete lead error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
