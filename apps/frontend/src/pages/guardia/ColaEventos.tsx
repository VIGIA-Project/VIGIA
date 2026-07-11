import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, Paper, useTheme, useMediaQuery, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { EventQueueCard } from '../../components/molecules';
import { fadeInUp, staggerContainer } from '../../config/animations.config';
import { vigiaRadius, vigiaColors } from '../../theme/vigia-theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useQuery } from '@tanstack/react-query';
import { accessControlService } from '../../services/access-control.service';



export const ColaEventosPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [filterTipo, setFilterTipo] = useState('Todos');
  const [filterMotivo, setFilterMotivo] = useState('Todos');
  const [sortOrder, setSortOrder] = useState('MasAntiguo');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const { data: eventosRaw = [] } = useQuery({
    queryKey: ['eventos', 'cola', 'guardia'],
    queryFn: () => accessControlService.obtenerEventosRecientes(50)
  });

  const colaEvents = eventosRaw
    .filter((e: any) => e.decision !== 'SUCCESSFUL')
    .map((e: any) => ({
      id: e.id,
      placa: e.placaCapturada || 'S/N',
      timeAgo: 'Reciente',
      timeAgoUrgent: e.decision === 'DENIED',
      direction: 'ENTRADA' as const, // We don't have direction in standard event yet
      timestamp: new Date(e.timestampEvento || e.createdAt || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      alertTitle: e.origenResolucion || 'REVISIÓN MANUAL',
      alertDescription: e.detalles || 'El evento requiere atención del guardia',
      alertType: e.decision === 'DENIED' ? 'error' as const : 'warning' as const,
      vehiculo: 'Desconocido',
      propietario: 'Desconocido',
      _timestampRaw: new Date(e.timestampEvento || e.createdAt || new Date()).getTime()
    }));

  // Simple filtering and sorting logic
  const filteredEvents = colaEvents.filter((event: any) => {
    // Tipo Filter
    if (filterTipo !== 'Todos' && event.direction !== filterTipo.toUpperCase()) return false;
    
    // Motivo Filter
    if (filterMotivo !== 'Todos' && event.alertTitle !== filterMotivo) return false;
    
    return true;
  }).sort((a: any, b: any) => {
    // Basic mock sort logic (by ID since it matches antiquity here)
    if (sortOrder === 'MasAntiguo') return a._timestampRaw - b._timestampRaw;
    return b._timestampRaw - a._timestampRaw; // MasReciente
  });

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Cola de Pendientes">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Header Section */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ color: '#0A2F86', mb: 1, fontWeight: 800, fontFamily: '"Exo 2", sans-serif' }}>
                Cola de Pendientes (PENDING_VERIFY)
              </Typography>
              <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif' }}>
                Resuelve los casos retenidos por el sistema. Ordenados por antigüedad.
              </Typography>
            </Box>

            {/* Top Indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#FFFBEB', px: 2, py: 1, borderRadius: vigiaRadius.full, border: '1px solid #FDE68A' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#D97706' }} />
              <Typography sx={{ color: '#B45309', fontWeight: 700, fontSize: '0.85rem' }}>{filteredEvents.length} Pendientes Ahora</Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Filters Section */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: vigiaRadius.md,
              border: '1px solid rgba(0,0,0,0.08)',
              backgroundColor: vigiaColors.white,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 3,
              alignItems: 'center',
            }}
          >
            <FormControl fullWidth size="small" variant="outlined" sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: vigiaColors.textSecondary, mb: 0.5, fontFamily: '"Inter", sans-serif' }}>
                Tipo de Movimiento
              </Typography>
              <Select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                IconComponent={ExpandMoreIcon}
                sx={{
                  borderRadius: vigiaRadius.sm,
                  backgroundColor: '#FAFBFC',
                  fontSize: '0.875rem',
                  fontFamily: '"Inter", sans-serif',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.2)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#11A9D6', borderWidth: 1 },
                }}
              >
                <MenuItem value="Todos" sx={{ fontFamily: '"Inter", sans-serif' }}>Todos</MenuItem>
                <MenuItem value="ENTRADA" sx={{ fontFamily: '"Inter", sans-serif' }}>ENTRADA</MenuItem>
                <MenuItem value="SALIDA" sx={{ fontFamily: '"Inter", sans-serif' }}>SALIDA</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" variant="outlined" sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: vigiaColors.textSecondary, mb: 0.5, fontFamily: '"Inter", sans-serif' }}>
                Motivo de Pendiente
              </Typography>
              <Select
                value={filterMotivo}
                onChange={(e) => setFilterMotivo(e.target.value)}
                IconComponent={ExpandMoreIcon}
                sx={{
                  borderRadius: vigiaRadius.sm,
                  backgroundColor: '#FAFBFC',
                  fontSize: '0.875rem',
                  fontFamily: '"Inter", sans-serif',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.2)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#11A9D6', borderWidth: 1 },
                }}
              >
                <MenuItem value="Todos" sx={{ fontFamily: '"Inter", sans-serif' }}>Todos</MenuItem>
                <MenuItem value="SIN_PERFILES_BIOMETRICOS" sx={{ fontFamily: '"Inter", sans-serif' }}>SIN_PERFILES_BIOMETRICOS</MenuItem>
                <MenuItem value="EVIDENCIA_INSUFICIENTE" sx={{ fontFamily: '"Inter", sans-serif' }}>EVIDENCIA_INSUFICIENTE</MenuItem>
                <MenuItem value="FALLO_OCR" sx={{ fontFamily: '"Inter", sans-serif' }}>FALLO_OCR</MenuItem>
                <MenuItem value="FALLO_BIOMETRICO" sx={{ fontFamily: '"Inter", sans-serif' }}>FALLO_BIOMETRICO</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" variant="outlined" sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: vigiaColors.textSecondary, mb: 0.5, fontFamily: '"Inter", sans-serif' }}>
                Ordenar por
              </Typography>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                IconComponent={ExpandMoreIcon}
                sx={{
                  borderRadius: vigiaRadius.sm,
                  backgroundColor: '#FAFBFC',
                  fontSize: '0.875rem',
                  fontFamily: '"Inter", sans-serif',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.2)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#11A9D6', borderWidth: 1 },
                }}
              >
                <MenuItem value="MasAntiguo" sx={{ fontFamily: '"Inter", sans-serif' }}>Más antiguo primero (Default)</MenuItem>
                <MenuItem value="MasReciente" sx={{ fontFamily: '"Inter", sans-serif' }}>Más reciente primero</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </motion.div>

        {/* Grid of Cards */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          {filteredEvents.length > 0 ? (
            <Grid container spacing={3}>
              {filteredEvents.map((event: any) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <EventQueueCard
                    {...event}
                    onReview={() => navigate('/guardia/revision-manual')}
                    onClickDetails={() => setSelectedEvent(event)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
             <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#FAFBFC', borderRadius: vigiaRadius.md, border: '1px dashed rgba(0,0,0,0.1)' }}>
               <Typography sx={{ color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif' }}>La cola de pendientes está vacía.</Typography>
             </Box>
          )}
        </motion.div>

        {/* Modal / Dialog de Detalles */}
        <Dialog 
          open={Boolean(selectedEvent)} 
          onClose={() => setSelectedEvent(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: vigiaRadius.lg, border: '1px solid rgba(0,0,0,0.1)' } }}
        >
          {selectedEvent && (
            <>
              <DialogTitle sx={{ m: 0, p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#0A2F86', fontFamily: '"Exo 2", sans-serif', fontSize: '1.4rem' }}>
                    Detalle del Evento
                  </Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif' }}>
                    {selectedEvent.timestamp} • {selectedEvent.timeAgo}
                  </Typography>
                </Box>
                <IconButton onClick={() => setSelectedEvent(null)} sx={{ color: vigiaColors.textSecondary }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  
                  {/* Placa y Movimiento */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1, backgroundColor: '#F3F4F6', p: 2, borderRadius: vigiaRadius.sm, textAlign: 'center' }}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: vigiaColors.textSecondary, letterSpacing: 0.5, mb: 0.5 }}>PLACA</Typography>
                      <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: '"Exo 2", sans-serif', color: '#1F2937', letterSpacing: 2 }}>
                        {selectedEvent.placa}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, backgroundColor: selectedEvent.direction === 'ENTRADA' ? 'rgba(17,169,214,0.1)' : '#F3F4F6', p: 2, borderRadius: vigiaRadius.sm, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                       <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: vigiaColors.textSecondary, letterSpacing: 0.5, mb: 0.5 }}>MOVIMIENTO</Typography>
                       <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: '"Inter", sans-serif', color: selectedEvent.direction === 'ENTRADA' ? '#11A9D6' : '#6B7280' }}>
                         {selectedEvent.direction}
                       </Typography>
                    </Box>
                  </Box>

                  {/* Motivo de la Alerta */}
                  <Box sx={{ backgroundColor: selectedEvent.alertType === 'error' ? '#FEF2F2' : '#FFFBEB', p: 2, borderRadius: vigiaRadius.sm, borderLeft: `4px solid ${selectedEvent.alertType === 'error' ? '#DC2626' : '#F2B51F'}` }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: selectedEvent.alertType === 'error' ? '#B91C1C' : '#B45309', letterSpacing: 0.5, mb: 0.5 }}>
                      MOTIVO DEL EVENTO
                    </Typography>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: selectedEvent.alertType === 'error' ? '#991B1B' : '#92400E', fontFamily: '"Inter", sans-serif', mb: 0.5 }}>
                      {selectedEvent.alertTitle}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: selectedEvent.alertType === 'error' ? '#DC2626' : '#D97706', fontFamily: '"Inter", sans-serif' }}>
                      {selectedEvent.alertDescription}
                    </Typography>
                  </Box>

                  {/* Contexto del Vehículo */}
                  <Box sx={{ p: 2, borderRadius: vigiaRadius.sm, border: '1px solid rgba(0,0,0,0.1)' }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: vigiaColors.textSecondary, letterSpacing: 0.5, mb: 2 }}>
                      CONTEXTO REGISTRADO
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.75rem', color: vigiaColors.textSecondary, mb: 0.5 }}>Vehículo</Typography>
                        <Typography sx={{ fontWeight: 600, color: vigiaColors.textBody }}>{selectedEvent.vehiculo}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ fontSize: '0.75rem', color: vigiaColors.textSecondary, mb: 0.5 }}>Propietario / Autorizado</Typography>
                        <Typography sx={{ fontWeight: 600, color: vigiaColors.textBody }}>{selectedEvent.propietario}</Typography>
                      </Grid>
                    </Grid>
                  </Box>

                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 2, display: 'flex', gap: 2 }}>
                <Button 
                  onClick={() => setSelectedEvent(null)}
                  variant="outlined"
                  sx={{ flex: 1, borderColor: 'rgba(0,0,0,0.15)', color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif', fontWeight: 600 }}
                >
                  Cerrar
                </Button>
                <Button 
                  onClick={() => navigate('/guardia/revision-manual')}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    flex: 1, 
                    backgroundColor: '#0D5CCF', 
                    color: 'white', 
                    fontFamily: '"Inter", sans-serif', 
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#0A2F86' }
                  }}
                >
                  Pasar a Resolución
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

      </Box>
    </DashboardTemplate>
  );
};

export default ColaEventosPage;
