import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { useQuery } from '@tanstack/react-query';
import { getAllEvents } from '../../../services/access-control.service';
import { listarTodasPersonas } from '../../../services/registry.service';

interface Evento {
  id: string;
  fecha: string;
  placa: string;
  decision: 'SUCCESSFUL' | 'PENDING_VERIFY' | 'DENIED';
  origen: 'AUTOMATICA' | 'MANUAL' | 'CONTINGENCIA';
  actor: string;
  persona: string;
}

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

  const { data: eventosRaw = [], isLoading: loadingEvents } = useQuery({
    queryKey: ['accessEventsAll'],
    queryFn: getAllEvents,
    refetchInterval: 5000,
  });

  const { data: personasData = [] } = useQuery({
    queryKey: ['personasHistorial'],
    queryFn: listarTodasPersonas,
  });

  const rows: Evento[] = eventosRaw.map(e => {
    let dec: 'SUCCESSFUL' | 'PENDING_VERIFY' | 'DENIED' = 'DENIED';
    if (e.decision === 'GRANTED') dec = 'SUCCESSFUL';
    if (e.decision === 'PENDING') dec = 'PENDING_VERIFY';

    const persona = personasData.find(p => p.personaId === e.ownerId);

    return {
      id: e.id,
      fecha: new Date(e.createdAt).toLocaleString(),
      placa: e.licensePlate || '---',
      decision: dec,
      origen: 'AUTOMATICA', 
      actor: 'Sistema VIGIA',
      persona: persona ? persona.nombreCompleto : (e.ownerId ? `ID: ${e.ownerId.substring(0,6)}` : 'Desconocido'),
    };
  });

  const totales = rows.length;
  const successful = rows.filter(r => r.decision === 'SUCCESSFUL').length;
  const pending = rows.filter(r => r.decision === 'PENDING_VERIFY').length;
  const denied = rows.filter(r => r.decision === 'DENIED').length;
  return (
    <Box>
      <PageHeader
        title="Historial de Eventos"
        subtitle="Auditoría completa de eventos de acceso al sistema VIGIA"
        breadcrumbs={[{ label: 'Auditoría' }, { label: 'Historial de Eventos' }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Eventos Totales', value: totales, color: '#0D5CCF' },
          { label: 'SUCCESSFUL', value: successful, color: '#5B9C5F' },
          { label: 'PENDING_VERIFY', value: pending, color: '#E0A82E' },
          { label: 'DENIED', value: denied, color: '#C0524A' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card><CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      
      {loadingEvents ? (
        <Typography>Cargando eventos...</Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Buscar por placa, persona o actor..."
          searchKeys={(r) => `${r.placa} ${r.persona} ${r.actor}`}
          onRowClick={(row) => navigate(`/admin/auditoria/eventos/${row.id}`)}
        />
      )}
    </Box>
  );
}
