// src/components/users/UserManagement.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updatePassword } from 'firebase/auth'; 
import { db, auth } from '@/config/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Lock, UserPlus, X, Trash2 } from 'lucide-react';
import { ROLE_ACCESS } from '@/config/roles';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user'
  });

  const roles = {
    admin: ['dashboard', 'upload', 'requests', 'reports', 'users', 'settings'],
    user: ['dashboard', 'upload', 'requests', 'reports'],
    security: ['dashboard', 'requests', 'reports']
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUserData.email,
        newUserData.password
      );

      // Add user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: newUserData.email,
        name: newUserData.name,
        role: newUserData.role,
        createdAt: new Date().toISOString()
      });

      setIsAddUserModalOpen(false);
      setNewUserData({
        email: '',
        password: '',
        name: '',
        role: 'user'
      });
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordChange = async (userId, newPassword) => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      setIsPasswordModalOpen(false);
      setNewPassword('');
    } catch (error) {
      setError('Failed to update password');
      console.error('Error updating password:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };
  const handleDeleteUser = async (userId) => {
  if (window.confirm('Are you sure you want to delete this user?')) {
    try {
      await deleteDoc(doc(db, 'users', userId));
      fetchUsers(); // Refresh list
    } catch (error) {
      setError('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  }
};

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button 
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-[#0A2647]"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Access</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="border rounded p-1"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="security">Security</option>
                      </select>
                    </td>
<td className="px-6 py-4">
  <div className="text-sm">
    {ROLE_ACCESS[user.role]?.access.map(access => (
      <span key={access} className="inline-block bg-gray-100 px-2 py-1 rounded mr-1 mb-1">
        {access}
      </span>
    ))}
  </div>
</td>

<td className="px-6 py-4">
  <div className="flex space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        setSelectedUser(user);
        setIsPasswordModalOpen(true);
      }}
    >
      <Lock className="w-4 h-4 mr-2" />
      Change Password
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleDeleteUser(user.id)}
      className="text-red-600 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </div>
</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded"
              value={newUserData.email}
              onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border rounded"
              value={newUserData.password}
              onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={newUserData.name}
              onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full p-2 border rounded"
              value={newUserData.role}
              onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="security">Security</option>
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsAddUserModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add User</Button>
          </div>
        </form>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setNewPassword('');
          setError(null);
        }}
        title="Change Password"
      >
        <div className="space-y-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full p-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handlePasswordChange(selectedUser?.id, newPassword)}>
              Update Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
