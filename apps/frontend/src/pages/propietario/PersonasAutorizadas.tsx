import React, { useMemo, useState } from 'react';
import { Alert, Box, Button, Snackbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { PersonasGrid, AddPersonaDrawer, RevokePersonaModal } from '../../components/organisms/propietario';
import { fadeInUp } from '../../config/animations.config';
import { vigiaShadows, vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';
import { buildInitialVehiculos } from '../../config/propietario-vehiculos.config';
import {
  PersonaAutorizada,
  MOCK_PERSONAS,
  FAMILIA_MAX_MIEMBROS,
  PERSONAS_HEADER_COPY,
  ADD_PERSONA_DRAWER_COPY,
  REVOKE_PERSONA_MODAL_COPY,
} from '../../config/propietario-personas.config';

const PersonasAutorizadasPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const tieneVehiculos = useMemo(() => buildInitialVehiculos().length > 0, []);

  const [personas, setPersonas] = useState<PersonaAutorizada[]>(MOCK_PERSONAS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<PersonaAutorizada | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activas = personas.filter((p) => p.estado === 'ACTIVA').length;
  const limitReached = activas >= FAMILIA_MAX_MIEMBROS;

  const handleConfirmed = (nueva: Omit<PersonaAutorizada, 'id' | 'estado' | 'autorizadoDesde'>) => {
    const persona: PersonaAutorizada = {
      ...nueva,
      id: `per-${Date.now()}`,
      estado: 'ACTIVA',
      autorizadoDesde: new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setPersonas((prev) => [persona, ...prev]);
    setDrawerOpen(false);
    setToastMessage(ADD_PERSONA_DRAWER_COPY.successToast);
  };

  const handleRevoke = (id: string, _motivo: string) => {
    setPersonas((prev) => prev.map((p) => (p.id === id ? { ...p, estado: 'REVOCADA' } : p)));
    setRevokeTarget(null);
    setToastMessage(REVOKE_PERSONA_MODAL_COPY.successToast);
  };

  if (!tieneVehiculos) {
    return (
      <DashboardTemplate rol="OWNER" pageTitle="Personas autorizadas">
        <Box sx={{ textAlign: 'center', py: 8, px: 3, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0' }}>
          <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 48, color: vigiaColors.primary, mb: 2 }} />
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#0F172A', mb: 1 }}>
            {PERSONAS_HEADER_COPY.requiresVehicleTitle}
          </Typography>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.9rem', color: vigiaColors.textSecondary, mb: 3 }}>
            {PERSONAS_HEADER_COPY.requiresVehicleDescription}
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/propietario/vehiculos')}
            sx={{ background: vigiaColors.gradientIA, fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, px: 3, minHeight: 44 }}
          >
            {PERSONAS_HEADER_COPY.requiresVehicleCta}
          </Button>
        </Box>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Personas autorizadas">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>
        {/* Header de sección */}
        <motion.div variants={shouldReduceMotion ? undefined : fadeInUp} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1.5 }}>
            <Box>
              <Box component="h1" sx={{ m: 0, fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: { xs: '1.5rem', md: '1.75rem' }, color: '#0F172A' }}>
                {PERSONAS_HEADER_COPY.title}
              </Box>
              <Box sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B', mt: 0.5 }}>
                {PERSONAS_HEADER_COPY.subtitle(activas)}
              </Box>
            </Box>
            <Box>
              <Button
                variant="contained"
                startIcon={<PersonAddAlt1Icon />}
                onClick={() => setDrawerOpen(true)}
                disabled={limitReached}
                fullWidth={isMobile}
                sx={{
                  background: limitReached ? 'rgba(13,92,207,0.3)' : vigiaColors.gradientIA,
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  borderRadius: vigiaRadius.sm,
                  px: 3,
                  minHeight: 48,
                  boxShadow: limitReached ? 'none' : vigiaShadows.sm,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { boxShadow: limitReached ? 'none' : vigiaShadows.md, transform: shouldReduceMotion || limitReached ? 'none' : 'translateY(-1px)' },
                }}
              >
                {PERSONAS_HEADER_COPY.addCta}
              </Button>
              {limitReached && (
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', color: vigiaColors.textTertiary, mt: 0.5, maxWidth: 220, textAlign: { xs: 'left', sm: 'right' } }}>
                  {PERSONAS_HEADER_COPY.limitHelper}
                </Typography>
              )}
            </Box>
          </Box>
        </motion.div>

        <PersonasGrid
          personas={personas}
          onAdd={() => setDrawerOpen(true)}
          onViewDetail={(id) => console.log('Ver detalle de persona', id)}
          onRegisterBio={(id) => console.log('Registrar biometría para persona', id)}
          onRevoke={(persona) => setRevokeTarget(persona)}
        />
      </Box>

      <AddPersonaDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onConfirmed={handleConfirmed} cuposUsados={activas} />
      <RevokePersonaModal persona={revokeTarget} onClose={() => setRevokeTarget(null)} onConfirm={handleRevoke} />

      <Snackbar open={!!toastMessage} autoHideDuration={3500} onClose={() => setToastMessage(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="success" variant="filled" onClose={() => setToastMessage(null)} sx={{ borderRadius: vigiaRadius.sm }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </DashboardTemplate>
  );
};

export { PersonasAutorizadasPage };
export default PersonasAutorizadasPage;
