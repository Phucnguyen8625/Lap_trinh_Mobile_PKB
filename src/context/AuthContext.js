import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    // Mock API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check for specific admin credentials
        if (email === 'admin@gmail.com' && password === 'admin123') {
          const adminUser = {
            id: 'admin-1',
            email: 'admin@gmail.com',
            name: 'TechCare Administrator',
            role: 'admin',
          };
          setUser(adminUser);
          setIsLoading(false);
          resolve(adminUser);
        } else {
          // Regular user logic (accept any other credentials for testing)
          const regularUser = {
            id: Date.now().toString(),
            email,
            name: 'Regular User',
            role: 'user',
          };
          setUser(regularUser);
          setIsLoading(false);
          resolve(regularUser);
        }
      }, 1500);
    });
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: Date.now().toString(),
          email,
          name,
          role: 'user', // Always register as user as per requirements
        };
        setUser(mockUser);
        setIsLoading(false);
        resolve(mockUser);
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
