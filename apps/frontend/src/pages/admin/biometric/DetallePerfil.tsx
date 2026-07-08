import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';

const representaciones = [
  { id: 2, tipo: 'Perfil Izquierdo', calidad: 0.88, fecha: '2024-08-15 10:33', img: '/biometric_left.png' },
  { id: 1, tipo: 'Frontal', calidad: 0.92, fecha: '2024-08-15 10:32', img: '/biometric_front.png' },
  { id: 3, tipo: 'Perfil Derecho', calidad: 0.90, fecha: '2024-08-15 10:34', img: '/biometric_right.png' },
];

export default function DetallePerfil() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Detalle de Perfil Biométrico"
        breadcrumbs={[{ label: 'Biometric', href: '#/admin/biometric/perfiles' }, { label: 'Perfiles', href: '#/admin/biometric/perfiles' }, { label: `ID ${id}` }]}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/biometric/perfiles')}>Volver</Button>
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate('/admin/biometric/perfiles/nuevo')}>Reemplazar</Button>
          </Box>
        }
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 72, height: 72, fontSize: '1.8rem', bgcolor: 'primary.main' }}>C</Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Carlos Andrés Mendoza</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>1718901234 · camendoza@uce.edu.ec</Typography>
              <StatusChip kind="disponibilidad" value="DISPONIBLE" />
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FaceRetouchingNaturalIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Representaciones Activas</Typography>
          </Box>
          <Grid container spacing={2.5}>
            {representaciones.map((r) => (
              <Grid key={r.id} size={{ xs: 12, sm: 4 }}>
                <Box sx={{ border: '1px solid rgba(13, 92, 207, 0.08)', borderRadius: 2, p: 2 }}>
                  <Box sx={{ width: '100%', aspectRatio: '1', borderRadius: 2, bgcolor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, p: 3 }}>
                    <Box component="img" src={r.img} alt={r.tipo} sx={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>{r.tipo}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, display: 'block' }}>Calidad: {r.calidad.toFixed(2)}</Typography>
                  <Typography variant="body2" color="text.secondary">{r.fecha}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={2}>
            {[
              ['Estado', 'DISPONIBLE'],
              ['Última actualización', '2024-08-15 10:32'],
              ['Calidad promedio', '0.90'],
              ['Total de validaciones', '127'],
              ['Coincidencias suficientes', '119'],
              ['Evidencia insuficiente', '8'],
            ].map(([label, value]) => (
              <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(13, 92, 207, 0.04)', borderRadius: 2, border: '1px solid rgba(13, 92, 207, 0.1)' }}>
                  <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, display: 'block', lineHeight: 1.2, mb: 0.5 }}>{label}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>{value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
