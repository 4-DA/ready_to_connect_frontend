import React from "react";
import GamingDashboard from "../components/gamification/GamingDashboard";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";

const MainDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <h1 className="text-2xl font-bold mb-4">Gamification Dashboard</h1>
          <GamingDashboard />
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;
