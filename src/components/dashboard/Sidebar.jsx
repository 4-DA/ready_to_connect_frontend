import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight"; // For expand icon

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(isOpen);

  useEffect(() => {
    setIsSidebarOpen(isOpen);
  }, [isOpen]);

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/profile", label: "Profile", icon: <PersonIcon /> },
    { path: "/internships", label: "Internships", icon: <WorkIcon /> },
    { path: "/mentorship", label: "Mentorship", icon: <SchoolIcon /> },
    { path: "/skills", label: "Skills", icon: <SchoolIcon /> },
    { path: "/settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <motion.div
      initial={{ x: isSidebarOpen ? 0 : -250 }}
      animate={{ x: isSidebarOpen ? 0 : -250 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 h-screen bg-dark-light p-4 flex flex-col justify-between z-20 ${
        isSidebarOpen ? "w-64" : "w-16"
      } shadow-lg`}
    >
      <div>
        <div className="text-center mb-4">
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-primary transition-colors duration-200 mb-4"
          >
            {isSidebarOpen ? <MenuIcon /> : <ChevronRightIcon />}
          </button>
          {isSidebarOpen && (
            <h2 className="text-2xl font-bold text-white">ReadyUp</h2>
          )}
        </div>
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-2 mb-2 rounded-lg transition-colors duration-200 ${
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:bg-dark-lighter"
              } ${!isSidebarOpen ? "justify-center" : ""}`}
            >
              <span className="mr-3">{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div>
        <Link
          to="/login"
          className={`flex items-center p-2 rounded-lg text-gray-400 hover:bg-dark-lighter transition-colors duration-200 ${
            !isSidebarOpen ? "justify-center" : ""
          }`}
        >
          <LogoutIcon className="mr-3" />
          {isSidebarOpen && <span>Logout</span>}
        </Link>
      </div>
    </motion.div>
  );
};

export default Sidebar;
