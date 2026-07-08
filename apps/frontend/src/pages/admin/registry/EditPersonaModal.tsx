import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

interface EditPersonaModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: any;
}

export default function EditPersonaModal({ open, onClose, initialData }: EditPersonaModalProps) {
  const [form, setForm] = useState({
    identificacion: '',
    tipoId: 'Cédula',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    facultad: '',
    carrera: '',
    rol: '',
    estado: 'ACTIVO',
  });

  useEffect(() => {
    if (initialData && open) {
      setForm({
        ...form,
        ...initialData,
      });
    }
  }, [initialData, open]);

  const handleChange = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = () => {
    // Aquí iría la lógica para enviar al backend
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
            Modifica los detalles de registro de este usuario.
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />

      <DialogContent sx={{ p: 3 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* IDENTIDAD */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonOutlineIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Información de Identidad
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Tipo de identificación</InputLabel>
                  <Select value={form.tipoId} label="Tipo de identificación" onChange={(e) => handleChange('tipoId', e.target.value)}>
                    <MenuItem value="Cédula">Cédula</MenuItem>
                    <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                    <MenuItem value="RUC">RUC</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField size="small" fullWidth label="Identificación" value={form.identificacion} onChange={(e) => handleChange('identificacion', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Estado de la Cuenta</InputLabel>
                  <Select value={form.estado} label="Estado de la Cuenta" onChange={(e) => handleChange('estado', e.target.value)}>
                    <MenuItem value="ACTIVO">HABILITADO</MenuItem>
                    <MenuItem value="PENDIENTE_BIOMETRIA">BIOMETRÍA PENDIENTE</MenuItem>
                    <MenuItem value="INACTIVO">INHABILITADO</MenuItem>
                    <MenuItem value="DESACTIVADO">SUSPENDIDO</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField size="small" fullWidth label="Nombres" value={form.nombres} onChange={(e) => handleChange('nombres', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField size="small" fullWidth label="Apellidos" value={form.apellidos} onChange={(e) => handleChange('apellidos', e.target.value)} />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* CONTACTO */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ContactPhoneIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Información de Contacto
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField size="small" fullWidth label="Correo institucional" value={form.correo} onChange={(e) => handleChange('correo', e.target.value)} placeholder="@uce.edu.ec" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField size="small" fullWidth label="Teléfono" value={form.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* ASIGNACIÓN INSTITUCIONAL */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CorporateFareIcon color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Asignación Institucional
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Facultad</InputLabel>
                  <Select value={form.facultad} label="Facultad" onChange={(e) => handleChange('facultad', e.target.value)}>
                    <MenuItem value="Ingeniería">Ingeniería</MenuItem>
                    <MenuItem value="Ciencias">Ciencias</MenuItem>
                    <MenuItem value="Administración">Administración</MenuItem>
                    <MenuItem value="Arquitectura">Arquitectura</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField size="small" fullWidth label="Carrera" value={form.carrera} onChange={(e) => handleChange('carrera', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Rol</InputLabel>
                  <Select value={form.rol} label="Rol" onChange={(e) => handleChange('rol', e.target.value)}>
                    <MenuItem value="Docente">Docente</MenuItem>
                    <MenuItem value="Estudiante">Estudiante</MenuItem>
                    <MenuItem value="Administrativo">Administrativo</MenuItem>
                    <MenuItem value="Guardia">Guardia</MenuItem>
                    <MenuItem value="Agregado">Agregado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2.5, bgcolor: 'rgba(0,0,0,0.02)' }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disableElevation>
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}
