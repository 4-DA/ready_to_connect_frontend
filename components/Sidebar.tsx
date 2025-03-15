import Link from 'next/link';
import { 
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

export default function Sidebar() {
  return (
    <div className="w-16 bg-[#1a1a22] flex flex-col items-center py-6 fixed h-full">
      <div className="bg-purple-600 p-2 rounded-lg mb-8">
        <span className="text-xl font-bold">S</span>
      </div>
      
      <nav className="flex flex-col gap-6 items-center">
        <Link href="#" className="text-purple-400 p-2 rounded-lg bg-[#2a2a35]">
          <DashboardIcon />
        </Link>
        <Link href="#" className="text-gray-400 hover:text-purple-400 p-2 rounded-lg">
          <PersonIcon />
        </Link>
        <Link href="#" className="text-gray-400 hover:text-purple-400 p-2 rounded-lg">
          <WorkIcon />
        </Link>
        <Link href="#" className="text-gray-400 hover:text-purple-400 p-2 rounded-lg">
          <SchoolIcon />
        </Link>
        <Link href="#" className="text-gray-400 hover:text-purple-400 p-2 rounded-lg mt-auto">
          <SettingsIcon />
        </Link>
      </nav>
    </div>
  );
}
