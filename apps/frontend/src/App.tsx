// src/App.tsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vigiaTheme } from './theme/vigia-theme';

// ─── Auth y Rutas ───────────────────────────────────────────────
import { AuthProvider } from './context';
import { ProtectedRoute } from './components/guards';

// ─── Páginas: Home & Login ────────────────────────────────────
import HomePage from './pages/Home';
import { LoginPage, CambiarPasswordPage } from './pages/auth';

// ─── Páginas: Propietario ───────────────────────────────────
import { InicioPage } from './pages/propietario/Inicio';
import { MisVehiculosPage } from './pages/propietario/MisVehiculos';
import { PermisosTemporalesPage } from './pages/propietario/PermisosTemporales';
import { PasesRapidosPage } from './pages/propietario/PasesRapidos';
import { AlertasPage } from './pages/propietario/Alertas';

// ─── Páginas: Guardia ───────────────────────────────────────
import { GuardiaInicioPage } from './pages/guardia/Inicio';
import { ColaEventosPage } from './pages/guardia/ColaEventos';
import { RevisionManualPage } from './pages/guardia/RevisionManual';
import { ContingenciaPage } from './pages/guardia/Contingencia';
import { AlertasGuardiaPage } from './pages/guardia/AlertasGuardia';

// ─── Páginas: Admin ─────────────────────────────────────────
import { AdminInicioPage } from './pages/admin/Inicio';
import { UsuariosPage } from './pages/admin/Usuarios';
import { ReportesPage } from './pages/admin/Reportes';
import { ConfiguracionPage } from './pages/admin/Configuracion';

const queryClient = new QueryClient();

export const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={vigiaTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ═══ Redirecciones y Públicas ═══ */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* ═══ Cambio de Contraseña Obligatorio ═══ */}
            <Route
              path="/cambiar-password"
              element={
                <ProtectedRoute requirePasswordChange={true}>
                  <CambiarPasswordPage />
                </ProtectedRoute>
              }
            />

            {/* ═══ Propietario ═══ */}
            <Route path="/propietario/inicio" element={<ProtectedRoute><InicioPage /></ProtectedRoute>} />
            <Route path="/propietario/vehiculos" element={<ProtectedRoute><MisVehiculosPage /></ProtectedRoute>} />
            <Route path="/propietario/permisos-temporales" element={<ProtectedRoute><PermisosTemporalesPage /></ProtectedRoute>} />
            <Route path="/propietario/pases-rapidos" element={<ProtectedRoute><PasesRapidosPage /></ProtectedRoute>} />
            <Route path="/propietario/alertas" element={<ProtectedRoute><AlertasPage /></ProtectedRoute>} />

            {/* ═══ Guardia ═══ */}
            <Route path="/guardia/inicio" element={<ProtectedRoute><GuardiaInicioPage /></ProtectedRoute>} />
            <Route path="/guardia/cola-eventos" element={<ProtectedRoute><ColaEventosPage /></ProtectedRoute>} />
            <Route path="/guardia/revision-manual" element={<ProtectedRoute><RevisionManualPage /></ProtectedRoute>} />
            <Route path="/guardia/contingencia" element={<ProtectedRoute><ContingenciaPage /></ProtectedRoute>} />
            <Route path="/guardia/alertas" element={<ProtectedRoute><AlertasGuardiaPage /></ProtectedRoute>} />

            {/* ═══ Admin ═══ */}
            <Route path="/admin/inicio" element={<ProtectedRoute><AdminInicioPage /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute><UsuariosPage /></ProtectedRoute>} />
            <Route path="/admin/reportes" element={<ProtectedRoute><ReportesPage /></ProtectedRoute>} />
            <Route path="/admin/configuracion" element={<ProtectedRoute><ConfiguracionPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;