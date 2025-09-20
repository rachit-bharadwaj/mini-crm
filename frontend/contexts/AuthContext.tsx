"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from "../lib/auth";
import api from "../lib/api";
import { getStoredUser, setStoredUser, removeStoredUser, getAuthToken, setAuthToken, removeAuthToken } from "../lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        try {
          // Verify token is still valid
          const response = await api.get("/auth/profile");
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid, clear storage
          removeAuthToken();
          removeStoredUser();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      const { user, token } = response.data;

      setAuthToken(token);
      setStoredUser(user);
      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", credentials);
      const { user, token } = response.data;

      setAuthToken(token);
      setStoredUser(user);
      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    removeAuthToken();
    removeStoredUser();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
