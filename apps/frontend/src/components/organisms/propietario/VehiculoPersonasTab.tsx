// src/components/organisms/propietario/VehiculoPersonasTab.tsx
import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { staggerContainer, staggerItem } from '../../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../../theme/vigia-theme';
import { mapMiembroAPersonaAutorizada, PERSONAS_TAB_COPY } from '../../../config/propietario-vehiculo-detalle.config';
import { useAuth } from '../../../context';
import { useMiembrosGrupoFamiliar } from '../../../hooks/useAuthorization';
import { usePersonasDelPropietario as usePersonasResolver } from '../../../hooks/useRegistry';
import { LoadingSkeleton, ErrorState } from '../../atoms';

export const VehiculoPersonasTab: React.FC = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuth();

  const autorizacionesQuery = useMiembrosGrupoFamiliar(user?.personaId);
  const autorizaciones = useMemo(
    () => (autorizacionesQuery.data ?? []).filter((a) => a.estado === 'ACTIVA'),
    [autorizacionesQuery.data]
  );
  const personaIds = useMemo(() => autorizaciones.map((a) => a.personaId), [autorizaciones]);
  const { personasById, isLoading: isLoadingPersonas } = usePersonasResolver(personaIds);

  const personas = useMemo(
    () => autorizaciones.map((a) => mapMiembroAPersonaAutorizada(a, personasById.get(a.personaId))),
    [autorizaciones, personasById]
  );

  if (autorizacionesQuery.isLoading || isLoadingPersonas) {
    return <LoadingSkeleton variant="cards" rows={3} />;
  }

  if (autorizacionesQuery.isError) {
    return <ErrorState mensaje="No se pudo cargar el grupo familiar." onRetry={() => autorizacionesQuery.refetch()} />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* Nota informativa */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          p: 2,
          borderRadius: vigiaRadius.lg,
          backgroundColor: 'rgba(13,92,207,0.05)',
          border: '1px solid rgba(13,92,207,0.15)',
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 20, color: vigiaColors.primary, flexShrink: 0, mt: 0.25 }} />
        <Box>
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textBody, lineHeight: 1.6 }}>
            {PERSONAS_TAB_COPY.noticeText}
          </Typography>
          <Box
            component="button"
            onClick={() => navigate('/propietario/personas')}
            sx={{ background: 'none', border: 'none', cursor: 'pointer', color: vigiaColors.primary, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', mt: 0.5, p: 0, '&:hover': { textDecoration: 'underline' } }}
          >
            {PERSONAS_TAB_COPY.noticeLink}
          </Box>
        </Box>
      </Box>

      {personas.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0' }}>
          <PeopleOutlineIcon sx={{ fontSize: 40, color: vigiaColors.textTertiary, mb: 1.5 }} />
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A', mb: 1 }}>
            {PERSONAS_TAB_COPY.emptyTitle}
          </Typography>
          <Box
            component="button"
            onClick={() => navigate('/propietario/personas')}
            sx={{ background: 'none', border: 'none', cursor: 'pointer', color: vigiaColors.primary, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem', '&:hover': { textDecoration: 'underline' } }}
          >
            {PERSONAS_TAB_COPY.emptyCta}
          </Box>
        </Box>
      ) : (
        <motion.div variants={shouldReduceMotion ? undefined : staggerContainer} initial="hidden" animate="visible">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
            {personas.map((persona) => {
              const bioCompleta = persona.biometria === 'COMPLETADA';
              return (
                <motion.div key={persona.id} variants={shouldReduceMotion ? undefined : staggerItem}>
                  <Box sx={{ p: 2.25, borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', boxShadow: vigiaShadows.sm, backgroundColor: vigiaColors.bgCard }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                      <Box sx={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <PersonOutlineOutlinedIcon sx={{ fontSize: 20, color: vigiaColors.primary }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A' }}>
                          {persona.nombre}
                        </Typography>
                        <Box
                          sx={{
                            display: 'inline-block',
                            mt: 0.25,
                            px: 1,
                            py: 0.1,
                            borderRadius: vigiaRadius.full,
                            backgroundColor: '#F1F5F9',
                            color: '#475569',
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                          }}
                        >
                          {persona.relacion}
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1.25,
                        py: 0.3,
                        borderRadius: vigiaRadius.full,
                        backgroundColor: bioCompleta ? '#DCFCE7' : '#FEF3C7',
                        color: bioCompleta ? '#166534' : '#92400E',
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {bioCompleta ? PERSONAS_TAB_COPY.bioCompleta : PERSONAS_TAB_COPY.bioPendiente}
                    </Box>

                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B' }}>
                      {PERSONAS_TAB_COPY.accessText}
                    </Typography>
                  </Box>
                </motion.div>
              );
            })}
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default VehiculoPersonasTab;
