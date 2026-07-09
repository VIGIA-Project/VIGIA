import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { vigiaRadius } from '../../theme/vigia-theme';

interface AuthNoticeAlertProps {
  message: string | null;
  onClose: () => void;
}

export const AuthNoticeAlert: React.FC<AuthNoticeAlertProps> = ({ message, onClose }) => (
  <Snackbar
    open={!!message}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert
      severity="info"
      variant="filled"
      onClose={onClose}
      sx={{
        borderRadius: vigiaRadius.sm,
        fontFamily: '"Inter", sans-serif',
        fontSize: '0.85rem',
        width: '100%',
      }}
    >
      {message}
    </Alert>
  </Snackbar>
);

export default AuthNoticeAlert;
