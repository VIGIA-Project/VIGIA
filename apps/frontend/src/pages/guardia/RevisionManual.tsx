import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { StatusChip, EmptyState } from '../../components/atoms';
import { useEventosRecientes, useRegistrarEventoManual } from '../../hooks/useGuard';
import { TipoMovimiento } from '../../services/types/guard.types';
import { vigiaColors } from '../../theme/vigia-theme';

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

  const contexto = useMemo(
      () => (eventosRecientes.data ?? []).filter((e) => e.placaObservada === placaBuscada),
      [eventosRecientes.data, placaBuscada]
  );

  const handleBuscar = () => setPlacaBuscada(placaInput.trim().toUpperCase());

  const cerrarModal = () => {
    setModal(null);
    setConductorNombre('');
    setConductorCedula('');
    setDestino('');
    setDuracion(60);
  };

  const confirmarAprobar = () => {
    registrar.mutate(
        {
          placaObservada: placaBuscada,
          tipoMovimiento,
          decisionOperativa: 'SUCCESSFUL',
          motivoCodigo: motivoAprobar,
        },
        {
          onSuccess: async () => {
            setSnackbar({ open: true, message: `Acceso aprobado para ${placaBuscada}.`, severity: 'success' });
            cerrarModal();
            // Forzamos el refresco inmediato para que aparezca en el contexto la decisión en tiempo real
            await eventosRecientes.refetch();
          },
          onError: () => setSnackbar({ open: true, message: 'No se pudo registrar la aprobación.', severity: 'error' }),
        }
    );
  };

  const confirmarDenegar = () => {
    registrar.mutate(
        {
          placaObservada: placaBuscada,
          tipoMovimiento,
          decisionOperativa: 'DENIED',
          motivoCodigo: motivoDenegar,
        },
        {
          onSuccess: async () => {
            setSnackbar({ open: true, message: `Acceso denegado para ${placaBuscada}.`, severity: 'success' });
            cerrarModal();
            // Forzamos el refresco inmediato de los eventos procesados
            await eventosRecientes.refetch();
          },
          onError: () => setSnackbar({ open: true, message: 'No se pudo registrar la denegación.', severity: 'error' }),
        }
    );
  };

  const confirmarContingencia = () => {
    registrar.mutate(
        {
          placaObservada: placaBuscada,
          tipoMovimiento: 'ENTRADA',
          decisionOperativa: 'SUCCESSFUL',
          motivoCodigo: 'CONTINGENCIA',
          motivoDetalle: `Conductor: ${conductorNombre} (CI: ${conductorCedula}) — Destino: ${destino}`,
          duracionAutorizadaMin: duracion,
        },
        {
          onSuccess: async () => {
            setSnackbar({ open: true, message: `Contingencia registrada para ${placaBuscada}.`, severity: 'success' });
            cerrarModal();
            // Refrescamos de inmediato las queries afectadas para pintar el nuevo estado reactivamente
            await eventosRecientes.refetch();
          },
          onError: () => setSnackbar({ open: true, message: 'No se pudo registrar la contingencia.', severity: 'error' }),
        }
    );
  };

  const puedeAccionar = placaBuscada.trim().length > 0;
  const esSalida = tipoMovimiento === 'SALIDA';
  const labelAprobar = esSalida ? 'Autorizar bajo responsabilidad' : 'Aprobar';

  return (
      <DashboardTemplate rol="GUARD" pageTitle="Revisión manual">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, color: vigiaColors.textHeading }}>
            Revisión manual
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Busca una placa, revisa su contexto y resuelve el evento de acceso.
          </Typography>
        </Box>

        <Card sx={{ mb: 2.5 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                  label="Placa del vehículo"
                  value={placaInput}
                  onChange={(e) => setPlacaInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                  size="small"
                  sx={{ minWidth: 220 }}
              />
              <Button variant="contained" startIcon={<SearchIcon />} onClick={handleBuscar} disabled={!placaInput.trim()}>
                Buscar
              </Button>
              <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={tipoMovimiento}
                  onChange={(_, val) => val && setTipoMovimiento(val)}
              >
                <ToggleButton value="ENTRADA">Entrada</ToggleButton>
                <ToggleButton value="SALIDA">Salida</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </CardContent>
        </Card>

        {placaBuscada && (
            <Card sx={{ mb: 2.5 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: vigiaColors.textHeading }}>
                  Contexto de {placaBuscada}
                </Typography>
                {eventosRecientes.isLoading ? (
                    <Typography variant="body2" color="text.secondary">Cargando contexto...</Typography>
                ) : contexto.length === 0 ? (
                    <EmptyState titulo="Sin eventos previos" descripcion="Esta placa no tiene eventos recientes registrados." />
                ) : (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Movimiento</TableCell>
                          <TableCell>Decisión</TableCell>
                          <TableCell>Motivo</TableCell>
                          <TableCell>Hora</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contexto.map((e) => (
                            <TableRow key={e.eventoAccesoId}>
                              <TableCell>{e.tipoMovimiento}</TableCell>
                              <TableCell><StatusChip estado={e.decisionOperativa} /></TableCell>
                              <TableCell>{e.motivoCodigo ?? '—'}</TableCell>
                              <TableCell>{new Date(e.capturadoEn).toLocaleString('es-EC')}</TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                )}
              </CardContent>
            </Card>
        )}

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: esSalida ? 1 : 2, color: vigiaColors.textHeading }}>
              Decisión del guardia
            </Typography>
            {esSalida && (
                <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: vigiaColors.error,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                    }}
                >
                  ⚠️ Salida del campus: confirme que el conductor está autorizado antes de aprobar. Ante la duda, deniegue.
                </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {esSalida ? (
                  <>
                    <Button
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<HighlightOffIcon />}
                        disabled={!puedeAccionar}
                        onClick={() => setModal('DENEGAR')}
                        sx={{ fontWeight: 700, px: 3 }}
                    >
                      Denegar salida
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<CheckCircleOutlineIcon />}
                        disabled={!puedeAccionar}
                        onClick={() => setModal('APROBAR')}
                    >
                      {labelAprobar}
                    </Button>
                  </>
              ) : (
                  <>
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
                  </>
              )}
              <Button
                  variant="contained"
                  sx={{ backgroundColor: vigiaColors.gold, color: vigiaColors.deep, '&:hover': { backgroundColor: vigiaColors.goldLight } }}
                  startIcon={<ReportProblemOutlinedIcon />}
                  disabled={!puedeAccionar}
                  onClick={() => setModal('CONTINGENCIA')}
              >
                Registrar Contingencia
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Dialog: Aprobar */}
        <Dialog open={modal === 'APROBAR'} onClose={cerrarModal} maxWidth="xs" fullWidth>
          <DialogTitle>{esSalida ? 'Confirmar autorización de salida' : 'Confirmar aprobación'}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              {esSalida ? (
                  <>
                    Está a punto de autorizar la <strong>salida</strong> de <strong>{placaBuscada}</strong> bajo su
                    responsabilidad. Verifique que el conductor está autorizado antes de continuar. Selecciona el motivo.
                  </>
              ) : (
                  <>Se aprobará el acceso de <strong>{placaBuscada}</strong> ({tipoMovimiento}). Selecciona el motivo.</>
              )}
            </DialogContentText>
            <RadioGroup value={motivoAprobar} onChange={(e) => setMotivoAprobar(e.target.value)}>
              {MOTIVOS_APROBAR.map((m) => (
                  <FormControlLabel key={m.value} value={m.value} control={<Radio />} label={m.label} />
              ))}
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={cerrarModal}>Cancelar</Button>
            <Button variant="contained" color="success" onClick={confirmarAprobar} disabled={registrar.isPending}>
              {esSalida ? 'Confirmar autorización' : 'Confirmar aprobación'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog: Denegar */}
        <Dialog open={modal === 'DENEGAR'} onClose={cerrarModal} maxWidth="xs" fullWidth>
          <DialogTitle>{esSalida ? 'Confirmar denegación de salida' : 'Confirmar denegación'}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Se denegará el acceso de <strong>{placaBuscada}</strong> ({tipoMovimiento}). Selecciona el motivo.
            </DialogContentText>
            <RadioGroup value={motivoDenegar} onChange={(e) => setMotivoDenegar(e.target.value)}>
              {MOTIVOS_DENEGAR.map((m) => (
                  <FormControlLabel key={m.value} value={m.value} control={<Radio />} label={m.label} />
              ))}
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={cerrarModal}>Cancelar</Button>
            <Button variant="contained" color="error" onClick={confirmarDenegar} disabled={registrar.isPending}>
              Confirmar denegación
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog: Contingencia */}
        <Dialog open={modal === 'CONTINGENCIA'} onClose={cerrarModal} maxWidth="xs" fullWidth>
          <DialogTitle>Registrar contingencia</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <DialogContentText>
              Registra el ingreso temporal de <strong>{placaBuscada}</strong> como contingencia.
            </DialogContentText>
            <TextField
                label="Nombre del conductor"
                value={conductorNombre}
                onChange={(e) => setConductorNombre(e.target.value)}
                fullWidth
            />
            <TextField
                label="Cédula"
                value={conductorCedula}
                onChange={(e) => setConductorCedula(e.target.value)}
                fullWidth
            />
            <TextField
                label="Motivo de visita o destino"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Duración autorizada</InputLabel>
              <Select
                  value={duracion}
                  label="Duración autorizada"
                  onChange={(e) => setDuracion(Number(e.target.value))}
              >
                {DURACIONES.map((d) => (
                    <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={cerrarModal}>Cancelar</Button>
            <Button
                variant="contained"
                sx={{ backgroundColor: vigiaColors.gold, color: vigiaColors.deep }}
                onClick={confirmarContingencia}
                disabled={registrar.isPending || !conductorNombre.trim() || !conductorCedula.trim()}
            >
              Confirmar contingencia
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </DashboardTemplate>
  );
}