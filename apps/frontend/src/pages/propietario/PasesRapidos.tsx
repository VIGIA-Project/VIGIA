// src/pages/propietario/PasesRapidos.tsx
import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Snackbar, Alert, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { PasesGrid } from '../../components/organisms/propietario/PasesGrid';
import { GenerarPaseDrawer } from '../../components/organisms/propietario/GenerarPaseDrawer';
import { RevokePaseModal } from '../../components/organisms/propietario/RevokePaseModal';
import { fadeInUp } from '../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';
import { MOCK_PASES, PaseRapido } from '../../config/propietario-pases.config';

const PasesRapidosPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldReduceMotion = useReducedMotion();

  const [pases, setPases] = useState<PaseRapido[]>(MOCK_PASES);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<PaseRapido | null>(null);
  const [detailTarget, setDetailTarget] = useState<PaseRapido | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleGenerated = (pase: PaseRapido) => {
    setPases((prev) => [pase, ...prev]);
  };

  const handleCopy = (codigo: string) => {
    navigator.clipboard?.writeText(codigo);
    setSnackbarMessage('Código copiado');
    setSnackbarOpen(true);
  };

  const handleRevoke = (id: string, motivoRevocacion: string) => {
    setPases((prev) => prev.map((p) => (p.id === id ? { ...p, estado: 'REVOCADO', motivoRevocacion: motivoRevocacion || undefined } : p)));
    setRevokeTarget(null);
    setSnackbarMessage('Pase revocado');
    setSnackbarOpen(true);
  };

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Pases de acceso rápido">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1.5 }}>
            <Box>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2rem' }, color: '#0F172A' }}>
                Pases de acceso rápido
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '1rem', color: '#64748B', mt: 0.5 }}>
                Genera códigos temporales para acceso puntual sin biometría
              </Typography>
            </Box>
            <Button
              onClick={() => setDrawerOpen(true)}
              fullWidth={isMobile}
              startIcon={<BoltOutlinedIcon />}
              sx={{
                background: vigiaColors.gradientIA,
                color: '#FFFFFF',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: vigiaRadius.md,
                height: 48,
                px: 3,
                flexShrink: 0,
                '&:hover': { background: vigiaColors.gradientIA },
              }}
            >
              Generar pase
            </Button>
          </Box>
        </motion.div>

        <PasesGrid
          pases={pases}
          onCopy={handleCopy}
          onRevoke={(id) => setRevokeTarget(pases.find((p) => p.id === id) || null)}
          onViewDetail={(id) => setDetailTarget(pases.find((p) => p.id === id) || null)}
          onGenerateClick={() => setDrawerOpen(true)}
        />
      </Box>

      <GenerarPaseDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onGenerated={handleGenerated} />
      <RevokePaseModal pase={revokeTarget} onClose={() => setRevokeTarget(null)} onConfirm={handleRevoke} />

      <Dialog open={!!detailTarget} onClose={() => setDetailTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: '"Exo 2", sans-serif', fontWeight: 700, color: '#0F172A' }}>
          Detalle del pase
          <IconButton onClick={() => setDetailTarget(null)} size="small" aria-label="Cerrar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          {detailTarget && (
            <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', p: 2 }}>
              {[
                ['Persona', detailTarget.persona],
                ['Cédula', detailTarget.cedula],
                ['Vehículo', `${detailTarget.vehiculo.marca} ${detailTarget.vehiculo.modelo} · ${detailTarget.vehiculo.placa}`],
                ['Motivo', detailTarget.motivo],
                ...(detailTarget.usadoEn ? [['Usado en', `${detailTarget.usadoEn} · ${detailTarget.puntoAcceso || '—'}`]] : []),
                ...(detailTarget.motivoRevocacion ? [['Motivo de revocación', detailTarget.motivoRevocacion]] : []),
              ].map(([label, value], idx) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75, borderTop: idx === 0 ? 'none' : '1px solid #F1F5F9' }}>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B', flexShrink: 0 }}>{label}</Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A', textAlign: 'right' }}>{value}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3500} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardTemplate>
  );
};

export { PasesRapidosPage };
export default PasesRapidosPage;
