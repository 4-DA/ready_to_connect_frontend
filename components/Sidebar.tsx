'use client'
import { useState } from 'react';
import Link from 'next/link';
import { 
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon, 
  AutoAwesome as AutoAwesomeIcon,
  SignalCellularAlt as SignalCellularAltIcon,

} from '@mui/icons-material';

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { icon: <DashboardIcon />, label: 'Dashboard', href: '/', active: true },
    { icon: <AutoAwesomeIcon />, label: 'Ai Mentor', href: '/AiMentor', active: false }, 
    { icon: <SignalCellularAltIcon />, label: 'Skills Assesment', href: '/SkillAssessment', active: false },
    { icon: <WorkIcon />, label: 'Internships', href: '#', active: false },
    { icon: <SchoolIcon />, label: 'Courses', href: '#', active: false },
    { icon: <SettingsIcon />, label: 'Settings', href: '#', active: false }
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button - Only visible on small screens */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden bg-[#252530] p-2 rounded-lg text-gray-200"
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

      {/* Sidebar - Desktop (always visible) & Mobile (conditionally visible) */}
      <div 
        className={`
          fixed h-full z-50 bg-[#1a1a22] transition-all duration-300 ease-in-out
          ${expanded ? 'w-64' : 'w-16'} 
          md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header with logo and toggle */}
          <div className="flex items-center p-4 justify-between">
            <div className="flex items-center">
              
              {expanded && <span className="ml-3 font-semibold text-white">Ready to Connect</span>}
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
                className={`
                  flex items-center gap-3 p-2 rounded-lg transition-colors
                  ${item.active 
                    ? 'text-purple-400 bg-[#2a2a35]' 
                    : 'text-gray-400 hover:text-purple-400 hover:bg-[#252530]'
                  }
                `}
              >
                <div>{item.icon}</div>
                {expanded && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto p-3">
            <Link
              href="#"
              className="flex items-center gap-3 p-2 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-[#252530]"
            >
              <LogoutIcon />
              {expanded && <span>Logout</span>}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}