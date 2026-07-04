// src/App.tsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vigiaTheme } from './theme/vigia-theme';

// ─── Páginas: Home & Login ────────────────────────────────────
import HomePage from './pages/Home';
import { LoginPage } from './pages/Login';

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
        <Routes>
          {/* ═══ Login ═══ */}
          <Route path="/login" element={<LoginPage />} />

          {/* ═══ Propietario ═══ */}
          <Route path="/propietario/inicio" element={<InicioPage />} />
          <Route path="/propietario/vehiculos" element={<MisVehiculosPage />} />
          <Route path="/propietario/permisos-temporales" element={<PermisosTemporalesPage />} />
          <Route path="/propietario/pases-rapidos" element={<PasesRapidosPage />} />
          <Route path="/propietario/alertas" element={<AlertasPage />} />

          {/* ═══ Guardia ═══ */}
          <Route path="/guardia/inicio" element={<GuardiaInicioPage />} />
          <Route path="/guardia/cola-eventos" element={<ColaEventosPage />} />
          <Route path="/guardia/revision-manual" element={<RevisionManualPage />} />
          <Route path="/guardia/contingencia" element={<ContingenciaPage />} />
          <Route path="/guardia/alertas" element={<AlertasGuardiaPage />} />

          {/* ═══ Admin ═══ */}
          <Route path="/admin/inicio" element={<AdminInicioPage />} />
          <Route path="/admin/usuarios" element={<UsuariosPage />} />
          <Route path="/admin/reportes" element={<ReportesPage />} />
          <Route path="/admin/configuracion" element={<ConfiguracionPage />} />

          {/* ═══ Redirecciones ═══ */}
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;