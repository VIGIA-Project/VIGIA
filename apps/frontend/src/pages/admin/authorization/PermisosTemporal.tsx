import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import PermisosGrid from "../../../components/organisms/propietario/PermisosGrid";
import { PermisoTemporal as PermisoTemporalUI } from "../../../config/propietario-permisos.config";
import { authorizationService, PermisoTemporal } from "../../../services/authorization.service";
import { registryService, Persona, Vehiculo } from "../../../services/registry.service";

export default function PermisosTemporal() {
  const [permisosBackend, setPermisosBackend] = useState<PermisoTemporal[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [permRes, persRes, vehRes] = await Promise.all([
          authorizationService.getTodosTemporales(),
          registryService.getPersonas(),
          registryService.getVehiculos(),
        ]);
        setPermisosBackend(permRes);
        setPersonas(persRes);
        setVehiculos(vehRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPersona = (id: string) => personas.find((p) => p.personaId === id);
  const getVehiculo = (id: string) => vehiculos.find((v) => v.vehiculoId === id);

  const permisosUI: PermisoTemporalUI[] = permisosBackend.map((p: any) => {
    const persona = getPersona(p.personaId);
    const vehiculo = getVehiculo(p.vehiculoId);
    return {
      id: p.id,
      persona: persona ? `${persona.nombres} ${persona.apellidos}` : p.personaId,
      cedula: persona?.identificacionNumero || "",
      relacion: "Permiso Temporal",
      vehiculo: {
        marca: vehiculo?.marca || "Desconocida",
        modelo: vehiculo?.modelo || "Desconocido",
        placa: vehiculo?.placa || p.vehiculoId,
      },
      fechaInicio: p?.vigenciaInicio || p?.vigencia?.inicio || new Date().toISOString(),
      fechaFin: p?.vigenciaFin || p?.vigencia?.fin || new Date().toISOString(),
      estado: p.estado as 'ACTIVO' | 'EXPIRADO' | 'REVOCADO',
      motivo: p.motivo,
    };
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

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
              permisosUI.filter((p) => p.estado === "ACTIVO").length,
            ),
            color: "#5B9C5F",
          },
          { 
            label: "Próximos a Expirar", 
            value: String(
              permisosUI.filter((p) => p.estado === "ACTIVO" && new Date(p.fechaFin) > new Date()).length
            ), 
            color: "#E0A82E" 
          },
          {
            label: "Expirados (mes actual)",
            value: String(
              permisosUI.filter((p) => p.estado === "EXPIRADO").length,
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
        permisos={permisosUI}
        onViewDetail={(id) => {
          const permisoBackend = permisosBackend.find((p: any) => p.id === id);
          if (permisoBackend?.vehiculoId) {
            navigate(`/admin/authorization/vehiculos/${permisoBackend.vehiculoId}`);
          }
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
