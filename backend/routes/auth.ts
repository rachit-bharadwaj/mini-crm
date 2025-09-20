import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController";
import { authenticateToken } from "../utils/auth";

const authRoutes = Router();

// Public routes
authRoutes.post("/register", register);
authRoutes.post("/login", login);

// Protected routes
authRoutes.get("/profile", authenticateToken, getProfile);

export default authRoutes;
