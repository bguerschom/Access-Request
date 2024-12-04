// src/components/dashboard/Sidebar.jsx
import { FileText, Upload, List } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white h-full shadow-lg">
      <div className="p-4">
        <h2 className="text-lg font-bold text-[#0A2647]">Access Request</h2>
      </div>
      <nav className="mt-4">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-2 px-4 py-3 ${
            isActive('/dashboard') 
              ? 'bg-[#0A2647] text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <List size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link
          to="/upload"
          className={`flex items-center space-x-2 px-4 py-3 ${
            isActive('/upload') 
              ? 'bg-[#0A2647] text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Upload size={20} />
          <span>Upload Request</span>
        </Link>
        
        <Link
          to="/requests"
          className={`flex items-center space-x-2 px-4 py-3 ${
            isActive('/requests') 
              ? 'bg-[#0A2647] text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText size={20} />
          <span>View Requests</span>
        </Link>
      </nav>
    </div>
  );
};
