import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { useActualizarPersona } from '../../../hooks/useRegistry';
import { Persona } from '../../../services/types/registry.types';

interface EditPersonaModalProps {
  open: boolean;
  onClose: () => void;
  persona: Persona;
  onUpdated?: () => void;
}

interface FormState {
  nombres: string;
  apellidos: string;
  correoInstitucional: string;
  telefonoContacto: string;
}

export default function EditPersonaModal({ open, onClose, persona, onUpdated }: EditPersonaModalProps) {
  const [form, setForm] = useState<FormState>({
    nombres: persona.nombres,
    apellidos: persona.apellidos,
    correoInstitucional: persona.correoInstitucional ?? '',
    telefonoContacto: persona.telefonoContacto ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const actualizarMutation = useActualizarPersona();

  useEffect(() => {
    if (open) {
      setForm({
        nombres: persona.nombres,
        apellidos: persona.apellidos,
        correoInstitucional: persona.correoInstitucional ?? '',
        telefonoContacto: persona.telefonoContacto ?? '',
      });
      setError(null);
    }
  }, [open, persona]);

  const handleChange = (field: keyof FormState, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setError(null);
    try {
      await actualizarMutation.mutateAsync({
        personaId: persona.personaId,
        dto: {
          nombres: form.nombres,
          apellidos: form.apellidos,
          correoInstitucional: form.correoInstitucional || undefined,
          telefonoContacto: form.telefonoContacto || undefined,
        },
      });
      onUpdated?.();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo guardar los cambios.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 48px rgba(0,0,0,0.1)',
        }
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(3px)',
          }
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Editar Información de Persona</Typography>
          <Typography variant="body2" color="text.secondary">
            Modifica los datos de contacto de este registro.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonOutlineIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Identidad
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField size="small" fullWidth label="Nombres" value={form.nombres} onChange={(e) => handleChange('nombres', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField size="small" fullWidth label="Apellidos" value={form.apellidos} onChange={(e) => handleChange('apellidos', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField size="small" fullWidth label="Identificación" value={persona.identificacionNumero} disabled helperText="La identificación no puede modificarse una vez registrada" />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ContactPhoneIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Contacto
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField size="small" fullWidth label="Correo institucional" value={form.correoInstitucional} onChange={(e) => handleChange('correoInstitucional', e.target.value)} placeholder="@uce.edu.ec" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField size="small" fullWidth label="Teléfono" value={form.telefonoContacto} onChange={(e) => handleChange('telefonoContacto', e.target.value)} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: 'rgba(0,0,0,0.02)' }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disableElevation disabled={actualizarMutation.isPending}>
          {actualizarMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
