import React from 'react';
import { Box, List, Divider } from '@mui/material';
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
            }}
        >
            <GradientBar height={4} gradientType="ia" />
            
            <Box sx={{ px: 3, py: 3 }}>
                <BrandBlock rol={rol} />
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

            <List sx={{ px: 1, flexGrow: 1 }}>
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
            
            {/* Footer could go here */}
        </Box>
    );
};

export default Sidebar;
