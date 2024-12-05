// src/components/users/UserDetailView.jsx
import { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';

const UserDetailView = ({ user, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePasswordChange = async () => {
    try {
      // Update password logic here
      // Note: This requires additional setup with Firebase Auth
      setError(null);
      // Implementation depends on your authentication setup
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.id), {
        name: userData.name,
        role: userData.role,
        department: userData.department,
        phoneNumber: userData.phoneNumber
      });
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              readOnly
              className="w-full p-2 border rounded bg-gray-50"
              value={userData.email}
            />
          </div>

          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  className="w-full p-2 border rounded"
                  value={userData.role}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                  <option value="Security Guard">Security Guard</option>
                </select>
              </div>

              {/* Add other editable fields */}
            </>
          ) : (
            <div className="space-y-2">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Role:</strong> {userData.role}</p>
              <p><strong>Department:</strong> {userData.department}</p>
              <p><strong>Phone:</strong> {userData.phoneNumber}</p>
              <p><strong>Status:</strong> {userData.status}</p>
            </div>
          )}

          {/* Password change section */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-2">Change Password</h3>
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handlePasswordChange}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Change Password
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Close
            </button>
            {isEditing ? (
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailView;
