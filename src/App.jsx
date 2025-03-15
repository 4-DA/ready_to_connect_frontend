import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./pages/Dashboard";
import GamingDashboard from "./pages/GamingDashboard";

function AnimatedRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/gaming"
          element={
            user ? <GamingDashboard /> : <Navigate to="/login" replace />
          }
        />
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
