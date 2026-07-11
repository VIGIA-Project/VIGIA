// src/components/organisms/onboarding/VehicleRegistrationForm.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, MenuItem, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fadeInUp } from '../../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../../theme/vigia-theme';
import { VehiclePreviewCard } from '../../molecules';
import {
  VEHICLE_COLOR_OPTIONS,
  VEHICLE_FORM_COPY,
  VEHICLE_SUCCESS_COPY,
  VEHICLE_STORAGE_KEY,
} from '../../../config/onboarding.config';
import { registryService } from '../../../services/registry.service';

const PLACA_REGEX = /^[A-Z]{3}-\d{4}$/;
const ANIO_MIN = 1990;
const ANIO_MAX = 2027;

// Verde de estado "completado" — consistente con OnboardingProgressPanel y BiometricCapture
const SUCCESS_GREEN = '#22C55E';

const vehicleSchema = z.object({
  placa: z.string().regex(PLACA_REGEX, 'Formato inválido. Use ABC-1234'),
  marca: z.string().trim().min(1, 'Ingrese la marca'),
  modelo: z.string().trim().min(1, 'Ingrese el modelo'),
  color: z.string().min(1, 'Seleccione un color'),
  anio: z.coerce
    .number({ message: 'Ingrese un año válido' })
    .min(ANIO_MIN, `Año mínimo ${ANIO_MIN}`)
    .max(ANIO_MAX, `Año máximo ${ANIO_MAX}`),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export interface VehicleRegistrationFormProps {
  personaId: string;
  onComplete: () => void;
  /** Cuántos de los 5 campos son válidos en este momento — para la barra "Tu progreso" */
  onFieldsProgress?: (validCount: number) => void;
}

export const VehicleRegistrationForm: React.FC<VehicleRegistrationFormProps> = ({ personaId, onComplete, onFieldsProgress }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<VehicleFormValues | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    mode: 'onChange',
    defaultValues: { placa: '', marca: '', modelo: '', color: '' },
  });

  const placa = watch('placa') || '';
  const marca = watch('marca') || '';
  const modelo = watch('modelo') || '';
  const color = watch('color') || '';
  const anio = watch('anio');
  const placaValid = PLACA_REGEX.test(placa);
  // watch() no coacciona a número (eso solo ocurre en el resolver al validar) — se compara como string/num
  const anioNum = typeof anio === 'number' ? anio : Number(anio);
  const anioValid = String(anio ?? '').trim().length > 0 && !Number.isNaN(anioNum) && anioNum >= ANIO_MIN && anioNum <= ANIO_MAX;

  const validCount = [
    placaValid,
    marca.trim().length > 0,
    modelo.trim().length > 0,
    color.trim().length > 0,
    anioValid,
  ].filter(Boolean).length;

  useEffect(() => {
    onFieldsProgress?.(validCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validCount]);

  const onSubmit = async (data: VehicleFormValues) => {
    setIsSubmitting(true);
    try {
      if (personaId) {
        await registryService.createVehiculo({
          propietarioPersonaId: personaId,
          placa: data.placa,
          marca: data.marca,
          modelo: data.modelo,
          color: data.color,
          anio: Number(data.anio),
        });
      }
      localStorage.setItem(VEHICLE_STORAGE_KEY, JSON.stringify(data));
      setSubmitted(data);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      alert('Error al registrar el vehículo. Por favor intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 6, md: 8 },
            px: 3,
            borderRadius: vigiaRadius.lg,
            backgroundColor: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14, duration: 0.5 }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: SUCCESS_GREEN,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 8px 24px rgba(34,197,94,0.35)',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 44, color: vigiaColors.white }} />
            </Box>
          </motion.div>
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.4rem', color: vigiaColors.textHeading, mb: 2 }}>
            {VEHICLE_SUCCESS_COPY.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <VehiclePreviewCard
              placa={submitted.placa}
              marca={submitted.marca}
              modelo={submitted.modelo}
              color={submitted.color}
              anio={String(submitted.anio)}
              visible
            />
          </Box>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: vigiaColors.textSecondary, mb: 4, maxWidth: 420, mx: 'auto' }}>
            {VEHICLE_SUCCESS_COPY.description}
          </Typography>
          <Button
            variant="contained"
            onClick={onComplete}
            sx={{
              background: vigiaColors.gradientIA,
              fontFamily: '"Exo 2", sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: vigiaRadius.md,
              minHeight: 48,
              px: 4,
              boxShadow: vigiaShadows.sm,
              transition: 'transform 0.15s ease',
              '&:hover': { transform: 'scale(1.02)' },
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            {VEHICLE_SUCCESS_COPY.cta}
          </Button>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ p: 4, borderRadius: vigiaRadius.lg, backgroundColor: vigiaColors.bgCard, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, mb: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            <Controller
              name="placa"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  label={VEHICLE_FORM_COPY.placaLabel}
                  placeholder={VEHICLE_FORM_COPY.placaPlaceholder}
                  error={!!errors.placa}
                  helperText={errors.placa?.message || VEHICLE_FORM_COPY.placaHelper}
                  fullWidth
                  required
                  sx={{ gridColumn: { xs: '1', sm: '1 / -1' }, '& input': { textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 } }}
                />
              )}
            />
            <Controller
              name="marca"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={VEHICLE_FORM_COPY.marcaLabel}
                  placeholder={VEHICLE_FORM_COPY.marcaPlaceholder}
                  error={!!errors.marca}
                  helperText={errors.marca?.message}
                  fullWidth
                  required
                />
              )}
            />
            <Controller
              name="modelo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={VEHICLE_FORM_COPY.modeloLabel}
                  placeholder={VEHICLE_FORM_COPY.modeloPlaceholder}
                  error={!!errors.modelo}
                  helperText={errors.modelo?.message}
                  fullWidth
                  required
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
                  label={VEHICLE_FORM_COPY.colorLabel}
                  error={!!errors.color}
                  helperText={errors.color?.message}
                  fullWidth
                  required
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
              name="anio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  type="number"
                  label={VEHICLE_FORM_COPY.anioLabel}
                  placeholder={VEHICLE_FORM_COPY.anioPlaceholder}
                  error={!!errors.anio}
                  helperText={errors.anio?.message}
                  fullWidth
                  required
                />
              )}
            />
          </Box>

          <Box sx={{ my: 3, borderTop: '1px solid rgba(10,47,134,0.06)' }} />

          <VehiclePreviewCard placa={placa} marca={marca} modelo={modelo} color={color} anio={anio ? String(anio) : ''} visible={placaValid} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || isSubmitting}
            sx={{
              background: !isValid || isSubmitting ? 'rgba(13,92,207,0.3)' : vigiaColors.gradientIA,
              fontFamily: '"Exo 2", sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: vigiaRadius.md,
              minHeight: 48,
              px: 4,
              width: { xs: '100%', sm: 'auto' },
              boxShadow: vigiaShadows.sm,
              transition: 'transform 0.15s ease',
              '&:hover': { transform: !isValid || isSubmitting ? 'none' : 'scale(1.02)' },
              '&:active': { transform: !isValid || isSubmitting ? 'none' : 'scale(0.98)' },
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={18} sx={{ color: '#FFFFFF', mr: 1.5 }} />
                {VEHICLE_FORM_COPY.submittingLabel}
              </>
            ) : (
              VEHICLE_FORM_COPY.submitLabel
            )}
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default VehicleRegistrationForm;
