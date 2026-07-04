import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
    MenuItem,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Snackbar,
    Alert,
    useMediaQuery,
    useTheme,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DashboardTemplate } from '../../components/templates';
import { StatusChip } from '../../components/atoms';
import { EstadoPase } from '@vigia/shared-types';

// ─── TIPOS ──────────────────────────────────────────────────────────────────
interface PaseRapidoViewDto {
    pase_id: string;
    codigo: string;
    conductor_nombre: string;
    conductor_cedula: string;
    vehiculo_placa: string;
    vigencia_inicio: string;
    vigencia_fin: string;
    motivo: string;
    estado: EstadoPase;
}

interface NuevoPaseFormState {
    conductor_nombre: string;
    conductor_cedula: string;
    vehiculo_placa: string;
    vigencia_inicio: string;
    vigencia_fin: string;
    motivo: string;
}

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
const MOCK_PLACAS = ['PBW-1234', 'PBA-5678', 'PBB-3456'];

const MOCK_PASES: PaseRapidoViewDto[] = [
    {
        pase_id: 'pase-001',
        codigo: 'VIG-A7K3M2',
        conductor_nombre: 'Jorge Luis Mendoza',
        conductor_cedula: '1723456789',
        vehiculo_placa: 'PBW-1234',
        vigencia_inicio: '2026-07-03T07:00:00',
        vigencia_fin: '2026-07-03T19:00:00',
        motivo: 'Entrega de materiales',
        estado: EstadoPase.ACTIVO,
    },
    {
        pase_id: 'pase-002',
        codigo: 'VIG-R9P4X1',
        conductor_nombre: 'Andrea Salazar',
        conductor_cedula: '1714567890',
        vehiculo_placa: 'PBA-5678',
        vigencia_inicio: '2026-07-02T08:00:00',
        vigencia_fin: '2026-07-02T12:00:00',
        motivo: 'Visita técnica',
        estado: EstadoPase.CONSUMIDO,
    },
    {
        pase_id: 'pase-003',
        codigo: 'VIG-T2N8W5',
        conductor_nombre: 'Roberto Espinoza',
        conductor_cedula: '1709123456',
        vehiculo_placa: 'PBW-1234',
        vigencia_inicio: '2026-06-30T06:00:00',
        vigencia_fin: '2026-06-30T18:00:00',
        motivo: 'Mudanza de equipos',
        estado: EstadoPase.EXPIRADO,
    },
];

const INITIAL_FORM: NuevoPaseFormState = {
    conductor_nombre: '',
    conductor_cedula: '',
    vehiculo_placa: '',
    vigencia_inicio: '',
    vigencia_fin: '',
    motivo: '',
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
const generarCodigo = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin 0,O,1,I,L para evitar confusión
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `VIG-${codigo}`;
};

const formatFechaHora = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleString('es-EC', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const puedeRevocar = (estado: EstadoPase): boolean => estado === EstadoPase.ACTIVO;

// ─── VISTA: CÓDIGO GENERADO ─────────────────────────────────────────────────
interface CodigoGeneradoViewProps {
    pase: PaseRapidoViewDto;
    onVolver: () => void;
}

const CodigoGeneradoView: React.FC<CodigoGeneradoViewProps> = ({ pase, onVolver }) => {
    const [copied, setCopied] = useState(false);

    const handleCopiar = () => {
        navigator.clipboard.writeText(pase.codigo);
        setCopied(true);
    };

    const handleCompartir = async () => {
        if (navigator.share) {
            await navigator.share({
                title: 'Pase de Acceso Rápido VIGIA',
                text: `Código: ${pase.codigo}\nVehículo: ${pase.vehiculo_placa}\nVigencia: ${formatFechaHora(pase.vigencia_inicio)} - ${formatFechaHora(pase.vigencia_fin)}\n\nPresente este código al guardia junto con su cédula.`,
            });
        } else {
            handleCopiar();
        }
    };

    return (
        <Box sx={{ maxWidth: 520, mx: 'auto' }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={onVolver}
                sx={{ mb: 3, color: '#0A2F86' }}
            >
                Volver al listado
            </Button>

            <Card
                sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(10, 47, 134, 0.12)',
                }}
            >
                {/* Header con gradiente */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #0A2F86 0%, #0D5CCF 100%)',
                        color: '#FFFFFF',
                        p: 3,
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            opacity: 0.8,
                            mb: 1,
                        }}
                    >
                        Pase de Acceso Rápido
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: '"Exo 2", sans-serif',
                            fontWeight: 700,
                            fontSize: '2.5rem',
                            letterSpacing: '0.2em',
                            textShadow: '0 0 20px rgba(25, 214, 196, 0.4)',
                        }}
                    >
                        {pase.codigo}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '0.75rem',
                            opacity: 0.7,
                            mt: 1,
                        }}
                    >
                        Código de un solo uso · Dictar al guardia
                    </Typography>
                </Box>

                {/* Datos del pase */}
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>Conductor</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{pase.conductor_nombre}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>Cédula</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{pase.conductor_cedula}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>Vehículo</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{pase.vehiculo_placa}</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>Inicio</Typography>
                            <Typography variant="body2">{formatFechaHora(pase.vigencia_inicio)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>Fin</Typography>
                            <Typography variant="body2">{formatFechaHora(pase.vigencia_fin)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>Motivo</Typography>
                            <Typography variant="body2">{pase.motivo}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#6B7280' }}>Estado</Typography>
                            <StatusChip estado={pase.estado} />
                        </Box>
                    </Box>

                    {/* Warning: código de un solo uso */}
                    <Alert
                        severity="warning"
                        variant="outlined"
                        sx={{
                            mt: 2,
                            mb: 2,
                            borderColor: '#EDB200',
                            backgroundColor: 'rgba(237, 178, 0, 0.04)',
                            '& .MuiAlert-icon': { color: '#EDB200' },
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                            Este código se muestra una sola vez.
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>
                            Cópielo o compártalo ahora. No podrá recuperarlo después de salir de esta pantalla.
                        </Typography>
                    </Alert>

                    {/* Acciones */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<ContentCopyIcon />}
                            onClick={handleCopiar}
                            fullWidth
                            sx={{ backgroundColor: '#0D5CCF' }}
                        >
                            Copiar Código
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<ShareIcon />}
                            onClick={handleCompartir}
                            fullWidth
                            sx={{ borderColor: '#0D5CCF', color: '#0D5CCF' }}
                        >
                            Compartir
                        </Button>
                    </Box>

                    {/* Instrucción */}
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            textAlign: 'center',
                            mt: 2,
                            color: '#6B7280',
                            fontStyle: 'italic',
                        }}
                    >
                        El conductor debe presentar este código + su cédula al guardia en el punto de acceso.
                    </Typography>
                </CardContent>
            </Card>

            <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)}>
                <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                    Código copiado al portapapeles
                </Alert>
            </Snackbar>
        </Box>
    );
};

// ─── PÁGINA PRINCIPAL ───────────────────────────────────────────────────────
export const PasesRapidosPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [pases, setPases] = useState<PaseRapidoViewDto[]>(MOCK_PASES);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formState, setFormState] = useState<NuevoPaseFormState>(INITIAL_FORM);
    const [paseGenerado, setPaseGenerado] = useState<PaseRapidoViewDto | null>(null);
    const [solapamientoError, setSolapamientoError] = useState<string | null>(null);

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSolapamientoError(null);
        setFormState(INITIAL_FORM);
    };

    const handleFieldChange = (field: keyof NuevoPaseFormState) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleCrearPase = () => {
        // Limpiar error previo
        setSolapamientoError(null);

        // Validar campos requeridos
        if (!formState.conductor_nombre || !formState.conductor_cedula || !formState.vehiculo_placa || !formState.vigencia_inicio || !formState.vigencia_fin || !formState.motivo) {
            return;
        }

        // Validar que fin > inicio
        const inicio = new Date(formState.vigencia_inicio).getTime();
        const fin = new Date(formState.vigencia_fin).getTime();
        if (fin <= inicio) {
            setSolapamientoError('La fecha/hora de fin debe ser posterior a la de inicio.');
            return;
        }

        // Validar solapamiento: un vehículo NO puede tener dos pases con ventanas solapadas
        const paseConflicto = pases.find(
            (p) =>
                p.vehiculo_placa === formState.vehiculo_placa &&
                (p.estado === EstadoPase.ACTIVO) &&
                new Date(p.vigencia_inicio).getTime() < fin &&
                new Date(p.vigencia_fin).getTime() > inicio
        );

        if (paseConflicto) {
            setSolapamientoError(
                `El vehículo ${formState.vehiculo_placa} ya tiene un pase activo (${paseConflicto.codigo}) en ese rango horario. Revoque el pase existente o elija otro horario.`
            );
            return;
        }

        // Crear el pase
        const nuevoPase: PaseRapidoViewDto = {
            pase_id: `pase-${Date.now()}`,
            codigo: generarCodigo(),
            conductor_nombre: formState.conductor_nombre,
            conductor_cedula: formState.conductor_cedula,
            vehiculo_placa: formState.vehiculo_placa,
            vigencia_inicio: formState.vigencia_inicio,
            vigencia_fin: formState.vigencia_fin,
            motivo: formState.motivo,
            estado: EstadoPase.ACTIVO,
        };

        setPases((prev) => [nuevoPase, ...prev]);
        setPaseGenerado(nuevoPase);
        setDialogOpen(false);
        setFormState(INITIAL_FORM);
    };

    const handleRevocar = (paseId: string) => {
        setPases((prev) =>
            prev.map((p) => (p.pase_id === paseId ? { ...p, estado: EstadoPase.REVOCADO } : p))
        );
    };

    // ─── VISTA: Código Generado (después de crear) ────────────────────────────
    if (paseGenerado) {
        return (
            <DashboardTemplate
                rol="PROPIETARIO"
                pageTitle="Pase Generado"
                notificationCount={2}
                userInitials="AC"
            >
                <CodigoGeneradoView
                    pase={paseGenerado}
                    onVolver={() => setPaseGenerado(null)}
                />
            </DashboardTemplate>
        );
    }

    // ─── VISTA: Listado principal ─────────────────────────────────────────────
    return (
        <DashboardTemplate
            rol="PROPIETARIO"
            pageTitle="Pases de Acceso Rápido"
            notificationCount={2}
            userInitials="AC"
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}
                >
                    Pases de Acceso Rápido
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setDialogOpen(true)}
                >
                    Nuevo Pase
                </Button>
            </Box>

            {/* Nota informativa */}
            <Card sx={{ mb: 3, backgroundColor: 'rgba(13,92,207,0.04)', border: '1px solid rgba(13,92,207,0.12)', borderRadius: '8px' }}>
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="body2" sx={{ color: '#0A2F86' }}>
                        <strong>¿Cómo funciona?</strong> Genera un código alfanumérico de un solo uso. El conductor lo dicta al guardia,
                        quien lo digita en su terminal junto con la verificación de cédula. El código se invalida tras su primer uso.
                    </Typography>
                </CardContent>
            </Card>

            {/* Tabla / Cards de pases existentes */}
            {isMobile ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {pases.map((pase) => (
                        <Card key={pase.pase_id} sx={{ borderRadius: '8px' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, letterSpacing: '0.1em' }}>
                                        {pase.codigo}
                                    </Typography>
                                    <StatusChip estado={pase.estado} />
                                </Box>
                                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                    {pase.conductor_nombre} · {pase.conductor_cedula}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                    Vehículo: {pase.vehiculo_placa}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#6B7280' }}>
                                    {formatFechaHora(pase.vigencia_inicio)} → {formatFechaHora(pase.vigencia_fin)}
                                </Typography>
                                {puedeRevocar(pase.estado) && (
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        sx={{ mt: 2 }}
                                        onClick={() => handleRevocar(pase.pase_id)}
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
                                {['Código', 'Conductor', 'Cédula', 'Vehículo', 'Vigencia', 'Estado', 'Acciones'].map((h) => (
                                    <TableCell key={h} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: '#0A2F86' }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pases.map((pase) => (
                                <TableRow key={pase.pase_id} hover>
                                    <TableCell sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, letterSpacing: '0.08em' }}>
                                        {pase.codigo}
                                    </TableCell>
                                    <TableCell>{pase.conductor_nombre}</TableCell>
                                    <TableCell>{pase.conductor_cedula}</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>{pase.vehiculo_placa}</TableCell>
                                    <TableCell sx={{ fontSize: '0.8rem' }}>
                                        {formatFechaHora(pase.vigencia_inicio)}
                                        <br />
                                        {formatFechaHora(pase.vigencia_fin)}
                                    </TableCell>
                                    <TableCell>
                                        <StatusChip estado={pase.estado} />
                                    </TableCell>
                                    <TableCell>
                                        {puedeRevocar(pase.estado) && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleRevocar(pase.pase_id)}
                                            >
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

            {/* Dialog: Nuevo Pase */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}>
                    Nuevo Pase de Acceso Rápido
                </DialogTitle>
                {solapamientoError && (
                    <Alert
                        severity="error"
                        sx={{ mx: 3, mt: 1 }}
                        onClose={() => setSolapamientoError(null)}
                    >
                        {solapamientoError}
                    </Alert>
                )}
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                        Complete los datos del conductor que utilizará el pase. El código se generará automáticamente.
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Nombre del Conductor"
                                required
                                fullWidth
                                value={formState.conductor_nombre}
                                onChange={handleFieldChange('conductor_nombre')}
                                placeholder="Ej: Jorge Luis Mendoza"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cédula del Conductor"
                                required
                                fullWidth
                                value={formState.conductor_cedula}
                                onChange={handleFieldChange('conductor_cedula')}
                                placeholder="Ej: 1723456789"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Vehículo Autorizado"
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
                                label="Motivo del Acceso"
                                required
                                fullWidth
                                multiline
                                rows={2}
                                value={formState.motivo}
                                onChange={handleFieldChange('motivo')}
                                placeholder="Ej: Entrega de materiales de construcción"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button variant="contained" color="primary" onClick={handleCrearPase}>
                        Generar Pase
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardTemplate>
    );
};

export default PasesRapidosPage;