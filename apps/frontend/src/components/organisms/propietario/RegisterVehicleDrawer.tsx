// src/components/organisms/propietario/RegisterVehicleDrawer.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Drawer, IconButton, InputAdornment, MenuItem, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../../theme/vigia-theme';
import { VehiclePreviewCard } from '../../molecules/VehiclePreviewCard';
import {
  PropietarioVehiculo,
  VEHICLE_COLOR_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  REGISTER_VEHICLE_DRAWER_COPY as COPY,
} from '../../../config/propietario-vehiculos.config';

const PLACA_REGEX = /^[A-Z]{3}-\d{4}$/;
const ANIO_MIN = 1990;
const ANIO_MAX = 2027;

const registerVehicleSchema = z.object({
  placa: z.string().regex(PLACA_REGEX, 'Formato inválido. Use ABC-1234'),
  marca: z.string().trim().min(1, 'Ingrese la marca'),
  modelo: z.string().trim().min(1, 'Ingrese el modelo'),
  anio: z.coerce
      .number({ message: 'Ingrese un año válido' })
      .min(ANIO_MIN, `Año mínimo ${ANIO_MIN}`)
      .max(ANIO_MAX, `Año máximo ${ANIO_MAX}`),
  color: z.string().min(1, 'Seleccione un color'),
  tipo: z.string().min(1, 'Seleccione un tipo'),
  observacion: z.string().optional(),
});

type RegisterVehicleFormValues = z.infer<typeof registerVehicleSchema>;

const EMPTY_VALUES = { placa: '', marca: '', modelo: '', color: '', tipo: '', observacion: '' };

export interface RegisterVehicleDrawerProps {
  open: boolean;
  onClose: () => void;
  onRegistered?: (data: any) => Promise<void> | void; // Cambiado a promesa para soportar el estado de carga del padre
  onUpdated?: (data: any) => Promise<void> | void;
  mode?: 'create' | 'edit';
  vehiculo?: PropietarioVehiculo | null;
}

export const RegisterVehicleDrawer: React.FC<RegisterVehicleDrawerProps> = ({ open, onClose, onRegistered, onUpdated, mode = 'create', vehiculo }) => {
  const isEdit = mode === 'edit';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterVehicleFormValues>({
    resolver: zodResolver(registerVehicleSchema),
    mode: 'onChange',
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!open) {
      reset(EMPTY_VALUES);
      return;
    }
    if (isEdit && vehiculo) {
      reset({
        placa: vehiculo.placa,
        marca: vehiculo.marca,
        modelo: vehiculo.modelo,
        anio: vehiculo.anio,
        color: vehiculo.color,
        tipo: vehiculo.tipo,
        observacion: vehiculo.observacion || '',
      });
    }
  }, [open, isEdit, vehiculo, reset]);

  const placa = watch('placa') || '';
  const marca = watch('marca') || '';
  const modelo = watch('modelo') || '';
  const color = watch('color') || '';
  const anio = watch('anio');
  const placaValid = PLACA_REGEX.test(placa);

  const onSubmit = async (data: RegisterVehicleFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && vehiculo) {
        await onUpdated?.({
          ...vehiculo,
          marca: data.marca,
          modelo: data.modelo,
          anio: data.anio,
          color: data.color,
          tipo: data.tipo,
          observacion: data.observacion,
        });
      } else {
        await onRegistered?.(data);
      }
      onClose();
    } catch (err) {
      // Manejado por el feedback del padre o interceptores
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconSx = { fontSize: 18, color: vigiaColors.textTertiary };

  return (
      <Drawer
          anchor="right"
          open={open}
          onClose={onClose}
          transitionDuration={{ enter: 280, exit: 220 }}
          PaperProps={{
            sx: {
              width: { xs: '100vw', sm: 460 },
              borderRadius: { xs: 0, sm: '16px 0 0 16px' },
              boxShadow: vigiaShadows.lg,
            },
          }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: 3, borderBottom: '1px solid #F1F5F9' }}>
            <Box>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.25rem', color: vigiaColors.textHeading }}>
                {isEdit ? COPY.editTitle : COPY.title}
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary, mt: 0.25 }}>
                {isEdit ? COPY.editSubtitle : COPY.subtitle}
              </Typography>
            </Box>
            <IconButton onClick={onClose} aria-label="Cerrar" sx={{ color: vigiaColors.textSecondary }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: vigiaColors.textTertiary }}>
              {COPY.sectionVehiculo}
            </Typography>

            <Controller
                name="placa"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        label={COPY.placaLabel}
                        placeholder={COPY.placaPlaceholder}
                        disabled={isEdit}
                        error={!isEdit && !!errors.placa}
                        helperText={isEdit ? COPY.placaHelperEdit : errors.placa?.message || COPY.placaHelper}
                        fullWidth
                        required
                        InputProps={{ startAdornment: <InputAdornment position="start"><DirectionsCarFilledOutlinedIcon sx={{ fontSize: 20, color: vigiaColors.primary }} /></InputAdornment> }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#EFF6FF',
                            borderRadius: vigiaRadius.md,
                            '& fieldset': { borderWidth: '2px', borderColor: '#BFDBFE' },
                            '&:hover fieldset': { borderColor: vigiaColors.primary },
                            '&.Mui-focused fieldset': { borderColor: vigiaColors.primary },
                          },
                          '& input': { textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, fontSize: '1.125rem', color: '#0F172A' },
                        }}
                    />
                )}
            />
            <Controller
                name="marca"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={COPY.marcaLabel}
                        placeholder={COPY.marcaPlaceholder}
                        error={!!errors.marca}
                        helperText={errors.marca?.message}
                        fullWidth
                        required
                        InputProps={{ startAdornment: <InputAdornment position="start"><SellOutlinedIcon sx={iconSx} /></InputAdornment> }}
                    />
                )}
            />
            <Controller
                name="modelo"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={COPY.modeloLabel}
                        placeholder={COPY.modeloPlaceholder}
                        error={!!errors.modelo}
                        helperText={errors.modelo?.message}
                        fullWidth
                        required
                        InputProps={{ startAdornment: <InputAdornment position="start"><CategoryOutlinedIcon sx={iconSx} /></InputAdornment> }}
                    />
                )}
            />
            <Controller
                name="anio"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        value={field.value ?? ''}
                        type="number"
                        label={COPY.anioLabel}
                        placeholder={COPY.anioPlaceholder}
                        error={!!errors.anio}
                        helperText={errors.anio?.message}
                        fullWidth
                        required
                        InputProps={{ startAdornment: <InputAdornment position="start"><EventOutlinedIcon sx={iconSx} /></InputAdornment> }}
                    />
                )}
            />
            <Controller
                name="color"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        label={COPY.colorLabel}
                        error={!!errors.color}
                        helperText={errors.color?.message}
                        fullWidth
                        required
                        InputProps={{ startAdornment: <InputAdornment position="start"><PaletteOutlinedIcon sx={iconSx} /></InputAdornment> }}
                    >
                      {VEHICLE_COLOR_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                      ))}
                    </TextField>
                )}
            />
            <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        label={COPY.tipoLabel}
                        error={!!errors.tipo}
                        helperText={errors.tipo?.message}
                        fullWidth
                        required
                        InputProps={{ startAdornment: <InputAdornment position="start"><DirectionsCarOutlinedIcon sx={iconSx} /></InputAdornment> }}
                    >
                      {VEHICLE_TYPE_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                      ))}
                    </TextField>
                )}
            />

            <VehiclePreviewCard placa={placa} marca={marca} modelo={modelo} color={color} anio={anio ? String(anio) : ''} visible={placaValid} />

            <Box sx={{ borderTop: '1px solid #F1F5F9', pt: 2.25, mt: 0.5 }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: vigiaColors.textTertiary, mb: 2 }}>
                {COPY.sectionAdicional}
              </Typography>
              <Controller
                  name="observacion"
                  control={control}
                  render={({ field }) => (
                      <TextField
                          {...field}
                          label={COPY.observacionLabel}
                          placeholder={COPY.observacionPlaceholder}
                          fullWidth
                          multiline
                          InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}><NotesOutlinedIcon sx={iconSx} /></InputAdornment> }}
                          sx={{ '& .MuiInputBase-root': { minHeight: 96, alignItems: 'flex-start' } }}
                      />
                  )}
              />
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ display: 'flex', gap: 1.5, p: 3, borderTop: '1px solid #F1F5F9' }}>
            <Button
                fullWidth
                variant="outlined"
                onClick={onClose}
                sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: '#E2E8F0', color: vigiaColors.textSecondary }}
            >
              {COPY.cancelLabel}
            </Button>
            <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || isSubmitting}
                sx={{
                  background: !isValid || isSubmitting ? 'rgba(13,92,207,0.3)' : vigiaColors.gradientIA,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: vigiaRadius.sm,
                  minHeight: 48,
                }}
            >
              {isSubmitting ? <CircularProgress size={18} sx={{ color: '#FFFFFF' }} /> : isEdit ? COPY.submitEditLabel : COPY.submitLabel}
            </Button>
          </Box>
        </Box>
      </Drawer>
  );
};

export default RegisterVehicleDrawer;