import React from 'react';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Button,
    Card,
    CardContent,
    Box,
    Typography,
    Divider,
} from '@mui/material';
import { StatusChip } from '../atoms';
import { EstadoAutorizacion } from '@vigia/shared-types';

export interface PermisoTemporalViewDto {
    permiso_temporal_id: string;
    persona_autorizada_nombre: string;
    persona_autorizada_cedula: string;
    vehiculo_placa: string;
    vigencia_inicio: string;
    vigencia_fin: string;
    motivo_otorgamiento: string;
    estado_autorizacion: EstadoAutorizacion;
}

export interface PermisosTableProps {
    permisos: PermisoTemporalViewDto[];
    isMobile: boolean;
    onRevocar?: (permisoId: string) => void;
}

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

const puedeRevocar = (estado: EstadoAutorizacion): boolean =>
    estado === EstadoAutorizacion.PROGRAMADO || estado === EstadoAutorizacion.ACTIVA;

export const PermisosTable: React.FC<PermisosTableProps> = ({ permisos, isMobile, onRevocar }) => {
    if (isMobile) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {permisos.map((permiso) => (
                    <Card key={permiso.permiso_temporal_id} sx={{ borderRadius: '8px' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600 }}>
                                    {permiso.persona_autorizada_nombre}
                                </Typography>
                                <StatusChip estado={permiso.estado_autorizacion} />
                            </Box>
                            <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280' }}>
                                Cédula: {permiso.persona_autorizada_cedula}
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280' }}>
                                Vehículo: {permiso.vehiculo_placa}
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280' }}>
                                Inicio: {formatFechaHora(permiso.vigencia_inicio)}
                            </Typography>
                            <br />
                            <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', color: '#6B7280' }}>
                                Fin: {formatFechaHora(permiso.vigencia_fin)}
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', mt: 1 }}>
                                {permiso.motivo_otorgamiento}
                            </Typography>
                            {puedeRevocar(permiso.estado_autorizacion) && (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    sx={{ mt: 2 }}
                                    onClick={() => onRevocar?.(permiso.permiso_temporal_id)}
                                >
                                    Revocar
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
                        {['Persona Autorizada', 'Cédula', 'Vehículo', 'Inicio', 'Fin', 'Estado', 'Acciones'].map((h) => (
                            <TableCell key={h} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, color: '#0A2F86' }}>
                                {h}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {permisos.map((permiso) => (
                        <TableRow key={permiso.permiso_temporal_id} hover>
                            <TableCell sx={{ fontFamily: '"Inter", sans-serif' }}>
                                {permiso.persona_autorizada_nombre}
                            </TableCell>
                            <TableCell sx={{ fontFamily: '"Inter", sans-serif' }}>
                                {permiso.persona_autorizada_cedula}
                            </TableCell>
                            <TableCell sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>
                                {permiso.vehiculo_placa}
                            </TableCell>
                            <TableCell sx={{ fontFamily: '"Inter", sans-serif' }}>
                                {formatFechaHora(permiso.vigencia_inicio)}
                            </TableCell>
                            <TableCell sx={{ fontFamily: '"Inter", sans-serif' }}>
                                {formatFechaHora(permiso.vigencia_fin)}
                            </TableCell>
                            <TableCell>
                                <StatusChip estado={permiso.estado_autorizacion} />
                            </TableCell>
                            <TableCell>
                                {puedeRevocar(permiso.estado_autorizacion) && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => onRevocar?.(permiso.permiso_temporal_id)}
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
    );
};

export default PermisosTable;
