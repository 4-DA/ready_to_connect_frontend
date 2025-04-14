"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/dashboards/Dashboard";
import StudentDashboard from "@/components/dashboards/StudentDashboard";
import MentorDashboard from "@/components/dashboards/MentorDashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();
  const [dashboardType, setDashboardType] = useState<string | null>(null);

  // Debug logging to verify user data and loading states
  useEffect(() => {
    console.log("DashboardPage - AuthLoading:", authLoading);
    console.log("DashboardPage - User:", user);
    console.log("DashboardPage - IsAuthenticated:", isAuthenticated);
    console.log("DashboardPage - User Type:", user?.user_type);
    console.log("DashboardPage - DashboardType:", dashboardType);
  }, [user, authLoading, isAuthenticated, dashboardType]);

  // Handle authentication and set dashboard type
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const hasToken = !!token;

    console.log("DashboardPage - Has token:", hasToken);

    if (!authLoading) {
      if (!hasToken || !isAuthenticated) {
        console.log(
          "DashboardPage - No token or not authenticated, redirecting to signin"
        );
        router.push("/signin");
        return;
      }

      if (user) {
        // Ensure we're looking at the user_type correctly
        // Force to lowercase and trim any whitespace to avoid matching issues
        const userType = (user.user_type || "").toLowerCase().trim();
        console.log(
          "DashboardPage - Setting dashboard type based on user type:",
          userType
        );

        if (userType === "student") {
          setDashboardType("student");
        } else if (userType === "mentor" || userType === "teacher") {
          console.log("DashboardPage - Setting MENTOR dashboard type");
          setDashboardType("mentor");
        } else if (userType === "admin") {
          setDashboardType("admin");
        } else if (userType === "guardian") {
          setDashboardType("guardian");
        } else if (userType === "business") {
          setDashboardType("business");
        } else {
          setDashboardType("general");
        }
      } else {
        console.log(
          "DashboardPage - No user data available, redirecting to signin"
        );
        router.push("/signin");
      }
    } else {
      console.log("DashboardPage - Waiting for auth to resolve...");
    }
  }, [user, authLoading, isAuthenticated, router]);

  // Show loading state while determining what to do
  if (authLoading || !dashboardType) {
    return (
      <div className="flex min-h-screen bg-[#0e0e13] items-center justify-center">
        <div className="animate-pulse text-white text-xl">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  // IMPORTANT CHANGE: Directly return the appropriate dashboard component
  console.log("DashboardPage - Rendering dashboard type:", dashboardType);

  // Directly return the appropriate component based on dashboard type
  if (dashboardType === "student") {
    console.log(
      "DashboardPage - Rendering StudentDashboard component directly"
    );
    return <StudentDashboard />;
  } else if (dashboardType === "mentor") {
    console.log("DashboardPage - Rendering MentorDashboard component directly");
    return <MentorDashboard />;
  } else if (dashboardType === "admin") {
    return <Dashboard />;
  } else if (dashboardType === "guardian") {
    return <Dashboard />;
  } else if (dashboardType === "business") {
    return <Dashboard />;
  }

  // Default to general dashboard
  return <Dashboard />;
}
