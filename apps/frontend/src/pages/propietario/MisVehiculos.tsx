// src/pages/propietario/MisVehiculos.tsx
import React from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StatusChip } from '../../components/StatusChip';
import { EstadoAutorizacion } from '@vigia/shared-types';

interface VehiculoConEstadoDto {
    vehiculo_id: string;
    placa: string;
    marca: string;
    modelo: string;
    color: string;
    anio: number;
    estado_registro: 'ACTIVO' | 'INACTIVO';
    estado_autorizacion: EstadoAutorizacion;
}

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

const BORDE_COLOR: Record<string, string> = {
    ACTIVA: '#2E7D32',
    EXPIRADO: '#6B7280',
    REVOCADO: '#C62828',
    PROGRAMADO: '#1565C0',
    INACTIVA: '#6B7280',
};

interface VehiculoCardProps {
    vehiculo: VehiculoConEstadoDto;
}

const VehiculoCard: React.FC<VehiculoCardProps> = ({ vehiculo }) => {
    const bordeColor = BORDE_COLOR[vehiculo.estado_autorizacion] ?? '#6B7280';

    return (
        <Card
            sx={{
                borderTop: `3px solid ${bordeColor}`,
                borderRadius: '8px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(10, 47, 134, 0.12)',
                },
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <DirectionsCarIcon sx={{ color: '#0D5CCF' }} />
                    <Typography
                        sx={{
                            fontFamily: '"Exo 2", sans-serif',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            color: '#0A2F86',
                        }}
                    >
                        {vehiculo.placa}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280' }}>
                            Marca
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                            {vehiculo.marca}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280' }}>
                            Modelo
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                            {vehiculo.modelo}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280' }}>
                            Año
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                            {vehiculo.anio}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280' }}>
                            Color
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                            {vehiculo.color}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <StatusChip estado={vehiculo.estado_autorizacion} />
                    <Button size="small" variant="text" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
                        Ver Detalle
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

const EmptyVehiculos: React.FC = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 10,
            gap: 2,
        }}
    >
        <DirectionsCarIcon sx={{ fontSize: 96, color: '#E0E3E8' }} />
        <Typography
            variant="h6"
            sx={{ fontFamily: '"Exo 2", sans-serif', color: '#6B7280', fontWeight: 600 }}
        >
            Aún no has registrado vehículos
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 1 }}>
            Registrar Vehículo
        </Button>
    </Box>
);

export const MisVehiculosPage: React.FC = () => {
    const vehiculos = MOCK_VEHICULOS;

    return (
        <DashboardLayout pageTitle="Mis Vehículos">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86' }}
                >
                    Mis Vehículos Registrados
                </Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                    Registrar Vehículo
                </Button>
            </Box>

            {vehiculos.length === 0 ? (
                <EmptyVehiculos />
            ) : (
                <Grid container spacing={3}>
                    {vehiculos.map((vehiculo) => (
                        <Grid item xs={12} sm={6} md={4} key={vehiculo.vehiculo_id}>
                            <VehiculoCard vehiculo={vehiculo} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </DashboardLayout>
    );
};

export default MisVehiculosPage;