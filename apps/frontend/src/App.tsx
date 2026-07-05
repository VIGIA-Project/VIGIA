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
import { SkipToContent, SessionExpiredAlert, PageTransition } from './components/atoms';

// ─── Páginas: Home & Login ────────────────────────────────────────────────
import HomePage from './pages/Home';
import { LoginPage, CambiarPasswordPage } from './pages/auth';

// ─── Páginas: Propietario ─────────────────────────────────────────────────
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
  const { sessionExpired, clearSessionExpired } = useAuth();

  return (
    <>
      <SkipToContent />
      <SessionExpiredAlert open={sessionExpired} onClose={clearSessionExpired} />
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

            {/* ═══ Propietario ═══ */}
            <Route path="/propietario/inicio" element={<ProtectedRoute allowedRoles={['OWNER']}><PageTransition><InicioPage /></PageTransition></ProtectedRoute>} />
            <Route path="/propietario/vehiculos" element={<ProtectedRoute allowedRoles={['OWNER']}><PageTransition><MisVehiculosPage /></PageTransition></ProtectedRoute>} />
            <Route path="/propietario/permisos-temporales" element={<ProtectedRoute allowedRoles={['OWNER']}><PageTransition><PermisosTemporalesPage /></PageTransition></ProtectedRoute>} />
            <Route path="/propietario/pases-rapidos" element={<ProtectedRoute allowedRoles={['OWNER']}><PageTransition><PasesRapidosPage /></PageTransition></ProtectedRoute>} />
            <Route path="/propietario/alertas" element={<ProtectedRoute allowedRoles={['OWNER']}><PageTransition><AlertasPage /></PageTransition></ProtectedRoute>} />

            {/* ═══ Guardia ═══ */}
            <Route path="/guardia/inicio" element={<ProtectedRoute allowedRoles={['GUARD']}><PageTransition><GuardiaInicioPage /></PageTransition></ProtectedRoute>} />
            <Route path="/guardia/cola-eventos" element={<ProtectedRoute allowedRoles={['GUARD']}><PageTransition><ColaEventosPage /></PageTransition></ProtectedRoute>} />
            <Route path="/guardia/revision-manual" element={<ProtectedRoute allowedRoles={['GUARD']}><PageTransition><RevisionManualPage /></PageTransition></ProtectedRoute>} />
            <Route path="/guardia/contingencia" element={<ProtectedRoute allowedRoles={['GUARD']}><PageTransition><ContingenciaPage /></PageTransition></ProtectedRoute>} />
            <Route path="/guardia/alertas" element={<ProtectedRoute allowedRoles={['GUARD']}><PageTransition><AlertasGuardiaPage /></PageTransition></ProtectedRoute>} />

            {/* ═══ Admin ═══ */}
            <Route path="/admin/inicio" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><AdminInicioPage /></PageTransition></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><UsuariosPage /></PageTransition></ProtectedRoute>} />
            <Route path="/admin/reportes" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><ReportesPage /></PageTransition></ProtectedRoute>} />
            <Route path="/admin/configuracion" element={<ProtectedRoute allowedRoles={['ADMIN']}><PageTransition><ConfiguracionPage /></PageTransition></ProtectedRoute>} />

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