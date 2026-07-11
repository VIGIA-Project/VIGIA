import React, { useState } from 'react';
<<<<<<< Updated upstream
import { Typography } from '@mui/material';
import { DashboardTemplate } from '../../components/templates';
import { NotificationList } from '../../components/organisms';
import { NotificacionViewDto } from '../../components/molecules/NotificationItem';
import { Severidad } from '@vigia/shared-types';
=======
import { Box, Typography, Button, Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { EmptyState } from '../../components/atoms';
import { AlertCard, FilterChips } from '../../components/molecules';
import { staggerContainer, fadeInUp } from '../../config/animations.config';
import { vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';
import { useQuery } from '@tanstack/react-query';
import { getActiveAlerts, Alert as ServiceAlert } from '../../services/alerting.service';
>>>>>>> Stashed changes

const MOCK_ALERTAS: NotificacionViewDto[] = [
    {
        alerta_id: 'al-101',
        severidad: Severidad.ALTA,
        mensaje_resumen: 'Acceso denegado reiterado — vehículo PBW-1234 en Acceso Norte',
        causa_origen: '3 intentos fallidos en 10 minutos',
        estado_atencion: 'PENDIENTE',
        hace: 'hace 2h',
    },
    {
        alerta_id: 'al-102',
        severidad: Severidad.ALTA,
        mensaje_resumen: 'Intento de acceso con placa no registrada asociada a su cuenta',
        causa_origen: 'Placa PZZ-9999 no existe en el sistema',
        estado_atencion: 'PENDIENTE',
        hace: 'hace 5h',
    },
    {
        alerta_id: 'al-103',
        severidad: Severidad.MEDIA,
        mensaje_resumen: 'Permiso Temporal próximo a expirar — vehículo PBB-3456',
        causa_origen: 'Vigencia finaliza en 4 horas',
        estado_atencion: 'PENDIENTE',
        hace: 'hace 8h',
    },
    {
        alerta_id: 'al-104',
        severidad: Severidad.MEDIA,
        mensaje_resumen: 'Pase de Acceso Rápido consumido correctamente',
        causa_origen: 'Acceso Sur — PBA-5678',
        estado_atencion: 'LEIDA',
        hace: 'hace 1d',
    },
    {
        alerta_id: 'al-105',
        severidad: Severidad.INFORMATIVA,
        mensaje_resumen: 'Validación biométrica exitosa registrada',
        causa_origen: 'Acceso Norte — PBW-1234',
        estado_atencion: 'LEIDA',
        hace: 'hace 2d',
    },
    {
        alerta_id: 'al-106',
        severidad: Severidad.INFORMATIVA,
        mensaje_resumen: 'Actualización de datos de vehículo registrada',
        causa_origen: 'Cambio de color — PBA-5678',
        estado_atencion: 'ARCHIVADA',
        hace: 'hace 3d',
    },
];

export const AlertasPage: React.FC = () => {
    const [alertas, setAlertas] = useState<NotificacionViewDto[]>(MOCK_ALERTAS);

    const handleMarcarLeida = (alertaId: string) => {
        setAlertas((prev) =>
            prev.map((n) => (n.alerta_id === alertaId ? { ...n, estado_atencion: 'LEIDA' } : n))
        );
    };

    const handleArchivar = (alertaId: string) => {
        setAlertas((prev) =>
            prev.map((n) => (n.alerta_id === alertaId ? { ...n, estado_atencion: 'ARCHIVADA' } : n))
        );
    };

<<<<<<< Updated upstream
    return (
        <DashboardTemplate
            rol="PROPIETARIO"
            pageTitle="Mis Alertas"
            notificationCount={2}
            userInitials="AC"
        >
            <Typography
                variant="h5"
                sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, color: '#0A2F86', mb: 3 }}
            >
                Centro de Alertas
            </Typography>

            <NotificationList
                notificaciones={alertas}
                onMarcarLeida={handleMarcarLeida}
                onArchivar={handleArchivar}
            />
        </DashboardTemplate>
    );
=======
// === MOCK DATA DEPRECATED ===
// We now map real alerts from getActiveAlerts
const mapAlertToOwnerView = (alert: ServiceAlert): AlertaViewDto => ({
  alerta_id: alert.id,
  tipo: alert.alertType,
  severidad: alert.alertType === 'error' ? 'ALTA' : (alert.alertType === 'warning' ? 'MEDIA' : 'INFORMATIVA'),
  titulo: alert.alertTitle,
  descripcion: alert.alertDescription,
  fecha: new Date(alert.createdAt).toLocaleString(),
  timestamp_relativo: new Date(alert.createdAt).toLocaleTimeString(),
  leida: alert.status === 'RESOLVED',
  vehiculo_placa: undefined,
  accion_sugerida: 'Ver detalle'
});

// === FILTROS ===
const FILTER_OPTIONS = [
  { key: 'TODAS', label: 'Todas' },
  { key: 'ALTA', label: '🔴 Alta' },
  { key: 'MEDIA', label: '🟡 Media' },
  { key: 'INFORMATIVA', label: '🔵 Informativa' },
  { key: 'NO_LEIDAS', label: '● No leídas' },
];

// === HELPERS ===
const getSeverityIcon = (severidad: Severidad): React.ReactNode => {
  switch (severidad) {
    case 'ALTA':
      return <ErrorIcon sx={{ fontSize: 24, color: vigiaColors.error }} />;
    case 'MEDIA':
      return <WarningAmberIcon sx={{ fontSize: 24, color: vigiaColors.warning }} />;
    case 'INFORMATIVA':
      return <InfoOutlinedIcon sx={{ fontSize: 24, color: vigiaColors.primary }} />;
  }
};

const mapSeverityToAlertCard = (severidad: Severidad): 'alta' | 'media' | 'informativa' => {
  return severidad.toLowerCase() as 'alta' | 'media' | 'informativa';
};

// === COMPONENTE PRINCIPAL ===
const AlertasPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Estado
  const { data: realAlerts = [], isLoading } = useQuery({
    queryKey: ['activeAlerts'],
    queryFn: getActiveAlerts,
    refetchInterval: 5000,
  });

  const [alertasLocal, setAlertasLocal] = useState<AlertaViewDto[]>([]);
  
  // Sincronizar query con estado local si queremos permitir "marcar como leída" localmente
  React.useEffect(() => {
    if (realAlerts.length > 0) {
      setAlertasLocal(realAlerts.map(mapAlertToOwnerView));
    }
  }, [realAlerts]);

  const [filtroActivo, setFiltroActivo] = useState('TODAS');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Filtrado
  const alertasFiltradas = alertasLocal.filter((a) => {
    if (filtroActivo === 'TODAS') return true;
    if (filtroActivo === 'NO_LEIDAS') return !a.leida;
    return a.severidad === filtroActivo;
  });

  const noLeidas = alertasLocal.filter((a) => !a.leida).length;

  // Handlers
  const handleMarcarLeida = (id: string) => {
    setAlertasLocal((prev) =>
      prev.map((a) => (a.alerta_id === id ? { ...a, leida: true } : a))
    );
    setSnackbar({ open: true, message: 'Alerta marcada como leída' });
  };

  const handleMarcarTodasLeidas = () => {
    setAlertasLocal((prev) => prev.map((a) => ({ ...a, leida: true })));
    setSnackbar({ open: true, message: 'Todas las alertas marcadas como leídas' });
  };

  const handleAccion = (alerta: AlertaViewDto) => {
    setSnackbar({ open: true, message: `Acción: ${alerta.accion_sugerida} — ${alerta.vehiculo_placa || 'sin vehículo'}` });
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
                    {' '}sin leer de {alertasLocal.length} totales
                  </>
                ) : (
                  `${alertasLocal.length} alertas · Todas leídas ✓`
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

        {/* Resumen de atención + Acciones recomendadas */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: `${vigiaSpacing.cardGap}px` }}>
            <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', p: 2.25 }}>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#0F172A', mb: 1.5 }}>
                Resumen de atención
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {RESUMEN_ATENCION.map((item) => (
                  <Box key={item.text} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.icon}
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', color: vigiaColors.textBody }}>
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ borderRadius: vigiaRadius.lg, border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', p: 2.25 }}>
              <Typography sx={{ fontFamily: '"Exo 2", sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#0F172A', mb: 1.5 }}>
                Acciones recomendadas
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {ACCIONES_RECOMENDADAS.map((accion) => (
                  <Box
                    key={accion.text}
                    onClick={() => navigate(accion.route)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderLeft: `3px solid ${vigiaColors.primary}`,
                      borderRadius: '8px',
                      p: 2,
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 1px 2px rgba(10,47,134,0.04)',
                      transition: 'background-color 0.15s ease',
                      '&:hover': { backgroundColor: 'rgba(13,92,207,0.04)' },
                    }}
                  >
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', fontWeight: 500, color: vigiaColors.textBody }}>
                      {accion.text}
                    </Typography>
                    <ChevronRightIcon sx={{ fontSize: 18, color: vigiaColors.primary }} />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Filtros con FilterChips */}
        <FilterChips
          options={FILTER_OPTIONS}
          activeKey={filtroActivo}
          onChange={setFiltroActivo}
        />

        {/* Lista de alertas o EmptyState */}
        {alertasFiltradas.length === 0 ? (
          <EmptyState
            titulo="Sin alertas"
            descripcion={
              filtroActivo === 'TODAS'
                ? 'No hay alertas registradas en el sistema.'
                : `No hay alertas con el filtro "${FILTER_OPTIONS.find((f) => f.key === filtroActivo)?.label}" aplicado.`
            }
            icono={<NotificationsOffIcon sx={{ fontSize: 64, color: '#E0E3E8' }} />}
          />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${vigiaSpacing.element}px` }}>
              {alertasFiltradas.map((alerta) => (
                <AlertCard
                  key={alerta.alerta_id}
                  icon={getSeverityIcon(alerta.severidad)}
                  title={alerta.titulo}
                  description={alerta.descripcion}
                  timestamp={alerta.timestamp_relativo}
                  severity={mapSeverityToAlertCard(alerta.severidad)}
                  isRead={alerta.leida}
                  actions={[
                    ...(!alerta.leida
                      ? [{ label: 'Marcar leída', onClick: () => handleMarcarLeida(alerta.alerta_id) }]
                      : []),
                    ...(alerta.accion_sugerida
                      ? [{ label: alerta.accion_sugerida, onClick: () => handleAccion(alerta) }]
                      : []),
                  ]}
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
>>>>>>> Stashed changes
};

export default AlertasPage;
