import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockResetIcon from "@mui/icons-material/LockReset";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CircularProgress from "@mui/material/CircularProgress";
import PageHeader from "../../../components/admin-legacy/PageHeader";
import DataTable, { type Column } from "../../../components/admin-legacy/DataTable";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import ConfirmDialog from "../../../components/admin-legacy/ConfirmDialog";
import RegistrarUnificadoModal from "./RegistrarUnificadoModal";
import { registryService, Persona } from "../../../services/registry.service";
import { authService, UserResponseDto } from "../../../services/auth.service";

interface UnifiedRow {
  id: string; // The User ID or Persona ID
  userId?: string;
  personaId?: string;
  identificacion: string;
  nombre: string;
  correo: string;
  rol: string; // System role
  rolInstitucional: string; // Institutional role
  estado: string;
  tieneCuenta: boolean;
  ultimoLogin: string | null;
}

const columns: Column<UnifiedRow>[] = [
  {
    id: "nombre",
    label: "Persona",
    render: (row) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar
          sx={{
            width: 34,
            height: 34,
            fontSize: "0.8rem",
            bgcolor: row.rol === "ADMIN" ? "error.main" : "primary.main",
          }}
        >
          {row.nombre.charAt(0)}
        </Avatar>
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: row.rol === "ADMIN" ? "error.main" : "inherit",
            }}
          >
            {row.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
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
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {row.identificacion}
      </Typography>
    ),
  },
  {
    id: "rol",
    label: "Rol Sistema",
    render: (row) => (
      <Typography
        variant="body1"
        sx={{
          fontWeight: row.rol === "ADMIN" ? 700 : 400,
          color: row.rol === "ADMIN" ? "error.main" : "inherit",
        }}
      >
        {row.rol}
      </Typography>
    ),
  },
  {
    id: "rolInstitucional",
    label: "Rol Institucional",
    render: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.rolInstitucional}
      </Typography>
    ),
  },
  {
    id: "acceso",
    label: "Acceso y Vinculación",
    render: (row) => (
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {row.tieneCuenta ? (
          <Chip
            label="Acceso al Sistema"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary" component="div" sx={{ py: 0.5 }}>
            Solo Registro
          </Typography>
        )}
      </Box>
    ),
  },
  {
    id: "estado",
    label: "Estado",
    render: (row) => (
      <Box sx={{ display: 'inline-flex' }}>
        <StatusChip kind="cuenta" value={row.estado} />
      </Box>
    ),
  },
  {
    id: "ultimoLogin",
    label: "Último Login",
    render: (row) => (
      <Typography variant="body2" color="text.secondary" component="div">
        {row.ultimoLogin || "-"}
      </Typography>
    ),
  },
];

export default function PersonasList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<UnifiedRow[]>([]);
  const [accessFilter, setAccessFilter] = useState("Todos");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    message: string;
    action?: () => Promise<void>;
  }>({ open: false, title: "", message: "" });
  const [openUnificadoModal, setOpenUnificadoModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [personasRes, usersRes] = await Promise.all([
        registryService.getPersonas().catch(() => []),
        authService.getUsers().catch(() => ({ data: [] } as any)),
      ]);

      const personas: Persona[] = Array.isArray(personasRes) ? personasRes : [];
      const users: UserResponseDto[] = usersRes?.data || [];

      // Merge data
      const unifiedRows: UnifiedRow[] = [];
      const personaMap = new Map(personas.map(p => [p.personaId, p]));

      // 1. Process all users
      for (const user of users) {
        let p = user.personaId ? personaMap.get(user.personaId) : null;
        unifiedRows.push({
          id: user.id || `user-${Math.random()}`,
          userId: user.id,
          personaId: user.personaId,
          identificacion: p?.identificacionNumero || "---",
          nombre: p ? p.nombreCompleto || `${p.nombres} ${p.apellidos}`.trim() : "Usuario del sistema",
          correo: p?.correoInstitucional || user.email,
          rol: user.role,
          rolInstitucional: p?.rolInstitucional || "N/A",
          estado: user.status,
          tieneCuenta: true,
          ultimoLogin: null,
        });
        if (p) personaMap.delete(p.personaId); // Mark as processed
      }

      // 2. Process remaining personas (no user account)
      for (const p of Array.from(personaMap.values())) {
        unifiedRows.push({
          id: p.personaId || `persona-${Math.random()}`,
          userId: undefined,
          personaId: p.personaId,
          identificacion: p.identificacionNumero,
          nombre: p.nombreCompleto || `${p.nombres} ${p.apellidos}`.trim(),
          correo: p.correoInstitucional || "---",
          rol: "N/A", // System role is N/A since there's no account
          rolInstitucional: p.rolInstitucional || "N/A",
          estado: p.estadoRegistro,
          tieneCuenta: false,
          ultimoLogin: null,
        });
      }

      setRows(unifiedRows);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRows = rows.filter((r) => {
    if (roleFilter !== "Todos" && r.rol !== roleFilter) return false;
    if (accessFilter === "Cuentas") return r.tieneCuenta;
    if (accessFilter === "SinCuenta") return !r.tieneCuenta;
    return true;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (a.rol === "ADMIN" && b.rol !== "ADMIN") return -1;
    if (b.rol === "ADMIN" && a.rol !== "ADMIN") return 1;
    return 0;
  });

  return (
    <Box>
      <PageHeader
        title="Directorio General"
        subtitle="Gestión unificada de usuarios y personas registradas en el sistema VIGIA"
        breadcrumbs={[{ label: "Registro" }, { label: "Directorio General" }]}
        action={
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setOpenUnificadoModal(true)}
          >
            Registrar Persona
          </Button>
        }
      />

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {sortedRows.length} registros encontrados
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={columns}
          rows={sortedRows}
          searchPlaceholder="Buscar por nombre, identificación o correo..."
          searchKeys={(r) => `${r.nombre} ${r.identificacion} ${r.correo}`}
          headerActions={
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <ToggleButtonGroup
                value={accessFilter}
                exclusive
                onChange={(_e, val) => {
                  if (val) setAccessFilter(val);
                }}
                size="small"
                sx={{
                  "& .MuiToggleButton-root": {
                    textTransform: "none",
                    px: 2,
                    borderRadius: 8,
                  },
                }}
              >
                <ToggleButton value="Todos">Todos</ToggleButton>
                <ToggleButton value="Cuentas">Con Cuenta</ToggleButton>
                <ToggleButton value="SinCuenta">Solo Personas</ToggleButton>
              </ToggleButtonGroup>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={roleFilter}
                  label="Rol"
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <MenuItem value="Todos">Todos los roles</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="USER">USER</MenuItem>
                  <MenuItem value="GUARD">GUARD</MenuItem>
                  <MenuItem value="OWNER">OWNER</MenuItem>
                </Select>
              </FormControl>
            </Box>
          }
          // onRowClick={(row) => navigate(`/admin/registry/personas/${row.personaId || row.userId}`)}
          rowActions={(row) => {
            const actions: any[] = [];

            if (row.tieneCuenta && row.userId && row.rol !== "Administrador" && row.rol !== "ADMIN") {
              actions.push({
                icon: <LockResetIcon fontSize="small" />,
                label: "Resetear contraseña",
                onClick: () =>
                  setConfirm({
                    open: true,
                    title: "Resetear contraseña",
                    message: `Se enviará una nueva contraseña temporal a ${row.correo}.`,
                    action: async () => {
                      await authService.resetPassword(row.userId!);
                      setConfirm((s) => ({ ...s, open: false }));
                      loadData();
                    },
                  }),
                color: "warning",
              });

              if (row.estado === "ACTIVE" || row.estado === "PENDING_PASSWORD_CHANGE") {
                actions.push({
                  icon: <ToggleOffIcon fontSize="small" />,
                  label: "Desactivar",
                  onClick: () =>
                    setConfirm({
                      open: true,
                      title: "Desactivar cuenta",
                      message: `La cuenta de ${row.nombre} quedará desactivada y no podrá ingresar al sistema.`,
                      action: async () => {
                        await authService.deactivateUser(row.userId!);
                        setConfirm((s) => ({ ...s, open: false }));
                        loadData();
                      },
                    }),
                  color: "error",
                });
              } else {
                actions.push({
                  icon: <ToggleOnIcon fontSize="small" />,
                  label: "Activar",
                  onClick: () =>
                    setConfirm({
                      open: true,
                      title: "Activar cuenta",
                      message: `La cuenta de ${row.nombre} quedará activa de nuevo.`,
                      action: async () => {
                        await authService.activateUser(row.userId!);
                        setConfirm((s) => ({ ...s, open: false }));
                        loadData();
                      },
                    }),
                  color: "success",
                });
              }
            }
            return actions;
          }}
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

      <RegistrarUnificadoModal
        open={openUnificadoModal}
        onClose={() => setOpenUnificadoModal(false)}
        onSuccess={() => {
          setOpenUnificadoModal(false);
          loadData();
        }}
      />
    </Box>
  );
}
