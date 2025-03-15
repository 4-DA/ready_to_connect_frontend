import { Notifications as NotificationIcon } from '@mui/icons-material';

export default function ActivityFeed() {
  const activities = [
    {
      message: "You earned a new badge!",
      date: "3/14/2025"
    },
    {
      message: "Interview scheduled with TechCorp",
      date: "3/13/2025"
    }
  ];

  return (
    <div className="bg-[#1a1a22] rounded-lg p-6">
      <h2 className="text-xl mb-4">Recent Activity</h2>
      <div className="flex flex-col gap-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="p-2 bg-[#252530] rounded-lg text-purple-400">
              <NotificationIcon />
            </div>
            <div>
              <p className="text-sm">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
