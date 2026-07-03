// src/App.tsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vigiaTheme } from './theme/vigia-theme';
import { InicioPage } from './pages/propietario/Inicio';
import { MisVehiculosPage } from './pages/propietario/MisVehiculos';
import { PermisosTemporalesPage } from './pages/propietario/PermisosTemporales';
import { PasesRapidosPage } from './pages/propietario/PasesRapidos';
import { NotificacionesPage } from './pages/propietario/Notificaciones';

const queryClient = new QueryClient();

export const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={vigiaTheme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navigate to="/propietario/inicio" replace />} />
                        <Route path="/propietario/inicio" element={<InicioPage />} />
                        <Route path="/propietario/vehiculos" element={<MisVehiculosPage />} />
                        <Route path="/propietario/permisos-temporales" element={<PermisosTemporalesPage />} />
                        <Route path="/propietario/pases-rapidos" element={<PasesRapidosPage />} />
                        <Route path="/propietario/notificaciones" element={<NotificacionesPage />} />
                        <Route path="*" element={<Navigate to="/propietario/inicio" replace />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default App;