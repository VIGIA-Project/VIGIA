import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
    titulo?: string;
    descripcion?: string;
    icono?: React.ReactNode;
    accionLabel?: string;
    onAccion?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    titulo = 'Sin registros',
    descripcion = 'No hay datos disponibles para mostrar.',
    icono,
    accionLabel,
    onAccion,
}) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
        {icono ?? <InboxIcon sx={{ fontSize: 64, color: '#E0E3E8' }} />}
        <Typography
            variant="h6"
            sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}
        >
            {titulo}
        </Typography>
        <Typography
            variant="body2"
            sx={{ color: '#9CA3AF', textAlign: 'center', maxWidth: 400, fontFamily: '"Inter", sans-serif' }}
        >
            {descripcion}
        </Typography>
        {accionLabel && onAccion && (
            <Button variant="contained" color="primary" onClick={onAccion} sx={{ mt: 1 }}>
                {accionLabel}
            </Button>
        )}
    </Box>
);

export default EmptyState;
