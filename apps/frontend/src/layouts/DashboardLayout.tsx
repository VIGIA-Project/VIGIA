import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Avatar,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { NotificationBell } from '../components/NotificationBell';

const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Mis Vehículos', path: '/propietario/vehiculos', icon: <DirectionsCarIcon /> },
    { label: 'Permisos Temporales', path: '/propietario/permisos-temporales', icon: <AccessTimeIcon /> },
    { label: 'Pase Rápido', path: '/propietario/pases-rapidos', icon: <QrCode2Icon /> },
    { label: 'Notificaciones', path: '/propietario/notificaciones', icon: <NotificationsOutlinedIcon /> },
];

interface DashboardLayoutProps {
    pageTitle: string;
    children: React.ReactNode;
    userInitials?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    pageTitle,
    children,
    userInitials = 'US',
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleNavClick = (path: string) => {
        navigate(path);
        if (isMobile) setMobileOpen(false);
    };

    const sidebarContent = (
        <Box
            sx={{
                height: '100%',
                backgroundColor: '#0A2F86',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box sx={{ px: 3, py: 3 }}>
                <Typography
                    sx={{
                        fontFamily: '"Exo 2", sans-serif',
                        fontWeight: 700,
                        fontSize: '1.5rem',
                        color: '#FFFFFF',
                        textShadow: '0 0 12px rgba(25, 214, 196, 0.6)',
                        letterSpacing: '0.05em',
                    }}
                >
                    VIGIA
                </Typography>
            </Box>

            <List sx={{ px: 1 }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.path}
                            onClick={() => handleNavClick(item.path)}
                            sx={{
                                borderRadius: '4px',
                                mb: 0.5,
                                borderLeft: isActive ? '3px solid #19D6C4' : '3px solid transparent',
                                backgroundColor: isActive ? 'rgba(25,214,196,0.15)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(25,214,196,0.1)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: '#FFFFFF' }}>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: '0.9rem',
                                    fontWeight: isActive ? 600 : 400,
                                }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>
        </Box>
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
                <Box
                    component="nav"
                    sx={{
                        width: SIDEBAR_WIDTH,
                        flexShrink: 0,
                    }}
                >
                    <Box sx={{ width: SIDEBAR_WIDTH, position: 'fixed', height: '100vh' }}>
                        {sidebarContent}
                    </Box>
                </Box>
            )}

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        height: HEADER_HEIGHT,
                        backgroundColor: '#FFFFFF',
                        color: '#0A2F86',
                        boxShadow: '0 1px 4px rgba(10, 47, 134, 0.08)',
                    }}
                >
                    <Toolbar sx={{ height: HEADER_HEIGHT, minHeight: `${HEADER_HEIGHT}px !important` }}>
                        {isMobile && (
                            <IconButton
                                edge="start"
                                onClick={() => setMobileOpen(true)}
                                sx={{ mr: 2, color: '#0A2F86' }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}

                        <Typography
                            variant="h6"
                            sx={{
                                flexGrow: 1,
                                fontFamily: '"Exo 2", sans-serif',
                                fontWeight: 600,
                                fontSize: '1.1rem',
                                color: '#0A2F86',
                            }}
                        >
                            {pageTitle}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <NotificationBell count={2} />
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    backgroundColor: '#0D5CCF',
                                    color: '#FFFFFF',
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                }}
                            >
                                {userInitials}
                            </Avatar>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        backgroundColor: '#FAFBFC',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;