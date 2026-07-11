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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { useAuth } from '../../context';
import { useVehiculosDelPropietario, usePersonasDelPropietario as usePersonasResolver } from '../../hooks/useRegistry';
import { usePermisosVigentesPorVehiculo, useMisPases, useMiembrosGrupoFamiliar } from '../../hooks/useAuthorization';

// === MOCK DATA ===
// TODO: Replace with real data when Alerting BC is implemented
const MOCK_KPI_ALERTAS = { value: 2, label: 'Alertas Pendientes', indicator: '🔴 1 alta prioridad', indicatorColor: '#C62828', accentColor: '#C62828', route: '/propietario/alertas' };
// TODO: Replace with real data when Biometric BC is implemented
const MOCK_KPI_BIOMETRIA = { value: 1, label: 'Biom. Pendiente', indicator: '🔶 1 persona sin biometría', indicatorColor: '#F59E0B', accentColor: '#F59E0B', route: '/propietario/personas' };

// TODO: Replace with real data when Access Control BC is implemented
const MOCK_ACTIVIDAD = [
  { icon: <CheckCircleIcon sx={{ color: '#2E7D32' }} />, title: 'Acceso autorizado · PBW-1234 · Acceso Norte', subtitle: 'Validación biométrica exitosa', timestamp: 'hace 2h', severity: 'success' as const },
  { icon: <WarningAmberIcon sx={{ color: '#EDB200' }} />, title: 'Permiso próximo a expirar · PBB-3456', subtitle: 'Permiso de Jorge Mendoza vence en 4 horas', timestamp: 'hace 3h', severity: 'warning' as const },
  { icon: <ErrorIcon sx={{ color: '#C62828' }} />, title: 'Intento de acceso no autorizado · Acceso Sur', subtitle: 'Persona no registrada intentó ingresar con PBW-1234', timestamp: 'hace 5h', severity: 'error' as const },
  { icon: <InfoIcon sx={{ color: '#0D5CCF' }} />, title: 'Pase consumido · VIG-A7K3M2 · Jorge Mendoza', subtitle: 'Ingreso exitoso por Acceso Norte', timestamp: 'ayer', severity: 'info' as const },
];

const InicioPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  const displayName = user?.email?.split('@')[0] || 'Propietario';
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  const vehiculosQuery = useVehiculosDelPropietario(user?.personaId);
  const vehiculos = vehiculosQuery.data ?? [];
  const vehiculosCount = vehiculos.length;
  const vehiculo = vehiculos[0];
  const permisosQuery = usePermisosVigentesPorVehiculo(vehiculo?.vehiculoId);
  const pasesQuery = useMisPases();
  const autorizacionesQuery = useMiembrosGrupoFamiliar(user?.personaId);

  const permisosActivos = (permisosQuery.data ?? []).filter((p) => p.estado === 'ACTIVA').length;
  const pasesActivos = (pasesQuery.data ?? []).filter((p) => p.estado === 'ACTIVO').length;

  const autorizaciones = autorizacionesQuery.data ?? [];
  const personaIds = useMemo(() => autorizaciones.map((a) => a.personaId), [autorizaciones]);
  const { personasById, isLoading: isLoadingFamilia } = usePersonasResolver(personaIds);

  const familia = useMemo(
    () => autorizaciones.map((a) => mapAutorizacionAPersona(a, personasById.get(a.personaId))),
    [autorizaciones, personasById]
  );

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
    MOCK_KPI_ALERTAS,
    MOCK_KPI_BIOMETRIA,
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
              Último acceso: hace 2h · Acceso Norte · PBW-1234
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
              {MOCK_ACTIVIDAD.map((item, i) => (
                <ActivityTimelineItem key={i} {...item} />
              ))}
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
