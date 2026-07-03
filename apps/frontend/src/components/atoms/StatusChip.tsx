import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { estadoColors } from '../../theme/vigia-theme';

export type EstadoDominio =
    | 'SUCCESSFUL'
    | 'PENDING_VERIFY'
    | 'DENIED'
    | 'ACTIVA'
    | 'REVOCADO'
    | 'PROGRAMADO'
    | 'EXPIRADO'
    | 'CONTINGENCIA'
    | 'MANUAL'
    | 'INACTIVA'
    | 'AUTOMATICA'
    | 'ACTIVO'
    | 'CONSUMIDO';

const ESTADO_LABELS: Record<string, string> = {
    SUCCESSFUL: 'Aprobado',
    PENDING_VERIFY: 'Pendiente',
    DENIED: 'Denegado',
    ACTIVA: 'Activa',
    REVOCADO: 'Revocado',
    PROGRAMADO: 'Programado',
    EXPIRADO: 'Expirado',
    CONTINGENCIA: 'Contingencia',
    MANUAL: 'Manual',
    INACTIVA: 'Inactiva',
    AUTOMATICA: 'Automática',
    ACTIVO: 'Activo',
    CONSUMIDO: 'Consumido',
};

interface StatusChipProps {
    estado: EstadoDominio | string;
    size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({ estado, size = 'small' }) => {
    const colorConfig = estadoColors[estado as keyof typeof estadoColors] ?? {
        bg: '#6B7280',
        text: '#FFFFFF',
    };

    const label = ESTADO_LABELS[estado] ?? estado;

    const chipProps: ChipProps = {
        label,
        size,
        sx: {
            backgroundColor: colorConfig.bg,
            color: colorConfig.text,
            fontWeight: 600,
            borderRadius: '16px',
            letterSpacing: '0.02em',
        },
    };

    return <Chip {...chipProps} />;
};

export default StatusChip;