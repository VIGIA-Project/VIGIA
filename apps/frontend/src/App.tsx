// src/App.tsx
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vigiaTheme } from './theme/vigia-theme';
import { MisVehiculosPage } from './pages/propietario/MisVehiculos';
import { PermisosTemporalesPage } from './pages/propietario/PermisosTemporales';
import { NotificacionesPage } from './pages/propietario/Notificaciones';

const queryClient = new QueryClient();

const PaseRapidoPlaceholder: React.FC = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <Typography
            variant="h6"
            sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}
        >
            Pase Rápido — Próximamente
        </Typography>
    </Box>
);

export const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={vigiaTheme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Navigate to="/propietario/vehiculos" replace />} />
                        <Route path="/propietario/vehiculos" element={<MisVehiculosPage />} />
                        <Route path="/propietario/permisos-temporales" element={<PermisosTemporalesPage />} />
                        <Route path="/propietario/pases-rapidos" element={<PaseRapidoPlaceholder />} />
                        <Route path="/propietario/notificaciones" element={<NotificacionesPage />} />
                        <Route path="*" element={<Navigate to="/propietario/vehiculos" replace />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default App;