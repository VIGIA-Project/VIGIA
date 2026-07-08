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

interface Autorizacion {
  id: number;
  persona: string;
  vehiculo: string;
  tipo: 'Permanente' | 'Temporal';
  estado: 'ACTIVA' | 'INACTIVA' | 'REVOCADO' | 'EXPIRADO';
  motivo: string;
  actor: string;
  fecha: string;
}

const rows: Autorizacion[] = [
  { id: 1, persona: 'María Fernanda López', vehiculo: 'ABC-0123', tipo: 'Permanente', estado: 'ACTIVA', motivo: 'Docente con vehículo propio', actor: 'admin', fecha: '2022-03-15' },
  { id: 2, persona: 'Carlos Andrés Mendoza', vehiculo: 'PBC-1231', tipo: 'Permanente', estado: 'ACTIVA', motivo: 'Estudiante con permiso especial', actor: 'admin', fecha: '2023-01-10' },
  { id: 3, persona: 'Diego Fernando Ramírez', vehiculo: 'GTR-8832', tipo: 'Permanente', estado: 'REVOCADO', motivo: 'Revocada por cambio de rol', actor: 'admin', fecha: '2024-06-01' },
  { id: 4, persona: 'Patricia Salazar Naranjo', vehiculo: 'XYZ-4567', tipo: 'Permanente', estado: 'ACTIVA', motivo: 'Administrativo con vehículo institucional', actor: 'admin', fecha: '2023-08-20' },
  { id: 5, persona: 'Jorge Luis Velasteguí', vehiculo: 'MNL-7788', tipo: 'Permanente', estado: 'INACTIVA', motivo: 'Inactiva por inactividad prolongada', actor: 'admin', fecha: '2024-01-15' },
  { id: 6, persona: 'Ana Lucía Paredes', vehiculo: 'UCE-0001', tipo: 'Permanente', estado: 'EXPIRADO', motivo: 'Expirada por fin de relación institucional', actor: 'admin', fecha: '2024-07-30' },
];

const personas = ['María Fernanda López', 'Carlos Andrés Mendoza', 'Patricia Salazar Naranjo'];
const vehiculos = ['ABC-0123', 'PBC-1231', 'GTR-8832', 'XYZ-4567'];

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
          { label: 'Activas', value: '421', color: '#5B9C5F' },
          { label: 'Revocadas', value: '38', color: '#C0524A' },
          { label: 'Inactivas', value: '12', color: '#9E9E9E' },
          { label: 'Expiradas', value: '7', color: '#E0A82E' },
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
        rows={rows}
        searchPlaceholder="Buscar por persona, vehículo o motivo..."
        searchKeys={(r) => `${r.persona} ${r.vehiculo} ${r.motivo}`}
      />
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Autorización Permanente</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Autocomplete options={personas} renderInput={(p) => <TextField {...p} label="Persona" required />} />
            <Autocomplete options={vehiculos} renderInput={(p) => <TextField {...p} label="Vehículo" required />} />
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
