// src/components/templates/DashboardTemplate.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from '../organisms/Sidebar';
import { Header } from '../organisms/Header';
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
const ROLE_CONFIG: Record<string, { routes: NavRoute[]; config: { rol: string; userInitials: string; notificationCount: number } }> = {
  OWNER: { routes: OWNER_NAV_ROUTES, config: OWNER_CONFIG },
  GUARD: { routes: GUARD_NAV_ROUTES, config: GUARD_CONFIG },
  ADMIN: { routes: ADMIN_NAV_ROUTES, config: ADMIN_CONFIG },
};

export interface DashboardTemplateProps {
  rol: 'OWNER' | 'GUARD' | 'ADMIN';
  pageTitle: string;
  userInitials?: string;
  notificationCount?: number;
  children: React.ReactNode;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  rol,
  pageTitle,
  userInitials,
  notificationCount,
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-resolver rutas según rol
  const roleData = ROLE_CONFIG[rol] ?? ROLE_CONFIG.OWNER;
  const routes = roleData.routes;
  const defaults = roleData.config;

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
          notificationCount={notificationCount ?? defaults.notificationCount}
          userInitials={userInitials ?? defaults.userInitials}
          isMobile={isMobile}
          onMenuClick={() => setMobileOpen(true)}
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
