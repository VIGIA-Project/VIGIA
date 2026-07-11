import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';

const ROWS = [
  { hora:'13:24:15', placa:'PCB-1234', mov:'SALIDA', dec:'SUCCESSFUL', decClass:'ok', origen:'MANUAL', actor:'Guardia' },
  { hora:'13:21:08', placa:'ABC-5678', mov:'ENTRADA', dec:'INVITADO', decClass:'blue', origen:'INVITADO', actor:'Guardia' },
  { hora:'13:15:22', placa:'XYZ-9012', mov:'SALIDA', dec:'SUCCESSFUL', decClass:'ok', origen:'CONTINGENCIA', actor:'Guardia' },
  { hora:'12:58:01', placa:'ABC-0001', mov:'ENTRADA', dec:'SUCCESSFUL', decClass:'ok', origen:'AUTO', actor:'Sistema' },
  { hora:'12:45:33', placa:'PQR-3456', mov:'ENTRADA', dec:'DENIED', decClass:'deny', origen:'MANUAL', actor:'Guardia' },
  { hora:'12:30:10', placa:'MGA-5678', mov:'SALIDA', dec:'SUCCESSFUL', decClass:'ok', origen:'PASE_RAPIDO', actor:'Sistema' },
  { hora:'12:18:44', placa:'LKJ-9900', mov:'ENTRADA', dec:'SUCCESSFUL', decClass:'ok', origen:'AUTO', actor:'Sistema' },
  { hora:'12:05:20', placa:'PCE-9988', mov:'ENTRADA', dec:'DENIED', decClass:'deny', origen:'AUTO', actor:'Sistema' },
];

const decColors: Record<string,{bg:string;text:string}> = {
  ok:   { bg:'#DCFCE7', text:'#166534' },
  deny: { bg:'#FEE2E2', text:'#991B1B' },
  blue: { bg:'#DBEAFE', text:'#1E40AF' },
};

export const HistorialGuardiaPage: React.FC = () => {
  const navigate = useNavigate();
  const [placa, setPlaca] = useState('');
  const [mov, setMov] = useState('Todos');
  const [dec, setDec] = useState('Todos');

  const rows = ROWS.filter(r => {
    if (placa && !r.placa.includes(placa.toUpperCase())) return false;
    if (mov !== 'Todos' && r.mov !== mov) return false;
    if (dec !== 'Todos' && r.dec !== dec) return false;
    return true;
  });

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Historial de eventos">
      <Box sx={{ fontFamily:'Inter,sans-serif' }}>

        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:20, fontWeight:700, color:'#0F172A' }}>Historial de eventos <span style={{ fontSize:14, color:'#6B7280', fontWeight:400 }}>— Acceso Norte</span></div>
            <div style={{ fontSize:12, color:'#6B7280', marginTop:3 }}>{ROWS.length} eventos registrados · Turno actual</div>
          </div>
        </div>

        {/* FILTROS */}
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid #E2E8F0', padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <input value={placa} onChange={e=>setPlaca(e.target.value)} placeholder="Buscar placa..." style={{ padding:'7px 12px', borderRadius:7, border:'1px solid #E2E8F0', fontSize:12, fontFamily:'"Exo 2",sans-serif', textTransform:'uppercase', flex:1, minWidth:120 }} />
          <select value={mov} onChange={e=>setMov(e.target.value)} style={{ padding:'7px 12px', borderRadius:7, border:'1px solid #E2E8F0', fontSize:12, fontFamily:'Inter,sans-serif' }}>
            <option>Todos</option><option>ENTRADA</option><option>SALIDA</option>
          </select>
          <select value={dec} onChange={e=>setDec(e.target.value)} style={{ padding:'7px 12px', borderRadius:7, border:'1px solid #E2E8F0', fontSize:12, fontFamily:'Inter,sans-serif' }}>
            <option>Todos</option><option>SUCCESSFUL</option><option>DENIED</option><option>INVITADO</option>
          </select>
        </div>

        <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ background:'#F8F9FF' }}>
                {['Hora','Placa','Movimiento','Decisión','Origen','Actor',''].map(h=>(
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:600, color:'#6B7280', borderBottom:'2px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i} style={{ borderBottom:'1px solid #F8F8F8', cursor:'pointer' }} onMouseEnter={e=>(e.currentTarget.style.background='#F8F9FF')} onMouseLeave={e=>(e.currentTarget.style.background='')}>
                  <td style={{ padding:'11px 14px', color:'#6B7280', fontFamily:'"Exo 2",sans-serif' }}>{r.hora}</td>
                  <td style={{ padding:'11px 14px' }}>
                    <span style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:700, color:'#0A2F86', background:'#EEF2FF', padding:'3px 9px', borderRadius:6, border:'1px solid #C7D2FE' }}>{r.placa}</span>
                  </td>
                  <td style={{ padding:'11px 14px' }}>
                    <span style={{ fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:20, background: r.mov==='ENTRADA'?'#E3F2FD':'#EDE7F6', color: r.mov==='ENTRADA'?'#1565C0':'#4527A0' }}>{r.mov}</span>
                  </td>
                  <td style={{ padding:'11px 14px' }}>
                    <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:decColors[r.decClass].bg, color:decColors[r.decClass].text }}>{r.dec}</span>
                  </td>
                  <td style={{ padding:'11px 14px', color:'#6B7280' }}>{r.origen}</td>
                  <td style={{ padding:'11px 14px', color:'#374151' }}>{r.actor}</td>
                  <td style={{ padding:'11px 14px' }}>
                    <button onClick={() => navigate(`/guardia/revision-manual`)} style={{ padding:'4px 10px', borderRadius:6, fontSize:10, fontWeight:600, cursor:'pointer', border:'1px solid #E2E8F0', background:'#F8FAFC', color:'#374151', fontFamily:'Inter,sans-serif' }}>Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid #F1F5F9' }}>
            <span style={{ fontSize:12, color:'#6B7280' }}>Mostrando {rows.length} de {ROWS.length} eventos</span>
            <div style={{ display:'flex', gap:8 }}>
              <button style={{ padding:'6px 14px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', border:'1px solid #E2E8F0', background:'#fff', color:'#555', fontFamily:'Inter,sans-serif' }}>← Anterior</button>
              <button style={{ padding:'6px 14px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', background:'#0D5CCF', color:'#fff', border:'none', fontFamily:'Inter,sans-serif' }}>Siguiente →</button>
            </div>
          </div>
        </div>

      </Box>
    </DashboardTemplate>
  );
};

export default HistorialGuardiaPage;
