import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import { useNotificacionesTodasAdmin } from "../../../hooks/useAdmin";
import { Notificacion } from "../../../services/types/admin.types";

type NotificacionRow = Notificacion & { id: string };

const canalColor: Record<string, "primary" | "secondary" | "info" | "warning"> = {
  DASHBOARD: "primary",
  TELEGRAM: "info",
};

const estadoColor: Record<string, "success" | "warning" | "error"> = {
  ENVIADA: "success",
  PENDIENTE: "warning",
  FALLIDA: "error",
};

const columns: Column<NotificacionRow>[] = [
  {
    id: "titulo",
    label: "Notificación",
    render: (r) => (
      <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
        {r.titulo}
      </Typography>
    ),
  },
  {
    id: "canal",
    label: "Canal",
    render: (r) => (
      <Chip label={r.canal} size="small" color={canalColor[r.canal] ?? "secondary"} variant="outlined" />
    ),
  },
  {
    id: "destinatario",
    label: "Destinatario (Persona ID)",
    render: (r) => (
      <Typography variant="caption" color="text.secondary">
        {r.destinatarioPersonaId.slice(0, 8)}…
      </Typography>
    ),
  },
  {
    id: "estado",
    label: "Estado de entrega",
    render: (r) => (
      <Chip label={r.estadoEntrega} size="small" color={estadoColor[r.estadoEntrega] ?? "default"} />
    ),
  },
  {
    id: "leida",
    label: "Leída",
    render: (r) => (
      <Chip label={r.leida ? "Sí" : "No"} size="small" variant={r.leida ? "filled" : "outlined"} color={r.leida ? "success" : "default"} />
    ),
  },
  {
    id: "fecha",
    label: "Fecha",
    render: (r) => (
      <Typography variant="caption" color="text.secondary">
        {r.enviadaEn ? new Date(r.enviadaEn).toLocaleString("es-EC") : "—"}
      </Typography>
    ),
  },
];

export default function Notificaciones() {
  const notificacionesQuery = useNotificacionesTodasAdmin(100);
  const rows: NotificacionRow[] = useMemo(
    () => (notificacionesQuery.data ?? []).map((n) => ({ ...n, id: n.notificacionId })),
    [notificacionesQuery.data]
  );

  const stats = useMemo(
    () => ({
      enviadas: rows.filter((r) => r.estadoEntrega === "ENVIADA").length,
      pendientes: rows.filter((r) => r.estadoEntrega === "PENDIENTE").length,
      fallidas: rows.filter((r) => r.estadoEntrega === "FALLIDA").length,
      tasaEntrega: rows.length > 0 ? `${Math.round((rows.filter((r) => r.estadoEntrega === "ENVIADA").length / rows.length) * 100)}%` : "—",
    }),
    [rows]
  );

  return (
    <Box>
      <PageHeader
        title="Notificaciones"
        subtitle="Historial de entregas de alertas por canal"
        breadcrumbs={[{ label: "Alerting" }, { label: "Notificaciones" }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: "Enviadas", value: stats.enviadas, color: "#5B9C5F" },
          { label: "Pendientes", value: stats.pendientes, color: "#E0A82E" },
          { label: "Fallidas", value: stats.fallidas, color: "#C0524A" },
          { label: "Tasa de Entrega", value: stats.tasaEntrega, color: "#0D5CCF" },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {s.label}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: s.color }}
                >
                  {notificacionesQuery.isLoading ? <CircularProgress size={22} /> : s.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {notificacionesQuery.isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : notificacionesQuery.isError ? (
        <Typography color="error">No se pudieron cargar las notificaciones.</Typography>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Buscar por título..."
          searchKeys={(r) => `${r.titulo} ${r.contenidoResumen}`}
        />
      )}
    </Box>
  );
}
