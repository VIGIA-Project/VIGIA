// src/components/organisms/propietario/RevokePaseModal.tsx
import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { differenceInMinutes, addHours, parseISO } from 'date-fns';
import { vigiaColors, vigiaRadius } from '../../../theme/vigia-theme';
import { PaseRapido } from '../../../config/propietario-pases.config';

export interface RevokePaseModalProps {
  pase: PaseRapido | null;
  onClose: () => void;
  onConfirm: (id: string, motivoRevocacion: string) => void;
}

export const RevokePaseModal: React.FC<RevokePaseModalProps> = ({ pase, onClose, onConfirm }) => {
  const [motivo, setMotivo] = useState('');

  const handleClose = () => {
    setMotivo('');
    onClose();
  };

  const handleConfirm = () => {
    if (!pase) return;
    onConfirm(pase.id, motivo.trim());
    setMotivo('');
  };

  const tiempoRestante = pase
    ? Math.max(0, differenceInMinutes(addHours(parseISO(pase.generadoEn), pase.duracionHoras), new Date()))
    : 0;

  return (
    <Dialog open={!!pase} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '16px', maxWidth: 480 } }}>
      <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, color: '#0F172A' }}>
        Revocar pase de acceso
      </DialogTitle>
      <DialogContent>
        {pase && (
          <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Código</Typography>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#0D5CCF' }}>{pase.codigo}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderTop: '1px solid #F1F5F9' }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Persona</Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>{pase.persona}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderTop: '1px solid #F1F5F9' }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Vehículo</Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                {pase.vehiculo.marca} {pase.vehiculo.modelo} · {pase.vehiculo.placa}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderTop: '1px solid #F1F5F9' }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Tiempo restante</Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                {Math.floor(tiempoRestante / 60)}h {String(tiempoRestante % 60).padStart(2, '0')}min
              </Typography>
            </Box>
          </Box>
        )}
        <TextField
          label="Motivo"
          placeholder="Ej: Ya no se requiere el acceso"
          multiline
          minRows={2}
          fullWidth
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', color: vigiaColors.textSecondary }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{ backgroundColor: '#DC2626', color: '#FFFFFF', fontFamily: '"Inter", sans-serif', fontWeight: 600, textTransform: 'none', borderRadius: vigiaRadius.sm, '&:hover': { backgroundColor: '#B91C1C' } }}
        >
          Revocar pase
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RevokePaseModal;
