import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';
import StatusChip from '../../../components/admin-legacy/StatusChip';

interface Vehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
  propietario: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

const rows: Vehiculo[] = [
  { id: 1, placa: 'ABC-0123', marca: 'Toyota', modelo: 'Corolla', anio: '2022', color: 'Blanco', propietario: 'María Fernanda López', estado: 'ACTIVO' },
  { id: 2, placa: 'PBC-1231', marca: 'Chevrolet', modelo: 'Spark', anio: '2021', color: 'Gris', propietario: 'Carlos Andrés Mendoza', estado: 'ACTIVO' },
  { id: 3, placa: 'GTR-8832', marca: 'Mazda', modelo: 'CX-5', anio: '2020', color: 'Negro', propietario: 'Diego Fernando Ramírez', estado: 'ACTIVO' },
  { id: 4, placa: 'XYZ-4567', marca: 'Kia', modelo: 'Sportage', anio: '2023', color: 'Azul', propietario: 'Patricia Salazar Naranjo', estado: 'ACTIVO' },
  { id: 5, placa: 'MNL-7788', marca: 'Hyundai', modelo: 'Tucson', anio: '2019', color: 'Rojo', propietario: 'Jorge Luis Velasteguí', estado: 'INACTIVO' },
  { id: 6, placa: 'UCE-0001', marca: 'Nissan', modelo: 'Sentra', anio: '2022', color: 'Plata', propietario: 'Ana Lucía Paredes', estado: 'ACTIVO' },
  { id: 7, placa: 'TST-9921', marca: 'Suzuki', modelo: 'Vitara', anio: '2021', color: 'Verde', propietario: 'Sofía Elizabeth Cevallos', estado: 'ACTIVO' },
  { id: 8, placa: 'KJH-3344', marca: 'Honda', modelo: 'CR-V', anio: '2020', color: 'Blanco', propietario: 'Manuel José Borrero', estado: 'ACTIVO' },
];

const columns: Column<Vehiculo>[] = [
  {
    id: 'placa',
    label: 'Placa',
    render: (row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DirectionsCarIcon sx={{ fontSize: 18, color: 'primary.main' }} />
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{row.placa}</Typography>
      </Box>
    ),
  },
  { id: 'marca', label: 'Marca / Modelo', render: (row) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.marca} {row.modelo}</Typography> },
  { id: 'anio', label: 'Año', render: (row) => row.anio },
  { id: 'color', label: 'Color', render: (row) => row.color },
  { id: 'propietario', label: 'Propietario', render: (row) => <Typography variant="body2">{row.propietario}</Typography> },
  { id: 'estado', label: 'Estado', render: (row) => <StatusChip kind="cuenta" value={row.estado} /> },
];

export default function VehiculosList() {
  const navigate = useNavigate();
  return (
    <Box>
      <PageHeader
        title="Vehículos"
        subtitle="Gestión de vehículos registrados en el sistema VIGIA"
        breadcrumbs={[{ label: 'Registry' }, { label: 'Vehículos' }]}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/registry/vehiculos/nuevo')}>
            Nuevo Vehículo
          </Button>
        }
      />
      <DataTable
        columns={columns}
        rows={rows}
        searchPlaceholder="Buscar por placa, marca o propietario..."
        searchKeys={(r) => `${r.placa} ${r.marca} ${r.modelo} ${r.propietario}`}
        onRowClick={(row) => navigate(`/admin/registry/vehiculos/${row.id}`)}
        rowActions={(row) => [
          { icon: <VisibilityIcon fontSize="small" />, label: 'Ver detalle', onClick: () => navigate(`/admin/registry/vehiculos/${row.id}`), color: 'primary' },
          { icon: <EditIcon fontSize="small" />, label: 'Editar', onClick: () => navigate(`/admin/registry/vehiculos/${row.id}/editar`), color: 'info' },
        ]}
      />
    </Box>
  );
}
