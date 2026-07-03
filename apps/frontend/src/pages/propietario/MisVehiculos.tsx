import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { DashboardTemplate } from '../../components/templates';
import { VehicleGrid } from '../../components/organisms';
import { VehiculoConEstadoDto } from '../../components/molecules/VehicleCard';
import { EstadoAutorizacion } from '@vigia/shared-types';

const NAV_ROUTES = [
    { label: 'Mis Vehículos', path: '/propietario/vehiculos', icon: <DirectionsCarIcon /> },
    { label: 'Permisos Temporales', path: '/propietario/permisos-temporales', icon: <AccessTimeIcon /> },
    { label: 'Pase Rápido', path: '/propietario/pases-rapidos', icon: <QrCode2Icon /> },
    { label: 'Notificaciones', path: '/propietario/notificaciones', icon: <NotificationsOutlinedIcon /> },
];

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

export const MisVehiculosPage: React.FC = () => {
    const vehiculos = MOCK_VEHICULOS;

    const handleAddClick = () => {
        // Open modal
    };

    return (
        <DashboardTemplate
            rol="PROPIETARIO"
            pageTitle="Mis Vehículos"
            routes={NAV_ROUTES}
            notificationCount={2}
            userInitials="US"
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

            <VehicleGrid vehiculos={vehiculos} onAddClick={handleAddClick} />
        </DashboardTemplate>
    );
};

export default MisVehiculosPage;