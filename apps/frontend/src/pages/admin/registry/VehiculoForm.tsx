import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageHeader from '../../../components/admin-legacy/PageHeader';

const personas = [
  'María Fernanda López',
  'Carlos Andrés Mendoza',
  'Patricia Salazar Naranjo',
  'Jorge Luis Velasteguí',
];

export default function VehiculoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  return (
    <Box>
      <PageHeader
        title={isEdit ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        breadcrumbs={[{ label: 'Registry', href: '#/admin/registry/vehiculos' }, { label: 'Vehículos', href: '#/admin/registry/vehiculos' }, { label: isEdit ? 'Editar' : 'Nuevo' }]}
        action={<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/registry/vehiculos')}>Volver</Button>}
      />
      <Card>
        <CardContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Datos del Vehículo</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField fullWidth label="Placa" placeholder="ABC-0123" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField fullWidth label="Marca" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField fullWidth label="Modelo" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField fullWidth label="Año" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField fullWidth label="Color" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField fullWidth label="Tipo" placeholder="Sedan, SUV, etc." />
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Propietario</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Autocomplete
                    options={personas}
                    renderInput={(params) => <TextField {...params} label="Persona propietaria" />}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate('/admin/registry/vehiculos')}>Cancelar</Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={() => navigate('/admin/registry/vehiculos')}>
                {isEdit ? 'Guardar Cambios' : 'Crear Vehículo'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
