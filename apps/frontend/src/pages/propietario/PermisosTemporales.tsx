import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { motion, useReducedMotion } from 'framer-motion';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { StatusChip, EmptyState, SectionHeader } from '../../components/atoms';
import { FilterChips } from '../../components/molecules';
import { staggerContainer, staggerItem, fadeInUp } from '../../config/animations.config';
import { vigiaShadows, vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════
interface PermisoTemporalViewDto {
  permiso_id: string;
  persona_autorizada_nombre: string;
  persona_autorizada_cedula: string;
  vehiculo_placa: string;
  vigencia_inicio: string;
  vigencia_fin: string;
  motivo: string;
  estado: 'PROGRAMADO' | 'ACTIVA' | 'EXPIRADO' | 'REVOCADO';
}

interface AutorizacionPermanenteViewDto {
  autorizacion_id: string;
  persona_autorizada_nombre: string;
  persona_autorizada_cedula: string;
  vehiculo_placa: string;
  parentesco_o_relacion: string;
  fecha_otorgamiento: string;
  estado: 'ACTIVA' | 'REVOCADA';
}

interface PersonaAutorizadaViewDto {
  persona_id: string;
  nombre_completo: string;
  cedula: string;
  rol: 'OWNER' | 'FAMILIAR' | 'CONDUCTOR_PERMANENTE';
  vehiculos_vinculados: string[];
  enrollment_biometrico: 'COMPLETADO' | 'PENDIENTE' | 'NO_SOLICITADO';
  estado: 'ACTIVO' | 'INACTIVO';
}

interface MiembroFamiliarViewDto {
  miembro_id: string;
  nombre_completo: string;
  cedula: string;
  parentesco: string;
  vehiculos_acceso: string[];
  enrollment_biometrico: 'COMPLETADO' | 'PENDIENTE' | 'NO_SOLICITADO';
  puede_crear_permisos: boolean;
  estado: 'ACTIVO' | 'INACTIVO';
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════
const MOCK_PERMISOS: PermisoTemporalViewDto[] = [
  { permiso_id: 'pt-001', persona_autorizada_nombre: 'Jorge Luis Mendoza', persona_autorizada_cedula: '1723456789', vehiculo_placa: 'PBW-1234', vigencia_inicio: '2026-07-04T08:00', vigencia_fin: '2026-07-04T18:00', motivo: 'Visita familiar', estado: 'ACTIVA' },
  { permiso_id: 'pt-002', persona_autorizada_nombre: 'Andrea Salazar', persona_autorizada_cedula: '1734567890', vehiculo_placa: 'PBA-5678', vigencia_inicio: '2026-07-05T09:00', vigencia_fin: '2026-07-05T12:00', motivo: 'Entrega de documentos', estado: 'PROGRAMADO' },
  { permiso_id: 'pt-003', persona_autorizada_nombre: 'Roberto Espinoza', persona_autorizada_cedula: '1712345678', vehiculo_placa: 'PBW-1234', vigencia_inicio: '2026-07-01T07:00', vigencia_fin: '2026-07-01T19:00', motivo: 'Mantenimiento del vehículo', estado: 'EXPIRADO' },
  { permiso_id: 'pt-004', persona_autorizada_nombre: 'Lucía Paredes', persona_autorizada_cedula: '1745678901', vehiculo_placa: 'PBB-3456', vigencia_inicio: '2026-07-02T10:00', vigencia_fin: '2026-07-02T15:00', motivo: 'Trámite universitario', estado: 'REVOCADO' },
];

const MOCK_AUTORIZACIONES: AutorizacionPermanenteViewDto[] = [
  { autorizacion_id: 'ap-001', persona_autorizada_nombre: 'Stalin Joel Coello', persona_autorizada_cedula: '1724567890', vehiculo_placa: 'PBW-1234', parentesco_o_relacion: 'Hermano', fecha_otorgamiento: '2026-03-15', estado: 'ACTIVA' },
  { autorizacion_id: 'ap-002', persona_autorizada_nombre: 'María Elena Arévalo', persona_autorizada_cedula: '1756789012', vehiculo_placa: 'PBW-1234', parentesco_o_relacion: 'Madre', fecha_otorgamiento: '2026-01-10', estado: 'ACTIVA' },
  { autorizacion_id: 'ap-003', persona_autorizada_nombre: 'Carlos Andrés Coello', persona_autorizada_cedula: '1701234567', vehiculo_placa: 'PBA-5678', parentesco_o_relacion: 'Padre', fecha_otorgamiento: '2026-02-20', estado: 'REVOCADA' },
];

const MOCK_PERSONAS: PersonaAutorizadaViewDto[] = [
  { persona_id: 'per-001', nombre_completo: 'Antony Coello', cedula: '1720123456', rol: 'OWNER', vehiculos_vinculados: ['PBW-1234', 'PBA-5678', 'PBB-3456'], enrollment_biometrico: 'COMPLETADO', estado: 'ACTIVO' },
  { persona_id: 'per-002', nombre_completo: 'Stalin Joel Coello', cedula: '1724567890', rol: 'FAMILIAR', vehiculos_vinculados: ['PBW-1234'], enrollment_biometrico: 'PENDIENTE', estado: 'ACTIVO' },
  { persona_id: 'per-003', nombre_completo: 'María Elena Arévalo', cedula: '1756789012', rol: 'FAMILIAR', vehiculos_vinculados: ['PBW-1234'], enrollment_biometrico: 'COMPLETADO', estado: 'ACTIVO' },
  { persona_id: 'per-004', nombre_completo: 'Carlos Andrés Coello', cedula: '1701234567', rol: 'FAMILIAR', vehiculos_vinculados: ['PBA-5678'], enrollment_biometrico: 'NO_SOLICITADO', estado: 'INACTIVO' },
  { persona_id: 'per-005', nombre_completo: 'Jorge Luis Mendoza', cedula: '1723456789', rol: 'CONDUCTOR_PERMANENTE', vehiculos_vinculados: ['PBW-1234', 'PBA-5678'], enrollment_biometrico: 'PENDIENTE', estado: 'ACTIVO' },
];

const MOCK_FAMILIA: MiembroFamiliarViewDto[] = [
  { miembro_id: 'fam-001', nombre_completo: 'Stalin Joel Coello', cedula: '1724567890', parentesco: 'Hermano', vehiculos_acceso: ['PBW-1234'], enrollment_biometrico: 'PENDIENTE', puede_crear_permisos: false, estado: 'ACTIVO' },
  { miembro_id: 'fam-002', nombre_completo: 'María Elena Arévalo', cedula: '1756789012', parentesco: 'Madre', vehiculos_acceso: ['PBW-1234', 'PBA-5678'], enrollment_biometrico: 'COMPLETADO', puede_crear_permisos: true, estado: 'ACTIVO' },
  { miembro_id: 'fam-003', nombre_completo: 'Carlos Andrés Coello', cedula: '1701234567', parentesco: 'Padre', vehiculos_acceso: ['PBA-5678'], enrollment_biometrico: 'NO_SOLICITADO', puede_crear_permisos: false, estado: 'INACTIVO' },
];

const MOCK_PLACAS = ['PBW-1234', 'PBA-5678', 'PBB-3456'];

// ═══════════════════════════════════════════════════════════════
// FILTROS
// ═══════════════════════════════════════════════════════════════
const FILTER_AUTORIZACIONES = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'PERMISOS', label: 'Permisos Temporales' },
  { key: 'PERMANENTES', label: 'Autorizaciones Permanentes' },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTES INLINE
// ═══════════════════════════════════════════════════════════════
const RolChip: React.FC<{ rol: string }> = ({ rol }) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    OWNER: { bg: '#E3F2FD', text: '#0D5CCF', label: 'Propietario' },
    FAMILIAR: { bg: '#E8F5E9', text: '#2E7D32', label: 'Familiar' },
    CONDUCTOR_PERMANENTE: { bg: '#F3F4F6', text: '#4B5563', label: 'Conductor' },
  };
  const c = config[rol] || config.CONDUCTOR_PERMANENTE;
  return (
    <Chip
      label={c.label}
      size="small"
      sx={{ backgroundColor: c.bg, color: c.text, fontWeight: 600, fontSize: '0.7rem' }}
    />
  );
};

const EnrollmentIndicator: React.FC<{ estado: string }> = ({ estado }) => {
  const config: Record<string, { icon: React.ReactNode; text: string; color: string }> = {
    COMPLETADO: { icon: <CheckCircleIcon sx={{ fontSize: 16, color: '#2E7D32' }} />, text: 'Completado', color: '#2E7D32' },
    PENDIENTE: { icon: <HourglassEmptyIcon sx={{ fontSize: 16, color: '#EDB200' }} />, text: 'Pendiente', color: '#EDB200' },
    NO_SOLICITADO: { icon: <RemoveCircleOutlineIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />, text: 'No solicitado', color: '#9CA3AF' },
  };
  const c = config[estado] || config.NO_SOLICITADO;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {c.icon}
      <Typography variant="caption" sx={{ color: c.color, fontWeight: 500 }}>
        {c.text}
      </Typography>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
const PermisosTemporalesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldReduceMotion = useReducedMotion();

  // === ESTADO GENERAL ===
  const [tabActual, setTabActual] = useState(0);
  const [exitoSnackbar, setExitoSnackbar] = useState(false);
  const [exitoMensaje, setExitoMensaje] = useState('');

  // === ESTADO TAB 0: Permisos y Autorizaciones ===
  const [filtroAutorizaciones, setFiltroAutorizaciones] = useState('TODOS');
  const [permisos, setPermisos] = useState<PermisoTemporalViewDto[]>(MOCK_PERMISOS);
  const [autorizaciones, setAutorizaciones] = useState<AutorizacionPermanenteViewDto[]>(MOCK_AUTORIZACIONES);
  const [dialogPermisoOpen, setDialogPermisoOpen] = useState(false);
  const [dialogAutorizacionOpen, setDialogAutorizacionOpen] = useState(false);
  const [nuevoPermiso, setNuevoPermiso] = useState({
    persona_autorizada_nombre: '',
    persona_autorizada_cedula: '',
    vehiculo_placa: '',
    vigencia_inicio: '',
    vigencia_fin: '',
    motivo: '',
  });
  const [nuevaAutorizacion, setNuevaAutorizacion] = useState({
    persona_autorizada_nombre: '',
    persona_autorizada_cedula: '',
    vehiculo_placa: '',
    parentesco_o_relacion: '',
  });

  // === HANDLERS TAB 0 ===
  const handleCrearPermiso = () => {
    const nuevo: PermisoTemporalViewDto = {
      permiso_id: `pt-${Date.now()}`,
      ...nuevoPermiso,
      estado: 'PROGRAMADO',
    };
    setPermisos((prev) => [nuevo, ...prev]);
    setDialogPermisoOpen(false);
    setNuevoPermiso({ persona_autorizada_nombre: '', persona_autorizada_cedula: '', vehiculo_placa: '', vigencia_inicio: '', vigencia_fin: '', motivo: '' });
    setExitoMensaje('Permiso Temporal creado exitosamente');
    setExitoSnackbar(true);
  };

  const handleCrearAutorizacion = () => {
    const nueva: AutorizacionPermanenteViewDto = {
      autorizacion_id: `ap-${Date.now()}`,
      persona_autorizada_nombre: nuevaAutorizacion.persona_autorizada_nombre,
      persona_autorizada_cedula: nuevaAutorizacion.persona_autorizada_cedula,
      vehiculo_placa: nuevaAutorizacion.vehiculo_placa,
      parentesco_o_relacion: nuevaAutorizacion.parentesco_o_relacion,
      fecha_otorgamiento: new Date().toISOString().split('T')[0],
      estado: 'ACTIVA',
    };
    setAutorizaciones((prev) => [nueva, ...prev]);
    setDialogAutorizacionOpen(false);
    setNuevaAutorizacion({ persona_autorizada_nombre: '', persona_autorizada_cedula: '', vehiculo_placa: '', parentesco_o_relacion: '' });
    setExitoMensaje('Autorización Permanente creada exitosamente');
    setExitoSnackbar(true);
  };

  const handleRevocarPermiso = (id: string) => {
    setPermisos((prev) => prev.map((p) => (p.permiso_id === id ? { ...p, estado: 'REVOCADO' as const } : p)));
  };

  const handleRevocarAutorizacion = (id: string) => {
    setAutorizaciones((prev) => prev.map((a) => (a.autorizacion_id === id ? { ...a, estado: 'REVOCADA' as const } : a)));
  };

  // Helper: color borde por estado de permiso
  const getPermisoBorderColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVA': return vigiaColors.success;
      case 'PROGRAMADO': return vigiaColors.primary;
      case 'REVOCADO': return vigiaColors.error;
      default: return vigiaColors.textTertiary; // EXPIRADO
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <DashboardTemplate rol="OWNER" pageTitle="Gestión de Autorizaciones">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>

        {/* TABS — Solo 2 */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Tabs
            value={tabActual}
            onChange={(_, v) => setTabActual(v)}
            sx={{
              '& .MuiTab-root': {
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.9rem',
                minHeight: 44,
              },
              '& .Mui-selected': { color: vigiaColors.primary },
              '& .MuiTabs-indicator': {
                background: vigiaColors.gradientIA,
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab label="Permisos y Autorizaciones" />
            <Tab label="Personas y Familia" />
          </Tabs>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB 0: Permisos y Autorizaciones                      */}
        {/* ═══════════════════════════════════════════════════════ */}
        {tabActual === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>
            {/* Header con botones y FilterChips */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'flex-start' : 'center',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 1.5,
              }}
            >
              <FilterChips
                options={FILTER_AUTORIZACIONES}
                activeKey={filtroAutorizaciones}
                onChange={setFiltroAutorizaciones}
              />
              <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setDialogPermisoOpen(true)}
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    borderColor: 'rgba(13, 92, 207, 0.2)',
                    color: vigiaColors.primary,
                    borderRadius: vigiaRadius.sm,
                    '&:hover': {
                      borderColor: vigiaColors.primary,
                      backgroundColor: 'rgba(13, 92, 207, 0.04)',
                    },
                  }}
                >
                  Nuevo Permiso
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setDialogAutorizacionOpen(true)}
                  sx={{
                    background: vigiaColors.gradientIA,
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.8rem',
                    textTransform: 'none',
                    borderRadius: vigiaRadius.sm,
                    boxShadow: vigiaShadows.sm,
                    '&:hover': { background: vigiaColors.gradientIA, boxShadow: vigiaShadows.md },
                  }}
                >
                  Nueva Autorización
                </Button>
              </Box>
            </Box>

            {/* Sección: Permisos Temporales */}
            {(filtroAutorizaciones === 'TODOS' || filtroAutorizaciones === 'PERMISOS') && (
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <SectionHeader title={`Permisos Temporales (${permisos.length})`} />
                {permisos.length === 0 ? (
                  <EmptyState
                    titulo="Sin permisos temporales"
                    descripcion="Cree un permiso temporal para autorizar acceso por tiempo limitado."
                    accionLabel="Nuevo Permiso"
                    onAccion={() => setDialogPermisoOpen(true)}
                  />
                ) : (
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {permisos.map((permiso) => (
                        <motion.div key={permiso.permiso_id} variants={staggerItem}>
                          <Card
                            sx={{
                              borderRadius: vigiaRadius.md,
                              boxShadow: vigiaShadows.sm,
                              borderLeft: `3px solid ${getPermisoBorderColor(permiso.estado)}`,
                              transition: 'all 0.2s ease',
                              '&:hover': { boxShadow: vigiaShadows.md, backgroundColor: vigiaColors.bgCardHover },
                            }}
                          >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Typography
                                      sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: vigiaColors.textBody }}
                                    >
                                      {permiso.persona_autorizada_nombre}
                                    </Typography>
                                    <StatusChip estado={permiso.estado} />
                                  </Box>
                                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary }}>
                                    {permiso.vehiculo_placa} · {permiso.motivo}
                                  </Typography>
                                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: vigiaColors.textTertiary, mt: 0.5 }}>
                                    {new Date(permiso.vigencia_inicio).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}
                                    {' → '}
                                    {new Date(permiso.vigencia_fin).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}
                                  </Typography>
                                </Box>
                                {(permiso.estado === 'ACTIVA' || permiso.estado === 'PROGRAMADO') && (
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleRevocarPermiso(permiso.permiso_id)}
                                    sx={{ fontSize: '0.75rem', textTransform: 'none', flexShrink: 0 }}
                                  >
                                    Revocar
                                  </Button>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </Box>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Sección: Autorizaciones Permanentes */}
            {(filtroAutorizaciones === 'TODOS' || filtroAutorizaciones === 'PERMANENTES') && (
              <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                <SectionHeader title={`Autorizaciones Permanentes (${autorizaciones.length})`} />
                {autorizaciones.length === 0 ? (
                  <EmptyState
                    titulo="Sin autorizaciones permanentes"
                    descripcion="Otorgue acceso indefinido a personas de confianza."
                    accionLabel="Nueva Autorización"
                    onAccion={() => setDialogAutorizacionOpen(true)}
                  />
                ) : (
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {autorizaciones.map((auth) => (
                        <motion.div key={auth.autorizacion_id} variants={staggerItem}>
                          <Card
                            sx={{
                              borderRadius: vigiaRadius.md,
                              boxShadow: vigiaShadows.sm,
                              borderLeft: `3px solid ${auth.estado === 'ACTIVA' ? vigiaColors.greenIA : vigiaColors.textTertiary}`,
                              transition: 'all 0.2s ease',
                              '&:hover': { boxShadow: vigiaShadows.md, backgroundColor: vigiaColors.bgCardHover },
                            }}
                          >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Typography
                                      sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: vigiaColors.textBody }}
                                    >
                                      {auth.persona_autorizada_nombre}
                                    </Typography>
                                    <StatusChip estado={auth.estado} />
                                  </Box>
                                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary }}>
                                    {auth.vehiculo_placa} · {auth.parentesco_o_relacion}
                                  </Typography>
                                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: vigiaColors.textTertiary, mt: 0.5 }}>
                                    Desde: {new Date(auth.fecha_otorgamiento).toLocaleDateString('es-EC')}
                                  </Typography>
                                </Box>
                                {auth.estado === 'ACTIVA' && (
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleRevocarAutorizacion(auth.autorizacion_id)}
                                    sx={{ fontSize: '0.75rem', textTransform: 'none', flexShrink: 0 }}
                                  >
                                    Revocar
                                  </Button>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </Box>
                  </motion.div>
                )}
              </motion.div>
            )}
          </Box>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB 1: Personas y Familia                              */}
        {/* ═══════════════════════════════════════════════════════ */}
        {tabActual === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>

            {/* Sección: Personas Autorizadas */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <SectionHeader title={`Personas Autorizadas (${MOCK_PERSONAS.length})`} />
              <Card
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(13,92,207,0.03)',
                  border: '1px solid rgba(13,92,207,0.08)',
                  borderRadius: vigiaRadius.md,
                }}
              >
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif', fontSize: '0.8rem' }}>
                    Todas las personas vinculadas a sus vehículos con su estado de enrollment biométrico. El enrollment pendiente no bloquea el acceso.
                  </Typography>
                </CardContent>
              </Card>
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {MOCK_PERSONAS.map((persona) => (
                    <motion.div key={persona.persona_id} variants={staggerItem}>
                      <Card
                        sx={{
                          borderRadius: vigiaRadius.md,
                          boxShadow: vigiaShadows.sm,
                          transition: 'all 0.2s ease',
                          '&:hover': { boxShadow: vigiaShadows.md, backgroundColor: vigiaColors.bgCardHover },
                        }}
                      >
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: isMobile ? 'flex-start' : 'center',
                              flexDirection: isMobile ? 'column' : 'row',
                              gap: 1,
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar
                                sx={{
                                  width: 36,
                                  height: 36,
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  background: persona.enrollment_biometrico === 'COMPLETADO'
                                    ? vigiaColors.gradientIA
                                    : 'rgba(13, 92, 207, 0.1)',
                                  color: persona.enrollment_biometrico === 'COMPLETADO'
                                    ? vigiaColors.white
                                    : vigiaColors.primary,
                                }}
                              >
                                {persona.nombre_completo.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </Avatar>
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography
                                    sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: vigiaColors.textBody }}
                                  >
                                    {persona.nombre_completo}
                                  </Typography>
                                  <RolChip rol={persona.rol} />
                                </Box>
                                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: vigiaColors.textTertiary }}>
                                  {persona.cedula} · {persona.vehiculos_vinculados.join(', ')}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <EnrollmentIndicator estado={persona.enrollment_biometrico} />
                              <StatusChip estado={persona.estado} />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </motion.div>

            {/* Sección: Grupo Familiar */}
            <motion.div variants={fadeInUp} initial="hidden" animate="visible">
              <SectionHeader
                title={`Mi Grupo Familiar (${MOCK_FAMILIA.filter((m) => m.estado === 'ACTIVO').length}/5)`}
                action={
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.8rem',
                      textTransform: 'none',
                      color: vigiaColors.primary,
                    }}
                  >
                    Agregar
                  </Button>
                }
              />
              {/* Card informativa con reglas */}
              <Card
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(25,214,196,0.04)',
                  border: '1px solid rgba(25,214,196,0.12)',
                  borderRadius: vigiaRadius.md,
                }}
              >
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif', fontSize: '0.8rem' }}>
                    <strong style={{ color: vigiaColors.textHeading }}>Reglas:</strong> Máximo 5 miembros · Solo familiares directos · El propietario puede delegar creación de permisos · Enrollment opcional pero recomendado
                  </Typography>
                </CardContent>
              </Card>
              {/* Grid de miembros */}
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                <Grid container spacing={1.5}>
                  {MOCK_FAMILIA.map((miembro) => (
                    <Grid item xs={12} sm={6} md={4} key={miembro.miembro_id}>
                      <motion.div variants={staggerItem}>
                        <Card
                          sx={{
                            borderRadius: vigiaRadius.md,
                            boxShadow: vigiaShadows.sm,
                            border: miembro.estado === 'ACTIVO'
                              ? '1px solid rgba(25,214,196,0.15)'
                              : '1px solid rgba(10,47,134,0.06)',
                            opacity: miembro.estado === 'INACTIVO' ? 0.6 : 1,
                            transition: 'all 0.2s ease',
                            height: '100%',
                            '&:hover': {
                              boxShadow: vigiaShadows.md,
                              transform: shouldReduceMotion ? 'none' : 'translateY(-2px)',
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                              <Box>
                                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: vigiaColors.textBody }}>
                                  {miembro.nombre_completo}
                                </Typography>
                                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: vigiaColors.textTertiary }}>
                                  {miembro.parentesco} · {miembro.cedula}
                                </Typography>
                              </Box>
                              <StatusChip estado={miembro.estado} />
                            </Box>
                            {/* Placas */}
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
                              {miembro.vehiculos_acceso.map((placa) => (
                                <Chip
                                  key={placa}
                                  label={placa}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem', height: 22 }}
                                />
                              ))}
                            </Box>
                            {/* Enrollment */}
                            <EnrollmentIndicator estado={miembro.enrollment_biometrico} />
                            {/* Delegación */}
                            {miembro.puede_crear_permisos && (
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CheckCircleIcon sx={{ fontSize: 14, color: vigiaColors.greenIA }} />
                                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.7rem', color: vigiaColors.greenIA, fontWeight: 500 }}>
                                  Puede crear permisos
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </motion.div>
          </Box>
        )}
      </Box>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DIALOGS                                                */}
      {/* ═══════════════════════════════════════════════════════ */}

      {/* Dialog: Nuevo Permiso Temporal */}
      <Dialog open={dialogPermisoOpen} onClose={() => setDialogPermisoOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: vigiaColors.textHeading }}>
          Nuevo Permiso Temporal
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, mb: 2 }}>
            Autorice el acceso temporal de una persona a uno de sus vehículos registrados.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre de la Persona"
                required
                fullWidth
                value={nuevoPermiso.persona_autorizada_nombre}
                onChange={(e) => setNuevoPermiso((p) => ({ ...p, persona_autorizada_nombre: e.target.value }))}
                placeholder="Ej: Jorge Mendoza"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cédula"
                required
                fullWidth
                value={nuevoPermiso.persona_autorizada_cedula}
                onChange={(e) => setNuevoPermiso((p) => ({ ...p, persona_autorizada_cedula: e.target.value }))}
                placeholder="Ej: 1723456789"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Vehículo"
                required
                fullWidth
                value={nuevoPermiso.vehiculo_placa}
                onChange={(e) => setNuevoPermiso((p) => ({ ...p, vehiculo_placa: e.target.value }))}
              >
                {MOCK_PLACAS.map((placa) => (
                  <MenuItem key={placa} value={placa}>{placa}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Motivo"
                required
                fullWidth
                value={nuevoPermiso.motivo}
                onChange={(e) => setNuevoPermiso((p) => ({ ...p, motivo: e.target.value }))}
                placeholder="Ej: Visita familiar"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Inicio"
                type="datetime-local"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={nuevoPermiso.vigencia_inicio}
                onChange={(e) => setNuevoPermiso((p) => ({ ...p, vigencia_inicio: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fin"
                type="datetime-local"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={nuevoPermiso.vigencia_fin}
                onChange={(e) => setNuevoPermiso((p) => ({ ...p, vigencia_fin: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogPermisoOpen(false)} sx={{ color: vigiaColors.textSecondary }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCrearPermiso}
            sx={{
              background: vigiaColors.gradientIA,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: vigiaRadius.sm,
              '&:hover': { background: vigiaColors.gradientIA },
            }}
          >
            Crear Permiso
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Nueva Autorización Permanente */}
      <Dialog open={dialogAutorizacionOpen} onClose={() => setDialogAutorizacionOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: vigiaColors.textHeading }}>
          Nueva Autorización Permanente
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, mb: 2 }}>
            Otorgue acceso indefinido a una persona para conducir uno de sus vehículos registrados.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre de la Persona"
                required
                fullWidth
                value={nuevaAutorizacion.persona_autorizada_nombre}
                onChange={(e) => setNuevaAutorizacion((p) => ({ ...p, persona_autorizada_nombre: e.target.value }))}
                placeholder="Ej: María Elena Arévalo"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cédula"
                required
                fullWidth
                value={nuevaAutorizacion.persona_autorizada_cedula}
                onChange={(e) => setNuevaAutorizacion((p) => ({ ...p, persona_autorizada_cedula: e.target.value }))}
                placeholder="Ej: 1756789012"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Vehículo"
                required
                fullWidth
                value={nuevaAutorizacion.vehiculo_placa}
                onChange={(e) => setNuevaAutorizacion((p) => ({ ...p, vehiculo_placa: e.target.value }))}
              >
                {MOCK_PLACAS.map((placa) => (
                  <MenuItem key={placa} value={placa}>{placa}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Parentesco o Relación"
                required
                fullWidth
                value={nuevaAutorizacion.parentesco_o_relacion}
                onChange={(e) => setNuevaAutorizacion((p) => ({ ...p, parentesco_o_relacion: e.target.value }))}
                placeholder="Ej: Hermano, Madre"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogAutorizacionOpen(false)} sx={{ color: vigiaColors.textSecondary }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCrearAutorizacion}
            sx={{
              background: vigiaColors.gradientIA,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: vigiaRadius.sm,
              '&:hover': { background: vigiaColors.gradientIA },
            }}
          >
            Crear Autorización
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar dinámico */}
      <Snackbar
        open={exitoSnackbar}
        autoHideDuration={3000}
        onClose={() => setExitoSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {exitoMensaje}
        </Alert>
      </Snackbar>
    </DashboardTemplate>
  );
};

export { PermisosTemporalesPage };
export default PermisosTemporalesPage;