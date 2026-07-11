import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import { useQuery } from "@tanstack/react-query";
import { listarTodasPersonas, listarTodosVehiculos } from "../../../services/registry.service";

interface Vehiculo {
  id: string | number;
  placa: string;
  marca: string;
  modelo: string;
  anio: string | number;
  color: string;
  propietario?: string;
  estado: "ACTIVO" | "INACTIVO";
}

export default function VehiculosList() {
  const navigate = useNavigate();

  const { data: vehiculosData = [] } = useQuery({
    queryKey: ['vehiculosList'],
    queryFn: listarTodosVehiculos,
  });

  const { data: personasData = [] } = useQuery({
    queryKey: ['personasDirectorio'],
    queryFn: listarTodasPersonas,
  });

  const rows: Vehiculo[] = vehiculosData.map((v) => {
    const p = personasData.find(per => per.personaId === v.propietarioPersonaId);
    return {
      id: v.vehiculoId,
      placa: v.placa,
      marca: v.marca || "Desconocida",
      modelo: v.modelo || "",
      anio: v.anio || "-",
      color: v.color || "Desconocido",
      propietario: p ? p.nombreCompleto : "Desconocido",
      estado: v.estadoRegistro === "ACTIVO" ? "ACTIVO" : "INACTIVO",
    };
  });

  const handleDelete = (row: Vehiculo) => {
    if (confirm(`Eliminar vehículo ${row.placa}?`)) {
      alert("El borrado de vehículos a través del backend está en desarrollo");
    }
  };

  const columns: Column<Vehiculo>[] = [
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
          {row.marca} {row.modelo}
        </Typography>
      ),
    },
    { id: "anio", label: "Año", render: (row) => row.anio },
    { id: "color", label: "Color", render: (row) => row.color },
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
      render: (row) => <StatusChip kind="cuenta" value={row.estado} />,
    },
  ];
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
      <DataTable
        columns={columns}
        rows={rows}
        searchPlaceholder="Buscar por placa, marca o propietario..."
        searchKeys={(r) => `${r.placa} ${r.marca} ${r.modelo} ${r.propietario}`}
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
            icon: <EditIcon fontSize="small" />,
            label: "Eliminar",
            onClick: () => handleDelete(row),
            color: "error",
          },
        ]}
      />
    </Box>
  );
}
