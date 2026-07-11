// src/components/molecules/PersonaCard.tsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import { staggerItem } from '../../config/animations.config';
import { vigiaColors, vigiaRadius, vigiaShadows } from '../../theme/vigia-theme';
import { PersonaAutorizada, PERSONA_CARD_COPY } from '../../config/propietario-personas.config';

export interface PersonaCardProps {
  persona: PersonaAutorizada;
  onViewDetail: (id: string) => void;
  onRegisterBio: (id: string) => void;
  onRevoke: (persona: PersonaAutorizada) => void;
}

const getIniciales = (nombre: string) => {
  const partes = nombre.trim().split(/\s+/);
  const first = partes[0]?.[0] ?? '';
  const last = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
};

const maskCedula = (cedula: string) => cedula.replace(/X/g, '•');

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona, onViewDetail, onRegisterBio, onRevoke }) => {
  const isRevocada = persona.estado === 'REVOCADA' || persona.estado === 'INACTIVA';
  const bioCompleta = persona.biometria === 'COMPLETADA';

  return (
    <motion.div variants={staggerItem} style={{ height: '100%' }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: vigiaRadius.lg,
          border: '1px solid #E2E8F0',
          boxShadow: vigiaShadows.sm,
          backgroundColor: vigiaColors.bgCard,
          opacity: isRevocada ? 0.65 : 1,
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 18px rgba(10,47,134,0.14)' },
        }}
      >
        <Box sx={{ p: 2.25, flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0D5CCF, #19D6C4)',
                color: vigiaColors.white,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: '"Inter", sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {getIniciales(persona.nombre)}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '1rem', color: '#0F172A' }}>
                {persona.nombre}
              </Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B' }}>
                {maskCedula(persona.cedula)}
              </Typography>
            </Box>
            <Box
              sx={{
                px: 1.1,
                py: 0.3,
                borderRadius: vigiaRadius.full,
                backgroundColor: '#EFF6FF',
                color: '#0D5CCF',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.7rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {persona.relacion}
            </Box>
          </Box>

          {isRevocada ? (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.25,
                py: 0.3,
                borderRadius: vigiaRadius.full,
                backgroundColor: '#F1F5F9',
                color: '#475569',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.72rem',
                fontWeight: 700,
                mb: 1,
              }}
            >
              {PERSONA_CARD_COPY.revocada}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
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
              {bioCompleta ? (
                <CheckCircleIcon sx={{ fontSize: 13, color: '#16A34A' }} />
              ) : (
                <AccessTimeIcon sx={{ fontSize: 13, color: '#F59E0B' }} />
              )}
              {bioCompleta ? PERSONA_CARD_COPY.bioCompleta : PERSONA_CARD_COPY.bioPendiente}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DirectionsCarFilledOutlinedIcon sx={{ fontSize: 14, color: '#64748B' }} />
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8125rem', color: '#64748B' }}>
              {PERSONA_CARD_COPY.accessText}
            </Typography>
          </Box>

          {!isRevocada && !bioCompleta && (
            <>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: '#64748B', mt: 0.5, mb: 1.25 }}>
                {PERSONA_CARD_COPY.pendingMicrocopy}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => onRegisterBio(persona.id)}
                startIcon={<FingerprintOutlinedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  minHeight: 44,
                  backgroundColor: '#F59E0B',
                  color: '#1F2937',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'none',
                  borderRadius: vigiaRadius.sm,
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#D97706', boxShadow: 'none' },
                }}
              >
                {PERSONA_CARD_COPY.registerBio}
              </Button>
            </>
          )}
        </Box>

        <Box
          sx={{
            borderTop: '1px solid #F1F5F9',
            px: 2.25,
            py: 1.25,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box
            component="button"
            onClick={() => onViewDetail(persona.id)}
            sx={{ background: 'none', border: 'none', cursor: 'pointer', color: vigiaColors.primary, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.8rem', '&:hover': { textDecoration: 'underline' } }}
          >
            {PERSONA_CARD_COPY.viewDetail}
          </Box>

          {!isRevocada && (
            <Box
              component="button"
              className="persona-revoke-btn"
              onClick={() => onRevoke(persona)}
              sx={{
                ml: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#DC2626',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: '0.8rem',
                transition: 'opacity 0.18s ease',
                '&:hover': { textDecoration: 'underline' },
                '&:focus-visible': { outline: `2px solid ${vigiaColors.greenIA}`, outlineOffset: '2px' },
              }}
            >
              {PERSONA_CARD_COPY.revoke}
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
};

export default PersonaCard;
