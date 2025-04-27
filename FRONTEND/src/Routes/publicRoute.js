import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem('token'); // Check if user is logged in

  // If user is logged in, redirect to /dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render public routes without Layout (or with a different layout if needed)
  return <Outlet />;
};

export default PublicRoute;