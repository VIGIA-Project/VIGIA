import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';

export const RegistroInvitadoPage: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [facultad, setFacultad] = useState('Ingeniería');
  const [motivo, setMotivo] = useState('VISITA_ACADEMICA');
  const [detalle, setDetalle] = useState('');
  const [tiempo, setTiempo] = useState(2);

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Registro de invitado">
      <Box sx={{ fontFamily:'Inter,sans-serif' }}>

        <div onClick={() => navigate('/guardia/cola-eventos')} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'#0D5CCF', fontWeight:500, cursor:'pointer', padding:'5px 12px', borderRadius:8, border:'1px solid #C7D2FE', background:'#EEF2FF', marginBottom:18 }}>
          ← Cola de pendientes
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:18, alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* EVENTO */}
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>Evento origen</div>
                <div style={{ display:'flex', gap:6 }}>
                  <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'#E3F2FD', color:'#1565C0' }}>ENTRADA</span>
                  <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'#FEF9C3', color:'#854D0E' }}>VEHICULO_NO_REGISTRADO</span>
                </div>
              </div>
              <div style={{ padding:'12px 20px', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:20, fontWeight:800, color:'#0A2F86', background:'#EEF2FF', padding:'6px 14px', borderRadius:7, border:'1px solid #C7D2FE', letterSpacing:1 }}>XYZ-0000</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:'#333' }}>Vehículo no registrado en el sistema institucional</div>
                  <div style={{ fontSize:11, color:'#888', marginTop:2 }}>Capturado a las 13:24 · Acceso Norte · Carril de entrada</div>
                </div>
              </div>
            </div>

            {/* FORMULARIO */}
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>👤 Datos del invitado</div>
              <div style={{ padding:'20px' }}>

                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:6, display:'block' }}>Placa detectada <span style={{ color:'#19D6C4', fontSize:11, fontWeight:400 }}>* Prellenada por OCR</span></label>
                  <input readOnly value="XYZ-0000" style={{ width:'100%', padding:'10px 16px', borderRadius:8, border:'1.5px solid #A5D6A7', background:'#F0FFF4', fontFamily:'"Exo 2",sans-serif', fontSize:18, fontWeight:700, color:'#1B5E20', letterSpacing:2 }} />
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:6, display:'block' }}>Nombre completo <span style={{ color:'#C62828' }}>*</span></label>
                    <input value={nombre} onChange={e=>setNombre(e.target.value)} style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:13, fontFamily:'Inter,sans-serif' }} placeholder="Juan Pérez" />
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:6, display:'block' }}>Cédula <span style={{ color:'#C62828' }}>*</span></label>
                    <input value={cedula} onChange={e=>setCedula(e.target.value)} style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:13, fontFamily:'Inter,sans-serif' }} placeholder="1700112233" />
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:6, display:'block' }}>Facultad destino <span style={{ color:'#C62828' }}>*</span></label>
                    <select value={facultad} onChange={e=>setFacultad(e.target.value)} style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:13, fontFamily:'Inter,sans-serif' }}>
                      {['Ingeniería','Medicina','Derecho','Filosofía','Arquitectura'].map(f=><option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:6, display:'block' }}>Motivo de ingreso <span style={{ color:'#C62828' }}>*</span></label>
                    <select value={motivo} onChange={e=>setMotivo(e.target.value)} style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:13, fontFamily:'Inter,sans-serif' }}>
                      {['VISITA_ACADEMICA','TRAMITE_ADMINISTRATIVO','ENTREGA_PROVEEDOR','EMERGENCIA','OTRO'].map(m=><option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                {motivo === 'OTRO' && (
                  <div style={{ marginBottom:16 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:6, display:'block' }}>Detalle del motivo <span style={{ color:'#C62828' }}>*</span></label>
                    <input value={detalle} onChange={e=>setDetalle(e.target.value)} style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1.5px solid #E2E8F0', fontSize:13, fontFamily:'Inter,sans-serif' }} placeholder="Describa el motivo..." />
                  </div>
                )}

                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:'#374151', marginBottom:8, display:'block' }}>Tiempo de permanencia <span style={{ color:'#C62828' }}>*</span></label>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                    {[1,2,4,6].map(h=>(
                      <button key={h} onClick={()=>setTiempo(h)} style={{ padding:10, borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif', background: tiempo===h?'#EEF2FF':'#fff', color: tiempo===h?'#0D5CCF':'#555', border: `2px solid ${tiempo===h?'#0D5CCF':'#E2E8F0'}` }}>
                        {h} hora{h>1?'s':''}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize:11, color:'#888', marginTop:6 }}>El sistema generará alerta si el invitado supera el tiempo autorizado.</div>
                </div>

                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={()=>navigate('/guardia/cola-eventos')} style={{ flex:1, padding:11, borderRadius:8, background:'#fff', color:'#555', fontSize:13, fontWeight:500, border:'1.5px solid #E2E8F0', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Cancelar</button>
                  <button onClick={() => { if(!nombre || !cedula){ alert('Complete nombre y cédula.'); return; } navigate('/guardia/cola-eventos'); }} style={{ flex:2, padding:11, borderRadius:8, background:'#0D5CCF', color:'#fff', fontSize:13, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>👤 Registrar invitado</button>
                </div>
              </div>
            </div>
          </div>

          {/* DERECHA — INVITADOS ACTIVOS */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>👥 Invitados activos</div>
                <span style={{ fontSize:11, background:'#DBEAFE', color:'#1E40AF', padding:'2px 8px', borderRadius:10, fontWeight:600 }}>2 en campus</span>
              </div>
              {[
                { init:'JP', name:'Juan Pérez', sub:'Ingeniería · VISITA_ACADEMICA', placa:'ABC-0001', color:'#0D5CCF', estado:'VIGENTE', estadoColor:'#2E7D32', estadoBg:'#F0FFF4', estadoBorder:'#BBF7D0', info:'1h 23 min restantes', btn:'Registrar salida', btnColor:'#0D5CCF' },
                { init:'AG', name:'Ana García', sub:'Medicina · TRAMITE_ADMINISTRATIVO', placa:'DEF-0002', color:'#C62828', estado:'EXPIRADO', estadoColor:'#C62828', estadoBg:'#FFF0F0', estadoBorder:'#FECACA', info:'18 min sobre el tiempo', btn:'Registrar salida', btnColor:'#C62828' },
              ].map(inv=>(
                <div key={inv.name} style={{ margin:12, borderRadius:10, border:`1px solid ${inv.estadoBorder}`, overflow:'hidden' }}>
                  <div style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:10, background: inv.estado==='EXPIRADO'?'#FFF8F8':'#fff' }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:inv.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, color:'#fff', flexShrink:0 }}>{inv.init}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{inv.name}</div>
                      <div style={{ fontSize:11, color:'#6B7280' }}>{inv.sub}</div>
                    </div>
                    <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:12, fontWeight:700, color:'#0A2F86', background:'#EEF2FF', padding:'3px 8px', borderRadius:5, border:'1px solid #C7D2FE' }}>{inv.placa}</div>
                  </div>
                  <div style={{ padding:'10px 14px', borderTop:`1px solid ${inv.estadoBorder}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:inv.estadoBg }}>
                    <div style={{ fontSize:12, fontWeight:600, color:inv.estadoColor }}>{inv.estado} · {inv.info}</div>
                    <button style={{ padding:'5px 12px', borderRadius:6, background:inv.btnColor, color:'#fff', fontSize:11, fontWeight:600, cursor:'pointer', border:'none', fontFamily:'Inter,sans-serif' }}>{inv.btn}</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:'#FFF8E1', borderRadius:12, border:'1px solid #FFB74D', padding:'14px 16px' }}>
              <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#E65100', marginBottom:4 }}>⚠ Nota operativa</div>
              <div style={{ fontSize:12, color:'#888', lineHeight:1.6 }}>Un vehículo no registrado que intenta <strong>salir</strong> del campus debe tratarse con mayor criticidad. Use Detalle de Evento y Resolución Manual o Contingencia. Este formulario es solo para <strong>ENTRADAS</strong>.</div>
            </div>
          </div>
        </div>

      </Box>
    </DashboardTemplate>
  );
};

export default RegistroInvitadoPage;
