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
    Snackbar,
    Alert,
    Tabs,
    Tab,
    Card,
    CardContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DashboardTemplate } from '../../components/templates';
import { PermisosTable, PermisoTemporalViewDto } from '../../components/organisms';
import { EstadoAutorizacion } from '@vigia/shared-types';
import { StatusChip } from '../../components/atoms';

interface AutorizacionPermanenteViewDto {
    autorizacion_id: string;
    persona_autorizada_nombre: string;
    persona_autorizada_cedula: string;
    vehiculo_placa: string;
    parentesco_o_relacion: string;
    fecha_otorgamiento: string;
    estado: 'ACTIVA' | 'REVOCADA';
}

const MOCK_AUTORIZACIONES_PERMANENTES: AutorizacionPermanenteViewDto[] = [
    {
        autorizacion_id: 'ap-001',
        persona_autorizada_nombre: 'Stalin Joel Coello',
        persona_autorizada_cedula: '1724567890',
        vehiculo_placa: 'PBW-1234',
        parentesco_o_relacion: 'Hermano',
        fecha_otorgamiento: '2026-03-15',
        estado: 'ACTIVA',
    },
    {
        autorizacion_id: 'ap-002',
        persona_autorizada_nombre: 'María Elena Arévalo',
        persona_autorizada_cedula: '1756789012',
        vehiculo_placa: 'PBW-1234',
        parentesco_o_relacion: 'Madre',
        fecha_otorgamiento: '2026-01-10',
        estado: 'ACTIVA',
    },
    {
        autorizacion_id: 'ap-003',
        persona_autorizada_nombre: 'Carlos Andrés Coello',
        persona_autorizada_cedula: '1701234567',
        vehiculo_placa: 'PBA-5678',
        parentesco_o_relacion: 'Padre',
        fecha_otorgamiento: '2026-02-20',
        estado: 'REVOCADA',
    },
];

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

const MOCK_PLACAS = ['PBW-1234', 'PBA-5678', 'PBB-3456'];

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
    
    // Estados generales
    const [tabActual, setTabActual] = useState(0);
    const [exitoSnackbar, setExitoSnackbar] = useState(false);
    const [exitoMensaje, setExitoMensaje] = useState('');

    // Estados de Permisos Temporales
    const [permisos] = useState<PermisoTemporalViewDto[]>(MOCK_PERMISOS);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formState, setFormState] = useState<NuevoPermisoFormState>(INITIAL_FORM);

    // Estados de Autorizaciones Permanentes
    const [autorizaciones, setAutorizaciones] = useState(MOCK_AUTORIZACIONES_PERMANENTES);
    const [dialogAutorizacionOpen, setDialogAutorizacionOpen] = useState(false);
    const [nuevaAutorizacion, setNuevaAutorizacion] = useState({
        persona_autorizada_nombre: '',
        persona_autorizada_cedula: '',
        vehiculo_placa: '',
        parentesco_o_relacion: '',
    });

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
        setExitoMensaje('Permiso Temporal creado exitosamente');
        setExitoSnackbar(true);
    };

    const handleRevocar = (_permisoId: string) => {
        // Accion de revocacion
    };

    const handleCrearAutorizacion = () => {
        const nueva: AutorizacionPermanenteViewDto = {
            autorizacion_id: `ap-${Date.now()}`,
            persona_autorizada_nombre: nuevaAutorizacion.persona_autorizada_nombre,
            persona_autorizada_cedula: nuevaAutorizacion.persona_autorizada_cedula,
            vehiculo_placa: nuevaAutorizacion.vehiculo_placa,
            parentesco_o_relacion: nuevaAutorizacion.parentesco_o_relacion,
            fecha_otorgamiento: new Date().toISOString().split('T')[0],
            estado: 'ACTIVA',
        };
        setAutorizaciones((prev) => [nueva, ...prev]);
        setDialogAutorizacionOpen(false);
        setNuevaAutorizacion({ persona_autorizada_nombre: '', persona_autorizada_cedula: '', vehiculo_placa: '', parentesco_o_relacion: '' });
        setExitoMensaje('Autorización Permanente creada exitosamente');
        setExitoSnackbar(true);
    };

    const handleRevocarAutorizacion = (id: string) => {
        setAutorizaciones((prev) =>
            prev.map((a) => (a.autorizacion_id === id ? { ...a, estado: 'REVOCADA' as const } : a))
        );
    };

    return (
        <DashboardTemplate
            rol="PROPIETARIO"
            pageTitle="Gestión de Autorizaciones"
            notificationCount={2}
            userInitials="AC"
        >
            {/* Tabs */}
            <Tabs
                value={tabActual}
                onChange={(_, newValue) => setTabActual(newValue)}
                sx={{
                    mb: 3,
                    '& .MuiTab-root': {
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                    },
                    '& .Mui-selected': { color: '#0D5CCF' },
                    '& .MuiTabs-indicator': { backgroundColor: '#0D5CCF', height: 3, borderRadius: '3px 3px 0 0' },
                }}
            >
                <Tab label="Permisos Temporales" />
                <Tab label="Autorizaciones Permanentes" />
            </Tabs>

            {/* Tab 0: Permisos Temporales */}
            {tabActual === 0 && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}
                        >
                            Permisos Temporales
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
                                        {MOCK_PLACAS.map((placa) => (
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
                </>
            )}

            {/* Tab 1: Autorizaciones Permanentes */}
            {tabActual === 1 && (
                <>
                    {/* Card informativa */}
                    <Card sx={{ mb: 3, backgroundColor: 'rgba(13,92,207,0.04)', border: '1px solid rgba(13,92,207,0.12)', borderRadius: '8px' }}>
                        <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Typography variant="body2" sx={{ color: '#0A2F86', fontFamily: '"Inter", sans-serif' }}>
                                <strong>¿Qué es una Autorización Permanente?</strong> Otorga acceso indefinido a una persona para conducir un vehículo registrado.
                                La persona autorizada puede ingresar sin restricción de horario mientras la autorización esté activa.
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Header con botón */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}>
                            Personas con Acceso Permanente
                        </Typography>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogAutorizacionOpen(true)}>
                            Nueva Autorización
                        </Button>
                    </Box>

                    {/* Tabla desktop / Cards mobile */}
                    {isMobile ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {autorizaciones.map((auth) => (
                                <Card key={auth.autorizacion_id} sx={{ borderRadius: '8px' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography sx={{ fontWeight: 600 }}>{auth.persona_autorizada_nombre}</Typography>
                                            <StatusChip estado={auth.estado} />
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                            Cédula: {auth.persona_autorizada_cedula}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                            Vehículo: {auth.vehiculo_placa} · {auth.parentesco_o_relacion}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                                            Desde: {new Date(auth.fecha_otorgamiento).toLocaleDateString('es-EC')}
                                        </Typography>
                                        {auth.estado === 'ACTIVA' && (
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                sx={{ mt: 2 }}
                                                onClick={() => handleRevocarAutorizacion(auth.autorizacion_id)}
                                            >
                                                Revocar
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
                                        {['Persona Autorizada', 'Cédula', 'Vehículo', 'Relación', 'Desde', 'Estado', 'Acciones'].map((h) => (
                                            <TableCell key={h} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: '#0A2F86' }}>
                                                {h}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {autorizaciones.map((auth) => (
                                        <TableRow key={auth.autorizacion_id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{auth.persona_autorizada_nombre}</TableCell>
                                            <TableCell>{auth.persona_autorizada_cedula}</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>{auth.vehiculo_placa}</TableCell>
                                            <TableCell>{auth.parentesco_o_relacion}</TableCell>
                                            <TableCell>{new Date(auth.fecha_otorgamiento).toLocaleDateString('es-EC')}</TableCell>
                                            <TableCell><StatusChip estado={auth.estado} /></TableCell>
                                            <TableCell>
                                                {auth.estado === 'ACTIVA' && (
                                                    <Button variant="outlined" color="error" size="small" onClick={() => handleRevocarAutorizacion(auth.autorizacion_id)}>
                                                        Revocar
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {/* Dialog: Nueva Autorización Permanente */}
                    <Dialog open={dialogAutorizacionOpen} onClose={() => setDialogAutorizacionOpen(false)} fullWidth maxWidth="sm">
                        <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}>
                            Nueva Autorización Permanente
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                                Otorgue acceso indefinido a una persona para conducir uno de sus vehículos registrados.
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Nombre de la Persona"
                                        required
                                        fullWidth
                                        value={nuevaAutorizacion.persona_autorizada_nombre}
                                        onChange={(e) => setNuevaAutorizacion((prev) => ({ ...prev, persona_autorizada_nombre: e.target.value }))}
                                        placeholder="Ej: María Elena Arévalo"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Cédula"
                                        required
                                        fullWidth
                                        value={nuevaAutorizacion.persona_autorizada_cedula}
                                        onChange={(e) => setNuevaAutorizacion((prev) => ({ ...prev, persona_autorizada_cedula: e.target.value }))}
                                        placeholder="Ej: 1756789012"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Vehículo"
                                        required
                                        fullWidth
                                        value={nuevaAutorizacion.vehiculo_placa}
                                        onChange={(e) => setNuevaAutorizacion((prev) => ({ ...prev, vehiculo_placa: e.target.value }))}
                                    >
                                        {MOCK_PLACAS.map((placa) => (
                                            <MenuItem key={placa} value={placa}>{placa}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Parentesco o Relación"
                                        required
                                        fullWidth
                                        value={nuevaAutorizacion.parentesco_o_relacion}
                                        onChange={(e) => setNuevaAutorizacion((prev) => ({ ...prev, parentesco_o_relacion: e.target.value }))}
                                        placeholder="Ej: Hermano, Madre, Conductor habitual"
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button onClick={() => setDialogAutorizacionOpen(false)}>Cancelar</Button>
                            <Button variant="contained" color="primary" onClick={handleCrearAutorizacion}>
                                Crear Autorización
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}

            <Snackbar
                open={exitoSnackbar}
                autoHideDuration={3000}
                onClose={() => setExitoSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                    {exitoMensaje}
                </Alert>
            </Snackbar>
        </DashboardTemplate>
    );
};

export default PermisosTemporalesPage;