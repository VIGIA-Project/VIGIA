// src/pages/propietario/PermisosTemporales.tsx
import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Snackbar, Alert, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { PermisosGrid } from '../../components/organisms/propietario/PermisosGrid';
import { CreatePermisoDrawer } from '../../components/organisms/propietario/CreatePermisoDrawer';
import { RevokePermisoModal } from '../../components/organisms/propietario/RevokePermisoModal';
import { fadeInUp } from '../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';
import { MOCK_PERMISOS, PermisoTemporal } from '../../config/propietario-permisos.config';

const PermisosTemporalesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldReduceMotion = useReducedMotion();

  const [permisos, setPermisos] = useState<PermisoTemporal[]>(MOCK_PERMISOS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<PermisoTemporal | null>(null);
  const [detailTarget, setDetailTarget] = useState<PermisoTemporal | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleCreated = (permiso: PermisoTemporal) => {
    setPermisos((prev) => [permiso, ...prev]);
    setDrawerOpen(false);
    setSnackbarMessage('Permiso temporal creado correctamente');
    setSnackbarOpen(true);
  };

  const handleRevoke = (id: string, motivoRevocacion: string) => {
    setPermisos((prev) => prev.map((p) => (p.id === id ? { ...p, estado: 'REVOCADO', motivoRevocacion: motivoRevocacion || undefined } : p)));
    setRevokeTarget(null);
    setSnackbarMessage('Permiso revocado');
    setSnackbarOpen(true);
  };

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Permisos temporales">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1.5 }}>
            <Box>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2rem' }, color: '#0F172A' }}>
                Permisos temporales
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '1rem', color: '#64748B', mt: 0.5 }}>
                Autoriza acceso temporal a personas externas a tu grupo familiar
              </Typography>
            </Box>
            <Button
              onClick={() => setDrawerOpen(true)}
              fullWidth={isMobile}
              startIcon={<CalendarMonthOutlinedIcon />}
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
              Crear permiso
            </Button>
          </Box>
        </motion.div>

        <PermisosGrid
          permisos={permisos}
          onViewDetail={(id) => setDetailTarget(permisos.find((p) => p.id === id) || null)}
          onRevoke={(id) => setRevokeTarget(permisos.find((p) => p.id === id) || null)}
          onCreateClick={() => setDrawerOpen(true)}
        />
      </Box>

      <CreatePermisoDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onCreated={handleCreated} />
      <RevokePermisoModal permiso={revokeTarget} onClose={() => setRevokeTarget(null)} onConfirm={handleRevoke} />

      <Dialog open={!!detailTarget} onClose={() => setDetailTarget(null)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: '"Exo 2", sans-serif', fontWeight: 700, color: '#0F172A' }}>
          Detalle del permiso
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
                ['Relación', detailTarget.relacion],
                ['Vehículo', `${detailTarget.vehiculo.marca} ${detailTarget.vehiculo.modelo} · ${detailTarget.vehiculo.placa}`],
                ['Vigencia', `${detailTarget.fechaInicio} → ${detailTarget.fechaFin}`],
                ['Motivo', detailTarget.motivo],
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

export { PermisosTemporalesPage };
export default PermisosTemporalesPage;
