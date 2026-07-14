import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import GroupIcon from '@mui/icons-material/Group';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Logout from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HistoryIcon from '@mui/icons-material/History';
import KeyIcon from '@mui/icons-material/Key';
import MenuIcon from '@mui/icons-material/Menu';
import { BrandBlock, NotificationBell } from '../molecules';
import { GradientBar } from '../atoms';
import { useAlertasCountAdmin } from '../../hooks/useAdmin';

const drawerWidth = 260;
const uceLogo = '/logo_uce.png';

interface NavSection {
  label: string;
  items: {
    label: string;
    path: string;
    icon: React.ReactNode;
    badge?: number;
  }[];
}

const topLevelItem = { label: 'Inicio', icon: <DashboardIcon />, path: '/admin' };

// Removed static navSections here

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuth();

  const alertasCount = useAlertasCountAdmin();
  const alertBadgeCount = alertasCount.data ?? 0;

  const navSections: NavSection[] = [
    {
      label: 'REGISTRY',
      items: [
        { label: 'Personas', path: '/admin/registry/personas', icon: <GroupIcon /> },
        { label: 'Vehículos', path: '/admin/registry/vehiculos', icon: <DirectionsCarIcon /> },
        { label: 'Cuentas de Usuario', path: '/admin/usuarios', icon: <AccountCircle /> },
      ]
    },
    {
      label: 'AUTHORIZATION',
      items: [
        { label: 'Autorizaciones', path: '/admin/authorization/permanentes', icon: <VerifiedUserIcon /> },
        { label: 'Permisos Temporales', path: '/admin/authorization/temporales', icon: <KeyIcon /> },
        { label: 'Vista por Vehículo', path: '/admin/authorization/por-vehiculo', icon: <SecurityIcon /> },
      ]
    },
    {
      label: 'BIOMETRIC',
      items: [
        { label: 'Perfiles Biométricos', path: '/admin/biometric/perfiles', icon: <FaceRetouchingNaturalIcon /> },
      ]
    },
    {
      label: 'ALERTING',
      items: [
        { label: 'Alertas', path: '/admin/alerting/alertas', icon: <WarningAmberIcon />, badge: alertBadgeCount > 0 ? alertBadgeCount : undefined },
      ]
    },
    {
      label: 'AUDITORÍA',
      items: [
        { label: 'Historial de Eventos', path: '/admin/auditoria/eventos', icon: <HistoryIcon /> },
      ]
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const drawer = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: '#0f3194',
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.015) 49%, rgba(255,255,255,0.015) 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.015) 49%, rgba(255,255,255,0.015) 51%, transparent 51%)
      `,
      backgroundSize: '120px 120px',
    }}>
      <GradientBar height={4} gradientType="ia" />
      <BrandBlock rol="ADMINISTRADOR" />

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <Box sx={{ flex: 1, py: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 } }}>
        <Box
          onClick={() => navigate(topLevelItem.path)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.2,
            mx: 2,
            my: 1,
            borderRadius: 2,
            cursor: 'pointer',
            color: isActive(topLevelItem.path) ? '#fff' : 'rgba(255,255,255,0.7)',
            backgroundColor: isActive(topLevelItem.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
            border: isActive(topLevelItem.path) ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
            transition: 'all 0.15s',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{topLevelItem.icon}</Box>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{topLevelItem.label}</Typography>
        </Box>

        {navSections.map((section) => (
          <Box key={section.label} sx={{ mb: 1, mt: 2 }}>
            <Typography sx={{ px: 3, py: 0.5, fontSize: '0.65rem', fontWeight: 700, letterSpacing: 1.2, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
              {section.label}
            </Typography>
            {section.items.map((item) => (
              <Box
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  mx: 2,
                  my: 0.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,0.7)',
                  backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: isActive(item.path) ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                  transition: 'all 0.15s',
                  position: 'relative',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' },
                }}
              >
                <Box sx={{ minWidth: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isActive(item.path) ? 1 : 0.7 }}>{item.icon}</Box>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: isActive(item.path) ? 600 : 500, flex: 1 }}>{item.label}</Typography>
                {item.badge && (
                  <Box sx={{ bgcolor: '#C0524A', color: '#fff', borderRadius: 10, px: 0.8, fontSize: '0.7rem', fontWeight: 700, minWidth: 18, textAlign: 'center' }}>
                    {item.badge}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#19D6C4', fontSize: '0.85rem', fontWeight: 700, color: '#0A2F86' }}>
            AD
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem' }}>
              Administrador
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>
              admin@uce.edu.ec
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  let currentPageLabel = 'Inicio';
  if (topLevelItem.path === location.pathname) currentPageLabel = topLevelItem.label;
  navSections.forEach(section => {
    section.items.forEach(item => {
      if (item.path === location.pathname) currentPageLabel = item.label;
    });
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: { md: drawerWidth },
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
          src={uceLogo}
          alt=""
          aria-hidden
          sx={{
            width: { xs: 450, md: 720 },
            height: 'auto',
            opacity: 0.050,
            userSelect: 'none',
          }}
        />
      </Box>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1
        }}
      >
        <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <Toolbar sx={{ gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 1, display: { md: 'none' }, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1rem' }}>
                {currentPageLabel}
              </Typography>
              <Box
                sx={{
                  px: 1.2,
                  py: 0.3,
                  borderRadius: 1,
                  backgroundColor: 'rgba(13, 92, 207, 0.08)',
                  color: '#0f3194',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                ADMINISTRADOR
              </Box>
            </Box>
            <NotificationBell alertasPath="/admin/alerting/alertas" />
            <Tooltip title="Cuenta">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: '#0f3194', fontSize: '0.8rem', fontWeight: 700 }}>
                  AD
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
              <MenuItem onClick={() => setAnchorEl(null)}>
                <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}><AccountCircle fontSize="small" /></Box>
                Mi perfil
              </MenuItem>
              <MenuItem onClick={() => { setAnchorEl(null); logout(); }}>
                <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}><Logout fontSize="small" /></Box>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
