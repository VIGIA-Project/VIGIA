// src/components/templates/DashboardTemplate.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Drawer, useMediaQuery, useTheme, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';
import { Sidebar } from '../organisms/Sidebar';
import { Header } from '../organisms/Header';
import { useAuth } from '../../context';
import {
  OWNER_NAV_ROUTES,
  OWNER_CONFIG,
  GUARD_NAV_ROUTES,
  GUARD_CONFIG,
  ADMIN_NAV_ROUTES,
  ADMIN_CONFIG,
  NavRoute,
} from '../../config/navigation.config';

const SIDEBAR_WIDTH = 260;
const guardBackground = '/fondo-guardia.jpg';

// Mapeo de rol → configuración de navegación
const ROLE_CONFIG: Record<string, { routes: NavRoute[]; config: { rol: string; userInitials: string } }> = {
  OWNER: { routes: OWNER_NAV_ROUTES, config: OWNER_CONFIG },
  GUARD: { routes: GUARD_NAV_ROUTES, config: GUARD_CONFIG },
  ADMIN: { routes: ADMIN_NAV_ROUTES, config: ADMIN_CONFIG },
};

export interface DashboardTemplateProps {
  rol: 'OWNER' | 'GUARD' | 'ADMIN';
  pageTitle: string;
  userInitials?: string;
  children: React.ReactNode;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  rol,
  pageTitle,
  userInitials,
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  // Auto-resolver rutas según rol
  const roleData = ROLE_CONFIG[rol] ?? ROLE_CONFIG.OWNER;
  const routes = roleData.routes;
  const defaults = roleData.config;

  const dynamicInitials = user?.email ? user.email.slice(0, 2).toUpperCase() : undefined;

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  // SSE Notifications for Guards
  const [guardAlert, setGuardAlert] = React.useState<{ open: boolean; message: string; severity: 'error' | 'warning' | 'info' | 'success' }>({
    open: false,
    message: '',
    severity: 'error'
  });

  React.useEffect(() => {
    if (rol !== 'GUARD') return;

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
    const eventSource = new EventSource(`${API_URL}/alerting/stream`);

    eventSource.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        // Si el backend envía {"data": { ... }} extraemos el payload real
        const payload = (rawData.data && typeof rawData.data === 'object') ? rawData.data : rawData;
        
        const severidadStr = String(payload.severidad || '').toUpperCase();
        const causa = String(payload.causaOrigen || '').toUpperCase();
        const mensaje = String(payload.mensajeResumen || '').toLowerCase();
        
        const isError = severidadStr === 'ALTA' || causa === 'ACCESO_DENEGADO' || mensaje.includes('denegado') || mensaje.includes('no autorizado');
        const isWarning = severidadStr === 'MEDIA' || causa.includes('EXCEDIO') || mensaje.includes('contingencia');
        
        const sev = isError ? 'error' : isWarning ? 'warning' : 'info';
        
        setGuardAlert({
          open: true,
          message: payload.mensajeResumen || 'Nueva alerta de seguridad',
          severity: sev
        });
      } catch (e) {
        console.error("Error parsing SSE data", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      // EventSource intentará reconectar automáticamente
    };

    return () => {
      eventSource.close();
    };
  }, [rol]);

  const sidebarContent = (
    <Sidebar
      rol={defaults.rol}
      currentPath={location.pathname}
      routes={routes}
      onNavigate={handleNavigate}
    />
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {rol === 'GUARD' && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: { md: SIDEBAR_WIDTH },
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <Box
            component="img"
            src={guardBackground}
            alt=""
            aria-hidden
            sx={{
              width: { xs: 450, md: 720 },
              height: 'auto',
              opacity: 0.1,
              userSelect: 'none',
            }}
          />
        </Box>
      )}

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Box component="nav" sx={{ width: SIDEBAR_WIDTH, flexShrink: 0 }}>
          <Box sx={{ width: SIDEBAR_WIDTH, position: 'fixed', height: '100vh' }}>
            {sidebarContent}
          </Box>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header
          pageTitle={pageTitle}
          userInitials={userInitials ?? dynamicInitials ?? defaults.userInitials}
          isMobile={isMobile}
          onMenuClick={() => setMobileOpen(true)}
          rol={rol}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            backgroundColor: '#F8FAFC',
            minHeight: 'calc(100vh - 72px)',
          }}
        >
          {children}
        </Box>
      </Box>

      {rol === 'GUARD' && (
        <>
          {/* Alertas normales (INFO, WARNING, SUCCESS) */}
          <Snackbar
            open={guardAlert.open && guardAlert.severity !== 'error'}
            autoHideDuration={6000}
            onClose={() => setGuardAlert({ ...guardAlert, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={() => setGuardAlert({ ...guardAlert, open: false })}
              severity={guardAlert.severity}
              sx={{ width: '100%', fontSize: '1.1rem', py: 1.5, px: 2, boxShadow: 3 }}
              variant="filled"
            >
              {guardAlert.message}
            </Alert>
          </Snackbar>

          {/* Modal Rojo Gigante para Peligro / Denegado (ERROR) */}
          <Dialog
            open={guardAlert.open && guardAlert.severity === 'error'}
            onClose={() => setGuardAlert({ ...guardAlert, open: false })}
            PaperProps={{
              sx: {
                border: '5px solid #d32f2f',
                borderRadius: 4,
                p: 3,
                minWidth: { xs: 300, sm: 500 },
                textAlign: 'center',
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0.7)' },
                  '70%': { boxShadow: '0 0 0 20px rgba(211, 47, 47, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(211, 47, 47, 0)' }
                }
              }
            }}
          >
            <DialogTitle
              sx={{
                color: '#d32f2f',
                fontWeight: '900',
                fontSize: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2
              }}
            >
              <div style={{ fontSize: '4rem', lineHeight: 1 }}>🚫</div>
              ¡ALERTA DE SEGURIDAD!
            </DialogTitle>
            <DialogContent>
              <Typography variant="h5" sx={{ mt: 2, fontWeight: 600, color: 'text.primary' }}>
                {guardAlert.message}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', mt: 3, mb: 1 }}>
              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={() => setGuardAlert({ ...guardAlert, open: false })}
                sx={{ px: 6, py: 1.5, fontSize: '1.2rem', fontWeight: 'bold' }}
              >
                ENTENDIDO
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default DashboardTemplate;
