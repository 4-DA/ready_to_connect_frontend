'use client'
import { useState } from "react";
import { Work as WorkIcon } from '@mui/icons-material';
import Link from 'next/link';
import { INTERNSHIPS } from '@/constants';
import Image from 'next/image';
import Sidebar from './Sidebar'; 



export default function InternshipsSection() {
  // Get only the first 3 internships to display in dashboard
  const featuredInternships = INTERNSHIPS.slice(0, 10); 

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    


<div className="flex min-h-screen bg-gradient-to-br from-[#0e0e13] to-[#1a1a22] text-white">
    <Sidebar />

    <div className="flex-1 p-6 pl-20">
      {/* Header with User Info and Gamification Stats */}
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

      <div className="bg-[#1a1a22] rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="text-lg md:text-xl">Recommended Internships</h2>
       
      </div>
      <div className="flex flex-col gap-3 md:gap-4">
        {featuredInternships.map((internship) => (
          <div key={internship.id} className="flex gap-2 md:gap-3 items-start">
            <div className="p-1.5 md:p-2 bg-[#252530] rounded-lg text-purple-400">
              <WorkIcon fontSize="small" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm md:text-base">{internship.title}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs md:text-sm">
                <p className="text-gray-400">{internship.company}</p>
                <div className="flex items-center text-xs text-gray-300 mt-1 sm:mt-0">
                  <span className="mr-2">{internship.location}</span>
                  <span className="text-red-400">Apply by {internship.deadline}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div> 



    </div>
  </div>
  );
}