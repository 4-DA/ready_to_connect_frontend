import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./pages/Dashboard";

// Create an AuthLayout that doesn't include the Sidebar
const AuthLayout = ({ children }) => {
  return <div className="min-h-screen bg-dark relative">{children}</div>;
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth routes with AuthLayout */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />

        {/* Dashboard route - keep as is */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
