import React from 'react';
import { Box } from '@mui/material';
import { VigiaLogo, VigiaWordmark, RolBadge } from '../atoms';

export interface BrandBlockProps {
    rol: string;
}

export const BrandBlock: React.FC<BrandBlockProps> = ({ rol }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <VigiaLogo size={44} />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <VigiaWordmark size="md" />
                <RolBadge rol={rol} />
            </Box>
        </Box>
    );
};

export default BrandBlock;
