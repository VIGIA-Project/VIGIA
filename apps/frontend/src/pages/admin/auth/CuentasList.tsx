import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BadgeIcon from "@mui/icons-material/Badge";
import LockResetIcon from "@mui/icons-material/LockReset";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import DataTable from "../../../components/admin-legacy/DataTable";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import ConfirmDialog from "../../../components/admin-legacy/ConfirmDialog";
import { useEffect } from "react";
import { authService } from "../../../services/auth.service";
import { registryService, Persona } from "../../../services/registry.service";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

interface Cuenta {
  id: string | number;
  identificacion: string;
  nombre: string;
  correo: string;
  rol: string;
  estado:
    | "ACTIVO"
    | "INACTIVO"
    | "PENDIENTE_CONTRASEÑA"
    | "PENDIENTE_BIOMETRIA"
    | "DESACTIVADO";
  ultimoLogin: string;
}

export default function CuentasList() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterRol, setFilterRol] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Cuenta[]>([]);
  const [tempPassword, setTempPassword] = useState<{
    open: boolean;
    password?: string;
    message: string;
  }>({ open: false, message: "" });
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    message: string;
    action?: () => void;
  }>({ open: false, title: "", message: "" });

const fetchUsers = async () => {
  try {
    setLoading(true);
    const [usersRes, personasRes] = await Promise.all([
      authService.getUsers(),
      registryService.getPersonas(),
    ]);

    const usersData = usersRes.data || [];
    const personas = Array.isArray(personasRes) ? personasRes : [];
    const personaMap = new Map<string, Persona>(
      personas.map((p) => [p.personaId, p]),
    );

    const mappedRows: Cuenta[] = usersData.map((user: any) => {
      const p = user.personaId ? personaMap.get(user.personaId) : null;
      let estado = user.status;
      if (estado === "ACTIVE") estado = "ACTIVO";
      if (estado === "INACTIVE") estado = "INACTIVO";
      if (estado === "PENDING_PASSWORD_CHANGE" || (estado === "ACTIVO" && user.mustChangePassword))
        estado = "PENDIENTE_CONTRASEÑA";
      else if (estado === "ACTIVO" && !user.biometricRegistered)
        estado = "PENDIENTE_BIOMETRIA";

      return {
        id: user.id,
        identificacion: p?.identificacionNumero || "---",
        nombre: p
          ? p.nombreCompleto || `${p.nombres} ${p.apellidos}`
          : "Usuario del sistema",
        correo: user.email,
        rol: user.role,
        estado: estado as Cuenta["estado"],
        ultimoLogin: (() => {
          if (!user.lastLoginAt) return "Nunca";
          try {
            const d = new Date(user.lastLoginAt);
            if (isNaN(d.getTime())) return "Nunca";
            return `${d.toLocaleDateString('es-EC')} ${d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}`;
          } catch {
            return "Nunca";
          }
        })(),
      };
    });

    setRows(mappedRows);
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchUsers();
}, []);

const handleResetPassword = async (userId: string) => {
  try {
    setConfirm((s) => ({ ...s, open: false }));
    const response = await authService.resetPassword(userId);
    setTempPassword({
      open: true,
      password: response.temporaryPassword,
      message:
        "La contraseña ha sido reseteada con éxito. Por favor entrega esta contraseña temporal al usuario.",
    });
    fetchUsers();
  } catch (error) {
    console.error("Error al resetear contraseña", error);
    alert("Error al resetear la contraseña");
  }
};

const filteredRows = filterRol ? rows.filter((r) => r.rol === filterRol) : rows;

return (
  <Box>
    <PageHeader
      title="Cuentas de Usuario"
      subtitle="Gestión de cuentas de acceso al sistema VIGIA"
      breadcrumbs={[{ label: "Auth" }, { label: "Cuentas de Usuario" }]}
      action={
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate("/admin/registro/usuario")}
          >
            Registrar Usuario
          </Button>
          <Button
            variant="outlined"
            startIcon={<BadgeIcon />}
            onClick={() => navigate("/admin/registro/guardia")}
            sx={{
              borderColor: "warning.main",
              color: "warning.main",
              "&:hover": {
                borderColor: "warning.dark",
                bgcolor: "warning.main",
                color: "#fff",
              },
            }}
          >
            Registrar Guardia
          </Button>
        </Box>
      }
    />

    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {[
        { label: "Cuentas Activas", value: String(rows.filter(r => r.estado === "ACTIVO" || r.estado === "PENDIENTE_BIOMETRIA").length), color: "success.main" },
        { label: "Pendientes de Cambio", value: String(rows.filter(r => r.estado === "PENDIENTE_CONTRASEÑA").length), color: "warning.main" },
        { label: "Inactivas", value: String(rows.filter(r => r.estado === "INACTIVO" || r.estado === "DESACTIVADO").length), color: "text.secondary" },
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
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>
                {s.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    <Box sx={{ minHeight: 400 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={[
            {
              id: "nombre",
              label: "Persona",
              render: (row) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: "0.75rem",
                      bgcolor: "primary.main",
                    }}
                  >
                    {row.nombre.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.correo}
                    </Typography>
                  </Box>
                </Box>
              ),
            },
            {
              id: "identificacion",
              label: "Identificación",
              render: (row) => (
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {row.identificacion}
                </Typography>
              ),
            },
            {
              id: "rol",
              label: "Rol",
              render: (row) => (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color:
                      row.rol === "GUARD"
                        ? "warning.main"
                        : row.rol === "ADMIN"
                          ? "error.main"
                          : "text.primary",
                  }}
                >
                  {row.rol}
                </Typography>
              ),
            },
            {
              id: "estado",
              label: "Estado",
              render: (row) => <StatusChip kind="cuenta" value={row.estado} />,
            },
            {
              id: "ultimoLogin",
              label: "Último Login",
              render: (row) => (
                <Typography variant="caption" color="text.secondary">
                  {row.ultimoLogin}
                </Typography>
              ),
            },
          ]}
          rows={filteredRows}
          searchPlaceholder="Buscar por nombre, identificación o correo..."
          searchKeys={(r) => `${r.nombre} ${r.identificacion} ${r.correo}`}
          onRowClick={(row) => navigate(`/admin/registry/personas/${row.id}`)}
          rowActions={(row) => [
            {
              icon: <LockResetIcon fontSize="small" />,
              label: "Resetear contraseña",
              onClick: () =>
                setConfirm({
                  open: true,
                  title: "Resetear contraseña",
                  message: `Se generará una nueva contraseña temporal para ${row.correo} y se mostrará en pantalla. El usuario cambiará a estado "Pendiente de Contraseña". ¿Deseas continuar?`,
                  action: () => handleResetPassword(String(row.id)),
                }),
              color: "warning",
            },
            row.estado === "ACTIVO" ||
            row.estado === "PENDIENTE_CONTRASEÑA" ||
            row.estado === "PENDIENTE_BIOMETRIA"
              ? {
                  icon: <ToggleOffIcon fontSize="small" />,
                  label: "Desactivar",
                  onClick: () =>
                    setConfirm({
                      open: true,
                      title: "Desactivar cuenta",
                      message: `La cuenta de ${row.nombre} quedará desactivada y no podrá ingresar al sistema.`,
                      action: () => setConfirm((s) => ({ ...s, open: false })),
                    }),
                  color: "error",
                }
              : {
                  icon: <ToggleOnIcon fontSize="small" />,
                  label: "Activar",
                  onClick: () =>
                    setConfirm({
                      open: true,
                      title: "Activar cuenta",
                      message: `La cuenta de ${row.nombre} quedará activa de nuevo.`,
                      action: () => setConfirm((s) => ({ ...s, open: false })),
                    }),
                  color: "success",
                },
          ]}
        />
      )}
    </Box>

    <Dialog
      open={filterOpen}
      onClose={() => setFilterOpen(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Filtrar por Rol</DialogTitle>
      <DialogContent>
        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel>Rol</InputLabel>
          <Select
            value={filterRol}
            label="Rol"
            onChange={(e) => setFilterRol(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="Guardia">Guardia</MenuItem>
            <MenuItem value="Docente">Docente</MenuItem>
            <MenuItem value="Administrativo">Administrativo</MenuItem>
            <MenuItem value="Estudiante">Estudiante</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={() => {
            setFilterRol("");
            setFilterOpen(false);
          }}
          color="inherit"
        >
          Limpiar
        </Button>
        <Button variant="contained" onClick={() => setFilterOpen(false)}>
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>

    <ConfirmDialog
      open={confirm.open}
      title={confirm.title}
      message={confirm.message}
      destructive={confirm.title.includes("Desactivar")}
      onConfirm={() => confirm.action?.()}
      onClose={() => setConfirm((s) => ({ ...s, open: false }))}
    />

    <Dialog
      open={tempPassword.open}
      onClose={() => setTempPassword({ open: false, message: "" })}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LockResetIcon color="primary" />
        Contraseña Reseteada
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {tempPassword.message}
        </Typography>
        {tempPassword.password && (
          <Box
            sx={{
              p: 2,
              bgcolor: "background.default",
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontFamily: "monospace",
              fontSize: "1.2rem",
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {tempPassword.password}
            <Tooltip title="Copiar al portapapeles">
              <IconButton
                onClick={() =>
                  navigator.clipboard.writeText(tempPassword.password!)
                }
                size="small"
                color="primary"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setTempPassword({ open: false, message: "" })}
          variant="contained"
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);
}
