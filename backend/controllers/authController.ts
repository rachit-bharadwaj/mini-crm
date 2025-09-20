import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/auth";
import { registerSchema, loginSchema } from "../utils/validation";
import connectDB from "../database/connection/mongoose";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail: any) => detail.message),
      });
      return;
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(value.password);

    // Create user
    const user = new User({
      name: value.name,
      email: value.email,
      passwordHash,
      role: value.role,
    });

    await user.save();

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: "Validation error",
        errors: error.details.map((detail: any) => detail.message),
      });
      return;
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: value.email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Check password
    const isPasswordValid = await comparePassword(value.password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate token
    const token = generateToken((user._id as any).toString());

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
