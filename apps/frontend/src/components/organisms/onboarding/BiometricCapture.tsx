// src/components/organisms/onboarding/BiometricCapture.tsx
import React, { useState } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { staggerContainer, staggerItem, fadeInUp } from '../../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../../theme/vigia-theme';
import { CaptureStepCard, CaptureStepState, QualityBar, CameraStatusPills } from '../../molecules';
import {
  CAPTURE_STEPS,
  CAMERA_STATUS_PILLS,
  QUALITY_MOCK,
  PRIVACY_NOTE,
  NO_CAMERA_MODAL,
  SUCCESS_COPY,
  getOnboardingIcon,
} from '../../../config/onboarding.config';

const TOTAL_CAPTURES = CAPTURE_STEPS.length;
const PROCESSING_DELAY_MS = 1500;

export interface BiometricCaptureProps {
  onAllCaptured: () => void;
  onSkipForNow: () => void;
  /** Callback para informar al padre cuántas capturas se completaron (para la barra de progreso) */
  onCaptureProgress?: (done: number, total: number) => void;
}

export const BiometricCapture: React.FC<BiometricCaptureProps> = ({ onAllCaptured, onSkipForNow, onCaptureProgress }) => {
  const shouldReduceMotion = useReducedMotion();
  const [captureIndex, setCaptureIndex] = useState(0);
  const [statuses, setStatuses] = useState<CaptureStepState[]>(['active', 'pending', 'pending']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const currentStep = CAPTURE_STEPS[Math.min(captureIndex, TOTAL_CAPTURES - 1)];

  const handleCapture = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const isLast = captureIndex === TOTAL_CAPTURES - 1;
      const newDone = captureIndex + 1;

      setStatuses((prev) =>
        prev.map((status, i) => {
          if (i === captureIndex) return 'completed';
          if (i === captureIndex + 1) return 'active';
          return status;
        })
      );
      setIsProcessing(false);
      onCaptureProgress?.(newDone, TOTAL_CAPTURES);

      if (isLast) {
        setAllDone(true);
      } else {
        setCaptureIndex((i) => i + 1);
      }
    }, PROCESSING_DELAY_MS);
  };

  if (allDone) {
    return (
      <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 6, md: 8 },
            px: 3,
            borderRadius: vigiaRadius.lg,
            border: '1px solid #E2E8F0',
          }}
        >
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                // Verde esmeralda premium — no genérico
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 8px 24px rgba(5,150,105,0.35)',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 44, color: '#FFFFFF' }} />
            </Box>
          </motion.div>
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.4rem', color: vigiaColors.textHeading, mb: 1 }}>
            {SUCCESS_COPY.title}
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: vigiaColors.textSecondary, mb: 4 }}>
            {SUCCESS_COPY.subtitle}
          </Typography>
          <Button
            variant="contained"
            onClick={onAllCaptured}
            sx={{
              // Gradiente verde → azul: transmite "éxito y continuidad"
              background: 'linear-gradient(90deg, #059669 0%, #0D5CCF 100%)',
              fontFamily: '"Exo 2", sans-serif',
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              borderRadius: vigiaRadius.md,
              minHeight: 52,
              px: 5,
              letterSpacing: '0.3px',
              boxShadow: '0 4px 16px rgba(5,150,105,0.3)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(5,150,105,0.4)',
              },
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            ✓  Continuar con el Registro del Vehículo
          </Button>
        </Box>
      </motion.div>
    );
  }

  return (
    <Box>
      {/* 3 cards de captura */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 3,
          }}
        >
          {CAPTURE_STEPS.map((step, i) => (
            <motion.div key={step.key} variants={staggerItem}>
              <CaptureStepCard badge={step.badge} title={step.title} subtitle={step.subtitle} state={statuses[i]} />
            </motion.div>
          ))}
        </Box>
      </motion.div>

      {/* Área de cámara mock */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.key}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <Box
            sx={{
              position: 'relative',
              borderRadius: vigiaRadius.xl,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #0A2F86 0%, #0D5CCF 45%, #11A9D6 100%)',
              minHeight: { xs: 260, md: 320 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
            }}
          >
            {/* Óvalo guía facial */}
            <Box
              sx={{
                width: { xs: 140, md: 170 },
                height: { xs: 180, md: 220 },
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <PersonOutlineOutlinedIcon sx={{ fontSize: 72, color: 'rgba(255,255,255,0.55)' }} />
            </Box>

            {/* Esquinas de encuadre */}
            {[
              { top: 16, left: 16, borderWidth: '3px 0 0 3px' },
              { top: 16, right: 16, borderWidth: '3px 3px 0 0' },
              { bottom: 16, left: 16, borderWidth: '0 0 3px 3px' },
              { bottom: 16, right: 16, borderWidth: '0 3px 3px 0' },
            ].map((corner, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: 28,
                  height: 28,
                  borderColor: 'rgba(255,255,255,0.7)',
                  borderStyle: 'solid',
                  ...corner,
                }}
              />
            ))}

            {/* Pills de estado */}
            <Box sx={{ position: 'absolute', bottom: 16, left: 0, right: 0, px: 2 }}>
              <CameraStatusPills pills={CAMERA_STATUS_PILLS} />
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Barra de calidad */}
      <Box sx={{ mt: 2, mb: 3 }}>
        <QualityBar value={QUALITY_MOCK.value} label={QUALITY_MOCK.label} />
      </Box>

      {/* Panel de instrucciones */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`instructions-${currentStep.key}`}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Box
            sx={{
              borderLeft: `3px solid ${vigiaColors.greenIA}`,
              borderImage: `${vigiaColors.gradientIA} 1`,
              pl: 2,
              py: 1,
              mb: 3,
            }}
          >
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '0.9rem', color: vigiaColors.textHeading, mb: 1 }}>
              {currentStep.instructionsTitle}
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
              {currentStep.instructions.map((instruction) => (
                <Typography
                  key={instruction}
                  component="li"
                  sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: vigiaColors.textSecondary, lineHeight: 1.7 }}
                >
                  {instruction}
                </Typography>
              ))}
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Nota de privacidad */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 3 }}>
        <Box sx={{ color: vigiaColors.textTertiary, display: 'flex', mt: 0.2 }}>{getOnboardingIcon('shield', { fontSize: 16 })}</Box>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: vigiaColors.textTertiary, lineHeight: 1.6 }}>
          {PRIVACY_NOTE}
        </Typography>
      </Box>

      {/* Footer de acciones */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          position: { xs: 'sticky', sm: 'static' },
          bottom: 0,
          backgroundColor: { xs: vigiaColors.bgCard, sm: 'transparent' },
          py: { xs: 2, sm: 0 },
        }}
      >
        <Box
          component="button"
          onClick={() => setModalOpen(true)}
          sx={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.8rem',
            color: vigiaColors.textSecondary,
            '&:hover': { textDecoration: 'underline', color: vigiaColors.textBody },
          }}
        >
          No tengo cámara disponible ahora
        </Box>

        <Button
          variant="contained"
          onClick={handleCapture}
          disabled={isProcessing}
          startIcon={isProcessing ? undefined : <CameraAltOutlinedIcon />}
          sx={{
            background: isProcessing ? 'rgba(13, 92, 207, 0.5)' : vigiaColors.gradientIA,
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            borderRadius: vigiaRadius.md,
            minHeight: 48,
            px: 3,
            width: { xs: '100%', sm: 'auto' },
            boxShadow: vigiaShadows.sm,
            transition: 'transform 0.15s ease',
            '&:hover': { transform: isProcessing ? 'none' : 'scale(1.02)' },
            '&:active': { transform: isProcessing ? 'none' : 'scale(0.98)' },
          }}
        >
          {isProcessing ? (
            <>
              <CircularProgress size={18} sx={{ color: '#FFFFFF', mr: 1.5 }} />
              Procesando...
            </>
          ) : (
            currentStep.ctaLabel
          )}
        </Button>
      </Box>

      {/* Modal: sin cámara disponible */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600 }}>{NO_CAMERA_MODAL.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textBody, lineHeight: 1.6 }}>
            {NO_CAMERA_MODAL.body}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            fullWidth
            variant="text"
            onClick={onSkipForNow}
            sx={{ fontFamily: '"Inter", sans-serif', textTransform: 'none', color: vigiaColors.textSecondary }}
          >
            {NO_CAMERA_MODAL.confirmLater}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => setModalOpen(false)}
            sx={{
              background: vigiaColors.gradientIA,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: vigiaRadius.sm,
            }}
          >
            {NO_CAMERA_MODAL.cancel}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BiometricCapture;
