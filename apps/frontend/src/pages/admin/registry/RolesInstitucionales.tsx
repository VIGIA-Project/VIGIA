import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';

interface RolAsignacion {
  id: number;
  persona: string;
  rol: string;
  facultad: string;
  desde: string;
  hasta: string | null;
  vigente: boolean;
}

const rows: RolAsignacion[] = [
  { id: 1, persona: 'María Fernanda López', rol: 'Docente Tiempo Completo', facultad: 'Ingeniería', desde: '2021-09-15', hasta: null, vigente: true },
  { id: 2, persona: 'Carlos Andrés Mendoza', rol: 'Estudiante', facultad: 'Ingeniería', desde: '2022-03-01', hasta: null, vigente: true },
  { id: 3, persona: 'Patricia Salazar Naranjo', rol: 'Administrativo', facultad: 'Administración', desde: '2020-01-10', hasta: null, vigente: true },
  { id: 4, persona: 'Jorge Luis Velasteguí', rol: 'Docente Ocasional', facultad: 'Ingeniería', desde: '2019-03-01', hasta: '2021-09-14', vigente: false },
  { id: 5, persona: 'Ana Lucía Paredes', rol: 'Estudiante', facultad: 'Ciencias', desde: '2021-10-01', hasta: '2024-07-30', vigente: false },
  { id: 6, persona: 'Diego Fernando Ramírez', rol: 'Administrativo', facultad: 'Arquitectura', desde: '2023-02-01', hasta: null, vigente: true },
];

const columns: Column<RolAsignacion>[] = [
  { id: 'persona', label: 'Persona', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.persona}</Typography> },
  { id: 'rol', label: 'Rol', render: (r) => r.rol },
  { id: 'facultad', label: 'Facultad', render: (r) => r.facultad },
  { id: 'desde', label: 'Desde', render: (r) => r.desde },
  { id: 'hasta', label: 'Hasta', render: (r) => r.hasta ?? 'Actualidad' },
  { id: 'vigente', label: 'Estado', render: (r) => <Chip label={r.vigente ? 'Vigente' : 'Finalizado'} size="small" color={r.vigente ? 'success' : 'default'} /> },
];

export default function RolesInstitucionales() {
  return (
    <Box>
      <PageHeader
        title="Roles Institucionales"
        subtitle="Historial y vigencia de asignaciones de roles a personas"
        breadcrumbs={[{ label: 'Registry' }, { label: 'Roles Institucionales' }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Roles Vigentes', value: '1,248', color: '#5B9C5F' },
          { label: 'Asignaciones Históricas', value: '3,456', color: '#0D5CCF' },
          { label: 'Finalizadas este año', value: '87', color: '#E0A82E' },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{stat.label}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <DataTable
        columns={columns}
        rows={rows}
        searchPlaceholder="Buscar por persona, rol o facultad..."
        searchKeys={(r) => `${r.persona} ${r.rol} ${r.facultad}`}
      />
    </Box>
  );
}
