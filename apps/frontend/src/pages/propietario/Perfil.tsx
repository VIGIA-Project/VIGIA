// src/pages/propietario/Perfil.tsx
import React, { useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { useAuth } from '../../context';
import { fadeInUp } from '../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows, vigiaSpacing } from '../../theme/vigia-theme';
import { buildInitialVehiculos } from '../../config/propietario-vehiculos.config';
import { loadPersonas } from '../../config/propietario-personas.config';
import { MOCK_PERMISOS } from '../../config/propietario-permisos.config';
import { MOCK_PASES } from '../../config/propietario-pases.config';

const REGISTRO_MOCK = '15 May 2026';
const ULTIMO_CAMBIO_PASSWORD_MOCK = 'hace 3 meses';

const PerfilPage: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { user, logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const displayName = user?.email?.split('@')[0] || 'Propietario';
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : 'PR';

  const resumen = useMemo(
    () => ({
      vehiculos: buildInitialVehiculos().length,
      personas: loadPersonas().filter((p) => p.estado === 'ACTIVA').length,
      permisos: MOCK_PERMISOS.filter((p) => p.estado === 'ACTIVO').length,
      pases: MOCK_PASES.length,
    }),
    []
  );

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    navigate('/login');
  };

  const infoRows = [
    { label: 'Nombre completo', value: capitalizedName },
    { label: 'Email institucional', value: user?.email || '—' },
    { label: 'Rol', value: 'Propietario' },
    { label: 'Fecha de registro', value: REGISTRO_MOCK },
    { label: 'Estado biométrico', value: user?.biometric_registered ? 'Completado' : 'Pendiente' },
  ];

  const resumenCards = [
    { icon: <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 22, color: vigiaColors.primary }} />, value: resumen.vehiculos, label: 'Vehículos registrados' },
    { icon: <GroupOutlinedIcon sx={{ fontSize: 22, color: vigiaColors.greenIA }} />, value: resumen.personas, label: 'Personas autorizadas' },
    { icon: <AccessTimeOutlinedIcon sx={{ fontSize: 22, color: '#F59E0B' }} />, value: resumen.permisos, label: 'Permisos activos' },
    { icon: <BoltOutlinedIcon sx={{ fontSize: 22, color: vigiaColors.gold }} />, value: resumen.pases, label: 'Pases esta semana' },
  ];

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Mi Perfil">
      <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '320px 1fr' }, gap: `${vigiaSpacing.section}px` }}>
          {/* Columna izquierda */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 3, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: vigiaColors.gradientIA,
                  color: vigiaColors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1.5,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  fontSize: '1.3rem',
                }}
              >
                {initials}
              </Box>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>
                {capitalizedName}
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B', mb: 1.25 }}>
                {user?.email}
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.4,
                  borderRadius: vigiaRadius.full,
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                }}
              >
                <VerifiedUserOutlinedIcon sx={{ fontSize: 14 }} />
                PROPIETARIO
              </Box>

              <Box
                sx={{
                  mt: 2.5,
                  p: 2,
                  borderRadius: vigiaRadius.md,
                  border: '1px dashed #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  textAlign: 'left',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <PhotoCameraOutlinedIcon sx={{ fontSize: 18, color: '#64748B', mt: 0.25 }} />
                  <Box>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#64748B' }}>
                      Próximamente: personaliza tu avatar
                    </Typography>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#94A3B8', mt: 0.25 }}>
                      Estamos trabajando para que puedas subir tu foto de perfil.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Columna derecha */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Mi información */}
            <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 3 }}>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', mb: 2 }}>
                Mi información
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                {infoRows.map((row) => (
                  <Box key={row.label}>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#94A3B8' }}>{row.label}</Typography>
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>{row.value}</Typography>
                  </Box>
                ))}
                <Box>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#94A3B8' }}>Dominio</Typography>
                  <Box sx={{ display: 'inline-flex', mt: 0.25, px: 1.1, py: 0.3, borderRadius: vigiaRadius.full, backgroundColor: '#EFF6FF', color: '#0D5CCF', fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', fontWeight: 700 }}>
                    @uce.edu.ec
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Resumen de mi cuenta */}
            <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 3 }}>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', mb: 2 }}>
                Resumen de mi cuenta
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {resumenCards.map((card) => (
                  <Box key={card.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.5, borderRadius: vigiaRadius.md, backgroundColor: '#F8FAFC' }}>
                    {card.icon}
                    <Box>
                      <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#0F172A' }}>{card.value}</Typography>
                      <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', color: '#64748B' }}>{card.label}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Seguridad */}
            <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 3 }}>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', mb: 2 }}>
                Seguridad
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 1.5, mb: 2 }}>
                <Box>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#94A3B8' }}>Último cambio de contraseña</Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>{ULTIMO_CAMBIO_PASSWORD_MOCK}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#94A3B8' }}>Estado de sesión</Typography>
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#16A34A' }}>Activa</Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<LockResetOutlinedIcon />}
                onClick={() => navigate('/cambiar-password')}
                sx={{ minHeight: 44, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: vigiaColors.primary, color: vigiaColors.primary }}
              >
                Cambiar contraseña
              </Button>
            </Box>

            {/* Cerrar sesión */}
            <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, p: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<LogoutOutlinedIcon />}
                onClick={() => setLogoutModalOpen(true)}
                sx={{ minHeight: 44, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: '#DC2626', color: '#DC2626', '&:hover': { borderColor: '#B91C1C', backgroundColor: 'rgba(220,38,38,0.06)' } }}
              >
                Cerrar sesión
              </Button>
            </Box>
          </Box>
        </Box>
      </motion.div>

      <Dialog open={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: vigiaRadius.lg } }}>
        <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, color: '#0F172A' }}>
          ¿Seguro que deseas cerrar sesión?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: '#64748B' }}>
            Volverás al inicio de sesión.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setLogoutModalOpen(false)}
            sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: '#E2E8F0', color: vigiaColors.textSecondary }}
          >
            Cancelar
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirmLogout}
            sx={{ backgroundColor: '#DC2626', color: '#FFFFFF', fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, minHeight: 44, '&:hover': { backgroundColor: '#B91C1C' } }}
          >
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardTemplate>
  );
};

export { PerfilPage };
export default PerfilPage;
