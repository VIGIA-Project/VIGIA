import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorStateProps {
    mensaje?: string;
    onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    mensaje = 'Ocurrió un error al cargar los datos. Intente nuevamente.',
    onRetry,
}) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
        <ErrorOutlineIcon sx={{ fontSize: 64, color: '#C62828' }} />
        <Typography
            variant="body1"
            sx={{ color: '#6B7280', textAlign: 'center', maxWidth: 400, fontFamily: '"Inter", sans-serif' }}
        >
            {mensaje}
        </Typography>
        {onRetry && (
            <Button variant="outlined" color="primary" onClick={onRetry} sx={{ mt: 1 }}>
                Reintentar
            </Button>
        )}
    </Box>
);

export default ErrorState;
