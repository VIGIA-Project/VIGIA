import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { NotificationBell, UserAvatar } from '../molecules';
import { useAuth } from '../../context';

export interface HeaderProps {
    pageTitle: string;
    notificationCount: number;
    userInitials: string;
    isMobile: boolean;
    onMenuClick: () => void;
    rol?: 'OWNER' | 'GUARD' | 'ADMIN';
}

export const Header: React.FC<HeaderProps> = ({
    pageTitle,
    notificationCount,
    userInitials,
    isMobile,
    onMenuClick,
    rol,
}) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const menuOpen = Boolean(anchorEl);

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleMiPerfil = () => {
        handleMenuClose();
        navigate('/propietario/perfil');
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/login');
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                height: 72,
                backgroundColor: '#FFFFFF',
                color: '#0A2F86',
                borderBottom: '1px solid rgba(10,47,134,0.06)',
            }}
        >
            <Toolbar sx={{ height: 72, minHeight: '72px !important' }}>
                {isMobile && (
                    <IconButton
                        edge="start"
                        onClick={onMenuClick}
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
                    <NotificationBell count={notificationCount} alertasPath={rol === 'GUARD' ? '/guardia/alertas' : '/propietario/alertas'} />
                    <UserAvatar
                        initials={userInitials}
                        onClick={handleAvatarClick}
                        sx={{ cursor: 'pointer' }}
                        aria-controls={menuOpen ? 'user-avatar-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? 'true' : undefined}
                    />
                    <Menu
                        id="user-avatar-menu"
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        slotProps={{ paper: { sx: { borderRadius: '12px', minWidth: 220, boxShadow: '0 8px 24px rgba(10,47,134,0.12), 0 4px 8px rgba(10,47,134,0.06)', mt: 1 } } }}
                    >
                        <Box sx={{ px: 2, py: 1.25 }}>
                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#0A2F86' }} noWrap>
                                {user?.email?.split('@')[0] || 'Usuario'}
                            </Typography>
                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#6B7280' }} noWrap>
                                {user?.email}
                            </Typography>
                        </Box>
                        <Divider />
                        {rol === 'OWNER' && (
                            <MenuItem onClick={handleMiPerfil} sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem' }}>
                                <ListItemIcon><PersonOutlineIcon fontSize="small" sx={{ color: '#0A2F86' }} /></ListItemIcon>
                                <ListItemText>Mi perfil</ListItemText>
                            </MenuItem>
                        )}
                        <MenuItem onClick={handleLogout} sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: '#DC2626' }}>
                            <ListItemIcon><LogoutOutlinedIcon fontSize="small" sx={{ color: '#DC2626' }} /></ListItemIcon>
                            <ListItemText>Cerrar sesión</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
