import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';

const CAUSAS = [
  'BIOMETRIA_NO_DISPONIBLE',
  'CAMARA_NO_DISPONIBLE',
  'OCR_NO_DISPONIBLE',
  'CAIDA_RED',
  'OPERACION_MANUAL',
];

const CAUSA_DESC: Record<string,string> = {
  BIOMETRIA_NO_DISPONIBLE: 'El servicio biométrico no pudo validar el rostro o huella con suficiente precisión.',
  CAMARA_NO_DISPONIBLE:    'La cámara de garita no tiene señal o está dañada.',
  OCR_NO_DISPONIBLE:       'El servicio de lectura de placas no está respondiendo.',
  CAIDA_RED:               'Pérdida de conectividad en el punto de control.',
  OPERACION_MANUAL:        'Decisión tomada sin evidencia automática disponible.',
};

export const ContingenciaPage: React.FC = () => {
  const navigate = useNavigate();
  const [causa, setCausa] = useState('BIOMETRIA_NO_DISPONIBLE');
  const [decision, setDecision] = useState<'AUTORIZAR'|'DENEGAR'|null>(null);
  const [detalle, setDetalle] = useState('');
  const [registrado, setRegistrado] = useState(false);
  const [error, setError] = useState('');

  const registrar = () => {
    if (!decision) { setError('Selecciona una decisión: Autorizar o Denegar.'); return; }
    if (detalle.trim().length < 10) { setError('Escribe al menos 10 caracteres explicando la situación.'); return; }
    setError('');
    // TODO: POST /api/v1/eventos/:id/contingencia { causa, decision, detalle }
    setRegistrado(true);
  };

  if (registrado) {
    return (
      <DashboardTemplate rol="GUARD" pageTitle="Registro de contingencia">
        <Box sx={{ fontFamily:'Inter,sans-serif' }}>
          <div style={{ padding:60, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📋</div>
            <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:22, fontWeight:700, color:'#1F2A44', marginBottom:8 }}>Contingencia registrada</div>
            <div style={{ fontSize:14, color:'#6B7280', marginBottom:6 }}>Causa: <strong>{causa}</strong></div>
            <div style={{ fontSize:14, color:'#6B7280', marginBottom:24 }}>Decisión: <strong style={{ color: decision==='AUTORIZAR'?'#2E7D32':'#C62828' }}>{decision}</strong></div>
            <button onClick={() => navigate('/guardia/cola-eventos')} style={{ padding:'12px 28px', borderRadius:10, background:'#0D5CCF', color:'#fff', fontSize:14, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
              Volver a la cola
            </button>
          </div>
        </Box>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Registro de contingencia">
      <Box sx={{ fontFamily:'Inter,sans-serif' }}>

        <div onClick={() => navigate('/guardia/cola-eventos')} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'#0D5CCF', fontWeight:500, cursor:'pointer', padding:'5px 12px', borderRadius:8, border:'1px solid #C7D2FE', background:'#EEF2FF', marginBottom:18 }}>
          ← Cola de pendientes
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:18, alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* EVENTO */}
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>Evento origen</div>
                <div style={{ display:'flex', gap:6 }}>
                  <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'#EDE7F6', color:'#4527A0' }}>SALIDA</span>
                  <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'#FEF9C3', color:'#854D0E' }}>EVIDENCIA_INSUFICIENTE</span>
                </div>
              </div>
              <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:20, fontWeight:800, color:'#0A2F86', background:'#EEF2FF', padding:'6px 14px', borderRadius:7, border:'1px solid #C7D2FE', letterSpacing:1 }}>XYZ-9012</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:'#333' }}>Acceso Norte · Carril SALIDA · 13:19:33</div>
                  <div style={{ fontSize:11, color:'#888', marginTop:2 }}>EVIDENCIA_INSUFICIENTE (score 0.62 &lt; 0.75)</div>
                </div>
              </div>
            </div>

            {/* FORMULARIO */}
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>⚠ Registrar contingencia operativa</div>
              <div style={{ padding:'20px' }}>

                {/* CAUSA */}
                <div style={{ marginBottom:18 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:7, display:'block' }}>¿Qué ocurrió? (Causa) <span style={{ color:'#C62828' }}>*</span></label>
                  <select value={causa} onChange={e=>setCausa(e.target.value)} style={{ width:'100%', padding:'11px 16px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:13, fontFamily:'Inter,sans-serif', background:'#fff', marginBottom:6 }}>
                    {CAUSAS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <div style={{ fontSize:11, color:'#888' }}>{CAUSA_DESC[causa]}</div>
                </div>

                {/* DECISIÓN */}
                <div style={{ marginBottom:18 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:7, display:'block' }}>¿Qué decidió hacer? <span style={{ color:'#C62828' }}>*</span></label>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <button onClick={()=>setDecision('AUTORIZAR')} style={{ padding:14, borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', background: decision==='AUTORIZAR'?'#2E7D32':'#F0FFF4', color: decision==='AUTORIZAR'?'#fff':'#2E7D32', border:`2px solid ${decision==='AUTORIZAR'?'#2E7D32':'#BBF7D0'}`, transition:'all 0.15s' }}>
                      ✓ Autorizar paso
                    </button>
                    <button onClick={()=>setDecision('DENEGAR')} style={{ padding:14, borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', background: decision==='DENEGAR'?'#C62828':'#FEF2F2', color: decision==='DENEGAR'?'#fff':'#C62828', border:`2px solid ${decision==='DENEGAR'?'#C62828':'#FECACA'}`, transition:'all 0.15s' }}>
                      ✕ Denegar paso
                    </button>
                  </div>
                </div>

                {/* DETALLE */}
                <div style={{ marginBottom:18 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:7, display:'block' }}>
                    Explique la situación <span style={{ color:'#C62828' }}>*</span>
                    {detalle.length > 0 && <span style={{ marginLeft:8, fontSize:11, color: detalle.length>=10?'#16A34A':'#C62828' }}>({detalle.length}/10 min)</span>}
                  </label>
                  <textarea value={detalle} onChange={e=>setDetalle(e.target.value)}
                    style={{ width:'100%', padding:'11px 16px', borderRadius:8, border:`1.5px solid ${detalle.length>=10?'#BBF7D0':'#E2E8F0'}`, fontSize:13, fontFamily:'Inter,sans-serif', resize:'none', minHeight:88, boxSizing:'border-box' }}
                    placeholder="Describa brevemente la situación que motivó la contingencia..." />
                </div>

                {/* ERROR */}
                {error && (
                  <div style={{ background:'#FEF2F2', borderRadius:8, padding:'10px 14px', border:'1px solid #FECACA', fontSize:12, color:'#C62828', marginBottom:14 }}>
                    ⚠ {error}
                  </div>
                )}

                {/* ADVERTENCIA */}
                <div style={{ background:'#FEF9C3', borderRadius:8, padding:'10px 14px', border:'1px solid #FDE68A', fontSize:12, color:'#854D0E', marginBottom:18 }}>
                  ⚠ Esta contingencia quedará registrada con tu nombre, timestamp y decisión. El registro es trazable e irrevocable.
                </div>

                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => navigate('/guardia/cola-eventos')} style={{ flex:1, padding:11, borderRadius:8, background:'#fff', color:'#555', fontSize:13, fontWeight:500, border:'1.5px solid #E2E8F0', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                    Cancelar
                  </button>
                  <button onClick={registrar} style={{ flex:2, padding:11, borderRadius:8, background: decision ? '#F2851F' : '#CBD5E1', color:'#fff', fontSize:13, fontWeight:600, border:'none', cursor: decision?'pointer':'not-allowed', fontFamily:'Inter,sans-serif' }}>
                    ✓ Registrar y cerrar evento
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DERECHA */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>Causas válidas</div>
              <div style={{ padding:'14px 18px', display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  ['BIOMETRIA_NO_DISPONIBLE','Servicio biométrico caído o sin respuesta.'],
                  ['CAMARA_NO_DISPONIBLE','Cámara de garita sin señal o dañada.'],
                  ['OCR_NO_DISPONIBLE','Servicio de lectura de placas no responde.'],
                  ['CAIDA_RED','Pérdida de conectividad en el punto.'],
                  ['OPERACION_MANUAL','Decisión tomada sin evidencia automática.'],
                ].map(([c,d])=>(
                  <div key={c} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:12, padding:'6px 0', borderBottom:'1px solid #F8F8F8' }}>
                    <span style={{ fontSize:10, fontWeight:700, background: causa===c?'#0D5CCF':'#EDE7F6', color: causa===c?'#fff':'#4527A0', padding:'3px 8px', borderRadius:10, whiteSpace:'nowrap', flexShrink:0 }}>{c}</span>
                    <span style={{ color:'#555' }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:'#EEF2FF', borderRadius:12, border:'1px solid #C7D2FE', padding:'14px 16px' }}>
              <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86', marginBottom:8 }}>ℹ Campos autoregistrados</div>
              <div style={{ fontSize:12, color:'#374151' }}>
                {[['guardia','Kevin Chicaisa'],['punto_control','Acceso Norte'],['registrado_en','NOW()'],['origen_resolucion','CONTINGENCIA']].map(([k,v])=>(
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #E2E8F0' }}>
                    <span style={{ color:'#888' }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RESUMEN SELECCIÓN */}
            {(decision || causa) && (
              <div style={{ background:'#fff', borderRadius:12, border:'1px solid #E2E8F0', padding:'14px 16px' }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:12, fontWeight:600, color:'#0A2F86', marginBottom:8 }}>Resumen de tu registro</div>
                <div style={{ fontSize:12, color:'#374151', display:'flex', flexDirection:'column', gap:6 }}>
                  <div><span style={{ color:'#888' }}>Causa:</span> <strong>{causa}</strong></div>
                  <div><span style={{ color:'#888' }}>Decisión:</span> {decision
                    ? <strong style={{ color: decision==='AUTORIZAR'?'#2E7D32':'#C62828' }}>{decision}</strong>
                    : <span style={{ color:'#C62828' }}>⚠ Pendiente de selección</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </Box>
    </DashboardTemplate>
  );
};

export default ContingenciaPage;
