import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Layout from '../Layout';

const AuthProtected = () => {
  const location = useLocation();
  const token = localStorage.getItem('token'); // Check if user is logged in
  const isPublicRoute = ['/login', '/register'].includes(location.pathname); // Define public routes

  // If user is logged in and trying to access a public route, redirect to /dashboard
  if (token && isPublicRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is not logged in and trying to access a protected route, redirect to /login
  if (!token && !isPublicRoute && location.pathname !== '/dashboard') {
    return <Navigate to="/login" replace />;
  }

  // Render the protected routes within the Layout
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default AuthProtected;