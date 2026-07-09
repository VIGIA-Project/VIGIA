// src/components/organisms/propietario/GenerarPaseDrawer.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addHours, differenceInSeconds, parseISO } from 'date-fns';
import { vigiaColors, vigiaRadius } from '../../../theme/vigia-theme';
import { MOTIVO_OPTIONS, MOCK_VEHICULOS_PROPIETARIO } from '../../../config/propietario-permisos.config';
import { DURACION_OPTIONS, generarCodigo, PaseRapido } from '../../../config/propietario-pases.config';

const IA_GRADIENT = 'linear-gradient(135deg, #19D6C4, #0D5CCF)';

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

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    minHeight: 48,
    '&.Mui-focused fieldset': { borderColor: '#19D6C4', borderWidth: '2px' },
  },
};

const formatCountdown = (seconds: number): string => {
  if (seconds <= 0) return 'Expirado';
  const horas = Math.floor(seconds / 3600);
  const minutos = Math.floor((seconds % 3600) / 60);
  return horas > 0 ? `Expira en ${horas}h ${String(minutos).padStart(2, '0')}min` : `Expira en ${minutos} min`;
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
  const [remainingSeconds, setRemainingSeconds] = useState(0);

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

  useEffect(() => {
    if (phase !== 'generated' || !generatedPase) return;
    const expiraEn = addHours(parseISO(generatedPase.generadoEn), generatedPase.duracionHoras);
    const tick = () => setRemainingSeconds(Math.max(0, differenceInSeconds(expiraEn, new Date())));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [phase, generatedPase]);

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

  const handleShare = () => {
    if (!generatedPase) return;
    navigator.share?.({
      title: 'Pase de acceso VIGIA',
      text: `Código de acceso VIGIA: ${generatedPase.codigo} — válido para ${generatedPase.persona}.`,
    });
  };

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      transitionDuration={{ enter: 300, exit: 200 }}
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' } } }}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 480,
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 20px 60px rgba(10,47,134,0.2)',
          border: '1px solid rgba(255,255,255,0.6)',
          overflow: 'hidden',
        },
      }}
    >
      {/* Banda superior con gradiente IA */}
      <Box sx={{ height: 4, background: IA_GRADIENT }} />

      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(25,214,196,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ConfirmationNumberOutlinedIcon sx={{ fontSize: 20, color: '#0D5CCF' }} />
            </Box>
            <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.3rem', color: '#0F172A' }}>
              {phase === 'form' ? 'Generar pase rápido' : '¡Pase generado!'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Cerrar" size="small" sx={{ color: vigiaColors.textSecondary }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <AnimatePresence mode="wait">
          {phase === 'form' ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Box component="form" onSubmit={handleSubmit(handleGenerar)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.25, maxHeight: '60vh', overflowY: 'auto', pr: 0.5 }}>
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', color: vigiaColors.textTertiary }}>
                  ¿Quién accederá?
                </Typography>
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Nombre completo" placeholder="Ej: Pedro Sánchez" error={!!errors.nombre} helperText={errors.nombre?.message} fullWidth required sx={inputSx} />
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
                      sx={inputSx}
                    />
                  )}
                />
                <Controller
                  name="relacion"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Relación" error={!!errors.relacion} helperText={errors.relacion?.message} fullWidth required sx={inputSx}>
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
                    <TextField {...field} select label="Vehículo" error={!!errors.vehiculoId} helperText={errors.vehiculoId?.message} fullWidth required sx={inputSx}>
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
                    <TextField {...field} select label="Duración" fullWidth required sx={inputSx}>
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
                      sx={inputSx}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit(handleGenerar)}
                  disabled={!isValid}
                  sx={{
                    background: !isValid ? 'rgba(13,92,207,0.3)' : IA_GRADIENT,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '12px',
                    height: 50,
                    boxShadow: !isValid ? 'none' : '0 4px 14px rgba(13, 92, 207, 0.3)',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                    '&:hover': { boxShadow: !isValid ? 'none' : '0 8px 22px rgba(13, 92, 207, 0.4)', transform: !isValid ? 'none' : 'translateY(-2px)' },
                  }}
                >
                  Generar pase
                </Button>
                <Button fullWidth variant="text" onClick={onClose} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', color: '#64748B' }}>
                  Cancelar
                </Button>
              </Box>
            </motion.div>
          ) : (
            generatedPase && (
              <motion.div
                key="generated"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.5 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Exo 2", sans-serif',
                      fontWeight: 700,
                      fontSize: { xs: '2.1rem', sm: '2.4rem' },
                      letterSpacing: '4px',
                      color: '#0A2F86',
                    }}
                  >
                    {generatedPase.codigo}
                  </Typography>

                  <Box sx={{ px: 1.5, py: 0.4, borderRadius: vigiaRadius.full, backgroundColor: '#DCFCE7', color: '#166534', fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.75rem' }}>
                    Activo
                  </Box>

                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.95rem', color: remainingSeconds <= 1800 ? '#DC2626' : '#F59E0B' }}>
                    {formatCountdown(remainingSeconds)}
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

                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#DC2626', fontWeight: 500, mt: 0.5 }}>
                    Este código se muestra una sola vez. Guárdalo o compártelo antes de cerrar.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1.25, width: '100%', mt: 1.5 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleCopy}
                      startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                      sx={{ background: IA_GRADIENT, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: '12px', height: 50, boxShadow: '0 4px 14px rgba(13, 92, 207, 0.3)' }}
                    >
                      {copied ? '¡Copiado!' : 'Copiar código'}
                    </Button>
                    {canShare && (
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleShare}
                        startIcon={<IosShareOutlinedIcon sx={{ fontSize: 18 }} />}
                        sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: '12px', height: 50, borderColor: '#E2E8F0', color: vigiaColors.textSecondary }}
                      >
                        Compartir
                      </Button>
                    )}
                  </Box>
                  <Button fullWidth variant="text" onClick={onClose} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', color: '#64748B' }}>
                    Cerrar
                  </Button>
                </Box>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </Box>
    </Dialog>
  );
};

export default GenerarPaseDrawer;
