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
import {
  buildInitialVehiculos,
  deleteVehiculo,
} from "../../../config/propietario-vehiculos.config";
import { useState } from "react";

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

const initialRows = buildInitialVehiculos().map((v) => ({
  id: v.id,
  placa: v.placa,
  marca: v.marca,
  modelo: v.modelo,
  anio: v.anio,
  color: v.color,
  propietario: undefined,
  estado: v.estado,
}));

export default function VehiculosList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Vehiculo[]>(initialRows);
  const handleDelete = (row: Vehiculo) => {
    if (confirm(`Eliminar vehículo ${row.placa}?`)) {
      deleteVehiculo(row.id as string);
      setRows((r) => r.filter((x) => x.id !== row.id));
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
