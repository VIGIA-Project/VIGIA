import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorIcon from '@mui/icons-material/Error';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';

export default function AlertaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Detalle de Alerta"
        breadcrumbs={[{ label: 'Alerting', href: '#/admin/alerting/alertas' }, { label: 'Alertas', href: '#/admin/alerting/alertas' }, { label: `ID ${id}` }]}
        action={<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/alerting/alertas')}>Volver</Button>}
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ErrorIcon sx={{ color: '#fff' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                <StatusChip kind="severity" value="ALTA" />
                <StatusChip kind="atencion" value="GENERADA" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Acceso denegado: persona no autorizada en portón norte
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Vehículo PBC-1231 · 2024-08-20 14:32
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Descripción del Hecho</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            El vehículo PBC-1231 intentó acceder por el portón norte a las 14:32. El sistema verificó la autorización del conductor y determinó que no existe una autorización activa para esta persona sobre este vehículo. La decisión del sistema fue DENIED y se generó esta alerta de severidad ALTA.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[
              ['ID de Alerta', id ?? '1'],
              ['Severidad', 'ALTA'],
              ['Estado de Atención', 'GENERADA'],
              ['Fecha de Generación', '2024-08-20 14:32'],
              ['Vehículo Involucrado', 'PBC-1231'],
              ['Persona Involucrada', 'ID 4521'],
              ['Portón', 'Norte'],
              ['Decisión del Sistema', 'DENIED'],
            ].map(([label, value]) => (
              <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>{label}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{value}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ bgcolor: 'rgba(13, 92, 207, 0.03)', border: '1px solid rgba(13, 92, 207, 0.1)', boxShadow: 'none' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>Inspeccionar Vehículo</Typography>
            <Typography variant="body2" color="text.secondary">
              Verifique el estado del vehículo involucrado y sus autorizaciones vigentes.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DirectionsCarIcon />}
            onClick={() => navigate('/admin/registry/vehiculos/1')}
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, boxShadow: '0 8px 16px rgba(13, 92, 207, 0.2)' }}
          >
            Ver Vehículo
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
