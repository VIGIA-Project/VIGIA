// src/components/organisms/propietario/CreatePermisoDrawer.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../../theme/vigia-theme';
import { MOTIVO_OPTIONS, MOCK_VEHICULOS_PROPIETARIO, PermisoTemporal } from '../../../config/propietario-permisos.config';

const today = () => format(new Date(), 'yyyy-MM-dd');
const addDays = (dateStr: string, days: number) => {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return format(d, 'yyyy-MM-dd');
};

const createPermisoSchema = z
  .object({
    nombre: z.string().trim().min(3, 'Ingrese el nombre completo'),
    cedula: z.string().regex(/^\d{10}$/, 'La cédula debe tener 10 dígitos'),
    relacion: z.string().min(1, 'Seleccione una relación'),
    telefono: z.string().optional(),
    vehiculoId: z.string().min(1, 'Seleccione un vehículo'),
    fechaInicio: z.string().min(1, 'Seleccione la fecha de inicio'),
    fechaFin: z.string().min(1, 'Seleccione la fecha de fin'),
    motivo: z.string().trim().min(10, 'Describa el motivo (mínimo 10 caracteres)').max(200, 'Máximo 200 caracteres'),
  })
  .refine((data) => data.fechaFin > data.fechaInicio, { message: 'La fecha fin debe ser posterior al inicio', path: ['fechaFin'] })
  .refine((data) => data.fechaFin <= addDays(data.fechaInicio, 30), { message: 'La vigencia máxima es de 30 días', path: ['fechaFin'] });

type CreatePermisoFormValues = z.infer<typeof createPermisoSchema>;

const vehiculosActivos = MOCK_VEHICULOS_PROPIETARIO.filter((v) => v.estado === 'ACTIVO');

const EMPTY_VALUES: CreatePermisoFormValues = {
  nombre: '',
  cedula: '',
  relacion: '',
  telefono: '',
  vehiculoId: vehiculosActivos.length === 1 ? vehiculosActivos[0].id : '',
  fechaInicio: today(),
  fechaFin: addDays(today(), 30),
  motivo: '',
};

export interface CreatePermisoDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreated: (permiso: PermisoTemporal) => void;
}

export const CreatePermisoDrawer: React.FC<CreatePermisoDrawerProps> = ({ open, onClose, onCreated }) => {
  const [phase, setPhase] = useState<'form' | 'confirm'>('form');

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreatePermisoFormValues>({
    resolver: zodResolver(createPermisoSchema),
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
  const vehiculoSeleccionado = vehiculosActivos.find((v) => v.id === values.vehiculoId);

  const goToConfirm = () => setPhase('confirm');
  const goBackToForm = () => setPhase('form');

  const handleConfirm = () => {
    if (!vehiculoSeleccionado) return;
    onCreated({
      id: `pt-${Date.now()}`,
      persona: values.nombre.trim(),
      cedula: values.cedula,
      relacion: values.relacion,
      telefono: values.telefono || undefined,
      vehiculo: { marca: vehiculoSeleccionado.marca, modelo: vehiculoSeleccionado.modelo, placa: vehiculoSeleccionado.placa },
      fechaInicio: values.fechaInicio,
      fechaFin: values.fechaFin,
      estado: 'ACTIVO',
      motivo: values.motivo.trim(),
    });
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
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.375rem', color: '#0F172A' }}>
            {phase === 'form' ? 'Nuevo permiso temporal' : 'Confirmar permiso'}
          </Typography>
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
                    Persona
                  </Typography>
                  <Controller
                    name="nombre"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Nombre completo" placeholder="Ej: Roberto Gómez" error={!!errors.nombre} helperText={errors.nombre?.message} fullWidth required />
                    )}
                  />
                  <Controller
                    name="cedula"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        label="Cédula"
                        placeholder="Ej: 1712345678"
                        error={!!errors.cedula}
                        helperText={errors.cedula?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                  <Controller
                    name="relacion"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} select label="Relación" error={!!errors.relacion} helperText={errors.relacion?.message} fullWidth required>
                        {MOTIVO_OPTIONS.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name="telefono"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Teléfono" placeholder="Ej: 0991234567" fullWidth />
                    )}
                  />

                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: vigiaColors.textTertiary, mt: 1 }}>
                    Vehículo
                  </Typography>
                  <Controller
                    name="vehiculoId"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} select label="Vehículo" error={!!errors.vehiculoId} helperText={errors.vehiculoId?.message} fullWidth required>
                        {vehiculosActivos.map((v) => (
                          <MenuItem key={v.id} value={v.id}>{v.marca} {v.modelo} · {v.placa}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: vigiaColors.textTertiary, mt: 1 }}>
                    Vigencia
                  </Typography>
                  <Controller
                    name="fechaInicio"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue('fechaFin', addDays(e.target.value, 30), { shouldValidate: true });
                        }}
                        type="date"
                        label="Fecha inicio"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: today() }}
                        error={!!errors.fechaInicio}
                        helperText={errors.fechaInicio?.message}
                        fullWidth
                        required
                      />
                    )}
                  />
                  <Controller
                    name="fechaFin"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="date"
                        label="Fecha fin"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: addDays(values.fechaInicio || today(), 1), max: addDays(values.fechaInicio || today(), 30) }}
                        error={!!errors.fechaFin}
                        helperText={errors.fechaFin?.message || 'Vigencia máxima: 30 días desde el inicio'}
                        fullWidth
                        required
                      />
                    )}
                  />

                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: vigiaColors.textTertiary, mt: 1 }}>
                    Motivo
                  </Typography>
                  <Controller
                    name="motivo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Motivo del permiso"
                        placeholder="Describe brevemente el motivo del permiso"
                        multiline
                        minRows={3}
                        error={!!errors.motivo}
                        helperText={errors.motivo?.message || `${field.value.length}/200`}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Box>
              </motion.div>
            ) : (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Persona</Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>{values.nombre}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderTop: '1px solid #F1F5F9' }}>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Vehículo</Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                        {vehiculoSeleccionado ? `${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} · ${vehiculoSeleccionado.placa}` : '—'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderTop: '1px solid #F1F5F9' }}>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Vigencia</Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A', textAlign: 'right' }}>
                        {values.fechaInicio} → {values.fechaFin}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderTop: '1px solid #F1F5F9' }}>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Motivo</Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A', textAlign: 'right', maxWidth: '65%' }}>{values.motivo}</Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, p: 3, borderTop: '1px solid #F1F5F9' }}>
          {phase === 'form' ? (
            <>
              <Button fullWidth variant="outlined" onClick={onClose} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: '#E2E8F0', color: vigiaColors.textSecondary }}>
                Cancelar
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit(goToConfirm)}
                disabled={!isValid}
                sx={{ background: !isValid ? 'rgba(13,92,207,0.3)' : vigiaColors.gradientIA, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, minHeight: 48 }}
              >
                Continuar
              </Button>
            </>
          ) : (
            <>
              <Button fullWidth variant="outlined" onClick={goBackToForm} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: '#E2E8F0', color: vigiaColors.textSecondary }}>
                Volver
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleConfirm}
                sx={{ background: vigiaColors.gradientIA, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, minHeight: 48 }}
              >
                Confirmar permiso
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CreatePermisoDrawer;
