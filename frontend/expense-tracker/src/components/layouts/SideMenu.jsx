import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import axiosInstance from '../../utils/axioInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { motion } from 'framer-motion';
import { 
  HomeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const SideMenu = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: contextUser, logout } = useContext(UserContext);
  const { theme } = useTheme();
  const [displayedUser, setDisplayedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  const user = displayedUser || contextUser;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Income', path: '/income', icon: CurrencyDollarIcon },
    { name: 'Expense', path: '/expense', icon: CreditCardIcon },
    { name: 'Meal Plan', path: '/mealplan', icon: ClipboardDocumentListIcon },
    { name: 'Daily Log', path: '/dailylog', icon: CalendarDaysIcon },
    { name: 'Note', path: '/note', icon: CalendarDaysIcon },
    { name: 'Fixed Ex', path: '/fixedex', icon: CurrencyDollarIcon },
    { name: 'Test Totals', path: '/test/endpoint-totals', icon: ChartBarIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  ];

  if (user?.role === 'superadmin') {
    menuItems.push({ name: 'Admin', path: '/admin', icon: ClipboardDocumentListIcon });
  }

  const fetchUserData = useCallback(async () => {
    if (hasFetched) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      
      if (response.data.success && response.data.user) {
        setDisplayedUser(response.data.user);
        setHasFetched(true);
      } else {
        throw new Error(response.data.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`shadow-lg h-screen sticky top-0 left-0 z-30 flex-shrink-0 border-r flex flex-col ${
        theme === 'dark'
          ? 'bg-gray-900 border-gray-700'
          : 'bg-gradient-to-b from-blue-50 to-white border-gray-200'
      }`}
    >
      {/* User Profile Section */}


      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-gray-800 text-gray-100 shadow-sm'
                      : 'bg-blue-100 text-blue-700 shadow-sm'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive
                      ? theme === 'dark' ? 'text-gray-100' : 'text-blue-600'
                      : theme === 'dark' ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {!isCollapsed && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className={`p-4 border-t ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className={`w-full flex items-center justify-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
            theme === 'dark'
              ? 'text-red-400 hover:bg-red-700 hover:text-red-300'
              : 'text-red-600 hover:bg-red-50 hover:text-red-700'
          }`}
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </motion.button>
      </div>

      {/* Collapse Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-3 top-1/2 transform -translate-y-1/2 shadow-lg rounded-full p-2 z-50 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {isCollapsed ? (
          <ChevronRightIcon className={`w-4 h-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`} />
        ) : (
          <ChevronLeftIcon className={`w-4 h-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`} />
        )}
      </motion.button>
    </motion.aside>
  );
};

export default SideMenu;
