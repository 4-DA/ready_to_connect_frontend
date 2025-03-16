"use client";

import Sidebar from "./Sidebar";
import ActivityFeed from "./ActivityFeed";
import StatsCards from "./StatsCard";
import Calendar from "./Calendar";
import ProgressSection from "./ProgressSection";
import InternshipsSection from "./InternshipSection";
import GamificationOverlay from "./GamificationOverlay";
import Image from "next/image";
import { useState } from "react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      <Sidebar />
      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-between items-center mb-6">
          {/* Search input field */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search dashboard..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 bg-[#1e1e23] rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
            {searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-[#1e1e23] rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
                {/* Placeholder for search results */}
                <p className="p-4 text-gray-400 text-sm">No results found</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Circular image next to John Doe */}
            <div className="flex items-center gap-3">
              <Image
                src="/Jane-doe.png"
                alt="profile"
                height={80}
                width={80}
                className="rounded-full border-2 border-purple-500 transition-transform hover:scale-105"
              />
              <div>
                <div className="text-sm font-medium">John Doe</div>
                <p className="text-xs text-gray-400">Student</p>
              </div>
            </div>
          </div>
        </header>

        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <ProgressSection />
          <InternshipsSection />
          <div className="flex flex-col gap-6">
            <Calendar />
            <ActivityFeed />
          </div>
        </div>
      </div>

      <GamificationOverlay />
    </div>
  );
}
