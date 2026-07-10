import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { actualizarOnboardingStatus } from '../services/auth.service';

interface AuthUser {
  email: string;
  role: string;
  rol: string;
  must_change_password: boolean;
  biometric_registered?: boolean;
  vehicle_registered?: boolean;
  /** ID de Persona en Registry — viene embebido en el JWT (claim `personaId`), no en el body del login. */
  personaId?: string;
}

/**
 * Decodifica el payload de un JWT sin verificar la firma (solo lectura de
 * claims en el cliente — la verificación real ocurre en el backend).
 */
const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  authNotice: string | null;
  login: (user: AuthUser, authToken?: string) => void;
  logout: () => void;
  completePasswordChange: () => void;
  completeBiometricOnboarding: () => Promise<void>;
  completeVehicleOnboarding: () => Promise<void>;
  clearSessionExpired: () => void;
  setAuthNotice: (message: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'vigia_auth_user';
const AUTH_TOKEN_KEY = 'vigia_access_token';

const normalizeUser = (userData: Partial<AuthUser>): AuthUser => ({
  email: userData.email || '',
  role: userData.role || userData.rol || 'OWNER',
  rol: userData.rol || userData.role || 'OWNER',
  must_change_password: Boolean(userData.must_change_password),
  biometric_registered: userData.biometric_registered,
  vehicle_registered: userData.vehicle_registered,
  personaId: userData.personaId,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

    if (storedUser && storedToken) {
      try {
        setUser(normalizeUser(JSON.parse(storedUser)));
        setToken(storedToken);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData: AuthUser, authToken?: string) => {
    const claims = authToken ? decodeJwtPayload(authToken) : null;
    const personaId = typeof claims?.personaId === 'string' ? claims.personaId : undefined;
    const normalizedUser = normalizeUser({ ...userData, personaId });
    setUser(normalizedUser);
    setToken(authToken || null);
    setSessionExpired(false);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedUser));
    if (authToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  const completePasswordChange = () => {
    if (user) {
      const updated = { ...user, must_change_password: false };
      setUser(updated);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const completeBiometricOnboarding = async () => {
    if (!user) return;

    const updated = { ...user, biometric_registered: true };
    setUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));

    try {
      await actualizarOnboardingStatus({ biometric_registered: true });
    } catch (err) {
      console.error('Failed to persist biometric status:', err);
    }
  };

  const completeVehicleOnboarding = async () => {
    if (!user) return;

    const updated = { ...user, vehicle_registered: true };
    setUser(updated);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));

    try {
      await actualizarOnboardingStatus({ vehicle_registered: true });
    } catch (err) {
      console.error('Failed to persist vehicle status:', err);
    }
  };

  const clearSessionExpired = () => {
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        sessionExpired,
        authNotice,
        login,
        logout,
        completePasswordChange,
        completeBiometricOnboarding,
        completeVehicleOnboarding,
        clearSessionExpired,
        setAuthNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
