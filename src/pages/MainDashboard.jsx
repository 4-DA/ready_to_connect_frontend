import React from "react";
import { Link } from "react-router-dom";

export default function MainDashboard() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Main Dashboard</h1>
      <p>Welcome to the core application dashboard.</p>
      
      {/* Button to Access Gaming Dashboard */}
      <Link to="/gaming-dashboard">
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
          🎮 Enter Gamification Mode
        </button>
      </Link>
    </div>
  );
}
