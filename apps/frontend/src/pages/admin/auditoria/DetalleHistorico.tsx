import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';

export default function DetalleHistorico() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Detalle de Evento Histórico"
        breadcrumbs={[{ label: 'Auditoría', href: '#/admin/auditoria/eventos' }, { label: 'Historial', href: '#/admin/auditoria/eventos' }, { label: `EVT ${id}` }]}
        action={<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/auditoria/eventos')}>Volver</Button>}
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <StatusChip kind="decision" value="DENIED" size="medium" />
            <StatusChip kind="atencion" value="GENERADA" size="medium" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Evento de Acceso EVT-2024-0820-{id?.padStart(3, '0') ?? '001'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            2024-08-20 14:32 · Portón Norte
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Información del Evento</Typography>
          <Grid container spacing={2}>
            {[
              ['ID del Evento', `EVT-2024-0820-${id?.padStart(3, '0') ?? '001'}`],
              ['Fecha y Hora', '2024-08-20 14:32:15'],
              ['Portón', 'Norte'],
              ['Vehículo', 'PBC-1231'],
              ['Persona', 'ID 4521'],
              ['Decisión', 'DENIED'],
              ['Origen de la Decisión', 'AUTOMATICA'],
              ['Actor Decisor', 'Sistema VIGIA'],
              ['Validación Biométrica', 'EVIDENCIA_INSUFICIENTE'],
              ['Puntaje Biométrico', '0.72'],
              ['Umbral Biométrico', '0.85'],
              ['Alerta Generada', 'ALT-001 (ALTA)'],
            ].map(([label, value]) => (
              <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>{label}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{value}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Trazabilidad</Typography>
          <Box sx={{ pl: 2 }}>
            {[
              { hora: '14:32:15', accion: 'Detección de vehículo en portón norte' },
              { hora: '14:32:16', accion: 'Lectura de placa: PBC-1231' },
              { hora: '14:32:17', accion: 'Consulta de autorización: sin autorización activa' },
              { hora: '14:32:18', accion: 'Validación biométrica: EVIDENCIA_INSUFICIENTE (0.72)' },
              { hora: '14:32:19', accion: 'Decisión del sistema: DENIED' },
              { hora: '14:32:20', accion: 'Alerta ALT-001 generada (severidad ALTA)' },
              { hora: '14:32:21', accion: 'Notificaciones enviadas: EMAIL, PUSH' },
            ].map((paso, i) => (
              <Box key={i}>
                <Box sx={{ display: 'flex', gap: 2, py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', minWidth: 70 }}>{paso.hora}</Typography>
                  <Typography variant="body1">{paso.accion}</Typography>
                </Box>
                {i < 6 && <Divider />}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
