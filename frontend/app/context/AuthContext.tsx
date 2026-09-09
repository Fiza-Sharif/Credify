"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string; // Base64 data URL
  role: string;
  organization: string;
  signedUpAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signup: (userData: {
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    role?: string;
    organization?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signin: (credentials: {
    email: string;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  updateAvatar: (base64Image: string) => Promise<{ success: boolean; error?: string }>;
  removeAvatar: () => Promise<{ success: boolean; error?: string }>;
}

const STORAGE_KEY_SESSION = "credify-user";
const STORAGE_KEY_ACCOUNTS = "credify-accounts";

const defaultUser: UserProfile = {
  id: "USR-948201",
  name: "Alexander Wright",
  email: "alexander@credify.ai",
  role: "Senior Underwriter & Risk Analyst",
  organization: "Global Fintech Partners",
  signedUpAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize and load saved session from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_SESSION);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Initialize default demo account if no account exists
        setUser(defaultUser);
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(defaultUser));
        
        // Also save to accounts repo
        const accounts = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || "[]");
        if (!accounts.some((acc: UserProfile) => acc.email.toLowerCase() === defaultUser.email.toLowerCase())) {
          accounts.push(defaultUser);
          localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
        }
      }
    } catch (err) {
      console.error("Error rehydrating user session:", err);
      setUser(defaultUser);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to sync user session state & storage
  const saveSession = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(newUser));

      // Update in accounts repository
      try {
        const accounts: UserProfile[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || "[]");
        const index = accounts.findIndex((acc) => acc.email.toLowerCase() === newUser.email.toLowerCase() || acc.id === newUser.id);
        if (index >= 0) {
          accounts[index] = { ...accounts[index], ...newUser };
        } else {
          accounts.push(newUser);
        }
        localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
      } catch (e) {
        console.error("Error updating accounts repo:", e);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    role?: string;
    organization?: string;
  }) => {
    try {
      const emailClean = userData.email.trim().toLowerCase();
      const accounts: UserProfile[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || "[]");
      
      const existing = accounts.find((acc) => acc.email.toLowerCase() === emailClean);
      if (existing) {
        return { success: false, error: "An account with this email address already exists. Please Sign In." };
      }

      const newUser: UserProfile = {
        id: "USR-" + Math.floor(100000 + Math.random() * 900000),
        name: userData.name.trim(),
        email: userData.email.trim(),
        password: userData.password || "password123",
        avatar: userData.avatar,
        role: userData.role || "Senior Risk Analyst",
        organization: userData.organization || "Fintech Partners",
        signedUpAt: new Date().toISOString(),
      };

      saveSession(newUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to create account." };
    }
  };

  const signin = async (credentials: { email: string; password?: string }) => {
    try {
      const emailClean = credentials.email.trim().toLowerCase();
      const accounts: UserProfile[] = JSON.parse(localStorage.getItem(STORAGE_KEY_ACCOUNTS) || "[]");

      let found = accounts.find((acc) => acc.email.toLowerCase() === emailClean);

      if (!found) {
        // If signing in as default user
        if (emailClean === defaultUser.email.toLowerCase()) {
          found = defaultUser;
        } else {
          return { success: false, error: "No account found with this email. Please Sign Up first." };
        }
      }

      saveSession(found);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Sign in failed." };
    }
  };

  const signout = () => {
    saveSession(null);
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    if (!user) return { success: false, error: "No active user session found." };

    try {
      const updatedUser: UserProfile = {
        ...user,
        ...updatedData,
      };

      saveSession(updatedUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update profile." };
    }
  };

  const updateAvatar = async (base64Image: string) => {
    return updateProfile({ avatar: base64Image });
  };

  const removeAvatar = async () => {
    if (!user) return { success: false, error: "No active user session found." };
    
    const updatedUser = { ...user };
    delete updatedUser.avatar;
    saveSession(updatedUser);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        signin,
        signout,
        updateProfile,
        updateAvatar,
        removeAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
