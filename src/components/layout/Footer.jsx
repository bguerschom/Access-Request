// src/components/layout/Footer.jsx
import { Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
<footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto">
  <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
    <div className="flex justify-center items-center">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        © {currentYear} Access Request System. All rights reserved.
      </div>
    </div>
  </div>
</footer>
  );
};

export default Footer;
