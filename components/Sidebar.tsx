"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ✅ Use direct imports for all icons
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

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname(); // Get current route for active highlighting

  const toggleSidebar = () => setExpanded((prev) => !prev);
  const toggleMobileSidebar = () => setMobileOpen((prev) => !prev);

  const navItems = [
    { icon: <DashboardIcon />, label: "Dashboard", href: "/" },
    { icon: <AutoAwesomeIcon />, label: "AI Mentor", href: "/AiMentor" },
    {
      icon: <GamesIcon />,
      label: "Skills Assessment",
      href: "/SkillAssessment",
    },
    { icon: <WorkIcon />, label: "Internships", href: "/internships" },
    { icon: <SchoolIcon />, label: "Courses", href: "/courses" },
    { icon: <SettingsIcon />, label: "Settings", href: "/settings" },
    { icon: <PersonIcon />, label: "Profile", href: "/profile" },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#252530] p-2 rounded-lg text-gray-200 hover:bg-[#1a1a22] transition"
        onClick={toggleMobileSidebar}
      >
        <MenuIcon />
      </button>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed h-full z-50 bg-[#1a1a22] shadow-xl transition-all duration-300 ease-in-out
          ${expanded ? "w-64" : "w-16"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
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
            >
              {expanded ? <ChevronLeftIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 mt-8 px-3">
            {navItems.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 transform hover:scale-105
                  ${
                    pathname === item.href
                      ? "text-purple-400 bg-[#2a2a35]"
                      : "text-gray-400 hover:text-purple-400 hover:bg-[#252530]"
                  }
                `}
              >
                <div className="text-lg">{item.icon}</div>
                {expanded && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="mt-auto p-3">
            <Link
              href="#"
              className="flex items-center gap-3 p-2 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-[#252530] transition-all"
            >
              <ExitToAppIcon />
              {expanded && <span>Logout</span>}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
