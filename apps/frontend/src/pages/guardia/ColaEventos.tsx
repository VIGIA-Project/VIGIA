import { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { StatusChip, EmptyState, LoadingSkeleton } from '../../components/atoms';
import { useEventosRecientes } from '../../hooks/useGuard';
import { DecisionOperativa, TipoMovimiento } from '../../services/types/guard.types';
import { vigiaColors } from '../../theme/vigia-theme';

type FiltroMovimiento = TipoMovimiento | 'TODOS';
type FiltroDecision = DecisionOperativa | 'TODOS';

const selectedToggleSx = (color: string) => ({
  '&.Mui-selected': {
    backgroundColor: color,
    color: '#fff',
    '&:hover': { backgroundColor: color, filter: 'brightness(0.92)' },
  },
});

export default function ColaEventosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const filtroMovInicial = (location.state as { filtroMov?: FiltroMovimiento } | null)?.filtroMov ?? 'TODOS';

  const [filtroMov, setFiltroMov] = useState<FiltroMovimiento>(filtroMovInicial);
  const [filtroDec, setFiltroDec] = useState<FiltroDecision>('TODOS');

  // Ajuste: Activamos polling cada 5 segundos para mantener la cola sincronizada con la garita
  const { data: eventos, isLoading, isError } = useEventosRecientes(20);

  const visibles = useMemo(() => {
    return (eventos ?? []).filter((e) => {
      if (filtroMov !== 'TODOS' && e.tipoMovimiento !== filtroMov) return false;
      if (filtroDec !== 'TODOS' && e.decisionOperativa !== filtroDec) return false;
      return true;
    });
  }, [eventos, filtroMov, filtroDec]);

  return (
      <DashboardTemplate rol="GUARD" pageTitle="Cola de eventos">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, color: vigiaColors.textHeading }}>
              Cola de eventos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitoreo en tiempo real. La lista se actualiza automáticamente.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<PersonAddAltIcon />}
              onClick={() => navigate('/guardia/contingencia')}
            >
              Registrar invitado
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/guardia/revision')}
            >
              Nueva revisión manual
            </Button>
          </Stack>
        </Box>

        <Card sx={{ mb: 2.5 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', minWidth: 90 }}>
                Movimiento
              </Typography>
              <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={filtroMov}
                  onChange={(_, val) => val && setFiltroMov(val)}
              >
                <ToggleButton value="TODOS" sx={selectedToggleSx(vigiaColors.primary)}>Todos</ToggleButton>
                <ToggleButton value="ENTRADA" sx={selectedToggleSx(vigiaColors.success)}>Entrada</ToggleButton>
                <ToggleButton value="SALIDA" sx={selectedToggleSx(vigiaColors.warning)}>Salida</ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', minWidth: 90 }}>
                Decisión
              </Typography>
              <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={filtroDec}
                  onChange={(_, val) => val && setFiltroDec(val)}
              >
                <ToggleButton value="TODOS" sx={selectedToggleSx(vigiaColors.primary)}>Todas</ToggleButton>
                <ToggleButton value="SUCCESSFUL" sx={selectedToggleSx(vigiaColors.success)}>Aprobado</ToggleButton>
                <ToggleButton value="PENDING_VERIFY" sx={selectedToggleSx(vigiaColors.warning)}>Pendiente</ToggleButton>
                <ToggleButton value="DENIED" sx={selectedToggleSx(vigiaColors.error)}>Denegado</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: vigiaColors.textHeading }}>
                Eventos
              </Typography>
              {!isLoading && !isError && (
                <Chip
                  size="small"
                  label={`${visibles.length} resultado${visibles.length === 1 ? '' : 's'}`}
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
            {isLoading ? (
                <LoadingSkeleton variant="table" rows={6} />
            ) : isError ? (
                <Typography color="error">No se pudo cargar la cola de eventos.</Typography>
            ) : visibles.length === 0 ? (
                <EmptyState titulo="Sin eventos" descripcion="No hay eventos que coincidan con los filtros seleccionados." />
            ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Placa</TableCell>
                        <TableCell>Movimiento</TableCell>
                        <TableCell>Decisión</TableCell>
                        <TableCell>Hora</TableCell>
                        <TableCell>Origen</TableCell>
                        <TableCell align="right" />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {visibles.map((evento) => (
                          <TableRow
                              key={evento.eventoAccesoId}
                              hover
                              onClick={() => navigate('/guardia/revision', { state: { placa: evento.placaObservada } })}
                              sx={{
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                '&:hover': { backgroundColor: '#F8FAFC' }
                              }}
                          >
                            <TableCell>
                              <Typography sx={{ fontWeight: 700, color: vigiaColors.textHeading }}>
                                {evento.placaObservada}
                              </Typography>
                            </TableCell>
                            <TableCell>{evento.tipoMovimiento}</TableCell>
                            <TableCell>
                              <StatusChip estado={evento.decisionOperativa} />
                            </TableCell>
                            <TableCell>{new Date(evento.capturadoEn).toLocaleTimeString('es-EC')}</TableCell>
                            <TableCell>{evento.origenResolucion}</TableCell>
                            <TableCell align="right">
                              <ArrowForwardIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                            </TableCell>
                          </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            )}
          </CardContent>
        </Card>
      </DashboardTemplate>
  );
}
