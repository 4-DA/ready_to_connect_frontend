"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  DateRange as CalendarIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

// Type definition for Internship
interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  deadline: string;
  tags?: string[];
}

export default function InternshipsSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock internship data (replace with actual dynamic data source)
  const INTERNSHIPS: Internship[] = [
    {
      id: "1",
      title: "Software Engineering Intern",
      company: "TechCorp",
      location: "San Francisco, CA",
      deadline: "3/19/2025",
      tags: ["Tech", "Engineering"],
    },
    {
      id: "2",
      title: "Marketing Intern",
      company: "GrowEasy",
      location: "New York, NY",
      deadline: "3/24/2025",
      tags: ["Marketing", "Business"],
    },
    {
      id: "3",
      title: "Data Analysis Intern",
      company: "DataWorks",
      location: "Chicago, IL",
      deadline: "3/29/2025",
      tags: ["Data", "Analytics"],
    },
    {
      id: "4",
      title: "UX/UI Design Intern",
      company: "DesignHub",
      location: "Seattle, WA",
      deadline: "4/05/2025",
      tags: ["Design", "UX"],
    },
    {
      id: "5",
      title: "Product Management Intern",
      company: "ProductLab",
      location: "Austin, TX",
      deadline: "4/10/2025",
      tags: ["Product", "Management"],
    },
  ];

  // Filtered and memoized internships
  const filteredInternships = useMemo(() => {
    if (!searchQuery) return INTERNSHIPS;

    const lowercaseQuery = searchQuery.toLowerCase();
    return INTERNSHIPS.filter(
      (internship) =>
        internship.title.toLowerCase().includes(lowercaseQuery) ||
        internship.company.toLowerCase().includes(lowercaseQuery) ||
        internship.location.toLowerCase().includes(lowercaseQuery) ||
        internship.tags?.some((tag) =>
          tag.toLowerCase().includes(lowercaseQuery)
        )
    );
  }, [searchQuery]);

  // Internship card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="bg-[#1a1a22] min-h-screen text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-[#252530] rounded-xl text-white 
                focus:outline-none focus:ring-2 focus:ring-purple-500 
                transition-all duration-300 text-sm"
            />
            <SearchIcon
              className="absolute left-4 top-1/2 transform -translate-y-1/2 
                text-gray-400 opacity-70"
            />
          </div>
        </div>

        {/* Internships List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <WorkIcon className="mr-3 text-purple-400" />
            Recommended Internships
          </h2>

          <AnimatePresence>
            {filteredInternships.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 py-8"
              >
                No internships found matching your search
              </motion.div>
            ) : (
              filteredInternships.map((internship, index) => (
                <motion.div
                  key={internship.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="bg-[#252530] rounded-xl p-5 hover:bg-[#2c2c3a] 
                    transition-colors duration-300 group"
                >
                  <div className="flex items-start">
                    <div
                      className="bg-purple-500/20 p-3 rounded-lg mr-4 
                      group-hover:bg-purple-500/30 transition-colors"
                    >
                      <WorkIcon className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-lg font-semibold mb-1 
                        group-hover:text-purple-300 transition-colors"
                      >
                        {internship.title}
                      </h3>
                      <div className="text-sm text-gray-400 mb-2">
                        {internship.company}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 space-x-3">
                        <div className="flex items-center">
                          <LocationIcon className="mr-1 text-sm" />
                          {internship.location}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 text-sm" />
                          Apply by {internship.deadline}
                        </div>
                      </div>
                      {internship.tags && (
                        <div className="mt-2 flex space-x-2">
                          {internship.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-purple-500/10 text-purple-300 
                                px-2 py-1 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
