import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthTemplate } from '../../components/templates';
import { useAuth } from '../../context/AuthContext';
import { PASSWORD_RULES, getDashboardByRole } from '../../config/auth.config';
import { vigiaColors, vigiaShadows, vigiaRadius } from '../../theme/vigia-theme';

// ═══════════════════════════════════════════════════════════════
// FEATURES DEL PANEL IZQUIERDO (tono seguridad)
// ═══════════════════════════════════════════════════════════════
const SECURITY_FEATURES = [
  { icon: 'shield', text: 'Tu seguridad es nuestra prioridad' },
  { icon: 'https', text: 'Contraseña cifrada con estándares modernos' },
  { icon: 'lock', text: 'Protección para ti y tu grupo familiar' },
];

// ═══════════════════════════════════════════════════════════════
// MOCK: Cambio de contraseña
// ═══════════════════════════════════════════════════════════════
const mockChangePassword = async (_currentPassword: string, _newPassword: string): Promise<{ success: boolean; error?: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Aceptamos cualquier contraseña actual para el mock (sin quemar credenciales)
  return { success: true };
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Requisito individual
// ═══════════════════════════════════════════════════════════════
const PasswordRequirement: React.FC<{ label: string; met: boolean }> = ({ label, met }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.3 }}>
      <motion.div
        key={met ? 'met' : 'unmet'}
        initial={shouldReduceMotion ? {} : { scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        {met ? (
          <CheckCircleIcon sx={{ fontSize: 18, color: vigiaColors.success, transition: 'color 0.3s ease' }} />
        ) : (
          <CancelIcon sx={{ fontSize: 18, color: vigiaColors.error, transition: 'color 0.3s ease' }} />
        )}
      </motion.div>
      <Typography
        sx={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.8rem',
          color: met ? vigiaColors.success : vigiaColors.textSecondary,
          fontWeight: met ? 500 : 400,
          transition: 'color 0.3s ease',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Checkmark animado de éxito
// ═══════════════════════════════════════════════════════════════
const SuccessCheckmark: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      style={{ textAlign: 'center' }}
    >
      <Box role="status" aria-live="polite">
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: vigiaColors.gradientIA,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
          boxShadow: '0 8px 24px rgba(25, 214, 196, 0.3)',
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 36, color: '#FFFFFF' }} />
      </Box>
      <Typography
        sx={{
          fontFamily: '"Exo 2", sans-serif',
          fontWeight: 600,
          fontSize: '1.1rem',
          color: vigiaColors.textHeading,
          mb: 0.5,
        }}
      >
        ¡Contraseña actualizada!
      </Typography>
      <Typography
        sx={{
          fontFamily: '"Inter", sans-serif',
          fontSize: '0.8rem',
          color: vigiaColors.textSecondary,
        }}
      >
        Redirigiendo al sistema...
      </Typography>
      </Box>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
const CambiarPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, completePasswordChange } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Estado del formulario
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [shakeField, setShakeField] = useState<string | null>(null);

  // Validación en tiempo real
  const requirements = useMemo(() => {
    const rules: Array<{ key: string; label: string; met: boolean }> = PASSWORD_RULES.map((rule) => ({
      key: rule.key,
      label: rule.label,
      met: rule.test(newPassword),
    }));

    // Regla adicional: no igual a la anterior
    rules.push({
      key: 'notSame',
      label: 'No igual a la anterior',
      met: newPassword.length > 0 && newPassword !== currentPassword,
    });

    // Regla adicional: confirmación coincide (solo si confirmPassword tiene valor)
    if (confirmPassword.length > 0) {
      rules.push({
        key: 'match',
        label: 'Confirmación coincide',
        met: newPassword === confirmPassword,
      });
    }

    return rules;
  }, [newPassword, currentPassword, confirmPassword]);

  const allRequirementsMet = useMemo(() => {
    if (!currentPassword || !newPassword || !confirmPassword) return false;
    if (newPassword !== confirmPassword) return false;
    if (newPassword === currentPassword) return false;
    return PASSWORD_RULES.every((rule) => rule.test(newPassword));
  }, [currentPassword, newPassword, confirmPassword]);

  // Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShakeField(null);

    if (!allRequirementsMet) return;

    setIsLoading(true);
    try {
      const response = await mockChangePassword(currentPassword, newPassword);

      if (response.success) {
        setSuccess(true);
        completePasswordChange();
        // Redirect después de 1.5s
        setTimeout(() => {
          navigate(getDashboardByRole(user?.rol || 'PROPIETARIO'));
        }, 1500);
      } else {
        setError(response.error || 'Error al cambiar la contraseña.');
        setShakeField('current');
      }
    } catch {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos reutilizables para inputs
  const getInputSx = (fieldKey: string) => ({
    '& .MuiOutlinedInput-root': {
      height: 48,
      borderRadius: '8px',
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.9rem',
      backgroundColor: '#FFFFFF',
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderWidth: '1.5px',
        borderColor: shakeField === fieldKey ? vigiaColors.error : 'rgba(10, 47, 134, 0.12)',
        transition: 'border-color 0.3s ease',
      },
      '&:hover fieldset': {
        borderColor: shakeField === fieldKey ? vigiaColors.error : 'rgba(13, 92, 207, 0.3)',
      },
      '&.Mui-focused fieldset': {
        borderWidth: '2px',
        borderColor: shakeField === fieldKey ? vigiaColors.error : vigiaColors.primary,
      },
    },
    '& .MuiInputLabel-root': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.85rem',
      color: vigiaColors.textSecondary,
      '&.Mui-focused': {
        color: shakeField === fieldKey ? vigiaColors.error : vigiaColors.primary,
      },
    },
  });

  const eyeToggle = (show: boolean, toggle: () => void, label: string) => (
    <InputAdornment position="end">
      <motion.div
        whileTap={shouldReduceMotion ? {} : { scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <IconButton
          onClick={toggle}
          edge="end"
          size="small"
          aria-label={label}
          sx={{
            color: vigiaColors.textTertiary,
            '&:hover': { color: vigiaColors.primary },
            '&:focus-visible': {
              outline: `2px solid ${vigiaColors.greenIA}`,
              outlineOffset: '2px',
            },
          }}
        >
          {show ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
        </IconButton>
      </motion.div>
    </InputAdornment>
  );

  // Si éxito, mostrar checkmark
  if (success) {
    return (
      <AuthTemplate
        features={SECURITY_FEATURES}
        leftTitle="Control de Acceso Vehicular Inteligente"
        leftSubtitle="Tu seguridad es nuestra prioridad. Tu nueva contraseña protege tu acceso y el de tu entorno autorizado."
      >
        <SuccessCheckmark />
      </AuthTemplate>
    );
  }

  return (
    <AuthTemplate
      features={SECURITY_FEATURES}
      leftTitle="Control de Acceso Vehicular Inteligente"
      leftSubtitle="Establezca una contraseña segura para proteger su cuenta y la de su familia."
    >
      {/* Título */}
      <Typography
        sx={{
          fontFamily: '"Exo 2", sans-serif',
          fontWeight: 600,
          fontSize: '1.25rem',
          color: vigiaColors.textHeading,
          textAlign: 'center',
          mb: 2,
        }}
      >
        Actualizar Contraseña
      </Typography>

      {/* Card informativa */}
      <Box
        sx={{
          p: 2,
          mb: 2.5,
          borderRadius: vigiaRadius.md,
          backgroundColor: 'rgba(25, 214, 196, 0.04)',
          border: '1px solid rgba(25, 214, 196, 0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Typography sx={{ fontSize: '1rem' }}>🔐</Typography>
          <Typography
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.8rem',
              color: vigiaColors.textBody,
              lineHeight: 1.5,
            }}
          >
            Por seguridad, debe establecer una nueva contraseña personal. Esta reemplazará la contraseña temporal asignada.
          </Typography>
        </Box>
      </Box>

      {/* Error global */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Alert
            severity="error"
            variant="outlined"
            role="alert"
            aria-live="assertive"
            sx={{
              mb: 2,
              borderRadius: vigiaRadius.sm,
              borderColor: vigiaColors.error,
              backgroundColor: 'rgba(198, 40, 40, 0.04)',
              '& .MuiAlert-message': {
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.8rem',
              },
            }}
            onClose={() => { setError(null); setShakeField(null); }}
          >
            {error}
          </Alert>
        </motion.div>
      )}

      {/* Formulario */}
      <Box component="form" onSubmit={handleSubmit} noValidate aria-label="Formulario de cambio de contraseña">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Contraseña actual */}
          <motion.div
            animate={shakeField === 'current' && !shouldReduceMotion ? { x: [0, -3, 3, -3, 3, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            <TextField
              label="Contraseña actual"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setError(null); setShakeField(null); }}
              required
              fullWidth
              autoComplete="current-password"
              autoFocus
              disabled={isLoading}
              sx={getInputSx('current')}
              InputProps={{
                'aria-label': 'Contraseña actual o temporal',
                endAdornment: eyeToggle(showCurrent, () => setShowCurrent(!showCurrent), showCurrent ? 'Ocultar contraseña actual' : 'Mostrar contraseña actual'),
              }}
            />
          </motion.div>

          {/* Nueva contraseña */}
          <TextField
            label="Nueva contraseña"
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            fullWidth
            autoComplete="new-password"
            disabled={isLoading}
            sx={getInputSx('new')}
            InputProps={{
              'aria-label': 'Nueva contraseña',
              endAdornment: eyeToggle(showNew, () => setShowNew(!showNew), showNew ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'),
            }}
          />

          {/* Confirmar nueva */}
          <TextField
            label="Confirmar nueva contraseña"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            autoComplete="new-password"
            disabled={isLoading}
            sx={getInputSx('confirm')}
            InputProps={{
              'aria-label': 'Confirmar nueva contraseña',
              endAdornment: eyeToggle(showConfirm, () => setShowConfirm(!showConfirm), showConfirm ? 'Ocultar confirmación' : 'Mostrar confirmación'),
            }}
          />
        </Box>

        {/* Checklist de requisitos */}
        {newPassword.length > 0 && (
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mt: 2, mb: 2.5 }} role="list" aria-label="Requisitos de contraseña">
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: vigiaColors.textTertiary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 1,
                }}
              >
                Requisitos
              </Typography>
              {requirements.map((req) => (
                <Box key={req.key} role="listitem">
                  <PasswordRequirement label={req.label} met={req.met} />
                </Box>
              ))}
            </Box>
          </motion.div>
        )}

        {/* Botón Guardar */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!allRequirementsMet || isLoading}
          aria-busy={isLoading}
          aria-disabled={!allRequirementsMet}
          aria-label={isLoading ? 'Guardando contraseña' : allRequirementsMet ? 'Guardar nueva contraseña' : 'Complete todos los requisitos para continuar'}
          sx={{
            mt: newPassword.length > 0 ? 0 : 3,
            background: allRequirementsMet && !isLoading ? vigiaColors.gradientIA : 'rgba(13, 92, 207, 0.3)',
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: vigiaRadius.md,
            minHeight: 48,
            boxShadow: allRequirementsMet ? vigiaShadows.sm : 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: allRequirementsMet && !isLoading ? '0 8px 24px rgba(25, 214, 196, 0.3)' : 'none',
              transform: shouldReduceMotion || !allRequirementsMet || isLoading ? 'none' : 'translateY(-1px)',
            },
            '&:focus-visible': {
              outline: `2px solid ${vigiaColors.greenIA}`,
              outlineOffset: '2px',
            },
            '&.Mui-disabled': {
              background: 'rgba(13, 92, 207, 0.2)',
              color: 'rgba(255,255,255,0.5)',
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={22} sx={{ color: '#FFFFFF' }} />
          ) : (
            'Guardar Contraseña'
          )}
        </Button>
      </Box>

      {/* Trust signal */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5, gap: 0.5, alignItems: 'center' }}>
        <Typography sx={{ fontSize: '0.85rem' }}>🔐</Typography>
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.7rem',
            color: vigiaColors.textTertiary,
          }}
        >
          Su contraseña se almacena cifrada
        </Typography>
      </Box>
    </AuthTemplate>
  );
};

export default CambiarPasswordPage;
