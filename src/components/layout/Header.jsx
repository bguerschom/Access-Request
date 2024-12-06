// src/components/layout/Header.jsx
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/config/firebase';
import { useTheme } from '@/context/ThemeContext';

export const Header = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left side */}
          <div className="flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-8 w-auto cursor-pointer"
              onClick={() => navigate('/dashboard')}
            />
          </div>
          
          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{auth.currentUser?.email}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
