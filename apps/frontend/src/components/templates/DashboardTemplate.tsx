import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Sidebar, Header, NavRoute } from '../organisms';

const SIDEBAR_WIDTH = 240;

export interface DashboardTemplateProps {
    rol: string;
    pageTitle: string;
    userInitials?: string;
    notificationCount?: number;
    routes: NavRoute[];
    children: React.ReactNode;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
    rol,
    pageTitle,
    userInitials = 'US',
    notificationCount = 0,
    routes,
    children,
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleNavigate = (path: string) => {
        navigate(path);
        if (isMobile) setMobileOpen(false);
    };

    const sidebarContent = (
        <Sidebar
            rol={rol}
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
                <Header
                    pageTitle={pageTitle}
                    notificationCount={notificationCount}
                    userInitials={userInitials}
                    isMobile={isMobile}
                    onMenuClick={() => setMobileOpen(true)}
                />

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

export default DashboardTemplate;
