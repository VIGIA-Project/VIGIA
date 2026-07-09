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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import CircleIcon from '@mui/icons-material/Circle';

type SeveridadNotificacion = 'ALTA' | 'MEDIA' | 'INFORMATIVA';

interface NotificacionMock {
    alerta_id: string;
    severidad: SeveridadNotificacion;
    titulo: string;
    subtitulo: string;
}

const SEVERIDAD_COLOR: Record<SeveridadNotificacion, string> = {
    ALTA: '#C62828',
    MEDIA: '#EDB200',
    INFORMATIVA: '#16A34A',
};

const MOCK_NOTIFICACIONES: NotificacionMock[] = [
    {
        alerta_id: 'al-001',
        severidad: 'ALTA',
        titulo: 'Acceso denegado · PBW-1234',
        subtitulo: 'Garita Sur · hace 2h',
    },
    {
        alerta_id: 'al-002',
        severidad: 'MEDIA',
        titulo: 'Permiso por expirar · PBB-3456',
        subtitulo: 'Expira en 4h',
    },
    {
        alerta_id: 'al-003',
        severidad: 'INFORMATIVA',
        titulo: 'Pase consumido · A7K3M2',
        subtitulo: 'Garita Norte · ayer',
    },
];

interface NotificationBellProps {
    count: number;
    /** Ruta de alertas del rol actual — cada rol tiene su propio módulo de alertas */
    alertasPath?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ count, alertasPath = '/propietario/alertas' }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

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

    const open = Boolean(anchorEl);

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
                    <List disablePadding>
                        {MOCK_NOTIFICACIONES.map((n) => (
                            <ListItem key={n.alerta_id} divider disablePadding>
                                <ListItemButton onClick={goToAlertas} sx={{ alignItems: 'flex-start', py: 1.25 }}>
                                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                        <CircleIcon sx={{ fontSize: 12, color: SEVERIDAD_COLOR[n.severidad] }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={n.titulo}
                                        secondary={n.subtitulo}
                                        primaryTypographyProps={{ sx: { fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' } }}
                                        secondaryTypographyProps={{ sx: { fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#6B7280' } }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
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
