import React from 'react';
import { Grid, Typography, Card, CardContent, Box, Button } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { DashboardTemplate } from '../../components/templates';
import { useNavigate } from 'react-router-dom';

const NAV_ROUTES = [
    { label: 'Inicio', path: '/propietario/inicio', icon: <NotificationsOutlinedIcon /> }, // Just a placeholder icon for now, usually Home
    { label: 'Mis Vehículos', path: '/propietario/vehiculos', icon: <DirectionsCarIcon /> },
    { label: 'Permisos Temporales', path: '/propietario/permisos-temporales', icon: <AccessTimeIcon /> },
    { label: 'Pase Rápido', path: '/propietario/pases-rapidos', icon: <QrCode2Icon /> },
    { label: 'Notificaciones', path: '/propietario/notificaciones', icon: <NotificationsOutlinedIcon /> },
];

export const InicioPage: React.FC = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Vehículos Registrados', value: 3, icon: <DirectionsCarIcon sx={{ fontSize: 40, color: '#0D5CCF' }} /> },
        { label: 'Permisos Activos', value: 1, icon: <AccessTimeIcon sx={{ fontSize: 40, color: '#19D6C4' }} /> },
        { label: 'Pases Disponibles', value: 5, icon: <QrCode2Icon sx={{ fontSize: 40, color: '#F2B51F' }} /> },
    ];

    return (
        <DashboardTemplate
            rol="PROPIETARIO"
            pageTitle="Inicio"
            routes={NAV_ROUTES}
            notificationCount={2}
            userInitials="US"
        >
            <Typography
                variant="h5"
                sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86', mb: 3 }}
            >
                Resumen General
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, idx) => (
                    <Grid item xs={12} sm={4} key={idx}>
                        <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 0.5, fontWeight: 500 }}>
                                        {stat.label}
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                                        {stat.value}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 1.5, backgroundColor: 'rgba(13,92,207,0.05)', borderRadius: '50%' }}>
                                    {stat.icon}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography
                variant="h6"
                sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86', mb: 2 }}
            >
                Accesos Rápidos
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/propietario/permisos-temporales')}
                        sx={{ height: 60, borderRadius: '8px', fontWeight: 600 }}
                    >
                        Nuevo Permiso
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<QrCode2Icon />}
                        onClick={() => navigate('/propietario/pases-rapidos')}
                        sx={{ height: 60, borderRadius: '8px', fontWeight: 600 }}
                    >
                        Generar Pase
                    </Button>
                </Grid>
            </Grid>
        </DashboardTemplate>
    );
};

// Required for the missing AddIcon above
import AddIcon from '@mui/icons-material/Add';

export default InicioPage;
