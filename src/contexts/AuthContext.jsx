import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "some-student-id",
    userType: "student",
  }); // Default user

  useEffect(() => {
    // Simulate fetching user data (replace with actual auth logic)
    const fetchUser = async () => {
      try {
        // Example: Fetch user from localStorage or API
        const userData = { id: "some-student-id", userType: "student" };
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
