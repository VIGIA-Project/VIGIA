import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { accessControlService } from '../../../services/access-control.service';
import { alertingService } from '../../../services/alerting.service';

interface HistorialItem {
  id: string;
  tipo: 'ACCESO' | 'ALERTA';
  fechaOriginal: Date;
  fecha: string;
  referencia: string; // Placa para accesos, Causa para alertas
  detalle: string; // Persona para accesos, Mensaje para alertas
  estado: string; // SUCCESSFUL/DENIED para accesos, ALTA/MEDIA para alertas
  actor: string; // Actor para accesos, Estado de atención para alertas
}

const columns: Column<HistorialItem>[] = [
  { id: 'fecha', label: 'Fecha', render: (r) => <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{r.fecha}</Typography> },
  { 
    id: 'tipo', 
    label: 'Tipo', 
    render: (r) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {r.tipo === 'ACCESO' ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main' }} /> : <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />}
        <Typography variant="caption" sx={{ fontWeight: 700 }}>{r.tipo}</Typography>
      </Box>
    ) 
  },
  { id: 'referencia', label: 'Referencia / Placa', render: (r) => <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{r.referencia}</Typography> },
  { id: 'detalle', label: 'Detalle / Persona', render: (r) => <Typography variant="body2">{r.detalle}</Typography> },
  { 
    id: 'estado', 
    label: 'Estado / Decisión', 
    render: (r) => (
      r.tipo === 'ACCESO' 
        ? <StatusChip kind="decision" value={r.estado as any} />
        : <StatusChip kind="severity" value={r.estado as any} />
    ) 
  },
  { id: 'actor', label: 'Origen / Actor', render: (r) => <Typography variant="caption" color="text.secondary">{r.actor}</Typography> },
];

export default function HistorialEventos() {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        setLoading(true);
        const [eventosRes, alertasRes] = await Promise.all([
          accessControlService.obtenerEventosRecientes(50).catch(() => []),
          alertingService.obtenerAlertasRecientes(50).catch(() => [])
        ]);

        const eventosMap: HistorialItem[] = eventosRes.map((e: any) => ({
          id: `evt-${e.eventoId || e.id}`,
          tipo: 'ACCESO',
          fechaOriginal: new Date(e.timestamp || e.createdAt),
          fecha: new Date(e.timestamp || e.createdAt).toLocaleString(),
          referencia: e.vehiculoId || 'Desconocida',
          detalle: e.personaId || 'Desconocido',
          estado: e.decisionId ? 'SUCCESSFUL' : 'PENDING_VERIFY',
          actor: e.actorId || 'Sistema VIGIA',
        }));

        const alertasMap: HistorialItem[] = alertasRes.map((a: any) => ({
          id: `alt-${a.alertaId || a.id}`,
          tipo: 'ALERTA',
          fechaOriginal: new Date(a.generadaEn || a.createdAt || a.fechaCreacion),
          fecha: new Date(a.generadaEn || a.createdAt || a.fechaCreacion).toLocaleString(),
          referencia: a.causaOrigen || 'Sistema',
          detalle: a.mensajeResumen || a.descripcion || 'Sin descripción',
          estado: a.severidad,
          actor: a.estadoAtencion || a.estado || 'GENERADA',
        }));

        const combined = [...eventosMap, ...alertasMap].sort((a, b) => b.fechaOriginal.getTime() - a.fechaOriginal.getTime());
        setItems(combined);
      } catch (err) {
        console.error("Error fetching historial", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  const stats = {
    totales: items.length,
    accesos: items.filter(e => e.tipo === 'ACCESO').length,
    alertas: items.filter(e => e.tipo === 'ALERTA').length,
    alertasAltas: items.filter(e => e.tipo === 'ALERTA' && e.estado === 'ALTA').length,
  };

  return (
    <Box>
      <PageHeader
        title="Historial General"
        subtitle="Auditoría completa de eventos de acceso y alertas del sistema VIGIA"
        breadcrumbs={[{ label: 'Auditoría' }, { label: 'Historial General' }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Registros Totales', value: stats.totales.toString(), color: '#0D5CCF' },
          { label: 'Eventos de Acceso', value: stats.accesos.toString(), color: '#5B9C5F' },
          { label: 'Alertas Generadas', value: stats.alertas.toString(), color: '#E0A82E' },
          { label: 'Alertas de Riesgo', value: stats.alertasAltas.toString(), color: '#C0524A' },
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
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          searchPlaceholder="Buscar por placa, referencia, detalle o estado..."
          searchKeys={(r) => `${r.referencia} ${r.detalle} ${r.estado} ${r.actor}`}
          onRowClick={(row) => navigate(row.tipo === 'ALERTA' ? `/admin/alerting/alertas/${row.id.replace('alt-', '')}` : `/admin/auditoria/eventos/${row.id.replace('evt-', '')}`)}
        />
      )}
    </Box>
  );
}
