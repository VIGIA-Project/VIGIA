import Chip from '@mui/material/Chip';
import type { SxProps } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export type StatusKind =
  | 'decision'
  | 'severity'
  | 'atencion'
  | 'biometrico'
  | 'cuenta'
  | 'autorizacion'
  | 'disponibilidad';

const palette: Record<StatusKind, Record<string, { label: string; color: 'default' | 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary'; sx?: SxProps<Theme> }>> = {
  decision: {
    SUCCESSFUL: { label: 'SUCCESSFUL', color: 'success' },
    PENDING_VERIFY: { label: 'PENDING_VERIFY', color: 'warning' },
    DENIED: { label: 'DENIED', color: 'error' },
  },
  severity: {
    ALTA: { label: 'ALTA', color: 'error' },
    MEDIA: { label: 'MEDIA', color: 'warning' },
    INFORMATIVA: { label: 'INFORMATIVA', color: 'info' },
  },
  atencion: {
    GENERADA: { label: 'GENERADA', color: 'error' },
    ENTREGADA: { label: 'ENTREGADA', color: 'warning' },
    ATENDIDA: { label: 'ATENDIDA', color: 'success' },
  },
  biometrico: {
    COINCIDENCIA_SUFICIENTE: { label: 'COINCIDENCIA_SUFICIENTE', color: 'success' },
    EVIDENCIA_INSUFICIENTE: { label: 'EVIDENCIA_INSUFICIENTE', color: 'error' },
  },
  cuenta: {
    ACTIVO: { label: 'HABILITADO', color: 'success' },
    INACTIVO: { label: 'INHABILITADO', color: 'default' },
    DESACTIVADO: { label: 'SUSPENDIDO', color: 'error' },
    PENDIENTE_CONTRASEÑA: { label: 'CONTRASEÑA PENDIENTE', color: 'warning' },
    PENDIENTE_BIOMETRIA: { label: 'BIOMETRÍA PENDIENTE', color: 'warning' },
    ACTIVE: { label: 'ACTIVA', color: 'success' },
    INACTIVE: { label: 'INACTIVA', color: 'error' },
    PENDING_PASSWORD_CHANGE: { label: 'CAMBIO DE CONTRASEÑA PENDIENTE', color: 'warning' },
  },
  autorizacion: {
    ACTIVA: { label: 'ACTIVA', color: 'success' },
    INACTIVA: { label: 'INACTIVA', color: 'default' },
    REVOCADO: { label: 'REVOCADO', color: 'error' },
    EXPIRADO: { label: 'EXPIRADO', color: 'warning' },
  },
  disponibilidad: {
    DISPONIBLE: { label: 'DISPONIBLE', color: 'success' },
    PENDIENTE: { label: 'PENDIENTE', color: 'warning' },
    NO_DISPONIBLE: { label: 'NO_DISPONIBLE', color: 'error' },
  },
};

interface StatusChipProps {
  kind: StatusKind;
  value: string;
  size?: 'small' | 'medium';
}

export default function StatusChip({ kind, value, size = 'small' }: StatusChipProps) {
  const entry = palette[kind]?.[value] ?? { label: value, color: 'default' as const };
  return (
    <Chip
      label={entry.label}
      color={entry.color}
      size={size}
      variant="outlined"
      sx={{ ...entry.sx, fontWeight: 600, minWidth: 90, justifyContent: 'center', borderWidth: 1.5 }}
    />
  );
}
