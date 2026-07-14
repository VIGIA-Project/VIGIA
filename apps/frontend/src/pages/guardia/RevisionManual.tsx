import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEventosRecientes, useRegistrarEventoManual, useValidarPase } from '../../hooks/useGuard';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  InputAdornment,
  Stack,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { StatusChip, EmptyState } from '../../components/atoms';
import { TipoMovimiento, RegistrarEventoManualDto } from '../../services/types/guard.types';
import { vigiaColors } from '../../theme/vigia-theme';

const selectedToggleSx = (color: string) => ({
  '&.Mui-selected': {
    backgroundColor: color,
    color: '#fff',
    '&:hover': { backgroundColor: color, filter: 'brightness(0.92)' },
  },
});

type AccionModal = 'APROBAR' | 'DENEGAR' | 'CONTINGENCIA' | null;

const MOTIVOS_APROBAR = [
  { value: 'CONDUCTOR_AUTORIZADO', label: 'Conductor autorizado' },
  { value: 'PERMISO_TEMPORAL_VIGENTE', label: 'Permiso temporal vigente' },
  { value: 'PASE_VALIDADO', label: 'Pase validado' },
];

const MOTIVOS_DENEGAR = [
  { value: 'CONDUCTOR_NO_AUTORIZADO', label: 'Conductor no autorizado' },
  { value: 'VEHICULO_NO_REGISTRADO', label: 'Vehículo no registrado' },
  { value: 'HORARIO_NO_PERMITIDO', label: 'Horario no permitido' },
  { value: 'DOCUMENTO_INVALIDO', label: 'Documento inválido' },
];

const DURACIONES = [
  { value: 30, label: '30 minutos' },
  { value: 60, label: '1 hora' },
  { value: 120, label: '2 horas' },
  { value: 240, label: '4 horas' },
  { value: 480, label: '8 horas' },
];

export default function RevisionManualPage() {
  const location = useLocation();
  const placaInicial = (location.state as { placa?: string } | null)?.placa ?? '';

  const [placaInput, setPlacaInput] = useState(placaInicial);
  const [placaBuscada, setPlacaBuscada] = useState(placaInicial.toUpperCase());
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>('ENTRADA');

  // Pase de acceso
  const [paseCodigo, setPaseCodigo] = useState('');
  const [resultadoPase, setResultadoPase] = useState<{ valido: boolean; motivo?: string } | null>(null);

  // Modal de acción
  const [modal, setModal] = useState<AccionModal>(null);
  const [motivoAprobar, setMotivoAprobar] = useState(MOTIVOS_APROBAR[0].value);
  const [motivoDenegar, setMotivoDenegar] = useState(MOTIVOS_DENEGAR[0].value);
  const [conductorNombre, setConductorNombre] = useState('');
  const [conductorCedula, setConductorCedula] = useState('');
  const [destino, setDestino] = useState('');
  const [duracion, setDuracion] = useState(60);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const eventosRecientes = useEventosRecientes(20);
  const registrar = useRegistrarEventoManual();
  const validarPase = useValidarPase();

  const contexto = useMemo(
      () => (eventosRecientes.data ?? []).filter((e) => e.placaObservada === placaBuscada),
      [eventosRecientes.data, placaBuscada]
  );

  const puedeAccionar = placaBuscada.trim().length > 0;
  const esSalida = tipoMovimiento === 'SALIDA';
  const labelAprobar = esSalida ? 'Autorizar bajo responsabilidad' : 'Aprobar';

  const handleBuscar = () => {
    setPlacaBuscada(placaInput.trim().toUpperCase());
    setResultadoPase(null);
  };

  const handleValidarPase = () => {
    validarPase.mutate(
        { codigo: paseCodigo, placa: placaBuscada },
        {
          onSuccess: (data) => {
            setResultadoPase({ valido: data.valido, motivo: data.motivo });
            setSnackbar({
              open: true,
              message: data.valido ? 'Pase validado correctamente' : data.motivo || 'Pase no válido',
              severity: data.valido ? 'success' : 'error',
            });
            if (data.valido) {
              setMotivoAprobar('PASE_VALIDADO');
            }
          },
          onError: () => {
            setResultadoPase(null);
            setSnackbar({ open: true, message: 'Error al validar pase', severity: 'error' });
          },
        }
    );
  };

  const cerrarModal = () => {
    setModal(null);
    setConductorNombre('');
    setConductorCedula('');
    setDestino('');
    setDuracion(60);
  };

  const construirMotivoDetalle = () => {
    const partes: string[] = [];
    if (conductorNombre) partes.push(`Conductor: ${conductorNombre}${conductorCedula ? ` (${conductorCedula})` : ''}`);
    if (destino) partes.push(`Destino: ${destino}`);
    return partes.length > 0 ? partes.join('. ') : undefined;
  };

  const confirmarAprobar = () => {
    const dto: RegistrarEventoManualDto = {
      placaObservada: placaBuscada,
      tipoMovimiento,
      decisionOperativa: 'SUCCESSFUL',
      motivoCodigo: motivoAprobar,
      motivoDetalle: construirMotivoDetalle(),
    };
    registrar.mutate(
        dto,
        {
          onSuccess: () => {
            setSnackbar({ open: true, message: `Movimiento ${labelAprobar.toLowerCase()}`, severity: 'success' });
            cerrarModal();
            eventosRecientes.refetch?.();
          },
          onError: () => {
            setSnackbar({ open: true, message: 'Error al registrar la aprobación', severity: 'error' });
          },
        }
    );
  };

  const confirmarDenegar = () => {
    const dto: RegistrarEventoManualDto = {
      placaObservada: placaBuscada,
      tipoMovimiento,
      decisionOperativa: 'DENIED',
      motivoCodigo: motivoDenegar,
    };
    registrar.mutate(
        dto,
        {
          onSuccess: () => {
            setSnackbar({ open: true, message: 'Movimiento denegado', severity: 'success' });
            cerrarModal();
            eventosRecientes.refetch?.();
          },
          onError: () => {
            setSnackbar({ open: true, message: 'Error al registrar la denegación', severity: 'error' });
          },
        }
    );
  };

  const confirmarContingencia = () => {
    const dto: RegistrarEventoManualDto = {
      placaObservada: placaBuscada,
      tipoMovimiento,
      decisionOperativa: 'SUCCESSFUL',
      motivoCodigo: 'CONTINGENCIA',
      motivoDetalle: construirMotivoDetalle(),
      duracionAutorizadaMin: duracion,
    };
    registrar.mutate(
        dto,
        {
          onSuccess: () => {
            setSnackbar({ open: true, message: 'Registrado bajo contingencia', severity: 'success' });
            cerrarModal();
            eventosRecientes.refetch?.();
          },
          onError: () => {
            setSnackbar({ open: true, message: 'Error al registrar contingencia', severity: 'error' });
          },
        }
    );
  };

  return (
      <DashboardTemplate rol="GUARD" pageTitle="Revisión manual">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Revisión manual de acceso
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Busca una placa para consultar su historial, validar un pase o registrar una decisión manual.
          </Typography>
        </Box>

        {/* Búsqueda + tipo de movimiento */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
              <TextField
                  label="Placa"
                  value={placaInput}
                  onChange={(e) => setPlacaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                    ),
                  }}
                  size="small"
              />
              <Button variant="contained" onClick={handleBuscar} disabled={!placaInput.trim()}>
                Buscar
              </Button>

              <ToggleButtonGroup
                  value={tipoMovimiento}
                  exclusive
                  onChange={(_, val) => val && setTipoMovimiento(val)}
                  size="small"
              >
                <ToggleButton value="ENTRADA" sx={selectedToggleSx(vigiaColors.success)}>Entrada</ToggleButton>
                <ToggleButton value="SALIDA" sx={selectedToggleSx(vigiaColors.warning)}>Salida</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            {/* Validación de pase */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <TextField
                  label="Código de Pase"
                  value={paseCodigo}
                  onChange={(e) => {
                    setPaseCodigo(e.target.value);
                    setResultadoPase(null);
                  }}
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon />
                        </InputAdornment>
                    ),
                  }}
                  size="small"
              />
              <Button
                  variant="outlined"
                  onClick={handleValidarPase}
                  disabled={!paseCodigo || !puedeAccionar || validarPase.isPending}
              >
                {validarPase.isPending ? 'Validando...' : 'Validar'}
              </Button>

              {resultadoPase && (
                  <Chip
                      label={resultadoPase.valido ? 'Pase válido' : resultadoPase.motivo || 'Pase inválido'}
                      color={resultadoPase.valido ? 'success' : 'error'}
                      icon={resultadoPase.valido ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
                      size="small"
                  />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Acciones */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
              Acción sobre {placaBuscada || 'la placa buscada'}
            </Typography>
            {!puedeAccionar && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Busca una placa para habilitar las acciones de aprobar, denegar o registrar contingencia/invitado.
              </Typography>
            )}
            {puedeAccionar && <Box sx={{ mb: 1.5 }} />}
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleOutlineIcon />}
                  disabled={!puedeAccionar}
                  onClick={() => setModal('APROBAR')}
              >
                {labelAprobar}
              </Button>
              <Button
                  variant="contained"
                  color="error"
                  startIcon={<HighlightOffIcon />}
                  disabled={!puedeAccionar}
                  onClick={() => setModal('DENEGAR')}
              >
                Denegar
              </Button>
              <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<ReportProblemOutlinedIcon />}
                  disabled={!puedeAccionar}
                  onClick={() => setModal('CONTINGENCIA')}
              >
                Contingencia / Invitado
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Historial reciente de la placa */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Eventos recientes
            </Typography>
            {contexto.length === 0 ? (
                <EmptyState
                    titulo="Sin eventos recientes"
                    descripcion="No hay eventos registrados para esta placa."
                />
            ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha/Hora</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Resultado</TableCell>
                      <TableCell>Motivo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contexto.map((evento) => (
                        <TableRow key={evento.eventoAccesoId}>
                          <TableCell>{new Date(evento.capturadoEn).toLocaleString()}</TableCell>
                          <TableCell>{evento.tipoMovimiento}</TableCell>
                          <TableCell>
                            <StatusChip estado={evento.decisionOperativa} />
                          </TableCell>
                          <TableCell>{evento.motivoDetalle ?? evento.motivoCodigo}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>

        {/* Modal de acción */}
        <Dialog open={modal !== null} onClose={cerrarModal} fullWidth maxWidth="sm">
          <DialogTitle>
            {modal === 'APROBAR' && labelAprobar}
            {modal === 'DENEGAR' && 'Denegar acceso'}
            {modal === 'CONTINGENCIA' && 'Registrar bajo contingencia'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Placa: <strong>{placaBuscada}</strong> · Movimiento: <strong>{tipoMovimiento}</strong>
            </DialogContentText>

            {modal === 'APROBAR' && (
                <RadioGroup value={motivoAprobar} onChange={(e) => setMotivoAprobar(e.target.value)}>
                  {MOTIVOS_APROBAR.map((m) => (
                      <FormControlLabel key={m.value} value={m.value} control={<Radio />} label={m.label} />
                  ))}
                </RadioGroup>
            )}

            {modal === 'DENEGAR' && (
                <RadioGroup value={motivoDenegar} onChange={(e) => setMotivoDenegar(e.target.value)}>
                  {MOTIVOS_DENEGAR.map((m) => (
                      <FormControlLabel key={m.value} value={m.value} control={<Radio />} label={m.label} />
                  ))}
                </RadioGroup>
            )}

            {(modal === 'APROBAR' || modal === 'CONTINGENCIA') && (
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <TextField
                      label="Nombre del conductor"
                      value={conductorNombre}
                      onChange={(e) => setConductorNombre(e.target.value)}
                      fullWidth
                  />
                  <TextField
                      label="Cédula del conductor"
                      value={conductorCedula}
                      onChange={(e) => setConductorCedula(e.target.value)}
                      fullWidth
                  />
                  <TextField
                      label="Destino"
                      value={destino}
                      onChange={(e) => setDestino(e.target.value)}
                      fullWidth
                  />
                </Stack>
            )}

            {modal === 'CONTINGENCIA' && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="duracion-label">Duración</InputLabel>
                  <Select
                      labelId="duracion-label"
                      label="Duración"
                      value={duracion}
                      onChange={(e) => setDuracion(Number(e.target.value))}
                  >
                    {DURACIONES.map((d) => (
                        <MenuItem key={d.value} value={d.value}>
                          {d.label}
                        </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={cerrarModal}>Cancelar</Button>
            {modal === 'APROBAR' && (
                <Button variant="contained" color="success" onClick={confirmarAprobar} disabled={registrar.isPending}>
                  Confirmar
                </Button>
            )}
            {modal === 'DENEGAR' && (
                <Button variant="contained" color="error" onClick={confirmarDenegar} disabled={registrar.isPending}>
                  Confirmar
                </Button>
            )}
            {modal === 'CONTINGENCIA' && (
                <Button variant="contained" color="warning" onClick={confirmarContingencia} disabled={registrar.isPending}>
                  Confirmar
                </Button>
            )}
          </DialogActions>
        </Dialog>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </DashboardTemplate>
  );
}
