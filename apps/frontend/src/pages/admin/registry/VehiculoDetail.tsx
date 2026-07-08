import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import DataTable, { type Column } from '../../../components/admin-legacy/DataTable';

interface Autorizacion {
  id: number;
  persona: string;
  tipo: 'Permanente' | 'Temporal';
  estado: 'ACTIVA' | 'INACTIVA' | 'EXPIRADO';
  vigencia: string;
}

const autorizaciones: Autorizacion[] = [
  { id: 1, persona: 'María Fernanda López', tipo: 'Permanente', estado: 'ACTIVA', vigencia: 'Indefinida' },
  { id: 2, persona: 'Carlos Andrés Mendoza', tipo: 'Temporal', estado: 'ACTIVA', vigencia: 'Hasta 2024-12-31' },
];

export default function VehiculoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const authCols: Column<Autorizacion>[] = [
    { id: 'persona', label: 'Persona', render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.persona}</Typography> },
    { id: 'tipo', label: 'Tipo', render: (r) => r.tipo },
    { id: 'estado', label: 'Estado', render: (r) => <StatusChip kind="autorizacion" value={r.estado} /> },
    { id: 'vigencia', label: 'Vigencia', render: (r) => r.vigencia },
  ];

  return (
    <Box>
      <PageHeader
        title="Detalle de Vehículo"
        breadcrumbs={[{ label: 'Registry', href: '#/admin/registry/vehiculos' }, { label: 'Vehículos', href: '#/admin/registry/vehiculos' }, { label: `ID ${id}` }]}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/registry/vehiculos')}>Volver</Button>
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/admin/registry/vehiculos/${id}/editar`)}>Editar</Button>
          </Box>
        }
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ width: 72, height: 72, borderRadius: 2, background: 'linear-gradient(135deg, #19D6C4 0%, #0D5CCF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DirectionsCarIcon sx={{ fontSize: 36, color: '#fff' }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>ABC-0123</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Toyota Corolla 2022 · Blanco</Typography>
              <StatusChip kind="cuenta" value="ACTIVO" />
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
            <Tab label="Resumen" />
            <Tab label="Autorizaciones" />
          </Tabs>
        </Box>
        <CardContent>
          {tab === 0 && (
            <Grid container spacing={3}>
              {[
                ['Placa', 'ABC-0123'],
                ['Marca', 'Toyota'],
                ['Modelo', 'Corolla'],
                ['Año', '2022'],
                ['Color', 'Blanco'],
                ['Propietario', 'María Fernanda López'],
                ['Fecha de registro', '2022-03-15'],
                ['Última modificación', '2024-08-10'],
              ].map(([label, value]) => (
                <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
                </Grid>
              ))}
            </Grid>
          )}
          {tab === 1 && <DataTable columns={authCols} rows={autorizaciones} searchKeys={(r) => r.persona} />}
        </CardContent>
      </Card>
    </Box>
  );
}
