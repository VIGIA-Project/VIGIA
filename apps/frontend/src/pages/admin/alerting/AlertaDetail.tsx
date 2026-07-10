import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorIcon from '@mui/icons-material/Error';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { alertingService } from '../../../services/alerting.service';

export default function AlertaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerta = async () => {
      try {
        setLoading(true);
        // We fetch from recientes since there's no single GET endpoint yet
        const res = await alertingService.obtenerAlertasRecientes(100);
        const found = res.find(a => a.alertaId === id || a.id === id);
        if (found) {
          setAlerta(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerta();
  }, [id]);

  if (loading) {
     return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  if (!alerta) {
    return <Box sx={{ p: 3 }}><Typography>Alerta no encontrada</Typography></Box>;
  }

  const severidad = alerta.severidad;
  const estado = alerta.estadoAtencion || alerta.estado;

  return (
    <Box>
      <PageHeader
        title="Detalle de Alerta"
        breadcrumbs={[{ label: 'Alerting', href: '/admin/alerting/alertas' }, { label: 'Alertas', href: '/admin/alerting/alertas' }, { label: `ID ${id}` }]}
        action={<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/alerting/alertas')}>Volver</Button>}
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: severidad === 'ALTA' ? 'error.main' : severidad === 'MEDIA' ? 'warning.main' : 'info.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ErrorIcon sx={{ color: '#fff' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                <StatusChip kind="severity" value={severidad} />
                <StatusChip kind="atencion" value={estado} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {alerta.descripcion}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {alerta.referenciaExterna} · {new Date(alerta.createdAt || alerta.fechaCreacion).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Descripción del Hecho</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Se generó una alerta automática por el sistema VIGIA. El origen de esta alerta está etiquetado bajo el componente <strong>{alerta.componenteOrigen}</strong>.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[
              ['ID de Alerta', alerta.alertaId || alerta.id],
              ['Severidad', severidad],
              ['Estado de Atención', estado],
              ['Fecha de Generación', new Date(alerta.createdAt || alerta.fechaCreacion).toLocaleString()],
              ['Referencia Externa', alerta.referenciaExterna || 'N/A'],
              ['Componente Origen', alerta.componenteOrigen || 'N/A'],
              ['Responsable', alerta.usuarioAtencionId || 'No asignado'],
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
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>Inspeccionar Referencia</Typography>
            <Typography variant="body2" color="text.secondary">
              Verifique el estado de la referencia involucrada en el registro.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DirectionsCarIcon />}
            onClick={() => navigate('/admin/registry/vehiculos')}
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 700, boxShadow: '0 8px 16px rgba(13, 92, 207, 0.2)' }}
          >
            Ver Registro
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
