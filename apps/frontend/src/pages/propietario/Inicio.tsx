import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Skeleton, Button, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { SectionHeader } from '../../components/atoms';
import { KpiCard, ActivityTimelineItem, QuickActionButton, MiniVehicleItem, MiniFamilyCard } from '../../components/molecules';
import { staggerContainer, fadeInUp } from '../../config/animations.config';
import { vigiaShadows, vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';
import { mapAutorizacionAPersona } from '../../config/propietario-personas.config';

// Icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import InfoIcon from '@mui/icons-material/Info';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAuth } from '../../context';
import { useVehiculosDelPropietario, usePersonasDelPropietario as usePersonasResolver } from '../../hooks/useRegistry';
import { usePermisosVigentesPorVehiculo, useMisPases, useMiembrosGrupoFamiliar } from '../../hooks/useAuthorization';
import { useNotificaciones, useAlertasNoAtendidasCount } from '../../hooks/useNotifications';

/** Tiempo relativo en español — mismo criterio que NotificationBell (src/components/molecules/NotificationBell.tsx). */
const tiempoRelativo = (iso?: string): string => {
    if (!iso) return '';
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutos = Math.round(diffMs / 60000);
    if (minutos < 1) return 'ahora';
    if (minutos < 60) return `hace ${minutos} min`;
    const horas = Math.round(minutos / 60);
    if (horas < 24) return `hace ${horas} h`;
    return `hace ${Math.round(horas / 24)} d`;
};

const InicioPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();

    const displayName = user?.email?.split('@')[0] || 'Propietario';
    const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    // === CONSUMO DE ENDPOINTS REALES DE REGISTRY Y AUTHORIZATION ===
    const vehiculosQuery = useVehiculosDelPropietario(user?.personaId);
    const vehiculos = vehiculosQuery.data ?? [];
    const vehiculosCount = vehiculos.length;
    const vehiculo = vehiculos[0];

    const permisosQuery = usePermisosVigentesPorVehiculo(vehiculo?.vehiculoId);
    const pasesQuery = useMisPases();
    const autorizacionesQuery = useMiembrosGrupoFamiliar(user?.personaId);
    const notificacionesQuery = useNotificaciones();
    const alertasCountQuery = useAlertasNoAtendidasCount();

    const permisosActivos = (permisosQuery.data ?? []).filter((p) => p.estado === 'ACTIVA').length;
    const pasesActivos = (pasesQuery.data ?? []).filter((p) => p.estado === 'ACTIVO').length;
    const notificaciones = notificacionesQuery.data ?? [];
    const actividadReciente = notificaciones.slice(0, 4);
    const alertasPendientes = alertasCountQuery.data ?? 0;

    const autorizaciones = autorizacionesQuery.data ?? [];
    const personaIds = useMemo(() => autorizaciones.map((a) => a.personaId), [autorizaciones]);
    const { personasById, isLoading: isLoadingFamilia } = usePersonasResolver(personaIds);

    const familia = useMemo(
        () => autorizaciones.map((a) => mapAutorizacionAPersona(a, personasById.get(a.personaId))),
        [autorizaciones, personasById]
    );

    // Cómputo del KPI de Biometría basado de forma honesta en los datos de los miembros del grupo familiar
    const personasSinBiometria = useMemo(() => {
        if (autorizacionesQuery.isLoading || isLoadingFamilia) return 0;
        return familia.filter((f) => f.biometria !== 'COMPLETADA').length;
    }, [familia, autorizacionesQuery.isLoading, isLoadingFamilia]);

    const kpis = [
        {
            value: vehiculosCount,
            label: 'Vehículos',
            indicator: vehiculosCount > 0 ? '🟢 Todos activos' : 'Registra tu vehículo',
            indicatorColor: vehiculosCount > 0 ? '#2E7D32' : '#6B7280',
            accentColor: '#0D5CCF',
            route: '/propietario/vehiculos',
        },
        {
            value: permisosActivos,
            label: 'Permisos Activos',
            indicator: permisosActivos > 0 ? `⏰ ${permisosActivos} vigente${permisosActivos === 1 ? '' : 's'}` : 'Sin permisos activos',
            indicatorColor: permisosActivos > 0 ? '#EDB200' : '#6B7280',
            accentColor: '#19D6C4',
            route: '/propietario/permisos-temporales',
        },
        {
            value: pasesActivos,
            label: 'Pases Activos',
            indicator: pasesActivos > 0 ? `🟢 ${pasesActivos} disponible${pasesActivos === 1 ? '' : 's'}` : 'Genera un pase cuando lo necesites',
            indicatorColor: pasesActivos > 0 ? '#2E7D32' : '#6B7280',
            accentColor: '#F2B51F',
            route: '/propietario/pases-rapidos',
        },
        {
            value: alertasPendientes,
            label: 'Alertas Pendientes',
            indicator: alertasCountQuery.isError
                ? 'No se pudo cargar'
                : alertasPendientes > 0
                    ? `🔴 ${alertasPendientes} pendiente${alertasPendientes === 1 ? '' : 's'}`
                    : '🟢 No hay alertas activas',
            indicatorColor: alertasCountQuery.isError ? '#6B7280' : alertasPendientes > 0 ? '#C62828' : '#2E7D32',
            accentColor: '#C62828',
            route: '/propietario/alertas',
        },
        {
            value: personasSinBiometria,
            label: 'Biom. Pendiente',
            indicator: personasSinBiometria > 0 ? `🔶 ${personasSinBiometria} sin biometría` : '🟢 Todo al día',
            indicatorColor: personasSinBiometria > 0 ? '#F59E0B' : '#2E7D32',
            accentColor: '#F59E0B',
            route: '/propietario/personas',
        },
    ];

    return (
        <DashboardTemplate rol="OWNER" pageTitle="Inicio">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>
                {/* BLOQUE 1: Saludo contextual */}
                <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                    <Box>
                        <Typography
                            sx={{
                                fontFamily: '"Exo 2", sans-serif',
                                fontWeight: 600,
                                fontSize: isMobile ? '1.25rem' : '1.5rem',
                                color: vigiaColors.textHeading,
                            }}
                        >
                            Bienvenido, {capitalizedName}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: '"Inter", sans-serif',
                                fontSize: '0.8rem',
                                color: vigiaColors.textSecondary,
                                mt: 0.5,
                            }}
                        >
                            Panel unificado de control de accesos y registros de la UCE.
                        </Typography>
                    </Box>
                </motion.div>

                {/* BLOQUE 2: KPIs con contexto */}
                <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: 'repeat(5, 1fr)' },
                            gap: `${vigiaSpacing.cardGap}px`,
                        }}
                    >
                        {kpis.map((kpi) => (
                            <KpiCard
                                key={kpi.label}
                                value={kpi.value}
                                label={kpi.label}
                                indicator={kpi.indicator}
                                indicatorColor={kpi.indicatorColor}
                                accentColor={kpi.accentColor}
                                onClick={() => navigate(kpi.route)}
                            />
                        ))}
                    </Box>
                </motion.div>

                {/* BLOQUE 3: Actividad Reciente */}
                <Box>
                    <SectionHeader
                        title="Actividad Reciente"
                        action={
                            <Typography
                                onClick={() => navigate('/propietario/alertas')}
                                sx={{
                                    fontFamily: '"Inter", sans-serif',
                                    fontSize: '0.8rem',
                                    color: vigiaColors.primary,
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                Ver todo →
                            </Typography>
                        }
                    />
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {notificacionesQuery.isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} variant="rounded" height={48} sx={{ mb: 0.5, borderRadius: '6px' }} />
                                ))
                            ) : notificacionesQuery.isError ? (
                                <Box sx={{ py: 2, textAlign: 'center' }}>
                                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary, mb: 1 }}>
                                        No se pudo cargar la actividad reciente.
                                    </Typography>
                                    <Button size="small" onClick={() => notificacionesQuery.refetch()}>Reintentar</Button>
                                </Box>
                            ) : actividadReciente.length === 0 ? (
                                <ActivityTimelineItem
                                    icon={<InfoIcon sx={{ color: '#6B7280' }} />}
                                    title="Sin actividad reciente registrada"
                                    subtitle="Las notificaciones de tu cuenta aparecerán aquí."
                                    timestamp="Actualizado"
                                    severity="info"
                                />
                            ) : (
                                actividadReciente.map((n) => (
                                    <ActivityTimelineItem
                                        key={n.notificacionId}
                                        icon={
                                            n.leida
                                                ? <InfoIcon sx={{ color: vigiaColors.primary }} />
                                                : <WarningAmberIcon sx={{ color: '#EDB200' }} />
                                        }
                                        title={n.titulo}
                                        subtitle={n.contenidoResumen}
                                        timestamp={tiempoRelativo(n.enviadaEn)}
                                        severity={n.leida ? 'info' : 'warning'}
                                        onClick={() => navigate('/propietario/alertas')}
                                    />
                                ))
                            )}
                        </Box>
                    </motion.div>
                </Box>

                {/* BLOQUES 4 y 5: Vehículos + Grupo Familiar (side by side en desktop) */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: `${vigiaSpacing.cardGap}px`,
                    }}
                >
                    {/* BLOQUE 4: Mis Vehículos (mini) */}
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                        <Card sx={{ borderRadius: vigiaRadius.md, boxShadow: vigiaShadows.sm, height: '100%' }}>
                            <CardContent sx={{ p: 2 }}>
                                <SectionHeader
                                    title="Mis Vehículos"
                                    action={
                                        <Typography
                                            onClick={() => navigate('/propietario/vehiculos')}
                                            sx={{ fontSize: '0.75rem', color: vigiaColors.primary, cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            Ver todos →
                                        </Typography>
                                    }
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {vehiculosQuery.isLoading ? (
                                        Array.from({ length: 2 }).map((_, i) => (
                                            <Skeleton key={i} variant="rounded" height={44} sx={{ mb: 1, borderRadius: '6px' }} />
                                        ))
                                    ) : vehiculosQuery.isError ? (
                                        <Box sx={{ py: 2, textAlign: 'center' }}>
                                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary, mb: 1 }}>
                                                No se pudieron cargar tus vehículos.
                                            </Typography>
                                            <Button size="small" onClick={() => vehiculosQuery.refetch()}>Reintentar</Button>
                                        </Box>
                                    ) : vehiculos.length === 0 ? (
                                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary, py: 2, textAlign: 'center' }}>
                                            Aún no tienes vehículos registrados.
                                        </Typography>
                                    ) : (
                                        vehiculos.map((v) => (
                                            <MiniVehicleItem
                                                key={v.vehiculoId}
                                                placa={v.placa}
                                                marca={v.marca ?? ''}
                                                modelo={v.modelo ?? ''}
                                                estado={v.estadoRegistro}
                                                permisosActivos={v.vehiculoId === vehiculo?.vehiculoId ? permisosActivos : 0}
                                                onClick={() => navigate(`/propietario/vehiculos/${v.placa}`)}
                                            />
                                        ))
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* BLOQUE 5: Grupo Familiar (mini) */}
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                        <Card sx={{ borderRadius: vigiaRadius.md, boxShadow: vigiaShadows.sm, height: '100%' }}>
                            <CardContent sx={{ p: 2 }}>
                                <SectionHeader
                                    title="Grupo Familiar"
                                    action={
                                        <Typography
                                            onClick={() => navigate('/propietario/personas')}
                                            sx={{ fontSize: '0.75rem', color: vigiaColors.primary, cursor: 'pointer', fontWeight: 500, '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            Gestionar →
                                        </Typography>
                                    }
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {autorizacionesQuery.isLoading || isLoadingFamilia ? (
                                        Array.from({ length: 2 }).map((_, i) => (
                                            <Skeleton key={i} variant="rounded" height={44} sx={{ mb: 1, borderRadius: '6px' }} />
                                        ))
                                    ) : autorizacionesQuery.isError ? (
                                        <Box sx={{ py: 2, textAlign: 'center' }}>
                                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary, mb: 1 }}>
                                                No se pudo cargar tu grupo familiar.
                                            </Typography>
                                            <Button size="small" onClick={() => autorizacionesQuery.refetch()}>Reintentar</Button>
                                        </Box>
                                    ) : familia.length === 0 ? (
                                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary, py: 2, textAlign: 'center' }}>
                                            Aún no tienes personas autorizadas.
                                        </Typography>
                                    ) : (
                                        familia.map((f) => (
                                            <MiniFamilyCard
                                                key={f.id}
                                                nombre={f.nombre}
                                                parentesco={f.relacion}
                                                enrollmentCompletado={f.biometria === 'COMPLETADA'}
                                                onClick={() => navigate('/propietario/personas')}
                                            />
                                        ))
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>
                </Box>

                {/* BLOQUE 6: Acciones Rápidas */}
                <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <SectionHeader title="Acciones Rápidas" />
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                            gap: `${vigiaSpacing.cardGap}px`,
                        }}
                    >
                        <QuickActionButton
                            icon={<VpnKeyIcon />}
                            label="Generar Pase"
                            sublabel="de Acceso Rápido"
                            onClick={() => navigate('/propietario/pases-rapidos', { state: { openGenerarPase: true } })}
                        />
                        <QuickActionButton
                            icon={<AssignmentIcon />}
                            label="Nuevo Permiso"
                            sublabel="Temporal"
                            onClick={() => navigate('/propietario/permisos-temporales', { state: { openCrearPermiso: true } })}
                        />
                        <QuickActionButton
                            icon={<DirectionsCarIcon />}
                            label="Registrar"
                            sublabel="Vehículo"
                            onClick={() => navigate('/propietario/vehiculos', { state: { openRegistrar: true } })}
                        />
                        <QuickActionButton
                            icon={<GroupOutlinedIcon />}
                            label="Agregar"
                            sublabel="Persona Autorizada"
                            onClick={() => navigate('/propietario/personas', { state: { openDrawer: true } })}
                        />
                    </Box>
                </motion.div>
            </Box>
        </DashboardTemplate>
    );
};

export { InicioPage };
export default InicioPage;