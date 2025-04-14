// components/Sidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/app/providers/ThemeProvider";

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
  roles?: string[];
}

interface SidebarProps {
  userType?: string;
}

export default function Sidebar({ userType = "student" }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { glassPrimary, glassBorder, gradientOverlay, primaryColor } =
    useTheme();

  const toggleSidebar = () => setExpanded((prev) => !prev);
  const toggleMobileSidebar = () => setMobileOpen((prev) => !prev);

  useEffect(() => {
    const fetchNavItems = async () => {
      if (isAuthenticated && user) {
        const effectiveUserType =
          userType || user.user_type?.toLowerCase() || "student";
        console.log("Sidebar - Effective User Type:", effectiveUserType);

        const baseNavItems: NavItem[] = [
          {
            icon: <DashboardIcon />,
            label: "Dashboard",
            href: `/dashboard/${effectiveUserType}`,
          },
          {
            icon: <AutoAwesomeIcon />,
            label: "AI Mentor",
            href: `/dashboard/${effectiveUserType}/ai-mentor`,
            roles: ["student", "mentor"],
          },
          {
            icon: <SchoolIcon />,
            label: "Skill Assessment",
            href: `/dashboard/${effectiveUserType}/skill-assessment`,
            roles: ["student", "mentor"],
          },
          {
            icon: <WorkIcon />,
            label: "Internships",
            href: `/dashboard/${effectiveUserType}/internship`,
            roles: ["student"],
          },
          {
            icon: <SettingsIcon />,
            label: "Settings",
            href: `/dashboard/${effectiveUserType}/settings`,
          },
          {
            icon: <GamesIcon />,
            label: "Gamification",
            href: `/dashboard/${effectiveUserType}/gamification`,
            roles: ["student"],
          },
          {
            icon: <SignalCellularAltIcon />,
            label: "Leaderboard",
            href: `/dashboard/${effectiveUserType}/gamification/leaderboard`,
            roles: ["student"],
          },
          {
            icon: <StarIcon />,
            label: "Badges",
            href: `/dashboard/${effectiveUserType}/gamification/badges`,
            roles: ["student"],
          },
          {
            icon: <EmojiEventsIcon />,
            label: "XP History",
            href: `/dashboard/${effectiveUserType}/gamification/xp-logs`,
            roles: ["student"],
          },
        ];

        const roleBasedItems = baseNavItems.filter((item) =>
          item.roles ? item.roles.includes(effectiveUserType) : true
        );
        console.log("Sidebar - Nav Items:", roleBasedItems);
        setNavItems(roleBasedItems);
      } else {
        const unauthenticatedItems: NavItem[] = [
          { icon: <DashboardIcon />, label: "Home", href: "/" },
          { icon: <PersonIcon />, label: "Sign In", href: "/signin" },
        ];
        console.log(
          "Sidebar - Unauthenticated Nav Items:",
          unauthenticatedItems
        );
        setNavItems(unauthenticatedItems);
      }
    };

    fetchNavItems();
  }, [isAuthenticated, user, userType]);

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  if (!isAuthenticated && pathname !== "/signin") {
    return null;
  }

  return (
    <>
      <button
        className={`fixed top-4 left-4 z-50 md:hidden ${glassPrimary} ${glassBorder} p-2 rounded-lg text-gray-200 hover:bg-${primaryColor}-600/30 transition`}
        onClick={toggleMobileSidebar}
        aria-label="Toggle mobile menu"
      >
        <MenuIcon />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed h-full z-50 ${glassPrimary} ${glassBorder} shadow-xl transition-all duration-300 ease-in-out ${
          expanded ? "w-64" : "w-16"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-full ${gradientOverlay} z-0`}
        ></div>
        <div className="flex flex-col h-full relative z-10">
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

          <nav
            className="flex flex-col gap-2 mt-8 px-3"
            aria-labelledby="nav-label"
          >
            <span id="nav-label" className="sr-only">
              Navigation Menu
            </span>
            {navItems.length === 0 ? (
              <div className="text-gray-400 p-2">Loading navigation...</div>
            ) : (
              navItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    pathname === item.href
                      ? `text-${primaryColor}-400 bg-${primaryColor}-600/20`
                      : `text-gray-400 hover:text-${primaryColor}-400 hover:bg-${primaryColor}-600/10`
                  }`}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  <div className="text-lg">{item.icon}</div>
                  {expanded && <span>{item.label}</span>}
                </Link>
              ))
            )}
          </nav>

          {isAuthenticated && (
            <div className="mt-auto p-3">
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 p-2 rounded-lg text-gray-400 hover:text-${primaryColor}-400 hover:bg-${primaryColor}-600/10 transition-all w-full`}
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
