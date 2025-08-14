import { formatCurrency, formatDate } from '../../utils/helper';
import { FaUser, FaEnvelope, FaCalendarAlt, FaPhone, FaMapMarkerAlt, FaDollarSign, FaChartLine, FaWallet, FaUtensils, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axioInstance';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'

const Setting = () => {
  const location = useLocation();
    const { user: contextUser } = useContext(UserContext);
    const [displayedUser, setDisplayedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null)
  const [userData, setUserData] = useState(null);
    
  const handleProfilePhotoSelect = (file) => {
    setProfilePhoto(file)
  }
  // Settings state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = useCallback(async () => {
    if (hasFetched) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch user info
      const userResponse = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      
      if (userResponse.data.success && userResponse.data.user) {
        const user = userResponse.data.user;
        setDisplayedUser(user);
        setUserData(user);
        setHasFetched(true);
        
        // Initialize edit form with user data
        setEditForm({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
        });
        
        // Fetch additional user data
        
      } else {
        throw new Error(userResponse.data.message || 'Invalid response format');
      }

    } catch (err) {
      console.error('❌ Error fetching user info:', err);
      setError(err.message || 'Failed to fetch user info');
    } finally {
      setLoading(false);
    }
  }, [hasFetched]);

    useEffect(() => {
        if (!hasFetched && !displayedUser) {
            fetchUserData();
        }
    }, [fetchUserData, hasFetched, displayedUser]);

    useEffect(() => {
        if (!hasFetched && contextUser && !displayedUser) {
            setDisplayedUser(contextUser);
            setHasFetched(true);
            setLoading(false);
        }
    }, [contextUser, hasFetched, displayedUser]);

    const user = displayedUser || contextUser;

  // Handle form input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  // Update user profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        fullname: 'editForm.firstName',
        profileImageUrl: profilePhoto,
      });

      if (response.data.success) {
        setUserData(response.data.user);
        setDisplayedUser(response.data.user);
        setUpdateSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Update context if needed
        if (contextUser && contextUser._id === response.data.user._id) {
          // You might want to update the UserContext here
        }
      }
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setUpdateError('New passwords do not match');
      setUpdateLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setUpdateError('Password must be at least 6 characters');
      setUpdateLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD, {
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword, // pass user id explicitly here
          });

      if (response.data.success) {
        setUpdateSuccess('Password changed successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsChangingPassword(false);
      }
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
    });
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <DashboardLayout activeMenu="profile">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {userData?.profileImageUrl ? (
                  <img
                    src={userData.profileImageUrl}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-white object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                    <FaUser className="h-12 w-12 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white">
                  {userData?.firstName} {userData?.lastName}
                </h1>
                <p className="text-blue-100">{userData?.email}</p>
                <p className="text-blue-100 text-sm mt-1">
                  Member since {formatDate(userData?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* User Information Section */}
          <div className="px-6 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              {!isEditing && !isChangingPassword && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {updateError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{updateError}</p>
              </div>
            )}

            {updateSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600">{updateSuccess}</p>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <ProfilePhotoSelector
                    onImageSelect={handleProfilePhotoSelect}
                    label="Profile Photo (Optional)"
                    optional={true}
                  />
                </div>
    
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updateLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={updateLoading}
                    className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaEnvelope className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{userData?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                      <p className="text-gray-900">{formatDate(userData?.dateOfBirth) || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{userData?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-gray-900">{userData?.address || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p className="text-gray-900">{formatDate(userData?.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Password Change Section */}
          <div className="px-6 py-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Security</h2>
              {!isChangingPassword && !isEditing && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Change Password
                </button>
              )}
            </div>

            {isChangingPassword && (
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFormChange}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {updateLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    Change Password
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPasswordChange}
                    disabled={updateLoading}
                    className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Setting
