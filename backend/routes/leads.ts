import { Router } from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../controllers/leadController";
import { authenticateToken } from "../utils/auth";

const leadRoutes = Router();

// All lead routes require authentication
leadRoutes.use(authenticateToken);

// Lead CRUD routes (nested under customers)
leadRoutes.post("/customers/:customerId/leads", createLead);
leadRoutes.get("/customers/:customerId/leads", getLeads);
leadRoutes.get("/customers/:customerId/leads/:leadId", getLeadById);
leadRoutes.put("/customers/:customerId/leads/:leadId", updateLead);
leadRoutes.delete("/customers/:customerId/leads/:leadId", deleteLead);

export default leadRoutes;
