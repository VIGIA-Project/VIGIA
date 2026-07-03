import React from 'react';
import { Typography } from '@mui/material';

export interface RolBadgeProps {
    rol: string;
}

export const RolBadge: React.FC<RolBadgeProps> = ({ rol }) => {
    return (
        <Typography
            sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#19D6C4',
                mt: -0.5,
                pl: 0.5,
            }}
        >
            {rol}
        </Typography>
    );
};

export default RolBadge;
