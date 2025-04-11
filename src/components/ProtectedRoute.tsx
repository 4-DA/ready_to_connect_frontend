// src/components/withProtectedRoute.tsx
import React, { ComponentType, ReactElement } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import { useAuth } from "@/contexts/AuthContext";

export function withProtectedRoute<P extends object = {}>(
  WrappedComponent: ComponentType<P>
): React.FC<P> {
  const ProtectedRoute = (props: P): ReactElement | null => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace("/signin"); // Updated to match your sign-in route
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    if (!isAuthenticated) {
      return null; // Hide content while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  ProtectedRoute.displayName = `WithProtectedRoute(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ProtectedRoute;
}