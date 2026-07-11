import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';

const CHIPS = [
  'Conductor presenta autorización física',
  'Propietario confirma autorización',
  'Fallo de cámara',
  'Coincidencia visual verificada',
  'Datos insuficientes',
];

export const RevisionManualPage: React.FC = () => {
  const navigate = useNavigate();
  const [chipSel, setChipSel] = useState('');
  const [motivo, setMotivo] = useState('');
  const [obs, setObs] = useState('');
  const [modal, setModal] = useState<'DENEGAR'|'AUTORIZAR'|null>(null);
  const [resuelto, setResuelto] = useState(false);

  const validar = () => {
    if (!chipSel && motivo.length < 20) {
      alert('Seleccione un motivo sugerido o escriba al menos 20 caracteres.');
      return false;
    }
    return true;
  };

  const confirmar = () => {
    setResuelto(true);
    setModal(null);
  };

  if (resuelto) {
    return (
      <DashboardTemplate rol="GUARD" pageTitle="Detalle de evento">
        <Box sx={{ fontFamily:'Inter,sans-serif' }}>
          <div style={{ padding:60, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>{modal === 'DENEGAR' ? '🚫' : '✅'}</div>
            <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:22, fontWeight:700, color:'#1F2A44', marginBottom:8 }}>Evento resuelto</div>
            <div style={{ fontSize:14, color:'#6B7280', marginBottom:24 }}>La decisión fue registrada correctamente.</div>
            <button onClick={() => navigate('/guardia/cola-eventos')}
              style={{ padding:'12px 28px', borderRadius:10, background:'#0D5CCF', color:'#fff', fontSize:14, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
              Volver a la cola
            </button>
          </div>
        </Box>
      </DashboardTemplate>
    );
  }

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Detalle de evento">
      <Box sx={{ fontFamily:'Inter,sans-serif' }}>

        <div onClick={() => navigate('/guardia/cola-eventos')}
          style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'#0D5CCF', fontWeight:500, cursor:'pointer', padding:'5px 12px', borderRadius:8, border:'1px solid #C7D2FE', background:'#EEF2FF', marginBottom:18 }}>
          ← Cola de eventos
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:18, alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>⚠ Evento detectado</div>
                <div style={{ display:'flex', gap:6 }}>
                  <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'#EDE7F6', color:'#4527A0' }}>SALIDA</span>
                  <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'#FEE2E2', color:'#991B1B' }}>ALTA CRITICIDAD</span>
                </div>
              </div>
              <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:28, fontWeight:800, color:'#0A2F86', background:'#EEF2FF', padding:'8px 18px', borderRadius:8, border:'1px solid #C7D2FE', letterSpacing:2 }}>PCB-1234</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:'#333' }}>Toyota Corolla Blanco · Acceso Norte · Carril SALIDA</div>
                  <div style={{ fontSize:12, color:'#888', marginTop:3 }}>Capturado: 13:24:15 · hace 1 min</div>
                </div>
              </div>
            </div>

            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>👁 Validación biométrica</div>
                <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'#FEE2E2', color:'#C62828' }}>NO COINCIDE</span>
              </div>
              <div style={{ padding:'16px 20px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:14 }}>
                  {[{v:'0.42',l:'Mejor puntaje',c:'#C62828',bg:'#FFF8F8'},{v:'0.75',l:'Umbral requerido',c:'#0D5CCF',bg:'#F8F9FF'},{v:'6',l:'Vectores evaluados',c:'#374151',bg:'#F8F9FF'}].map(x=>(
                    <div key={x.l} style={{ textAlign:'center', padding:10, background:x.bg, borderRadius:8 }}>
                      <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:22, fontWeight:700, color:x.c }}>{x.v}</div>
                      <div style={{ fontSize:11, color:'#888', marginTop:2 }}>{x.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ height:12, background:'#F0F0F0', borderRadius:6, position:'relative', marginBottom:8 }}>
                  <div style={{ width:'42%', height:'100%', background:'#C62828', borderRadius:6 }} />
                  <div style={{ position:'absolute', top:-4, left:'75%', width:2, height:20, background:'#0D5CCF', borderRadius:1 }} />
                </div>
                <div style={{ fontSize:12, color:'#C62828', background:'#FEF2F2', padding:'8px 12px', borderRadius:8, border:'1px solid #FECACA' }}>
                  Puntaje 0.42 muy por debajo del umbral 0.75. Persona no reconocida.
                </div>
              </div>
            </div>

            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>📷 Evidencia visual</div>
              <div style={{ padding:'16px 20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {['Foto del conductor','Foto de la placa'].map(l=>(
                  <div key={l} style={{ background:'#F8F9FF', borderRadius:10, border:'2px dashed #C7D2FE', height:140, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
                    <div style={{ fontSize:28, opacity:.4 }}>📷</div>
                    <span style={{ fontSize:11, color:'#94A3B8' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:'#fff', borderRadius:14, border:'2px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', background:'#F8F9FF', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>✏ Decisión del guardia</div>
              <div style={{ padding:'18px 20px' }}>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:8 }}>Motivo sugerido</div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {CHIPS.map(c=>(
                      <button key={c} onClick={()=>setChipSel(chipSel===c?'':c)} style={{ padding:'5px 12px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', background: chipSel===c?'#EEF2FF':'#F8F9FF', color: chipSel===c?'#0D5CCF':'#555', border: chipSel===c?'1.5px solid #C7D2FE':'1.5px solid #E2E8F0' }}>
                        {chipSel===c?'✓ ':''}{c}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>
                    Detalle del motivo <span style={{ color:'#C62828' }}>*</span>
                    {motivo.length > 0 && <span style={{ marginLeft:8, fontSize:11, color: motivo.length>=20?'#16A34A':'#C62828' }}>({motivo.length}/20 min)</span>}
                  </div>
                  <textarea value={motivo} onChange={e=>setMotivo(e.target.value)}
                    style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1.5px solid ${motivo.length>=20?'#BBF7D0':'#E2E8F0'}`, fontSize:13, fontFamily:'Inter,sans-serif', resize:'none', minHeight:72, boxSizing:'border-box' }}
                    placeholder="Mínimo 20 caracteres..." />
                </div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:6 }}>Observaciones opcionales</div>
                  <textarea value={obs} onChange={e=>setObs(e.target.value)}
                    style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:13, fontFamily:'Inter,sans-serif', resize:'none', minHeight:56, boxSizing:'border-box' }}
                    placeholder="Información adicional..." />
                </div>
                <div style={{ background:'#FEF2F2', borderRadius:10, padding:'12px 16px', border:'1px solid #FECACA', marginBottom:16, fontSize:12, color:'#991B1B' }}>
                  ⚠ En SALIDA, "Denegar salida" es la acción predeterminada segura.
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => { if(validar()) setModal('DENEGAR'); }}
                    style={{ flex:1, padding:12, borderRadius:8, background:'#C62828', color:'#fff', fontSize:13, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                    ✕ Denegar salida
                  </button>
                  <button onClick={() => { if(validar()) setModal('AUTORIZAR'); }}
                    style={{ flex:1, padding:12, borderRadius:8, background:'#F59E0B', color:'#fff', fontSize:13, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                    ✓ Autorizar bajo responsabilidad
                  </button>
                  <button onClick={() => navigate('/guardia/contingencia')}
                    style={{ flex:1, padding:12, borderRadius:8, background:'#E0E7FF', color:'#4527A0', fontSize:13, fontWeight:600, border:'1.5px solid #D1C4E9', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                    ⚠ Contingencia
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>🚗 Vehículo</div>
              <div style={{ padding:'16px 18px' }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:20, fontWeight:800, color:'#0A2F86', background:'#EEF2FF', padding:'6px 14px', borderRadius:7, border:'1px solid #C7D2FE', display:'inline-block', letterSpacing:1, marginBottom:10 }}>PCB-1234</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1F2A44', marginBottom:4 }}>Toyota Corolla 2022 · Blanco</div>
                <div style={{ fontSize:12, color:'#6B7280' }}>Propietario: <strong style={{ color:'#0A2F86' }}>Carlos Mendoza</strong></div>
                <div style={{ marginTop:10, padding:'8px 12px', background:'#F0FDF4', borderRadius:8, border:'1px solid #BBF7D0', fontSize:11, color:'#166534' }}>Estado: ACTIVO · Sin alertas previas</div>
              </div>
            </div>
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>👥 Conductores autorizados</div>
              <div style={{ padding:'12px 18px' }}>
                {[{init:'CM',name:'Carlos Mendoza',rol:'Propietario',color:'#0D5CCF'},{init:'ML',name:'María López',rol:'Cónyuge',color:'#16A34A'}].map(p=>(
                  <div key={p.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid #F1F5F9' }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, color:'#fff', flexShrink:0 }}>{p.init}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{p.name}</div>
                      <div style={{ fontSize:11, color:'#64748B' }}>{p.rol} · Bio: OK ✓</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop:10, padding:'8px 12px', background:'#FEF2F2', borderRadius:8, border:'1px solid #FECACA', fontSize:11, color:'#991B1B' }}>
                  Conductor no coincide con ninguno de los 2 autorizados.
                </div>
              </div>
            </div>
          </div>
        </div>

        {modal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
            <div style={{ background:'#fff', borderRadius:16, padding:28, width:400, boxShadow:'0 20px 60px rgba(0,0,0,0.2)', border:`1px solid ${modal==='DENEGAR'?'#FECACA':'#BBF7D0'}` }}>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:18, fontWeight:800, color: modal==='DENEGAR'?'#C62828':'#2E7D32' }}>
                  {modal==='DENEGAR' ? '✕ Confirmar denegación' : '✓ Confirmar autorización'}
                </div>
                <div style={{ fontSize:12, color:'#6B7280', marginTop:3 }}>Esta acción quedará registrada con tu nombre y timestamp</div>
              </div>
              <div style={{ background: modal==='DENEGAR'?'#FEF2F2':'#F0FDF4', border:`1px solid ${modal==='DENEGAR'?'#FECACA':'#BBF7D0'}`, borderRadius:10, padding:'12px 16px', marginBottom:14 }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:20, fontWeight:800, color: modal==='DENEGAR'?'#991B1B':'#166534', letterSpacing:2 }}>PCB-1234</div>
                <div style={{ fontSize:12, color: modal==='DENEGAR'?'#C62828':'#16A34A', marginTop:4 }}>SALIDA · {chipSel || motivo.slice(0,40)}</div>
              </div>
              {modal==='AUTORIZAR' && (
                <div style={{ background:'#FEF9C3', borderRadius:8, padding:'10px 14px', border:'1px solid #FDE68A', fontSize:12, color:'#92400E', marginBottom:14 }}>
                  ⚠ Estás autorizando bajo tu responsabilidad. Esta decisión es trazable e irrevocable.
                </div>
              )}
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setModal(null)}
                  style={{ flex:1, padding:11, borderRadius:8, background:'#fff', color:'#555', fontSize:13, fontWeight:500, border:'1.5px solid #E2E8F0', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  Cancelar
                </button>
                <button onClick={confirmar}
                  style={{ flex:1, padding:11, borderRadius:8, background: modal==='DENEGAR'?'#C62828':'#2E7D32', color:'#fff', fontSize:13, fontWeight:700, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  {modal==='DENEGAR' ? '✕ Confirmar' : '✓ Confirmar'}
                </button>
              </div>
            </div>
          </div>
        )}

      </Box>
    </DashboardTemplate>
  );
};
export default RevisionManualPage;
