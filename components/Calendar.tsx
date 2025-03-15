import { CalendarToday as CalendarIcon } from '@mui/icons-material';

export default function EventsCalendar() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  
  // Important dates (highlighted in purple)
  const importantDates = [15, 19, 24, 29];
  
  return (
    <div className="bg-[#1a1a22] rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Upcoming Events</h2>
        <CalendarIcon className="text-purple-400" />
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map(day => (
          <div key={day} className="text-xs text-gray-400 py-1">{day}</div>
        ))}
        
        {Array.from({ length: 31 }, (_, i) => i + 1).map(date => {
          const isImportant = importantDates.includes(date);
          const isCurrentDay = date === currentDay;
          
          return (
            <div 
              key={date}
              className={`
                text-sm h-8 flex items-center justify-center rounded-full
                ${isImportant ? 'bg-purple-500 text-white' : isCurrentDay ? 'border border-gray-600' : ''}
              `}
            >
              {date}
            </div>
          );
        })}
      </div>
    </div>
  );
}