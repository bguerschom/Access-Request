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
    <header className="bg-white dark:bg-gray-800 shadow-sm w-full fixed top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Left Side: Logo */}
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-6 w-auto" // Adjusted height of logo to match reduced header height
            />
          </div>

          {/* Right Side: Theme Toggle, User Info, Logout */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* User Info */}
            <div className="hidden sm:flex items-center text-sm text-gray-600 dark:text-gray-300">
              <User className="h-4 w-4 mr-1" />
              <span className="text-xs">{auth.currentUser?.email}</span> {/* Smaller text size */}
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 dark:text-gray-300 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
