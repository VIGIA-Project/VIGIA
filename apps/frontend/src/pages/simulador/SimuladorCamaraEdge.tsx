import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, Alert, Container, Stack, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import axios from 'axios';

export const SimuladorCamaraEdge: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [tipoMovimiento, setTipoMovimiento] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
  const [placaManual, setPlacaManual] = useState<string>('PCH0001');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((s) => {
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam", err);
        setError("No se pudo acceder a la cámara web. Asegúrese de dar permisos.");
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const procesarAcceso = () => {
    setLoading(true);
    setError(null);
    setResultado(null);

    if (!videoRef.current || !canvasRef.current) {
      setError("Cámara no disponible.");
      setLoading(false);
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError("Error al capturar la imagen.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('fotoRostro', blob, 'rostro.jpg');
      formData.append('tipoMovimiento', tipoMovimiento);
      formData.append('placaManual', placaManual);

      try {
        const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
        const res = await axios.post(`${API_URL}/access-control/edge/reconocimiento`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setResultado(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Error de conexión");
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Simulador Edge Device (Cámara de Poste)
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph>
          Esta interfaz simula el dispositivo hardware que se encuentra en la garita.
          Toma una foto del rostro del conductor y envía los datos al backend central.
        </Typography>

        <Box sx={{ my: 3, position: 'relative', width: '100%', maxWidth: 640, margin: '0 auto', bgcolor: '#000', borderRadius: 2, overflow: 'hidden' }}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', display: 'block' }} 
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Movimiento</InputLabel>
            <Select
              value={tipoMovimiento}
              label="Movimiento"
              onChange={(e) => setTipoMovimiento(e.target.value as 'ENTRADA' | 'SALIDA')}
            >
              <MenuItem value="ENTRADA">ENTRADA</MenuItem>
              <MenuItem value="SALIDA">SALIDA</MenuItem>
            </Select>
          </FormControl>
          
          <TextField 
            label="Placa Observada (OCR Simulado)" 
            value={placaManual} 
            onChange={(e) => setPlacaManual(e.target.value)} 
          />
        </Stack>

        <Button 
          variant="contained" 
          size="large" 
          onClick={procesarAcceso} 
          disabled={loading}
          sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'SIMULAR CAPTURA Y PROCESAR'}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {resultado && (
          <Alert severity={resultado.decision === 'SUCCESSFUL' ? 'success' : 'error'} sx={{ mt: 3, textAlign: 'left' }}>
            <Typography variant="h6">Resultado: {resultado.decision}</Typography>
            <Typography variant="body1"><strong>Motivo:</strong> {resultado.motivo}</Typography>
            <Typography variant="body2"><strong>Placa:</strong> {resultado.placa}</Typography>
            <Typography variant="body2"><strong>Evento ID:</strong> {resultado.eventoId}</Typography>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};
