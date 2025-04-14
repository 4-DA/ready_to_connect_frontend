"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MentorDashboard from "@/components/dashboards/MentorDashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function MentorDashboardPage() {
  const router = useRouter();

  // Try/catch block to safely use AuthContext
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.error("Error using AuthContext:", error);
    // If AuthContext fails, redirect to signin
    useEffect(() => {
      router.push("/signin");
    }, [router]);

    return (
      <div className="flex min-h-screen bg-[#0e0e13] items-center justify-center">
        <div className="text-white text-xl">
          Authentication error. Redirecting to login...
        </div>
      </div>
    );
  }

  // Destructure auth context if it's available
  const { isAuthenticated, isLoading, user } = authContext || {};

  // Debug logging
  console.log("🔍 MentorDashboardPage - User:", user);
  console.log("🔍 MentorDashboardPage - User Type:", user?.user_type);

  // Check if user is authorized to view this page
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/signin");
        return;
      }

      if (user && user.user_type) {
        const userType = String(user.user_type).toLowerCase().trim();
        if (userType !== "mentor" && userType !== "teacher") {
          console.log(
            "User is not a mentor, redirecting to appropriate dashboard"
          );
          if (userType === "student") {
            router.push("/dashboard/student");
          } else {
            router.push("/dashboard");
          }
        }
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#0e0e13] items-center justify-center">
        <div className="animate-pulse text-white text-xl">
          Loading Mentor Dashboard...
        </div>
      </div>
    );
  }

  return <MentorDashboard />;
}
