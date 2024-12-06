// src/components/layout/Footer.jsx
import { Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto">


            <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Access Request System. All rights reserved.
          </div>
          </div>
          
          
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#0A2647] dark:hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
