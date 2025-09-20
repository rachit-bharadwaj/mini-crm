import Joi from "joi";

// User validation schemas
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("admin", "user").optional().default("user"),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

// Customer validation schemas
export const customerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Customer name must be at least 2 characters",
    "string.max": "Customer name cannot exceed 100 characters",
    "any.required": "Customer name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required().messages({
    "string.pattern.base": "Please enter a valid phone number",
    "any.required": "Phone number is required",
  }),
  company: Joi.string().min(2).max(100).required().messages({
    "string.min": "Company name must be at least 2 characters",
    "string.max": "Company name cannot exceed 100 characters",
    "any.required": "Company name is required",
  }),
});

export const customerUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).optional(),
  company: Joi.string().min(2).max(100).optional(),
});

// Lead validation schemas
export const leadSchema = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    "string.min": "Lead title must be at least 5 characters",
    "string.max": "Lead title cannot exceed 200 characters",
    "any.required": "Lead title is required",
  }),
  description: Joi.string().min(10).max(1000).required().messages({
    "string.min": "Lead description must be at least 10 characters",
    "string.max": "Lead description cannot exceed 1000 characters",
    "any.required": "Lead description is required",
  }),
  status: Joi.string().valid("New", "Contacted", "Converted", "Lost").optional().default("New"),
  value: Joi.number().min(0).required().messages({
    "number.min": "Lead value cannot be negative",
    "any.required": "Lead value is required",
  }),
});

export const leadUpdateSchema = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  description: Joi.string().min(10).max(1000).optional(),
  status: Joi.string().valid("New", "Contacted", "Converted", "Lost").optional(),
  value: Joi.number().min(0).optional(),
});

// Query validation schemas
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  search: Joi.string().optional().allow(""),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional().default("desc"),
});

export const leadQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  status: Joi.string().valid("New", "Contacted", "Converted", "Lost").optional(),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional().default("desc"),
});
