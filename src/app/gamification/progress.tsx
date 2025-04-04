import { motion } from "framer-motion";

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="bg-dark-light p-4 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-white mb-2">📊 Progress to Next Level</h3>
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

export default ProgressBar;
