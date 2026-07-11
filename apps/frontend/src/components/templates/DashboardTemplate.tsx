// src/components/templates/DashboardTemplate.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
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

  const sidebarContent = (
    <Sidebar
      rol={defaults.rol}
      currentPath={location.pathname}
      routes={routes}
      onNavigate={handleNavigate}
    />
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
    </Box>
  );
};

export default DashboardTemplate;
