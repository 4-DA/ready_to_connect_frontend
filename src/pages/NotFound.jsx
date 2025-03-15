import React from "react";

function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-4">Oops! The page you are looking for does not exist.</p>
      <a href="/dashboard" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Go to Dashboard
      </a>
    </div>
  );
}

export default NotFound;
