
export const ROLE_ACCESS = {
  admin: {
    name: 'Admin',
    access: ['dashboard', 'upload', 'requests', 'reports', 'users', 'settings']
  },
  user: {
    name: 'User',
    access: ['dashboard', 'upload', 'requests', 'reports']
  },
  security: {
    name: 'Security',
    access: ['dashboard', 'requests', 'reports']
  }
};
