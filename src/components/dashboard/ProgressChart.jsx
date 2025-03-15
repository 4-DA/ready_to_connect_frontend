import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressChart = () => {
  const data = {
    labels: ['Current Level', 'Remaining'],
    datasets: [
      {
        data: [75, 25], // Example: 75% progress to next level
        backgroundColor: ['#9D4EDD', '#2D2D2D'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-dark-light p-6 rounded-lg shadow-lg"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Level Progress</h3>
      <div className="relative w-40 h-40 mx-auto">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl font-bold text-primary-light">Level 3</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressChart;
