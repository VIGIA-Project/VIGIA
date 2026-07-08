import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  destructive?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onClose,
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: destructive ? 'error.main' : 'warning.main',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          <WarningAmberIcon />
        </Box>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} color={destructive ? 'error' : 'primary'} variant="contained">
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function useConfirmDialog() {
  const [state, setState] = useState<{ open: boolean; title: string; message: string; onConfirm?: () => void; destructive?: boolean }>({
    open: false,
    title: '',
    message: '',
  });

  const open = (opts: { title: string; message: string; onConfirm: () => void; destructive?: boolean }) =>
    setState({ open: true, ...opts });
  const close = () => setState((s) => ({ ...s, open: false }));

  return { state, open, close };
}
