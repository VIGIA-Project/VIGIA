import React, { useEffect, useState } from 'react';
import { Box, Button, Snackbar, Alert, Typography, useMediaQuery, useTheme, Skeleton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { VehicleGrid, RegisterVehicleDrawer } from '../../components/organisms/propietario';
import { fadeInUp } from '../../config/animations.config';
import { vigiaShadows, vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';
import { useAuth } from '../../context';
import { useVehiculosDelPropietario } from '../../hooks/useRegistry';
import {
    PropietarioVehiculo,
    MIS_VEHICULOS_COPY,
    REGISTER_VEHICLE_DRAWER_COPY,
    HISTORIAL_ACCESOS_COPY,
} from '../../config/propietario-vehiculos.config';

const MisVehiculosPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const shouldReduceMotion = useReducedMotion();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // === CONSUMO DE ENDPOINT REAL MEDIANTE TANSTACK QUERY ===
    const vehiculosQuery = useVehiculosDelPropietario(user?.personaId);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    useEffect(() => {
        if ((location.state as { openRegistrar?: boolean } | null)?.openRegistrar) {
            setDrawerOpen(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    // Adaptación simétrica de contratos asegurando cumplir con la interfaz PropietarioVehiculo
    const vehiculosMapeados: PropietarioVehiculo[] = (vehiculosQuery.data ?? []).map((v) => ({
        id: v.vehiculoId,
        vehiculoId: v.vehiculoId,
        placa: v.placa,
        marca: v.marca ?? 'Sin marca',
        modelo: v.modelo ?? 'Sin modelo',
        color: v.color ?? 'N/D',
        anio: 0, // Cambiado de string a número para cumplir con el contrato de la interfaz
        estado: String(v.estadoRegistro) === 'APROBADO' ? 'ACTIVO' : 'INACTIVO',
        tipo: 'Particular',
        permisosActivos: 0,
        alertas: 0,
        image: '',
        personasAsignadas: 0,
        personasSinBiometria: 0,
    }));
    const activos = vehiculosMapeados.filter((v) => v.estado === 'ACTIVO').length;

    const handleViewDetail = (placa: string) => {
        navigate(`/propietario/vehiculos/${placa}`);
    };

    const handleCreatePermiso = () => {
        navigate('/propietario/permisos-temporales');
    };

    const handleRegistered = () => {
        vehiculosQuery.refetch();
        setDrawerOpen(false);
        setToastOpen(true);
    };

    return (
        <DashboardTemplate rol="OWNER" pageTitle="Mis Vehículos">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>
                {/* Header de sección */}
                <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: 1.5,
                        }}
                    >
                        <Box>
                            <Box
                                component="h1"
                                sx={{
                                    m: 0,
                                    fontFamily: '"Exo 2", sans-serif',
                                    fontWeight: 700,
                                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                                    color: '#0F172A',
                                }}
                            >
                                {MIS_VEHICULOS_COPY.title}
                            </Box>
                            <Box
                                sx={{
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: '0.8rem',
                                    color: '#64748B',
                                    mt: 0.5,
                                }}
                            >
                                {vehiculosQuery.isLoading ? (
                                    <Skeleton variant="text" width={180} height={20} />
                                ) : (
                                    `${activos} activos de ${vehiculosMapeados.length} registrados · Sincronizado`
                                )}
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setDrawerOpen(true)}
                            fullWidth={isMobile}
                            disabled={vehiculosQuery.isLoading}
                            sx={{
                                background: vigiaColors.gradientIA,
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                textTransform: 'none',
                                borderRadius: vigiaRadius.sm,
                                px: 3,
                                minHeight: 48,
                                boxShadow: vigiaShadows.sm,
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    boxShadow: vigiaShadows.md,
                                    transform: shouldReduceMotion ? 'none' : 'translateY(-1px)',
                                },
                            }}
                        >
                            {MIS_VEHICULOS_COPY.registerCta}
                        </Button>
                    </Box>
                </motion.div>

                {/* Manejo de Estados de Carga y Error de la API */}
                {vehiculosQuery.isLoading ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} variant="rounded" height={160} sx={{ borderRadius: vigiaRadius.md }} />
                        ))}
                    </Box>
                ) : vehiculosQuery.isError ? (
                    <Box sx={{ py: 4, textAlign: 'center', border: '1px dashed #C62828', borderRadius: vigiaRadius.md, bgcolor: '#FFF5F5' }}>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: '#C62828', mb: 1.5, fontWeight: 500 }}>
                            No pudimos recuperar tu listado de vehículos oficiales.
                        </Typography>
                        <Button variant="outlined" color="error" size="small" onClick={() => vehiculosQuery.refetch()}>
                            Reintentar Conexión
                        </Button>
                    </Box>
                ) : (
                    <VehicleGrid
                        vehiculos={vehiculosMapeados}
                        onViewDetail={handleViewDetail}
                        onCreatePermiso={handleCreatePermiso}
                        onRegisterClick={() => setDrawerOpen(true)}
                    />
                )}

                {/* Historial de accesos */}
                <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 2.5 }}>
                    <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A', mb: 1.5 }}>
                        {HISTORIAL_ACCESOS_COPY.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
                        <HistoryOutlinedIcon sx={{ color: vigiaColors.textTertiary, fontSize: 28 }} />
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: '#64748B' }}>
                            El historial de accesos vehiculares en tiempo real se habilitará con el módulo de Control de Accesos.
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <RegisterVehicleDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onRegistered={handleRegistered} />

            <Snackbar
                open={toastOpen}
                autoHideDuration={3500}
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="success" variant="filled" onClose={() => setToastOpen(false)} sx={{ borderRadius: vigiaRadius.sm }}>
                    {REGISTER_VEHICLE_DRAWER_COPY.successToast}
                </Alert>
            </Snackbar>
        </DashboardTemplate>
    );
};

export { MisVehiculosPage };
export default MisVehiculosPage;