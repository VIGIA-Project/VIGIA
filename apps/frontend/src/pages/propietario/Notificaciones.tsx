import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Chip,
    List,
    ListItem,
    IconButton,
    Divider,
} from '@mui/material';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Severidad } from '@vigia/shared-types';

type EstadoNotificacion = 'PENDIENTE' | 'LEIDA' | 'ARCHIVADA';

interface NotificacionViewDto {
    alerta_id: string;
    severidad: Severidad;
    mensaje_resumen: string;
    causa_origen: string;
    estado_atencion: EstadoNotificacion;
    hace: string;
}

const SEVERIDAD_COLOR: Record<Severidad, string> = {
    [Severidad.ALTA]: '#C62828',
    [Severidad.MEDIA]: '#EDB200',
    [Severidad.INFORMATIVA]: '#1565C0',
};

const MOCK_NOTIFICACIONES: NotificacionViewDto[] = [
    {
        alerta_id: 'al-101',
        severidad: Severidad.ALTA,
        mensaje_resumen: 'Acceso denegado reiterado — vehículo PBW-1234 en Acceso Norte',
        causa_origen: '3 intentos fallidos en 10 minutos',
        estado_atencion: 'PENDIENTE',
        hace: 'hace 2h',
    },
    {
        alerta_id: 'al-102',
        severidad: Severidad.ALTA,
        mensaje_resumen: 'Intento de acceso con placa no registrada asociada a su cuenta',
        causa_origen: 'Placa PZZ-9999 no existe en el sistema',
        estado_atencion: 'PENDIENTE',
        hace: 'hace 5h',
    },
    {
        alerta_id: 'al-103',
        severidad: Severidad.MEDIA,
        mensaje_resumen: 'Permiso Temporal próximo a expirar — vehículo PBB-3456',
        causa_origen: 'Vigencia finaliza en 4 horas',
        estado_atencion: 'PENDIENTE',
        hace: 'hace 8h',
    },
    {
        alerta_id: 'al-104',
        severidad: Severidad.MEDIA,
        mensaje_resumen: 'Pase de Acceso Rápido consumido correctamente',
        causa_origen: 'Acceso Sur — PBA-5678',
        estado_atencion: 'LEIDA',
        hace: 'hace 1d',
    },
    {
        alerta_id: 'al-105',
        severidad: Severidad.INFORMATIVA,
        mensaje_resumen: 'Validación biométrica exitosa registrada',
        causa_origen: 'Acceso Norte — PBW-1234',
        estado_atencion: 'LEIDA',
        hace: 'hace 2d',
    },
    {
        alerta_id: 'al-106',
        severidad: Severidad.INFORMATIVA,
        mensaje_resumen: 'Actualización de datos de vehículo registrada',
        causa_origen: 'Cambio de color — PBA-5678',
        estado_atencion: 'ARCHIVADA',
        hace: 'hace 3d',
    },
];

type FiltroSeveridad = 'TODAS' | Severidad;
type FiltroEstado = 'PENDIENTE' | 'LEIDA' | 'ARCHIVADA';

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

export const NotificacionesPage: React.FC = () => {
    const [notificaciones, setNotificaciones] = useState<NotificacionViewDto[]>(MOCK_NOTIFICACIONES);
    const [filtroSeveridad, setFiltroSeveridad] = useState<FiltroSeveridad>('TODAS');
    const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('PENDIENTE');

    const notificacionesFiltradas = useMemo(() => {
        return notificaciones.filter((n) => {
            const matchSeveridad = filtroSeveridad === 'TODAS' || n.severidad === filtroSeveridad;
            const matchEstado = n.estado_atencion === filtroEstado;
            return matchSeveridad && matchEstado;
        });
    }, [notificaciones, filtroSeveridad, filtroEstado]);

    const handleMarcarLeida = (alertaId: string) => {
        setNotificaciones((prev) =>
            prev.map((n) => (n.alerta_id === alertaId ? { ...n, estado_atencion: 'LEIDA' } : n))
        );
    };

    const handleArchivar = (alertaId: string) => {
        setNotificaciones((prev) =>
            prev.map((n) => (n.alerta_id === alertaId ? { ...n, estado_atencion: 'ARCHIVADA' } : n))
        );
    };

    return (
        <DashboardLayout pageTitle="Notificaciones">
            <Typography
                variant="h5"
                sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86', mb: 3 }}
            >
                Centro de Notificaciones
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {SEVERIDAD_FILTROS.map((f) => {
                        const isActive = filtroSeveridad === f.key;
                        const activeColor = f.key === 'TODAS' ? '#0D5CCF' : SEVERIDAD_COLOR[f.key as Severidad];
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
                            <ListItem
                                sx={{
                                    py: 1.5,
                                    px: 2,
                                    backgroundColor: n.estado_atencion === 'PENDIENTE' ? 'rgba(13,92,207,0.04)' : 'transparent',
                                    gap: 1.5,
                                }}
                            >
                                <CircleIcon sx={{ fontSize: 10, color: SEVERIDAD_COLOR[n.severidad], flexShrink: 0 }} />

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
                                            onClick={() => handleMarcarLeida(n.alerta_id)}
                                            aria-label="marcar leída"
                                            sx={{ color: '#0D5CCF' }}
                                        >
                                            <DoneOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {n.estado_atencion !== 'ARCHIVADA' && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleArchivar(n.alerta_id)}
                                            aria-label="archivar"
                                            sx={{ color: '#6B7280' }}
                                        >
                                            <ArchiveOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            </ListItem>
                            {idx < notificacionesFiltradas.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </DashboardLayout>
    );
};

export default NotificacionesPage;