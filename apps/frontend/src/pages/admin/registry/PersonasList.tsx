import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import { usePersonasAdmin } from "../../../hooks/useAdmin";
import { Persona } from "../../../services/types/registry.types";

interface Row extends Persona {
  id: string;
}

const columns: Column<Row>[] = [
  {
    id: "nombre",
    label: "Persona",
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ width: 34, height: 34, fontSize: "0.8rem", bgcolor: "primary.main" }}>
          {row.nombreCompleto.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {row.nombreCompleto}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {row.correoInstitucional || "Sin correo institucional"}
          </Typography>
        </Box>
      </Box>
    ),
  },
  {
    id: "identificacion",
    label: "Identificación",
    render: (row) => (
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {row.identificacionNumero}
      </Typography>
    ),
  },
  {
    id: "telefono",
    label: "Teléfono",
    render: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.telefonoContacto || "-"}
      </Typography>
    ),
  },
  {
    id: "biometria",
    label: "Biometría",
    render: (row) => <StatusChip kind="disponibilidad" value={row.estadoBiometrico === "COMPLETO" ? "DISPONIBLE" : "PENDIENTE"} />,
  },
  {
    id: "estado",
    label: "Estado",
    render: (row) => <StatusChip kind="autorizacion" value={row.estadoRegistro === "ACTIVO" ? "ACTIVA" : "INACTIVA"} />,
  },
];

export default function PersonasList() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = usePersonasAdmin();

  const rows: Row[] = (data ?? []).map((p) => ({ ...p, id: p.personaId }));

  return (
    <Box>
      <PageHeader
        title="Directorio de Personas"
        subtitle="Identidad base institucional registrada en el sistema VIGIA"
        breadcrumbs={[{ label: "Registro" }, { label: "Personas" }]}
      />

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {isLoading ? "Cargando..." : `${rows.length} registros encontrados`}
        </Typography>
      </Box>

      {isLoading ? (
        <Skeleton variant="rounded" height={360} />
      ) : isError ? (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => refetch()}>Reintentar</Button>}>
          No se pudieron cargar las personas registradas.
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Buscar por nombre, identificación o correo..."
          searchKeys={(r) => `${r.nombreCompleto} ${r.identificacionNumero} ${r.correoInstitucional ?? ""}`}
          onRowClick={(row) => navigate(`/admin/registry/personas/${row.id}`)}
        />
      )}
    </Box>
  );
}
