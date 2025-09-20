export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
};

export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
};

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
};
