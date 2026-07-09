import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';

interface Evento {
  id: number;
  fecha: string;
  placa: string;
  decision: 'SUCCESSFUL' | 'PENDING_VERIFY' | 'DENIED';
  origen: 'AUTOMATICA' | 'MANUAL' | 'CONTINGENCIA';
  actor: string;
  persona: string;
}

const rows: Evento[] = [
  { id: 1, fecha: '2024-08-20 14:32', placa: 'PBC-1231', decision: 'DENIED', origen: 'AUTOMATICA', actor: 'Sistema VIGIA', persona: 'ID 4521' },
  { id: 2, fecha: '2024-08-20 14:28', placa: 'ABC-0123', decision: 'SUCCESSFUL', origen: 'AUTOMATICA', actor: 'Sistema VIGIA', persona: 'María Fernanda López' },
  { id: 3, fecha: '2024-08-20 14:15', placa: 'GTR-8832', decision: 'PENDING_VERIFY', origen: 'MANUAL', actor: 'jperez', persona: 'Diego Fernando Ramírez' },
  { id: 4, fecha: '2024-08-20 14:02', placa: 'XYZ-4567', decision: 'SUCCESSFUL', origen: 'AUTOMATICA', actor: 'Sistema VIGIA', persona: 'Patricia Salazar Naranjo' },
  { id: 5, fecha: '2024-08-20 13:48', placa: 'MNL-7788', decision: 'DENIED', origen: 'CONTINGENCIA', actor: 'jvelastegui', persona: 'Jorge Luis Velasteguí' },
  { id: 6, fecha: '2024-08-20 13:35', placa: 'UCE-0001', decision: 'SUCCESSFUL', origen: 'AUTOMATICA', actor: 'Sistema VIGIA', persona: 'Ana Lucía Paredes' },
  { id: 7, fecha: '2024-08-20 13:20', placa: 'TST-9921', decision: 'PENDING_VERIFY', origen: 'MANUAL', actor: 'cmendoza', persona: 'Sofía Elizabeth Cevallos' },
  { id: 8, fecha: '2024-08-20 13:05', placa: 'KJH-3344', decision: 'SUCCESSFUL', origen: 'AUTOMATICA', actor: 'Sistema VIGIA', persona: 'Manuel José Borrero' },
];

const columns: Column<Evento>[] = [
  { id: 'fecha', label: 'Fecha', render: (r) => <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{r.fecha}</Typography> },
  { id: 'placa', label: 'Placa', render: (r) => <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{r.placa}</Typography> },
  { id: 'persona', label: 'Persona', render: (r) => <Typography variant="body2">{r.persona}</Typography> },
  { id: 'decision', label: 'Decisión', render: (r) => <StatusChip kind="decision" value={r.decision} /> },
  { id: 'origen', label: 'Origen', render: (r) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.origen}</Typography> },
  { id: 'actor', label: 'Actor Decisor', render: (r) => <Typography variant="caption" color="text.secondary">{r.actor}</Typography> },
];

export default function HistorialEventos() {
  const navigate = useNavigate();
  return (
    <Box>
      <PageHeader
        title="Historial de Eventos"
        subtitle="Auditoría completa de eventos de acceso al sistema VIGIA"
        breadcrumbs={[{ label: 'Auditoría' }, { label: 'Historial de Eventos' }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Eventos Totales', value: '12,847', color: '#0D5CCF' },
          { label: 'SUCCESSFUL', value: '11,932', color: '#5B9C5F' },
          { label: 'PENDING_VERIFY', value: '421', color: '#E0A82E' },
          { label: 'DENIED', value: '494', color: '#C0524A' },
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
        searchPlaceholder="Buscar por placa, persona o actor..."
        searchKeys={(r) => `${r.placa} ${r.persona} ${r.actor}`}
        onRowClick={(row) => navigate(`/admin/auditoria/eventos/${row.id}`)}
      />
    </Box>
  );
}
