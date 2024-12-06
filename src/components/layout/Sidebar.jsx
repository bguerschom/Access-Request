// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  FileText, 
  BarChart2, 
  Users, 
  Settings,
  BookOpen 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_ACCESS } from '@/config/roles';

export const Sidebar = () => {
  const { userData } = useAuth();
  const userRole = userData?.role || 'user';

  // Define all possible navigation items
  const navItems = [
    {
      path: '/dashboard',
      icon: <Home size={20} />,
      label: 'Dashboard',
      access: 'dashboard'
    },
    {
      path: '/upload',
      icon: <Upload size={20} />,
      label: 'Upload Request',
      access: 'upload'
    },
    {
      path: '/requests',
      icon: <FileText size={20} />,
      label: 'View Requests',
      access: 'requests'
    },
    {
      path: '/reports',
      icon: <BarChart2 size={20} />,
      label: 'Reports',
      access: 'reports'
    },
    {
      path: '/users',
      icon: <Users size={20} />,
      label: 'User Management',
      access: 'users'
    },
    {
      path: '/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
      access: 'settings'
    },
    {
      path: '/guide',
      icon: <BookOpen size={20} />,
      label: 'User Guide',
      access: 'guide'  // Added to ROLE_ACCESS for all roles
    }
  ];

  // Filter nav items based on user role access
  const allowedNavItems = navItems.filter(item => 
    ROLE_ACCESS[userRole]?.access.includes(item.access)
  );

  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-white shadow-lg" style={{ marginTop: '64px' }} >
      <nav className="p-4 space-y-2">
        {allowedNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#0A2647] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
