import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControl,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { fadeInUp, staggerContainer } from '../../config/animations.config';
import { vigiaRadius, vigiaColors } from '../../theme/vigia-theme';

// Icons
import TimerIcon from '@mui/icons-material/Timer';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { accessControlService } from '../../services/access-control.service';
import { authorizationService } from '../../services/authorization.service';

export const RevisionManualPage: React.FC = () => {
  const navigate = useNavigate();

  const [actionTab, setActionTab] = useState(0);
  const [placaCapturada, setPlacaCapturada] = useState('');
  const [tipoMovimiento, setTipoMovimiento] = useState('ENTRADA');

  // Flow 1: Resolución
  const [estadoFinal, setEstadoFinal] = useState('');
  const [justificacion, setJustificacion] = useState('');

  // Flow 2: Pase Visitante
  const [visitanteTipo, setVisitanteTipo] = useState('');
  const [visitanteNombre, setVisitanteNombre] = useState('');
  const [visitanteDoc, setVisitanteDoc] = useState('');
  const [visitanteDestino, setVisitanteDestino] = useState('');
  const [paseDuracion, setPaseDuracion] = useState('');
  const [visitanteDescripcion, setVisitanteDescripcion] = useState('');

  // Contexto y validación
  const [contextoVehiculo, setContextoVehiculo] = useState<any>(null);
  const [pasesActivos, setPasesActivos] = useState<any[]>([]);
  const [codigoValidacion, setCodigoValidacion] = useState('');
  const [validandoPase, setValidandoPase] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [timeLeft, setTimeLeft] = useState(262); // 04:22 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchContexto = async () => {
      if (placaCapturada.length >= 5) {
        try {
          const vehiculo = await accessControlService.buscarVehiculoPorPlaca(placaCapturada);
          setContextoVehiculo(vehiculo);
          
          const pases = await authorizationService.listarActivosPorPlaca(placaCapturada);
          setPasesActivos(pases || []);
        } catch (err) {
          setContextoVehiculo(null);
          setPasesActivos([]);
        }
      } else {
        setContextoVehiculo(null);
        setPasesActivos([]);
      }
    };
    
    const debounce = setTimeout(fetchContexto, 500);
    return () => clearTimeout(debounce);
  }, [placaCapturada]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleConfirmar = async () => {
    if (!estadoFinal || !justificacion) return;
    setGuardando(true);
    try {
      await accessControlService.registrarEventoManual({
        placaCapturada: placaCapturada || 'DESCONOCIDA',
        tipoMovimiento: tipoMovimiento,
        decision: estadoFinal,
        detalles: justificacion,
        vehiculoId: contextoVehiculo?.id,
        personaId: contextoVehiculo?.propietario?.id,
      });
      navigate('/guardia/cola-eventos');
    } catch (err) {
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  const handleGenerarPase = async () => {
    if (!visitanteTipo || !visitanteNombre || !visitanteDoc || !visitanteDestino || !paseDuracion) return;
    setGuardando(true);
    try {
      const duracionHoras = parseInt(paseDuracion.replace('h', '').replace('m', '')) / (paseDuracion.includes('m') ? 60 : 1);
      await accessControlService.crearPaseGarita({
        placaVehiculo: placaCapturada || 'DESCONOCIDA',
        tipoMovimiento: tipoMovimiento,
        tipoVisitante: visitanteTipo,
        nombreVisitante: visitanteNombre,
        documentoVisitante: visitanteDoc,
        destino: visitanteDestino,
        duracionHoras: duracionHoras,
        descripcion: visitanteDescripcion,
      });
      navigate('/guardia/cola-eventos');
    } catch (err) {
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  const handleValidarCodigo = async () => {
    if (!codigoValidacion) return;
    setValidandoPase(true);
    try {
      const resultado = await authorizationService.validarPase(codigoValidacion, placaCapturada);
      if (resultado.valido && resultado.paseId) {
        await authorizationService.consumirPase(resultado.paseId, 'MANUAL_AUTH');
        await accessControlService.registrarEventoManual({
          placaCapturada: placaCapturada,
          tipoMovimiento: tipoMovimiento,
          decision: 'SUCCESSFUL',
          detalles: `Código de pase rápido ${codigoValidacion} validado correctamente.`,
          vehiculoId: contextoVehiculo?.id,
          personaId: contextoVehiculo?.propietario?.id,
        });
        navigate('/guardia/cola-eventos');
      } else {
        alert(`Código inválido: ${resultado.motivo}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error al validar el código');
    } finally {
      setValidandoPase(false);
    }
  };

  const handleContingencia = () => {
    navigate('/guardia/contingencia');
  };

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Revisión Manual">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Header Section */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" sx={{ color: vigiaColors.textBody, mb: 1, fontWeight: 700, fontFamily: '"Exo 2", sans-serif' }}>
                Resolución Manual
              </Typography>
              <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif' }}>
                Analice la evidencia y determine el estado final de acceso.
              </Typography>
            </Box>
            
            {/* Timer Pill */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: vigiaRadius.full,
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                color: '#D97706',
              }}
            >
              <TimerIcon sx={{ fontSize: '1.2rem' }} />
              <Typography sx={{ fontSize: '1rem', fontWeight: 700, fontFamily: '"Exo 2", sans-serif' }}>
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <Grid container spacing={3}>
            
            {/* LEFT COLUMN: DETAILS */}
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                {/* Placa y Movimiento */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: vigiaRadius.md, border: '1px solid rgba(0,0,0,0.08)', backgroundColor: vigiaColors.white }}>
                  <Grid container spacing={3}>
                    <Grid item xs={8}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: vigiaColors.textSecondary, letterSpacing: 0.5, mb: 1 }}>
                        PLACA DETECTADA
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Escriba la placa..."
                        value={placaCapturada}
                        onChange={(e) => setPlacaCapturada(e.target.value.toUpperCase())}
                        sx={{
                          backgroundColor: '#F3F4F6',
                          '& .MuiOutlinedInput-root': { fontWeight: 800, fontSize: '1.5rem', fontFamily: '"Exo 2", sans-serif', letterSpacing: 2, textAlign: 'center' },
                          '& input': { textAlign: 'center' }
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: vigiaColors.textSecondary, letterSpacing: 0.5, mb: 1 }}>
                        MOVIMIENTO
                      </Typography>
                      <Select
                        fullWidth
                        value={tipoMovimiento}
                        onChange={(e) => setTipoMovimiento(e.target.value)}
                        sx={{
                          backgroundColor: tipoMovimiento === 'ENTRADA' ? '#1E3A8A' : '#475569',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          letterSpacing: 1,
                          height: '56px',
                          '& .MuiSelect-icon': { color: '#FFFFFF' }
                        }}
                        startAdornment={tipoMovimiento === 'ENTRADA' ? <ArrowRightAltIcon sx={{mr:1}}/> : <ArrowBackIcon sx={{mr:1}}/>}
                      >
                        <MenuItem value="ENTRADA">ENTRADA</MenuItem>
                        <MenuItem value="SALIDA">SALIDA</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Alerta y Match */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: vigiaRadius.md, border: '1px solid #FDE68A', backgroundColor: '#FFFBEB' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <WarningAmberIcon sx={{ color: '#D97706', fontSize: '1.5rem' }} />
                      <Typography sx={{ fontWeight: 700, color: '#B45309', fontFamily: '"Inter", sans-serif' }}>
                        EVIDENCIA_INSUFICIENTE
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 800, color: '#D97706', fontFamily: '"Exo 2", sans-serif' }}>
                      65% MATCH
                    </Typography>
                  </Box>
                  
                  <Box sx={{ position: 'relative', pt: 1, pb: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={65} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        backgroundColor: '#FDE68A',
                        '& .MuiLinearProgress-bar': { backgroundColor: '#D97706', borderRadius: 4 }
                      }} 
                    />
                    {/* Umbral Indicator */}
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        left: '85%', 
                        top: 4, 
                        bottom: 0, 
                        width: 2, 
                        backgroundColor: '#DC2626',
                        zIndex: 1
                      }} 
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#B45309', fontWeight: 600 }}>0%</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#DC2626', fontWeight: 700, position: 'absolute', left: '85%', transform: 'translateX(-50%)' }}>
                        UMBRAL 85%
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#B45309', fontWeight: 600 }}>100%</Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Contexto Registrado */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: vigiaRadius.md, border: '1px solid rgba(0,0,0,0.08)', backgroundColor: vigiaColors.white }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <PersonOutlineIcon sx={{ color: vigiaColors.textSecondary }} />
                    <Typography sx={{ fontWeight: 700, color: vigiaColors.textHeading, fontFamily: '"Exo 2", sans-serif', fontSize: '1.1rem' }}>
                      Contexto Registrado
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {contextoVehiculo ? (
                      <>
                        {/* Vehiculo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid rgba(0,0,0,0.05)', borderRadius: vigiaRadius.sm, backgroundColor: '#FAFBFC' }}>
                          <Box sx={{ p: 1, backgroundColor: '#E0E7FF', borderRadius: vigiaRadius.sm, color: '#4F46E5', display: 'flex' }}>
                            <DirectionsCarIcon />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: vigiaColors.textBody, fontSize: '0.9rem' }}>
                              {contextoVehiculo.marca} {contextoVehiculo.modelo}
                            </Typography>
                            <Typography sx={{ color: vigiaColors.textSecondary, fontSize: '0.8rem' }}>
                              {contextoVehiculo.color} • {contextoVehiculo.anio}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Propietario */}
                        {contextoVehiculo.propietario && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid rgba(46,125,50,0.2)', borderRadius: vigiaRadius.sm, backgroundColor: '#F6FBF6' }}>
                            <Box sx={{ p: 1, backgroundColor: '#E8F5E9', borderRadius: vigiaRadius.sm, color: '#2E7D32', display: 'flex' }}>
                              <PersonOutlineIcon />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontWeight: 600, color: vigiaColors.textBody, fontSize: '0.9rem' }}>
                                {contextoVehiculo.propietario.nombres} {contextoVehiculo.propietario.apellidos}
                              </Typography>
                              <Typography sx={{ color: '#2E7D32', fontSize: '0.75rem', fontWeight: 700 }}>
                                PROPIETARIO
                              </Typography>
                            </Box>
                            <CheckCircleIcon sx={{ color: '#2E7D32' }} />
                          </Box>
                        )}
                      </>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid rgba(0,0,0,0.05)', borderRadius: vigiaRadius.sm, backgroundColor: '#FFF5F5' }}>
                        <WarningAmberIcon sx={{ color: '#E53E3E' }} />
                        <Typography sx={{ color: '#E53E3E', fontSize: '0.9rem', fontWeight: 600 }}>
                          Vehículo no registrado en el sistema o placa incompleta.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* RIGHT COLUMN: ACTION */}
            <Grid item xs={12} md={5}>
              <Paper 
                elevation={0} 
                sx={{ 
                  borderRadius: vigiaRadius.md, 
                  border: '1px solid rgba(0,0,0,0.08)', 
                  backgroundColor: '#F8FAFC',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: vigiaColors.white }}>
                  <Tabs
                    value={actionTab}
                    onChange={(_e, newValue) => setActionTab(newValue)}
                    variant="fullWidth"
                    sx={{
                      '& .MuiTab-root': { fontFamily: '"Exo 2", sans-serif', fontWeight: 600, textTransform: 'none', py: 2 },
                      '& .Mui-selected': { color: vigiaColors.primary },
                      '& .MuiTabs-indicator': { backgroundColor: vigiaColors.primary, height: 3 }
                    }}
                  >
                    <Tab label="Resolución" />
                    <Tab label="Pase Visitante" />
                  </Tabs>
                </Box>

                <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  
                  {/* BANNER Y VALIDACIÓN DE PASES ACTIVOS */}
                  {pasesActivos.length > 0 && (
                    <Box sx={{ mb: 3, p: 2, borderRadius: vigiaRadius.md, backgroundColor: '#ECFDF5', border: '1px solid #10B981' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <VpnKeyIcon sx={{ color: '#059669' }} />
                        <Typography sx={{ color: '#065F46', fontWeight: 700, fontFamily: '"Exo 2", sans-serif' }}>
                          Este vehículo tiene {pasesActivos.length} pase(s) rápido(s) activo(s)
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField 
                          size="small" 
                          placeholder="Ingrese el código de pase" 
                          value={codigoValidacion}
                          onChange={(e) => setCodigoValidacion(e.target.value)}
                          sx={{ flex: 1, backgroundColor: vigiaColors.white }}
                        />
                        <Button 
                          variant="contained"
                          disabled={validandoPase || !codigoValidacion}
                          onClick={handleValidarCodigo}
                          sx={{ 
                            backgroundColor: '#059669', 
                            color: 'white',
                            '&:hover': { backgroundColor: '#047857' },
                            fontWeight: 600,
                            textTransform: 'none'
                          }}
                        >
                          {validandoPase ? 'Validando...' : 'Validar Código'}
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {actionTab === 0 ? (
                    // FLOW 1: RESOLUCIÓN ESTÁNDAR
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <GavelIcon sx={{ color: vigiaColors.primary }} />
                        <Typography sx={{ fontWeight: 700, color: vigiaColors.textHeading, fontFamily: '"Exo 2", sans-serif', fontSize: '1.2rem' }}>
                          Decisión de Acceso
                        </Typography>
                      </Box>

                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: vigiaColors.textSecondary, mb: 1, letterSpacing: 0.5 }}>
                          ESTADO FINAL *
                        </Typography>
                        <Select
                          value={estadoFinal}
                          onChange={(e) => setEstadoFinal(e.target.value)}
                          displayEmpty
                          size="small"
                          sx={{
                            backgroundColor: vigiaColors.white,
                            borderRadius: vigiaRadius.sm,
                            fontFamily: '"Inter", sans-serif',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' },
                          }}
                        >
                          <MenuItem value="" disabled sx={{ color: vigiaColors.textTertiary }}>
                            Seleccione estado...
                          </MenuItem>
                          <MenuItem value="PERMITIDO">Acceso Permitido</MenuItem>
                          <MenuItem value="DENEGADO">Acceso Denegado</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 4, flex: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: vigiaColors.textSecondary, mb: 1, letterSpacing: 0.5 }}>
                          JUSTIFICACIÓN TÉCNICA *
                        </Typography>
                        <TextField
                          multiline
                          rows={4}
                          value={justificacion}
                          onChange={(e) => setJustificacion(e.target.value)}
                          placeholder="El conductor coincide visualmente con el perfil registrado..."
                          variant="outlined"
                          sx={{
                            backgroundColor: vigiaColors.white,
                            borderRadius: vigiaRadius.sm,
                            '& .MuiOutlinedInput-root': {
                              fontFamily: '"Inter", sans-serif',
                              fontSize: '0.9rem',
                              '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' },
                            }
                          }}
                        />
                      </FormControl>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleConfirmar}
                          disabled={!estadoFinal || !justificacion || guardando || !placaCapturada}
                          startIcon={<CheckCircleOutlineIcon />}
                          sx={{
                            backgroundColor: '#0A2F86',
                            color: vigiaColors.white,
                            py: 1.5,
                            fontWeight: 600,
                            borderRadius: vigiaRadius.sm,
                            textTransform: 'none',
                            fontFamily: '"Inter", sans-serif',
                            '&:hover': { backgroundColor: '#07205A' },
                            '&.Mui-disabled': { backgroundColor: 'rgba(10, 47, 134, 0.4)', color: 'rgba(255,255,255,0.7)' }
                          }}
                        >
                          {guardando ? 'Guardando...' : 'Confirmar Resolución'}
                        </Button>

                        <Button
                          variant="outlined"
                          onClick={handleContingencia}
                          startIcon={<WarningAmberIcon />}
                          sx={{
                            borderColor: 'rgba(0,0,0,0.15)',
                            color: vigiaColors.textBody,
                            py: 1.5,
                            fontWeight: 600,
                            borderRadius: vigiaRadius.sm,
                            textTransform: 'none',
                            fontFamily: '"Inter", sans-serif',
                            backgroundColor: '#F3F4F6',
                            '&:hover': { backgroundColor: '#E5E7EB', borderColor: 'rgba(0,0,0,0.2)' }
                          }}
                        >
                          Registrar Contingencia
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    // FLOW 2: PASE VISITANTE
                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PersonOutlineIcon sx={{ color: vigiaColors.primary }} />
                        <Typography sx={{ fontWeight: 700, color: vigiaColors.textHeading, fontFamily: '"Exo 2", sans-serif', fontSize: '1.2rem' }}>
                          Generar Pase Temporal
                        </Typography>
                      </Box>

                      <FormControl fullWidth>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: vigiaColors.textSecondary, mb: 0.5 }}>TIPO DE VISITANTE *</Typography>
                        <Select
                          value={visitanteTipo}
                          onChange={(e) => setVisitanteTipo(e.target.value)}
                          displayEmpty
                          size="small"
                          sx={{ backgroundColor: vigiaColors.white, borderRadius: vigiaRadius.sm, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' } }}
                        >
                          <MenuItem value="" disabled sx={{ color: vigiaColors.textTertiary }}>Seleccione el tipo...</MenuItem>
                          <MenuItem value="VISITA">Visita Familiar/Amigo</MenuItem>
                          <MenuItem value="DELIVERY">Delivery / Repartidor</MenuItem>
                          <MenuItem value="TAXI">Taxi / Transporte</MenuItem>
                          <MenuItem value="SERVICIO">Servicios Técnicos</MenuItem>
                          <MenuItem value="OTRO">Otro</MenuItem>
                        </Select>
                      </FormControl>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: vigiaColors.textSecondary, mb: 0.5 }}>NOMBRE *</Typography>
                            <TextField
                              size="small"
                              value={visitanteNombre}
                              onChange={(e) => setVisitanteNombre(e.target.value)}
                              placeholder="Ej. Juan Pérez"
                              sx={{ backgroundColor: vigiaColors.white, '& .MuiOutlinedInput-root': { borderRadius: vigiaRadius.sm, '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' } } }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: vigiaColors.textSecondary, mb: 0.5 }}>DOCUMENTO *</Typography>
                            <TextField
                              size="small"
                              value={visitanteDoc}
                              onChange={(e) => setVisitanteDoc(e.target.value)}
                              placeholder="Ej. 1712345678"
                              sx={{ backgroundColor: vigiaColors.white, '& .MuiOutlinedInput-root': { borderRadius: vigiaRadius.sm, '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' } } }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>

                      <FormControl fullWidth>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: vigiaColors.textSecondary, mb: 0.5 }}>DESTINO / RESIDENTE *</Typography>
                        <TextField
                          size="small"
                          value={visitanteDestino}
                          onChange={(e) => setVisitanteDestino(e.target.value)}
                          placeholder="Ej. Casa 42 - Familia Gómez"
                          sx={{ backgroundColor: vigiaColors.white, '& .MuiOutlinedInput-root': { borderRadius: vigiaRadius.sm, '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' } } }}
                        />
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: vigiaColors.textSecondary, mb: 0.5 }}>DURACIÓN DEL PASE *</Typography>
                        <Select
                          value={paseDuracion}
                          onChange={(e) => setPaseDuracion(e.target.value)}
                          displayEmpty
                          size="small"
                          sx={{ backgroundColor: vigiaColors.white, borderRadius: vigiaRadius.sm, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,0,0,0.1)' } }}
                        >
                          <MenuItem value="" disabled sx={{ color: vigiaColors.textTertiary }}>Seleccione duración...</MenuItem>
                          <MenuItem value="30m">30 minutos</MenuItem>
                          <MenuItem value="1h">1 hora</MenuItem>
                          <MenuItem value="2h">2 horas</MenuItem>
                          <MenuItem value="4h">4 horas</MenuItem>
                          <MenuItem value="12h">12 horas</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: vigiaColors.textSecondary, mb: 0.5 }}>DESCRIPCIÓN (OPCIONAL)</Typography>
                        <TextField
                          size="small"
                          multiline
                          rows={2}
                          value={visitanteDescripcion}
                          onChange={(e) => setVisitanteDescripcion(e.target.value)}
                          placeholder="Ej. Ingresa a dejar un paquete, color del auto..."
                          sx={{ backgroundColor: vigiaColors.white, '& .MuiOutlinedInput-root': { borderRadius: vigiaRadius.sm, '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' } } }}
                        />
                      </FormControl>

                      <Box sx={{ mt: 'auto', pt: 1 }}>
                        <Button
                          variant="contained"
                          onClick={handleGenerarPase}
                          disabled={!visitanteTipo || !visitanteNombre || !visitanteDoc || !visitanteDestino || !paseDuracion || guardando || !placaCapturada}
                          startIcon={<CheckCircleOutlineIcon />}
                          fullWidth
                          sx={{
                            backgroundColor: '#059669', // Green for new pass
                            color: vigiaColors.white,
                            py: 1.5,
                            fontWeight: 600,
                            borderRadius: vigiaRadius.sm,
                            textTransform: 'none',
                            fontFamily: '"Inter", sans-serif',
                            '&:hover': { backgroundColor: '#047857' },
                            '&.Mui-disabled': { backgroundColor: 'rgba(5, 150, 105, 0.4)', color: 'rgba(255,255,255,0.7)' }
                          }}
                        >
                          {guardando ? 'Generando Pase...' : 'Generar Pase y Permitir'}
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

          </Grid>
        </motion.div>

      </Box>
    </DashboardTemplate>
  );
};

export default RevisionManualPage;
