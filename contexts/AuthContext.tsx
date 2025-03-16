// contexts/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Authentication Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Login method
  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual login logic (e.g., API call)
      const mockUser: User = {
        id: "mock-user-id",
        email: email,
      };
      setUser(mockUser);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  // Signup method
  const signup = async (email: string, password: string) => {
    try {
      // TODO: Implement actual signup logic (e.g., API call)
      const mockUser: User = {
        id: "new-user-id",
        email: email,
      };
      setUser(mockUser);
    } catch (error) {
      console.error("Signup failed", error);
      throw error;
    }
  };

  // Logout method
  const logout = () => {
    // TODO: Implement logout logic (e.g., clear tokens)
    setUser(null);
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
