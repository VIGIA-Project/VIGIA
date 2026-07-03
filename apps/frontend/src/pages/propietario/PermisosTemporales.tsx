import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    useMediaQuery,
    useTheme,
    Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DashboardTemplate } from '../../components/templates';
import { PermisosTable, PermisoTemporalViewDto } from '../../components/organisms';
import { EstadoAutorizacion } from '@vigia/shared-types';

const MOCK_PERMISOS: PermisoTemporalViewDto[] = [
    {
        permiso_temporal_id: 'pt-001',
        persona_autorizada_nombre: 'Stalin Joel Coello',
        persona_autorizada_cedula: '1724567890',
        vehiculo_placa: 'PBW-1234',
        vigencia_inicio: '2026-07-05T08:00:00',
        vigencia_fin: '2026-07-05T18:00:00',
        motivo_otorgamiento: 'Trámite universitario',
        estado_autorizacion: EstadoAutorizacion.PROGRAMADO,
    },
    {
        permiso_temporal_id: 'pt-002',
        persona_autorizada_nombre: 'María Fernanda López',
        persona_autorizada_cedula: '1712345678',
        vehiculo_placa: 'PBA-5678',
        vigencia_inicio: '2026-07-01T07:00:00',
        vigencia_fin: '2026-07-01T14:00:00',
        motivo_otorgamiento: 'Entrega de documentos',
        estado_autorizacion: EstadoAutorizacion.EXPIRADO,
    },
    {
        permiso_temporal_id: 'pt-003',
        persona_autorizada_nombre: 'Carlos Andrés Muñoz',
        persona_autorizada_cedula: '1709876543',
        vehiculo_placa: 'PBW-1234',
        vigencia_inicio: '2026-06-28T09:00:00',
        vigencia_fin: '2026-06-28T12:00:00',
        motivo_otorgamiento: 'Mantenimiento vehicular',
        estado_autorizacion: EstadoAutorizacion.EXPIRADO,
    },
    {
        permiso_temporal_id: 'pt-004',
        persona_autorizada_nombre: 'Ana Lucía Paredes',
        persona_autorizada_cedula: '1731234567',
        vehiculo_placa: 'PBB-3456',
        vigencia_inicio: '2026-07-04T06:00:00',
        vigencia_fin: '2026-07-06T22:00:00',
        motivo_otorgamiento: 'Familiar autorizado',
        estado_autorizacion: EstadoAutorizacion.ACTIVA,
    },
];

const MOCK_PLACAS_PROPIETARIO: string[] = ['PBW-1234', 'PBA-5678', 'PBB-3456'];

interface NuevoPermisoFormState {
    persona_autorizada_nombre: string;
    persona_autorizada_cedula: string;
    vehiculo_placa: string;
    vigencia_inicio: string;
    vigencia_fin: string;
    motivo_otorgamiento: string;
}

const INITIAL_FORM: NuevoPermisoFormState = {
    persona_autorizada_nombre: '',
    persona_autorizada_cedula: '',
    vehiculo_placa: '',
    vigencia_inicio: '',
    vigencia_fin: '',
    motivo_otorgamiento: '',
};

export const PermisosTemporalesPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [permisos] = useState<PermisoTemporalViewDto[]>(MOCK_PERMISOS);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formState, setFormState] = useState<NuevoPermisoFormState>(INITIAL_FORM);

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => {
        setDialogOpen(false);
        setFormState(INITIAL_FORM);
    };

    const handleFieldChange = (field: keyof NuevoPermisoFormState) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleCrearPermiso = () => {
        handleCloseDialog();
    };

    const handleRevocar = (_permisoId: string) => {
        // Accion de revocacion
    };

    return (
        <DashboardTemplate
            rol="PROPIETARIO"
            pageTitle="Permisos Temporales"
            notificationCount={2}
            userInitials="AC"
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}
                >
                    Gestión de Permisos Temporales
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenDialog}>
                    Nuevo Permiso
                </Button>
            </Box>

            <PermisosTable permisos={permisos} isMobile={isMobile} onRevocar={handleRevocar} />

            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}>
                    Nuevo Permiso Temporal
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Persona Autorizada"
                                required
                                fullWidth
                                value={formState.persona_autorizada_nombre}
                                onChange={handleFieldChange('persona_autorizada_nombre')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cédula"
                                required
                                fullWidth
                                value={formState.persona_autorizada_cedula}
                                onChange={handleFieldChange('persona_autorizada_cedula')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Vehículo"
                                required
                                fullWidth
                                value={formState.vehiculo_placa}
                                onChange={handleFieldChange('vehiculo_placa')}
                            >
                                {MOCK_PLACAS_PROPIETARIO.map((placa) => (
                                    <MenuItem key={placa} value={placa}>
                                        {placa}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Fecha/Hora Inicio"
                                type="datetime-local"
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formState.vigencia_inicio}
                                onChange={handleFieldChange('vigencia_inicio')}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Fecha/Hora Fin"
                                type="datetime-local"
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formState.vigencia_fin}
                                onChange={handleFieldChange('vigencia_fin')}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Motivo"
                                required
                                fullWidth
                                multiline
                                rows={3}
                                value={formState.motivo_otorgamiento}
                                onChange={handleFieldChange('motivo_otorgamiento')}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} sx={{ fontFamily: '"Inter", sans-serif' }}>
                        Cancelar
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleCrearPermiso}>
                        Crear Permiso
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardTemplate>
    );
};

export default PermisosTemporalesPage;