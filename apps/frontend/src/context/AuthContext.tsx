import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  email: string;
  role: string;
  rol: string;
  must_change_password: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  login: (user: AuthUser, token?: string) => void;
  logout: () => void;
  completePasswordChange: () => void;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'vigia_auth_user';
const AUTH_TOKEN_KEY = 'vigia_access_token';

const normalizeUser = (userData: Partial<AuthUser>): AuthUser => ({
  email: userData.email || '',
  role: userData.role || userData.rol || 'PROPIETARIO',
  rol: userData.rol || userData.role || 'PROPIETARIO',
  must_change_password: Boolean(userData.must_change_password),
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

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
    const normalizedUser = normalizeUser(userData);
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
