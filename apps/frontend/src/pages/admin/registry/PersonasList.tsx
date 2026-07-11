import { useState } from "react";
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
import PageHeader from "../../../components/admin-legacy/PageHeader";
import EditIcon from "@mui/icons-material/Edit";
import DataTable, {
  type Column,
} from "../../../components/admin-legacy/DataTable";
import StatusChip from "../../../components/admin-legacy/StatusChip";
import ConfirmDialog from "../../../components/admin-legacy/ConfirmDialog";
import RegistrarUnificadoModal from "./RegistrarUnificadoModal";
import { useQuery } from "@tanstack/react-query";
import { listarTodasPersonas, crearPersona } from "../../../services/registry.service";

interface Persona {
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
    | "DESACTIVADO"
    | "REVOCADA";
  tieneCuenta: boolean;
  esAgregado?: boolean;
  ultimoLogin: string | null;
}

// Personas se cargan y mantienen en estado para permitir CRUD en Admin

const columns: Column<Persona>[] = [
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
            bgcolor:
              row.rol === "Administrador" ? "error.main" : "primary.main",
          }}
        >
          {row.nombre.charAt(0)}
        </Avatar>
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: row.rol === "Administrador" ? "error.main" : "inherit",
            }}
          >
            {row.nombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
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
    label: "Rol",
    render: (row) => (
      <Typography
        variant="body1"
        sx={{
          fontWeight: row.rol === "Administrador" ? 700 : 400,
          color: row.rol === "Administrador" ? "error.main" : "inherit",
        }}
      >
        {row.rol}
      </Typography>
    ),
  },
  {
    id: "acceso",
    label: "Acceso y Vinculación",
    render: (row) => (
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {row.tieneCuenta && (
          <Chip
            label="Acceso al Sistema"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        )}
        {!row.tieneCuenta && !row.esAgregado && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>
            Solo Registro
          </Typography>
        )}
        {row.esAgregado && (
          <Chip
            label="Agregado"
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>
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
      <Typography variant="body2" color="text.secondary">
        {row.ultimoLogin || "-"}
      </Typography>
    ),
  },
];

export default function PersonasList() {
  const navigate = useNavigate();
  const { data: realPersonas = [], refetch } = useQuery({
    queryKey: ['personasDirectorio'],
    queryFn: listarTodasPersonas,
  });
  const [accessFilter, setAccessFilter] = useState("Todos");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    message: string;
    action?: () => void;
  }>({ open: false, title: "", message: "" });
  const [openUnificadoModal, setOpenUnificadoModal] = useState(false);
  const [editingPersona, setEditingPersona] =
    useState<any | null>(null);

  const rows: Persona[] = realPersonas.map((p) => ({
    id: p.personaId,
    identificacion: p.identificacionNumero,
    nombre: p.nombreCompleto,
    correo: p.correoInstitucional || "Sin correo",
    rol: "Sin Rol asignado",
    estado: p.estadoRegistro === "ACTIVO" ? "ACTIVO" : "INACTIVO",
    tieneCuenta: p.estadoBiometrico === "COMPLETO",
    esAgregado: false, // We'll need a better way to check this later
    ultimoLogin: null,
  }));

  const filteredRows = rows.filter((r) => {
    if (roleFilter !== "Todos" && r.rol !== roleFilter) return false;

    if (accessFilter === "Cuentas") return r.tieneCuenta;
    if (accessFilter === "Agregados") return r.esAgregado && !r.tieneCuenta;
    if (accessFilter === "AgregadosConCuenta")
      return r.esAgregado && r.tieneCuenta;

    return true;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (a.rol === "Administrador" && b.rol !== "Administrador") return -1;
    if (b.rol === "Administrador" && a.rol !== "Administrador") return 1;
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
            onClick={() => {
              setEditingPersona(null);
              setOpenUnificadoModal(true);
            }}
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
              <ToggleButton value="Agregados">Solo Agregados</ToggleButton>
              <ToggleButton value="AgregadosConCuenta">
                Agregados (Con Cuenta)
              </ToggleButton>
            </ToggleButtonGroup>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Rol</InputLabel>
              <Select
                value={roleFilter}
                label="Rol"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="Todos">Todos los roles</MenuItem>
                <MenuItem value="Estudiante">Estudiante</MenuItem>
                <MenuItem value="Docente">Docente</MenuItem>
                <MenuItem value="Administrativo">Administrativo</MenuItem>
                <MenuItem value="Guardia">Guardia</MenuItem>
                <MenuItem value="Agregado">Agregado</MenuItem>
              </Select>
            </FormControl>
          </Box>
        }
        onRowClick={(row) => navigate(`/admin/registry/personas/${row.id}`)}
        rowActions={(row) => {
          const actions: any[] = [];

          // Edit action
          actions.push({
            icon: <EditIcon fontSize="small" />,
            label: "Editar",
            onClick: () => {
              const p = realPersonas.find((x) => x.personaId === row.id);
              if (p) {
                setEditingPersona(p);
                setOpenUnificadoModal(true);
              }
            },
            color: "primary",
          });

          // Delete action
          actions.push({
            icon: <EditIcon fontSize="small" />,
            label: "Eliminar",
            onClick: () =>
              setConfirm({
                open: true,
                title: "Eliminar persona",
                message: `¿Eliminar a ${row.nombre}?`,
                action: () => {
                  // setPersonasData(updated); // TODO: Delete via API
                  setConfirm((s) => ({ ...s, open: false }));
                },
              }),
            color: "error",
          });

          if (row.tieneCuenta && row.rol !== "Administrador") {
            actions.push({
              icon: <LockResetIcon fontSize="small" />,
              label: "Resetear contraseña",
              onClick: () =>
                setConfirm({
                  open: true,
                  title: "Resetear contraseña",
                  message: `Se enviará una nueva contraseña temporal a ${row.correo}.`,
                  action: () => setConfirm((s) => ({ ...s, open: false })),
                }),
              color: "warning",
            });

            if (
              row.estado === "ACTIVO" ||
              row.estado === "PENDIENTE_CONTRASEÑA" ||
              row.estado === "PENDIENTE_BIOMETRIA"
            ) {
              actions.push({
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
                    action: () => setConfirm((s) => ({ ...s, open: false })),
                  }),
                color: "success",
              });
            }
          }
          return actions;
        }}
      />

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
        initialData={editingPersona ?? undefined}
        onClose={() => {
          setOpenUnificadoModal(false);
          setEditingPersona(null);
        }}
        onSuccess={async (data) => {
          if (!editingPersona) {
            try {
              let tipo = 'CEDULA';
              if (data.tipoId === 'Pasaporte') tipo = 'PASAPORTE';
              if (data.tipoId === 'RUC') tipo = 'RUC';
              
              await crearPersona({
                identificacionTipo: tipo as any,
                identificacionNumero: data.identificacion,
                nombres: data.nombres,
                apellidos: data.apellidos,
                correoInstitucional: data.correo || undefined,
                telefonoContacto: data.telefono || undefined,
              });
              refetch();
            } catch (error) {
              console.error(error);
              alert('Ocurrió un error al crear la persona.');
            }
          } else {
            // Edit is not yet connected to backend
            alert('La edición de personas aún está en desarrollo en el backend.');
          }
          setEditingPersona(null);
          setOpenUnificadoModal(false);
        }}
      />
    </Box>
  );
}
