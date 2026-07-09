// src/components/organisms/propietario/GenerarPaseDrawer.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Drawer, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../../theme/vigia-theme';
import { MOTIVO_OPTIONS, MOCK_VEHICULOS_PROPIETARIO } from '../../../config/propietario-permisos.config';
import { DURACION_OPTIONS, generarCodigo, PaseRapido } from '../../../config/propietario-pases.config';

const generarPaseSchema = z.object({
  nombre: z.string().trim().min(3, 'Ingrese el nombre completo'),
  cedula: z.string().regex(/^\d{10}$/, 'La cédula debe tener 10 dígitos'),
  relacion: z.string().min(1, 'Seleccione una relación'),
  vehiculoId: z.string().min(1, 'Seleccione un vehículo'),
  duracionHoras: z.number().min(1),
  motivo: z.string().trim().min(5, 'Describa el motivo (mínimo 5 caracteres)').max(150, 'Máximo 150 caracteres'),
});

type GenerarPaseFormValues = z.infer<typeof generarPaseSchema>;

const vehiculosActivos = MOCK_VEHICULOS_PROPIETARIO.filter((v) => v.estado === 'ACTIVO');

const EMPTY_VALUES: GenerarPaseFormValues = {
  nombre: '',
  cedula: '',
  relacion: '',
  vehiculoId: vehiculosActivos.length === 1 ? vehiculosActivos[0].id : '',
  duracionHoras: 1,
  motivo: '',
};

export interface GenerarPaseDrawerProps {
  open: boolean;
  onClose: () => void;
  onGenerated: (pase: PaseRapido) => void;
}

export const GenerarPaseDrawer: React.FC<GenerarPaseDrawerProps> = ({ open, onClose, onGenerated }) => {
  const [phase, setPhase] = useState<'form' | 'generated'>('form');
  const [generatedPase, setGeneratedPase] = useState<PaseRapido | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<GenerarPaseFormValues>({
    resolver: zodResolver(generarPaseSchema),
    mode: 'onChange',
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (!open) {
      reset(EMPTY_VALUES);
      setPhase('form');
      setGeneratedPase(null);
      setCopied(false);
    }
  }, [open, reset]);

  const values = watch();
  const vehiculoSeleccionado = vehiculosActivos.find((v) => v.id === values.vehiculoId);

  const handleGenerar = () => {
    if (!vehiculoSeleccionado) return;
    const nuevo: PaseRapido = {
      id: `pr-${Date.now()}`,
      codigo: generarCodigo(),
      persona: values.nombre.trim(),
      cedula: values.cedula,
      relacion: values.relacion,
      vehiculo: { marca: vehiculoSeleccionado.marca, modelo: vehiculoSeleccionado.modelo, placa: vehiculoSeleccionado.placa },
      generadoEn: new Date().toISOString(),
      duracionHoras: values.duracionHoras,
      estado: 'ACTIVO',
      motivo: values.motivo.trim(),
    };
    setGeneratedPase(nuevo);
    setPhase('generated');
    onGenerated(nuevo);
  };

  const handleCopy = () => {
    if (!generatedPase) return;
    navigator.clipboard?.writeText(generatedPase.codigo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            {phase === 'form' ? 'Generar pase rápido' : '¡Pase generado!'}
          </Typography>
          <IconButton onClick={onClose} aria-label="Cerrar" sx={{ color: vigiaColors.textSecondary }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          <AnimatePresence mode="wait">
            {phase === 'form' ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <Box component="form" onSubmit={handleSubmit(handleGenerar)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: vigiaColors.textTertiary }}>
                    ¿Quién accederá?
                  </Typography>
                  <Controller
                    name="nombre"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Nombre completo" placeholder="Ej: Pedro Sánchez" error={!!errors.nombre} helperText={errors.nombre?.message} fullWidth required />
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
                    name="duracionHoras"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} select label="Duración" fullWidth required>
                        {DURACION_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', color: '#64748B' }}>
                    El pase se activa inmediatamente al generarse. No es posible programarlo para después.
                  </Typography>

                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: vigiaColors.textTertiary, mt: 1 }}>
                    Motivo
                  </Typography>
                  <Controller
                    name="motivo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Motivo"
                        placeholder="¿Por qué necesita este acceso?"
                        multiline
                        minRows={3}
                        error={!!errors.motivo}
                        helperText={errors.motivo?.message || `${field.value.length}/150`}
                        fullWidth
                        required
                      />
                    )}
                  />
                </Box>
              </motion.div>
            ) : (
              generatedPase && (
                <motion.div key="generated" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                      <Box sx={{ px: 3, py: 2, borderRadius: vigiaRadius.lg, backgroundColor: '#EFF6FF' }}>
                        <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '2rem', letterSpacing: '3px', color: '#0D5CCF' }}>
                          {generatedPase.codigo}
                        </Typography>
                      </Box>
                    </motion.div>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#F59E0B', mt: 1 }}>
                      Válido por {generatedPase.duracionHoras}h 00min
                    </Typography>
                    <Box sx={{ mt: 1, width: '100%', borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', p: 2, textAlign: 'left' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Persona</Typography>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>{generatedPase.persona}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderTop: '1px solid #F1F5F9' }}>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Vehículo</Typography>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                          {generatedPase.vehiculo.marca} {generatedPase.vehiculo.modelo} · {generatedPase.vehiculo.placa}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderTop: '1px solid #F1F5F9' }}>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Uso</Typography>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>Único</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#DC2626', fontWeight: 500, mt: 1.5 }}>
                      Este código se muestra una sola vez. Guárdalo o compártelo antes de cerrar.
                    </Typography>
                  </Box>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: phase === 'form' ? 'row' : 'column', gap: 1.5, p: 3, borderTop: '1px solid #F1F5F9' }}>
          {phase === 'form' ? (
            <>
              <Button fullWidth variant="outlined" onClick={onClose} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: '#E2E8F0', color: vigiaColors.textSecondary }}>
                Cancelar
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit(handleGenerar)}
                disabled={!isValid}
                sx={{ background: !isValid ? 'rgba(13,92,207,0.3)' : vigiaColors.gradientIA, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, minHeight: 48 }}
              >
                Generar pase
              </Button>
            </>
          ) : (
            <>
              <Button
                fullWidth
                variant="contained"
                onClick={handleCopy}
                startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                sx={{ background: vigiaColors.gradientIA, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, minHeight: 48 }}
              >
                {copied ? '¡Código copiado!' : 'Copiar código'}
              </Button>
              <Button fullWidth variant="outlined" onClick={onClose} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: '#E2E8F0', color: vigiaColors.textSecondary }}>
                Cerrar
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default GenerarPaseDrawer;
