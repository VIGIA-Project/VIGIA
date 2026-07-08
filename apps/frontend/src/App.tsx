// src/App.tsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { vigiaTheme } from './theme/vigia-theme';

// ─── Auth, Guards y Átomos ─────────────────────────────────────────────────
import { AuthProvider, useAuth } from './context';
import { ProtectedRoute, PublicRoute } from './components/guards';
import { SkipToContent, SessionExpiredAlert, AuthNoticeAlert, PageTransition } from './components/atoms';

// ─── Páginas: Home & Login ────────────────────────────────────────────────
import HomePage from './pages/Home';
import { LoginPage, CambiarPasswordPage } from './pages/auth';

// ─── Páginas: Propietario ─────────────────────────────────────────────────
import BiometricOnboardingPage from './pages/propietario/onboarding/BiometricOnboardingPage';
import { InicioPage } from './pages/propietario/Inicio';
import { MisVehiculosPage } from './pages/propietario/MisVehiculos';
import { PermisosTemporalesPage } from './pages/propietario/PermisosTemporales';
import { PasesRapidosPage } from './pages/propietario/PasesRapidos';
import { AlertasPage } from './pages/propietario/Alertas';

// ─── Páginas: Guardia ─────────────────────────────────────────────────────
import { GuardiaInicioPage } from './pages/guardia/Inicio';
import { ColaEventosPage } from './pages/guardia/ColaEventos';
import { RevisionManualPage } from './pages/guardia/RevisionManual';
import { ContingenciaPage } from './pages/guardia/Contingencia';
import { AlertasGuardiaPage } from './pages/guardia/AlertasGuardia';

// ─── Páginas: Admin ───────────────────────────────────────────────────────
import { AdminInicioPage } from './pages/admin/Inicio';
import { UsuariosPage } from './pages/admin/Usuarios';
import { ReportesPage } from './pages/admin/Reportes';
import { ConfiguracionPage } from './pages/admin/Configuracion';

const queryClient = new QueryClient();

// ─────────────────────────────────────────────────────────────────────────
// Componente interno: accede a useAuth (dentro del AuthProvider) y useLocation
// ─────────────────────────────────────────────────────────────────────────
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const { sessionExpired, clearSessionExpired, authNotice, setAuthNotice } = useAuth();

  return (
    <>
      <SkipToContent />
      <SessionExpiredAlert open={sessionExpired} onClose={clearSessionExpired} />
      <AuthNoticeAlert message={authNotice} onClose={() => setAuthNotice(null)} />
      <div id="main-content" role="main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* ═══ Rutas Públicas ═══ */}
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <PageTransition>
                    <LoginPage />
                  </PageTransition>
                </PublicRoute>
              }
            />

            {/* ═══ Cambio de Contraseña Obligatorio ═══ */}
            <Route
              path="/cambiar-password"
              element={
                <ProtectedRoute requirePasswordChange={true}>
                  <PageTransition>
                    <CambiarPasswordPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            {/* ═══ Propietario: Onboarding obligatorio ═══ */}
            <Route
              path="/propietario/onboarding/biometria"
              element={
                <ProtectedRoute requireBiometricOnboarding={true}>
                  <PageTransition>
                    <BiometricOnboardingPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            {/* ═══ Propietario ═══ */}
            <Route path="/propietario/inicio" element={<ProtectedRoute><PageTransition><InicioPage /></PageTransition></ProtectedRoute>} />
            <Route path="/propietario/vehiculos" element={<ProtectedRoute><PageTransition><MisVehiculosPage /></PageTransition></ProtectedRoute>} />
            <Route path="/propietario/permisos-temporales" element={<ProtectedRoute><PageTransition><PermisosTemporalesPage /></PageTransition></ProtectedRoute>} />
            <Route path="/propietario/pases-rapidos" element={<ProtectedRoute><PageTransition><PasesRapidosPage /></PageTransition></ProtectedRoute>} />
            <Route path="/propietario/alertas" element={<ProtectedRoute><PageTransition><AlertasPage /></PageTransition></ProtectedRoute>} />

            {/* ═══ Guardia ═══ */}
            <Route path="/guardia/inicio" element={<ProtectedRoute><PageTransition><GuardiaInicioPage /></PageTransition></ProtectedRoute>} />
            <Route path="/guardia/cola-eventos" element={<ProtectedRoute><PageTransition><ColaEventosPage /></PageTransition></ProtectedRoute>} />
            <Route path="/guardia/revision-manual" element={<ProtectedRoute><PageTransition><RevisionManualPage /></PageTransition></ProtectedRoute>} />
            <Route path="/guardia/contingencia" element={<ProtectedRoute><PageTransition><ContingenciaPage /></PageTransition></ProtectedRoute>} />
            <Route path="/guardia/alertas" element={<ProtectedRoute><PageTransition><AlertasGuardiaPage /></PageTransition></ProtectedRoute>} />

            {/* ═══ Admin ═══ */}
            <Route path="/admin/inicio" element={<ProtectedRoute><PageTransition><AdminInicioPage /></PageTransition></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute><PageTransition><UsuariosPage /></PageTransition></ProtectedRoute>} />
            <Route path="/admin/reportes" element={<ProtectedRoute><PageTransition><ReportesPage /></PageTransition></ProtectedRoute>} />
            <Route path="/admin/configuracion" element={<ProtectedRoute><PageTransition><ConfiguracionPage /></PageTransition></ProtectedRoute>} />

            {/* ═══ Fallback ═══ */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// Raíz de la aplicación
// ─────────────────────────────────────────────────────────────────────────
export const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={vigiaTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;