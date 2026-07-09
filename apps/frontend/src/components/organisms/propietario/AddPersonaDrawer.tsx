// src/components/organisms/propietario/AddPersonaDrawer.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, Drawer, FormControlLabel, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../../theme/vigia-theme';
import {
  RELACION_OPTIONS,
  tipoFromRelacion,
  PersonaAutorizada,
  ADD_PERSONA_DRAWER_COPY as COPY,
} from '../../../config/propietario-personas.config';

const addPersonaSchema = z.object({
  nombre: z.string().trim().min(3, 'Ingrese el nombre completo'),
  cedula: z.string().regex(/^\d{10}$/, 'La cédula debe tener 10 dígitos'),
  relacion: z.string().min(1, 'Seleccione una relación'),
  telefono: z.string().optional(),
  biometriaPresencial: z.boolean(),
});

type AddPersonaFormValues = z.infer<typeof addPersonaSchema>;

const EMPTY_VALUES: AddPersonaFormValues = { nombre: '', cedula: '', relacion: '', telefono: '', biometriaPresencial: false };

export interface AddPersonaDrawerProps {
  open: boolean;
  onClose: () => void;
  onConfirmed: (persona: Omit<PersonaAutorizada, 'id' | 'estado' | 'autorizadoDesde'>, biometriaPresencial: boolean) => void;
  cuposUsados: number;
}

export const AddPersonaDrawer: React.FC<AddPersonaDrawerProps> = ({ open, onClose, onConfirmed, cuposUsados }) => {
  const [phase, setPhase] = useState<'form' | 'confirm'>('form');

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<AddPersonaFormValues>({
    resolver: zodResolver(addPersonaSchema),
    mode: 'onChange',
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!open) {
      reset(EMPTY_VALUES);
      setPhase('form');
    }
  }, [open, reset]);

  const values = watch();

  const goToConfirm = () => setPhase('confirm');
  const goBackToForm = () => setPhase('form');

  const handleConfirm = () => {
    onConfirmed(
      {
        nombre: values.nombre.trim(),
        cedula: values.cedula,
        relacion: values.relacion,
        tipo: tipoFromRelacion(values.relacion),
        telefono: values.telefono || undefined,
        biometria: 'PENDIENTE',
      },
      values.biometriaPresencial
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      transitionDuration={{ enter: 280, exit: 220 }}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 460 }, borderRadius: { xs: 0, sm: '16px 0 0 16px' }, boxShadow: vigiaShadows.lg } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: 3, borderBottom: '1px solid #F1F5F9' }}>
          <Box>
            <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1.375rem', color: vigiaColors.textHeading }}>
              {phase === 'form' ? COPY.title : COPY.confirmTitle}
            </Typography>
            {phase === 'form' && (
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B', mt: 0.25 }}>
                {COPY.subtitle}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} aria-label="Cerrar" sx={{ color: vigiaColors.textSecondary }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          <AnimatePresence mode="wait">
            {phase === 'form' ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <Box component="form" onSubmit={handleSubmit(goToConfirm)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: vigiaColors.textTertiary }}>
                    {COPY.sectionDatos}
                  </Typography>

                  <Controller
                    name="nombre"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label={COPY.nombreLabel} placeholder={COPY.nombrePlaceholder} error={!!errors.nombre} helperText={errors.nombre?.message} fullWidth required />
                    )}
                  />
                  <Controller
                    name="cedula"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        label={COPY.cedulaLabel}
                        placeholder={COPY.cedulaPlaceholder}
                        error={!!errors.cedula}
                        helperText={errors.cedula?.message || COPY.cedulaHelper}
                        fullWidth
                        required
                      />
                    )}
                  />
                  <Controller
                    name="relacion"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} select label={COPY.relacionLabel} error={!!errors.relacion} helperText={errors.relacion?.message} fullWidth required>
                        {RELACION_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name="telefono"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label={COPY.telefonoLabel} placeholder={COPY.telefonoPlaceholder} fullWidth />
                    )}
                  />

                  <Box sx={{ borderTop: '1px solid #F1F5F9', pt: 2.25, mt: 0.5 }}>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: vigiaColors.textTertiary, mb: 1.5 }}>
                      {COPY.sectionAlcance}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.25, p: 1.75, borderRadius: vigiaRadius.sm, backgroundColor: '#EFF6FF' }}>
                      <ShieldOutlinedIcon sx={{ fontSize: 20, color: vigiaColors.primary, flexShrink: 0, mt: 0.25 }} />
                      <Box>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>
                          {COPY.alcanceTitle}
                        </Typography>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', color: '#64748B', mt: 0.25 }}>
                          {COPY.alcanceHelper}
                        </Typography>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', color: vigiaColors.primary, fontWeight: 600, mt: 0.5 }}>
                          {COPY.cuposLabel(cuposUsados)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ borderTop: '1px solid #F1F5F9', pt: 2.25, mt: 0.5 }}>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: vigiaColors.textTertiary, mb: 1.5 }}>
                      {COPY.sectionBiometria}
                    </Typography>
                    <Controller
                      name="biometriaPresencial"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                          label={<Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textBody }}>{COPY.checkboxLabel}</Typography>}
                        />
                      )}
                    />
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', color: '#64748B', mt: 0.5 }}>
                      {values.biometriaPresencial ? COPY.helperChecked : COPY.helperUnchecked}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ) : (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>{COPY.confirmPersonaLabel}</Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>{values.nombre}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderTop: '1px solid #F1F5F9' }}>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>{COPY.confirmRelacionLabel}</Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>{values.relacion}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderTop: '1px solid #F1F5F9' }}>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>{COPY.confirmAlcanceLabel}</Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A', textAlign: 'right' }}>{COPY.confirmAlcanceValue}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderTop: '1px solid #F1F5F9' }}>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>{COPY.confirmBiometriaLabel}</Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                        {values.biometriaPresencial ? COPY.confirmBiometriaCapturar : COPY.confirmBiometriaPendiente}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B', lineHeight: 1.6 }}>
                    {COPY.confirmText}
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, p: 3, borderTop: '1px solid #F1F5F9' }}>
          {phase === 'form' ? (
            <>
              <Button fullWidth variant="outlined" onClick={onClose} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: '#E2E8F0', color: vigiaColors.textSecondary }}>
                {COPY.cancelLabel}
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit(goToConfirm)}
                disabled={!isValid}
                sx={{ background: !isValid ? 'rgba(13,92,207,0.3)' : vigiaColors.gradientIA, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, minHeight: 48 }}
              >
                {COPY.continueLabel}
              </Button>
            </>
          ) : (
            <>
              <Button fullWidth variant="outlined" onClick={goBackToForm} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: '#E2E8F0', color: vigiaColors.textSecondary }}>
                {COPY.backLabel}
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleConfirm}
                sx={{ background: vigiaColors.gradientIA, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, minHeight: 48 }}
              >
                {COPY.confirmCta}
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddPersonaDrawer;
