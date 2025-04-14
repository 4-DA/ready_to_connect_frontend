"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import StudentDashboard from "@/components/dashboards/StudentDashboard";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, loading: themeLoading } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardType, setDashboardType] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log("Dashboard - Loading:", themeLoading);
    console.log("Dashboard - ThemeLoading:", themeLoading);
    console.log("Dashboard - AuthLoading:", authLoading);
    console.log("Dashboard - User:", user);
    console.log("Dashboard - IsAuthenticated:", isAuthenticated);
  }, [user, themeLoading, authLoading, isAuthenticated]);

  // Handle authentication and route user
  useEffect(() => {
    // Direct access to Auth context to check token
    const token = localStorage.getItem("access_token");
    const hasToken = !!token;

    console.log("Has token:", hasToken);

    // Only make decisions when loading is complete
    if (!authLoading) {
      // Immediately route to signin if no token
      if (!hasToken) {
        console.log("No token found, redirecting to signin");
        router.push("/signin");
        return;
      }

      // Set dashboard type when user data is available
      if (user) {
        const userType = user.user_type?.toLowerCase() || "";
        console.log("Setting dashboard type based on:", userType);

        if (userType.includes("student")) {
          setDashboardType("student");
        } else if (
          userType.includes("mentor") ||
          userType.includes("teacher")
        ) {
          setDashboardType("mentor");
        } else if (userType.includes("admin")) {
          setDashboardType("admin");
        } else if (userType.includes("guardian")) {
          setDashboardType("guardian");
        } else if (userType.includes("business")) {
          setDashboardType("business");
        } else {
          setDashboardType("general");
        }
      } else {
        // If auth is not loading but we still don't have a user
        // Show the default dashboard anyway
        console.log("No user data available, showing default dashboard");
        setDashboardType("general");
      }
    }
  }, [user, authLoading, isAuthenticated, router]);

  // Show loading state while determining what to do
  if (authLoading || (!dashboardType && user === null)) {
    return (
      <div className="flex min-h-screen bg-[#0e0e13] items-center justify-center">
        <div className="animate-pulse text-white text-xl">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard
  if (dashboardType === "student") {
    console.log("Rendering StudentDashboard");
    return <StudentDashboard />;
  }

  // Default to regular dashboard
  console.log("Rendering default Dashboard");
  return <Dashboard />;
}
