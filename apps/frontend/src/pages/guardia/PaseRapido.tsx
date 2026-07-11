import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';

export const PaseRapidoPage: React.FC = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('VIG-A7K3M2');
  const [validado, setValidado] = useState(false);

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Validación de pase rápido">
      <Box sx={{ fontFamily:'Inter,sans-serif' }}>

        <div onClick={() => navigate('/guardia/cola-eventos')} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'#0D5CCF', fontWeight:500, cursor:'pointer', padding:'5px 12px', borderRadius:8, border:'1px solid #C7D2FE', background:'#EEF2FF', marginBottom:18 }}>
          ← Cola de pendientes
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:18, alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* EVENTO */}
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>Evento detectado</div>
                <div style={{ display:'flex', gap:6 }}>
                  <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'#EDE7F6', color:'#4527A0' }}>SALIDA</span>
                  <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'#FEF9C3', color:'#854D0E' }}>PENDING_VERIFY</span>
                </div>
              </div>
              <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:22, fontWeight:800, color:'#0A2F86', background:'#EEF2FF', padding:'7px 16px', borderRadius:8, border:'1px solid #C7D2FE', letterSpacing:2 }}>PCB-1234</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:'#333' }}>Toyota Corolla Blanco · Acceso Norte · Carril SALIDA</div>
                  <div style={{ fontSize:11, color:'#888', marginTop:2 }}>Conductor presenta pase · 13:24:15</div>
                </div>
              </div>
            </div>

            {/* INPUT CÓDIGO */}
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>🔒 Código presentado por el conductor</div>
              <div style={{ padding:'18px 20px' }}>
                <div style={{ fontSize:13, color:'#888', marginBottom:12 }}>Ingrese o escanee el código de pase rápido que presenta el conductor.</div>
                <div style={{ display:'flex', gap:10, marginBottom:14 }}>
                  <input value={codigo} onChange={e=>setCodigo(e.target.value)} style={{ flex:1, padding:'14px 18px', borderRadius:10, border:'2px solid #0D5CCF', fontSize:22, fontFamily:'"Exo 2",sans-serif', fontWeight:700, color:'#0A2F86', letterSpacing:4, textAlign:'center', background:'#EEF2FF' }} />
                  <button style={{ padding:'12px 18px', borderRadius:10, border:'1.5px solid #E2E8F0', background:'#fff', cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'Inter,sans-serif', color:'#555' }}>📷 Escanear QR</button>
                </div>
                <button onClick={()=>setValidado(true)} style={{ width:'100%', padding:13, borderRadius:10, background:'#0D5CCF', color:'#fff', fontSize:14, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  ✓ Validar código
                </button>
              </div>
            </div>

            {/* RESULTADO */}
            {validado && (
              <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
                <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>✓ Resultado de validación</div>
                <div style={{ padding:'18px 20px' }}>
                  <div style={{ background:'#F0FDF4', borderRadius:12, border:'2px solid #4CAF50', padding:'16px 18px', marginBottom:16 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, fontFamily:'"Exo 2",sans-serif', fontSize:15, fontWeight:700, color:'#2E7D32' }}>
                      ✓ Código válido para este vehículo y movimiento
                    </div>
                    <div style={{ fontSize:13, color:'#2E7D32', marginBottom:10 }}>El código <strong>{codigo}</strong> corresponde a PCB-1234, es válido para SALIDA y será consumido al confirmar.</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {['Propietario: Antony Coello','Vence: hoy 18:00','Uso: 1 de 1'].map(t=>(
                        <span key={t} style={{ fontSize:11, fontWeight:600, background:'#C8E6C9', color:'#1B5E20', padding:'3px 10px', borderRadius:20 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <button onClick={()=>setValidado(false)} style={{ flex:1, padding:12, borderRadius:8, background:'#fff', color:'#555', fontSize:13, fontWeight:500, border:'1.5px solid #E2E8F0', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Cancelar</button>
                    <button onClick={() => navigate('/guardia/cola-eventos')} style={{ flex:2, padding:12, borderRadius:8, background:'#2E7D32', color:'#fff', fontSize:13, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>✓ Registrar y abrir barrera</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DERECHA */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>Estados posibles del pase</div>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead><tr style={{ background:'#F8F9FF' }}><th style={{ padding:'8px 14px', textAlign:'left', fontSize:10, fontWeight:600, color:'#999', borderBottom:'1px solid #F0F0F0' }}>Estado</th><th style={{ padding:'8px 14px', textAlign:'left', fontSize:10, fontWeight:600, color:'#999', borderBottom:'1px solid #F0F0F0' }}>Acción</th></tr></thead>
                <tbody>
                  {[['Válido','#166534','#DCFCE7','Registrar y abrir'],['Expirado','#991B1B','#FEE2E2','Resolución manual'],['Ya usado','#991B1B','#FEE2E2','Denegar o revisar'],['No corresponde','#991B1B','#FEE2E2','Denegar'],['Mov. incorrecto','#854D0E','#FEF9C3','Revisión manual'],['Error técnico','#854D0E','#FEF9C3','Contingencia']].map(([e,c,bg,a])=>(
                    <tr key={e} style={{ borderBottom:'1px solid #F8F8F8' }}>
                      <td style={{ padding:'9px 14px' }}><span style={{ fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:20, background:bg, color:c }}>{e}</span></td>
                      <td style={{ padding:'9px 14px', color:c, fontWeight:500 }}>{a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>Reglas del pase</div>
              <div style={{ padding:'14px 18px', display:'flex', flexDirection:'column', gap:9 }}>
                {[['✓','Cada código se consume una sola vez al pasar por garita.','#19D6C4'],['✓','El movimiento es detectado por el sistema, no elegido por el conductor.','#19D6C4'],['⚠','Un código inválido mantiene el evento en PENDING_VERIFY.','#F2851F']].map(([icon,txt,c])=>(
                  <div key={txt} style={{ display:'flex', gap:8, fontSize:12, color:'#555', alignItems:'flex-start' }}>
                    <span style={{ color:c, fontWeight:700, flexShrink:0 }}>{icon}</span>{txt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </Box>
    </DashboardTemplate>
  );
};

export default PaseRapidoPage;
