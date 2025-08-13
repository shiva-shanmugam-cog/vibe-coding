import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, Role } from './AuthProvider';
import React from 'react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode; allowRoles?: Role[] }> = ({ children, allowRoles }) => {
	const { isAuthenticated, roles, login } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		if (import.meta.env.VITE_OIDC_AUTHORITY) {
			login();
			return null;
		}
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	const allowed = allowRoles || ['ROLE_CUSTOMER'];
	if (allowed && !allowed.some(r => roles.includes(r))) {
		return <div className="p-4 text-red-600">Access denied</div>;
	}

	return <>{children}</>;
}; 