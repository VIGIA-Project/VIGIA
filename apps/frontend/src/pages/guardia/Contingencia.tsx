import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useInvitadosActivos, useRegistrarEventoManual } from '../../hooks/useGuard';
import { vigiaColors } from '../../theme/vigia-theme';

// Constantes de contingencia técnica
const CAUSAS = ['BIOMETRIA_NO_DISPONIBLE', 'CAMARA_NO_DISPONIBLE', 'OCR_NO_DISPONIBLE', 'CAIDA_RED', 'OPERACION_MANUAL'];
const CAUSA_DESC: Record<string, string> = {
  BIOMETRIA_NO_DISPONIBLE: 'Servicio biométrico caído o sin respuesta.',
  CAMARA_NO_DISPONIBLE: 'Cámara de garita sin señal o dañada.',
  OCR_NO_DISPONIBLE: 'Servicio de lectura de placas no responde.',
  CAIDA_RED: 'Pérdida de conectividad en el punto.',
  OPERACION_MANUAL: 'Decisión tomada sin evidencia automática.',
};

// Helper para formatear tiempo relativo
const tiempoRelativo = (iso?: string) => {
  if (!iso) return '';
  const minutos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutos < 1) return 'ahora';
  if (minutos < 60) return `hace ${minutos} min`;
  return `hace ${Math.round(minutos / 60)} h`;
};

// Helper para parsear motivoDetalle estructurado
const parseMotivoDetalle = (detalle: string) => {
  if (!detalle) return { nombre: 'Invitado', cedula: 'N/A', motivo: 'N/A' };
  // Formato esperado: "CONTINGENCY_ENTRY - Nombre: X, Cédula: Y, Motivo: Z"
  const regex = /Nombre:\s*([^,]+),\s*Cédula:\s*([^,]+),\s*Motivo:\s*(.+)/i;
  const match = detalle.match(regex);
  if (match) {
    return {
      nombre: match[1].trim(),
      cedula: match[2].trim(),
      motivo: match[3].trim(),
    };
  }
  return {
    nombre: 'Invitado',
    cedula: 'N/A',
    motivo: detalle,
  };
};

export const ContingenciaPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // --- ESTADOS PESTAÑA 1: CONTINGENCIA TÉCNICA ---
  const [causa, setCausa] = useState('BIOMETRIA_NO_DISPONIBLE');
  const [decision, setDecision] = useState<'AUTORIZAR' | 'DENEGAR' | null>(null);
  const [detalle, setDetalle] = useState('');
  const [registradoTecnica, setRegistradoTecnica] = useState(false);
  const [errorTecnica, setErrorTecnica] = useState('');

  // --- ESTADOS PESTAÑA 2: REGISTRO DE INVITADOS ---
  const [placa, setPlaca] = useState('');
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [motivo, setMotivo] = useState('');
  const [duracion, setDuracion] = useState(60);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const invitadosQuery = useInvitadosActivos();
  const registrarEventoMutation = useRegistrarEventoManual();

  // Registrar contingencia técnica
  const handleRegistrarTecnica = () => {
    if (!decision) {
      setErrorTecnica('Selecciona una decisión operativa.');
      return;
    }
    if (detalle.trim().length < 10) {
      setErrorTecnica('Explique la situación detalladamente (mínimo 10 caracteres).');
      return;
    }
    setErrorTecnica('');
    setRegistradoTecnica(true);
  };

  // Registrar Entrada de Invitado
  const handleRegistrarInvitado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa || !nombre || !cedula || !motivo) {
      setSnackbarMsg('Por favor complete todos los campos obligatorios.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      await registrarEventoMutation.mutateAsync({
        placaObservada: placa.toUpperCase().trim(),
        tipoMovimiento: 'ENTRADA',
        decisionOperativa: 'SUCCESSFUL',
        motivoCodigo: 'CONTINGENCIA',
        motivoDetalle: `CONTINGENCY_ENTRY - Nombre: ${nombre.trim()}, Cédula: ${cedula.trim()}, Motivo: ${motivo.trim()}`,
        duracionAutorizadaMin: Number(duracion),
      });

      setSnackbarMsg('Registro de Invitado (CONTINGENCY_ENTRY) creado exitosamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Limpiar formulario
      setPlaca('');
      setNombre('');
      setCedula('');
      setMotivo('');
      setDuracion(60);
    } catch (err: any) {
      setSnackbarMsg(err.message || 'Error al registrar el ingreso del invitado.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Registrar Salida Manual de Invitado
  const handleSalidaManual = async (placaActiva: string) => {
    try {
      await registrarEventoMutation.mutateAsync({
        placaObservada: placaActiva,
        tipoMovimiento: 'SALIDA',
        decisionOperativa: 'SUCCESSFUL',
        motivoCodigo: 'CONTINGENCIA',
        motivoDetalle: `CONTINGENCY_EXIT - Salida manual registrada por contingencia`,
      });

      setSnackbarMsg(`Salida registrada con éxito para el vehículo ${placaActiva}.`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMsg(err.message || 'Error al registrar la salida.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Contingencia y Operaciones Manuales">
      <Box sx={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Encabezado con botón de volver */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/guardia/cola')}
            sx={{
              borderColor: 'divider',
              color: vigiaColors.primary,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                borderColor: vigiaColors.primary,
                backgroundColor: 'rgba(13, 92, 207, 0.04)',
              },
            }}
          >
            Volver a la Cola
          </Button>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: vigiaColors.primary,
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                minWidth: 160,
                color: vigiaColors.textSecondary,
                '&.Mui-selected': {
                  color: vigiaColors.primary,
                },
              },
            }}
          >
            <Tab label="Fallas Técnicas (Garita)" />
            <Tab label="Registro de Invitados" />
          </Tabs>
        </Box>

        {/* ========================================================================= */}
        {/* PESTAÑA 0: CONTINGENCIA TÉCNICA (FALLAS DE GARITA)                         */}
        {/* ========================================================================= */}
        {activeTab === 0 && (
          <Box>
            {registradoTecnica ? (
              <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4, borderRadius: 3, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <CardContent sx={{ textAlign: 'center', p: 5 }}>
                  <Box sx={{ fontSize: 56, mb: 2 }}>✓</Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: vigiaColors.textHeading, mb: 1, fontFamily: '"Exo 2", sans-serif' }}>
                    Contingencia Registrada
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    La operación manual se grabó de manera irreversible para control operativo.
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Causa: <strong>{causa}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 4 }}>
                    Decisión:{' '}
                    <strong style={{ color: decision === 'AUTORIZAR' ? vigiaColors.success : vigiaColors.error }}>
                      {decision === 'AUTORIZAR' ? 'PASO AUTORIZADO' : 'PASO DENEGADO'}
                    </strong>
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      setRegistradoTecnica(false);
                      setDecision(null);
                      setDetalle('');
                    }}
                    sx={{
                      backgroundColor: vigiaColors.primary,
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.2,
                    }}
                  >
                    Registrar Otra Contingencia
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                    <Box sx={{ p: 2.5, backgroundColor: 'rgba(13, 92, 207, 0.02)', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: vigiaColors.textHeading, fontFamily: '"Exo 2", sans-serif' }}>
                        Registro de Contingencia en Garita
                      </Typography>
                      <Chip label="ONLINE" size="small" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                          ¿Qué causó la contingencia? <span style={{ color: vigiaColors.error }}>*</span>
                        </Typography>
                        <FormControl fullWidth>
                          <Select
                            value={causa}
                            onChange={(e) => setCausa(e.target.value)}
                            sx={{ borderRadius: 2 }}
                          >
                            {CAUSAS.map((c) => (
                              <MenuItem key={c} value={c}>
                                {c}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          {CAUSA_DESC[causa]}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5 }}>
                          ¿Cuál es la decisión operativa? <span style={{ color: vigiaColors.error }}>*</span>
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 6 }}>
                            <Button
                              fullWidth
                              variant={decision === 'AUTORIZAR' ? 'contained' : 'outlined'}
                              color="success"
                              onClick={() => setDecision('AUTORIZAR')}
                              sx={{
                                py: 1.8,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                border: '2px solid',
                                '&:hover': { border: '2px solid' },
                              }}
                            >
                              ✓ Autorizar Ingreso
                            </Button>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Button
                              fullWidth
                              variant={decision === 'DENEGAR' ? 'contained' : 'outlined'}
                              color="error"
                              onClick={() => setDecision('DENEGAR')}
                              sx={{
                                py: 1.8,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                border: '2px solid',
                                '&:hover': { border: '2px solid' },
                              }}
                            >
                              ✕ Denegar Ingreso
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                          Explicación detallada de la contingencia <span style={{ color: vigiaColors.error }}>*</span>
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={detalle}
                          onChange={(e) => setDetalle(e.target.value)}
                          placeholder="Escriba los motivos operativos por los cuales tomó esta decisión (mín. 10 caracteres)..."
                          slotProps={{
                            input: {
                              sx: { borderRadius: 2 },
                            },
                          }}
                        />
                      </Box>

                      {errorTecnica && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                          {errorTecnica}
                        </Alert>
                      )}

                      <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                        Esta contingencia quedará registrada a tu nombre con fecha/hora oficial. Es trazable e irrevocable.
                      </Alert>

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={() => navigate('/guardia/cola')}
                          sx={{ flex: 1, borderRadius: 2, textTransform: 'none', py: 1.2 }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleRegistrarTecnica}
                          sx={{
                            flex: 2,
                            borderRadius: 2,
                            textTransform: 'none',
                            py: 1.2,
                            backgroundColor: vigiaColors.primary,
                          }}
                        >
                          ✓ Registrar Contingencia
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: vigiaColors.textHeading }}>
                        Causas Operativas Válidas
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {CAUSAS.map((c) => (
                          <Box key={c} sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Chip
                              label={c}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                backgroundColor: causa === c ? 'rgba(13, 92, 207, 0.08)' : 'rgba(0,0,0,0.03)',
                                color: causa === c ? vigiaColors.primary : 'text.secondary',
                                mb: 0.5,
                              }}
                            />
                            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                              {CAUSA_DESC[c]}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 1: REGISTRO DE INVITADOS (INGRESO Y SALIDA MANUAL)                */}
        {/* ========================================================================= */}
        {activeTab === 1 && (
          <Grid container spacing={3}>
            {/* Formulario de Registro */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ p: 2.5, backgroundColor: 'rgba(13, 92, 207, 0.02)', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonAddIcon sx={{ color: vigiaColors.primary }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: vigiaColors.textHeading, fontFamily: '"Exo 2", sans-serif' }}>
                    Registro de Invitado (CONTINGENCY_ENTRY)
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <form onSubmit={handleRegistrarInvitado}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          required
                          label="Placa del Vehículo"
                          placeholder="ABC-1234"
                          value={placa}
                          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                          slotProps={{
                            input: {
                              sx: { borderRadius: 2, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 },
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          required
                          label="Nombre Completo del Invitado"
                          placeholder="Ej: Carlos Mendoza"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          slotProps={{
                            input: {
                              sx: { borderRadius: 2 },
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          required
                          label="Cédula / Identificación"
                          placeholder="Ej: 1722334455"
                          value={cedula}
                          onChange={(e) => setCedula(e.target.value)}
                          slotProps={{
                            input: {
                              sx: { borderRadius: 2 },
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          required
                          label="Motivo del Ingreso"
                          placeholder="Ej: Reunión en Rectorado / Proveedor"
                          value={motivo}
                          onChange={(e) => setMotivo(e.target.value)}
                          slotProps={{
                            input: {
                              sx: { borderRadius: 2 },
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth>
                          <InputLabel id="duracion-label">Tiempo Estimado Autorizado</InputLabel>
                          <Select
                            labelId="duracion-label"
                            label="Tiempo Estimado Autorizado"
                            value={duracion}
                            onChange={(e) => setDuracion(Number(e.target.value))}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value={15}>15 minutos</MenuItem>
                            <MenuItem value={30}>30 minutos</MenuItem>
                            <MenuItem value={60}>1 hora (60 min)</MenuItem>
                            <MenuItem value={120}>2 horas (120 min)</MenuItem>
                            <MenuItem value={180}>3 horas (180 min)</MenuItem>
                            <MenuItem value={240}>4 horas (240 min)</MenuItem>
                            <MenuItem value={480}>8 horas (480 min)</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={registrarEventoMutation.isPending}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: vigiaColors.primary,
                        textTransform: 'none',
                        fontWeight: 700,
                        '&:hover': {
                          backgroundColor: '#0a4cb0',
                        },
                      }}
                    >
                      {registrarEventoMutation.isPending ? (
                        <CircularProgress size={24} sx={{ color: '#fff' }} />
                      ) : (
                        '✓ Registrar Ingreso'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Grid>

            {/* Listado de Invitados Activos */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', minHeight: 460 }}>
                <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: vigiaColors.textHeading, fontFamily: '"Exo 2", sans-serif' }}>
                    Invitados Activos en el Campus
                  </Typography>
                  <Chip
                    label={`${invitadosQuery.data?.length ?? 0} activos`}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
                <CardContent sx={{ p: 0 }}>
                  {invitadosQuery.isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                      <CircularProgress />
                    </Box>
                  ) : invitadosQuery.isError ? (
                    <Box sx={{ p: 4 }}>
                      <Alert severity="error" sx={{ borderRadius: 2 }}>
                        No se pudo cargar la lista de invitados activos.
                      </Alert>
                    </Box>
                  ) : (invitadosQuery.data ?? []).length === 0 ? (
                    <Box sx={{ p: 6, textAlign: 'center' }}>
                      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                        Sin invitados registrados
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        No hay vehículos de invitados activos en el campus en este momento.
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 440 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, backgroundColor: '#FAFBFD' }}>Placa</TableCell>
                            <TableCell sx={{ fontWeight: 700, backgroundColor: '#FAFBFD' }}>Detalles del Invitado</TableCell>
                            <TableCell sx={{ fontWeight: 700, backgroundColor: '#FAFBFD' }}>Permanencia</TableCell>
                            <TableCell sx={{ fontWeight: 700, backgroundColor: '#FAFBFD', textAlign: 'center' }}>Acciones</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(invitadosQuery.data ?? []).map((invitado) => {
                            const parsed = parseMotivoDetalle(invitado.motivoDetalle);
                            const limite = invitado.duracionAutorizadaMin;
                            const excedido = invitado.estaExcedido;

                            return (
                              <TableRow
                                key={invitado.eventoId}
                                sx={{
                                  backgroundColor: excedido ? 'rgba(198, 40, 40, 0.03)' : 'inherit',
                                  '&:hover': {
                                    backgroundColor: excedido ? 'rgba(198, 40, 40, 0.05)' : 'rgba(0, 0, 0, 0.01)',
                                  },
                                }}
                              >
                                <TableCell>
                                  <Box
                                    sx={{
                                      fontFamily: '"Exo 2", sans-serif',
                                      fontSize: '0.9rem',
                                      fontWeight: 800,
                                      color: '#0A2F86',
                                      backgroundColor: '#EEF2FF',
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: 1.5,
                                      border: '1.5px solid #C7D2FE',
                                      display: 'inline-block',
                                      letterSpacing: 0.8,
                                    }}
                                  >
                                    {invitado.placaObservada}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                    {parsed.nombre}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    CI: {parsed.cedula}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                                    Motivo: {parsed.motivo}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Ingresó {tiempoRelativo(invitado.capturadoEn)}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    Límite: {limite ? `${limite} min` : 'Sin límite'}
                                  </Typography>
                                  {excedido && (
                                    <Chip
                                      icon={<WarningAmberIcon style={{ fontSize: 14 }} />}
                                      label="Tiempo Excedido"
                                      size="small"
                                      color="error"
                                      sx={{ mt: 0.5, height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                                    />
                                  )}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>
                                  <Tooltip title="Registrar Salida Manual (CONTINGENCY_EXIT)">
                                    <Button
                                      variant="outlined"
                                      color={excedido ? 'error' : 'primary'}
                                      size="small"
                                      startIcon={<ExitToAppIcon />}
                                      onClick={() => handleSalidaManual(invitado.placaObservada)}
                                      disabled={registrarEventoMutation.isPending}
                                      sx={{
                                        textTransform: 'none',
                                        borderRadius: 1.5,
                                        fontWeight: 600,
                                        px: 2,
                                      }}
                                    >
                                      Dar Salida
                                    </Button>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Snackbar para notificar operaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </DashboardTemplate>
  );
};

export default ContingenciaPage;
