import React, { createContext, useState } from "react";

// Create the context
export const UserContext = createContext(null);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /**
   * Update the user state with new data
   */
  const updateUser = (userData) => {
    setUser(userData);
  };

  /**
   * Clear the user state
   */
  const clearUser = () => {
    setUser(null);
  };

  /**
   * Logout helper — clears user and any stored auth data
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken"); // remove token if you store it
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        clearUser,
        logout, // ✅ now Navbar can use this
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
