import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { useQuery } from '@tanstack/react-query';
import { listarTodosVehiculos, listarTodasPersonas } from '../../../services/registry.service';
import { obtenerConjuntoAutorizado } from '../../../services/authorization.service';

export default function VistaPorVehiculo() {
  const [vehiculoId, setVehiculoId] = useState<string | null>(null);

  const { data: vehiculosData = [] } = useQuery({
    queryKey: ['vehiculosVista'],
    queryFn: listarTodosVehiculos,
  });

  const { data: personasData = [] } = useQuery({
    queryKey: ['personasVista'],
    queryFn: listarTodasPersonas,
  });

  const { data: conjuntoData, isLoading: loadingConjunto } = useQuery({
    queryKey: ['conjuntoAutorizado', vehiculoId],
    queryFn: () => obtenerConjuntoAutorizado(vehiculoId!),
    enabled: !!vehiculoId,
  });

  const vehiculoSeleccionado = vehiculosData.find(v => v.vehiculoId === vehiculoId);
  const propietario = personasData.find(p => p.personaId === vehiculoSeleccionado?.propietarioPersonaId);

  return (
    <Box>
      <PageHeader
        title="Vista por Vehículo"
        subtitle="Consulta contextual: ¿quién puede conducir un vehículo en este momento?"
        breadcrumbs={[{ label: 'Authorization' }, { label: 'Vista por Vehículo' }]}
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Seleccionar Vehículo</Typography>
          <Autocomplete
            options={vehiculosData}
            getOptionLabel={(v) => v.placa}
            value={vehiculosData.find(v => v.vehiculoId === vehiculoId) || null}
            onChange={(_, v) => setVehiculoId(v ? v.vehiculoId : null)}
            sx={{ maxWidth: 400 }}
            renderInput={(params) => <TextField {...params} label="Placa del vehículo" />}
          />
        </CardContent>
      </Card>
      {vehiculoId && vehiculoSeleccionado && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #19D6C4 0%, #0D5CCF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DirectionsCarIcon sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehiculoSeleccionado.placa}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo} · Propietario: {propietario?.nombreCompleto || 'Desconocido'}
                </Typography>
              </Box>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              Conductores autorizados actualmente
            </Typography>
            
            {loadingConjunto ? (
              <Typography variant="body2" color="text.secondary">Cargando conductores...</Typography>
            ) : !conjuntoData?.autorizados || conjuntoData.autorizados.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No hay conductores autorizados actualmente para este vehículo.</Typography>
            ) : (
              <List>
                {conjuntoData.autorizados.map((c, i) => {
                  const pData = personasData.find(p => p.personaId === c.personaId);
                  const nombre = pData ? pData.nombreCompleto : `Persona ${c.personaId.substring(0,6)}`;
                  const vigenciaTxt = c.vigenciaFin ? `Hasta ${new Date(c.vigenciaFin).toLocaleString()}` : 'Indefinida';
                  return (
                    <Box key={c.personaId + c.tipo}>
                      <ListItem sx={{ px: 0, gap: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            {nombre.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{nombre}</Typography>
                              <Chip label={c.tipo} size="small" variant="outlined" />
                              <StatusChip kind="autorizacion" value="ACTIVA" />
                            </Box>
                          }
                          secondary={<Typography variant="caption" color="text.secondary">{vigenciaTxt}</Typography>}
                        />
                      </ListItem>
                      {i < conjuntoData.autorizados.length - 1 && <Divider />}
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
