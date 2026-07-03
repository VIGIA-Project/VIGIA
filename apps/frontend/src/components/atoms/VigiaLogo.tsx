import React from 'react';
import { Box } from '@mui/material';

export interface VigiaLogoProps {
    size?: number;
}

export const VigiaLogo: React.FC<VigiaLogoProps> = ({ size = 40 }) => {
    // Placeholder SVG representation for the isotype until the actual asset is integrated
    return (
        <Box
            sx={{
                width: size,
                height: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0D5CCF',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontFamily: '"Exo 2", sans-serif',
                fontSize: size * 0.5,
            }}
        >
            V
        </Box>
    );
};

export default VigiaLogo;
