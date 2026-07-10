import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import {
  MOCK_ALERTAS_PROP,
  mapPropietarioAlertToAdmin,
} from "../../../config/propietario-alerting.config";

interface Alerta {
  id: string | number;
  severidad: "ALTA" | "MEDIA" | "INFORMATIVA";
  estado: "GENERADA" | "ENTREGADA" | "ATENDIDA";
  descripcion: string;
  referencia: string;
  fecha: string;
}

const rows: Alerta[] = MOCK_ALERTAS_PROP.map(mapPropietarioAlertToAdmin);

const columns: Column<Alerta>[] = [
  {
    id: "severidad",
    label: "Severidad",
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {row.severidad === "ALTA" && <ErrorIcon sx={{ color: "error.main" }} />}
        {row.severidad === "MEDIA" && (
          <WarningAmberIcon sx={{ color: "warning.main" }} />
        )}
        {row.severidad === "INFORMATIVA" && (
          <InfoIcon sx={{ color: "info.main" }} />
        )}
        <StatusChip kind="severity" value={row.severidad} />
      </Box>
    ),
  },
  {
    id: "descripcion",
    label: "Descripción",
    render: (r) => (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {r.descripcion}
      </Typography>
    ),
  },
  {
    id: "referencia",
    label: "Referencia",
    render: (r) => (
      <Typography variant="caption" color="text.secondary">
        {r.referencia}
      </Typography>
    ),
  },
  {
    id: "estado",
    label: "Atención",
    render: (r) => <StatusChip kind="atencion" value={r.estado} />,
  },
  {
    id: "fecha",
    label: "Fecha",
    render: (r) => (
      <Typography variant="caption" color="text.secondary">
        {r.fecha}
      </Typography>
    ),
  },
];

export default function AlertasList() {
  const navigate = useNavigate();
  return (
    <Box>
      <PageHeader
        title="Alertas"
        subtitle="Gestión y seguimiento de alertas del sistema VIGIA"
        breadcrumbs={[{ label: "Alerting" }, { label: "Alertas" }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          {
            label: "ALTA Severidad",
            value: "5",
            color: "#C0524A",
            icon: <ErrorIcon />,
          },
          {
            label: "MEDIA Severidad",
            value: "8",
            color: "#E0A82E",
            icon: <WarningAmberIcon />,
          },
          {
            label: "INFORMATIVA",
            value: "10",
            color: "#4A8EC0",
            icon: <InfoIcon />,
          },
          {
            label: "Pendientes de Atención",
            value: "3",
            color: "#0D5CCF",
            icon: <WarningAmberIcon />,
          },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Box sx={{ color: s.color }}>{s.icon}</Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {s.label}
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: s.color }}
                >
                  {s.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <DataTable
        columns={columns}
        rows={rows}
        searchPlaceholder="Buscar por descripción o referencia..."
        searchKeys={(r) => `${r.descripcion} ${r.referencia}`}
        onRowClick={(row) => navigate(`/admin/alerting/alertas/${row.id}`)}
      />
    </Box>
  );
}
