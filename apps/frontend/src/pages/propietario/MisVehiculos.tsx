import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { motion, useReducedMotion } from 'framer-motion';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { StatusChip, EmptyState } from '../../components/atoms';
import { staggerContainer, staggerItem, fadeInUp } from '../../config/animations.config';
import { vigiaShadows, vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';

// === TIPOS ===
interface VehiculoViewDto {
  vehiculo_id: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  estado_registro: string;
  tipo?: string;
}

// === CONSTANTES ===
const TIPOS_VEHICULO = ['SEDAN', 'SUV', 'CAMIONETA', 'HATCHBACK', 'MOTOCICLETA'];
const COLORES = ['Blanco', 'Negro', 'Gris', 'Azul', 'Rojo', 'Verde', 'Amarillo', 'Plateado'];
const INITIAL_FORM = {
  placa: '',
  marca: '',
  modelo: '',
  anio: '',
  color: '',
  tipo: 'SEDAN',
};

// === MOCK DATA ===
const MOCK_VEHICULOS: VehiculoViewDto[] = [
  { vehiculo_id: 'veh-001', placa: 'PBW-1234', marca: 'Chevrolet', modelo: 'Sail', anio: 2022, color: 'Blanco', estado_registro: 'ACTIVO' },
  { vehiculo_id: 'veh-002', placa: 'PBA-5678', marca: 'Kia', modelo: 'Rio', anio: 2023, color: 'Gris', estado_registro: 'ACTIVO' },
  { vehiculo_id: 'veh-003', placa: 'PBB-3456', marca: 'Hyundai', modelo: 'Accent', anio: 2021, color: 'Negro', estado_registro: 'ACTIVO' },
  { vehiculo_id: 'veh-004', placa: 'PCE-9012', marca: 'Toyota', modelo: 'Corolla', anio: 2020, color: 'Azul', estado_registro: 'INACTIVO' },
];

// === COMPONENTE PRINCIPAL ===
const MisVehiculosPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldReduceMotion = useReducedMotion();

  // Estado
  const [vehiculos, setVehiculos] = useState<VehiculoViewDto[]>(MOCK_VEHICULOS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exitoSnackbar, setExitoSnackbar] = useState(false);
  const [nuevoVehiculo, setNuevoVehiculo] = useState(INITIAL_FORM);

  // Handlers
  const handleRegistrarVehiculo = () => {
    if (!nuevoVehiculo.placa || !nuevoVehiculo.marca || !nuevoVehiculo.modelo || !nuevoVehiculo.anio || !nuevoVehiculo.color) {
      return;
    }
    const nuevo: VehiculoViewDto = {
      vehiculo_id: `veh-${Date.now()}`,
      placa: nuevoVehiculo.placa.toUpperCase(),
      marca: nuevoVehiculo.marca,
      modelo: nuevoVehiculo.modelo,
      anio: parseInt(nuevoVehiculo.anio) || 2026,
      color: nuevoVehiculo.color,
      estado_registro: 'ACTIVO',
      tipo: nuevoVehiculo.tipo,
    };
    setVehiculos((prev) => [nuevo, ...prev]);
    setDialogOpen(false);
    setNuevoVehiculo(INITIAL_FORM);
    setExitoSnackbar(true);
  };

  // Color del borde lateral según estado
  const getBorderColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return vigiaColors.success;
      case 'INACTIVO': return vigiaColors.textTertiary;
      case 'REVOCADO': return vigiaColors.error;
      default: return vigiaColors.textTertiary;
    }
  };

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Mis Vehículos">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>

        {/* Header con botón premium */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 600,
                  fontSize: isMobile ? '1.1rem' : '1.25rem',
                  color: vigiaColors.textHeading,
                }}
              >
                Mis Vehículos
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary, mt: 0.25 }}>
                {vehiculos.filter((v) => v.estado_registro === 'ACTIVO').length} activos de {vehiculos.length} registrados
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              sx={{
                background: vigiaColors.gradientIA,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'none',
                borderRadius: vigiaRadius.sm,
                px: 3,
                py: 1.2,
                boxShadow: vigiaShadows.sm,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: vigiaColors.gradientIA,
                  boxShadow: vigiaShadows.md,
                  transform: shouldReduceMotion ? 'none' : 'translateY(-1px)',
                },
              }}
            >
              Registrar Vehículo
            </Button>
          </Box>
        </motion.div>

        {/* Grid de vehículos o EmptyState */}
        {vehiculos.length === 0 ? (
          <EmptyState
            titulo="Sin vehículos registrados"
            descripcion="Registre su primer vehículo para comenzar a gestionar accesos."
            icono={<DirectionsCarIcon sx={{ fontSize: 64, color: '#E0E3E8' }} />}
            accionLabel="Registrar Vehículo"
            onAccion={() => setDialogOpen(true)}
          />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: `${vigiaSpacing.cardGap}px`,
              }}
            >
              {vehiculos.map((vehiculo) => (
                <motion.div key={vehiculo.vehiculo_id} variants={staggerItem}>
                  <Card
                    tabIndex={0}
                    sx={{
                      borderRadius: vigiaRadius.md,
                      boxShadow: vigiaShadows.sm,
                      borderLeft: `4px solid ${getBorderColor(vehiculo.estado_registro)}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: '100%',
                      '&:hover': {
                        transform: shouldReduceMotion ? 'none' : 'translateY(-3px)',
                        boxShadow: vigiaShadows.md,
                        backgroundColor: vigiaColors.bgCardHover,
                      },
                      '&:focus-visible': {
                        outline: `2px solid ${vigiaColors.greenIA}`,
                        outlineOffset: '2px',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      {/* Placa hero + Estado */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Typography
                          sx={{
                            fontFamily: '"Exo 2", sans-serif',
                            fontWeight: 700,
                            fontSize: '1.3rem',
                            color: vigiaColors.textHeading,
                            backgroundColor: 'rgba(13, 92, 207, 0.04)',
                            px: 1,
                            py: 0.25,
                            borderRadius: '4px',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {vehiculo.placa}
                        </Typography>
                        <StatusChip estado={vehiculo.estado_registro} />
                      </Box>

                      {/* Marca y modelo */}
                      <Typography
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '0.9rem',
                          color: vigiaColors.textBody,
                          fontWeight: 500,
                        }}
                      >
                        {vehiculo.marca} {vehiculo.modelo}
                      </Typography>

                      {/* Año y color */}
                      <Typography
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '0.8rem',
                          color: vigiaColors.textTertiary,
                          mt: 0.5,
                        }}
                      >
                        {vehiculo.anio} · {vehiculo.color}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        )}
      </Box>

      {/* ============ DIALOG REGISTRO ============ */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: vigiaColors.textHeading }}>
          Registrar Nuevo Vehículo
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, mb: 2 }}>
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
                {COLORES.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
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
                {TIPOS_VEHICULO.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: vigiaColors.textSecondary }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleRegistrarVehiculo}
            sx={{
              background: vigiaColors.gradientIA,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: vigiaRadius.sm,
              '&:hover': { background: vigiaColors.gradientIA },
            }}
          >
            Registrar Vehículo
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============ SNACKBAR ÉXITO ============ */}
      <Snackbar
        open={exitoSnackbar}
        autoHideDuration={3000}
        onClose={() => setExitoSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Vehículo registrado exitosamente
        </Alert>
      </Snackbar>
    </DashboardTemplate>
  );
};

export { MisVehiculosPage };
export default MisVehiculosPage;