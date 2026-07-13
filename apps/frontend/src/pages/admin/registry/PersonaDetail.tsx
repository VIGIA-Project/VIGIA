import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid2";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import { usePersona, useVehiculosDelPropietario, useMarcarEnrollmentCompleto } from "../../../hooks/useRegistry";
import { usePerfilBiometricoPorPersonaAdmin } from "../../../hooks/useAdmin";
import { Vehiculo } from "../../../services/types/registry.types";
import EditPersonaModal from "./EditPersonaModal";

interface VehiculoRow extends Vehiculo {
  id: string;
}

const vehiculoCols: Column<VehiculoRow>[] = [
  {
    id: "placa",
    label: "Placa",
    render: (r) => (
      <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
        {r.placa}
      </Typography>
    ),
  },
  { id: "marca", label: "Marca", render: (r) => r.marca || "-" },
  { id: "modelo", label: "Modelo", render: (r) => r.modelo || "-" },
  {
    id: "estado",
    label: "Estado",
    render: (r) => <StatusChip kind="autorizacion" value={r.estadoRegistro === "ACTIVO" ? "ACTIVA" : "INACTIVA"} />,
  },
];

export default function PersonaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);

  const persona = usePersona(id);
  const vehiculos = useVehiculosDelPropietario(id);
  const perfilBiometrico = usePerfilBiometricoPorPersonaAdmin(id);
  const marcarEnrollment = useMarcarEnrollmentCompleto();

  const vehiculoRows: VehiculoRow[] = (vehiculos.data ?? []).map((v: any) => ({ ...v, id: v.vehiculoId }));

  if (persona.isLoading) {
    return (
      <Box>
        <PageHeader title="Detalle de Persona" breadcrumbs={[{ label: "Registro" }, { label: "Personas", href: "/admin/registry/personas" }]} />
        <Skeleton variant="rounded" height={400} />
      </Box>
    );
  }

  if (persona.isError || !persona.data) {
    return (
      <Box>
        <PageHeader title="Detalle de Persona" breadcrumbs={[{ label: "Registro" }, { label: "Personas", href: "/admin/registry/personas" }]} />
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => persona.refetch()}>Reintentar</Button>}>
          No se pudo cargar la información de esta persona.
        </Alert>
      </Box>
    );
  }

  const p = persona.data;

  return (
    <Box>
      <PageHeader
        title="Detalle de Persona"
        breadcrumbs={[
          { label: "Registro" },
          { label: "Personas", href: "/admin/registry/personas" },
          { label: p.nombreCompleto },
        ]}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/registry/personas")}>
              Volver
            </Button>
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
              Editar
            </Button>
          </Box>
        }
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
            <Avatar sx={{ width: 72, height: 72, fontSize: "1.8rem", bgcolor: "primary.main" }}>
              {p.nombreCompleto.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {p.nombreCompleto}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {p.correoInstitucional || "Sin correo institucional"} · {p.identificacionNumero}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <StatusChip kind="autorizacion" value={p.estadoRegistro === "ACTIVO" ? "ACTIVA" : "INACTIVA"} />
                <StatusChip kind="disponibilidad" value={p.estadoBiometrico === "COMPLETO" ? "DISPONIBLE" : "PENDIENTE"} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }} variant="scrollable" scrollButtons="auto">
            <Tab label="Datos Base" />
            <Tab label="Vehículos Asociados" />
            <Tab label="Biometría" />
          </Tabs>
        </Box>
        <CardContent>
          {tab === 0 && (
            <Grid container spacing={3}>
              {[
                ["Identificación", p.identificacionNumero],
                ["Tipo de identificación", p.identificacionTipo],
                ["Nombres", p.nombres],
                ["Apellidos", p.apellidos],
                ["Correo institucional", p.correoInstitucional || "-"],
                ["Teléfono", p.telefonoContacto || "-"],
                ["Fecha de registro", new Date(p.createdAt).toLocaleDateString("es-EC")],
              ].map(([label, value]) => (
                <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block" }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
          {tab === 1 &&
            (vehiculos.isLoading ? (
              <Skeleton variant="rounded" height={200} />
            ) : vehiculos.isError ? (
              <Alert severity="error">No se pudieron cargar los vehículos asociados.</Alert>
            ) : (
              <DataTable
                columns={vehiculoCols}
                rows={vehiculoRows}
                searchKeys={(r) => `${r.placa} ${r.marca ?? ""}`}
              />
            ))}
          {tab === 2 &&
            (perfilBiometrico.isLoading ? (
              <Skeleton variant="rounded" height={140} />
            ) : perfilBiometrico.isError ? (
              <Alert severity="error">No se pudo cargar el perfil biométrico.</Alert>
            ) : perfilBiometrico.data ? (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block" }}>
                    Estado de disponibilidad
                  </Typography>
                  <StatusChip
                    kind="disponibilidad"
                    value={perfilBiometrico.data.estadoDisponibilidad === "DISPONIBLE" ? "DISPONIBLE" : perfilBiometrico.data.estadoDisponibilidad === "NO_DISPONIBLE" ? "NO_DISPONIBLE" : "PENDIENTE"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block" }}>
                    Última actualización
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {perfilBiometrico.data.ultimaActualizacionBiometrica
                      ? new Date(perfilBiometrico.data.ultimaActualizacionBiometrica).toLocaleString("es-EC")
                      : "Sin actualizaciones"}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Esta persona todavía no tiene un perfil biométrico registrado.
              </Typography>
            ))}
          {tab === 0 && p.estadoBiometrico === "PENDIENTE" && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<CheckCircleOutlineIcon />}
                disabled={marcarEnrollment.isPending}
                onClick={() => marcarEnrollment.mutate(p.personaId)}
              >
                Marcar enrollment completo
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <EditPersonaModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        persona={p}
        onUpdated={() => persona.refetch()}
      />
    </Box>
  );
}
