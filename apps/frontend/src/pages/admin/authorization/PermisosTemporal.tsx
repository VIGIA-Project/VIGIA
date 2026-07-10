import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import PermisosGrid from "../../../components/organisms/propietario/PermisosGrid";
import { MOCK_PERMISOS } from "../../../config/propietario-permisos.config";

export default function PermisosTemporal() {
  return (
    <Box>
      <PageHeader
        title="Permisos Temporales"
        subtitle="Consulta de permisos temporales otorgados (solo lectura para administrador)"
        breadcrumbs={[{ label: "Authorization" }, { label: "Temporales" }]}
      />
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          {
            label: "Permisos Activos",
            value: String(
              MOCK_PERMISOS.filter((p) => p.estado === "ACTIVO").length,
            ),
            color: "#5B9C5F",
          },
          { label: "Próximos a Expirar", value: "3", color: "#E0A82E" },
          {
            label: "Expirados (mes actual)",
            value: String(
              MOCK_PERMISOS.filter((p) => p.estado === "EXPIRADO").length,
            ),
            color: "#9E9E9E",
          },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 4 }}>
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
      <PermisosGrid
        permisos={MOCK_PERMISOS}
        onViewDetail={(id) => {
          console.log("Admin ver permiso", id);
        }}
        onRevoke={(id) => {
          console.log("Admin revocar permiso", id);
        }}
        onCreateClick={() => {
          console.log("Admin crear permiso (no disponible)");
        }}
      />
    </Box>
  );
}
