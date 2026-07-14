import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import BlockIcon from "@mui/icons-material/Block";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import DataTable, { type Column } from "../../../components/admin-legacy/DataTable";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import ConfirmDialog from "../../../components/admin-legacy/ConfirmDialog";
import {
  usePermisosProximosAExpirar,
  useTemporalesCountAdmin,
  useBuscarVehiculoPorPlaca,
  usePermisosPorVehiculoAdmin,
  useRevocarPermisoTemporalAdmin,
} from "../../../hooks/useAdmin";
import { PermisoTemporal } from "../../../services/types/authorization.types";

interface Row extends PermisoTemporal {
  id: string;
}

export default function PermisosTemporal() {
  const [dias, setDias] = useState(7);
  const [placaBusqueda, setPlacaBusqueda] = useState("");
  const [placaConsultada, setPlacaConsultada] = useState<string | undefined>();
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({ open: false });

  const temporalesCount = useTemporalesCountAdmin();
  const proximosAExpirar = usePermisosProximosAExpirar(dias);
  const vehiculo = useBuscarVehiculoPorPlaca(placaConsultada);
  const permisosVehiculo = usePermisosPorVehiculoAdmin(vehiculo.data?.vehiculoId);
  const revocar = useRevocarPermisoTemporalAdmin();

  const columns: Column<Row>[] = [
    { id: "persona", label: "Persona", render: (r) => <Typography variant="body2">{r.conductorNombre ?? r.personaId.slice(0, 8)}</Typography> },
    { id: "vehiculo", label: "Vehículo", render: (r) => <Typography variant="body2">{r.vehiculoPlaca ?? r.vehiculoId.slice(0, 8)}</Typography> },
    {
      id: "vigencia",
      label: "Vigencia",
      render: (r) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(r.vigenciaInicio).toLocaleDateString("es-EC")} → {new Date(r.vigenciaFin).toLocaleDateString("es-EC")}
        </Typography>
      ),
    },
    { id: "estado", label: "Estado", render: (r) => <StatusChip kind="autorizacion" value={r.estado} /> },
    { id: "motivo", label: "Motivo", render: (r) => <Typography variant="caption" color="text.secondary">{r.motivo}</Typography> },
  ];

  const rowActions = (row: Row) =>
    row.estado === "ACTIVA"
      ? [{ icon: <BlockIcon fontSize="small" />, label: "Revocar", onClick: () => setConfirm({ open: true, id: row.id }), color: "error" as const }]
      : [];

  return (
    <Box>
      <PageHeader
        title="Permisos Temporales"
        subtitle="Los permisos temporales son gestionados por el Propietario; el Admin solo consulta o revoca por excepción auditada."
        breadcrumbs={[{ label: "Authorization" }, { label: "Temporales" }]}
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Permisos Activos</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#5B9C5F" }}>
                {temporalesCount.isLoading ? "-" : temporalesCount.isError ? "—" : temporalesCount.data}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Próximos a Expirar</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: "#E0A82E" }}>
                {proximosAExpirar.isLoading ? "-" : proximosAExpirar.isError ? "—" : proximosAExpirar.data?.length ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Próximos a expirar</Typography>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Ventana</InputLabel>
              <Select value={dias} label="Ventana" onChange={(e) => setDias(Number(e.target.value))}>
                <MenuItem value={1}>Próximas 24h</MenuItem>
                <MenuItem value={3}>Próximos 3 días</MenuItem>
                <MenuItem value={7}>Próximos 7 días</MenuItem>
                <MenuItem value={30}>Próximos 30 días</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {proximosAExpirar.isLoading ? (
            <Skeleton variant="rounded" height={200} />
          ) : proximosAExpirar.isError ? (
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => proximosAExpirar.refetch()}>Reintentar</Button>}>
              No se pudieron cargar los permisos próximos a expirar.
            </Alert>
          ) : (
            <DataTable
              columns={columns}
              rows={(proximosAExpirar.data ?? []).map((p) => ({ ...p, id: p.id }))}
              rowActions={rowActions}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Consultar permisos por vehículo</Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <TextField
              size="small"
              label="Placa del vehículo"
              value={placaBusqueda}
              onChange={(e) => setPlacaBusqueda(e.target.value.toUpperCase())}
              sx={{ minWidth: 220 }}
            />
            <Button variant="contained" startIcon={<SearchIcon />} onClick={() => setPlacaConsultada(placaBusqueda || undefined)}>
              Buscar
            </Button>
          </Box>

          {vehiculo.isError && placaConsultada && (
            <Alert severity="warning">No se encontró ningún vehículo con la placa "{placaConsultada}".</Alert>
          )}

          {vehiculo.data && (
            permisosVehiculo.isLoading ? (
              <Skeleton variant="rounded" height={160} />
            ) : permisosVehiculo.isError ? (
              <Alert severity="error">No se pudieron cargar los permisos de este vehículo.</Alert>
            ) : (permisosVehiculo.data?.length ?? 0) === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Este vehículo no tiene permisos temporales vigentes.
              </Typography>
            ) : (
              <DataTable
                columns={columns}
                rows={(permisosVehiculo.data ?? []).map((p) => ({ ...p, id: p.id }))}
                rowActions={rowActions}
              />
            )
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirm.open}
        title="Revocar permiso temporal"
        message="Esta acción revocará el permiso temporal de forma inmediata y quedará registrada en auditoría."
        destructive
        onConfirm={() => {
          if (confirm.id) revocar.mutate(confirm.id);
          setConfirm({ open: false });
        }}
        onClose={() => setConfirm({ open: false })}
      />
    </Box>
  );
}
