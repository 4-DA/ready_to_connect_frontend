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
        router.replace("/login"); // 👈 Redirect to login page if NOT authenticated
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // 👈 Hide the page while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  ProtectedRoute.displayName = `WithProtectedRoute(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ProtectedRoute;
}

