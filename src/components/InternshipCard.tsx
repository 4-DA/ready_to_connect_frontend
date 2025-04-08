'use client';

interface Internship {
  id: number;
  title: string;
  description: string;
  location: string;
  company_name: string;
}

export default function InternshipCard({ internship }: { internship: Internship }) {
  return (
    <div className="bg-[#1e1e23] p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <h3 className="text-xl font-bold text-white mb-2">{internship.title}</h3>
      <p className="text-sm text-gray-400 mb-1">{internship.company_name}</p>
      <p className="text-sm text-gray-400 mb-4">{internship.location}</p>
      <p className="text-xs text-gray-500 mb-4">{internship.description.slice(0, 100)}...</p>
      <button className="mt-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
        View Details
      </button>
    </div>
  );
}