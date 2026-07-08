// src/components/organisms/propietario/RevokePersonaModal.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, TextField, Typography } from '@mui/material';
import { vigiaColors, vigiaRadius } from '../../../theme/vigia-theme';
import { PersonaAutorizada, REVOKE_PERSONA_MODAL_COPY as COPY } from '../../../config/propietario-personas.config';

export interface RevokePersonaModalProps {
  persona: PersonaAutorizada | null;
  onClose: () => void;
  onConfirm: (id: string, motivo: string) => void;
}

export const RevokePersonaModal: React.FC<RevokePersonaModalProps> = ({ persona, onClose, onConfirm }) => {
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    if (!persona) setMotivo('');
  }, [persona]);

  return (
    <Dialog
      open={!!persona}
      onClose={onClose}
      transitionDuration={200}
      PaperProps={{ sx: { width: '100%', maxWidth: 520, borderRadius: vigiaRadius.xl } }}
    >
      {persona && (
        <Box sx={{ p: 3 }}>
          <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '1.15rem', color: vigiaColors.textHeading, mb: 2 }}>
            {COPY.title}
          </Typography>

          <Box sx={{ borderRadius: vigiaRadius.md, border: '1px solid #E2E8F0', p: 1.75, mb: 2 }}>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>
              {persona.nombre}
            </Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B', mt: 0.25 }}>
              Cobertura: {COPY.coverageLabel}
            </Typography>
            <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.8rem', color: '#64748B' }}>
              Autorizado desde: {persona.autorizadoDesde}
            </Typography>
          </Box>

          <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textBody, mb: 2 }}>
            {COPY.bodyText}
          </Typography>

          <TextField
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            label={COPY.motivoLabel}
            placeholder={COPY.motivoPlaceholder}
            fullWidth
            multiline
            sx={{ mb: 2.5, '& .MuiInputBase-root': { minHeight: 72, alignItems: 'flex-start' } }}
          />

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button fullWidth variant="outlined" onClick={onClose} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, borderColor: '#E2E8F0', color: vigiaColors.textSecondary }}>
              {COPY.cancelLabel}
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => onConfirm(persona.id, motivo.trim())}
              sx={{ backgroundColor: '#DC2626', color: '#FFFFFF', fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, minHeight: 44, '&:hover': { backgroundColor: '#B91C1C' } }}
            >
              {COPY.confirmCta}
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default RevokePersonaModal;
