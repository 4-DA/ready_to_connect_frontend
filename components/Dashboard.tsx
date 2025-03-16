import Sidebar from './Sidebar'; 
import ActivityFeed from './ActivityFeed'; 
import StatsCards from './StatsCard'; 
import Calendar from './Calendar'; 
import ProgressSection from './ProgressSection'; 
import InternshipsSection from './InternshipSection';
import Image from 'next/image';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white">
      <Sidebar />
      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-between items-center mb-6">
          {/* Search input field */}
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 bg-[#1e1e23] rounded-md text-sm text-white focus:outline-none"
          />
          <div className="flex items-center gap-4">
            {/* Circular image next to John Doe */} 

            <Image
            src="/Jane-doe.png" 
            alt="profile" 
            height={80} 
            width ={80} 
            className="rounded-full"
            />
            <div className="text-sm">John Doe</div>
          </div>
        </header>
        
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <ProgressSection />
          <InternshipsSection />
          <div className="flex flex-col gap-6">
            <Calendar />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
