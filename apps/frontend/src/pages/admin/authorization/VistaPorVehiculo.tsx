import { useState, useEffect } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { registryService, Vehiculo, Persona } from '../../../services/registry.service';
import { authorizationService } from '../../../services/authorization.service';

interface Conductor {
  id: string;
  persona: string;
  tipo: 'Permanente' | 'Temporal';
  estado: string;
  vigencia: string;
}

export default function VistaPorVehiculo() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<Vehiculo | null>(null);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingAuths, setLoadingAuths] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoadingInitial(true);
        const [vehRes, persRes] = await Promise.all([
          registryService.getVehiculos().catch(() => []),
          registryService.getPersonas().catch(() => [])
        ]);
        setVehiculos(vehRes);
        setPersonas(persRes);
      } catch (err) {
        console.error("Error fetching vehicles/personas", err);
      } finally {
        setLoadingInitial(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!vehiculoSeleccionado) {
      setConductores([]);
      return;
    }
    const fetchAuths = async () => {
      try {
        setLoadingAuths(true);
        const auths = await authorizationService.getConjuntoAutorizado(vehiculoSeleccionado.vehiculoId);
        
        // Map the backend response to the Conductor interface
        // The backend response format for getConjuntoAutorizado is expected to be an array of objects
        // with properties describing the permission/authorization.
        const mappedAuths: Conductor[] = [];
        
        if (auths.propietario) {
           const p = personas.find(x => x.personaId === auths.propietario.personaId);
           mappedAuths.push({
             id: 'prop',
             persona: p ? `${p.nombres} ${p.apellidos}` : 'Propietario',
             tipo: 'Permanente',
             estado: 'ACTIVA',
             vigencia: 'Propietario'
           });
        }
        
        if (Array.isArray(auths.permanentes)) {
           auths.permanentes.forEach((auth: any) => {
             const p = personas.find(x => x.personaId === auth.personaId);
             mappedAuths.push({
               id: auth.id,
               persona: p ? `${p.nombres} ${p.apellidos}` : auth.personaId,
               tipo: 'Permanente',
               estado: auth.estado,
               vigencia: 'Indefinida'
             });
           });
        }

        if (Array.isArray(auths.temporales)) {
           auths.temporales.forEach((auth: any) => {
             const p = personas.find(x => x.personaId === auth.personaId);
             mappedAuths.push({
               id: auth.id,
               persona: p ? `${p.nombres} ${p.apellidos}` : auth.personaId,
               tipo: 'Temporal',
               estado: auth.estado,
               vigencia: `Hasta ${new Date(auth.vigencia?.fin || auth.fechaActualizacion).toLocaleString()}`
             });
           });
        }

        setConductores(mappedAuths);
      } catch (err) {
        console.error("Error fetching auths", err);
      } finally {
        setLoadingAuths(false);
      }
    };
    fetchAuths();
  }, [vehiculoSeleccionado, personas]);

  const propietarioName = vehiculoSeleccionado ? (() => {
    const p = personas.find(x => x.personaId === vehiculoSeleccionado.propietarioPersonaId);
    return p ? `${p.nombres} ${p.apellidos}` : 'Desconocido';
  })() : '';

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
          {loadingInitial ? (
             <CircularProgress />
          ) : (
            <Autocomplete
              options={vehiculos}
              getOptionLabel={(option) => `${option.placa} ${option.marca || ''} ${option.modelo || ''}`}
              value={vehiculoSeleccionado}
              onChange={(_, v) => setVehiculoSeleccionado(v)}
              sx={{ maxWidth: 400 }}
              renderInput={(params) => <TextField {...params} label="Placa del vehículo" />}
            />
          )}
        </CardContent>
      </Card>
      {vehiculoSeleccionado && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2, background: 'linear-gradient(135deg, #19D6C4 0%, #0D5CCF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DirectionsCarIcon sx={{ color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{vehiculoSeleccionado.placa}</Typography>
                <Typography variant="caption" color="text.secondary">{vehiculoSeleccionado.marca || ''} {vehiculoSeleccionado.modelo || ''} · Propietario: {propietarioName}</Typography>
              </Box>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
              Conductores autorizados actualmente
            </Typography>
            {loadingAuths ? (
              <CircularProgress />
            ) : (
              <List>
                {conductores.length === 0 && <Typography color="text.secondary">No hay conductores autorizados</Typography>}
                {conductores.map((c, i) => (
                  <Box key={c.id}>
                    <ListItem sx={{ px: 0, gap: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: c.estado === 'ACTIVA' ? 'success.main' : 'grey.400' }}>
                          {c.persona.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.persona}</Typography>
                            <Chip label={c.tipo} size="small" variant="outlined" />
                            <StatusChip kind="autorizacion" value={c.estado} />
                          </Box>
                        }
                        secondary={<Typography variant="caption" color="text.secondary">{c.vigencia}</Typography>}
                      />
                    </ListItem>
                    {i < conductores.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
