import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileText, 
  Network, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Rooms', href: '/rooms', icon: MessageSquare },
  { name: 'Media', href: '/media', icon: FileText },
  { name: 'Federation', href: '/federation', icon: Network },
  { name: 'Statistics', href: '/stats', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  closeMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileSidebarOpen, closeMobileSidebar }) => {
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden" 
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0`}>
        <div className="flex flex-col h-full bg-blue-700 shadow-lg">
          <div className="flex items-center h-16 px-4 bg-blue-800">
            <div className="flex items-center flex-shrink-0 text-white">
              <span className="text-xl font-bold">Matrix Admin</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="mt-4 px-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => `
                    ${isActive 
                      ? 'bg-blue-800 text-white' 
                      : 'text-blue-100 hover:bg-blue-600'
                    }
                    group flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors duration-150
                  `}
                  onClick={() => {
                    if (isMobileSidebarOpen) {
                      closeMobileSidebar();
                    }
                  }}
                >
                  <item.icon 
                    className="mr-3 h-5 w-5 flex-shrink-0"
                    aria-hidden="true" 
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-blue-800">
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-base font-medium rounded-md text-blue-100 hover:bg-blue-600 w-full transition-colors duration-150"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;