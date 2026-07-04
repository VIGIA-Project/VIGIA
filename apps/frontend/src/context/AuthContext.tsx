import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthUser {
  email: string;
  rol: string;
  must_change_password: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  completePasswordChange: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Recuperar de sessionStorage para persistir durante la sesión
    const stored = sessionStorage.getItem('vigia_auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData: AuthUser) => {
    setUser(userData);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        completePasswordChange,
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
