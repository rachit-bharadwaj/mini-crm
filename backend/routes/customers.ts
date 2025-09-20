import { Router } from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController";
import { authenticateToken } from "../utils/auth";

const customerRoutes = Router();

// All customer routes require authentication
customerRoutes.use(authenticateToken);

// Customer CRUD routes
customerRoutes.post("/", createCustomer);
customerRoutes.get("/", getCustomers);
customerRoutes.get("/:id", getCustomerById);
customerRoutes.put("/:id", updateCustomer);
customerRoutes.delete("/:id", deleteCustomer);

export default customerRoutes;
