import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, Alert, Container, Stack, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

export const SimuladorCamaraEdge: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const placaInputRef = useRef<HTMLInputElement>(null);
  const rostroInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [tipoMovimiento, setTipoMovimiento] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA');
  
  const [placaManual, setPlacaManual] = useState<string>(''); // Vacio por defecto para forzar OCR
  
  const [fotoPlaca, setFotoPlaca] = useState<{ blob: Blob, url: string } | null>(null);
  const [fotoRostro, setFotoRostro] = useState<{ blob: Blob, url: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    iniciarCamara();
    return () => detenerCamara();
  }, []);

  const iniciarCamara = () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam", err);
        setError("No se pudo acceder a la cámara. Puede usar los botones de subir archivo.");
      });
  };

  const detenerCamara = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturarDeVideo = (tipo: 'PLACA' | 'ROSTRO') => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      if (tipo === 'PLACA') setFotoPlaca({ blob, url });
      else setFotoRostro({ blob, url });
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'PLACA' | 'ROSTRO') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (tipo === 'PLACA') setFotoPlaca({ blob: file, url });
      else setFotoRostro({ blob: file, url });
    }
  };

  const procesarAcceso = async () => {
    setLoading(true);
    setError(null);
    setResultado(null);

    if (!fotoRostro) {
      setError("La foto del rostro es obligatoria.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('fotoRostro', fotoRostro.blob, 'rostro.jpg');
    if (fotoPlaca) {
      formData.append('fotoPlaca', fotoPlaca.blob, 'placa.jpg');
    }
    formData.append('tipoMovimiento', tipoMovimiento);
    if (placaManual) {
      formData.append('placaManual', placaManual);
    }

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
      const token = localStorage.getItem('vigia_access_token');
      const res = await axios.post(`${API_URL}/access-control/edge/reconocimiento`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      setResultado(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 10 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Simulador Edge Device (Cámara de Poste)
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph>
          Captura o sube la foto de la placa y luego la foto del conductor.
        </Typography>

        <Box sx={{ my: 3, position: 'relative', width: '100%', maxWidth: 640, margin: '0 auto', bgcolor: '#000', borderRadius: 2, overflow: 'hidden' }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: 'block', maxHeight: 400, objectFit: 'cover' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mb: 4, mt: 3 }}>
          {/* Panel Placa */}
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, flex: 1 }}>
            <Typography variant="h6" gutterBottom>1. Placa Vehicular</Typography>
            {!fotoPlaca ? (
              <Stack direction="row" spacing={1} justifyContent="center">
                <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={() => capturarDeVideo('PLACA')}>Capturar</Button>
                <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => placaInputRef.current?.click()}>Subir</Button>
              </Stack>
            ) : (
              <Box>
                <img src={fotoPlaca.url} alt="Placa" style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 4 }} />
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => setFotoPlaca(null)}>Quitar</Button>
              </Box>
            )}
            <input type="file" hidden accept="image/*" ref={placaInputRef} onChange={(e) => handleFileUpload(e, 'PLACA')} />
          </Box>

          {/* Panel Rostro */}
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, flex: 1 }}>
            <Typography variant="h6" gutterBottom>2. Rostro Conductor</Typography>
            {!fotoRostro ? (
              <Stack direction="row" spacing={1} justifyContent="center">
                <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={() => capturarDeVideo('ROSTRO')}>Capturar</Button>
                <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => rostroInputRef.current?.click()}>Subir</Button>
              </Stack>
            ) : (
              <Box>
                <img src={fotoRostro.url} alt="Rostro" style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 4 }} />
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => setFotoRostro(null)}>Quitar</Button>
              </Box>
            )}
            <input type="file" hidden accept="image/*" ref={rostroInputRef} onChange={(e) => handleFileUpload(e, 'ROSTRO')} />
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Tipo de Movimiento</InputLabel>
            <Select value={tipoMovimiento} label="Tipo de Movimiento" onChange={(e) => setTipoMovimiento(e.target.value as 'ENTRADA' | 'SALIDA')}>
              <MenuItem value="ENTRADA">ENTRADA</MenuItem>
              <MenuItem value="SALIDA">SALIDA</MenuItem>
            </Select>
          </FormControl>
          <TextField 
            label="Placa Manual (Fallback)" 
            value={placaManual} 
            onChange={(e) => setPlacaManual(e.target.value)} 
            helperText="Si el OCR falla, se usa esto"
          />
        </Stack>

        <Button 
          variant="contained" 
          size="large" 
          onClick={procesarAcceso} 
          disabled={loading || !fotoRostro}
          sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'EVALUAR ACCESO'}
        </Button>

        {error && <Alert severity="error" sx={{ mt: 3, textAlign: 'left' }}>{error}</Alert>}

        {resultado && (
          <Alert severity={resultado.decision === 'SUCCESSFUL' ? 'success' : 'error'} sx={{ mt: 3, textAlign: 'left' }}>
            <Typography variant="h6">Decisión: {resultado.decision}</Typography>
            <Typography variant="body1"><strong>Motivo:</strong> {resultado.motivo}</Typography>
            <Typography variant="body2"><strong>Placa Detectada:</strong> {resultado.placa}</Typography>
          </Alert>
        )}
      </Paper>
    </Container>
  );
};
