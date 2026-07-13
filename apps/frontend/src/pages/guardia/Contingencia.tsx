import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { useEventosRecientes, useRegistrarEventoManual } from '../../hooks/useGuard';
import { TipoMovimiento } from '../../services/types/guard.types';

const CAUSAS = ['BIOMETRIA_NO_DISPONIBLE','CAMARA_NO_DISPONIBLE','OCR_NO_DISPONIBLE','CAIDA_RED','OPERACION_MANUAL'];
const CAUSA_DESC: Record<string,string> = {
  BIOMETRIA_NO_DISPONIBLE: 'Servicio biométrico caído o sin respuesta.',
  CAMARA_NO_DISPONIBLE:    'Cámara de garita sin señal o dañada.',
  OCR_NO_DISPONIBLE:       'Servicio de lectura de placas no responde.',
  CAIDA_RED:               'Pérdida de conectividad en el punto.',
  OPERACION_MANUAL:        'Decisión tomada sin evidencia automática.',
};
const DURACIONES = [30, 60, 120, 240, 480];

export const ContingenciaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const placaInicial = (location.state as { placa?: string } | null)?.placa ?? '';

  const [placa, setPlaca] = useState(placaInicial.toUpperCase());
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>('ENTRADA');
  const [causa, setCausa] = useState(CAUSAS[0]);
  const [decision, setDecision] = useState<'AUTORIZAR'|'DENEGAR'|null>(null);
  const [detalle, setDetalle] = useState('');
  const [duracion, setDuracion] = useState(60);
  const [error, setError] = useState('');

  const eventosRecientes = useEventosRecientes(30);
  const registrar = useRegistrarEventoManual();

  const contexto = useMemo(
    () => (eventosRecientes.data ?? []).filter((e) => e.placaObservada === placa.trim().toUpperCase()).slice(0, 3),
    [eventosRecientes.data, placa]
  );

  const registrado = registrar.isSuccess;

  const registrarContingencia = () => {
    if (!placa.trim()) { setError('Ingresa la placa del vehículo.'); return; }
    if (!decision) { setError('Selecciona una decisión.'); return; }
    if (detalle.trim().length < 10) { setError('Escribe al menos 10 caracteres.'); return; }
    setError('');

    registrar.mutate({
      placaObservada: placa.trim().toUpperCase(),
      tipoMovimiento,
      decisionOperativa: decision === 'AUTORIZAR' ? 'SUCCESSFUL' : 'DENIED',
      motivoCodigo: 'CONTINGENCIA',
      motivoDetalle: `${CAUSA_DESC[causa]} ${detalle.trim()}`,
      duracionAutorizadaMin: decision === 'AUTORIZAR' && tipoMovimiento === 'ENTRADA' ? duracion : undefined,
    });
  };

  if (registrado) {
    return (
      <DashboardTemplate rol="GUARD" pageTitle="Registro de contingencia">
        <Box sx={{ fontFamily:'Inter,sans-serif' }}>
          <div style={{ padding:60, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📋</div>
            <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:22, fontWeight:700, color:'#1F2A44', marginBottom:8 }}>Contingencia registrada</div>
            <div style={{ fontSize:14, color:'#6B7280', marginBottom:6 }}>Placa: <strong>{placa}</strong> · Causa: <strong>{causa}</strong></div>
            <div style={{ fontSize:14, color:'#6B7280', marginBottom:24 }}>Decisión: <strong style={{ color: decision==='AUTORIZAR'?'#2E7D32':'#C62828' }}>{decision}</strong></div>
            <button onClick={() => navigate('/guardia/cola')}
              style={{ padding:'12px 28px', borderRadius:10, background:'#0D5CCF', color:'#fff', fontSize:14, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
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
        <div onClick={() => navigate('/guardia/cola')}
          style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'#0D5CCF', fontWeight:500, cursor:'pointer', padding:'5px 12px', borderRadius:8, border:'1px solid #C7D2FE', background:'#EEF2FF', marginBottom:18 }}>
          ← Cola de eventos
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:18, alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>Vehículo</div>
              <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                <input
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  placeholder="Placa (ej. ABC1234)"
                  style={{ fontFamily:'"Exo 2",sans-serif', fontSize:18, fontWeight:800, color:'#0A2F86', background:'#EEF2FF', padding:'10px 14px', borderRadius:7, border:'1px solid #C7D2FE', letterSpacing:1, textTransform:'uppercase', width:200 }}
                />
                <div style={{ display:'flex', gap:6 }}>
                  {(['ENTRADA','SALIDA'] as TipoMovimiento[]).map((t) => (
                    <button key={t} onClick={() => setTipoMovimiento(t)} style={{
                      padding:'8px 14px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif',
                      background: tipoMovimiento===t ? '#0D5CCF' : '#fff',
                      color: tipoMovimiento===t ? '#fff' : '#374151',
                      border: tipoMovimiento===t ? 'none' : '1.5px solid #E2E8F0',
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              {contexto.length > 0 && (
                <div style={{ padding:'0 20px 16px' }}>
                  <div style={{ fontSize:11, fontWeight:600, color:'#94A3B8', marginBottom:6 }}>Eventos recientes de esta placa</div>
                  {contexto.map((e) => (
                    <div key={e.eventoAccesoId} style={{ fontSize:12, color:'#555', padding:'4px 0', borderTop:'1px solid #F8F8F8' }}>
                      {new Date(e.capturadoEn).toLocaleString('es-EC')} · {e.tipoMovimiento} · {e.decisionOperativa}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>⚠ Registrar contingencia</div>
              <div style={{ padding:'20px' }}>
                <div style={{ marginBottom:18 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:7, display:'block' }}>¿Qué ocurrió? <span style={{ color:'#C62828' }}>*</span></label>
                  <select value={causa} onChange={e=>setCausa(e.target.value)}
                    style={{ width:'100%', padding:'11px 16px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:13, fontFamily:'Inter,sans-serif', background:'#fff', marginBottom:6 }}>
                    {CAUSAS.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <div style={{ fontSize:11, color:'#888' }}>{CAUSA_DESC[causa]}</div>
                </div>
                <div style={{ marginBottom:18 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:7, display:'block' }}>¿Qué decidió hacer? <span style={{ color:'#C62828' }}>*</span></label>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <button onClick={()=>setDecision('AUTORIZAR')} style={{ padding:14, borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', background: decision==='AUTORIZAR'?'#2E7D32':'#F0FFF4', color: decision==='AUTORIZAR'?'#fff':'#2E7D32', border:`2px solid ${decision==='AUTORIZAR'?'#2E7D32':'#BBF7D0'}` }}>
                      ✓ Autorizar paso
                    </button>
                    <button onClick={()=>setDecision('DENEGAR')} style={{ padding:14, borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', background: decision==='DENEGAR'?'#C62828':'#FEF2F2', color: decision==='DENEGAR'?'#fff':'#C62828', border:`2px solid ${decision==='DENEGAR'?'#C62828':'#FECACA'}` }}>
                      ✕ Denegar paso
                    </button>
                  </div>
                </div>
                {decision === 'AUTORIZAR' && tipoMovimiento === 'ENTRADA' && (
                  <div style={{ marginBottom:18 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:7, display:'block' }}>Duración autorizada de permanencia</label>
                    <select value={duracion} onChange={e=>setDuracion(Number(e.target.value))}
                      style={{ width:'100%', padding:'11px 16px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:13, fontFamily:'Inter,sans-serif', background:'#fff' }}>
                      {DURACIONES.map(d=><option key={d} value={d}>{d < 60 ? `${d} minutos` : `${d/60} hora${d>60?'s':''}`}</option>)}
                    </select>
                  </div>
                )}
                <div style={{ marginBottom:18 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:7, display:'block' }}>
                    Explique la situación <span style={{ color:'#C62828' }}>*</span>
                    {detalle.length > 0 && <span style={{ marginLeft:8, fontSize:11, color: detalle.length>=10?'#16A34A':'#C62828' }}>({detalle.length}/10 min)</span>}
                  </label>
                  <textarea value={detalle} onChange={e=>setDetalle(e.target.value)}
                    style={{ width:'100%', padding:'11px 16px', borderRadius:8, border:`1.5px solid ${detalle.length>=10?'#BBF7D0':'#E2E8F0'}`, fontSize:13, fontFamily:'Inter,sans-serif', resize:'none', minHeight:88, boxSizing:'border-box' }}
                    placeholder="Describa la situación..." />
                </div>
                {error && (
                  <div style={{ background:'#FEF2F2', borderRadius:8, padding:'10px 14px', border:'1px solid #FECACA', fontSize:12, color:'#C62828', marginBottom:14 }}>
                    ⚠ {error}
                  </div>
                )}
                {registrar.isError && (
                  <div style={{ background:'#FEF2F2', borderRadius:8, padding:'10px 14px', border:'1px solid #FECACA', fontSize:12, color:'#C62828', marginBottom:14 }}>
                    ⚠ No se pudo registrar la contingencia. Intenta de nuevo.
                  </div>
                )}
                <div style={{ background:'#FEF9C3', borderRadius:8, padding:'10px 14px', border:'1px solid #FDE68A', fontSize:12, color:'#854D0E', marginBottom:18 }}>
                  ⚠ Esta contingencia quedará registrada con timestamp real. Es trazable e irrevocable.
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => navigate('/guardia/cola')}
                    style={{ flex:1, padding:11, borderRadius:8, background:'#fff', color:'#555', fontSize:13, fontWeight:500, border:'1.5px solid #E2E8F0', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                    Cancelar
                  </button>
                  <button onClick={registrarContingencia} disabled={registrar.isPending}
                    style={{ flex:2, padding:11, borderRadius:8, background: decision && !registrar.isPending ?'#F2851F':'#CBD5E1', color:'#fff', fontSize:13, fontWeight:600, border:'none', cursor: decision && !registrar.isPending ?'pointer':'not-allowed', fontFamily:'Inter,sans-serif' }}>
                    {registrar.isPending ? 'Registrando...' : '✓ Registrar y cerrar evento'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>Causas válidas</div>
              <div style={{ padding:'14px 18px', display:'flex', flexDirection:'column', gap:10 }}>
                {CAUSAS.map(c=>(
                  <div key={c} style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:12, padding:'6px 0', borderBottom:'1px solid #F8F8F8' }}>
                    <span style={{ fontSize:10, fontWeight:700, background: causa===c?'#0D5CCF':'#EDE7F6', color: causa===c?'#fff':'#4527A0', padding:'3px 8px', borderRadius:10, whiteSpace:'nowrap', flexShrink:0 }}>{c}</span>
                    <span style={{ color:'#555' }}>{CAUSA_DESC[c]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'#EEF2FF', borderRadius:12, border:'1px solid #C7D2FE', padding:'14px 16px' }}>
              <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86', marginBottom:8 }}>ℹ Campos autoregistrados</div>
              {[['punto_control','Registro manual (garita)'],['origen','CONTINGENCIA']].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #E2E8F0', fontSize:12 }}>
                  <span style={{ color:'#888' }}>{k}</span><span style={{ fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Box>
    </DashboardTemplate>
  );
};
export default ContingenciaPage;
