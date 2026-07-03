import React from 'react';
import { Box, Card, CardContent, Divider, Typography, Button } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { StatusChip } from '../atoms';
import { EstadoAutorizacion } from '@vigia/shared-types';

export interface VehiculoConEstadoDto {
    vehiculo_id: string;
    placa: string;
    marca: string;
    modelo: string;
    color: string;
    anio: number;
    estado_registro: 'ACTIVO' | 'INACTIVO';
    estado_autorizacion: EstadoAutorizacion;
}

const BORDE_COLOR: Record<string, string> = {
    ACTIVA: '#2E7D32',
    EXPIRADO: '#6B7280',
    REVOCADO: '#C62828',
    PROGRAMADO: '#1565C0',
    INACTIVA: '#6B7280',
};

export interface VehicleCardProps {
    vehiculo: VehiculoConEstadoDto;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehiculo }) => {
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

export default VehicleCard;
