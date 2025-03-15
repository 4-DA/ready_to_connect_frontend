import React from "react";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";
import AnimatedBackground from "./ui/AnimatedBackground";

const DashboardLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-dark">
      <AnimatedBackground />
      <Sidebar />
      <Header />
      <div className="ml-64 pt-20 px-6 pb-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
