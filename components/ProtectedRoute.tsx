"use client";

import React, { ComponentType } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

// More flexible type handling for the HOC
export function withProtectedRoute<P extends object = {}>(
  WrappedComponent: ComponentType<P>
): React.FC<P> {
  const ProtectedRoute = (props: P) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
      if (!isAuthenticated) {
        // Redirect to signin if not authenticated
        router.replace("/signin");
      }
    }, [isAuthenticated, router]);

    // Render the component only if authenticated
    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Add a display name for easier debugging
  ProtectedRoute.displayName = `WithProtectedRoute(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ProtectedRoute;
}
