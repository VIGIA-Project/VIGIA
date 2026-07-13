import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Grid2 as Grid,
  Chip,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { StatusChip } from '../../components/atoms';
import { useEventosRecientes, useRegistrarEventoManual } from '../../hooks/useGuard';
import { TipoMovimiento } from '../../services/types/guard.types';

const CAUSAS = ['INGRESO_INVITADO', 'BIOMETRIA_NO_DISPONIBLE', 'CAMARA_NO_DISPONIBLE', 'OCR_NO_DISPONIBLE', 'CAIDA_RED', 'OPERACION_MANUAL'];
const CAUSA_DESC: Record<string, string> = {
  INGRESO_INVITADO: 'Ingreso de un invitado sin registro ni evidencia biométrica previa.',
  BIOMETRIA_NO_DISPONIBLE: 'Servicio biométrico caído o sin respuesta.',
  CAMARA_NO_DISPONIBLE: 'Cámara de garita sin señal o dañada.',
  OCR_NO_DISPONIBLE: 'Servicio de lectura de placas no responde.',
  CAIDA_RED: 'Pérdida de conectividad en el punto.',
  OPERACION_MANUAL: 'Decisión tomada sin evidencia automática.',
};

const DURACIONES = [
  { value: 30, label: '30 minutos' },
  { value: 60, label: '1 hora' },
  { value: 120, label: '2 horas' },
  { value: 240, label: '4 horas' },
  { value: 480, label: '8 horas' },
];

export function ContingenciaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const placaInicial = (location.state as { placa?: string } | null)?.placa ?? '';

  const [placa, setPlaca] = useState(placaInicial.toUpperCase());
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>('ENTRADA');
  const [causa, setCausa] = useState('');
  const [decision, setDecision] = useState<'AUTORIZAR' | 'DENEGAR' | null>(null);
  const [duracion, setDuracion] = useState(60);
  const [detalle, setDetalle] = useState('');
  const [validacion, setValidacion] = useState('');

  const eventosRecientes = useEventosRecientes(30);
  const registrar = useRegistrarEventoManual();

  const contexto = useMemo(
    () => (eventosRecientes.data ?? []).filter((e) => e.placaObservada === placa.trim().toUpperCase()).slice(0, 3),
    [eventosRecientes.data, placa]
  );

  const esValido = placa.trim().length >= 5 && causa !== '' && decision !== null && detalle.trim().length >= 10;

  const handleRegistrar = () => {
    if (placa.trim().length < 5) {
      setValidacion('La placa debe tener al menos 5 caracteres.');
      return;
    }
    if (!causa) {
      setValidacion('Selecciona qué ocurrió.');
      return;
    }
    if (!decision) {
      setValidacion('Selecciona una decisión.');
      return;
    }
    if (detalle.trim().length < 10) {
      setValidacion('Escribe al menos 10 caracteres explicando la situación.');
      return;
    }
    setValidacion('');

    registrar.mutate({
      placaObservada: placa.trim().toUpperCase(),
      tipoMovimiento,
      decisionOperativa: decision === 'AUTORIZAR' ? 'SUCCESSFUL' : 'DENIED',
      motivoCodigo: 'CONTINGENCIA',
      motivoDetalle: `${CAUSA_DESC[causa]} ${detalle.trim()}`.trim(),
      duracionAutorizadaMin: decision === 'AUTORIZAR' && tipoMovimiento === 'ENTRADA' ? duracion : undefined,
    });
  };

  if (registrar.isSuccess && registrar.data) {
    const evento = registrar.data;
    return (
      <DashboardTemplate rol="GUARD" pageTitle="Registro de contingencia">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Contingencia registrada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Placa: <strong>{evento.placaObservada}</strong> · Causa: <strong>{causa}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Decisión:{' '}
            <strong style={{ color: evento.decisionOperativa === 'SUCCESSFUL' ? '#2E7D32' : '#C62828' }}>
              {evento.decisionOperativa === 'SUCCESSFUL' ? 'AUTORIZADO' : 'DENEGADO'}
            </strong>
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={() => navigate('/guardia/cola')}>
              Ir a la cola de eventos
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                registrar.reset();
                setPlaca('');
                setDecision(null);
                setDetalle('');
              }}
            >
              Registrar otra
            </Button>
          </Stack>
        </Box>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Registro de contingencia">
      <Button
        size="small"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/guardia/cola')}
        sx={{ mb: 2 }}
      >
        Cola de eventos
      </Button>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700 }}>
          Registrar contingencia o invitado
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Usa este formulario cuando no haya evidencia automática (biometría/cámara caídas) o para registrar el
          ingreso de un invitado sin registro previo.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Vehículo
              </Typography>

              {registrar.isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  No se pudo registrar la contingencia. Intenta nuevamente.
                </Alert>
              )}
              {validacion && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {validacion}
                </Alert>
              )}

              <Stack spacing={2.5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Placa"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    fullWidth
                    required
                  />
                  <ToggleButtonGroup
                    value={tipoMovimiento}
                    exclusive
                    onChange={(_, val) => val && setTipoMovimiento(val)}
                    size="small"
                  >
                    <ToggleButton value="ENTRADA">Entrada</ToggleButton>
                    <ToggleButton value="SALIDA">Salida</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                {contexto.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Eventos recientes de esta placa
                    </Typography>
                    <Stack spacing={0.5}>
                      {contexto.map((e) => (
                        <Box key={e.eventoAccesoId} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 12 }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(e.capturadoEn).toLocaleString('es-EC')} · {e.tipoMovimiento}
                          </Typography>
                          <StatusChip estado={e.decisionOperativa} />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}

                <FormControl fullWidth required>
                  <InputLabel id="causa-label" shrink>¿Qué ocurrió?</InputLabel>
                  <Select
                    labelId="causa-label"
                    label="¿Qué ocurrió?"
                    displayEmpty
                    value={causa}
                    onChange={(e) => setCausa(e.target.value)}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <Typography color="text.secondary">Seleccionar</Typography>;
                      }
                      return selected as string;
                    }}
                  >
                    <MenuItem value="" disabled>
                      Seleccionar
                    </MenuItem>
                    {CAUSAS.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                  {causa && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.5 }}>
                      {CAUSA_DESC[causa]}
                    </Typography>
                  )}
                </FormControl>

                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    ¿Qué decidiste hacer?
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      variant={decision === 'AUTORIZAR' ? 'contained' : 'outlined'}
                      color="success"
                      onClick={() => setDecision('AUTORIZAR')}
                    >
                      ✓ Autorizar paso
                    </Button>
                    <Button
                      fullWidth
                      variant={decision === 'DENEGAR' ? 'contained' : 'outlined'}
                      color="error"
                      onClick={() => setDecision('DENEGAR')}
                    >
                      ✕ Denegar paso
                    </Button>
                  </Stack>
                </Box>

                {decision === 'AUTORIZAR' && tipoMovimiento === 'ENTRADA' && (
                  <FormControl fullWidth>
                    <InputLabel id="duracion-label">Duración autorizada de permanencia</InputLabel>
                    <Select
                      labelId="duracion-label"
                      label="Duración autorizada de permanencia"
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

                <TextField
                  label="Explica la situación"
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  multiline
                  rows={3}
                  required
                  helperText={`${detalle.length}/10 mínimo`}
                />

                <Alert severity="warning">
                  Esta contingencia quedará registrada con tu usuario y timestamp. Es trazable e irrevocable.
                </Alert>

                <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => navigate('/guardia/cola')}>
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleRegistrar}
                    disabled={!esValido || registrar.isPending}
                  >
                    {registrar.isPending ? 'Registrando...' : 'Registrar y cerrar evento'}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Causas válidas
              </Typography>
              <Stack spacing={1.5}>
                {CAUSAS.map((c) => (
                  <Box key={c} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Chip
                      label={c}
                      size="small"
                      color={causa === c ? 'primary' : 'default'}
                      sx={{ fontWeight: 700, fontSize: 10, flexShrink: 0 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {CAUSA_DESC[c]}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardTemplate>
  );
}

export default ContingenciaPage;
