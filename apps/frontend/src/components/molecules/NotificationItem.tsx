import React from 'react';
import { ListItem, Box, Typography, IconButton } from '@mui/material';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import { SeverityDot } from '../atoms';
import { Severidad } from '@vigia/shared-types';

export type EstadoNotificacion = 'PENDIENTE' | 'LEIDA' | 'ARCHIVADA';

export interface NotificacionViewDto {
    alerta_id: string;
    severidad: Severidad;
    mensaje_resumen: string;
    causa_origen: string;
    estado_atencion: EstadoNotificacion;
    hace: string;
}

export interface NotificationItemProps {
    notificacion: NotificacionViewDto;
    onMarcarLeida?: (alertaId: string) => void;
    onArchivar?: (alertaId: string) => void;
    showDivider?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notificacion: n,
    onMarcarLeida,
    onArchivar,
}) => {
    return (
        <ListItem
            sx={{
                py: 1.5,
                px: 2,
                backgroundColor: n.estado_atencion === 'PENDIENTE' ? 'rgba(13,92,207,0.04)' : 'transparent',
                gap: 1.5,
            }}
        >
            <SeverityDot severidad={n.severidad} />

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                    variant="body1"
                    sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: n.estado_atencion === 'PENDIENTE' ? 500 : 400,
                        color: '#111827',
                    }}
                >
                    {n.mensaje_resumen}
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280' }}>
                    {n.causa_origen}
                </Typography>
            </Box>

            <Typography
                variant="caption"
                sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280', whiteSpace: 'nowrap' }}
            >
                {n.hace}
            </Typography>

            <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                {n.estado_atencion === 'PENDIENTE' && (
                    <IconButton
                        size="small"
                        onClick={() => onMarcarLeida?.(n.alerta_id)}
                        aria-label="marcar leída"
                        sx={{ color: '#0D5CCF' }}
                    >
                        <DoneOutlinedIcon fontSize="small" />
                    </IconButton>
                )}
                {n.estado_atencion !== 'ARCHIVADA' && (
                    <IconButton
                        size="small"
                        onClick={() => onArchivar?.(n.alerta_id)}
                        aria-label="archivar"
                        sx={{ color: '#6B7280' }}
                    >
                        <ArchiveOutlinedIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
        </ListItem>
    );
};

export default NotificationItem;
