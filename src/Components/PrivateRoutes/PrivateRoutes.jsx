//import { Navigate, Outlet, useLocation } from "react-router-dom";

//const PrivateRoutes=()=>{
   // const { isAuthenticated } = useAuth();
  //  const location = useLocation();
   // return isAuthenticated?.user ? <Outlet/> 
   // : <Navigate to="/login" state={{from: location}} replace/>;

//};

//export default PrivateRoutes;

// src/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem("token");
  
    if(!token){
    
     navigate("/", { state: { from: location } });
     } 
  },[])
 
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />; // Redirect to login if not authenticated
  }

  return <Outlet />; // Render children routes
};

export default ProtectedRoute;
