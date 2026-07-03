import React from 'react';
import { Box } from '@mui/material';
import { vigiaGradient } from '../../theme/vigia-theme';

export interface GradientBarProps {
    height?: number;
    gradientType?: 'ia' | 'ia45';
}

export const GradientBar: React.FC<GradientBarProps> = ({ 
    height = 4, 
    gradientType = 'ia' 
}) => {
    return (
        <Box
            sx={{
                width: '100%',
                height,
                background: vigiaGradient[gradientType],
            }}
        />
    );
};

export default GradientBar;
