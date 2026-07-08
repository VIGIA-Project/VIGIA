import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AUTH_ROUTES, getDashboardByRole } from '../../config/auth.config';
import { FullPageLoader } from '../atoms';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePasswordChange?: boolean;
  requireBiometricOnboarding?: boolean;
  requireVehicleOnboarding?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requirePasswordChange = false,
  requireBiometricOnboarding = false,
  requireVehicleOnboarding = false,
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

  // Onboarding biométrico obligatorio para PROPIETARIO — solo aplica una vez cambiada la contraseña,
  // de lo contrario entra en ciclo con el gate de must_change_password de arriba.
  if (!user.must_change_password) {
    const needsBiometricOnboarding = user.rol === 'PROPIETARIO' && !user.biometric_registered;

    if (needsBiometricOnboarding && !requireBiometricOnboarding) {
      return <Navigate to={AUTH_ROUTES.onboardingBiometria} replace />;
    }

    // Ya completó la biometría pero intenta reingresar al onboarding → redirigir al dashboard
    if (!needsBiometricOnboarding && requireBiometricOnboarding) {
      return <Navigate to={getDashboardByRole(user.rol)} replace />;
    }

    // Onboarding de vehículo obligatorio para PROPIETARIO — solo se evalúa una vez superada
    // la biometría, para no competir con el gate de arriba.
    if (!needsBiometricOnboarding) {
      const needsVehicleOnboarding = user.rol === 'PROPIETARIO' && !user.vehicle_registered;

      if (needsVehicleOnboarding && !requireVehicleOnboarding) {
        return <Navigate to={AUTH_ROUTES.onboardingVehiculo} replace />;
      }

      // Ya registró su vehículo pero intenta reingresar al onboarding → redirigir al dashboard
      if (!needsVehicleOnboarding && requireVehicleOnboarding) {
        return <Navigate to={getDashboardByRole(user.rol)} replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
