import { useState, useEffect } from "react";
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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import EditPersonaModal from "./EditPersonaModal";
import { registryService, Persona } from "../../../services/registry.service";
import { authService, UserResponseDto } from "../../../services/auth.service";
import { Vehiculo } from "../../../services/registry.service";

export default function PersonaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [userAccount, setUserAccount] = useState<UserResponseDto | null>(null);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const p = await registryService.getPersonaById(id);
      setPersona(p);

      // Fetch user account info
      const usersRes = await authService.getUsers().catch(() => null);
      if (usersRes && usersRes.data) {
        const u = usersRes.data.find((u) => u.personaId === id);
        if (u) setUserAccount(u);
      }

      // Fetch vehicles
      const vehiculosRes = await registryService.getVehiculos().catch(() => []);
      if (vehiculosRes) {
        setVehiculos(vehiculosRes.filter((v) => v.propietarioPersonaId === id));
      }
    } catch (err) {
      console.error("Failed to load persona details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const currentPersonaData = persona
    ? {
      id: persona.personaId,
      identificacion: persona.identificacionNumero,
      tipoId: persona.identificacionTipo,
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      correo: persona.correoInstitucional || "",
      telefono: persona.telefonoContacto || "",
      rol: persona.rolInstitucional || "N/A",
      estado: persona.estadoRegistro,
      estadoBiometrico: persona.estadoBiometrico,
    }
    : null;

  const vehiculoCols: Column<Vehiculo & { id: string }>[] = [
    {
      id: "placa",
      label: "Placa",
      render: (r) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: "primary.main" }}
        >
          {r.placa}
        </Typography>
      ),
    },
    { id: "marca", label: "Marca", render: (r) => r.marca || "-" },
    { id: "modelo", label: "Modelo", render: (r) => r.modelo || "-" },
    {
      id: "estado",
      label: "Estado",
      render: (r) => (
        <Chip
          label={r.estadoRegistro}
          size="small"
          color={r.estadoRegistro === "ACTIVO" ? "primary" : "default"}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentPersonaData || !persona) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="error">Persona no encontrada.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Detalle de Persona"
        breadcrumbs={[
          { label: "Registry", href: "/admin/registry/personas" },
          { label: "Personas", href: "/admin/registry/personas" },
          { label: `ID ${id}` },
        ]}
        action={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/admin/registry/personas")}
            >
              Volver
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditModalOpen(true)}
            >
              Editar
            </Button>
          </Box>
        }
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                fontSize: "1.8rem",
                bgcolor: "primary.main",
              }}
            >
              {persona.nombres.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {persona.nombreCompleto || `${persona.nombres} ${persona.apellidos}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {persona.correoInstitucional || "Sin correo"} · {persona.identificacionNumero}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={`Registro: ${persona.estadoRegistro}`}
                  size="small"
                  color={persona.estadoRegistro === "ACTIVO" ? "success" : "default"}
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={persona.rolInstitucional || "Sin rol institucional"}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {userAccount && (
                  <Chip
                    label={`Acceso al Sistema: ${userAccount.role}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ px: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Resumen" />
            <Tab label="Acceso y Vinculación" />
            <Tab label="Roles" />
            <Tab label="Vehículos Asociados" />
            <Tab label="Biometría" />
          </Tabs>
        </Box>
        <CardContent>
          {tab === 0 && (
            <Grid container spacing={3}>
              {[
                ["Identificación", persona.identificacionNumero],
                ["Tipo de identificación", persona.identificacionTipo],
                ["Nombres", persona.nombres],
                ["Apellidos", persona.apellidos],
                ["Correo institucional", persona.correoInstitucional || "---"],
                ["Teléfono", persona.telefonoContacto || "---"],
                ["Rol Institucional", persona.rolInstitucional || "---"],
                ["Fecha de registro", new Date(persona.createdAt).toLocaleDateString()],
              ].map(([label, value]) => (
                <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600, display: "block" }}
                  >
                    {label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
          {tab === 1 && (
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, display: "block", mb: 1 }}
                >
                  Estado de Cuenta
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  {userAccount ? (
                    <>
                      <Chip
                        label="Acceso al Sistema"
                        color="primary"
                        size="small"
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Posee credenciales de acceso al sistema (Rol: {userAccount.role}).
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary" }}>
                      Solo registrado como persona, sin cuenta de acceso.
                    </Typography>
                  )}
                </Box>
                {userAccount && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5 }}
                  >
                    Estado de cuenta: {userAccount.status}
                  </Typography>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {/* Omitted "Vinculación Externa" until there's a backend implementation for family groups */}
              </Grid>
            </Grid>
          )}
          {tab === 2 && (
            <List>
              <Box>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {persona.rolInstitucional || "Rol no asignado"}
                        </Typography>
                        <Chip
                          label="Vigente"
                          size="small"
                          color="success"
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        Desde: {new Date(persona.createdAt).toLocaleDateString()} → actualidad
                      </Typography>
                    }
                  />
                </ListItem>
              </Box>
            </List>
          )}
          {tab === 3 && (
            <DataTable
              columns={vehiculoCols}
              rows={vehiculos.map(v => ({ ...v, id: v.vehiculoId }))}
              searchKeys={(r) => `${r.placa} ${r.marca}`}
            />
          )}
          {tab === 4 && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, display: "block" }}
                >
                  Estado de perfil biométrico
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: persona.estadoBiometrico === 'ACTIVO' ? 'success.main' : 'warning.main' }}>
                  {persona.estadoBiometrico === 'ACTIVO' ? 'ACTIVO (Registrado)' : 'PENDIENTE (Sin registro)'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      <EditPersonaModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialData={currentPersonaData}
        onSuccess={fetchData}
      />
    </Box>
  );
}
