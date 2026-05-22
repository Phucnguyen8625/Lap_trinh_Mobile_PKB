import React, { createContext, useState, useContext } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/api/auth/login', { email, password });
      setUser(res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Không kết nối được server';
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/api/auth/register', { name, email, password });
      setUser(res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Không kết nối được server';
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return { success: false, message: 'Chưa đăng nhập' };
    try {
      await apiClient.post('/api/auth/change-password', {
        email: user.email,
        currentPassword,
        newPassword,
      });
      return { success: true, message: 'Đổi mật khẩu thành công' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Không kết nối được server';
      return { success: false, message: msg };
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
