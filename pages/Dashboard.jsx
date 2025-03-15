import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import StatsCard from '../components/dashboard/StatsCard';
import ProgressChart from '../components/dashboard/ProgressChart';
import InternshipCard from '../components/dashboard/InternshipCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import Calendar from '../components/dashboard/Calendar';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const Dashboard = () => {
  const stats = [
    { title: 'Current Level', value: '3', gradient: 'bg-gradient-to-r from-primary to-primary-dark' },
    { title: 'Points Earned', value: '1,250', gradient: 'bg-gradient-to-r from-purple-500 to-primary' },
    { title: 'Applications', value: '5', gradient: 'bg-gradient-to-r from-primary-light to-primary' },
    { title: 'Mentorship Sessions', value: '2', gradient: 'bg-gradient-to-r from-purple-400 to-primary-light' },
  ];

  const internships = [
    { title: 'Software Engineering Intern', company: 'TechCorp', date: 'Apply by Mar 20, 2025' },
    { title: 'Marketing Intern', company: 'GrowEasy', date: 'Apply by Mar 25, 2025' },
    { title: 'Data Analyst Intern', company: 'DataWorks', date: 'Apply by Mar 30, 2025' },
  ];

  const activities = [
    { message: 'You earned a new badge!', date: 'Mar 14, 2025' },
    { message: 'Interview scheduled with TechCorp', date: 'Mar 13, 2025' },
  ];

  return (
    <div className="relative min-h-screen bg-dark">
      <AnimatedBackground />
      <Sidebar />
      <Header />
      <div className="ml-64 pt-20 px-6 pb-6">
        <div className="flex space-x-4 mb-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} title={stat.title} value={stat.value} gradient={stat.gradient} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProgressChart />
          </div>
          <div className="md:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-white">Recommended Internships</h3>
            {internships.map((internship, index) => (
              <InternshipCard
                key={index}
                title={internship.title}
                company={internship.company}
                date={internship.date}
              />
            ))}
          </div>
          <div className="md:col-span-1 space-y-4">
            <Calendar />
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              {activities.map((activity, index) => (
                <RecentActivity
                  key={index}
                  message={activity.message}
                  date={activity.date}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
