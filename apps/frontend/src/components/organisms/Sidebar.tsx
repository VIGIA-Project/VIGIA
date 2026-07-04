// src/components/organisms/Sidebar.tsx
import React from 'react';
import { Box, List, Typography } from '@mui/material';
import { GradientBar } from '../atoms';
import { BrandBlock, NavItem } from '../molecules';

export interface NavRoute {
    label: string;
    path: string;
    icon: React.ReactNode;
}

export interface SidebarProps {
    rol: string;
    currentPath: string;
    routes: NavRoute[];
    onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ rol, currentPath, routes, onNavigate }) => {
    return (
        <Box
            sx={{
                height: '100%',
                backgroundColor: '#0A2F86',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            {/* Franja gradiente IA — 4px */}
            <GradientBar height={4} gradientType="ia" />

            {/* Logo + Wordmark + Rol */}
            <BrandBlock rol={rol} />

            {/* Separador sutil */}
            <Box
                sx={{
                    height: '1px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    mx: 2.5,
                    mb: 1.5,
                }}
            />

            {/* Navegación */}
            <List sx={{ px: 1.5, flexGrow: 1, py: 0 }}>
                {routes.map((route) => (
                    <NavItem
                        key={route.path}
                        label={route.label}
                        icon={route.icon}
                        isActive={currentPath === route.path}
                        onClick={() => onNavigate(route.path)}
                    />
                ))}
            </List>

            {/* Footer */}
            <Box
                sx={{
                    p: 2.5,
                    mt: 'auto',
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: 'rgba(255,255,255,0.3)',
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.65rem',
                        letterSpacing: '0.5px',
                    }}
                >
                    Universidad Central del Ecuador · 2026
                </Typography>
            </Box>
        </Box>
    );
};

export default Sidebar;
