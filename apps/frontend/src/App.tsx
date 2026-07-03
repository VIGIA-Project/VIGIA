import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vigiaTheme } from './theme/vigia-theme';
import { InicioPage } from './pages/propietario/Inicio';
import { MisVehiculosPage } from './pages/propietario/MisVehiculos';
import { PermisosTemporalesPage } from './pages/propietario/PermisosTemporales';
import { PasesRapidosPage } from './pages/propietario/PasesRapidos';
import { AlertasPage } from './pages/propietario/Alertas';

const queryClient = new QueryClient();

export const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={vigiaTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Redireccion por defecto */}
          <Route path="/" element={<Navigate to="/propietario/inicio" replace />} />

          {/* Dashboard Propietario */}
          <Route path="/propietario/inicio" element={<InicioPage />} />
          <Route path="/propietario/vehiculos" element={<MisVehiculosPage />} />
          <Route path="/propietario/permisos-temporales" element={<PermisosTemporalesPage />} />
          <Route path="/propietario/pases-rapidos" element={<PasesRapidosPage />} />
          <Route path="/propietario/alertas" element={<AlertasPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/propietario/inicio" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;