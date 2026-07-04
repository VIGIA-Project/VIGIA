import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  email: string;
  rol: string;
  must_change_password: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  completePasswordChange: () => void;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Verificar sesión al montar
  useEffect(() => {
    const stored = sessionStorage.getItem('vigia_auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem('vigia_auth_user');
      }
    }
    // Simular verificación de token (en producción sería una llamada al backend)
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    setSessionExpired(false);
    sessionStorage.setItem('vigia_auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('vigia_auth_user');
  };

  const completePasswordChange = () => {
    if (user) {
      const updated = { ...user, must_change_password: false };
      setUser(updated);
      sessionStorage.setItem('vigia_auth_user', JSON.stringify(updated));
    }
  };

  const clearSessionExpired = () => {
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        sessionExpired,
        login,
        logout,
        completePasswordChange,
        clearSessionExpired,
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
