import React from 'react';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

export interface NavItemProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick }) => {
    return (
        <ListItemButton
            onClick={onClick}
            sx={{
                borderRadius: '4px',
                mb: 0.5,
                borderLeft: isActive ? '3px solid #19D6C4' : '3px solid transparent',
                backgroundColor: isActive ? 'rgba(25,214,196,0.12)' : 'transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: 'rgba(25,214,196,0.08)',
                },
            }}
        >
            <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#19D6C4' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s ease' }}>
                {icon}
            </ListItemIcon>
            <ListItemText
                primary={label}
                primaryTypographyProps={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                    transition: 'all 0.2s ease',
                }}
            />
        </ListItemButton>
    );
};

export default NavItem;
