import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import {
  useAsignacionesAdmin,
  useCrearAsignacionRolAdmin,
  useDesactivarAsignacionRolAdmin,
  usePersonasAdmin,
  useVehiculosAdmin,
} from '../../../hooks/useAdmin';
import { Persona, RolAsignacion, Vehiculo } from '../../../services/types/registry.types';

const ROL_OPTIONS: RolAsignacion[] = ['PROPIETARIO', 'FAMILIAR_AUTORIZADO', 'CONDUCTOR_PERMANENTE', 'PERSONA_AUTORIZADA'];

interface AsignacionRow {
  id: string;
  persona: string;
  vehiculo: string;
  rol: RolAsignacion;
  desde: string;
  hasta: string | null;
  vigente: boolean;
}

export default function RolesInstitucionales() {
  const asignacionesQuery = useAsignacionesAdmin();
  const personasQuery = usePersonasAdmin();
  const vehiculosQuery = useVehiculosAdmin();
  const crearMutation = useCrearAsignacionRolAdmin();
  const desactivarMutation = useDesactivarAsignacionRolAdmin();

  const [createOpen, setCreateOpen] = useState(false);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [rol, setRol] = useState<RolAsignacion>('PERSONA_AUTORIZADA');
  const [vigenteHasta, setVigenteHasta] = useState('');
  const [error, setError] = useState<string | null>(null);

  const personasById = useMemo(() => {
    const map = new Map<string, string>();
    (personasQuery.data ?? []).forEach((p) => map.set(p.personaId, p.nombreCompleto));
    return map;
  }, [personasQuery.data]);

  const vehiculosById = useMemo(() => {
    const map = new Map<string, string>();
    (vehiculosQuery.data ?? []).forEach((v) => map.set(v.vehiculoId, v.placa));
    return map;
  }, [vehiculosQuery.data]);

  const rows: AsignacionRow[] = useMemo(
    () =>
      (asignacionesQuery.data ?? []).map((a) => ({
        id: a.asignacionRolId,
        persona: personasById.get(a.personaId) ?? a.personaId,
        vehiculo: vehiculosById.get(a.vehiculoId) ?? a.vehiculoId,
        rol: a.rol,
        desde: new Date(a.vigenteDesde).toLocaleDateString('es-EC'),
        hasta: a.vigenteHasta ? new Date(a.vigenteHasta).toLocaleDateString('es-EC') : null,
        vigente: a.estadoAsignacion === 'ACTIVA',
      })),
    [asignacionesQuery.data, personasById, vehiculosById]
  );

  const stats = useMemo(
    () => ({
      vigentes: rows.filter((r) => r.vigente).length,
      total: rows.length,
      finalizadas: rows.filter((r) => !r.vigente).length,
    }),
    [rows]
  );

  const columns: Column<AsignacionRow>[] = [
    { id: 'persona', label: 'Persona', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.persona}</Typography> },
    { id: 'vehiculo', label: 'Vehículo', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>{r.vehiculo}</Typography> },
    { id: 'rol', label: 'Rol', render: (r) => r.rol },
    { id: 'desde', label: 'Desde', render: (r) => r.desde },
    { id: 'hasta', label: 'Hasta', render: (r) => r.hasta ?? 'Indefinida' },
    { id: 'vigente', label: 'Estado', render: (r) => <Chip label={r.vigente ? 'Vigente' : 'Finalizado'} size="small" color={r.vigente ? 'success' : 'default'} /> },
  ];

  const handleCrear = async () => {
    setError(null);
    if (!persona || !vehiculo) {
      setError('Selecciona persona y vehículo.');
      return;
    }
    try {
      await crearMutation.mutateAsync({
        personaId: persona.personaId,
        vehiculoId: vehiculo.vehiculoId,
        rol,
        vigenteHasta: vigenteHasta || undefined,
      });
      setCreateOpen(false);
      setPersona(null);
      setVehiculo(null);
      setRol('PERSONA_AUTORIZADA');
      setVigenteHasta('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo crear la asignación.');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Roles Institucionales"
        subtitle="Asignaciones de rol de personas sobre vehículos"
        breadcrumbs={[{ label: 'Registry' }, { label: 'Roles Institucionales' }]}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>Nueva Asignación</Button>}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Vigentes', value: stats.vigentes, color: '#5B9C5F' },
          { label: 'Total de Asignaciones', value: stats.total, color: '#0D5CCF' },
          { label: 'Finalizadas', value: stats.finalizadas, color: '#E0A82E' },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{stat.label}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                  {asignacionesQuery.isLoading ? <CircularProgress size={22} /> : stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {asignacionesQuery.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : asignacionesQuery.isError ? (
        <Typography color="error">No se pudieron cargar las asignaciones de rol.</Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Buscar por persona, vehículo o rol..."
          searchKeys={(r) => `${r.persona} ${r.vehiculo} ${r.rol}`}
          rowActions={(row) =>
            row.vigente
              ? [
                  {
                    icon: <BlockIcon fontSize="small" />,
                    label: 'Desactivar',
                    color: 'error' as const,
                    onClick: () => {
                      if (confirm(`¿Desactivar la asignación de ${row.persona} sobre ${row.vehiculo}?`)) {
                        desactivarMutation.mutate(row.id);
                      }
                    },
                  },
                ]
              : []
          }
        />
      )}

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Asignación de Rol</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <Autocomplete
              options={personasQuery.data ?? []}
              loading={personasQuery.isLoading}
              getOptionLabel={(p) => `${p.nombreCompleto} · ${p.identificacionNumero}`}
              isOptionEqualToValue={(a, b) => a.personaId === b.personaId}
              value={persona}
              onChange={(_e, val) => setPersona(val)}
              renderInput={(p) => <TextField {...p} label="Persona" required />}
            />
            <Autocomplete
              options={vehiculosQuery.data ?? []}
              loading={vehiculosQuery.isLoading}
              getOptionLabel={(v) => v.placa}
              isOptionEqualToValue={(a, b) => a.vehiculoId === b.vehiculoId}
              value={vehiculo}
              onChange={(_e, val) => setVehiculo(val)}
              renderInput={(p) => <TextField {...p} label="Vehículo" required />}
            />
            <TextField select label="Rol" value={rol} onChange={(e) => setRol(e.target.value as RolAsignacion)}>
              {ROL_OPTIONS.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Vigente hasta (opcional)"
              type="date"
              value={vigenteHasta}
              onChange={(e) => setVigenteHasta(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setCreateOpen(false)} color="inherit">Cancelar</Button>
          <Button variant="contained" onClick={handleCrear} disabled={crearMutation.isPending}>
            {crearMutation.isPending ? 'Creando...' : 'Crear Asignación'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
