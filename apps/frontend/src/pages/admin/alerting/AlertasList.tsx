import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import { useAlertasRecientesAdmin } from "../../../hooks/useAdmin";
import { Alerta } from "../../../services/types/admin.types";

type AlertaRow = Alerta & { id: string };

const columns: Column<AlertaRow>[] = [
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
        {r.mensajeResumen}
      </Typography>
    ),
  },
  {
    id: "referencia",
    label: "Causa",
    render: (r) => (
      <Typography variant="caption" color="text.secondary">
        {r.causaOrigen}
      </Typography>
    ),
  },
  {
    id: "estado",
    label: "Atención",
    render: (r) => <StatusChip kind="atencion" value={r.estadoAtencion} />,
  },
  {
    id: "fecha",
    label: "Fecha",
    render: (r) => (
      <Typography variant="caption" color="text.secondary">
        {new Date(r.generadaEn).toLocaleString("es-EC")}
      </Typography>
    ),
  },
];

export default function AlertasList() {
  const navigate = useNavigate();
  const alertasQuery = useAlertasRecientesAdmin(100);
  const alertas: AlertaRow[] = useMemo(
    () => (alertasQuery.data ?? []).map((a) => ({ ...a, id: a.alertaId })),
    [alertasQuery.data]
  );

  const stats = useMemo(
    () => ({
      alta: alertas.filter((a) => a.severidad === "ALTA").length,
      media: alertas.filter((a) => a.severidad === "MEDIA").length,
      informativa: alertas.filter((a) => a.severidad === "INFORMATIVA").length,
      pendientes: alertas.filter((a) => a.estadoAtencion !== "ATENDIDA").length,
    }),
    [alertas]
  );

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
            value: stats.alta,
            color: "#C0524A",
            icon: <ErrorIcon />,
          },
          {
            label: "MEDIA Severidad",
            value: stats.media,
            color: "#E0A82E",
            icon: <WarningAmberIcon />,
          },
          {
            label: "INFORMATIVA",
            value: stats.informativa,
            color: "#4A8EC0",
            icon: <InfoIcon />,
          },
          {
            label: "Pendientes de Atención",
            value: stats.pendientes,
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
                  {alertasQuery.isLoading ? <CircularProgress size={22} /> : s.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {alertasQuery.isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : alertasQuery.isError ? (
        <Typography color="error">No se pudieron cargar las alertas.</Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={alertas}
          searchPlaceholder="Buscar por descripción o causa..."
          searchKeys={(r) => `${r.mensajeResumen} ${r.causaOrigen}`}
          onRowClick={(row) => navigate(`/admin/alerting/alertas/${row.alertaId}`)}
        />
      )}
    </Box>
  );
}
