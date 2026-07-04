import React, { useState } from 'react';
import { 
    Box, Typography, Button, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, MenuItem, Grid, Snackbar, Alert 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DashboardTemplate } from '../../components/templates';
import { VehicleGrid } from '../../components/organisms';
import { EmptyState } from '../../components/atoms';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { VehiculoConEstadoDto } from '../../components/molecules/VehicleCard';
import { EstadoAutorizacion } from '@vigia/shared-types';

const MOCK_VEHICULOS: VehiculoConEstadoDto[] = [
    {
        vehiculo_id: 'veh-001',
        placa: 'PBW-1234',
        marca: 'Chevrolet',
        modelo: 'Sail',
        anio: 2023,
        color: 'Blanco',
        estado_registro: 'ACTIVO',
        estado_autorizacion: EstadoAutorizacion.ACTIVA,
    },
    {
        vehiculo_id: 'veh-002',
        placa: 'PBA-5678',
        marca: 'Kia',
        modelo: 'Rio',
        anio: 2021,
        color: 'Gris',
        estado_registro: 'ACTIVO',
        estado_autorizacion: EstadoAutorizacion.ACTIVA,
    },
    {
        vehiculo_id: 'veh-003',
        placa: 'PCE-9012',
        marca: 'Hyundai',
        modelo: 'Accent',
        anio: 2019,
        color: 'Negro',
        estado_registro: 'ACTIVO',
        estado_autorizacion: EstadoAutorizacion.EXPIRADO,
    },
    {
        vehiculo_id: 'veh-004',
        placa: 'PBB-3456',
        marca: 'Nissan',
        modelo: 'Sentra',
        anio: 2022,
        color: 'Azul',
        estado_registro: 'ACTIVO',
        estado_autorizacion: EstadoAutorizacion.REVOCADO,
    },
];

const TIPOS_VEHICULO = ['SEDAN', 'SUV', 'CAMIONETA', 'HATCHBACK', 'MOTOCICLETA'];
const COLORES = ['Blanco', 'Negro', 'Gris', 'Azul', 'Rojo', 'Verde', 'Amarillo'];

export const MisVehiculosPage: React.FC = () => {
    const [vehiculos, setVehiculos] = useState<VehiculoConEstadoDto[]>(MOCK_VEHICULOS);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [exitoSnackbar, setExitoSnackbar] = useState(false);
    const [nuevoVehiculo, setNuevoVehiculo] = useState({
        placa: '',
        marca: '',
        modelo: '',
        anio: '',
        color: '',
        tipo: 'SEDAN',
    });

    const handleRegistrarVehiculo = () => {
        const nuevo: VehiculoConEstadoDto = {
            vehiculo_id: `veh-${Date.now()}`,
            placa: nuevoVehiculo.placa.toUpperCase(),
            marca: nuevoVehiculo.marca,
            modelo: nuevoVehiculo.modelo,
            anio: parseInt(nuevoVehiculo.anio) || 2026,
            color: nuevoVehiculo.color,
            estado_registro: 'ACTIVO',
            estado_autorizacion: EstadoAutorizacion.ACTIVA,
        };
        setVehiculos((prev) => [nuevo, ...prev]);
        setDialogOpen(false);
        setNuevoVehiculo({ placa: '', marca: '', modelo: '', anio: '', color: '', tipo: 'SEDAN' });
        setExitoSnackbar(true);
    };

    const handleAddClick = () => setDialogOpen(true);

    return (
        <DashboardTemplate
            rol="PROPIETARIO"
            pageTitle="Mis Vehículos"
            notificationCount={2}
            userInitials="AC"
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}
                >
                    Mis Vehículos Registrados
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
                    Registrar Vehículo
                </Button>
            </Box>

            {vehiculos.length === 0 ? (
                <EmptyState
                    titulo="Sin vehículos registrados"
                    descripcion="Registre su primer vehículo para comenzar a gestionar accesos."
                    icono={<DirectionsCarIcon sx={{ fontSize: 64, color: '#E0E3E8' }} />}
                    accionLabel="Registrar Vehículo"
                    onAccion={handleAddClick}
                />
            ) : (
                <VehicleGrid vehiculos={vehiculos} onAddClick={handleAddClick} />
            )}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}>
                    Registrar Nuevo Vehículo
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#6B7280', mb: 2 }}>
                        Ingrese los datos del vehículo que desea registrar en el sistema.
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Placa"
                                required
                                fullWidth
                                value={nuevoVehiculo.placa}
                                onChange={(e) => setNuevoVehiculo((prev) => ({ ...prev, placa: e.target.value }))}
                                placeholder="Ej: PBW-1234"
                                inputProps={{ style: { textTransform: 'uppercase' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Marca"
                                required
                                fullWidth
                                value={nuevoVehiculo.marca}
                                onChange={(e) => setNuevoVehiculo((prev) => ({ ...prev, marca: e.target.value }))}
                                placeholder="Ej: Chevrolet"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Modelo"
                                required
                                fullWidth
                                value={nuevoVehiculo.modelo}
                                onChange={(e) => setNuevoVehiculo((prev) => ({ ...prev, modelo: e.target.value }))}
                                placeholder="Ej: Sail"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Año"
                                type="number"
                                required
                                fullWidth
                                value={nuevoVehiculo.anio}
                                onChange={(e) => setNuevoVehiculo((prev) => ({ ...prev, anio: e.target.value }))}
                                placeholder="Ej: 2023"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Color"
                                required
                                fullWidth
                                value={nuevoVehiculo.color}
                                onChange={(e) => setNuevoVehiculo((prev) => ({ ...prev, color: e.target.value }))}
                            >
                                {COLORES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                label="Tipo de Vehículo"
                                required
                                fullWidth
                                value={nuevoVehiculo.tipo}
                                onChange={(e) => setNuevoVehiculo((prev) => ({ ...prev, tipo: e.target.value }))}
                            >
                                {TIPOS_VEHICULO.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button variant="contained" color="primary" onClick={handleRegistrarVehiculo}>
                        Registrar Vehículo
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={exitoSnackbar} autoHideDuration={3000} onClose={() => setExitoSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity="success" variant="filled" sx={{ width: '100%' }}>Vehículo registrado exitosamente</Alert>
            </Snackbar>
        </DashboardTemplate>
    );
};

export default MisVehiculosPage;