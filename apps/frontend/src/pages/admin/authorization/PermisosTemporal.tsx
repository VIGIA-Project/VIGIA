import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import PermisosGrid from "../../../components/organisms/propietario/PermisosGrid";
import { PermisoTemporal as PermisoTemporalUI } from "../../../config/propietario-permisos.config";
import { authorizationService } from "../../../services/authorization.service";
import { accessControlService } from "../../../services/access-control.service";
import { registryService, Persona, Vehiculo } from "../../../services/registry.service";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ConfirmDialog from "../../../components/admin-legacy/ConfirmDialog";

export default function PermisosTemporal() {
  const navigate = useNavigate();
  const [permisosBackend, setPermisosBackend] = useState<any[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filtro') as 'TODOS' | 'TEMPORAL' | 'RAPIDO' | 'GARITA' | null;
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'TEMPORAL' | 'RAPIDO' | 'GARITA'>(initialFilter || 'TODOS');
  
  const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; action?: () => Promise<void> }>({ open: false, title: "", message: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [permRes, pasesRes, garitaRes, persRes, vehRes] = await Promise.all([
          authorizationService.getTodosTemporales().catch(() => []),
          authorizationService.getTodosPasesRapidos().catch(() => []),
          accessControlService.listarPasesGarita().catch(() => []),
          registryService.getPersonas().catch(() => []),
          registryService.getVehiculos().catch(() => []),
        ]);

        // Add a _source field to distinguish them
        const allPermisos = [
          ...permRes.map((p: any) => ({ ...p, _source: 'TEMPORAL' })),
          ...pasesRes.map((p: any) => ({ ...p, _source: 'RAPIDO' })),
          ...garitaRes.map((p: any) => ({ ...p, _source: 'GARITA' })),
        ];

        setPermisosBackend(allPermisos);
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

  const permisosUI: (PermisoTemporalUI & { _source: string })[] = permisosBackend.map((p: any) => {
    if (p._source === 'TEMPORAL') {
      const persona = getPersona(p.personaId);
      const vehiculo = getVehiculo(p.vehiculoId);
      return {
        id: p.id,
        personaId: p.personaId,
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
        estado: (
          (p.estado === 'ACTIVA' || p.estado === 'ACTIVO') && new Date(p?.vigenciaFin || p?.vigencia?.fin || new Date().toISOString()) < new Date()
            ? 'EXPIRADO' 
            : (p.estado === 'ACTIVA' ? 'ACTIVO' : p.estado)
        ) as 'ACTIVO' | 'EXPIRADO' | 'REVOCADO',
        motivo: p.motivo,
        _source: p._source,
      };
    } else if (p._source === 'RAPIDO') {
      const vehiculo = getVehiculo(p.vehiculoId);
      return {
        id: p.id,
        personaId: p.cedulaVisitante || p.id,
        persona: p.nombreVisitante,
        cedula: p.cedulaVisitante || "N/A",
        relacion: "Pase Rápido",
        vehiculo: {
          marca: vehiculo?.marca || "Desconocida",
          modelo: vehiculo?.modelo || "Desconocido",
          placa: p.placa || vehiculo?.placa || "N/A",
        },
        fechaInicio: p.vigenciaInicio,
        fechaFin: p.vigenciaFin,
        estado: (
          (p.estado === 'ACTIVA' || p.estado === 'ACTIVO') && new Date(p.vigenciaFin) < new Date()
            ? 'EXPIRADO'
            : (p.estado === 'CONSUMIDO' ? 'EXPIRADO' : p.estado)
        ) as 'ACTIVO' | 'EXPIRADO' | 'REVOCADO',
        motivo: p.motivo,
        _source: p._source,
      };
    } else {
      // GARITA
      return {
        id: p.id,
        personaId: p.documentoVisitante || p.id,
        persona: p.nombreVisitante,
        cedula: p.documentoVisitante || "N/A",
        relacion: `Pase Garita (${p.tipoVisitante})`,
        vehiculo: {
          marca: "-",
          modelo: "-",
          placa: p.placaVehiculo,
        },
        fechaInicio: p.createdAt,
        fechaFin: p.finalizadoAt || new Date(new Date(p.createdAt).getTime() + (p.duracionHoras * 3600000)).toISOString(),
        estado: (
          (p.estado === 'ACTIVA' || p.estado === 'ACTIVO') && new Date(p.finalizadoAt || new Date(new Date(p.createdAt).getTime() + (p.duracionHoras * 3600000)).toISOString()) < new Date()
            ? 'EXPIRADO'
            : (p.estado === 'FINALIZADO' ? 'EXPIRADO' : p.estado)
        ) as 'ACTIVO' | 'EXPIRADO' | 'REVOCADO',
        motivo: p.destino,
        _source: p._source,
      };
    }
  });

  const permisosFiltrados = filtroTipo === 'TODOS'
    ? permisosUI
    : permisosUI.filter(p => p._source === filtroTipo);

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
              permisosFiltrados.filter((p) => p.estado === "ACTIVO").length,
            ),
            color: "#5B9C5F",
          },
          {
            label: "Próximos a Expirar",
            value: String(
              permisosFiltrados.filter((p) => p.estado === "ACTIVO" && new Date(p.fechaFin) > new Date()).length
            ),
            color: "#E0A82E"
          },
          {
            label: "Expirados/Revocados",
            value: String(
              permisosFiltrados.filter((p) => p.estado === "EXPIRADO" || p.estado === "REVOCADO").length,
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
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={filtroTipo}
          exclusive
          onChange={(_, val) => {
            if (val) {
              setFiltroTipo(val);
              setSearchParams(val === 'TODOS' ? {} : { filtro: val });
            }
          }}
          size="small"
        >
          <ToggleButton value="TODOS">Todos</ToggleButton>
          <ToggleButton value="TEMPORAL">Temporales (Familia/Conocidos)</ToggleButton>
          <ToggleButton value="RAPIDO">Acceso Rápido (Visitantes)</ToggleButton>
          <ToggleButton value="GARITA">Pases de Garita (Guardia)</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <PermisosGrid
        permisos={permisosFiltrados}
        onViewDetail={(id) => {
          const permisoBackend = permisosBackend.find((p: any) => p.id === id);
          if (permisoBackend?.vehiculoId) {
            navigate(`/admin/authorization/vehiculos/${permisoBackend.vehiculoId}`);
          }
        }}
        onRevoke={(id) => {
          const permisoBackend = permisosBackend.find((p: any) => p.id === id);
          if (!permisoBackend) return;
          
          setConfirm({
            open: true,
            title: "Revocar Permiso",
            message: `¿Estás seguro que deseas revocar este permiso? Esta acción no se puede deshacer.`,
            action: async () => {
              try {
                if (permisoBackend._source === 'TEMPORAL') {
                  await authorizationService.revocarPermiso(id);
                } else if (permisoBackend._source === 'RAPIDO') {
                  await authorizationService.revocarPase(id);
                } else if (permisoBackend._source === 'GARITA') {
                  await accessControlService.finalizarPase(id);
                }
                setConfirm(s => ({ ...s, open: false }));
                // reload data
                window.location.reload();
              } catch (e) {
                console.error("Error revoking", e);
                alert("Ocurrió un error al revocar el permiso.");
              }
            }
          });
        }}
      />
      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        destructive
        onConfirm={() => confirm.action?.()}
        onClose={() => setConfirm(s => ({ ...s, open: false }))}
      />
    </Box>
  );
}
