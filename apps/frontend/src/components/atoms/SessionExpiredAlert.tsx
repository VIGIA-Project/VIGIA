import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { vigiaRadius } from '../../theme/vigia-theme';

interface SessionExpiredAlertProps {
  open: boolean;
  onClose: () => void;
}

export const SessionExpiredAlert: React.FC<SessionExpiredAlertProps> = ({ open, onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={5000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert
      severity="warning"
      variant="filled"
      onClose={onClose}
      sx={{
        borderRadius: vigiaRadius.sm,
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.85rem',
        width: '100%',
      }}
    >
      Su sesión ha expirado. Por favor, inicie sesión nuevamente.
    </Alert>
  </Snackbar>
);

export default SessionExpiredAlert;
