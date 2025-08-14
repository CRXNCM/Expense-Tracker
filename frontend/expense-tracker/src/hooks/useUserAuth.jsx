import { API_PATHS } from "../utils/apiPaths";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useEffect } from "react";
import axiosInstance from "../utils/axioInstance";
import { useNavigate } from "react-router-dom";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          if (isMounted) {
            clearUser();
            navigate("/login");
          }
          return;
        }

        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        
        if (isMounted && response.data.success) {
          // Normalize user data structure for consistent access
          const userData = response.data.user || response.data;
          const normalizedUser = {
            id: userData._id || userData.id,
            username: userData.username || userData.fullName || userData.name,
            email: userData.email,
            profilePicture: userData.profilePicture || userData.profileImageUrl || userData.avatar,
            fullName: userData.fullName || userData.username || userData.name,
            profileImageUrl: userData.profileImageUrl || userData.profilePicture || userData.avatar,
            ...userData
          };
          
          updateUser(normalizedUser);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    // Always attempt to fetch user info if token exists
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    }

    return () => {
      isMounted = false;
    };
  }, [updateUser, clearUser, navigate]);
};
