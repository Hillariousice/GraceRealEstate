import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Optional: For role-based access control
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    // You might want to return a loading spinner here
    return <div>Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User is authenticated but does not have the required role
    // Redirect to an unauthorized page or home page
    // For now, redirecting to home, but a dedicated "Unauthorized" page would be better.
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Render the child route component
};

export default ProtectedRoute;
