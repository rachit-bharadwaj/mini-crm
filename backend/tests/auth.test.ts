import request from "supertest";
import express from "express";
import { register, login } from "../controllers/authController";
import User from "../models/User";
import connectDB from "../database/connection/mongoose";

// Mock the database connection
jest.mock("../database/connection/mongoose");

const app = express();
app.use(express.json());

// Create test routes
app.post("/register", register);
app.post("/login", login);

describe("Auth Controller", () => {
  beforeAll(async () => {
    // Mock database connection
    (connectDB as jest.Mock).mockResolvedValue({});
  });

  beforeEach(async () => {
    // Clear the database before each test
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Clean up after all tests
    await User.deleteMany({});
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "user",
      };

      const response = await request(app)
        .post("/register")
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.role).toBe(userData.role);
      expect(response.body.token).toBeDefined();
    });

    it("should return 400 for invalid email format", async () => {
      const userData = {
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      };

      const response = await request(app)
        .post("/register")
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toContain("Please enter a valid email");
    });

    it("should return 400 for short password", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "123",
      };

      const response = await request(app)
        .post("/register")
        .send(userData)
        .expect(400);

      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toContain("Password must be at least 6 characters");
    });

    it("should return 409 for duplicate email", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      // Register first user
      await request(app).post("/register").send(userData);

      // Try to register with same email
      const response = await request(app)
        .post("/register")
        .send(userData)
        .expect(409);

      expect(response.body.message).toBe("User with this email already exists");
    });
  });

  describe("POST /login", () => {
    beforeEach(async () => {
      // Create a test user
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      await request(app).post("/register").send(userData);
    });

    it("should login with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/login")
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe("Login successful");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.token).toBeDefined();
    });

    it("should return 401 for invalid email", async () => {
      const loginData = {
        email: "wrong@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/login")
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe("Invalid email or password");
    });

    it("should return 401 for invalid password", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/login")
        .send(loginData)
        .expect(401);

      expect(response.body.message).toBe("Invalid email or password");
    });

    it("should return 400 for missing email", async () => {
      const loginData = {
        password: "password123",
      };

      const response = await request(app)
        .post("/login")
        .send(loginData)
        .expect(400);

      expect(response.body.message).toBe("Validation error");
      expect(response.body.errors).toContain("Email is required");
    });
  });
});
