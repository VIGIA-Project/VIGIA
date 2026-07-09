// src/components/organisms/propietario/RevokePermisoModal.tsx
import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { vigiaColors, vigiaRadius } from '../../../theme/vigia-theme';
import { PermisoTemporal } from '../../../config/propietario-permisos.config';

export interface RevokePermisoModalProps {
  permiso: PermisoTemporal | null;
  onClose: () => void;
  onConfirm: (id: string, motivoRevocacion: string) => void;
}

export const RevokePermisoModal: React.FC<RevokePermisoModalProps> = ({ permiso, onClose, onConfirm }) => {
  const [motivo, setMotivo] = useState('');

  const handleClose = () => {
    setMotivo('');
    onClose();
  };

  const handleConfirm = () => {
    if (!permiso) return;
    onConfirm(permiso.id, motivo.trim());
    setMotivo('');
  };

  return (
    <Dialog open={!!permiso} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '16px', maxWidth: 480 } }}>
      <DialogTitle sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 700, color: '#0F172A' }}>
        Revocar permiso temporal
      </DialogTitle>
      <DialogContent>
        {permiso && (
          <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Persona</Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>{permiso.persona}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderTop: '1px solid #F1F5F9' }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Vehículo</Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                {permiso.vehiculo.marca} {permiso.vehiculo.modelo} · {permiso.vehiculo.placa}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderTop: '1px solid #F1F5F9' }}>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: '#64748B' }}>Vigencia</Typography>
              <Typography sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                {permiso.fechaInicio} → {permiso.fechaFin}
              </Typography>
            </Box>
          </Box>
        )}
        <TextField
          label="Motivo de revocación"
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
          Revocar permiso
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RevokePermisoModal;
