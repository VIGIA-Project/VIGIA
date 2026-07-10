import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PageHeader from "../../../components/admin-legacy/PageHeader";

export default function Reportes() {
  return (
    <Box>
      <PageHeader
        title="Reportes"
        subtitle="Panel de reportes y estadísticas del sistema VIGIA"
        breadcrumbs={[{ label: "Reportes" }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: "Eventos (24h)", value: "12,847", color: "primary.main" },
          { label: "Accesos Exitosos", value: "11,932", color: "success.main" },
          { label: "Accesos Denegados", value: "494", color: "error.main" },
          { label: "Permisos Activos", value: "3,421", color: "warning.main" },
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
                  {s.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="body2" color="text.secondary">
        Reportes por defecto: configuración pendiente de integrar con backend.
      </Typography>
    </Box>
  );
}
