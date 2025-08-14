import React, { useContext, useEffect, useState, useCallback} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axioInstance';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import { FiMenu, FiX, FiUser, FiSettings, FiLogOut, FiHome, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [displayedUser, setDisplayedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(UserContext);

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: FiHome },
    { name: "Expenses", href: "/expense", icon: FiDollarSign },
    { name: "Income", href: "/income", icon: FiTrendingUp },
  ];

  // Fetch user info if not already in context
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      if (response.data.success && response.data.user) {
        setUser(response.data.user); // update context
        setDisplayedUser(response.data.user);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    if (user) {
      setDisplayedUser(user);
      setLoading(false);
    } else {
      fetchUserData();
    }
  }, [user, fetchUserData]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName = displayedUser?.fullname || "User";
  const profileImage = displayedUser?.profileImageUrl || displayedUser?.profilePicture;
  const profileInitial = userName.charAt(0).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600/70 via-purple-600/70 to-pink-600/70 backdrop-blur-lg border-b border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent hover:from-gray-200 hover:to-white transition-all duration-300"
          >
            ExpenseTracker
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 text-white/90 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                
              </Link>
            ))}
          </div>

          {/* Profile & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Profile Menu */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 text-white/90 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <span className="text-sm font-medium">{userName}</span>
                
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={userName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/50 hover:border-white transition-all duration-300"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center border-2 border-white/50 hover:border-white transition-all duration-300">
                    <span className="text-white text-sm font-bold">{profileInitial}</span>
                  </div>
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl py-2 border border-gray-200/50">
                  <Link
                    to="/UserProfile"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/Settings"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100/50 transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <FiSettings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-2 border-gray-200/50" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50/50 transition-colors duration-200 w-full text-left"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white/90 hover:text-white transition-colors duration-300"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <hr className="border-white/20" />
              <Link
                to="/UserProfile"
                className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiUser className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiSettings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 text-red-300 hover:text-red-200 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-red-500/20"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;