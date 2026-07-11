import React from 'react';
import { Box, Typography } from '@mui/material';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';

interface PerfilIncompletoStateProps {
    mensaje?: string;
}

/**
 * Estado que se muestra cuando el usuario autenticado aún no tiene una
 * Persona vinculada en Registry (personaId ausente) — distinto de "no tiene
 * vehículos", ya que aquí no hay ninguna acción que el propio usuario pueda
 * tomar para resolverlo; requiere intervención del administrador.
 */
export const PerfilIncompletoState: React.FC<PerfilIncompletoStateProps> = ({
    mensaje = 'Tu perfil todavía no está completamente vinculado en el sistema. Contacta al administrador para resolverlo.',
}) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8, gap: 2 }}>
        <PersonSearchOutlinedIcon sx={{ fontSize: 64, color: '#F59E0B' }} />
        <Typography
            variant="body1"
            sx={{ color: '#6B7280', textAlign: 'center', maxWidth: 400, fontFamily: '"Inter", sans-serif' }}
        >
            {mensaje}
        </Typography>
    </Box>
);

export default PerfilIncompletoState;
