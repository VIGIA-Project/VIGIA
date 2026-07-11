import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import { registryService } from '../../../services/registry.service';
import { authService } from '../../../services/auth.service';

const capturas = [
  { id: 'izquierda', label: 'Perfil Izquierdo', descripcion: 'Vista lateral izquierda', img: '/biometric_left.png' },
  { id: 'frontal', label: 'Frontal', descripcion: 'Vista frontal del rostro', img: '/biometric_front.png' },
  { id: 'derecha', label: 'Perfil Derecho', descripcion: 'Vista lateral derecha', img: '/biometric_right.png' },
];

export default function RegistroBiometrico() {
  const navigate = useNavigate();
  const [persona, setPersona] = useState<any | null>(null);
  const [opcionesPersonas, setOpcionesPersonas] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      registryService.getPersonasSinBiometria(),
      authService.getUsers(1, 100).catch(() => ({ data: [] }))
    ]).then(([res, usuariosData]) => {
      // usuariosData can be { data: [...], total, ... } or just the array
      const usersArray = Array.isArray(usuariosData) ? usuariosData : (Array.isArray((usuariosData as any)?.data) ? (usuariosData as any).data : []);
      const guardPersonaIds = new Set(usersArray.filter((u: any) => u.role === 'GUARD').map((u: any) => u.personaId));
      // Filtrar guardias ya que ellos no usan biometría
      const sinGuardias = res.filter((p: any) => {
        const rol = (p.rolInstitucional || '').toLowerCase();
        const esGuardia = rol.includes('guardia') || rol.includes('guard') || rol === 'seguridad';
        return !esGuardia && !guardPersonaIds.has(p.personaId || p.id);
      });
      setOpcionesPersonas(sinGuardias.map(p => ({
        id: p.personaId,
        label: `${p.nombres} ${p.apellidos} - ${p.identificacionNumero}`
      })));
    }).catch(console.error);
  }, []);

  return (
    <Box>
      <PageHeader
        title="Registrar Biometría"
        breadcrumbs={[{ label: 'Biometric', href: '/admin/biometric/perfiles' }, { label: 'Perfiles', href: '/admin/biometric/perfiles' }, { label: 'Registrar' }]}
        action={<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/biometric/perfiles')}>Volver</Button>}
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Seleccionar Persona</Typography>
          <Autocomplete
            options={opcionesPersonas}
            value={persona}
            onChange={(_, v) => setPersona(v)}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            sx={{ maxWidth: 400 }}
            renderInput={(params) => <TextField {...params} label="Persona" required />}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Captura de Representaciones</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Se requieren 3 capturas: frontal, perfil izquierdo y perfil derecho. Cada captura debe tener una calidad mínima de 0.85.
          </Typography>
          <Grid container spacing={2.5}>
            {capturas.map((c) => (
              <Grid key={c.id} size={{ xs: 12, sm: 4 }}>
                <Box
                  component="label"
                  sx={{
                    border: '2px dashed',
                    borderColor: 'rgba(13, 92, 207, 0.2)',
                    borderRadius: 3,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'block',
                    transition: 'all 0.15s',
                    '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(13, 92, 207, 0.02)' },
                  }}
                >
                  <input type="file" accept="image/*" hidden onChange={() => alert('Imagen seleccionada para ' + c.label)} />
                  <Box sx={{ width: '100%', aspectRatio: '1', borderRadius: 2, bgcolor: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, p: 3 }}>
                    <Box component="img" src={c.img} alt={c.label} sx={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  </Box>
                  <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 800 }}>{c.label}</Typography>
                  <Typography variant="body2" sx={{ display: 'block', mt: 0.5, fontWeight: 600, color: 'text.primary' }}>{c.descripcion}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Alert severity="info" sx={{ mt: 3 }}>
            Las capturas se procesan localmente y se almacenan como representaciones biométricas. No se guardan imágenes originales.
          </Alert>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate('/admin/biometric/perfiles')}>Cancelar</Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={() => navigate('/admin/biometric/perfiles')}>
              Guardar Perfil
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
