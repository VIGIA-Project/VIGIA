import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { VehicleCard, VehiculoConEstadoDto } from '../molecules/VehicleCard';

export interface VehicleGridProps {
    vehiculos: VehiculoConEstadoDto[];
    onAddClick?: () => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({ vehiculos, onAddClick }) => {
    if (vehiculos.length === 0) {
        return (
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
                <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 1 }} onClick={onAddClick}>
                    Registrar Vehículo
                </Button>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {vehiculos.map((vehiculo) => (
                <Grid item xs={12} sm={6} md={4} key={vehiculo.vehiculo_id}>
                    <VehicleCard vehiculo={vehiculo} />
                </Grid>
            ))}
        </Grid>
    );
};

export default VehicleGrid;
