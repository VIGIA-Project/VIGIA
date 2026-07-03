import React, { useState } from 'react';
import {
    IconButton,
    Badge,
    Popover,
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import CircleIcon from '@mui/icons-material/Circle';

type SeveridadNotificacion = 'ALTA' | 'MEDIA' | 'INFORMATIVA';

interface NotificacionMock {
    alerta_id: string;
    severidad: SeveridadNotificacion;
    mensaje_resumen: string;
    hace: string;
}

const SEVERIDAD_COLOR: Record<SeveridadNotificacion, string> = {
    ALTA: '#C62828',
    MEDIA: '#EDB200',
    INFORMATIVA: '#1565C0',
};

const MOCK_NOTIFICACIONES: NotificacionMock[] = [
    {
        alerta_id: 'al-001',
        severidad: 'ALTA',
        mensaje_resumen: 'Acceso denegado reiterado en placa PBX-1234',
        hace: 'hace 2h',
    },
    {
        alerta_id: 'al-002',
        severidad: 'MEDIA',
        mensaje_resumen: 'Permiso Temporal próximo a expirar - vehículo ABC-5678',
        hace: 'hace 5h',
    },
    {
        alerta_id: 'al-003',
        severidad: 'INFORMATIVA',
        mensaje_resumen: 'Pase de Acceso Rápido consumido correctamente',
        hace: 'hace 1d',
    },
];

interface NotificationBellProps {
    count: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ count }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
            >
                <Box sx={{ width: 340, maxHeight: 400, overflowY: 'auto' }}>
                    <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600 }}>
                            Notificaciones
                        </Typography>
                    </Box>
                    <Divider />
                    <List disablePadding>
                        {MOCK_NOTIFICACIONES.map((n) => (
                            <ListItem key={n.alerta_id} divider sx={{ alignItems: 'flex-start' }}>
                                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                    <CircleIcon sx={{ fontSize: 12, color: SEVERIDAD_COLOR[n.severidad] }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={n.mensaje_resumen}
                                    secondary={n.hace}
                                    primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500 } }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Popover>
        </>
    );
};

export default NotificationBell;