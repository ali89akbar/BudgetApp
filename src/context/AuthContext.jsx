// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const combine = {};
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userObject = jwtDecode(token);
      console.log("Context user: " + userObject.user?.name)
      setUser(userObject)
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const userObject = jwtDecode(token);
    setUser(userObject);

    
    navigate('/dashboard'); // Redirect to dashboard on login

  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/'); // Redirect to home on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};