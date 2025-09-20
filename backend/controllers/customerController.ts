import { Request, Response } from "express";
import Customer from "../models/Customer";
import Lead from "../models/Lead";
import { customerSchema, customerUpdateSchema, paginationSchema } from "../utils/validation";
import connectDB from "../database/connection/mongoose";

export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { error, value } = customerSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    await connectDB();

    const userId = (req as any).user._id;

    // Check if customer with same email already exists for this user
    const existingCustomer = await Customer.findOne({
      email: value.email,
      ownerId: userId,
    });
    if (existingCustomer) {
      res.status(409).json({ message: "Customer with this email already exists" });
      return;
    }

    // Create customer
    const customer = new Customer({
      ...value,
      ownerId: userId,
    });

    await customer.save();

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate query parameters
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    await connectDB();

    const userId = (req as any).user._id;
    const { page, limit, search, sortBy, sortOrder } = value;

    // Build query
    const query: any = { ownerId: userId };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
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

    // Get customers with pagination
    const customers = await Customer.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Customer.countDocuments(query);

    res.status(200).json({
      customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    await connectDB();

    // Find customer and verify ownership
    const customer = await Customer.findOne({ _id: id, ownerId: userId });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    // Get associated leads
    const leads = await Lead.find({ customerId: id }).sort({ createdAt: -1 });

    res.status(200).json({
      customer,
      leads,
    });
  } catch (error) {
    console.error("Get customer by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    // Validate request body
    const { error, value } = customerUpdateSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail) => detail.message),
      });
      return;
    }

    await connectDB();

    // Check if customer exists and belongs to user
    const customer = await Customer.findOne({ _id: id, ownerId: userId });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    // Check if email is being updated and if it conflicts
    if (value.email && value.email !== customer.email) {
      const existingCustomer = await Customer.findOne({
        email: value.email,
        ownerId: userId,
        _id: { $ne: id },
      });
      if (existingCustomer) {
        res.status(409).json({ message: "Customer with this email already exists" });
        return;
      }
    }

    // Update customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: value },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Update customer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    await connectDB();

    // Check if customer exists and belongs to user
    const customer = await Customer.findOne({ _id: id, ownerId: userId });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    // Delete associated leads first
    await Lead.deleteMany({ customerId: id });

    // Delete customer
    await Customer.findByIdAndDelete(id);

    res.status(200).json({
      message: "Customer and associated leads deleted successfully",
    });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
