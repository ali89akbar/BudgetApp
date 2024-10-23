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
      setUser(userObject);
      if(typeof(userObject)==="object")
      {
        const userObj = Object.entries(userObject)
      
        const userMap = userObj.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
        console.log(userMap)
        setUser(userMap)
      }
      else{
      setUser(userObject)
      }
    }
  }, []);
  const updateUser = (updatedUser) => {
    setUser((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...updatedUser,
      },
    }));
  };

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
    <AuthContext.Provider value={{ user, login, logout,setUser,updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};