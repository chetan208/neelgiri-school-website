'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// User type define kiya
interface User {
  id: string;
  name: string;
  email: string;
  role: "User" | "Admin" | "Owner"|"Teacher";
  [key: string]: any; 
}

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Next.js backend URL pattern (process.env)
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const fetchUserSession = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/auth/me`, {
        withCredentials: true,
      });
      if (res.status === 200 && res.data?.me) {
        setUser(res.data.me);
      }
    } catch (err) {
      console.log("No active session.");
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSession();
  }, []);

  const logout = async () => {
    try {
      await axios.post(`${SERVER_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (e) {
      console.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, logout, refreshUser: fetchUserSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}