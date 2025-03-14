import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if not logged in
  }
  return children; // Allow access to the protected route
};

export default ProtectedRoute;