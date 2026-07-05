import React, { useState, useEffect } from 'react';
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
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { motion, useReducedMotion } from 'framer-motion';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { StatusChip, EmptyState } from '../../components/atoms';
import { FilterChips } from '../../components/molecules';
import { staggerContainer, staggerItem, fadeInUp, scaleIn, pulseGlow } from '../../config/animations.config';
import { vigiaShadows, vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';

// ═══════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════
type EstadoPase = 'ACTIVO' | 'CONSUMIDO' | 'EXPIRADO' | 'REVOCADO';

interface PaseRapidoViewDto {
  pase_id: string;
  codigo: string;
  conductor_nombre: string;
  conductor_cedula: string;
  vehiculo_placa: string;
  vigencia_inicio: string;
  vigencia_fin: string;
  motivo: string;
  estado: EstadoPase;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MOCK_PLACAS = ['PBW-1234', 'PBA-5678', 'PBB-3456'];
const FILTER_OPTIONS = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'ACTIVO', label: '🟢 Activos' },
  { key: 'CONSUMIDO', label: '✓ Consumidos' },
  { key: 'EXPIRADO', label: '⏰ Expirados' },
];
const INITIAL_FORM = {
  conductor_nombre: '',
  conductor_cedula: '',
  vehiculo_placa: '',
  vigencia_inicio: '',
  vigencia_fin: '',
  motivo: '',
};

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════
const MOCK_PASES: PaseRapidoViewDto[] = [
  { pase_id: 'pase-001', codigo: 'VIG-A7K3M2', conductor_nombre: 'Jorge Luis Mendoza', conductor_cedula: '1723456789', vehiculo_placa: 'PBW-1234', vigencia_inicio: '2026-07-04T08:00', vigencia_fin: '2026-07-04T12:00', motivo: 'Entrega de materiales', estado: 'ACTIVO' },
  { pase_id: 'pase-002', codigo: 'VIG-B9N4P7', conductor_nombre: 'Andrea Salazar', conductor_cedula: '1734567890', vehiculo_placa: 'PBA-5678', vigencia_inicio: '2026-07-03T14:00', vigencia_fin: '2026-07-03T16:00', motivo: 'Visita técnica', estado: 'CONSUMIDO' },
  { pase_id: 'pase-003', codigo: 'VIG-C2R8T5', conductor_nombre: 'Roberto Espinoza', conductor_cedula: '1712345678', vehiculo_placa: 'PBW-1234', vigencia_inicio: '2026-07-02T07:00', vigencia_fin: '2026-07-02T09:00', motivo: 'Retiro de documentos', estado: 'EXPIRADO' },
];

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════
const generarCodigo = (): string => {
  let codigo = 'VIG-';
  for (let i = 0; i < 6; i++) {
    codigo += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return codigo;
};

const getBorderColor = (estado: EstadoPase): string => {
  switch (estado) {
    case 'ACTIVO': return vigiaColors.success;
    case 'CONSUMIDO': return vigiaColors.primary;
    case 'EXPIRADO': return vigiaColors.textTertiary;
    case 'REVOCADO': return vigiaColors.error;
  }
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Typewriter del código
// ═══════════════════════════════════════════════════════════════
const TypewriterCode: React.FC<{ code: string }> = ({ code }) => {
  const [displayedChars, setDisplayedChars] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayedChars(code.length);
      return;
    }
    setDisplayedChars(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedChars(i);
      if (i >= code.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, [code, shouldReduceMotion]);

  return (
    <Typography
      sx={{
        fontFamily: '"Fira Code", "JetBrains Mono", "Courier New", monospace',
        fontWeight: 700,
        fontSize: { xs: '2rem', sm: '2.8rem' },
        letterSpacing: '4px',
        color: vigiaColors.textHeading,
        textAlign: 'center',
        userSelect: 'all',
      }}
    >
      {code.slice(0, displayedChars)}
      {displayedChars < code.length && (
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            width: '2px',
            height: '2.5rem',
            backgroundColor: vigiaColors.primary,
            ml: 0.5,
            animation: 'blink 0.8s infinite',
            '@keyframes blink': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0 },
            },
          }}
        />
      )}
    </Typography>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Vista de código generado
// ═══════════════════════════════════════════════════════════════
const CodigoGeneradoView: React.FC<{
  pase: PaseRapidoViewDto;
  onClose: () => void;
}> = ({ pase, onClose }) => {
  const [copiado, setCopiado] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleCopiar = () => {
    navigator.clipboard.writeText(pase.codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleCompartir = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pase de Acceso Rápido VIGIA',
        text: `Código de acceso: ${pase.codigo}\nVehículo: ${pase.vehiculo_placa}\nVigencia: ${new Date(pase.vigencia_inicio).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })} - ${new Date(pase.vigencia_fin).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}`,
      });
    }
  };

  return (
    <motion.div variants={scaleIn} initial="hidden" animate="visible">
      <Card
        sx={{
          maxWidth: 480,
          mx: 'auto',
          borderRadius: vigiaRadius.xl,
          boxShadow: vigiaShadows.xl,
          overflow: 'hidden',
        }}
      >
        {/* Header con gradiente */}
        <Box
          sx={{
            background: vigiaColors.gradientIA,
            py: 3,
            px: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Exo 2", sans-serif',
              fontWeight: 600,
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.9)',
              mb: 0.5,
            }}
          >
            Pase de Acceso Rápido
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            Código de un solo uso · Dictar al guardia
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Código con typewriter + glow */}
          <motion.div variants={pulseGlow} animate={shouldReduceMotion ? undefined : 'animate'}>
            <Box
              sx={{
                py: 3,
                px: 2,
                borderRadius: vigiaRadius.lg,
                backgroundColor: 'rgba(13, 92, 207, 0.03)',
                border: '2px dashed rgba(13, 92, 207, 0.15)',
                textAlign: 'center',
                mb: 3,
              }}
            >
              <TypewriterCode code={pase.codigo} />
            </Box>
          </motion.div>

          {/* Warning premium */}
          <Alert
            severity="warning"
            variant="outlined"
            sx={{
              mb: 3,
              borderColor: vigiaColors.warning,
              backgroundColor: 'rgba(237, 178, 0, 0.04)',
              borderRadius: vigiaRadius.sm,
              '& .MuiAlert-icon': { color: vigiaColors.warning },
            }}
          >
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem' }}>
              Este código se muestra una sola vez.
            </Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: vigiaColors.textSecondary }}>
              Cópielo o compártalo ahora. No podrá recuperarlo después de salir de esta pantalla.
            </Typography>
          </Alert>

          {/* Datos del pase */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            {[
              { label: 'Conductor', value: pase.conductor_nombre },
              { label: 'Cédula', value: pase.conductor_cedula },
              { label: 'Vehículo', value: pase.vehiculo_placa },
              {
                label: 'Vigencia',
                value: `${new Date(pase.vigencia_inicio).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })} → ${new Date(pase.vigencia_fin).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}`,
              },
              { label: 'Motivo', value: pase.motivo },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.75rem',
                    color: vigiaColors.textTertiary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.85rem',
                    color: vigiaColors.textBody,
                    fontWeight: 500,
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Botones de acción */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopiar}
              sx={{
                background: vigiaColors.gradientIA,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'none',
                borderRadius: vigiaRadius.sm,
                py: 1.2,
                boxShadow: vigiaShadows.sm,
                '&:hover': { background: vigiaColors.gradientIA, boxShadow: vigiaShadows.md },
              }}
            >
              {copiado ? '✓ Copiado' : 'Copiar Código'}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ShareIcon />}
              onClick={handleCompartir}
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'none',
                borderRadius: vigiaRadius.sm,
                borderColor: 'rgba(13, 92, 207, 0.2)',
                color: vigiaColors.primary,
                py: 1.2,
                '&:hover': {
                  borderColor: vigiaColors.primary,
                  backgroundColor: 'rgba(13, 92, 207, 0.04)',
                },
              }}
            >
              Compartir
            </Button>
          </Box>

          {/* Botón volver */}
          <Button
            fullWidth
            onClick={onClose}
            sx={{
              mt: 2,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.8rem',
              textTransform: 'none',
              color: vigiaColors.textSecondary,
            }}
          >
            Volver a mis pases
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
const PasesRapidosPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldReduceMotion = useReducedMotion();

  // Estado
  const [pases, setPases] = useState<PaseRapidoViewDto[]>(MOCK_PASES);
  const [filtroActivo, setFiltroActivo] = useState('TODOS');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formState, setFormState] = useState(INITIAL_FORM);
  const [solapamientoError, setSolapamientoError] = useState<string | null>(null);
  const [paseGenerado, setPaseGenerado] = useState<PaseRapidoViewDto | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Filtrado
  const pasesFiltrados = pases.filter((p) => {
    if (filtroActivo === 'TODOS') return true;
    return p.estado === filtroActivo;
  });
  const pasesActivos = pases.filter((p) => p.estado === 'ACTIVO').length;

  // Handlers
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSolapamientoError(null);
    setFormState(INITIAL_FORM);
  };

  const handleCrearPase = () => {
    setSolapamientoError(null);
    if (!formState.conductor_nombre || !formState.conductor_cedula || !formState.vehiculo_placa || !formState.vigencia_inicio || !formState.vigencia_fin || !formState.motivo) {
      return;
    }
    const inicio = new Date(formState.vigencia_inicio).getTime();
    const fin = new Date(formState.vigencia_fin).getTime();
    if (fin <= inicio) {
      setSolapamientoError('La fecha/hora de fin debe ser posterior a la de inicio.');
      return;
    }
    const paseConflicto = pases.find(
      (p) =>
        p.vehiculo_placa === formState.vehiculo_placa &&
        p.estado === 'ACTIVO' &&
        new Date(p.vigencia_inicio).getTime() < fin &&
        new Date(p.vigencia_fin).getTime() > inicio
    );
    if (paseConflicto) {
      setSolapamientoError(
        `El vehículo ${formState.vehiculo_placa} ya tiene un pase activo (${paseConflicto.codigo}) en ese rango horario. Revoque el pase existente o elija otro horario.`
      );
      return;
    }
    const nuevoPase: PaseRapidoViewDto = {
      pase_id: `pase-${Date.now()}`,
      codigo: generarCodigo(),
      conductor_nombre: formState.conductor_nombre,
      conductor_cedula: formState.conductor_cedula,
      vehiculo_placa: formState.vehiculo_placa,
      vigencia_inicio: formState.vigencia_inicio,
      vigencia_fin: formState.vigencia_fin,
      motivo: formState.motivo,
      estado: 'ACTIVO',
    };
    setPases((prev) => [nuevoPase, ...prev]);
    setPaseGenerado(nuevoPase);
    handleCloseDialog();
  };

  const handleRevocar = (id: string) => {
    setPases((prev) => prev.map((p) => (p.pase_id === id ? { ...p, estado: 'REVOCADO' as const } : p)));
    setSnackbar({ open: true, message: 'Pase revocado exitosamente' });
  };

  // Si hay pase generado, mostrar CodigoGeneradoView
  if (paseGenerado) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Pase Generado">
        <Box sx={{ py: 2 }}>
          <CodigoGeneradoView pase={paseGenerado} onClose={() => setPaseGenerado(null)} />
        </Box>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Pases de Acceso Rápido">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>

        {/* Header */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 1.5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  color: vigiaColors.textHeading,
                }}
              >
                Pases de Acceso Rápido
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary, mt: 0.25 }}>
                {pasesActivos > 0 ? (
                  <>
                    <Box component="span" sx={{ fontWeight: 600, color: vigiaColors.success }}>{pasesActivos}</Box>
                    {` pase${pasesActivos > 1 ? 's' : ''} activo${pasesActivos > 1 ? 's' : ''} · ${pases.length} totales`}
                  </>
                ) : (
                  `${pases.length} pases registrados · Ninguno activo`
                )}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{
                background: vigiaColors.gradientIA,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'none',
                borderRadius: vigiaRadius.sm,
                px: 3,
                py: 1.2,
                boxShadow: vigiaShadows.sm,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: vigiaColors.gradientIA,
                  boxShadow: vigiaShadows.md,
                  transform: shouldReduceMotion ? 'none' : 'translateY(-1px)',
                },
              }}
            >
              Generar Pase
            </Button>
          </Box>
        </motion.div>

        {/* Card informativa */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Card
            sx={{
              backgroundColor: 'rgba(13,92,207,0.03)',
              border: '1px solid rgba(13,92,207,0.08)',
              borderRadius: vigiaRadius.md,
            }}
          >
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary }}>
                <strong style={{ color: vigiaColors.textHeading }}>¿Cómo funciona?</strong> Genere un código alfanumérico de un solo uso. El conductor lo dicta al guardia en el punto de acceso. El código es válido únicamente dentro de la ventana de tiempo definida.
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filtros */}
        <FilterChips options={FILTER_OPTIONS} activeKey={filtroActivo} onChange={setFiltroActivo} />

        {/* Lista de pases */}
        {pasesFiltrados.length === 0 ? (
          <EmptyState
            titulo="Sin pases"
            descripcion={
              filtroActivo === 'TODOS'
                ? 'No ha generado ningún pase de acceso rápido aún.'
                : `No hay pases con el filtro "${FILTER_OPTIONS.find((f) => f.key === filtroActivo)?.label}" aplicado.`
            }
            icono={<VpnKeyIcon sx={{ fontSize: 64, color: '#E0E3E8' }} />}
            accionLabel="Generar Pase"
            onAccion={() => setDialogOpen(true)}
          />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {pasesFiltrados.map((pase) => (
                <motion.div key={pase.pase_id} variants={staggerItem}>
                  <Card
                    sx={{
                      borderRadius: vigiaRadius.md,
                      boxShadow: vigiaShadows.sm,
                      borderLeft: `4px solid ${getBorderColor(pase.estado)}`,
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
                        {/* Código + datos */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                          {/* Código como badge protagonista */}
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.75,
                              borderRadius: vigiaRadius.sm,
                              backgroundColor: pase.estado === 'ACTIVO' ? 'rgba(13, 92, 207, 0.06)' : 'rgba(10, 47, 134, 0.03)',
                              border: pase.estado === 'ACTIVO'
                                ? '1px solid rgba(13, 92, 207, 0.15)'
                                : '1px solid rgba(10, 47, 134, 0.06)',
                              flexShrink: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: '"Fira Code", "JetBrains Mono", "Courier New", monospace',
                                fontWeight: 700,
                                fontSize: '1rem',
                                color: pase.estado === 'ACTIVO' ? vigiaColors.textHeading : vigiaColors.textTertiary,
                                letterSpacing: '1px',
                              }}
                            >
                              {pase.codigo}
                            </Typography>
                          </Box>
                          {/* Datos */}
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontFamily: '"Inter", sans-serif',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: vigiaColors.textBody,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {pase.conductor_nombre}
                            </Typography>
                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary }}>
                              {pase.vehiculo_placa} · {pase.motivo}
                            </Typography>
                            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.7rem', color: vigiaColors.textTertiary, mt: 0.25 }}>
                              {new Date(pase.vigencia_inicio).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}
                              {' → '}
                              {new Date(pase.vigencia_fin).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Estado + acción */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
                          <StatusChip estado={pase.estado} />
                          {pase.estado === 'ACTIVO' && (
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRevocar(pase.pase_id)}
                              sx={{ fontSize: '0.75rem', textTransform: 'none', minWidth: 'auto' }}
                            >
                              Revocar
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        )}
      </Box>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DIALOG: Generar nuevo pase                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: vigiaColors.textHeading }}>
          Generar Pase de Acceso Rápido
        </DialogTitle>
        {solapamientoError && (
          <Alert severity="error" sx={{ mx: 3, mt: 1 }} onClose={() => setSolapamientoError(null)}>
            {solapamientoError}
          </Alert>
        )}
        <DialogContent>
          <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, mb: 2 }}>
            Genere un código alfanumérico de un solo uso para autorizar el acceso temporal de un conductor.
          </Typography>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre del Conductor"
                required
                fullWidth
                value={formState.conductor_nombre}
                onChange={(e) => setFormState((p) => ({ ...p, conductor_nombre: e.target.value }))}
                placeholder="Ej: Jorge Mendoza"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cédula"
                required
                fullWidth
                value={formState.conductor_cedula}
                onChange={(e) => setFormState((p) => ({ ...p, conductor_cedula: e.target.value }))}
                placeholder="Ej: 1723456789"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Vehículo"
                required
                fullWidth
                value={formState.vehiculo_placa}
                onChange={(e) => setFormState((p) => ({ ...p, vehiculo_placa: e.target.value }))}
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
                value={formState.motivo}
                onChange={(e) => setFormState((p) => ({ ...p, motivo: e.target.value }))}
                placeholder="Ej: Entrega de materiales"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Inicio"
                type="datetime-local"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formState.vigencia_inicio}
                onChange={(e) => setFormState((p) => ({ ...p, vigencia_inicio: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fin"
                type="datetime-local"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formState.vigencia_fin}
                onChange={(e) => setFormState((p) => ({ ...p, vigencia_fin: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: vigiaColors.textSecondary }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCrearPase}
            sx={{
              background: vigiaColors.gradientIA,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: vigiaRadius.sm,
              boxShadow: vigiaShadows.sm,
              '&:hover': { background: vigiaColors.gradientIA, boxShadow: vigiaShadows.md },
            }}
          >
            Generar Pase
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardTemplate>
  );
};

export { PasesRapidosPage };
export default PasesRapidosPage;