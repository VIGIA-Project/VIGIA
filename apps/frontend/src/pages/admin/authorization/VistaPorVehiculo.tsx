import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { useBuscarVehiculoPorPlaca, useConjuntoAutorizadoAdmin, usePasesPorPlacaAdmin } from '../../../hooks/useAdmin';

export default function VistaPorVehiculo() {
  const [placaBusqueda, setPlacaBusqueda] = useState('');
  const [placaConsultada, setPlacaConsultada] = useState<string | undefined>();

  const vehiculo = useBuscarVehiculoPorPlaca(placaConsultada);
  const conjunto = useConjuntoAutorizadoAdmin(vehiculo.data?.vehiculoId);
  const pases = usePasesPorPlacaAdmin(placaConsultada);

  const miembrosGrupoFamiliar = (conjunto.data?.autorizados ?? []).filter((a) => a.tipo === 'PERMANENTE');
  const permisosTemporales = (conjunto.data?.autorizados ?? []).filter((a) => a.tipo === 'TEMPORAL');
  const pasesActivos = (pases.data ?? []).filter((p) => p.estado === 'ACTIVO');

  return (
    <Box>
      <PageHeader
        title="Vista por Vehículo"
        subtitle="Consulta contextual: ¿quién puede conducir un vehículo en este momento?"
        breadcrumbs={[{ label: 'Authorization' }, { label: 'Vista por Vehículo' }]}
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Buscar Vehículo</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Placa del vehículo"
              value={placaBusqueda}
              onChange={(e) => setPlacaBusqueda(e.target.value.toUpperCase())}
              sx={{ maxWidth: 300 }}
            />
            <Button variant="contained" startIcon={<SearchIcon />} onClick={() => setPlacaConsultada(placaBusqueda || undefined)}>
              Buscar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {vehiculo.isLoading && <Skeleton variant="rounded" height={280} />}

      {vehiculo.isError && placaConsultada && (
        <Alert severity="warning">No se encontró ningún vehículo con la placa "{placaConsultada}".</Alert>
      )}

      {vehiculo.data && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #19D6C4 0%, #0D5CCF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DirectionsCarIcon sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehiculo.data.placa}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {[vehiculo.data.marca, vehiculo.data.modelo].filter(Boolean).join(' ') || 'Sin marca/modelo registrado'} · Propietario {vehiculo.data.propietarioPersonaId.slice(0, 8)}
                </Typography>
              </Box>
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              Miembros del Grupo Familiar
            </Typography>
            {conjunto.isLoading ? (
              <Skeleton variant="rounded" height={80} sx={{ mb: 2 }} />
            ) : conjunto.isError ? (
              <Alert severity="error" sx={{ mb: 2 }}>No se pudo cargar el conjunto autorizado.</Alert>
            ) : miembrosGrupoFamiliar.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Sin miembros de grupo familiar autorizados.</Typography>
            ) : (
              <List sx={{ mb: 2 }}>
                {miembrosGrupoFamiliar.map((m, i) => (
                  <Box key={m.personaId}>
                    <ListItem sx={{ px: 0, gap: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>{m.personaId.charAt(0).toUpperCase()}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Persona {m.personaId.slice(0, 8)}</Typography>
                            <Chip label="Grupo Familiar" size="small" variant="outlined" />
                          </Box>
                        }
                        secondary="Acceso vigente a todos los vehículos activos del propietario"
                      />
                    </ListItem>
                    {i < miembrosGrupoFamiliar.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              Permisos Temporales Vigentes
            </Typography>
            {conjunto.isLoading ? (
              <Skeleton variant="rounded" height={80} sx={{ mb: 2 }} />
            ) : permisosTemporales.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Sin permisos temporales vigentes.</Typography>
            ) : (
              <List sx={{ mb: 2 }}>
                {permisosTemporales.map((m, i) => (
                  <Box key={m.personaId}>
                    <ListItem sx={{ px: 0, gap: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>{m.personaId.charAt(0).toUpperCase()}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Persona {m.personaId.slice(0, 8)}</Typography>
                            <Chip label="Temporal" size="small" variant="outlined" />
                          </Box>
                        }
                        secondary={m.vigenciaFin ? `Vigente hasta ${new Date(m.vigenciaFin).toLocaleString('es-EC')}` : undefined}
                      />
                    </ListItem>
                    {i < permisosTemporales.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              Pases Activos
            </Typography>
            {pases.isLoading ? (
              <Skeleton variant="rounded" height={80} />
            ) : pases.isError ? (
              <Alert severity="error">No se pudieron cargar los pases de esta placa.</Alert>
            ) : pasesActivos.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Sin pases activos para esta placa.</Typography>
            ) : (
              <List>
                {pasesActivos.map((p, i) => {
                  const nombreConductor = p.nombreVisitante || 'Conductor sin nombre';
                  return (
                    <Box key={p.id}>
                      <ListItem sx={{ px: 0, gap: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'info.main' }}>{nombreConductor.charAt(0).toUpperCase()}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{nombreConductor}</Typography>
                              <StatusChip kind="autorizacion" value={p.estado} />
                            </Box>
                          }
                          secondary={`Vigente hasta ${new Date(p.vigenciaFin).toLocaleString('es-EC')}`}
                        />
                      </ListItem>
                      {i < pasesActivos.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </List>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
