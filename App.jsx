import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainDashboard from "./pages/MainDashboard";
import Dashboard from "./pages/Dashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { GamificationProvider } from "./context/GamificationContext";

function App() {
  return (
    <GamificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/main-dashboard" element={<MainDashboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </GamificationProvider>
  );
}

export default App;
