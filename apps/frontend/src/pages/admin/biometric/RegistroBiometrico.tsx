import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageHeader from '../../../components/admin-legacy/PageHeader';
import StatusChip from '../../../components/admin-legacy/StatusChip';
import { usePersonasAdmin, useRegistrarPerfilBiometricoAdmin } from '../../../hooks/useAdmin';
import { Persona } from '../../../services/types/registry.types';

export default function RegistroBiometrico() {
  const navigate = useNavigate();
  const [persona, setPersona] = useState<Persona | null>(null);

  const personas = usePersonasAdmin();
  const registrar = useRegistrarPerfilBiometricoAdmin();

  return (
    <Box>
      <PageHeader
        title="Registrar Perfil Biométrico"
        breadcrumbs={[{ label: 'Biometric', href: '#/admin/biometric/perfiles' }, { label: 'Perfiles', href: '#/admin/biometric/perfiles' }, { label: 'Registrar' }]}
        action={<Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/biometric/perfiles')}>Volver</Button>}
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Seleccionar Persona</Typography>
          {personas.isLoading ? (
            <Skeleton variant="rounded" height={56} sx={{ maxWidth: 400 }} />
          ) : personas.isError ? (
            <Alert severity="error">No se pudo cargar el listado de personas.</Alert>
          ) : (
            <Autocomplete
              options={personas.data ?? []}
              value={persona}
              getOptionLabel={(p) => `${p.nombreCompleto} · ${p.identificacionNumero}`}
              isOptionEqualToValue={(a, b) => a.personaId === b.personaId}
              onChange={(_, v) => {
                setPersona(v);
                registrar.reset();
              }}
              sx={{ maxWidth: 400 }}
              renderInput={(params) => <TextField {...params} label="Persona" required />}
            />
          )}
        </CardContent>
      </Card>

      {persona && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Registrar perfil para {persona.nombreCompleto}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Estado biométrico actual: <StatusChip kind="disponibilidad" value={persona.estadoBiometrico === 'COMPLETO' ? 'DISPONIBLE' : 'PENDIENTE'} />
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              El servicio de verificación biométrica no está conectado aún. Este registro crea el perfil biométrico como placeholder; no procesa ni almacena representaciones faciales reales.
            </Alert>

            {registrar.isSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Perfil biométrico registrado correctamente para {persona.nombreCompleto}.
              </Alert>
            )}
            {registrar.isError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                No se pudo registrar el perfil biométrico. Intenta nuevamente.
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate('/admin/biometric/perfiles')}>Cancelar</Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={registrar.isPending}
                onClick={() => registrar.mutate(persona.personaId)}
              >
                Registrar Perfil
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
