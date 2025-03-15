import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import StatsCard from "../components/dashboard/StatsCard";
import ProgressChart from "../components/dashboard/ProgressChart";
import InternshipCard from "../components/dashboard/InternshipCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import Calendar from "../components/dashboard/Calendar";
import AnimatedBackground from "../components/ui/AnimatedBackground";

const Dashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [internships, setInternships] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const studentId = user.id;

        // Mock data for testing
        const mockStudent = {
          skillLevel: 3,
          totalPoints: 1250,
          appliedInternships: [{}, {}, {}, {}, {}], // 5 applications
          aiConversationHistory: [{}, {}], // 2 mentorship sessions
          interests: ["software", "marketing"],
        };
        const mockInternships = [
          {
            title: "Software Engineering Intern",
            business: { companyName: "TechCorp" },
            applicationDeadline: "2025-03-20",
          },
          {
            title: "Marketing Intern",
            business: { companyName: "GrowEasy" },
            applicationDeadline: "2025-03-25",
          },
          {
            title: "Data Analyst Intern",
            business: { companyName: "DataWorks" },
            applicationDeadline: "2025-03-30",
          },
        ];
        const mockNotifications = [
          {
            message: "You earned a new badge!",
            createdAt: "2025-03-14T10:00:00Z",
            type: "achievement",
          },
          {
            message: "Interview scheduled with TechCorp",
            createdAt: "2025-03-13T12:00:00Z",
            type: "application",
          },
        ];

        setStudent(mockStudent);
        setInternships(mockInternships);
        setNotifications(mockNotifications);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (error || !student) {
    return (
      <div className="text-white text-center">
        {error || "Error loading student data."}
      </div>
    );
  }

  // Calculate stats
  const stats = [
    {
      title: "Points Earned",
      value: student.totalPoints || 0,
      gradient: "bg-gradient-to-r from-purple-500 to-primary",
    },
    {
      title: "Applications",
      value: student.appliedInternships?.length || 0,
      gradient: "bg-gradient-to-r from-primary-light to-primary",
    },
    {
      title: "Mentorship Sessions",
      value: student.aiConversationHistory?.length || 0,
      gradient: "bg-gradient-to-r from-purple-400 to-primary-light",
    },
  ];

  // Calculate progress to next level (assuming 500 points per level)
  const pointsPerLevel = 500;
  const progressToNextLevel = student.totalPoints
    ? ((student.totalPoints % pointsPerLevel) / pointsPerLevel) * 100
    : 0;

  // Prepare recent activities
  const activities = notifications
    .filter((notification) =>
      ["achievement", "application"].includes(notification.type)
    )
    .slice(0, 3)
    .map((notification) => ({
      message: notification.message,
      date: new Date(notification.createdAt).toLocaleDateString(),
    }));

  // Prepare calendar events
  const eventDates = internships
    .filter((internship) => internship.applicationDeadline)
    .map((internship) => new Date(internship.applicationDeadline).getDate());

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-dark flex flex-row w-screen overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 pl-6 pr-0 pt-20 pb-6 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-0" : "ml-16"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-4 mb-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="transform hover:scale-105 transition-transform duration-200"
                >
                  <StatsCard
                    title={stat.title}
                    value={stat.value}
                    gradient={stat.gradient}
                  />
                </div>
              ))}
            </div>
            <div className="bg-dark-lighter p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">
                Recommended Internships
              </h3>
              <div className="space-y-4">
                {internships.slice(0, 3).map((internship, index) => (
                  <div
                    key={index}
                    className="transform hover:scale-[1.02] transition-transform duration-200"
                  >
                    <InternshipCard
                      title={internship.title}
                      company={
                        internship.business?.companyName || "Unknown Company"
                      }
                      date={`Apply by ${new Date(
                        internship.applicationDeadline
                      ).toLocaleDateString()}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-1 space-y-6">
            <div className="bg-dark-lighter p-6 rounded-lg shadow-lg">
              <Calendar eventDates={eventDates} />
            </div>
            <div className="bg-dark-lighter p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="transform hover:scale-[1.02] transition-transform duration-200"
                  >
                    <RecentActivity
                      message={activity.message}
                      date={activity.date}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatedBackground />
    </div>
  );
};

export default Dashboard;
