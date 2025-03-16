'use client'
import InternshipsSection from '@/components/InternshipSection'
import Sidebar from '@/components/Sidebar';
import React from 'react'
import { useState, useEffect } from 'react';


// Define the User interface to match the stored data structure
interface User {
  pk: number;
  email: string;
  full_name: string;
  streak: number;
  xp: number;
  level: number;
  badge?: number;
  user_type: string;
  [key: string]: any;
}


const internship= () => { 
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null); // State to hold user data

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const userDataJson = localStorage.getItem('user');
    if (userDataJson) {
      const parsedUserData = JSON.parse(userDataJson);
      setUser(parsedUserData);
    }
  }, []);  


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return ( 
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
    <Sidebar/>
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
          {/* Removed the Image component and its wrapper */}
          <div>
            <div className="text-sm font-medium">
              {user?.full_name || 'Guest'} {/* Dynamic username from user data */}
            </div>
            <p className="text-xs text-gray-400">{user?.user_type || 'User'}</p>
          </div>
        </div>
      </header>   
      <InternshipsSection/>
    </div>  

  </div>
    
  )
}

export default internship