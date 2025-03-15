import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import AnimatedBackground from '../components/ui/AnimatedBackground';

// Placeholder components (to be implemented)
const StreakCounter = ({ streak }) => (
  <div className="bg-dark-light p-4 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-white mb-2">Streak</h3>
    <p className="text-2xl text-primary">{streak} days 🔥</p>
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="bg-dark-light p-4 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-white mb-2">Progress to Next Level</h3>
    <div className="w-full bg-gray-700 rounded-full h-4">
      <motion.div
        className="bg-primary h-4 rounded-full"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1 }}
      />
    </div>
    <p className="text-sm text-gray-400 mt-2">{progress}% Complete</p>
  </div>
);

const DailyChallenge = ({ challenge }) => (
  <div className="bg-dark-light p-4 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-white mb-2">Daily Challenge</h3>
    <p className="text-gray-400">{challenge.description}</p>
    <button className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
      Start (Earn {challenge.pointsAvailable} pts)
    </button>
  </div>
);

const BadgeGallery = ({ badges }) => (
  <div className="bg-dark-light p-4 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-white mb-2">Badges Earned</h3>
    <div className="grid grid-cols-2 gap-2">
      {badges.map((badge) => (
        <motion.div
          key={badge.id}
          className="bg-gray-800 p-2 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <img src={badge.imageUrl} alt={badge.name} className="w-16 h-16 mx-auto" />
          <p className="text-sm text-gray-400">{badge.name}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const GamingDashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock student data (replace with API call)
        const mockStudent = {
          skillLevel: 3,
          totalPoints: 1250,
          badges: [
            { id: '1', name: 'Beginner', imageUrl: '/badges/beginner.png', pointsRequired: 100 },
            { id: '2', name: 'Explorer', imageUrl: '/badges/explorer.png', pointsRequired: 500 },
          ],
          aiConversationHistory: [
            { timestamp: new Date('2025-03-14'), pointsAwarded: 10 },
            { timestamp: new Date('2025-03-15'), pointsAwarded: 15 },
          ],
        };
        setStudent(mockStudent);

        // Calculate streak based on AI interactions or assessments
        const interactions = mockStudent.aiConversationHistory;
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < interactions.length; i++) {
          const interactionDate = new Date(interactions[i].timestamp);
          interactionDate.setHours(0, 0, 0, 0);
          const diffDays = Math.floor((today - interactionDate) / (1000 * 60 * 60 * 24));
          if (diffDays === currentStreak) {
            currentStreak++;
          } else if (diffDays > currentStreak) {
            break;
          }
        }
        setStreak(currentStreak);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (!student) return <div className="text-white text-center">Error loading data.</div>;

  const progress = (student.totalPoints % 500) / 5; // 500 points per level
  const dailyChallenge = {
    title: 'Daily Career Quiz',
    description: 'Answer 5 questions about software development.',
    pointsAvailable: 50,
  };

  return (
    <div className="relative min-h-screen bg-dark">
      <AnimatedBackground />
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="ml-64 pt-20 px-6 pb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-6">Career Quest Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <StreakCounter streak={streak} />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ProgressBar progress={progress} />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <DailyChallenge challenge={dailyChallenge} />
          </motion.div>
          <motion.div
            className="md:col-span-2 lg:col-span-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <BadgeGallery badges={student.badges} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GamingDashboard;
