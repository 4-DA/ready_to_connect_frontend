export default function ProgressSection() {
    return (
      <div className="bg-[#1a1a22] rounded-lg p-6">
        <h2 className="text-xl mb-4">Your Progress</h2>
        <div className="bg-[#252530] rounded-lg p-6">
          <h3 className="text-lg mb-6">Level Progress</h3>
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
              {/* Background Circle */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
              
              {/* Progress Circle - 60% complete */}
              <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#9333ea"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset="100.48"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-sm text-purple-400">Level</div>
                <div className="text-2xl font-bold text-purple-400">3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }