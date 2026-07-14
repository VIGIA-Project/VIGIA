import { useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import {
  usePersonasCountAdmin,
  useVehiculosCountAdmin,
  useEventosCountAdmin,
  useEventosRecientesAdmin,
  useAlertasCountAdmin,
  useTemporalesCountAdmin,
  usePasesCountAdmin,
  useGrupoFamiliarCountAdmin,
  usePerfilesCountAdmin,
} from "../../../hooks/useAdmin";

function KpiCard({ label, value, color, loading }: { label: string; value: number | string; color: string; loading: boolean }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color }}>
          {loading ? <CircularProgress size={22} /> : value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Reportes() {
  const personasCount = usePersonasCountAdmin();
  const vehiculosCount = useVehiculosCountAdmin();
  const eventosHoyCount = useEventosCountAdmin();
  const eventosRecientes = useEventosRecientesAdmin(100);
  const alertasCount = useAlertasCountAdmin();
  const temporalesCount = useTemporalesCountAdmin();
  const pasesCount = usePasesCountAdmin();
  const grupoFamiliarCount = useGrupoFamiliarCountAdmin();
  const perfilesCount = usePerfilesCountAdmin();

  const desglose = useMemo(() => {
    const eventos = eventosRecientes.data ?? [];
    return {
      exitosos: eventos.filter((e) => e.decisionOperativa === "SUCCESSFUL").length,
      denegados: eventos.filter((e) => e.decisionOperativa === "DENIED").length,
      pendientes: eventos.filter((e) => e.decisionOperativa === "PENDING_VERIFY").length,
    };
  }, [eventosRecientes.data]);

  return (
    <Box>
      <PageHeader
        title="Reportes"
        subtitle="Panel de indicadores del sistema VIGIA, calculados a partir de datos reales"
        breadcrumbs={[{ label: "Reportes" }]}
      />

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Control de accesos
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Eventos hoy" value={eventosHoyCount.data ?? 0} color="primary.main" loading={eventosHoyCount.isLoading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Exitosos (últimos 100)" value={desglose.exitosos} color="success.main" loading={eventosRecientes.isLoading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Denegados (últimos 100)" value={desglose.denegados} color="error.main" loading={eventosRecientes.isLoading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Pendientes de verificación (últimos 100)" value={desglose.pendientes} color="warning.main" loading={eventosRecientes.isLoading} />
        </Grid>
      </Grid>

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Autorizaciones
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Permisos temporales vigentes" value={temporalesCount.data ?? 0} color="warning.main" loading={temporalesCount.isLoading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Pases de acceso activos" value={pasesCount.data ?? 0} color="primary.main" loading={pasesCount.isLoading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Miembros de grupo familiar activos" value={grupoFamiliarCount.data ?? 0} color="success.main" loading={grupoFamiliarCount.isLoading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <KpiCard label="Alertas pendientes de atención" value={alertasCount.data ?? 0} color="error.main" loading={alertasCount.isLoading} />
        </Grid>
      </Grid>

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Registro institucional
      </Typography>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 4 }}>
          <KpiCard label="Personas registradas" value={personasCount.data ?? 0} color="primary.main" loading={personasCount.isLoading} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <KpiCard label="Vehículos registrados" value={vehiculosCount.data ?? 0} color="primary.main" loading={vehiculosCount.isLoading} />
        </Grid>
        <Grid size={{ xs: 6, md: 4 }}>
          <KpiCard label="Perfiles biométricos" value={perfilesCount.data ?? 0} color="info.main" loading={perfilesCount.isLoading} />
        </Grid>
      </Grid>

      <Typography variant="body2" color="text.secondary">
        Los desgloses de eventos se calculan sobre los últimos 100 eventos registrados. Un módulo de reportes históricos con rangos de fecha personalizados y exportación requeriría un endpoint de agregación dedicado en el backend.
      </Typography>
    </Box>
  );
}
