import React from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { Severidad } from '@vigia/shared-types';

export interface SeverityDotProps {
    severidad: Severidad;
    size?: number;
}

const SEVERIDAD_COLOR: Record<Severidad, string> = {
    [Severidad.ALTA]: '#C62828',
    [Severidad.MEDIA]: '#EDB200',
    [Severidad.INFORMATIVA]: '#1565C0',
};

export const SeverityDot: React.FC<SeverityDotProps> = ({ severidad, size = 10 }) => {
    return (
        <CircleIcon 
            sx={{ 
                fontSize: size, 
                color: SEVERIDAD_COLOR[severidad], 
                flexShrink: 0 
            }} 
        />
    );
};

export default SeverityDot;
