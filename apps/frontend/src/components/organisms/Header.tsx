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
                    <NotificationBell count={notificationCount} />
                    <UserAvatar initials={userInitials} />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
