// src/components/molecules/PaseRapidoCard.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { format, isToday, parseISO, differenceInMinutes, addHours } from 'date-fns';
import { staggerItem } from '../../config/animations.config';
import { vigiaRadius } from '../../theme/vigia-theme';
import { PaseRapido } from '../../config/propietario-pases.config';

const ESTADO_BADGE: Record<PaseRapido['estado'], { bg: string; text: string; label: string }> = {
  ACTIVO: { bg: '#DCFCE7', text: '#166534', label: 'Activo' },
  CONSUMIDO: { bg: '#DBEAFE', text: '#1E40AF', label: 'Consumido' },
  EXPIRADO: { bg: '#F1F5F9', text: '#64748B', label: 'Expirado' },
  REVOCADO: { bg: '#FEE2E2', text: '#991B1B', label: 'Revocado' },
};

const formatGenerado = (iso: string) => {
  const d = parseISO(iso);
  return isToday(d) ? `Hoy a las ${format(d, 'HH:mm')}` : format(d, 'dd/MM/yyyy HH:mm');
};

export interface PaseRapidoCardProps {
  pase: PaseRapido;
  onCopy?: (codigo: string) => void;
  onRevoke?: (id: string) => void;
  onViewDetail?: (id: string) => void;
}

export const PaseRapidoCard: React.FC<PaseRapidoCardProps> = ({ pase, onCopy, onRevoke, onViewDetail }) => {
  const shouldReduceMotion = useReducedMotion();
  const badge = ESTADO_BADGE[pase.estado];
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (pase.estado !== 'ACTIVO') return;
    const interval = setInterval(() => forceTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, [pase.estado]);

  const expiraEn = addHours(parseISO(pase.generadoEn), pase.duracionHoras);
  const minutosRestantes = differenceInMinutes(expiraEn, new Date());
  const horas = Math.max(0, Math.floor(minutosRestantes / 60));
  const minutos = Math.max(0, minutosRestantes % 60);
  const urgente = minutosRestantes <= 30;

  return (
    <motion.div variants={staggerItem} whileHover={shouldReduceMotion ? undefined : { y: -2 }} transition={{ duration: 0.18 }}>
      <Box
        sx={{
          borderRadius: vigiaRadius.lg,
          border: '1px solid #E2E8F0',
          p: '20px',
          backgroundColor: '#FFFFFF',
          height: '100%',
          transition: 'box-shadow 180ms ease',
          '&:hover': { boxShadow: '0 6px 18px rgba(10,47,134,0.14)' },
          '&:hover .pase-card-revoke, &:focus-within .pase-card-revoke': { opacity: 1 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 1.5 }}>
          {pase.estado === 'ACTIVO' ? (
            <Box sx={{ px: 2, py: 1, borderRadius: vigiaRadius.md, backgroundColor: '#EFF6FF' }}>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#0D5CCF' }}>
                {pase.codigo}
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#94A3B8', letterSpacing: '2px' }}>
              ••••••
            </Typography>
          )}
          <Box sx={{ px: 1.25, py: 0.375, borderRadius: vigiaRadius.full, backgroundColor: badge.bg, color: badge.text, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.7rem', flexShrink: 0 }}>
            {badge.label}
          </Box>
        </Box>

        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#0F172A', mb: 0.5 }}>
          {pase.persona}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
          <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 16, color: '#475569' }} />
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#475569' }}>
            {pase.vehiculo.marca} {pase.vehiculo.modelo} · {pase.vehiculo.placa}
          </Typography>
        </Box>

        <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#64748B', mb: 0.5 }}>
          Generado: {formatGenerado(pase.generadoEn)}
        </Typography>

        {pase.estado === 'ACTIVO' && (
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8125rem', color: urgente ? '#DC2626' : '#F59E0B', mb: 0.5 }}>
            Expira en {horas}h {String(minutos).padStart(2, '0')}min
          </Typography>
        )}

        {pase.estado === 'CONSUMIDO' && (
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#475569', mb: 0.5 }}>
            Usado el {pase.usadoEn ? format(parseISO(pase.usadoEn), 'dd/MM/yyyy') : '—'} a las {pase.usadoEn ? format(parseISO(pase.usadoEn), 'HH:mm') : '—'} · {pase.puntoAcceso}
          </Typography>
        )}

        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.8125rem',
            color: '#64748B',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 1.5,
          }}
        >
          {pase.motivo}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
          {pase.estado === 'ACTIVO' ? (
            <>
              <Box
                component="button"
                onClick={() => onCopy?.(pase.codigo)}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, background: 'none', border: 'none', cursor: 'pointer', color: '#0D5CCF', fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', p: 0 }}
              >
                <ContentCopyIcon sx={{ fontSize: 14 }} />
                Copiar código
              </Box>
              <Box
                component="button"
                className="pase-card-revoke"
                onClick={() => onRevoke?.(pase.id)}
                sx={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', p: 0, opacity: { xs: 1, sm: 0 }, transition: 'opacity 180ms ease' }}
              >
                Revocar
              </Box>
            </>
          ) : (
            <Box
              component="button"
              onClick={() => onViewDetail?.(pase.id)}
              sx={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0D5CCF', fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', p: 0 }}
            >
              Ver detalle
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default PaseRapidoCard;
