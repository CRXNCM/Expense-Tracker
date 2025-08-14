import React, { useContext, useEffect, useState, useCallback } from 'react';
import { UserContext } from '../context/UserContext';
import axiosInstance from '../utils/axioInstance';
import { API_PATHS } from '../utils/apiPaths';

const UserInfoTest = () => {
  const { user: contextUser } = useContext(UserContext);
  const [displayedUser, setDisplayedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailedError, setDetailedError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (hasFetched) return; // Prevent refetching
    
    try {
      setLoading(true);
      setError(null);
      setDetailedError(null);

      console.log('🔍 Starting user info fetch...');
      
      const token = localStorage.getItem('token');
      console.log('🔑 Token found:', token ? 'Yes' : 'No');

      const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
      
      if (response.data.success && response.data.user) {
        setDisplayedUser(response.data.user);
        setHasFetched(true);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Invalid response format');
      }

    } catch (err) {
      console.error('❌ Error fetching user info:', err);
      
      let errorDetails = {
        message: err.message || 'Unknown error occurred',
        type: err.name || 'Error',
      };

      if (err.response) {
        errorDetails.status = err.response.status;
        errorDetails.data = err.response.data;
      } else if (err.request) {
        errorDetails.type = 'Network Error';
      }

      setError(err.message || 'Failed to fetch user info');
      setDetailedError(errorDetails);
    } finally {
      setLoading(false);
    }
  }, [hasFetched]);

  useEffect(() => {
    // Only fetch if we haven't already and no user is displayed
    if (!hasFetched && !displayedUser) {
      fetchUserData();
    }
  }, [fetchUserData, hasFetched, displayedUser]);

  // If context has user but we haven't fetched yet, use context user
  useEffect(() => {
    if (!hasFetched && contextUser && !displayedUser) {
      setDisplayedUser(contextUser);
      setHasFetched(true);
      setLoading(false);
    }
  }, [contextUser, hasFetched, displayedUser]);

  const handleRetry = () => {
    // Reset state to allow refetching
    setHasFetched(false);
    setDisplayedUser(null);
    fetchUserData();
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>🔍 Loading User Information...</h3>
        <p>Please wait while we fetch your profile data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>👤 Current User Information Test</h2>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          border: '1px solid #fcc', 
          borderRadius: '8px', 
          padding: '15px', 
          marginBottom: '20px' 
        }}>
          <h3 style={{ color: '#c33' }}>❌ Error Details:</h3>
          <p><strong>Error:</strong> {error}</p>
          
          {detailedError && (
            <div>
              <h4>🔍 Detailed Error Analysis:</h4>
              <pre style={{ 
                backgroundColor: '#f8f8f8', 
                padding: '10px', 
                borderRadius: '4px', 
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {JSON.stringify(detailedError, null, 2)}
              </pre>
            </div>
          )}
          
          <button 
            onClick={handleRetry}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            🔄 Retry Fetch
          </button>
        </div>
      )}

      {displayedUser ? (
        <div style={{ 
          backgroundColor: '#f0f8ff', 
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          padding: '20px' 
        }}>
          <h3 style={{ color: '#0066cc' }}>✅ User Found!</h3>
          <div style={{ marginTop: '15px' }}>
            <p><strong>Full Name:</strong> {displayedUser.fullname || 'Not provided'}</p>
            <p><strong>Email:</strong> {displayedUser.email || 'Not provided'}</p>
            <p><strong>Profile Image:</strong> {displayedUser.profileImageUrl || 'Not set'}</p>
            <p><strong>Verified:</strong> {displayedUser.isVerified ? 'Yes' : 'No'}</p>
            <p><strong>Last Login:</strong> {displayedUser.lastLogin ? new Date(displayedUser.lastLogin).toLocaleString() : 'Never'}</p>
            <p><strong>User ID:</strong> {displayedUser._id}</p>
          </div>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '8px', 
          padding: '20px' 
        }}>
          <h3 style={{ color: '#856404' }}>⚠️ No User Data</h3>
          <p>No user information is currently available. This could mean:</p>
          <ul>
            <li>You're not logged in</li>
            <li>The user session has expired</li>
            <li>There's an issue with the authentication</li>
          </ul>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <h4>🔧 Debug Information:</h4>
        <p><strong>Local Storage:</strong></p>
        <ul>
          <li>Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</li>
        </ul>
      </div>
    </div>
  );
};

export default UserInfoTest;
