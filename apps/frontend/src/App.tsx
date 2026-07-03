import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vigiaTheme } from './theme/vigia-theme';

// Autenticación (placeholder)
import { LoginPage } from './pages/Login';

// Dashboard Propietario
import { InicioPage } from './pages/propietario/Inicio';
import { MisVehiculosPage } from './pages/propietario/MisVehiculos';
import { PermisosTemporalesPage } from './pages/propietario/PermisosTemporales';
import { PasesRapidosPage } from './pages/propietario/PasesRapidos';
import { AlertasPage } from './pages/propietario/Alertas';

// Dashboard Guardia (placeholders — EP02)
import { GuardiaInicioPage } from './pages/guardia/Inicio';

// Dashboard Admin (placeholders — EP02)
import { AdminInicioPage } from './pages/admin/Inicio';

const queryClient = new QueryClient();

export const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={vigiaTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Redirección raíz → login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Autenticación */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard Propietario */}
          <Route path="/propietario/inicio" element={<InicioPage />} />
          <Route path="/propietario/vehiculos" element={<MisVehiculosPage />} />
          <Route path="/propietario/permisos-temporales" element={<PermisosTemporalesPage />} />
          <Route path="/propietario/pases-rapidos" element={<PasesRapidosPage />} />
          <Route path="/propietario/alertas" element={<AlertasPage />} />

          {/* Dashboard Guardia — placeholder EP02 */}
          <Route path="/guardia/inicio" element={<GuardiaInicioPage />} />
          <Route path="/guardia/*" element={<Navigate to="/guardia/inicio" replace />} />

          {/* Dashboard Admin — placeholder EP02 */}
          <Route path="/admin/inicio" element={<AdminInicioPage />} />
          <Route path="/admin/*" element={<Navigate to="/admin/inicio" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;