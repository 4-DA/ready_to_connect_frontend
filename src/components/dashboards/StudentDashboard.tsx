"use client";
import React from "react";
import Sidebar from "../Sidebar";

export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      {/* Background gradients - Indigo and Purple theme */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/4 h-1/4 rounded-full bg-purple-600/15 blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 ml-64">
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 mb-6 border border-indigo-500/20">
          <h1 className="text-2xl font-bold text-indigo-400 mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-300">
            Welcome to your student dashboard! This dashboard has indigo and
            purple styling.
          </p>
        </div>

        {/* Student-specific content can go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-indigo-500/20">
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              Your Courses
            </h2>
            <p className="text-gray-300">
              Your enrolled courses would be listed here.
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-indigo-500/20">
            <h2 className="text-xl font-semibold text-indigo-400 mb-4">
              Upcoming Assignments
            </h2>
            <p className="text-gray-300">
              Your upcoming assignments would be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
