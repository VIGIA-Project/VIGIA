import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
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
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { registryService } from "../../../services/registry.service";

interface VehiculoRow {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number | string;
  color: string;
  propietario: string;
  estado: string;
}

export default function VehiculosList() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<VehiculoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const [vehiculosRes, personasRes] = await Promise.all([
        registryService.getVehiculos().catch(() => []),
        registryService.getPersonas().catch(() => [])
      ]);

      const mappedRows = vehiculosRes.map((v) => {
        const owner = personasRes.find(p => p.personaId === v.propietarioPersonaId);
        return {
          id: v.vehiculoId,
          placa: v.placa,
          marca: v.marca || "-",
          modelo: v.modelo || "-",
          anio: v.anio || "-",
          color: v.color || "-",
          propietario: owner ? `${owner.nombres} ${owner.apellidos}` : "Desconocido",
          estado: v.estadoRegistro,
        };
      });

      setRows(mappedRows);
    } catch (err) {
      console.error("Error loading vehiculos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);
  const handleDelete = async (row: VehiculoRow) => {
    if (confirm(`¿Eliminar vehículo ${row.placa}?`)) {
      try {
        await registryService.deleteVehiculo(row.id);
        fetchVehiculos();
      } catch (err) {
        console.error("Error deleting vehiculo", err);
        alert("Error al eliminar el vehículo");
      }
    }
  };

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
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Activos" />
            <Tab label="Inactivos / Eliminados" />
          </Tabs>
          <DataTable
            columns={columns}
            rows={rows.filter((r) => tab === 0 ? r.estado !== 'INACTIVO' : r.estado === 'INACTIVO')}
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
                icon: <DeleteIcon fontSize="small" />,
                label: "Eliminar",
                onClick: () => handleDelete(row),
                color: "error",
              },
            ]}
          />
        </Box>
      )}
    </Box>
  );
}
