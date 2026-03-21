import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { adminAuthService } from '../services/adminAuthService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { student } = useStudent();
  const isAdmin = adminAuthService.isAuthenticated();
  const location = useLocation();

  // If admin is required, only allow admins
  if (requireAdmin) {
    if (!isAdmin) {
      // If a student is logged in, they can't go to admin, so redirect to their dashboard
      if (student) {
        return <Navigate to="/dashboard" replace />;
      }
      // Otherwise redirect to admin login
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  // For student routes, allow both students and admins
  if (!student && !isAdmin) {
    // If neither is logged in, redirect to home (student login)
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
