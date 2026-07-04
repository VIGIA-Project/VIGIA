import React, { useState } from 'react';
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
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthTemplate } from '../../components/templates';
import { useAuth } from '../../context/AuthContext';
import { AUTH_ROUTES, AUTH_FEATURES, AUTH_TRUST_SIGNALS, getDashboardByRole, getFeatureIcon } from '../../config/auth.config';
import { vigiaColors, vigiaShadows, vigiaRadius } from '../../theme/vigia-theme';
import { apiPost } from '../../services';

interface AuthResponse {
  access_token: string;
  must_change_password: boolean;
  role: string;
}

const authenticate = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiPost<AuthResponse>('/auth/login', { email, password });
  return response;
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE: Shake animation wrapper
// ═══════════════════════════════════════════════════════════════
const ShakeWrapper: React.FC<{ shake: boolean; children: React.ReactNode }> = ({ shake, children }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion || !shake) {
    return <>{children}</>;
  }

  return (
    <motion.div
      animate={shake ? { x: [0, -3, 3, -3, 3, 0] } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Estado del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // Handlers
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShake(false);

    if (!email.trim() || !password.trim()) {
      setError('Complete todos los campos para continuar.');
      setShake(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authenticate(email.trim(), password);

      login(
        {
          email: email.trim(),
          rol: response.role || 'PROPIETARIO',
          role: response.role || 'PROPIETARIO',
          must_change_password: response.must_change_password || false,
        },
        response.access_token,
      );

      if (response.must_change_password) {
        navigate(AUTH_ROUTES.changePassword);
      } else {
        navigate(getDashboardByRole(response.role || 'PROPIETARIO'));
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error de conexión. Intente nuevamente.';
      setError(message);
      setShake(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos reutilizables para inputs
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      height: 48,
      borderRadius: '8px',
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.9rem',
      backgroundColor: '#FFFFFF',
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderWidth: '1.5px',
        borderColor: error ? vigiaColors.error : 'rgba(10, 47, 134, 0.12)',
        transition: 'border-color 0.3s ease',
      },
      '&:hover fieldset': {
        borderColor: error ? vigiaColors.error : 'rgba(13, 92, 207, 0.3)',
      },
      '&.Mui-focused fieldset': {
        borderWidth: '2px',
        borderColor: error ? vigiaColors.error : vigiaColors.primary,
        borderImage: error ? 'none' : `${vigiaColors.gradientIA} 1`,
      },
    },
    '& .MuiInputLabel-root': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.85rem',
      color: vigiaColors.textSecondary,
      '&.Mui-focused': {
        color: error ? vigiaColors.error : vigiaColors.primary,
      },
    },
  };

  return (
    <AuthTemplate
      features={AUTH_FEATURES.map((f) => ({ icon: f.icon, text: f.text }))}
      leftTitle="Control de Acceso Vehicular Inteligente"
      leftSubtitle="Seguridad biométrica, validación en tiempo real y gestión centralizada de accesos vehiculares."
    >
      {/* Título */}
      <Typography
        sx={{
          fontFamily: '"Exo 2", sans-serif',
          fontWeight: 600,
          fontSize: '1.25rem',
          color: vigiaColors.textHeading,
          textAlign: 'center',
          mb: 3,
        }}
      >
        Acceder al Sistema
      </Typography>

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
              mb: 2.5,
              borderRadius: vigiaRadius.sm,
              borderColor: vigiaColors.error,
              backgroundColor: 'rgba(198, 40, 40, 0.04)',
              '& .MuiAlert-icon': { color: vigiaColors.error },
              '& .MuiAlert-message': {
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.8rem',
                color: vigiaColors.textBody,
              },
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </motion.div>
      )}

      {/* Formulario */}
      <Box component="form" onSubmit={handleSubmit} noValidate aria-label="Formulario de inicio de sesión">
        <ShakeWrapper shake={shake}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Campo: Email/Identificador */}
            <TextField
              label="Correo institucional"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); setShake(false); }}
              required
              fullWidth
              autoComplete="email"
              autoFocus
              disabled={isLoading}
              sx={inputSx}
              InputProps={{
                'aria-label': 'Correo institucional o identificador',
              }}
            />

            {/* Campo: Contraseña */}
            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); setShake(false); }}
              required
              fullWidth
              autoComplete="current-password"
              disabled={isLoading}
              sx={inputSx}
              InputProps={{
                'aria-label': 'Contraseña',
                endAdornment: (
                  <InputAdornment position="end">
                    <motion.div
                      whileTap={shouldReduceMotion ? {} : { scale: 1.2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        sx={{
                          color: vigiaColors.textTertiary,
                          '&:hover': { color: vigiaColors.primary },
                          '&:focus-visible': {
                            outline: `2px solid ${vigiaColors.greenIA}`,
                            outlineOffset: '2px',
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </motion.div>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </ShakeWrapper>

        {/* Botón Acceder */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          aria-busy={isLoading}
          aria-label={isLoading ? 'Verificando credenciales' : 'Acceder al sistema'}
          sx={{
            mt: 3,
            background: isLoading ? 'rgba(13, 92, 207, 0.5)' : vigiaColors.gradientIA,
            fontFamily: '"Exo 2", sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: vigiaRadius.md,
            minHeight: 48,
            boxShadow: vigiaShadows.sm,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: isLoading ? 'none' : '0 8px 24px rgba(25, 214, 196, 0.3)',
              transform: shouldReduceMotion || isLoading ? 'none' : 'translateY(-1px)',
            },
            '&:focus-visible': {
              outline: `2px solid ${vigiaColors.greenIA}`,
              outlineOffset: '2px',
            },
            '&.Mui-disabled': {
              background: 'rgba(13, 92, 207, 0.3)',
              color: 'rgba(255,255,255,0.7)',
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={22} sx={{ color: '#FFFFFF' }} />
          ) : (
            'Acceder'
          )}
        </Button>
      </Box>

      {/* Separador */}
      <Box sx={{ my: 3, borderTop: '1px solid rgba(10, 47, 134, 0.06)' }} />

      {/* Texto de ayuda — NO es link a flujo público */}
      <Box sx={{ textAlign: 'center', mb: 2.5 }}>
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.8rem',
            color: vigiaColors.textSecondary,
            fontWeight: 500,
          }}
        >
          ¿No puede acceder?
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.75rem',
            color: vigiaColors.textTertiary,
            mt: 0.5,
          }}
        >
          Contacte al Administrador del sistema para solicitar un reseteo de credenciales.
        </Typography>
      </Box>

      {/* Trust signals */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5, flexWrap: 'wrap' }}>
        {AUTH_TRUST_SIGNALS.map((signal, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ color: vigiaColors.textTertiary, display: 'flex', alignItems: 'center' }}>
              {getFeatureIcon(signal.icon, { fontSize: 14, color: 'inherit' })}
            </Box>
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.7rem',
                color: vigiaColors.textTertiary,
              }}
            >
              {signal.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </AuthTemplate>
  );
};

export default LoginPage;
