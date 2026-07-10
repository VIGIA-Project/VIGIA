import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { alertingService } from "../../../services/alerting.service";

interface Alerta {
  id: string;
  alertaId: string;
  severidad: "ALTA" | "MEDIA" | "INFORMATIVA";
  estado: string;
  descripcion: string;
  referencia: string;
  fecha: string;
}

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
        {r.referencia || "Sistema VIGIA"}
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
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        setLoading(true);
        const res = await alertingService.obtenerAlertasRecientes(50);
        setAlertas(res.map((a: any) => ({
          id: a.alertaId || a.id,
          alertaId: a.alertaId || a.id,
          severidad: a.severidad,
          estado: a.estadoAtencion || a.estado,
          descripcion: a.mensajeResumen || a.descripcion || 'Sin descripción',
          referencia: a.causaOrigen || a.referenciaExterna || "Sistema",
          fecha: new Date(a.generadaEn || a.createdAt || a.fechaCreacion).toLocaleString()
        })));
      } catch (err) {
        console.error("Error fetching alertas", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlertas();
  }, []);

  const stats = {
    alta: alertas.filter(a => a.severidad === 'ALTA').length,
    media: alertas.filter(a => a.severidad === 'MEDIA').length,
    informativa: alertas.filter(a => a.severidad === 'INFORMATIVA').length,
    pendientes: alertas.filter(a => a.estado === 'GENERADA').length,
  };

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
            value: stats.alta.toString(),
            color: "#C0524A",
            icon: <ErrorIcon />,
          },
          {
            label: "MEDIA Severidad",
            value: stats.media.toString(),
            color: "#E0A82E",
            icon: <WarningAmberIcon />,
          },
          {
            label: "INFORMATIVA",
            value: stats.informativa.toString(),
            color: "#4A8EC0",
            icon: <InfoIcon />,
          },
          {
            label: "Pendientes de Atención",
            value: stats.pendientes.toString(),
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
      {loading ? (
         <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
      ) : (
        <DataTable
          columns={columns}
          rows={alertas}
          searchPlaceholder="Buscar por descripción o referencia..."
          searchKeys={(r) => `${r.descripcion} ${r.referencia}`}
          onRowClick={(row) => navigate(`/admin/alerting/alertas/${row.id}`)}
        />
      )}
    </Box>
  );
}
