// src/components/molecules/EventoTimeline.tsx
import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';
import { EventoDetalle, RESULTADO_LABEL, RESULTADO_STYLES } from '../../config/propietario-vehiculo-detalle.config';

export interface EventoTimelineProps {
  eventos: EventoDetalle[];
}

const groupByDia = (eventos: EventoDetalle[]) => {
  const orden: string[] = [];
  const groups: Record<string, EventoDetalle[]> = {};
  eventos.forEach((evento) => {
    if (!groups[evento.dia]) {
      groups[evento.dia] = [];
      orden.push(evento.dia);
    }
    groups[evento.dia].push(evento);
  });
  return orden.map((dia) => ({ dia, eventos: groups[dia] }));
};

const EventoRow: React.FC<{ evento: EventoDetalle }> = ({ evento }) => {
  const shouldReduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const resultadoStyle = RESULTADO_STYLES[evento.resultado];

  return (
    <Box
      onClick={() => setExpanded((prev) => !prev)}
      sx={{
        borderRadius: vigiaRadius.sm,
        cursor: 'pointer',
        px: 1.5,
        py: 1.25,
        transition: 'background-color 0.15s ease',
        '&:hover': { backgroundColor: 'rgba(13,92,207,0.03)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: '#94A3B8', minWidth: 44 }}>
          {evento.hora}
        </Typography>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.75rem', color: vigiaColors.textSecondary }}>
          {evento.tipo}
        </Typography>
        <Box
          sx={{
            px: 1,
            py: 0.15,
            borderRadius: vigiaRadius.full,
            backgroundColor: resultadoStyle.bg,
            color: resultadoStyle.color,
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}
        >
          {RESULTADO_LABEL[evento.resultado]}
        </Box>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#64748B' }}>
          {evento.punto}
        </Typography>
        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#64748B', ml: 'auto' }}>
          {evento.persona}
        </Typography>
      </Box>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <Box sx={{ mt: 1, ml: { xs: 0, sm: 6.5 }, p: 1.5, borderRadius: vigiaRadius.sm, backgroundColor: '#F8FAFC' }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textBody, mb: 0.5 }}>
                <strong>Persona:</strong> {evento.persona}
              </Typography>
              {evento.permisoUsado && (
                <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textBody, mb: 0.5 }}>
                  <strong>Autorización usada:</strong> {evento.permisoUsado}
                </Typography>
              )}
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: vigiaColors.textSecondary }}>
                {evento.decision}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export const EventoTimeline: React.FC<EventoTimelineProps> = ({ eventos }) => {
  const grupos = groupByDia(eventos);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {grupos.map((grupo) => (
        <Box key={grupo.dia}>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 0.5,
            }}
          >
            {grupo.dia}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {grupo.eventos.map((evento) => (
              <EventoRow key={evento.id} evento={evento} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default EventoTimeline;
