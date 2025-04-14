export default function LoadingDashboard() {
  return (
    <div className="flex min-h-screen bg-[#0e0e13] text-white">
      <div className="fixed left-0 top-0 h-full w-16 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg z-20">
        <div className="flex flex-col items-center py-6 h-full">
          <div className="mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/50 animate-pulse"></div>
          </div>

          <div className="flex-1 w-full">
            <ul className="flex flex-col items-center space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="w-full flex justify-center">
                  <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 pl-20">
        <header className="flex justify-end items-center mb-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 animate-pulse w-36 h-12"></div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 animate-pulse h-24 shadow-lg"
            ></div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 animate-pulse h-64 shadow-lg"></div>
          <div className="flex flex-col gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 animate-pulse h-64 shadow-lg"></div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 animate-pulse h-64 shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
