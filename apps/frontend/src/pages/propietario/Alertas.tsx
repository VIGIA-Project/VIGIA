import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { EmptyState } from '../../components/atoms';
import { AlertCard, FilterChips } from '../../components/molecules';
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
import FingerprintOutlinedIcon from '@mui/icons-material/FingerprintOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// === RESUMEN DE ATENCIÓN (mock) ===
const RESUMEN_ATENCION = [
  { icon: <ReportGmailerrorredIcon sx={{ fontSize: 20, color: vigiaColors.error }} />, text: '1 acceso denegado reciente' },
  { icon: <EventBusyOutlinedIcon sx={{ fontSize: 20, color: vigiaColors.warning }} />, text: '1 pase expirado sin usar' },
  { icon: <FingerprintOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />, text: '1 persona con biometría pendiente' },
];

const ACCIONES_RECOMENDADAS = [
  { text: 'Revise permisos de PBW-1234', route: '/propietario/permisos-temporales' },
  { text: 'Coordine biometría de Stalin Coello', route: '/propietario/personas' },
  { text: 'Renueve permiso de Jorge Mendoza', route: '/propietario/permisos-temporales' },
];

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

// === MOCK DATA ===
const MOCK_ALERTAS: AlertaViewDto[] = [
  {
    alerta_id: 'alt-001',
    tipo: 'ACCESO_DENEGADO',
    severidad: 'ALTA',
    titulo: 'Intento de acceso no autorizado',
    descripcion: 'Persona no registrada intentó ingresar con el vehículo PBW-1234 por Acceso Sur. Se activó protocolo de seguridad.',
    fecha: '2026-07-04T02:15:00',
    timestamp_relativo: 'hace 2h',
    leida: false,
    vehiculo_placa: 'PBW-1234',
    accion_sugerida: 'Ver vehículo',
  },
  {
    alerta_id: 'alt-002',
    tipo: 'PERMISO_POR_EXPIRAR',
    severidad: 'MEDIA',
    titulo: 'Permiso temporal próximo a expirar',
    descripcion: 'El permiso de Jorge Mendoza para el vehículo PBB-3456 expira en 4 horas. Renueve si desea mantener el acceso.',
    fecha: '2026-07-04T01:30:00',
    timestamp_relativo: 'hace 3h',
    leida: false,
    vehiculo_placa: 'PBB-3456',
    accion_sugerida: 'Renovar permiso',
  },
  {
    alerta_id: 'alt-003',
    tipo: 'ENROLLMENT_PENDIENTE',
    severidad: 'MEDIA',
    titulo: 'Enrollment biométrico pendiente',
    descripcion: 'Stalin Coello aún no ha completado su enrollment biométrico. Sin enrollment, la validación será solo por placa.',
    fecha: '2026-07-03T18:00:00',
    timestamp_relativo: 'hace 10h',
    leida: false,
    vehiculo_placa: undefined,
    accion_sugerida: 'Ver personas',
  },
  {
    alerta_id: 'alt-004',
    tipo: 'ACCESO_EXITOSO',
    severidad: 'INFORMATIVA',
    titulo: 'Acceso autorizado registrado',
    descripcion: 'María Elena Arévalo ingresó exitosamente con PBW-1234 por Acceso Norte. Validación biométrica correcta.',
    fecha: '2026-07-03T14:32:00',
    timestamp_relativo: 'ayer 14:32',
    leida: true,
    vehiculo_placa: 'PBW-1234',
    accion_sugerida: undefined,
  },
  {
    alerta_id: 'alt-005',
    tipo: 'PASE_CONSUMIDO',
    severidad: 'INFORMATIVA',
    titulo: 'Pase de Acceso Rápido consumido',
    descripcion: 'El pase VIG-A7K3M2 fue utilizado por Jorge Mendoza. Ingreso por Acceso Norte a las 09:15.',
    fecha: '2026-07-03T09:15:00',
    timestamp_relativo: 'ayer 09:15',
    leida: true,
    vehiculo_placa: 'PBW-1234',
    accion_sugerida: undefined,
  },
  {
    alerta_id: 'alt-006',
    tipo: 'VEHICULO_NO_RECONOCIDO',
    severidad: 'ALTA',
    titulo: 'Vehículo no reconocido detectado',
    descripcion: 'Se detectó el vehículo con placa PZZ-9999 (no registrado) intentando acceder por Acceso Sur. Sin coincidencia en el sistema.',
    fecha: '2026-07-02T22:45:00',
    timestamp_relativo: 'hace 2 días',
    leida: true,
    vehiculo_placa: 'PZZ-9999',
    accion_sugerida: 'Ver detalle',
  },
];

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
  const [alertas, setAlertas] = useState<AlertaViewDto[]>(MOCK_ALERTAS);
  const [filtroActivo, setFiltroActivo] = useState('TODAS');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // Filtrado
  const alertasFiltradas = alertas.filter((a) => {
    if (filtroActivo === 'TODAS') return true;
    if (filtroActivo === 'NO_LEIDAS') return !a.leida;
    return a.severidad === filtroActivo;
  });

  const noLeidas = alertas.filter((a) => !a.leida).length;

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
};

export { AlertasPage };
export default AlertasPage;
