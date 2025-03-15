import { 
    Description as ApplicationsIcon,
    Star as PointsIcon,
    People as MentorshipIcon 
  } from '@mui/icons-material';
  
  export default function StatsCards() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Applications" 
          value="5" 
          bgClass="bg-gradient-to-r from-blue-500 to-blue-400"
          icon={<ApplicationsIcon />}
        />
        <StatCard 
          title="Points Earned" 
          value="1250" 
          bgClass="bg-gradient-to-r from-purple-600 to-purple-400"
          icon={<PointsIcon />}
        />
        <StatCard 
          title="Mentorship Sessions" 
          value="2" 
          bgClass="bg-gradient-to-r from-purple-500 to-purple-300"
          icon={<MentorshipIcon />}
        />
      </div>
    );
  }
  
  interface StatCardProps {
    title: string;
    value: string;
    bgClass: string;
    icon: React.ReactNode;
  }
  
  function StatCard({ title, value, bgClass, icon }: StatCardProps) {
    return (
      <div className={`${bgClass} rounded-lg p-6 text-white flex flex-col`}>
        <div className="flex items-center gap-2 mb-2 text-sm opacity-90">
          {icon}
          <span>{title}</span>
        </div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
    );
  }
  