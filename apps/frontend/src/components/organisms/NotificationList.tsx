import React, { useMemo, useState } from 'react';
import { Box, Chip, List, Divider, Typography } from '@mui/material';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { NotificationItem, NotificacionViewDto } from '../molecules';
import { Severidad } from '@vigia/shared-types';

export type FiltroSeveridad = 'TODAS' | Severidad;
export type FiltroEstado = 'PENDIENTE' | 'LEIDA' | 'ARCHIVADA';

export interface NotificationListProps {
    notificaciones: NotificacionViewDto[];
    onMarcarLeida: (alertaId: string) => void;
    onArchivar: (alertaId: string) => void;
}

const SEVERIDAD_FILTROS: { key: FiltroSeveridad; label: string }[] = [
    { key: 'TODAS', label: 'Todas' },
    { key: Severidad.ALTA, label: 'Alta' },
    { key: Severidad.MEDIA, label: 'Media' },
    { key: Severidad.INFORMATIVA, label: 'Informativa' },
];

const ESTADO_FILTROS: { key: FiltroEstado; label: string }[] = [
    { key: 'PENDIENTE', label: 'Pendientes' },
    { key: 'LEIDA', label: 'Leídas' },
    { key: 'ARCHIVADA', label: 'Archivadas' },
];

const SEVERIDAD_COLOR: Record<string, string> = {
    [Severidad.ALTA]: '#C62828',
    [Severidad.MEDIA]: '#EDB200',
    [Severidad.INFORMATIVA]: '#1565C0',
    TODAS: '#0D5CCF',
};

export const NotificationList: React.FC<NotificationListProps> = ({
    notificaciones,
    onMarcarLeida,
    onArchivar,
}) => {
    const [filtroSeveridad, setFiltroSeveridad] = useState<FiltroSeveridad>('TODAS');
    const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('PENDIENTE');

    const notificacionesFiltradas = useMemo(() => {
        return notificaciones.filter((n) => {
            const matchSeveridad = filtroSeveridad === 'TODAS' || n.severidad === filtroSeveridad;
            const matchEstado = n.estado_atencion === filtroEstado;
            return matchSeveridad && matchEstado;
        });
    }, [notificaciones, filtroSeveridad, filtroEstado]);

    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {SEVERIDAD_FILTROS.map((f) => {
                        const isActive = filtroSeveridad === f.key;
                        const activeColor = SEVERIDAD_COLOR[f.key];
                        return (
                            <Chip
                                key={f.key}
                                label={f.label}
                                onClick={() => setFiltroSeveridad(f.key)}
                                sx={{
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 600,
                                    backgroundColor: isActive ? activeColor : 'transparent',
                                    color: isActive ? '#FFFFFF' : '#6B7280',
                                    border: `1px solid ${isActive ? activeColor : '#E0E3E8'}`,
                                    '&:hover': {
                                        backgroundColor: isActive ? activeColor : 'rgba(13,92,207,0.06)',
                                    },
                                }}
                            />
                        );
                    })}
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {ESTADO_FILTROS.map((f) => {
                        const isActive = filtroEstado === f.key;
                        return (
                            <Chip
                                key={f.key}
                                label={f.label}
                                variant={isActive ? 'filled' : 'outlined'}
                                onClick={() => setFiltroEstado(f.key)}
                                sx={{
                                    fontFamily: '"Inter", sans-serif',
                                    fontWeight: 500,
                                    backgroundColor: isActive ? '#0A2F86' : 'transparent',
                                    color: isActive ? '#FFFFFF' : '#0A2F86',
                                    borderColor: '#0A2F86',
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            {notificacionesFiltradas.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 10,
                        gap: 2,
                    }}
                >
                    <NotificationsOffIcon sx={{ fontSize: 80, color: '#E0E3E8' }} />
                    <Typography
                        variant="h6"
                        sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}
                    >
                        No hay notificaciones
                    </Typography>
                </Box>
            ) : (
                <List sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px', p: 0 }}>
                    {notificacionesFiltradas.map((n, idx) => (
                        <React.Fragment key={n.alerta_id}>
                            <NotificationItem
                                notificacion={n}
                                onMarcarLeida={onMarcarLeida}
                                onArchivar={onArchivar}
                            />
                            {idx < notificacionesFiltradas.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default NotificationList;
