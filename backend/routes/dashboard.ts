import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { authenticateToken } from "../utils/auth";

const dashboardRoutes = Router();

// All dashboard routes require authentication
dashboardRoutes.use(authenticateToken);

// Dashboard routes
dashboardRoutes.get("/stats", getDashboardStats);

export default dashboardRoutes;
