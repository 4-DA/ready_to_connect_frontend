'use client';

import React, { useState, useEffect } from 'react';
import InternshipCard from '@/components/InternshipCard'; // ✅ New Card Component
import Sidebar from '@/components/Sidebar';
import api from '@/utils/api'; // ✅ Your centralized Axios instance
import { useAuth } from '@/contexts/AuthContext'; // ✅ Import Auth Context

interface User {
  id: number;
  email: string;
  full_name?: string;
  user_type: string;
  [key: string]: any;
}

interface Internship {
  id: number;
  title: string;
  description: string;
  location: string;
  company_name: string;
}

export default function InternshipPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loadingInternships, setLoadingInternships] = useState(true);

  const { isAuthenticated, isLoading, user } = useAuth(); // ✅ Use Auth Context

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated || isLoading) return; // ✅ Guard authentication status

      try {
        const response = await api.get('/accounts/auth/user/'); // ✅ Confirm user fetch
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    const fetchInternships = async () => {
      if (!isAuthenticated || isLoading) return; // ✅ Guard internships call

      try {
        const response = await api.get('/opportunities/internships/', {
          params: searchQuery ? { search: searchQuery } : {},
        });
        setInternships(response.data.results || response.data); // ✅ Adjust for paginated results
      } catch (error) {
        console.error('Error fetching internships:', error);
      } finally {
        setLoadingInternships(false);
      }
    };

    fetchInternships();
  }, [searchQuery, isAuthenticated, isLoading]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white relative">
      <Sidebar />

      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-between items-center mb-6">
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search internships..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 bg-[#1e1e23] rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm font-medium">
                {loadingUser ? 'Loading...' : userData?.full_name || user?.full_name || 'Guest'}
              </div>
              <p className="text-xs text-gray-400">
                {loadingUser ? '' : userData?.user_type || user?.user_type || 'User'}
              </p>
            </div>
          </div>
        </header>

        {/* Internship Results */}
        {loadingInternships ? (
          <div className="flex justify-center items-center mt-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
          </div>
        ) : internships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">No internships found.</p>
        )}
      </div>
    </div>
  );
}
