"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // For authentication state
import api from "@/utils/api"; // For fetching user data

import GamesIcon from "@mui/icons-material/Games";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  roles?: string[]; // Optional roles to restrict access
}

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  // Toggle sidebar functions
  const toggleSidebar = () => setExpanded((prev) => !prev);
  const toggleMobileSidebar = () => setMobileOpen((prev) => !prev);

  // Fetch user role and update nav items
  useEffect(() => {
    const fetchUserRole = async () => {
      if (isAuthenticated && user) {
        try {
          // Optionally fetch user data if not fully available in AuthContext
          const response = await api.get("/accounts/auth/user/", {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
          });
          const userRole = response.data.user_type || "student"; // Default to student

          // Define nav items based on role
          const baseNavItems: NavItem[] = [
            { icon: <DashboardIcon />, label: "Dashboard", href: "/" },
            { icon: <AutoAwesomeIcon />, label: "AI Mentor", href: "/ai-mentor" },
            // { icon: <GamesIcon />, label: "Gamification", href: "/gamification/" },
            // { icon: <SignalCellularAltIcon />, label: "Leaderboard", href: "/gamification/leaderboard" },
            // { icon: <StarIcon />, label: "Badges", href: "/gamification/badges" },
            { icon: <SchoolIcon />, label: "Skill Assessment", href: "/skill-assessment" },
            // { icon: <EmojiEventsIcon />, label: "XP History", href: "/gamification/xp-logs" },
            { icon: <WorkIcon />, label: "Internships", href: "/internship" },
          ];

          // Role-specific restrictions (example)
          const roleBasedItems = baseNavItems.filter((item) => {
            if (!item.roles) return true; // Allow if no roles specified
            return item.roles.includes(userRole);
          });
          setNavItems(roleBasedItems);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        // Default nav items for unauthenticated users
        setNavItems([
          { icon: <DashboardIcon />, label: "Dashboard", href: "/" },
          { icon: <PersonIcon />, label: "Sign In", href: "/signin" },
        ]);
      }
    };

    fetchUserRole();
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout(); // Use AuthContext's logout
  };

  if (!isAuthenticated && pathname !== "/signin") {
    return null; // Hide sidebar for unauthenticated users except on sign-in page
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#252530] p-2 rounded-lg text-gray-200 hover:bg-[#1a1a22] transition"
        onClick={toggleMobileSidebar}
        aria-label="Toggle mobile menu"
      >
        <MenuIcon />
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed h-full z-50 bg-[#1a1a22] shadow-xl transition-all duration-300 ease-in-out ${
          expanded ? "w-64" : "w-16"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center p-4 justify-between">
            <div className="flex items-center">
              {expanded && (
                <span className="ml-3 font-semibold text-white text-lg">
                  Ready to Connect
                </span>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white hidden md:block"
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {expanded ? <ChevronLeftIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 mt-8 px-3" aria-labelledby="nav-label">
            <span id="nav-label" className="sr-only">Navigation Menu</span>
            {navItems.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  pathname === item.href
                    ? "text-purple-400 bg-[#2a2a35]"
                    : "text-gray-400 hover:text-purple-400 hover:bg-[#252530]"
                }`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <div className="text-lg">{item.icon}</div>
                {expanded && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          {isAuthenticated && (
            <div className="mt-auto p-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-2 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-[#252530] transition-all w-full"
                aria-label="Logout"
              >
                <ExitToAppIcon />
                {expanded && <span>Logout</span>}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}