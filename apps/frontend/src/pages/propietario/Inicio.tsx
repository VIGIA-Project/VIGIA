import React from 'react';
import { Box, Typography, Card, CardContent, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { SectionHeader } from '../../components/atoms';
import { KpiCard, ActivityTimelineItem, QuickActionButton, MiniVehicleItem, MiniFamilyCard } from '../../components/molecules';
import { staggerContainer, fadeInUp } from '../../config/animations.config';
import { vigiaShadows, vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';

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
import { usePropietarioVehiculo, useVehiculosDelPropietario, usePersonasDelPropietario } from '../../hooks/useRegistry';
import { usePermisosVigentesPorVehiculo, useMisPases, useAutorizacionesPorVehiculo } from '../../hooks/useAuthorization';

// Se removieron los MOCK DATA porque el usuario solicitó que todo venga desde los endpoints

const InicioPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  const displayName = user?.email?.split('@')[0] || 'Propietario';
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  const { vehiculo } = usePropietarioVehiculo();
  const permisosQuery = usePermisosVigentesPorVehiculo(vehiculo?.vehiculoId);
  const pasesQuery = useMisPases();
  
  // Real data for UI
  const vehiculosQuery = useVehiculosDelPropietario(user?.personaId);
  const vehiculosData = (vehiculosQuery.data ?? []).map((v: any) => ({
    placa: v.placa,
    marca: v.marca,
    modelo: v.modelo,
    estado: 'ACTIVO' as const,
    permisosActivos: (permisosQuery.data ?? []).length, // simplified
  }));
  
  const autorizacionesQuery = useAutorizacionesPorVehiculo(vehiculo?.vehiculoId);
  const autorizaciones = autorizacionesQuery.data ?? [];
  const personaIds = React.useMemo(() => autorizaciones.map((a: any) => a.personaId), [autorizaciones]);
  const { personasById } = usePersonasDelPropietario(personaIds);
  
  const familiaData = autorizaciones.map((a: any) => {
    const p = personasById.get(a.personaId);
    return {
      nombre: p?.nombreCompleto || `${p?.nombres} ${p?.apellidos}` || 'Cargando...',
      parentesco: a.relacion,
      enrollmentCompletado: p?.estadoBiometrico === 'COMPLETO'
    };
  });

  const permisosActivos = (permisosQuery.data ?? []).filter((p: any) => p.estado === 'ACTIVA' || p.estado === 'PROGRAMADO' || p.estado === 'EN_CURSO').length;
  const pasesActivos = (pasesQuery.data ?? []).filter((p: any) => p.estado === 'ACTIVO').length;

  const kpis = [
    {
      value: vehiculo ? 1 : 0,
      label: 'Vehículos',
      indicator: vehiculo ? '🟢 Activo' : 'Registra tu vehículo',
      indicatorColor: vehiculo ? '#2E7D32' : '#6B7280',
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
              <Typography sx={{ p: 2, fontSize: '0.9rem', color: vigiaColors.textSecondary, textAlign: 'center', bgcolor: '#fff', borderRadius: 2, border: '1px dashed #e0e0e0' }}>
                No hay actividad reciente registrada
              </Typography>
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
                  {vehiculosData.slice(0, 3).map((v: any) => (
                    <MiniVehicleItem key={v.placa} {...v} onClick={() => navigate(`/propietario/vehiculos/${v.placa}`)} />
                  ))}
                  {vehiculosData.length === 0 && (
                    <Typography sx={{ p: 2, fontSize: '0.8rem', color: vigiaColors.textSecondary, textAlign: 'center' }}>
                      No tienes vehículos registrados
                    </Typography>
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
                  {familiaData.slice(0, 3).map((f: any, i: number) => (
                    <MiniFamilyCard key={i} {...f} onClick={() => navigate('/propietario/personas')} />
                  ))}
                  {familiaData.length === 0 && (
                    <Typography sx={{ p: 2, fontSize: '0.8rem', color: vigiaColors.textSecondary, textAlign: 'center' }}>
                      No tienes personas autorizadas
                    </Typography>
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
