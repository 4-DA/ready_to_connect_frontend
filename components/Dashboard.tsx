import Sidebar from './Sidebar'; 
import ActivityFeed from './ActivityFeed'; 
import StatsCards from './StatsCard'; 
import Calendar from './Calendar'; 
import ProgressSection from './ProgressSection'; 
import InternshipsSection from './InternshipSection';


export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="text-sm">John Doe</div>
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
