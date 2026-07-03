import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NotificationBell, UserAvatar } from '../molecules';

export interface HeaderProps {
    pageTitle: string;
    notificationCount: number;
    userInitials: string;
    isMobile: boolean;
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    pageTitle,
    notificationCount,
    userInitials,
    isMobile,
    onMenuClick,
}) => {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                height: 64,
                backgroundColor: '#FFFFFF',
                color: '#0A2F86',
                boxShadow: '0 1px 4px rgba(10, 47, 134, 0.08)',
            }}
        >
            <Toolbar sx={{ height: 64, minHeight: '64px !important' }}>
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
                    <NotificationBell count={notificationCount} />
                    <UserAvatar initials={userInitials} />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
