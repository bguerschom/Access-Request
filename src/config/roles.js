// src/config/roles.js
export const ROLE_ACCESS = {
  admin: {
    name: 'Admin',
    access: ['dashboard', 'upload', 'requests', 'reports', 'users', 'settings', 'guide']
  },
  user: {
    name: 'User',
    access: ['dashboard', 'upload', 'requests','reports', 'guide']
  },
  security: {
    name: 'Security',
    access: ['dashboard', 'requests','reports', 'guide']
  }
};
