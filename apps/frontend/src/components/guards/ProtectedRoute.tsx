import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AUTH_ROUTES, getDashboardByRole } from '../../config/auth.config';
import { FullPageLoader } from '../atoms';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePasswordChange?: boolean;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requirePasswordChange = false,
  allowedRoles = [],
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={AUTH_ROUTES.login} replace />;
  }

  if (user.must_change_password && !requirePasswordChange) {
    return <Navigate to={AUTH_ROUTES.changePassword} replace />;
  }

  if (!user.must_change_password && requirePasswordChange) {
    return <Navigate to={getDashboardByRole(user.rol || user.role)} replace />;
  }

  const normalizedRole = (user.rol || user.role || '').toUpperCase();
  if (allowedRoles.length > 0 && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to={getDashboardByRole(normalizedRole)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
