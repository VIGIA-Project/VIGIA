import React, { useMemo, useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { EmptyState, LoadingSkeleton, ErrorState } from '../../components/atoms';
import { AlertCard, FilterChips } from '../../components/molecules';
import { staggerContainer, fadeInUp } from '../../config/animations.config';
import { vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';
import { useNotificaciones, useMarcarNotificacionLeida } from '../../hooks/useNotifications';
import { Notificacion } from '../../services/types/admin.types';

// Icons
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import DoneAllIcon from '@mui/icons-material/DoneAll';

/** Tiempo relativo en español — mismo criterio que NotificationBell e Inicio. */
const tiempoRelativo = (iso?: string): string => {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutos = Math.round(diffMs / 60000);
  if (minutos < 1) return 'ahora';
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  return `hace ${Math.round(horas / 24)} d`;
};

/**
 * El backend no expone severidad por notificación (solo la Alerta origen la
 * tiene, y ese endpoint no está filtrado por destinatario). Se infiere una
 * severidad visual a partir de palabras clave del título — es una heurística
 * de presentación, no un dato inventado.
 */
type SeveridadVisual = 'alta' | 'media' | 'informativa';

const inferirSeveridad = (n: Notificacion): SeveridadVisual => {
  const texto = n.titulo.toLowerCase();
  if (texto.includes('denegado') || texto.includes('no autorizado') || texto.includes('no reconocido')) return 'alta';
  if (texto.includes('expira') || texto.includes('pendiente') || texto.includes('excedi')) return 'media';
  return 'informativa';
};

const getSeverityIcon = (severidad: SeveridadVisual): React.ReactNode => {
  switch (severidad) {
    case 'alta':
      return <ErrorIcon sx={{ fontSize: 24, color: vigiaColors.error }} />;
    case 'media':
      return <WarningAmberIcon sx={{ fontSize: 24, color: vigiaColors.warning }} />;
    case 'informativa':
      return <InfoOutlinedIcon sx={{ fontSize: 24, color: vigiaColors.primary }} />;
  }
};

const FILTER_OPTIONS = [
  { key: 'TODAS', label: 'Todas' },
  { key: 'NO_LEIDAS', label: '● No leídas' },
  { key: 'ALTA', label: '🔴 Alta' },
  { key: 'MEDIA', label: '🟡 Media' },
  { key: 'INFORMATIVA', label: '🔵 Informativa' },
];

const AlertasPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const notificacionesQuery = useNotificaciones();
  const marcarLeidaMutation = useMarcarNotificacionLeida();

  const [filtroActivo, setFiltroActivo] = useState('TODAS');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const notificaciones = notificacionesQuery.data ?? [];

  const notificacionesFiltradas = useMemo(() => {
    return notificaciones.filter((n) => {
      if (filtroActivo === 'TODAS') return true;
      if (filtroActivo === 'NO_LEIDAS') return !n.leida;
      return inferirSeveridad(n) === filtroActivo.toLowerCase();
    });
  }, [notificaciones, filtroActivo]);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  const handleMarcarLeida = (id: string) => {
    marcarLeidaMutation.mutate(id, {
      onSuccess: () => setSnackbar({ open: true, message: 'Notificación marcada como leída' }),
      onError: () => setSnackbar({ open: true, message: 'No se pudo marcar como leída' }),
    });
  };

  const handleMarcarTodasLeidas = () => {
    const pendientes = notificaciones.filter((n) => !n.leida);
    pendientes.forEach((n) => marcarLeidaMutation.mutate(n.notificacionId));
    setSnackbar({ open: true, message: 'Todas las notificaciones marcadas como leídas' });
  };

  return (
    <DashboardTemplate rol="OWNER" pageTitle="Mis Alertas">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.section}px` }}>

        {/* Header con contador y acción masiva */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 1.5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Exo 2", sans-serif',
                  fontWeight: 600,
                  fontSize: '1.25rem',
                  color: vigiaColors.textHeading,
                }}
              >
                Mis Alertas
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.8rem',
                  color: vigiaColors.textSecondary,
                  mt: 0.25,
                }}
              >
                {noLeidas > 0 ? (
                  <>
                    <Box component="span" sx={{ fontWeight: 600, color: vigiaColors.error }}>
                      {noLeidas}
                    </Box>
                    {' '}sin leer de {notificaciones.length} totales
                  </>
                ) : (
                  `${notificaciones.length} alertas · Todas leídas ✓`
                )}
              </Typography>
            </Box>
            {noLeidas > 0 && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<DoneAllIcon />}
                onClick={handleMarcarTodasLeidas}
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  borderColor: 'rgba(13, 92, 207, 0.2)',
                  color: vigiaColors.primary,
                  borderRadius: vigiaRadius.sm,
                  '&:hover': {
                    borderColor: vigiaColors.primary,
                    backgroundColor: 'rgba(13, 92, 207, 0.04)',
                  },
                }}
              >
                Marcar todas como leídas
              </Button>
            )}
          </Box>
        </motion.div>

        {/* Filtros con FilterChips */}
        <FilterChips
          options={FILTER_OPTIONS}
          activeKey={filtroActivo}
          onChange={setFiltroActivo}
        />

        {/* Lista de alertas, loading, error o EmptyState */}
        {notificacionesQuery.isLoading ? (
          <LoadingSkeleton variant="cards" rows={4} />
        ) : notificacionesQuery.isError ? (
          <ErrorState mensaje="No se pudieron cargar tus alertas." onRetry={() => notificacionesQuery.refetch()} />
        ) : notificacionesFiltradas.length === 0 ? (
          <EmptyState
            titulo="Sin alertas"
            descripcion={
              filtroActivo === 'TODAS'
                ? 'No hay alertas registradas para tu cuenta.'
                : `No hay alertas con el filtro "${FILTER_OPTIONS.find((f) => f.key === filtroActivo)?.label}" aplicado.`
            }
            icono={<NotificationsOffIcon sx={{ fontSize: 64, color: '#E0E3E8' }} />}
          />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.element}px` }}>
              {notificacionesFiltradas.map((n) => (
                <AlertCard
                  key={n.notificacionId}
                  icon={getSeverityIcon(inferirSeveridad(n))}
                  title={n.titulo}
                  description={n.contenidoResumen}
                  timestamp={tiempoRelativo(n.enviadaEn)}
                  severity={inferirSeveridad(n)}
                  isRead={n.leida}
                  actions={
                    !n.leida
                      ? [{ label: 'Marcar leída', onClick: () => handleMarcarLeida(n.notificacionId) }]
                      : []
                  }
                />
              ))}
            </Box>
          </motion.div>
        )}
      </Box>

      {/* Snackbar de feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ open: false, message: '' })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardTemplate>
  );
};

export { AlertasPage };
export default AlertasPage;
