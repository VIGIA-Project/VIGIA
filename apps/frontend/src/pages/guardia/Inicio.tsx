import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';

export const GuardiaInicioPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <DashboardTemplate rol="GUARD" pageTitle="Inicio del turno">
      <Box sx={{ fontFamily:'Inter,sans-serif' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:22, fontWeight:700, color:'#0F172A' }}>Bienvenido, Kevin 👋</div>
            <div style={{ fontSize:13, color:'#6B7280', marginTop:3 }}>Turno iniciado: 07:00 a.m. · Punto: Acceso Norte</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ background:'#F0FDF4', borderRadius:8, padding:'7px 14px', border:'1px solid #BBF7D0', fontSize:12, color:'#16A34A', fontWeight:600 }}>
              ⏱ Tiempo promedio: <strong style={{ color:'#0F172A' }}>1:45 min</strong>
            </div>
            <div style={{ fontSize:12, color:'#6B7280', background:'#fff', borderRadius:8, padding:'7px 14px', border:'1px solid #E2E8F0' }}>
              Hoy — 08 Jul 2026 · 13:25
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
          {[
            { label:'Pendientes entrada', value:'3', color:'#F2851F', bg:'#FFF3E0', icon:'⏱', sub:'Requieren decisión', filtro:'ENTRADA', ruta:'/guardia/cola-eventos' },
            { label:'Pendientes salida',  value:'4', color:'#C62828', bg:'#FEE2E2', icon:'⚠', sub:'2 salidas riesgosas', filtro:'SALIDA',  ruta:'/guardia/cola-eventos' },
            { label:'Invitados activos',  value:'2', color:'#0D5CCF', bg:'#EEF2FF', icon:'👤', sub:'1 por expirar',       filtro:null,     ruta:'/guardia/invitados' },
            { label:'Eventos del turno',  value:'23', color:'#19D6C4', bg:'#E0FDF4', icon:'📊', sub:'12 ent · 11 sal',   filtro:null,     ruta:'/guardia/historial' },
          ].map(k => (
            <div key={k.label}
              onClick={() => navigate(k.ruta, k.filtro ? { state:{ filtro:k.filtro } } : undefined)}
              style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', padding:20, borderTop:`3px solid ${k.color}`, boxShadow:'0 2px 8px rgba(10,47,134,0.06)', cursor:'pointer', transition:'all 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow=`0 4px 16px rgba(10,47,134,0.14)`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow='0 2px 8px rgba(10,47,134,0.06)')}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:600, color:'#94A3B8', textTransform:'uppercase', letterSpacing:.5 }}>{k.label}</div>
                <div style={{ width:32, height:32, borderRadius:8, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{k.icon}</div>
              </div>
              <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:36, fontWeight:800, color: k.label==='Pendientes salida'?k.color:'#0F172A', lineHeight:1 }}>{k.value}</div>
              <div style={{ fontSize:12, color:k.color, marginTop:8 }}>● {k.sub}</div>
              <div style={{ fontSize:10, color:'#94A3B8', marginTop:4 }}>Click para ver →</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', boxShadow:'0 2px 8px rgba(10,47,134,0.06)' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86', display:'flex', alignItems:'center', gap:8 }}>
                ⏱ Cola de eventos
                <span style={{ background:'#FEF3C7', color:'#92400E', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, border:'1px solid #FDE68A' }}>7</span>
              </div>
              <span style={{ fontSize:12, color:'#0D5CCF', fontWeight:500, cursor:'pointer' }} onClick={() => navigate('/guardia/cola-eventos')}>Ver cola →</span>
            </div>
            {[
              { placa:'PCB-1234', tipo:'SALIDA',  motivo:'CONDUCTOR NO AUTORIZADO', color:'#C62828', bg:'#FFF8F8', t:'1 min', filtro:'SALIDA' },
              { placa:'ABC-5678', tipo:'ENTRADA', motivo:'VEHICULO_NO_REGISTRADO',  color:'#F2851F', bg:'#fff',    t:'3 min', filtro:'ENTRADA' },
              { placa:'XYZ-9012', tipo:'SALIDA',  motivo:'EVIDENCIA_INSUFICIENTE',  color:'#EDB200', bg:'#fff',    t:'5 min', filtro:'SALIDA' },
            ].map(e => (
              <div key={e.placa} onClick={() => navigate('/guardia/cola-eventos', { state:{ filtro:e.filtro } })}
                style={{ padding:'12px 20px', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid #F8F8F8', background:e.bg, cursor:'pointer' }}
                onMouseEnter={ev => (ev.currentTarget.style.background='#F0F7FF')}
                onMouseLeave={ev => (ev.currentTarget.style.background=e.bg)}>
                <div style={{ width:3, borderRadius:2, background:e.color, alignSelf:'stretch', flexShrink:0 }} />
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:700, color:'#0A2F86', background:'#EEF2FF', padding:'3px 9px', borderRadius:6, border:'1px solid #C7D2FE', whiteSpace:'nowrap' }}>{e.placa}</div>
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:9, fontWeight:600, padding:'2px 7px', borderRadius:20, background: e.tipo==='ENTRADA'?'#E3F2FD':'#EDE7F6', color: e.tipo==='ENTRADA'?'#1565C0':'#4527A0', marginRight:6 }}>{e.tipo}</span>
                  <span style={{ fontSize:11, fontWeight:600, color:e.color }}>{e.motivo}</span>
                </div>
                <div style={{ fontSize:10, color:e.color, fontWeight:600 }}>{e.t}</div>
              </div>
            ))}
            <div onClick={() => navigate('/guardia/cola-eventos')} style={{ padding:'12px 20px', textAlign:'center', fontSize:12, color:'#0D5CCF', fontWeight:500, cursor:'pointer', borderTop:'1px solid #F1F5F9' }}
              onMouseEnter={e => (e.currentTarget.style.background='#F8FAFF')}
              onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
              Ver los 4 eventos restantes →
            </div>
          </div>

          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', boxShadow:'0 2px 8px rgba(10,47,134,0.06)' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86', display:'flex', alignItems:'center', gap:8 }}>
                🔔 Alertas recientes
                <span style={{ background:'#FEE2E2', color:'#991B1B', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, border:'1px solid #FECACA' }}>2 no atendidas</span>
              </div>
              <span style={{ fontSize:12, color:'#0D5CCF', fontWeight:500, cursor:'pointer' }} onClick={() => navigate('/guardia/alertas')}>Ver alertas →</span>
            </div>
            {[
              { titulo:'Conductor no reconocido · PCB-1234', sev:'ALTA',  estado:'GENERADA',  color:'#C62828', bg:'#FEE2E2', t:'1 min',  leida:false },
              { titulo:'Vehículo no registrado · ABC-5678',  sev:'MEDIA', estado:'ENTREGADA', color:'#F2851F', bg:'#FEF9C3', t:'3 min',  leida:false },
              { titulo:'Invitado con permanencia expirada',  sev:'MEDIA', estado:'GENERADA',  color:'#F2851F', bg:'#FEF9C3', t:'18 min', leida:false },
              { titulo:'Servicio biométrico restablecido',   sev:'INFO',  estado:'ATENDIDA',  color:'#0277BD', bg:'#E0F2FE', t:'20 min', leida:true },
            ].map((a, i) => (
              <div key={i} onClick={() => navigate('/guardia/alertas')}
                style={{ padding:'12px 20px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid #F8F8F8', opacity: a.leida?0.6:1, cursor:'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background='#F8FAFF')}
                onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                <div style={{ width:8, height:8, borderRadius:'50%', background: a.leida?'#E2E8F0':a.color, flexShrink:0 }} />
                <div style={{ width:32, height:32, borderRadius:8, background:a.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14 }}>🔔</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color: a.leida?'#6B7280':'#0F172A' }}>{a.titulo}</div>
                  <div style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>{a.sev} · <span style={{ color:a.color, fontWeight:600 }}>{a.estado}</span></div>
                </div>
                <div style={{ fontSize:10, color:'#94A3B8' }}>{a.t}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', boxShadow:'0 2px 8px rgba(10,47,134,0.06)' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>📊 Resumen del turno</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, padding:'16px 18px 10px' }}>
              {[{v:'12',l:'Entradas',c:'#2E7D32',bg:'#F0FFF4',b:'#BBF7D0'},{v:'11',l:'Salidas',c:'#4527A0',bg:'#EDE7F6',b:'#D1C4E9'},{v:'2',l:'Contingencias',c:'#E65100',bg:'#FFF3E0',b:'#FFE0B2'}].map(x=>(
                <div key={x.l} style={{ textAlign:'center', padding:'14px 8px', background:x.bg, borderRadius:10, border:`1px solid ${x.b}` }}>
                  <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:28, fontWeight:800, color:x.c }}>{x.v}</div>
                  <div style={{ fontSize:11, color:'#6B7280', marginTop:4 }}>{x.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, padding:'0 18px 16px' }}>
              {[{v:'16',l:'Automáticos',c:'#19D6C4'},{v:'5',l:'Manuales',c:'#0D5CCF'}].map(x=>(
                <div key={x.l} style={{ textAlign:'center', padding:'12px 8px', background:'#F8FAFC', borderRadius:10, border:'1px solid #E2E8F0' }}>
                  <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:24, fontWeight:700, color:x.c }}>{x.v}</div>
                  <div style={{ fontSize:11, color:'#6B7280', marginTop:3 }}>{x.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', boxShadow:'0 2px 8px rgba(10,47,134,0.06)' }}>
            <div style={{ padding:'14px 20px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>⚡ Actividad reciente</div>
              <span style={{ fontSize:12, color:'#0D5CCF', fontWeight:500, cursor:'pointer' }} onClick={() => navigate('/guardia/historial')}>Ver historial →</span>
            </div>
            {[
              { dot:'#4CAF50', txt:'Acceso autorizado · PBW-1234 · ENTRADA', t:'2 min' },
              { dot:'#0D5CCF', txt:'Resolución manual · MGA-0011 · SALIDA aprobada', t:'8 min' },
              { dot:'#C62828', txt:'Acceso denegado · PCE-9988 · ENTRADA', t:'15 min' },
              { dot:'#F2851F', txt:'Contingencia · PBA-5544 · Fallo OCR', t:'22 min' },
            ].map((a,i)=>(
              <div key={i} onClick={() => navigate('/guardia/historial')}
                style={{ padding:'11px 20px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid #F8F8F8', cursor:'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background='#F8FAFF')}
                onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                <div style={{ width:9, height:9, borderRadius:'50%', background:a.dot, flexShrink:0 }} />
                <div style={{ flex:1, fontSize:12, color:'#374151' }}>{a.txt}</div>
                <div style={{ fontSize:10, color:'#94A3B8' }}>{a.t}</div>
              </div>
            ))}
          </div>
        </div>
      </Box>
    </DashboardTemplate>
  );
};
export default GuardiaInicioPage;
