import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, Role } from './AuthProvider';
import React from 'react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode; allowRoles?: Role[] }> = ({ children, allowRoles }) => {
  const { isAuthenticated, roles, login, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isAuthenticated) {
    if (import.meta.env.VITE_OIDC_AUTHORITY) {
      login();
      return <div className="p-6">Redirecting to login…</div>;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowRoles && !allowRoles.some(r => roles.includes(r))) {
    return <div className="p-4 text-red-600">Access denied</div>;
  }

  return <>{children}</>;
}; 