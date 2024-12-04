import { NavLink } from 'react-router-dom';
import { Upload, FileText } from 'lucide-react';

export const Sidebar = ({ isOpen = true }) => {  // Add isOpen prop with default value
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
    <aside className={`
      fixed inset-y-0 left-0 z-50
      w-64 bg-white dark:bg-gray-800 shadow-lg
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:relative lg:translate-x-0
    `}>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#0A2647] text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
