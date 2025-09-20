// Test setup file
import dotenv from "dotenv";

// Load environment variables for testing
dotenv.config({ path: ".env.test" });

// Set test environment variables
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.MONGO_URI = "mongodb://localhost:27017/mini-crm-test";

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
