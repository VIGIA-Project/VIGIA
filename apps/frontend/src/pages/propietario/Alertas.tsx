import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { EmptyState } from '../../components/atoms';
import { AlertCard, FilterChips } from '../../components/molecules';
import { useQuery } from '@tanstack/react-query';
import { alertingService } from '../../services/alerting.service';
import { staggerContainer, fadeInUp } from '../../config/animations.config';
import { vigiaRadius, vigiaColors, vigiaSpacing } from '../../theme/vigia-theme';

// Icons
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';



// === TIPOS ===
type Severidad = 'ALTA' | 'MEDIA' | 'INFORMATIVA';

interface AlertaViewDto {
  alerta_id: string;
  tipo: string;
  severidad: Severidad;
  titulo: string;
  descripcion: string;
  fecha: string;
  timestamp_relativo: string;
  leida: boolean;
  vehiculo_placa?: string;
  accion_sugerida?: string;
}

// === MOCK DATA REMOVED ===

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
  const [alertas, setAlertas] = React.useState<AlertaViewDto[]>([]);
  const [filtroActivo, setFiltroActivo] = useState('TODAS');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const { data: rawAlertas = [] } = useQuery({
    queryKey: ['alertas', 'recientes'],
    queryFn: () => alertingService.obtenerAlertasRecientes(50)
  });

  React.useEffect(() => {
    if (rawAlertas && rawAlertas.length > 0) {
      setAlertas(rawAlertas.map((a: any) => ({
        alerta_id: a.id || a.alerta_id || Math.random().toString(),
        tipo: a.tipo || 'INFORMATIVA',
        severidad: a.severidad || 'INFORMATIVA',
        titulo: a.titulo || 'Alerta',
        descripcion: a.descripcion || '',
        fecha: a.createdAt || a.fechaCreacion || new Date().toISOString(),
        timestamp_relativo: 'Reciente',
        leida: a.leida || false,
        vehiculo_placa: a.placa || a.vehiculo_placa,
        accion_sugerida: a.accion_sugerida
      })));
    } else {
      setAlertas([]);
    }
  }, [rawAlertas]);

  // Filtrado
  const alertasFiltradas = alertas.filter((a) => {
    if (filtroActivo === 'TODAS') return true;
    if (filtroActivo === 'NO_LEIDAS') return !a.leida;
    return a.severidad === filtroActivo;
  });

  const noLeidas = alertas.filter((a) => !a.leida).length;

  // Calculos dinamicos para Resumen de Atencion
  const alertasAlta = alertas.filter(a => a.severidad === 'ALTA' && !a.leida).length;
  const alertasMedia = alertas.filter(a => a.severidad === 'MEDIA' && !a.leida).length;
  const alertasInformativa = alertas.filter(a => a.severidad === 'INFORMATIVA' && !a.leida).length;

  const resumenAtencion = [
    { icon: <ReportGmailerrorredIcon sx={{ fontSize: 20, color: vigiaColors.error }} />, text: `${alertasAlta} alerta(s) de alta prioridad` },
    { icon: <EventBusyOutlinedIcon sx={{ fontSize: 20, color: vigiaColors.warning }} />, text: `${alertasMedia} alerta(s) de media prioridad` },
    { icon: <InfoOutlinedIcon sx={{ fontSize: 20, color: vigiaColors.primary }} />, text: `${alertasInformativa} notificaciones informativas` },
  ].filter(item => parseInt(item.text.split(' ')[0]) > 0);

  if (resumenAtencion.length === 0) {
    resumenAtencion.push({ icon: <DoneAllIcon sx={{ fontSize: 20, color: vigiaColors.primary }} />, text: 'Todo está al día' });
  }

  // Calculos dinamicos para Acciones Recomendadas
  const accionesRecomendadas = alertas
    .filter(a => a.accion_sugerida && !a.leida)
    .slice(0, 3)
    .map(a => ({
      text: `${a.accion_sugerida} - ${a.vehiculo_placa || a.titulo}`,
      route: a.tipo === 'ACCESO' ? '/propietario/historial' : '/propietario/alertas'
    }));

  if (accionesRecomendadas.length === 0) {
    accionesRecomendadas.push({ text: 'Ninguna acción pendiente', route: '#' });
  }

  // Handlers
  const handleMarcarLeida = (id: string) => {
    setAlertas((prev) =>
      prev.map((a) => (a.alerta_id === id ? { ...a, leida: true } : a))
    );
    setSnackbar({ open: true, message: 'Alerta marcada como leída' });
  };

  const handleMarcarTodasLeidas = () => {
    setAlertas((prev) => prev.map((a) => ({ ...a, leida: true })));
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
                    {' '}sin leer de {alertas.length} totales
                  </>
                ) : (
                  `${alertas.length} alertas · Todas leídas ✓`
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
                {resumenAtencion.map((item) => (
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
                {accionesRecomendadas.map((accion) => (
                  <Box
                    key={accion.text}
                    onClick={() => accion.route !== '#' && navigate(accion.route)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: accion.route !== '#' ? 'pointer' : 'default',
                      borderLeft: `3px solid ${vigiaColors.primary}`,
                      borderRadius: '8px',
                      p: 2,
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 1px 2px rgba(10,47,134,0.04)',
                      transition: 'background-color 0.15s ease',
                      '&:hover': { backgroundColor: accion.route !== '#' ? 'rgba(13,92,207,0.04)' : '#FFFFFF' },
                    }}
                  >
                    <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', fontWeight: 500, color: vigiaColors.textBody }}>
                      {accion.text}
                    </Typography>
                    {accion.route !== '#' && <ChevronRightIcon sx={{ fontSize: 18, color: vigiaColors.primary }} />}
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
};

export { AlertasPage };
export default AlertasPage;
