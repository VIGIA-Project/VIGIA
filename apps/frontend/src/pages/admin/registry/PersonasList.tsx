import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LockResetIcon from '@mui/icons-material/LockReset';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import ConfirmDialog from '../../../components/admin-legacy/ConfirmDialog';
import RegistrarUnificadoModal from './RegistrarUnificadoModal';

interface Persona {
  id: number;
  identificacion: string;
  nombre: string;
  correo: string;
  rol: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'PENDIENTE_CONTRASEÑA' | 'PENDIENTE_BIOMETRIA' | 'DESACTIVADO';
  tieneCuenta: boolean;
  esAgregado?: boolean;
  ultimoLogin: string | null;
}

const rows: Persona[] = [
  { id: 13, identificacion: '1712345670', nombre: 'Administrador del Sistema', correo: 'admin@uce.edu.ec', rol: 'Administrador', estado: 'ACTIVO', tieneCuenta: true, ultimoLogin: '2024-08-20 08:15' },
  { id: 1, identificacion: '1712345678', nombre: 'María Fernanda López', correo: 'mflopez@uce.edu.ec', rol: 'Docente', estado: 'PENDIENTE_BIOMETRIA', tieneCuenta: true, esAgregado: true, ultimoLogin: '2024-08-19 14:32' },
  { id: 2, identificacion: '1718901234', nombre: 'Carlos Andrés Mendoza', correo: 'camendoza@uce.edu.ec', rol: 'Guardia', estado: 'ACTIVO', tieneCuenta: true, ultimoLogin: '2024-08-20 06:00' },
  { id: 3, identificacion: '1709876543', nombre: 'Patricia Salazar Naranjo', correo: 'psalazar@uce.edu.ec', rol: 'Administrativo', estado: 'ACTIVO', tieneCuenta: true, ultimoLogin: '2024-08-15 10:20' },
  { id: 4, identificacion: '1714567890', nombre: 'Jorge Luis Velasteguí', correo: 'jvelastegui@uce.edu.ec', rol: 'Agregado', estado: 'ACTIVO', tieneCuenta: false, esAgregado: true, ultimoLogin: null },
  { id: 5, identificacion: '1723456789', nombre: 'Ana Lucía Paredes', correo: 'alparedes@uce.edu.ec', rol: 'Estudiante', estado: 'DESACTIVADO', tieneCuenta: true, ultimoLogin: '2024-07-15 10:20' },
  { id: 6, identificacion: '1716789012', nombre: 'Diego Fernando Ramírez', correo: 'dramirez@uce.edu.ec', rol: 'Administrativo', estado: 'ACTIVO', tieneCuenta: true, ultimoLogin: '2024-08-19 09:15' },
  { id: 7, identificacion: '1713456012', nombre: 'Sofía Elizabeth Cevallos', correo: 'scevallos@uce.edu.ec', rol: 'Agregado', estado: 'ACTIVO', tieneCuenta: false, esAgregado: true, ultimoLogin: null },
  { id: 8, identificacion: '1790123456', nombre: 'Manuel José Borrero', correo: 'mborrero@uce.edu.ec', rol: 'Estudiante', estado: 'PENDIENTE_CONTRASEÑA', tieneCuenta: true, esAgregado: true, ultimoLogin: 'Nunca' },
  { id: 9, identificacion: '1704567890', nombre: 'Gabriela del Rosario Torres', correo: 'gtorres@uce.edu.ec', rol: 'Administrativo', estado: 'INACTIVO', tieneCuenta: true, ultimoLogin: '2024-01-10 11:00' },
  { id: 10, identificacion: '1715678901', nombre: 'Roberto Carlos Andrade', correo: 'randrade@uce.edu.ec', rol: 'Docente', estado: 'ACTIVO', tieneCuenta: true, ultimoLogin: '2024-08-20 07:30' },
  { id: 11, identificacion: '1716789023', nombre: 'Valentina Pérez Maldonado', correo: 'vperez@uce.edu.ec', rol: 'Estudiante', estado: 'ACTIVO', tieneCuenta: true, ultimoLogin: '2024-08-18 16:45' },
  { id: 12, identificacion: '1717890123', nombre: 'Esteban Xavier Gualotuña', correo: 'egualotuna@uce.edu.ec', rol: 'Agregado', estado: 'ACTIVO', tieneCuenta: false, esAgregado: true, ultimoLogin: null },
];

const columns: Column<Persona>[] = [
  {
    id: 'nombre',
    label: 'Persona',
    render: (row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 34, height: 34, fontSize: '0.8rem', bgcolor: row.rol === 'Administrador' ? 'error.main' : 'primary.main' }}>
          {row.nombre.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600, color: row.rol === 'Administrador' ? 'error.main' : 'inherit' }}>{row.nombre}</Typography>
          <Typography variant="body2" color="text.secondary">{row.correo}</Typography>
        </Box>
      </Box>
    ),
  },
  { id: 'identificacion', label: 'Identificación', render: (row) => <Typography variant="body1" sx={{ fontWeight: 500 }}>{row.identificacion}</Typography> },
  { id: 'rol', label: 'Rol', render: (row) => <Typography variant="body1" sx={{ fontWeight: row.rol === 'Administrador' ? 700 : 400, color: row.rol === 'Administrador' ? 'error.main' : 'inherit' }}>{row.rol}</Typography> },
  {
    id: 'acceso', label: 'Acceso y Vinculación', render: (row) => (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {row.tieneCuenta && <Chip label="Acceso al Sistema" size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />}
        {!row.tieneCuenta && !row.esAgregado && <Typography variant="body2" color="text.secondary" sx={{ py: 0.5 }}>Solo Registro</Typography>}
        {row.esAgregado && <Chip label="Agregado" size="small" color="secondary" variant="outlined" sx={{ fontWeight: 600 }} />}
      </Box>
    )
  },
  { id: 'estado', label: 'Estado', render: (row) => <StatusChip kind="cuenta" value={row.estado} /> },
  { id: 'ultimoLogin', label: 'Último Login', render: (row) => <Typography variant="body2" color="text.secondary">{row.ultimoLogin || '-'}</Typography> },
];

export default function PersonasList() {
  const navigate = useNavigate();
  const [accessFilter, setAccessFilter] = useState('Todos');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; action?: () => void }>({ open: false, title: '', message: '' });
  const [openUnificadoModal, setOpenUnificadoModal] = useState(false);

  const filteredRows = rows.filter(r => {
    if (roleFilter !== 'Todos' && r.rol !== roleFilter) return false;

    if (accessFilter === 'Cuentas') return r.tieneCuenta;
    if (accessFilter === 'Agregados') return r.esAgregado && !r.tieneCuenta;
    if (accessFilter === 'AgregadosConCuenta') return r.esAgregado && r.tieneCuenta;

    return true;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (a.rol === 'Administrador' && b.rol !== 'Administrador') return -1;
    if (b.rol === 'Administrador' && a.rol !== 'Administrador') return 1;
    return 0;
  });

  return (
    <Box>
      <PageHeader
        title="Directorio General"
        subtitle="Gestión unificada de usuarios y personas registradas en el sistema VIGIA"
        breadcrumbs={[{ label: 'Registro' }, { label: 'Directorio General' }]}
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

      <DataTable
        columns={columns}
        rows={sortedRows}
        searchPlaceholder="Buscar por nombre, identificación o correo..."
        searchKeys={(r) => `${r.nombre} ${r.identificacion} ${r.correo}`}
        headerActions={
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <ToggleButtonGroup
              value={accessFilter}
              exclusive
              onChange={(_e, val) => { if (val) setAccessFilter(val); }}
              size="small"
              sx={{ '& .MuiToggleButton-root': { textTransform: 'none', px: 2, borderRadius: 8 } }}
            >
              <ToggleButton value="Todos">Todos</ToggleButton>
              <ToggleButton value="Cuentas">Con Cuenta</ToggleButton>
              <ToggleButton value="Agregados">Solo Agregados</ToggleButton>
              <ToggleButton value="AgregadosConCuenta">Agregados (Con Cuenta)</ToggleButton>
            </ToggleButtonGroup>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Rol</InputLabel>
              <Select value={roleFilter} label="Rol" onChange={(e) => setRoleFilter(e.target.value)}>
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

          if (row.tieneCuenta && row.rol !== 'Administrador') {
            actions.push({ icon: <LockResetIcon fontSize="small" />, label: 'Resetear contraseña', onClick: () => setConfirm({ open: true, title: 'Resetear contraseña', message: `Se enviará una nueva contraseña temporal a ${row.correo}.`, action: () => setConfirm((s) => ({ ...s, open: false })) }), color: 'warning' });

            if (row.estado === 'ACTIVO' || row.estado === 'PENDIENTE_CONTRASEÑA' || row.estado === 'PENDIENTE_BIOMETRIA') {
              actions.push({ icon: <ToggleOffIcon fontSize="small" />, label: 'Desactivar', onClick: () => setConfirm({ open: true, title: 'Desactivar cuenta', message: `La cuenta de ${row.nombre} quedará desactivada y no podrá ingresar al sistema.`, action: () => setConfirm((s) => ({ ...s, open: false })) }), color: 'error' });
            } else {
              actions.push({ icon: <ToggleOnIcon fontSize="small" />, label: 'Activar', onClick: () => setConfirm({ open: true, title: 'Activar cuenta', message: `La cuenta de ${row.nombre} quedará activa de nuevo.`, action: () => setConfirm((s) => ({ ...s, open: false })) }), color: 'success' });
            }
          }
          return actions;
        }}
      />

      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        destructive={confirm.title.includes('Desactivar')}
        onConfirm={() => confirm.action?.()}
        onClose={() => setConfirm((s) => ({ ...s, open: false }))}
      />

      <RegistrarUnificadoModal
        open={openUnificadoModal}
        onClose={() => setOpenUnificadoModal(false)}
        onSuccess={(data) => {
          console.log('Registro unificado:', data);
          // TODO: update list or refetch data
        }}
      />
    </Box>
  );
}
