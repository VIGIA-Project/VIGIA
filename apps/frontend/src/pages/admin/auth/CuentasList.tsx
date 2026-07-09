import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BadgeIcon from '@mui/icons-material/Badge';
import LockResetIcon from '@mui/icons-material/LockReset';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import ConfirmDialog from '../../../components/admin-legacy/ConfirmDialog';

interface Cuenta {
  id: number;
  identificacion: string;
  nombre: string;
  correo: string;
  rol: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'PENDIENTE_CONTRASEÑA' | 'PENDIENTE_BIOMETRIA' | 'DESACTIVADO';
  ultimoLogin: string;
}

const rows: Cuenta[] = [
  { id: 1, identificacion: '1712345670', nombre: 'Administrador del Sistema', correo: 'admin@uce.edu.ec', rol: 'Administrador', estado: 'ACTIVO', ultimoLogin: '2024-08-20 08:15' },
  { id: 2, identificacion: '1718901235', nombre: 'Juan Pérez Guardia', correo: 'jperez@uce.edu.ec', rol: 'Guardia', estado: 'PENDIENTE_CONTRASEÑA', ultimoLogin: 'Nunca' },
  { id: 3, identificacion: '1712345678', nombre: 'María Fernanda López', correo: 'mflopez@uce.edu.ec', rol: 'Docente', estado: 'ACTIVO', ultimoLogin: '2024-08-19 14:32' },
  { id: 4, identificacion: '1718901234', nombre: 'Carlos Andrés Mendoza', correo: 'camendoza@uce.edu.ec', rol: 'Guardia', estado: 'PENDIENTE_BIOMETRIA', ultimoLogin: '2024-08-20 06:00' },
  { id: 5, identificacion: '1709876543', nombre: 'Patricia Salazar Naranjo', correo: 'psalazar@uce.edu.ec', rol: 'Administrativo', estado: 'DESACTIVADO', ultimoLogin: '2024-07-15 10:20' },
  { id: 6, identificacion: '1714567890', nombre: 'Jorge Luis Velasteguí', correo: 'jvelastegui@uce.edu.ec', rol: 'Guardia', estado: 'ACTIVO', ultimoLogin: '2024-08-20 07:45' },
];

const columns: Column<Cuenta>[] = [
  {
    id: 'nombre',
    label: 'Persona',
    render: (row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
          {row.nombre.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.nombre}</Typography>
          <Typography variant="caption" color="text.secondary">{row.correo}</Typography>
        </Box>
      </Box>
    ),
  },
  { id: 'identificacion', label: 'Identificación', render: (row) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.identificacion}</Typography> },
  { id: 'rol', label: 'Rol', render: (row) => <Typography variant="body2" sx={{ fontWeight: 600, color: row.rol === 'Guardia' ? 'warning.main' : row.rol === 'Administrador' ? 'error.main' : 'text.primary' }}>{row.rol}</Typography> },
  { id: 'estado', label: 'Estado', render: (row) => <StatusChip kind="cuenta" value={row.estado} /> },
  { id: 'ultimoLogin', label: 'Último Login', render: (row) => <Typography variant="caption" color="text.secondary">{row.ultimoLogin}</Typography> },
];

export default function CuentasList() {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterRol, setFilterRol] = useState<string>('');
  const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; action?: () => void }>({ open: false, title: '', message: '' });

  const filteredRows = filterRol ? rows.filter((r) => r.rol === filterRol) : rows;

  return (
    <Box>
      <PageHeader
        title="Cuentas de Usuario"
        subtitle="Gestión de cuentas de acceso al sistema VIGIA"
        breadcrumbs={[{ label: 'Auth' }, { label: 'Cuentas de Usuario' }]}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/admin/registro/usuario')}
            >
              Registrar Usuario
            </Button>
            <Button
              variant="outlined"
              startIcon={<BadgeIcon />}
              onClick={() => navigate('/admin/registro/guardia')}
              sx={{ borderColor: 'warning.main', color: 'warning.main', '&:hover': { borderColor: 'warning.dark', bgcolor: 'warning.main', color: '#fff' } }}
            >
              Registrar Guardia
            </Button>
          </Box>
        }
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { label: 'Cuentas Activas', value: '4', color: 'success.main' },
          { label: 'Pendientes de Cambio', value: '1', color: 'warning.main' },
          { label: 'Inactivas', value: '1', color: 'text.secondary' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 4 }}>
            <Card><CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      <DataTable
        columns={columns}
        rows={filteredRows}
        searchPlaceholder="Buscar por nombre, identificación o correo..."
        searchKeys={(r) => `${r.nombre} ${r.identificacion} ${r.correo}`}
        onRowClick={(row) => navigate(`/admin/registry/personas/${row.id}`)}
        rowActions={(row) => [
          { icon: <LockResetIcon fontSize="small" />, label: 'Resetear contraseña', onClick: () => setConfirm({ open: true, title: 'Resetear contraseña', message: `Se enviará una nueva contraseña temporal a ${row.correo}.`, action: () => setConfirm((s) => ({ ...s, open: false })) }), color: 'warning' },
          row.estado === 'ACTIVO' || row.estado === 'PENDIENTE_CONTRASEÑA' || row.estado === 'PENDIENTE_BIOMETRIA'
            ? { icon: <ToggleOffIcon fontSize="small" />, label: 'Desactivar', onClick: () => setConfirm({ open: true, title: 'Desactivar cuenta', message: `La cuenta de ${row.nombre} quedará desactivada y no podrá ingresar al sistema.`, action: () => setConfirm((s) => ({ ...s, open: false })) }), color: 'error' }
            : { icon: <ToggleOnIcon fontSize="small" />, label: 'Activar', onClick: () => setConfirm({ open: true, title: 'Activar cuenta', message: `La cuenta de ${row.nombre} quedará activa de nuevo.`, action: () => setConfirm((s) => ({ ...s, open: false })) }), color: 'success' },
        ]}
      />

      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Filtrar por Rol</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>Rol</InputLabel>
            <Select value={filterRol} label="Rol" onChange={(e) => setFilterRol(e.target.value)}>
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
          <Button onClick={() => { setFilterRol(''); setFilterOpen(false); }} color="inherit">Limpiar</Button>
          <Button variant="contained" onClick={() => setFilterOpen(false)}>Aplicar</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        destructive={confirm.title.includes('Desactivar')}
        onConfirm={() => confirm.action?.()}
        onClose={() => setConfirm((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
}
