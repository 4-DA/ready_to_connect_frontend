import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/profile', label: 'Profile', icon: <PersonIcon /> },
    { path: '/internships', label: 'Internships', icon: <WorkIcon /> },
    { path: '/mentorship', label: 'Mentorship', icon: <SchoolIcon /> },
    { path: '/skills', label: 'Skills', icon: <SchoolIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 h-screen w-64 bg-dark-light p-4 flex flex-col justify-between z-20"
    >
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">ReadyUp</h2>
        </div>
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={\`flex items-center p-3 mb-2 rounded-lg transition-colors duration-200 \${location.pathname === item.path
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-dark-lighter'}\`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div>
        <Link
          to="/login"
          className="flex items-center p-3 rounded-lg text-gray-400 hover:bg-dark-lighter transition-colors duration-200"
        >
          <LogoutIcon className="mr-3" />
          Logout
        </Link>
      </div>
    </motion.div>
  );
};

export default Sidebar;
