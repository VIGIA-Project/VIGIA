import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockResetIcon from "@mui/icons-material/LockReset";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import ConfirmDialog from "../../../components/admin-legacy/ConfirmDialog";
import {
  useUsuariosAdmin,
  useActivarUsuarioAdmin,
  useDesactivarUsuarioAdmin,
  useResetearPasswordUsuarioAdmin,
} from "../../../hooks/useAdmin";
import { UserRole, UserStatus, UsuarioAdmin } from "../../../services/types/admin.types";

const rolLabel: Record<UserRole, string> = {
  ADMIN: "Administrador",
  GUARD: "Guardia",
  OWNER: "Propietario",
};

interface Row extends UsuarioAdmin {
  id: string;
}

const columns: Column<Row>[] = [
  {
    id: "email",
    label: "Cuenta",
    render: (row) => (
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {row.email}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.personaId ? `Persona ${row.personaId.slice(0, 8)}` : "Sin persona vinculada"}
        </Typography>
      </Box>
    ),
  },
  {
    id: "role",
    label: "Rol",
    render: (row) => (
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color:
            row.role === "GUARD"
              ? "warning.main"
              : row.role === "ADMIN"
                ? "error.main"
                : "text.primary",
        }}
      >
        {rolLabel[row.role]}
      </Typography>
    ),
  },
  {
    id: "status",
    label: "Estado",
    render: (row) => <StatusChip kind="cuenta" value={row.status} />,
  },
];

export default function CuentasList() {
  const [filterRol, setFilterRol] = useState<UserRole | "">("");
  const [filterEstado, setFilterEstado] = useState<UserStatus | "">("");
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    message: string;
    action?: () => void;
  }>({ open: false, title: "", message: "" });
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useUsuariosAdmin({
    role: filterRol || undefined,
    status: filterEstado || undefined,
    limit: 100,
  });

  const activar = useActivarUsuarioAdmin();
  const desactivar = useDesactivarUsuarioAdmin();
  const resetPassword = useResetearPasswordUsuarioAdmin();

  const rows: Row[] = (data?.data ?? []).map((u) => ({ ...u, id: u.id }));

  return (
    <Box>
      <PageHeader
        title="Cuentas de Usuario"
        subtitle="Gestión de cuentas de acceso al sistema VIGIA"
        breadcrumbs={[{ label: "Auth" }, { label: "Cuentas de Usuario" }]}
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: "Cuentas Activas", value: rows.filter((r) => r.status === "ACTIVE").length, color: "success.main" },
          { label: "Pendientes de Cambio", value: rows.filter((r) => r.status === "PENDING_PASSWORD_CHANGE").length, color: "warning.main" },
          { label: "Inactivas", value: rows.filter((r) => r.status === "INACTIVE").length, color: "text.secondary" },
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
                  {isLoading ? "-" : s.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isLoading ? (
        <Skeleton variant="rounded" height={320} />
      ) : isError ? (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => refetch()}>Reintentar</Button>}>
          No se pudieron cargar las cuentas de usuario.
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          searchPlaceholder="Buscar por correo..."
          searchKeys={(r) => r.email}
          headerActions={
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={filterRol}
                  label="Rol"
                  onChange={(e) => setFilterRol(e.target.value as UserRole | "")}
                >
                  <MenuItem value="">Todos los roles</MenuItem>
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                  <MenuItem value="GUARD">Guardia</MenuItem>
                  <MenuItem value="OWNER">Propietario</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filterEstado}
                  label="Estado"
                  onChange={(e) => setFilterEstado(e.target.value as UserStatus | "")}
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value="ACTIVE">Activa</MenuItem>
                  <MenuItem value="INACTIVE">Inactiva</MenuItem>
                  <MenuItem value="PENDING_PASSWORD_CHANGE">Cambio de contraseña pendiente</MenuItem>
                </Select>
              </FormControl>
            </Box>
          }
          rowActions={(row) => [
            {
              icon: <LockResetIcon fontSize="small" />,
              label: "Resetear contraseña",
              onClick: () =>
                setConfirm({
                  open: true,
                  title: "Resetear contraseña",
                  message: `Se generará una nueva contraseña temporal para ${row.email}.`,
                  action: () => {
                    resetPassword.mutate(row.id, {
                      onSuccess: (result) => setTempPassword(result.temporaryPassword),
                    });
                    setConfirm((s) => ({ ...s, open: false }));
                  },
                }),
              color: "warning",
            },
            row.status === "ACTIVE" || row.status === "PENDING_PASSWORD_CHANGE"
              ? {
                  icon: <ToggleOffIcon fontSize="small" />,
                  label: "Desactivar",
                  onClick: () =>
                    setConfirm({
                      open: true,
                      title: "Desactivar cuenta",
                      message: `La cuenta ${row.email} quedará desactivada y no podrá ingresar al sistema.`,
                      action: () => {
                        desactivar.mutate(row.id);
                        setConfirm((s) => ({ ...s, open: false }));
                      },
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
                      message: `La cuenta ${row.email} quedará activa de nuevo.`,
                      action: () => {
                        activar.mutate(row.id);
                        setConfirm((s) => ({ ...s, open: false }));
                      },
                    }),
                  color: "success",
                },
          ]}
        />
      )}

      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        destructive={confirm.title.includes("Desactivar")}
        onConfirm={() => confirm.action?.()}
        onClose={() => setConfirm((s) => ({ ...s, open: false }))}
      />

      <Dialog open={!!tempPassword} onClose={() => setTempPassword(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Contraseña temporal generada</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Esta contraseña se muestra una única vez. Compártela de forma segura con el usuario.
          </Typography>
          <TextField
            fullWidth
            value={tempPassword ?? ""}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => tempPassword && navigator.clipboard.writeText(tempPassword)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="contained" onClick={() => setTempPassword(null)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
