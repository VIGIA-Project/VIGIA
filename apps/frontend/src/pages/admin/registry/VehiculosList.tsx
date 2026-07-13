import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import { useVehiculosAdmin, usePersonasAdmin, useEliminarVehiculoAdmin } from "../../../hooks/useAdmin";
import { Vehiculo } from "../../../services/types/registry.types";

type VehiculoRow = Vehiculo & { id: string; propietario: string };

const columns: Column<VehiculoRow>[] = [
  {
    id: "placa",
    label: "Placa",
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DirectionsCarIcon sx={{ fontSize: 18, color: "primary.main" }} />
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          {row.placa}
        </Typography>
      </Box>
    ),
  },
  {
    id: "marca",
    label: "Marca / Modelo",
    render: (row) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {row.marca ?? "—"} {row.modelo ?? ""}
      </Typography>
    ),
  },
  { id: "anio", label: "Año", render: (row) => row.anio ?? "—" },
  { id: "color", label: "Color", render: (row) => row.color ?? "—" },
  {
    id: "propietario",
    label: "Propietario",
    render: (row) => (
      <Typography variant="body2">{row.propietario}</Typography>
    ),
  },
  {
    id: "estado",
    label: "Estado",
    render: (row) => <StatusChip kind="cuenta" value={row.estadoRegistro} />,
  },
];

export default function VehiculosList() {
  const navigate = useNavigate();
  const vehiculosQuery = useVehiculosAdmin();
  const personasQuery = usePersonasAdmin();
  const eliminarMutation = useEliminarVehiculoAdmin();

  const personasById = useMemo(() => {
    const map = new Map<string, string>();
    (personasQuery.data ?? []).forEach((p) => map.set(p.personaId, p.nombreCompleto));
    return map;
  }, [personasQuery.data]);

  const rows: VehiculoRow[] = useMemo(
    () =>
      (vehiculosQuery.data ?? []).map((v) => ({
        ...v,
        id: v.vehiculoId,
        propietario: personasById.get(v.propietarioPersonaId) ?? v.propietarioPersonaId,
      })),
    [vehiculosQuery.data, personasById]
  );

  const handleDelete = (row: VehiculoRow) => {
    if (confirm(`¿Eliminar el vehículo ${row.placa}? Esta acción no se puede deshacer.`)) {
      eliminarMutation.mutate(row.vehiculoId, {
        onSuccess: () => vehiculosQuery.refetch(),
        onError: () => alert('No se pudo eliminar el vehículo.'),
      });
    }
  };

  return (
    <Box>
      <PageHeader
        title="Vehículos"
        subtitle="Gestión de vehículos registrados en el sistema VIGIA"
        breadcrumbs={[{ label: "Registry" }, { label: "Vehículos" }]}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/registry/vehiculos/nuevo")}
          >
            Nuevo Vehículo
          </Button>
        }
      />
      {vehiculosQuery.isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : vehiculosQuery.isError ? (
        <Typography color="error">No se pudieron cargar los vehículos.</Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Buscar por placa, marca o propietario..."
          searchKeys={(r) => `${r.placa} ${r.marca ?? ""} ${r.modelo ?? ""} ${r.propietario}`}
          onRowClick={(row) => navigate(`/admin/registry/vehiculos/${row.id}`)}
          rowActions={(row) => [
            {
              icon: <VisibilityIcon fontSize="small" />,
              label: "Ver detalle",
              onClick: () => navigate(`/admin/registry/vehiculos/${row.id}`),
              color: "primary",
            },
            {
              icon: <EditIcon fontSize="small" />,
              label: "Editar",
              onClick: () =>
                navigate(`/admin/registry/vehiculos/${row.id}/editar`),
              color: "info",
            },
            {
              icon: <DeleteIcon fontSize="small" />,
              label: "Eliminar",
              onClick: () => handleDelete(row),
              color: "error",
            },
          ]}
        />
      )}
    </Box>
  );
}
