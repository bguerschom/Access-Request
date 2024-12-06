// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { Home, Upload, FileText, BarChart2, Users, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Sidebar = () => {
  const { user, userData } = useAuth(); // Updated useAuth hook to include user role

  // Define navigation items with role access
  const navItems = [
    {
      path: '/dashboard',
      icon: <Home size={20} />,
      label: 'Dashboard',
      roles: ['admin', 'user', 'security'] // Everyone can see dashboard
    },
    {
      path: '/upload',
      icon: <Upload size={20} />,
      label: 'Upload Request',
      roles: ['admin', 'user'] // Only admin and regular users can upload
    },
    {
      path: '/requests',
      icon: <FileText size={20} />,
      label: 'View Requests',
      roles: ['admin', 'user', 'security'] // Everyone can view requests
    },
    {
      path: '/reports',
      icon: <BarChart2 size={20} />,
      label: 'Reports',
      roles: ['admin'] // Only admin can see reports
    },
    {
      path: '/users',
      icon: <Users size={20} />,
      label: 'User Management',
      roles: ['admin'] // Only admin can manage users
    },
    {
      path: '/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
      roles: ['admin'] // Only admin can access settings
    }
  ];

  // Filter nav items based on user role
  const allowedNavItems = navItems.filter(item => 
    item.roles.includes(userData?.role || 'user')
  );

  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-white shadow-lg">
      <nav className="p-4 space-y-2">
        {allowedNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#0A2647] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
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
