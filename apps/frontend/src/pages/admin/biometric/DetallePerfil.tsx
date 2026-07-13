import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { usePerfilesBiometricosAdmin } from '../../../hooks/useAdmin';

export default function DetallePerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const perfilesQuery = usePerfilesBiometricosAdmin();

  const perfil = useMemo(
    () => (perfilesQuery.data ?? []).find((p) => p.perfilBiometricoId === id),
    [perfilesQuery.data, id]
  );

  if (perfilesQuery.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (perfilesQuery.isError || !perfil) {
    return <Typography color="error">No se pudo cargar el perfil biométrico.</Typography>;
  }

  return (
    <Box>
      <PageHeader
        title="Detalle de Perfil Biométrico"
        breadcrumbs={[{ label: 'Biometric', href: '#/admin/biometric/perfiles' }, { label: 'Perfiles', href: '#/admin/biometric/perfiles' }, { label: perfil.personaNombre ?? `ID ${id}` }]}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/biometric/perfiles')}>Volver</Button>
            <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate('/admin/biometric/perfiles/nuevo')}>Registrar / Actualizar</Button>
          </Box>
        }
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 72, height: 72, fontSize: '1.8rem', bgcolor: 'primary.main' }}>
              {(perfil.personaNombre ?? perfil.personaId).charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{perfil.personaNombre ?? `Persona ${perfil.personaId.slice(0, 8)}`}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{perfil.personaId}</Typography>
              <StatusChip kind="disponibilidad" value={perfil.estadoDisponibilidad === 'PENDIENTE_CAPTURA' ? 'PENDIENTE' : perfil.estadoDisponibilidad} />
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FaceRetouchingNaturalIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Estado del Perfil</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            El motor biométrico de VIGIA todavía opera con un proveedor stub (sin captura facial real) — este perfil no tiene representaciones ni puntajes de calidad reales que mostrar.
          </Typography>
          <Grid container spacing={2}>
            {[
              ['Estado de disponibilidad', perfil.estadoDisponibilidad],
              ['Última actualización biométrica', perfil.ultimaActualizacionBiometrica ? new Date(perfil.ultimaActualizacionBiometrica).toLocaleString('es-EC') : 'Sin actualizaciones'],
              ['Fecha de creación', new Date(perfil.fechaCreacion).toLocaleString('es-EC')],
              ['Última modificación', new Date(perfil.fechaActualizacion).toLocaleString('es-EC')],
            ].map(([label, value]) => (
              <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box sx={{ p: 2, bgcolor: 'rgba(13, 92, 207, 0.04)', borderRadius: 2, border: '1px solid rgba(13, 92, 207, 0.1)' }}>
                  <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, display: 'block', lineHeight: 1.2, mb: 0.5 }}>{label}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>{value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
