import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AUTH_ROUTES, getDashboardByRole } from '../../config/auth.config';
import { FullPageLoader } from '../atoms';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  // Si ya está autenticado, redirigir
  if (isAuthenticated && user) {
    if (user.must_change_password) {
      return <Navigate to={AUTH_ROUTES.changePassword} replace />;
    }
    return <Navigate to={getDashboardByRole(user.rol)} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
