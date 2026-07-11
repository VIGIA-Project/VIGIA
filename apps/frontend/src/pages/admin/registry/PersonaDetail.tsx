import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import EditPersonaModal from "./EditPersonaModal";
import { buscarPersonaPorId } from "../../../services/registry.service";

interface VehiculoAsoc {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  relacion: "Propietario" | "Conductor Autorizado";
}

const vehiculos: VehiculoAsoc[] = [
  {
    id: 1,
    placa: "ABC-0123",
    marca: "Toyota",
    modelo: "Corolla 2022",
    relacion: "Propietario",
  },
  {
    id: 2,
    placa: "PBC-1231",
    marca: "Chevrolet",
    modelo: "Spark 2021",
    relacion: "Conductor Autorizado",
  },
];

const rolesHistorial = [
  {
    id: 1,
    rol: "Docente Tiempo Completo",
    facultad: "Ingeniería",
    desde: "2021-09-15",
    hasta: null,
    vigente: true,
  },
  {
    id: 2,
    rol: "Docente Ocasional",
    facultad: "Ingeniería",
    desde: "2019-03-01",
    hasta: "2021-09-14",
    vigente: false,
  },
];

const biometriaInfo = [
  { label: "Estado de perfil", value: "DISPONIBLE" },
  { label: "Última actualización", value: "2024-08-15 10:32" },
  { label: "Calidad de captura", value: "Alta (0.92)" },
  {
    label: "Representaciones",
    value: "3 activas (frontal, izquierda, derecha)",
  },
];

export default function PersonaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data: personaReal, isLoading } = useQuery({
    queryKey: ['personaDetail', id],
    queryFn: () => buscarPersonaPorId(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Cargando detalle de persona...</Typography>
      </Box>
    );
  }

  if (!personaReal) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">Persona no encontrada.</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/admin/registry/personas")}>
          Volver al directorio
        </Button>
      </Box>
    );
  }

  const currentPersonaData = {
    identificacion: personaReal.identificacionNumero,
    tipoId: personaReal.identificacionTipo,
    nombres: personaReal.nombres,
    apellidos: personaReal.apellidos,
    correo: personaReal.correoInstitucional || "",
    telefono: personaReal.telefonoContacto || "",
    facultad: "No especificada",
    carrera: "No especificada",
    rol: "Sin Rol asignado",
    estado: personaReal.estadoBiometrico === "COMPLETO" ? "COMPLETO" : "PENDIENTE_BIOMETRIA",
  };

  const vehiculoCols: Column<VehiculoAsoc>[] = [
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
    { id: "marca", label: "Marca", render: (r) => r.marca },
    { id: "modelo", label: "Modelo", render: (r) => r.modelo },
    {
      id: "relacion",
      label: "Relación",
      render: (r) => (
        <Chip
          label={r.relacion}
          size="small"
          color={r.relacion === "Propietario" ? "primary" : "default"}
        />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Detalle de Persona"
        breadcrumbs={[
          { label: "Registry", href: "#/admin/registry/personas" },
          { label: "Personas", href: "#/admin/registry/personas" },
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
              {personaReal.nombres.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {personaReal.nombreCompleto}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {currentPersonaData.correo} · {personaReal.identificacionNumero}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <StatusChip kind="cuenta" value={currentPersonaData.estado} />
                <Chip
                  label="Docente"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label="Acceso al Sistema"
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label="Agregado"
                  size="small"
                  color="secondary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
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
                ["Identificación", currentPersonaData.identificacion],
                ["Tipo de identificación", currentPersonaData.tipoId],
                ["Nombres", currentPersonaData.nombres],
                ["Apellidos", currentPersonaData.apellidos],
                ["Correo institucional", currentPersonaData.correo],
                ["Teléfono", currentPersonaData.telefono],
                ["Fecha de registro", new Date(personaReal.createdAt).toLocaleDateString()],
                ["Última modificación", "Recientemente"],
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
                    {value || "-"}
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
                  <Chip
                    label="Acceso al Sistema"
                    color="primary"
                    size="small"
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Posee credenciales de acceso al sistema.
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1.5 }}
                >
                  Último inicio de sesión: 2024-08-19 14:32
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, display: "block", mb: 1 }}
                >
                  Vinculación Externa
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Chip label="Agregado" color="secondary" size="small" />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Forma parte de un grupo familiar o de invitados.
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1.5 }}
                >
                  Persona vinculante: Carlos Andrés Mendoza
                </Typography>
              </Grid>
            </Grid>
          )}
          {tab === 2 && (
            <List>
              {rolesHistorial.map((r, i) => (
                <Box key={r.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {r.rol}
                          </Typography>
                          {r.vigente && (
                            <Chip
                              label="Vigente"
                              size="small"
                              color="success"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {r.facultad} · {r.desde} → {r.hasta ?? "actualidad"}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {i < rolesHistorial.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
          {tab === 3 && (
            <DataTable
              columns={vehiculoCols}
              rows={vehiculos}
              searchKeys={(r) => `${r.placa} ${r.marca}`}
            />
          )}
          {tab === 4 && (
            <Grid container spacing={2}>
              {biometriaInfo.map((item) => (
                <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600, display: "block" }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <EditPersonaModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialData={currentPersonaData}
      />
    </Box>
  );
}
