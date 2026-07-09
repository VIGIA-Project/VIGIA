// src/components/molecules/PermisoTemporalCard.tsx
import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { staggerItem } from '../../config/animations.config';
import { vigiaColors, vigiaRadius } from '../../theme/vigia-theme';
import { PermisoTemporal } from '../../config/propietario-permisos.config';

const ESTADO_BADGE: Record<PermisoTemporal['estado'], { bg: string; text: string; label: string }> = {
  ACTIVO: { bg: '#DCFCE7', text: '#166534', label: 'Activo' },
  EXPIRADO: { bg: '#F1F5F9', text: '#64748B', label: 'Expirado' },
  REVOCADO: { bg: '#FEE2E2', text: '#991B1B', label: 'Revocado' },
};

const initials = (nombre: string) => nombre.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase();

const formatVigencia = (inicio: string, fin: string) => {
  const start = parseISO(inicio);
  const end = parseISO(fin);
  return `Del ${format(start, "d 'de' MMM", { locale: es })} al ${format(end, "d 'de' MMM yyyy", { locale: es })}`;
};

export interface PermisoTemporalCardProps {
  permiso: PermisoTemporal;
  onViewDetail?: (id: string) => void;
  onRevoke?: (id: string) => void;
}

export const PermisoTemporalCard: React.FC<PermisoTemporalCardProps> = ({ permiso, onViewDetail, onRevoke }) => {
  const shouldReduceMotion = useReducedMotion();
  const badge = ESTADO_BADGE[permiso.estado];
  const diasParaExpirar = permiso.estado === 'ACTIVO' ? differenceInCalendarDays(parseISO(permiso.fechaFin), new Date()) : null;
  const proximoAExpirar = diasParaExpirar !== null && diasParaExpirar >= 0 && diasParaExpirar <= 3;

  return (
    <motion.div variants={staggerItem} whileHover={shouldReduceMotion ? undefined : { y: -2 }} transition={{ duration: 0.18 }}>
      <Box
        role="group"
        sx={{
          borderRadius: vigiaRadius.lg,
          border: '1px solid #E2E8F0',
          p: '20px',
          backgroundColor: '#FFFFFF',
          height: '100%',
          transition: 'box-shadow 180ms ease, transform 180ms ease',
          '&:hover': { boxShadow: '0 6px 18px rgba(10,47,134,0.14)' },
          '&:hover .permiso-card-revoke, &:focus-within .permiso-card-revoke': { opacity: 1 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 40, height: 40, background: vigiaColors.gradientIA, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.85rem' }}>
              {initials(permiso.persona)}
            </Avatar>
            <Box>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A' }}>
                {permiso.persona}
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#64748B' }}>
                {permiso.cedula}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ px: 1.25, py: 0.375, borderRadius: vigiaRadius.full, backgroundColor: badge.bg, color: badge.text, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.7rem', flexShrink: 0 }}>
            {badge.label}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
          <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 18, color: '#475569' }} />
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#475569' }}>
            {permiso.vehiculo.marca} {permiso.vehiculo.modelo} · {permiso.vehiculo.placa}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: proximoAExpirar ? 0.75 : 1.5 }}>
          <CalendarMonthOutlinedIcon sx={{ fontSize: 18, color: '#475569' }} />
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.875rem', color: '#475569' }}>
            {formatVigencia(permiso.fechaInicio, permiso.fechaFin)}
          </Typography>
        </Box>

        {proximoAExpirar && (
          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', fontWeight: 600, color: '#F59E0B', mb: 1.5 }}>
            Expira en {diasParaExpirar} {diasParaExpirar === 1 ? 'día' : 'días'}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
          <Box
            component="button"
            onClick={() => onViewDetail?.(permiso.id)}
            sx={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0D5CCF', fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', p: 0, '&:hover': { textDecoration: 'underline' } }}
          >
            Ver detalle
          </Box>
          {permiso.estado === 'ACTIVO' && (
            <Box
              component="button"
              className="permiso-card-revoke"
              onClick={() => onRevoke?.(permiso.id)}
              sx={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', p: 0, opacity: { xs: 1, sm: 0 }, transition: 'opacity 180ms ease', '&:hover': { textDecoration: 'underline' } }}
            >
              Revocar
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default PermisoTemporalCard;
