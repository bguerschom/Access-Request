// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { Upload, FileText } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    {
      path: '/upload',
      icon: <Upload size={20} />,
      label: 'Upload Request'
    },
    {
      path: '/requests',
      icon: <FileText size={20} />,
      label: 'View Requests'
    }
  ];

  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-white shadow-lg">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
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

export default Layout;
