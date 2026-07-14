import React, { useState } from 'react';
import {
    IconButton,
    Badge,
    Popover,
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { useAlertasNoAtendidasCount, useNotificaciones, useMarcarNotificacionLeida } from '../../hooks/useNotifications';

const tiempoRelativo = (iso?: string) => {
    if (!iso) return '';
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutos = Math.round(diffMs / 60000);
    if (minutos < 1) return 'ahora';
    if (minutos < 60) return `hace ${minutos} min`;
    const horas = Math.round(minutos / 60);
    if (horas < 24) return `hace ${horas} h`;
    return `hace ${Math.round(horas / 24)} d`;
};

interface NotificationBellProps {
    /** Ruta de alertas del rol actual — cada rol tiene su propio módulo de alertas */
    alertasPath?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ alertasPath = '/propietario/alertas' }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const alertasCount = useAlertasNoAtendidasCount();
    const notificaciones = useNotificaciones();
    const marcarLeida = useMarcarNotificacionLeida();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const goToAlertas = () => {
        handleClose();
        navigate(alertasPath);
    };

    const handleNotificacionClick = (id: string, leida: boolean) => {
        if (!leida) marcarLeida.mutate(id);
        goToAlertas();
    };

    const open = Boolean(anchorEl);
    const count = alertasCount.data ?? 0;

    return (
        <>
            <IconButton onClick={handleClick} aria-label="notificaciones">
                <Badge
                    badgeContent={count}
                    sx={{
                        '& .MuiBadge-badge': {
                            backgroundColor: count > 0 ? '#F2B51F' : undefined,
                            color: '#0A2F86',
                            fontWeight: 700,
                        },
                    }}
                >
                    <NotificationsOutlinedIcon />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '12px',
                            mt: 1,
                            background: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 24px rgba(10,47,134,0.12), 0 4px 8px rgba(10,47,134,0.06)',
                            border: '1px solid rgba(10,47,134,0.06)',
                        },
                    },
                }}
            >
                <Box sx={{ width: 360, maxWidth: '100vw', maxHeight: 420, overflowY: 'auto' }}>
                    <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}>
                            Notificaciones
                        </Typography>
                        <Typography
                            onClick={goToAlertas}
                            sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#0D5CCF', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                            Ver todas →
                        </Typography>
                    </Box>
                    <Divider />
                    {notificaciones.isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                            <CircularProgress size={22} />
                        </Box>
                    ) : notificaciones.isError ? (
                        <Typography sx={{ px: 2, py: 3, fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#6B7280', textAlign: 'center' }}>
                            No se pudieron cargar las notificaciones.
                        </Typography>
                    ) : (notificaciones.data ?? []).length === 0 ? (
                        <Typography sx={{ px: 2, py: 3, fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#6B7280', textAlign: 'center' }}>
                            No tienes notificaciones.
                        </Typography>
                    ) : (
                        <List disablePadding>
                            {(notificaciones.data ?? []).map((n) => (
                                <ListItem key={n.notificacionId} divider disablePadding>
                                    <ListItemButton onClick={() => handleNotificacionClick(n.notificacionId, n.leida)} sx={{ alignItems: 'flex-start', py: 1.25 }}>
                                        <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                            <CircleIcon sx={{ fontSize: 12, color: n.leida ? '#D1D5DB' : '#0D5CCF' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={n.titulo}
                                            secondary={`${n.contenidoResumen}${n.enviadaEn ? ` · ${tiempoRelativo(n.enviadaEn)}` : ''}`}
                                            primaryTypographyProps={{ sx: { fontFamily: '"Inter", sans-serif', fontWeight: n.leida ? 500 : 700, fontSize: '0.85rem', color: '#0F172A' } }}
                                            secondaryTypographyProps={{ sx: { fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#6B7280' } }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    )}
                    <Box
                        onClick={goToAlertas}
                        sx={{
                            px: 2,
                            py: 1.25,
                            textAlign: 'center',
                            cursor: 'pointer',
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            color: '#0D5CCF',
                            '&:hover': { backgroundColor: 'rgba(13,92,207,0.04)' },
                        }}
                    >
                        Ver todas las alertas →
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default NotificationBell;
