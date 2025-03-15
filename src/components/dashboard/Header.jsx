import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-gray-300 mr-4"
          >
            <MenuIcon />
          </button>
        )}
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      </div>
      <div className="text-white">
        <span>John Doe</span>
        {/* Add profile icon or other header content */}
      </div>
    </div>
  );
};

export default Header;
