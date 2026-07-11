import { useState } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';

import { useQuery } from '@tanstack/react-query';
import { listarTodasPersonas, listarTodosVehiculos } from '../../../services/registry.service';
import { listarTodasPermanentes, crearAutorizacionPermanente, crearPermisoTemporal } from '../../../services/authorization.service';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

interface Autorizacion {
  id: string;
  persona: string;
  vehiculo: string;
  tipo: string;
  estado: string;
  motivo: string;
  actor: string;
  fecha: string;
}

const columns: Column<Autorizacion>[] = [
  { id: 'persona', label: 'Persona', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.persona}</Typography> },
  { id: 'vehiculo', label: 'Vehículo', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>{r.vehiculo}</Typography> },
  { id: 'tipo', label: 'Tipo', render: (r) => r.tipo },
  { id: 'estado', label: 'Estado', render: (r) => <StatusChip kind="autorizacion" value={r.estado} /> },
  { id: 'motivo', label: 'Motivo', render: (r) => <Typography variant="caption" color="text.secondary">{r.motivo}</Typography> },
  { id: 'actor', label: 'Actor', render: (r) => r.actor },
  { id: 'fecha', label: 'Fecha', render: (r) => r.fecha },
];

export default function AutorizacionesPermanentes() {
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ 
    tipo: 'Permanente' as 'Permanente' | 'Temporal',
    personaId: null as string | null, 
    vehiculoId: null as string | null, 
    relacion: '',
    motivo: '',
    vigenciaInicio: '',
    vigenciaFin: ''
  });

  const { data: authsData = [], refetch } = useQuery({
    queryKey: ['autorizacionesPermanentes'],
    queryFn: listarTodasPermanentes,
  });

  const { data: personasData = [] } = useQuery({
    queryKey: ['personas'],
    queryFn: listarTodasPersonas,
  });

  const { data: vehiculosData = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: listarTodosVehiculos,
  });

  const handleSubmit = async () => {
    if (!form.personaId || !form.vehiculoId) {
      alert("Persona y Vehículo son obligatorios");
      return;
    }
    try {
      if (form.tipo === 'Permanente') {
        if (!form.relacion) {
          alert("El motivo o relación es obligatorio");
          return;
        }
        await crearAutorizacionPermanente({
          personaId: form.personaId,
          vehiculoId: form.vehiculoId,
          relacion: form.relacion,
        });
        alert("Autorización permanente creada exitosamente");
      } else {
        if (!form.motivo || !form.vigenciaInicio || !form.vigenciaFin) {
          alert("Motivo y fechas son obligatorios para permisos temporales");
          return;
        }
        await crearPermisoTemporal({
          personaId: form.personaId,
          vehiculoId: form.vehiculoId,
          motivo: form.motivo,
          vigenciaInicio: new Date(form.vigenciaInicio).toISOString(),
          vigenciaFin: new Date(form.vigenciaFin).toISOString(),
        });
        alert("Permiso temporal creado exitosamente. Puede verlo en la pestaña de Permisos Temporales.");
      }
      refetch();
      setCreateOpen(false);
      setForm({ tipo: 'Permanente', personaId: null, vehiculoId: null, relacion: '', motivo: '', vigenciaInicio: '', vigenciaFin: '' });
    } catch (e) {
      console.error(e);
      alert("Error al crear autorización");
    }
  };

  const rowsData: Autorizacion[] = authsData.map((a) => {
    const p = personasData.find((per) => per.personaId === a.personaId);
    const v = vehiculosData.find((veh) => veh.vehiculoId === a.vehiculoId);
    return {
      id: a.id,
      persona: p ? p.nombreCompleto : a.personaId,
      vehiculo: v ? v.placa : a.vehiculoId,
      tipo: 'Permanente',
      estado: a.estado,
      motivo: a.relacion,
      actor: 'Sistema',
      fecha: new Date(a.fechaCreacion).toLocaleDateString(),
    };
  });

  const stats = {
    activas: authsData.filter(a => a.estado === 'ACTIVA').length,
    revocadas: authsData.filter(a => a.estado === 'REVOCADA').length,
    inactivas: authsData.filter(a => a.estado === 'INACTIVA').length,
    expiradas: authsData.filter(a => a.estado === 'EXPIRADA').length,
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
          { label: 'Activas', value: stats.activas.toString(), color: '#5B9C5F' },
          { label: 'Revocadas', value: stats.revocadas.toString(), color: '#C0524A' },
          { label: 'Inactivas', value: stats.inactivas.toString(), color: '#9E9E9E' },
          { label: 'Expiradas', value: stats.expiradas.toString(), color: '#E0A82E' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card><CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      <DataTable
        columns={columns}
        rows={rowsData}
        searchPlaceholder="Buscar por persona, vehículo o motivo..."
        searchKeys={(r) => `${r.persona} ${r.vehiculo} ${r.motivo}`}
      />
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Autorización Permanente</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Autorización</InputLabel>
              <Select
                value={form.tipo}
                label="Tipo de Autorización"
                onChange={(e) => setForm({ ...form, tipo: e.target.value as 'Permanente' | 'Temporal' })}
              >
                <MenuItem value="Permanente">Permanente</MenuItem>
                <MenuItem value="Temporal">Temporal</MenuItem>
              </Select>
            </FormControl>

            <Autocomplete 
              options={personasData} 
              getOptionLabel={(p) => p.nombreCompleto}
              onChange={(e, val) => setForm({ ...form, personaId: val ? val.personaId : null })}
              renderInput={(p) => <TextField {...p} label="Persona Autorizada" required />} 
            />
            <Autocomplete 
              options={vehiculosData} 
              getOptionLabel={(v) => v.placa}
              onChange={(e, val) => setForm({ ...form, vehiculoId: val ? val.vehiculoId : null })}
              renderInput={(p) => <TextField {...p} label="Vehículo (Placa)" required />} 
            />
            
            {form.tipo === 'Permanente' ? (
              <TextField 
                label="Motivo / Relación" 
                multiline rows={2} required 
                value={form.relacion}
                onChange={(e) => setForm({ ...form, relacion: e.target.value })}
              />
            ) : (
              <>
                <TextField 
                  label="Motivo del permiso" 
                  multiline rows={2} required 
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField 
                      label="Vigencia Inicio" 
                      type="datetime-local" 
                      fullWidth 
                      InputLabelProps={{ shrink: true }}
                      value={form.vigenciaInicio}
                      onChange={(e) => setForm({ ...form, vigenciaInicio: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField 
                      label="Vigencia Fin" 
                      type="datetime-local" 
                      fullWidth 
                      InputLabelProps={{ shrink: true }}
                      value={form.vigenciaFin}
                      onChange={(e) => setForm({ ...form, vigenciaFin: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCreateOpen(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>Crear Autorización</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
