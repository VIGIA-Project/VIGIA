import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
    Grid,
    Divider,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import HomeIcon from '@mui/icons-material/Home';
import { DashboardTemplate } from '../../components/templates';

const NAV_ROUTES = [
    { label: 'Inicio', path: '/propietario/inicio', icon: <HomeIcon /> },
    { label: 'Mis Vehículos', path: '/propietario/vehiculos', icon: <DirectionsCarIcon /> },
    { label: 'Permisos Temporales', path: '/propietario/permisos-temporales', icon: <AccessTimeIcon /> },
    { label: 'Pase Rápido', path: '/propietario/pases-rapidos', icon: <QrCode2Icon /> },
    { label: 'Notificaciones', path: '/propietario/notificaciones', icon: <NotificationsOutlinedIcon /> },
];

export const PasesRapidosPage: React.FC = () => {
    const [codigoPase, setCodigoPase] = useState<string | null>(null);

    const handleGenerarPase = () => {
        // Mock generation
        const nuevoCodigo = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCodigoPase(`PASE-${nuevoCodigo}`);
    };

    const handleCopiar = () => {
        if (codigoPase) {
            navigator.clipboard.writeText(codigoPase);
            // Ideally show a toast here
        }
    };

    return (
        <DashboardTemplate
            rol="PROPIETARIO"
            pageTitle="Pase Rápido"
            routes={NAV_ROUTES}
            notificationCount={2}
            userInitials="US"
        >
            <Typography
                variant="h5"
                sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86', mb: 3 }}
            >
                Generador de Pases Rápidos
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: '12px', height: '100%' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Nuevo Pase
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6B7280', mb: 4 }}>
                                Genera un código alfanumérico de un solo uso para un visitante.
                                El pase expirará automáticamente en 24 horas.
                            </Typography>
                            
                            <TextField 
                                label="Nombre del Visitante (Opcional)" 
                                fullWidth 
                                sx={{ mb: 3 }}
                            />
                            
                            <Button 
                                variant="contained" 
                                color="primary" 
                                fullWidth 
                                size="large"
                                startIcon={<QrCode2Icon />}
                                onClick={handleGenerarPase}
                            >
                                Generar Pase Rápido
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    {codigoPase ? (
                        <Card sx={{ borderRadius: '12px', height: '100%', backgroundColor: '#0A2F86', color: '#FFFFFF' }}>
                            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="overline" sx={{ letterSpacing: '0.1em', opacity: 0.8, mb: 1 }}>
                                    CÓDIGO GENERADO
                                </Typography>
                                <Box sx={{ 
                                    backgroundColor: '#FFFFFF', 
                                    color: '#0A2F86', 
                                    py: 2, 
                                    px: 4, 
                                    borderRadius: '8px',
                                    mb: 3,
                                    width: '100%',
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="h3" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, letterSpacing: '0.15em' }}>
                                        {codigoPase}
                                    </Typography>
                                </Box>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<ContentCopyIcon />}
                                    sx={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#FFFFFF' } }}
                                    onClick={handleCopiar}
                                >
                                    Copiar Código
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card sx={{ borderRadius: '12px', height: '100%', border: '2px dashed #E0E3E8', backgroundColor: 'transparent', boxShadow: 'none' }}>
                            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 250 }}>
                                <QrCode2Icon sx={{ fontSize: 60, color: '#E0E3E8', mb: 2 }} />
                                <Typography variant="body1" sx={{ color: '#6B7280', textAlign: 'center' }}>
                                    El código generado aparecerá aquí
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </DashboardTemplate>
    );
};

export default PasesRapidosPage;
