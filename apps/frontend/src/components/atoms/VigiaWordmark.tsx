import React from 'react';
import { Typography } from '@mui/material';
import { vigiaTheme } from '../../theme/vigia-theme';

export interface VigiaWordmarkProps {
    size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
    sm: { fontSize: '1.2rem', letterSpacing: '0.05em' },
    md: { fontSize: '1.5rem', letterSpacing: '0.05em' },
    lg: { fontSize: '2rem', letterSpacing: '0.05em' },
};

export const VigiaWordmark: React.FC<VigiaWordmarkProps> = ({ size = 'md' }) => {
    return (
        <Typography
            component="span"
            sx={{
                fontFamily: '"Exo 2", sans-serif',
                fontWeight: 700,
                color: '#FFFFFF', // Assuming dark background by default, or could take a color prop
                ...sizeStyles[size],
            }}
        >
            VIGI
            <span style={{ color: vigiaTheme.palette.vigia?.doradoPremium || '#F2B51F' }}>
                A
            </span>
        </Typography>
    );
};

export default VigiaWordmark;
