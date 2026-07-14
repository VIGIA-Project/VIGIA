import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import BlockIcon from '@mui/icons-material/Block';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { usePermanentesTodosAdmin, useRevocarAutorizacionPermanenteAdmin, usePersonasAdmin } from '../../../hooks/useAdmin';

interface AutorizacionRow {
  id: string;
  persona: string;
  propietario: string;
  relacion: string;
  estado: string;
  fecha: string;
}

export default function AutorizacionesPermanentes() {
  const permanentesQuery = usePermanentesTodosAdmin();
  const personasQuery = usePersonasAdmin();
  const revocarMutation = useRevocarAutorizacionPermanenteAdmin();

  const personasById = useMemo(() => {
    const map = new Map<string, string>();
    (personasQuery.data ?? []).forEach((p) => map.set(p.personaId, p.nombreCompleto));
    return map;
  }, [personasQuery.data]);

  const rows: AutorizacionRow[] = useMemo(
    () =>
      (permanentesQuery.data ?? []).map((a) => ({
        id: a.id,
        persona: personasById.get(a.personaId) ?? a.personaId,
        propietario: personasById.get(a.propietarioId) ?? a.propietarioId,
        relacion: a.relacion,
        estado: a.estado,
        fecha: new Date(a.fechaCreacion).toLocaleDateString('es-EC'),
      })),
    [permanentesQuery.data, personasById]
  );

  const stats = useMemo(
    () => ({
      activas: rows.filter((r) => r.estado === 'ACTIVA').length,
      revocadas: rows.filter((r) => r.estado === 'REVOCADA').length,
      inactivas: rows.filter((r) => r.estado === 'INACTIVA').length,
      expiradas: rows.filter((r) => r.estado === 'EXPIRADA').length,
    }),
    [rows]
  );

  const columns: Column<AutorizacionRow>[] = [
    { id: 'persona', label: 'Persona', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.persona}</Typography> },
    { id: 'propietario', label: 'Propietario', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>{r.propietario}</Typography> },
    { id: 'relacion', label: 'Relación', render: (r) => r.relacion },
    { id: 'estado', label: 'Estado', render: (r) => <StatusChip kind="autorizacion" value={r.estado} /> },
    { id: 'fecha', label: 'Fecha', render: (r) => r.fecha },
  ];

  return (
    <Box>
      <PageHeader
        title="Autorizaciones Permanentes"
        subtitle="Miembros del grupo familiar con acceso permanente a los vehículos de un propietario"
        breadcrumbs={[{ label: 'Authorization' }, { label: 'Permanentes' }]}
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
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>
                {permanentesQuery.isLoading ? <CircularProgress size={22} /> : s.value}
              </Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      {permanentesQuery.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : permanentesQuery.isError ? (
        <Typography color="error">No se pudieron cargar las autorizaciones permanentes.</Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Buscar por persona o propietario..."
          searchKeys={(r) => `${r.persona} ${r.propietario} ${r.relacion}`}
          rowActions={(row) =>
            row.estado === 'ACTIVA'
              ? [
                  {
                    icon: <BlockIcon fontSize="small" />,
                    label: 'Revocar',
                    color: 'error' as const,
                    onClick: () => {
                      if (confirm(`¿Revocar la autorización de ${row.persona}?`)) {
                        revocarMutation.mutate(row.id);
                      }
                    },
                  },
                ]
              : []
          }
        />
      )}
    </Box>
  );
}
