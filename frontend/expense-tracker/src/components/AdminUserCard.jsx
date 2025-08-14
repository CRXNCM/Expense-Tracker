import React, { useState } from 'react';

const AdminUserCard = ({ user, onRoleUpdate, onDelete, onUserClick }) => {
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [newRole, setNewRole] = useState(user.role);

  const handleRoleChange = async () => {
    if (newRole !== user.role) {
      await onRoleUpdate(user._id, newRole);
      setIsEditingRole(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const roleColors = {
    superadmin: 'bg-purple-600/20 text-purple-300 border border-purple-500/30',
    admin: 'bg-blue-600/20 text-blue-300 border border-blue-500/30',
    user: 'bg-green-600/20 text-green-300 border border-green-500/30'
  };

  return (
    <tr className="hover:bg-gray-700/40 transition-colors">
      {/* User info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full object-cover border border-gray-700"
            src={user.profileImageUrl}
            alt={user.name}
          />
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-100">{user.name}</div>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-300">{user.email}</div>
      </td>

      {/* Role */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditingRole ? (
          <div className="flex items-center space-x-2">
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="bg-gray-800 text-gray-100 border border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleRoleChange}
              className="text-green-400 hover:text-green-300 transition"
            >
              ✓
            </button>
            <button
              onClick={() => {
                setIsEditingRole(false);
                setNewRole(user.role);
              }}
              className="text-red-400 hover:text-red-300 transition"
            >
              ✗
            </button>
          </div>
        ) : (
          <span
            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${roleColors[user.role]}`}
          >
            {user.role}
          </span>
        )}
      </td>

      {/* Created Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
        {formatDate(user.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUserClick(user);
            }}
            className="text-gray-400 hover:text-gray-300 transition"
          >
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingRole(!isEditingRole);
            }}
            className="text-indigo-400 hover:text-indigo-300 transition disabled:opacity-40"
            disabled={user.role === 'superadmin'}
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(user._id);
            }}
            className="text-red-400 hover:text-red-300 transition disabled:opacity-40"
            disabled={user.role === 'superadmin'}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminUserCard;
