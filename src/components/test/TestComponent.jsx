
import React from 'react';

const TestComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-primary-600 mb-4">ReadyUp is Working!</h1>
        <p className="text-gray-600 mb-6">This is a test component to verify that Tailwind CSS is working properly.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-primary-500 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded">
            Primary Button
          </button>
          <button className="bg-secondary-500 hover:bg-secondary-700 text-white font-bold py-2 px-4 rounded">
            Secondary Button
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg">
          <p className="font-medium">Tailwind is working if you see:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Colored buttons (blue and purple)</li>
            <li>Rounded corners</li>
            <li>This green notification box</li>
            <li>Proper spacing and layout</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
