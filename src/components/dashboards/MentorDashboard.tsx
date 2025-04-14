"use client";
import React from "react";
import Sidebar from "../Sidebar";

export default function MentorDashboard() {
  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      {/* Background gradients - Sage and Terracotta theme */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-emerald-600/20 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/4 h-1/4 rounded-full bg-orange-600/15 blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 ml-64">
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 mb-6 border border-emerald-500/20">
          <h1 className="text-2xl font-bold text-emerald-400 mb-2">
            Mentor Dashboard
          </h1>
          <p className="text-gray-300">
            Welcome to your mentor dashboard! This dashboard has sage green and
            terracotta styling.
          </p>
        </div>

        {/* Mentor-specific content can go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-emerald-500/20">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">
              Your Students
            </h2>
            <p className="text-gray-300">Your mentees would be listed here.</p>
          </div>

          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-emerald-500/20">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">
              Upcoming Sessions
            </h2>
            <p className="text-gray-300">
              Your upcoming mentoring sessions would be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
