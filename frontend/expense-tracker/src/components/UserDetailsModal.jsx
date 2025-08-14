import React, { useState } from 'react';
import { X } from 'lucide-react';

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  
  if (!isOpen || !user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const roleColors = {
    superadmin: 'bg-purple-600/20 text-purple-300 border border-purple-500/30',
    admin: 'bg-blue-600/20 text-blue-300 border border-blue-500/30',
    user: 'bg-green-600/20 text-green-300 border border-green-500/30'
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 backdrop-blur-md rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto border border-gray-700/50">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-100">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex items-center mb-4">
            <img
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
              src={user.profileImageUrl}
              alt={user.name}
              onClick={() => setIsImageEnlarged(true)}
            />
            <div className="ml-4">
              <h3 className="text-2xl font-semibold text-gray-100">{user.name}</h3>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${roleColors[user.role]}`}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Enlarged Image Modal */}
          {isImageEnlarged && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setIsImageEnlarged(false)}>
              <div className="relative max-w-2xl max-h-2xl">
                <img
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                  src={user.profileImageUrl}
                  alt={user.name}
                />
                <button
                  className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1 text-white hover:bg-gray-700"
                  onClick={() => setIsImageEnlarged(false)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic Information */}
            <div className="bg-gray-700/50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-200 mb-2">Basic Info</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <p className="text-gray-100">{user.name}</p>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <p className="text-gray-100">{user.email}</p>
                </div>
                <div>
                  <span className="text-gray-400">Phone:</span>
                  <p className="text-gray-100">{user.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-gray-700/50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-200 mb-2">Account</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-400">ID:</span>
                  <p className="text-gray-100 font-mono text-xs">{user._id.substring(0, 8)}...</p>
                </div>
                <div>
                  <span className="text-gray-400">Created:</span>
                  <p className="text-gray-100">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Updated:</span>
                  <p className="text-gray-100">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-gray-700/50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-200 mb-2">Status</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-400">Email Verified:</span>
                  <p className="text-gray-100">{user.isEmailVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <p className="text-gray-100">{user.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Logins:</span>
                  <p className="text-gray-100">{user.loginCount || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
