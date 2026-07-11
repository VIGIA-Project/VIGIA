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
import { authorizationService, listarActivosPorPlaca } from '../../../services/authorization.service';
import { accessControlService } from '../../../services/access-control.service';

interface Conductor {
  id: string;
  persona: string;
  tipo: 'Permanente' | 'Temporal';
  estado: string;
  vigencia: string;
  esPropietario?: boolean;
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
        const [auths, pasesRapidos, pasesGarita] = await Promise.all([
          authorizationService.getConjuntoAutorizado(vehiculoSeleccionado.vehiculoId).catch(() => ({ propietarioId: null, autorizados: [] })),
          listarActivosPorPlaca(vehiculoSeleccionado.placa).catch(() => []),
          accessControlService.listarPasesGarita().catch(() => [])
        ]);
        
        const mappedAuths: Conductor[] = [];
        
        // El propietario siempre es un conductor permanente
        if (auths.propietarioId) {
           const p = personas.find(x => x.personaId === auths.propietarioId);
           mappedAuths.push({
             id: 'prop',
             persona: p ? `${p.nombres} ${p.apellidos}` : 'Propietario',
             tipo: 'Permanente',
             estado: 'ACTIVA',
             vigencia: 'Propietario',
             esPropietario: true
           });
        }
        
        if (Array.isArray(auths.autorizados)) {
           auths.autorizados.forEach((auth: any) => {
             // Ignorar al propietario si viene en la lista de autorizados, ya lo agregamos
             if (auth.personaId === auths.propietarioId) return;

             const p = personas.find(x => x.personaId === auth.personaId);
             mappedAuths.push({
               id: auth.id || auth.personaId,
               persona: p ? `${p.nombres} ${p.apellidos}` : auth.personaId,
               tipo: auth.tipo === 'PERMANENTE' ? 'Permanente' : 'Temporal',
               estado: auth.estado || 'ACTIVA',
               vigencia: auth.tipo === 'PERMANENTE' 
                          ? 'Indefinida' 
                          : `Hasta ${new Date(auth.vigenciaFin || auth.fechaActualizacion || Date.now()).toLocaleString()}`,
               esPropietario: false
             });
           });
        }
        
        if (Array.isArray(pasesRapidos)) {
           pasesRapidos.forEach((pase: any) => {
             mappedAuths.push({
               id: pase.id,
               persona: pase.nombreVisitante,
               tipo: 'Temporal', // Pase Rápido
               estado: pase.estado === 'CONSUMIDO' ? 'EXPIRADA' : pase.estado,
               vigencia: `Pase Rápido - Hasta ${new Date(pase.vigenciaFin).toLocaleString()}`,
               esPropietario: false
             });
           });
        }
        
        if (Array.isArray(pasesGarita)) {
           pasesGarita.forEach((pase: any) => {
             // Filter locally since we don't have a by-plate endpoint for Garita passes
             if (pase.placaVehiculo === vehiculoSeleccionado.placa) {
               mappedAuths.push({
                 id: pase.id,
                 persona: pase.nombreVisitante,
                 tipo: 'Temporal', // Pase Garita
                 estado: pase.estado === 'FINALIZADO' ? 'EXPIRADA' : (pase.estado === 'ACTIVO' ? 'ACTIVA' : pase.estado),
                 vigencia: `Pase Garita - ${pase.duracionHoras}h`,
                 esPropietario: false
               });
             }
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
                        <Avatar sx={{ bgcolor: c.esPropietario ? 'primary.main' : (c.estado === 'ACTIVA' ? 'success.main' : 'grey.400') }}>
                          {c.persona.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.persona}</Typography>
                            {c.esPropietario && <Chip label="Dueño" size="small" color="primary" />}
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
