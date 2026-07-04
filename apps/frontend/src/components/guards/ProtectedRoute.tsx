import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AUTH_ROUTES, getDashboardByRole } from '../../config/auth.config';
import { FullPageLoader } from '../atoms';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePasswordChange?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requirePasswordChange = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mostrar loader mientras se verifica la sesión
  if (isLoading) {
    return <FullPageLoader />;
  }

  // No autenticado → login
  if (!isAuthenticated || !user) {
    return <Navigate to={AUTH_ROUTES.login} replace />;
  }

  // Requiere cambio de contraseña pero esta ruta NO es la de cambio → redirigir
  if (user.must_change_password && !requirePasswordChange) {
    return <Navigate to={AUTH_ROUTES.changePassword} replace />;
  }

  // Ya cambió contraseña pero intenta acceder a /cambiar-password → redirigir al dashboard
  if (!user.must_change_password && requirePasswordChange) {
    return <Navigate to={getDashboardByRole(user.rol)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
