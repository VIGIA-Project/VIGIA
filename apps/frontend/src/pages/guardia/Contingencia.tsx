import React, { useState } from 'react';
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
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { fadeInUp, staggerContainer } from '../../config/animations.config';
import { vigiaRadius, vigiaColors } from '../../theme/vigia-theme';

// Icons
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import BugReportIcon from '@mui/icons-material/BugReport';
import SaveIcon from '@mui/icons-material/Save';

export const ContingenciaPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [causa, setCausa] = useState('');
  const [detalle, setDetalle] = useState('');

  const handleConfirmar = () => {
    if (!causa || detalle.length < 10) return;
    navigate('/guardia/cola-eventos'); 
  };

  const handleCancelar = () => {
    navigate(-1);
  };

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Contingencia Operativa">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Header Section */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" sx={{ color: vigiaColors.textBody, mb: 1, fontWeight: 700, fontFamily: '"Exo 2", sans-serif' }}>
                Registro de Contingencia
              </Typography>
              <Typography variant="body2" sx={{ color: vigiaColors.textSecondary, fontFamily: '"Inter", sans-serif' }}>
                Documentación obligatoria frente a un fallo técnico o de sistema (UC-04).
              </Typography>
            </Box>
            
            {/* Status Pill */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: vigiaRadius.full,
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
              }}
            >
              <ReportProblemIcon sx={{ fontSize: '1.2rem' }} />
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: '"Exo 2", sans-serif' }}>
                MODO CONTINGENCIA
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <Grid container spacing={3}>
            
            {/* LEFT COLUMN: CONTEXTO DEL FALLO */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                {/* Evento Info */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: vigiaRadius.md, border: '1px solid rgba(0,0,0,0.08)', backgroundColor: vigiaColors.white }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <WarningAmberIcon sx={{ color: '#D97706' }} />
                    <Typography sx={{ fontWeight: 700, color: vigiaColors.textHeading, fontFamily: '"Exo 2", sans-serif', fontSize: '1.1rem' }}>
                      Contexto del Evento
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: vigiaColors.textSecondary, letterSpacing: 0.5, mb: 1 }}>
                        ACTOR RESPONSABLE
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonOutlineIcon sx={{ color: vigiaColors.primary, fontSize: '1.2rem' }} />
                        <Typography sx={{ fontWeight: 600, color: vigiaColors.textBody, fontFamily: '"Inter", sans-serif' }}>
                          Guardia de Turno
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: vigiaColors.textSecondary, letterSpacing: 0.5, mb: 1 }}>
                        REFERENCIA EVENTO
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: vigiaColors.textBody, fontFamily: '"Inter", sans-serif' }}>
                        EV-8821
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: vigiaColors.textSecondary, letterSpacing: 0.5, mb: 1 }}>
                        FECHA Y HORA
                      </Typography>
                      <Typography sx={{ fontWeight: 600, color: vigiaColors.textBody, fontFamily: '"Inter", sans-serif' }}>
                        2026-07-06 14:35:22
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Evidencia (Vehiculo si aplica) */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: vigiaRadius.md, border: '1px solid rgba(0,0,0,0.08)', backgroundColor: vigiaColors.white }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: vigiaColors.textSecondary, letterSpacing: 0.5, mb: 2 }}>
                    VEHÍCULO / PLACA INVOLUCRADA (SI APLICA)
                  </Typography>
                  
                  <Box sx={{ backgroundColor: '#F3F4F6', p: 2, borderRadius: vigiaRadius.sm, textAlign: 'center', mb: 2 }}>
                    <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: '"Exo 2", sans-serif', color: '#1F2937', letterSpacing: 2 }}>
                      ABC-1234
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      justifyContent: 'center',
                      backgroundColor: '#1E3A8A', 
                      color: '#FFFFFF',
                      p: 1.5,
                      borderRadius: vigiaRadius.sm,
                    }}
                  >
                    <ArrowRightAltIcon />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1 }}>
                      TIPO DE MOVIMIENTO: ENTRADA
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* RIGHT COLUMN: ACTION */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: vigiaRadius.md, 
                  border: '1px solid #FCA5A5', 
                  backgroundColor: '#FEF2F2',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <BugReportIcon sx={{ color: '#DC2626' }} />
                  <Typography sx={{ fontWeight: 700, color: '#991B1B', fontFamily: '"Exo 2", sans-serif', fontSize: '1.2rem' }}>
                    Formulario de Contingencia
                  </Typography>
                </Box>

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', mb: 1, letterSpacing: 0.5 }}>
                    CAUSA PRINCIPAL DEL FALLO *
                  </Typography>
                  <Select
                    value={causa}
                    onChange={(e) => setCausa(e.target.value)}
                    displayEmpty
                    size="small"
                    sx={{
                      backgroundColor: vigiaColors.white,
                      borderRadius: vigiaRadius.sm,
                      fontFamily: '"Inter", sans-serif',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(220,38,38,0.3)' },
                    }}
                  >
                    <MenuItem value="" disabled sx={{ color: vigiaColors.textTertiary }}>
                      Seleccione la causa técnica...
                    </MenuItem>
                    <MenuItem value="FALLO_RED">Fallo de red / Sin conectividad</MenuItem>
                    <MenuItem value="FALLO_CAMARA">Cámara LPR fuera de línea</MenuItem>
                    <MenuItem value="SISTEMA_CAIDO">Caída general del sistema</MenuItem>
                    <MenuItem value="FALLO_BIOMETRICO">Fallo en módulo biométrico</MenuItem>
                    <MenuItem value="OTRO">Otro problema técnico</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 4, flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', letterSpacing: 0.5 }}>
                      DETALLE DE LA CONTINGENCIA *
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: detalle.length < 10 ? '#DC2626' : '#059669', fontWeight: 600 }}>
                      {detalle.length}/10 mín.
                    </Typography>
                  </Box>
                  <TextField
                    multiline
                    rows={6}
                    value={detalle}
                    onChange={(e) => setDetalle(e.target.value)}
                    placeholder="Describa el comportamiento observado, pasos previos al fallo y medidas inmediatas tomadas..."
                    variant="outlined"
                    sx={{
                      backgroundColor: vigiaColors.white,
                      borderRadius: vigiaRadius.sm,
                      '& .MuiOutlinedInput-root': {
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.9rem',
                        '& fieldset': { borderColor: 'rgba(220,38,38,0.3)' },
                        '&.Mui-focused fieldset': { borderColor: '#DC2626' },
                      }
                    }}
                  />
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancelar}
                    sx={{
                      flex: 1,
                      borderColor: 'rgba(220,38,38,0.3)',
                      color: '#DC2626',
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: vigiaRadius.sm,
                      textTransform: 'none',
                      fontFamily: '"Inter", sans-serif',
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      '&:hover': { backgroundColor: '#FEE2E2', borderColor: '#DC2626' }
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleConfirmar}
                    disabled={!causa || detalle.length < 10}
                    startIcon={<SaveIcon />}
                    sx={{
                      flex: 2,
                      backgroundColor: '#DC2626',
                      color: vigiaColors.white,
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: vigiaRadius.sm,
                      textTransform: 'none',
                      fontFamily: '"Inter", sans-serif',
                      '&:hover': { backgroundColor: '#B91C1C' },
                      '&.Mui-disabled': { backgroundColor: 'rgba(220, 38, 38, 0.4)', color: 'rgba(255,255,255,0.7)' }
                    }}
                  >
                    Confirmar Registro
                  </Button>
                </Box>
              </Paper>
            </Grid>

          </Grid>
        </motion.div>

      </Box>
    </DashboardTemplate>
  );
};

export default ContingenciaPage;
