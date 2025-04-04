import React, { ComponentType, PropsWithChildren, ReactElement } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

// More flexible type handling
export function withProtectedRoute<P extends object = {}>(
  WrappedComponent: ComponentType<P>
): React.FC<P> {
  const ProtectedRoute = (props: P): ReactElement | null => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.replace("/login");
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
