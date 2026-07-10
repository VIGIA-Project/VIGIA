import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { authorizationService, AutorizacionPermanente } from '../../../services/authorization.service';
import { registryService, Persona, Vehiculo } from '../../../services/registry.service';

interface AutorizacionRow {
  id: string;
  persona: string;
  vehiculo: string;
  tipo: string;
  estado: string;
  motivo: string;
  actor: string;
  fecha: string;
}

const columns: Column<AutorizacionRow>[] = [
  { id: 'persona', label: 'Persona', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.persona}</Typography> },
  { id: 'vehiculo', label: 'Vehículo', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>{r.vehiculo}</Typography> },
  { id: 'tipo', label: 'Tipo', render: (r) => r.tipo },
  { id: 'estado', label: 'Estado', render: (r) => <StatusChip kind="autorizacion" value={r.estado} /> },
  { id: 'motivo', label: 'Motivo', render: (r) => <Typography variant="caption" color="text.secondary">{r.motivo}</Typography> },
  { id: 'actor', label: 'Actor', render: (r) => r.actor },
  { id: 'fecha', label: 'Fecha', render: (r) => new Date(r.fecha).toLocaleDateString() },
];

export default function AutorizacionesPermanentes() {
  const [createOpen, setCreateOpen] = useState(false);
  const [permanentes, setPermanentes] = useState<AutorizacionPermanente[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [permRes, persRes, vehRes] = await Promise.all([
          authorizationService.getTodasPermanentes(),
          registryService.getPersonas(),
          registryService.getVehiculos()
        ]);
        setPermanentes(permRes);
        setPersonas(persRes);
        setVehiculos(vehRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPersonaName = (id: string) => {
    const p = personas.find(p => p.id === id);
    return p ? `${p.nombres} ${p.apellidos}` : id;
  };

  const getVehiculoPlaca = (id: string) => {
    const v = vehiculos.find(v => v.id === id);
    return v ? v.placa : id;
  };

  const rows: AutorizacionRow[] = permanentes.map(p => ({
    id: p.id,
    persona: getPersonaName(p.personaId),
    vehiculo: getVehiculoPlaca(p.vehiculoId),
    tipo: p.tipo,
    estado: p.estado,
    motivo: p.relacion,
    actor: getPersonaName(p.propietarioId),
    fecha: p.fechaCreacion,
  }));

  const stats = {
    activas: permanentes.filter(p => p.estado === 'ACTIVA').length,
    revocadas: permanentes.filter(p => p.estado === 'REVOCADA').length,
    inactivas: permanentes.filter(p => p.estado === 'INACTIVA').length,
    expiradas: permanentes.filter(p => p.estado === 'EXPIRADA').length,
  };

  return (
    <Box>
      <PageHeader
        title="Autorizaciones Permanentes"
        subtitle="Gestión de autorizaciones permanentes de personas sobre vehículos"
        breadcrumbs={[{ label: 'Authorization' }, { label: 'Permanentes' }]}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>Nueva Autorización</Button>}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Activas', value: stats.activas, color: '#5B9C5F' },
          { label: 'Revocadas', value: stats.revocadas, color: '#C0524A' },
          { label: 'Inactivas', value: stats.inactivas, color: '#9E9E9E' },
          { label: 'Expiradas', value: stats.expiradas, color: '#E0A82E' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card><CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Buscar por persona, vehículo o motivo..."
          searchKeys={(r) => `${r.persona} ${r.vehiculo} ${r.motivo}`}
        />
      )}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Autorización Permanente</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Autocomplete 
              options={personas} 
              getOptionLabel={(p) => `${p.nombres} ${p.apellidos}`}
              renderInput={(p) => <TextField {...p} label="Persona" required />} 
            />
            <Autocomplete 
              options={vehiculos} 
              getOptionLabel={(v) => v.placa}
              renderInput={(p) => <TextField {...p} label="Vehículo" required />} 
            />
            <TextField label="Motivo" multiline rows={2} required />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCreateOpen(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" onClick={() => setCreateOpen(false)}>Crear Autorización</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
