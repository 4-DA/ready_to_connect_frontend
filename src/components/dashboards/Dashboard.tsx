"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userType = user.user_type?.toLowerCase();

      if (userType === "mentor") {
        router.replace("/dashboard/mentor");
      } else if (userType === "student") {
        router.replace("/dashboard/student");
      } else {
        router.replace("/signin"); // fallback or guest handling
      }
    } else {
      router.replace("/signin");
    }
  }, [router]);

  return null;
}
