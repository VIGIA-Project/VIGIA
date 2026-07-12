import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';

type Estado = 'GENERADA' | 'ENTREGADA' | 'ATENDIDA';
type Severidad = 'ALTA' | 'MEDIA' | 'INFORMATIVA';

interface Alerta {
  id: number; titulo: string; descripcion: string; placa: string;
  severidad: Severidad; estado: Estado; causa: string; tiempo: string;
  accion?: 'ver_evento' | 'registrar_invitado' | 'ver_invitado' | null;
}

const ALERTAS_INICIAL: Alerta[] = [
  { id:1, titulo:'Salida con conductor no reconocido', descripcion:'Vehículo PCB-1234 intentó salir con conductor no identificado. Posible retiro no autorizado.', placa:'PCB-1234', severidad:'ALTA', estado:'GENERADA', causa:'POSIBLE_SALIDA_NO_AUTORIZADA', tiempo:'hace 1 min', accion:'ver_evento' },
  { id:2, titulo:'Vehículo no registrado solicita ingreso', descripcion:'ABC-5678 no existe en el registro institucional. Requiere registro de invitado o denegación.', placa:'ABC-5678', severidad:'MEDIA', estado:'ENTREGADA', causa:'VEHICULO_NO_REGISTRADO', tiempo:'hace 3 min', accion:'registrar_invitado' },
  { id:3, titulo:'Invitado con permanencia expirada', descripcion:'DEF-0002 (Ana García) lleva 18 minutos sobre el tiempo autorizado.', placa:'DEF-0002', severidad:'MEDIA', estado:'GENERADA', causa:'PERMANENCIA_EXPIRADA', tiempo:'hace 18 min', accion:'ver_invitado' },
  { id:4, titulo:'Servicio biométrico restablecido', descripcion:'Acceso Norte vuelve a operar con normalidad. El servicio estuvo caído 4 minutos.', placa:'—', severidad:'INFORMATIVA', estado:'ATENDIDA', causa:'SERVICIO_RESTABLECIDO', tiempo:'hace 20 min', accion:null },
];

const sevCfg: Record<Severidad,{border:string;bg:string;text:string;icon:string}> = {
  ALTA:        { border:'#C62828', bg:'#FEF2F2', text:'#991B1B', icon:'⚠' },
  MEDIA:       { border:'#F2851F', bg:'#FFF7ED', text:'#92400E', icon:'⚠' },
  INFORMATIVA: { border:'#0277BD', bg:'#E0F2FE', text:'#0277BD', icon:'ℹ' },
};
const estadoCfg: Record<Estado,{bg:string;text:string}> = {
  GENERADA:  { bg:'#FEE2E2', text:'#C62828' },
  ENTREGADA: { bg:'#EDE7F6', text:'#4527A0' },
  ATENDIDA:  { bg:'#DCFCE7', text:'#166534' },
};
const accionLabel: Record<string,string> = {
  ver_evento:'Ver evento', registrar_invitado:'Registrar invitado', ver_invitado:'Ver invitado',
};

export const AlertasGuardiaPage: React.FC = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState<'Todas'|Severidad|'No atendidas'>('Todas');
  const [alertas, setAlertas] = useState(ALERTAS_INICIAL);

  const atender = (id: number) => setAlertas(prev => prev.map(a => a.id===id ? {...a, estado:'ATENDIDA' as Estado} : a));
  const atenderTodas = () => setAlertas(prev => prev.map(a => ({...a, estado:'ATENDIDA' as Estado})));
  const noAtendidas = alertas.filter(a => a.estado !== 'ATENDIDA').length;

  const handleAccion = (alerta: Alerta) => {
    switch(alerta.accion) {
      case 'ver_evento':         navigate('/guardia/revision'); break;
      case 'registrar_invitado': navigate('/guardia/registro-invitado', { state:{ placa:alerta.placa } }); break;
      case 'ver_invitado':       navigate('/guardia/invitados'); break;
    }
  };

  const visible = alertas.filter(a => {
    if (filtro === 'Todas') return true;
    if (filtro === 'No atendidas') return a.estado !== 'ATENDIDA';
    return a.severidad === filtro;
  });

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Alertas del turno">
      <Box sx={{ fontFamily:'Inter,sans-serif' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
          <div>
            <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:20, fontWeight:700, color:'#0F172A' }}>Alertas del turno <span style={{ fontSize:14, color:'#6B7280', fontWeight:400 }}>— Acceso Norte</span></div>
            <div style={{ fontSize:12, color:'#6B7280', marginTop:3 }}>{alertas.length} alertas · {noAtendidas} no atendidas</div>
          </div>
          <button onClick={atenderTodas}
            style={{ padding:'9px 18px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', background:'#fff', color:'#0D5CCF', border:'1.5px solid #C7D2FE', fontFamily:'Inter,sans-serif' }}>
            ✓ Marcar todas atendidas
          </button>
        </div>

        <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
          {(['Todas','ALTA','MEDIA','INFORMATIVA','No atendidas'] as const).map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding:'6px 14px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif',
              background: filtro===f ? '#0D5CCF' : '#fff',
              color: filtro===f ? '#fff' : '#374151',
              border: filtro===f ? 'none' : '1.5px solid #E2E8F0',
            }}>
              {f} {f==='Todas' ? alertas.length : f==='No atendidas' ? noAtendidas : alertas.filter(a=>a.severidad===f).length}
            </button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:18, alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {visible.length === 0 && (
              <div style={{ padding:40, textAlign:'center', background:'#FAFBFC', borderRadius:14, border:'1px dashed #E2E8F0' }}>
                <div style={{ fontSize:14, color:'#6B7280' }}>✅ Sin alertas en este filtro</div>
              </div>
            )}
            {visible.map(a => {
              const sc = sevCfg[a.severidad];
              const ec = estadoCfg[a.estado];
              return (
                <div key={a.id} style={{ background:'#fff', borderRadius:14, border:`1px solid ${sc.bg}`, borderLeft:`4px solid ${sc.border}`, boxShadow:'0 2px 8px rgba(10,47,134,0.06)', overflow:'hidden', opacity: a.estado==='ATENDIDA'?0.75:1 }}>
                  <div style={{ padding:'16px 20px', display:'flex', alignItems:'flex-start', gap:14 }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:sc.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 }}>{sc.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                        <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:sc.bg, color:sc.text }}>{a.severidad}</span>
                        <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:ec.bg, color:ec.text }}>{a.estado}</span>
                      </div>
                      <div style={{ fontSize:14, fontWeight:600, color:'#1F2A44', marginBottom:4 }}>{a.titulo}</div>
                      <div style={{ fontSize:13, color:'#555', marginBottom:8, lineHeight:1.5 }}>{a.descripcion}</div>
                      <div style={{ fontSize:11, color:'#94A3B8' }}>Causa: {a.causa} · {a.tiempo}</div>
                      {a.estado !== 'ATENDIDA' && (
                        <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
                          {a.accion && (
                            <button onClick={() => handleAccion(a)}
                              style={{ padding:'7px 14px', borderRadius:7, fontSize:11, fontWeight:600, cursor:'pointer', background:'#0D5CCF', color:'#fff', border:'none', fontFamily:'Inter,sans-serif' }}>
                              {accionLabel[a.accion]}
                            </button>
                          )}
                          <button onClick={() => atender(a.id)}
                            style={{ padding:'7px 14px', borderRadius:7, fontSize:11, fontWeight:600, cursor:'pointer', background:'#fff', color:'#555', border:'1px solid #E2E8F0', fontFamily:'Inter,sans-serif' }}>
                            Marcar atendida
                          </button>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize:10, color:'#94A3B8', whiteSpace:'nowrap' }}>{a.tiempo}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>Resumen</div>
              <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:10 }}>
                {(['ALTA','MEDIA','INFORMATIVA'] as Severidad[]).map(s=>(
                  <div key={s} style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                    <span style={{ color:'#6B7280' }}>{s}</span>
                    <span style={{ fontWeight:700, color:sevCfg[s].border }}>{alertas.filter(a=>a.severidad===s).length}</span>
                  </div>
                ))}
                <div style={{ height:1, background:'#F1F5F9', margin:'4px 0' }} />
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                  <span style={{ color:'#6B7280' }}>No atendidas</span>
                  <span style={{ fontWeight:700, color:'#C62828' }}>{noAtendidas}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                  <span style={{ color:'#6B7280' }}>Atendidas</span>
                  <span style={{ fontWeight:700, color:'#16A34A' }}>{alertas.length - noAtendidas}</span>
                </div>
              </div>
            </div>
            <div style={{ background:'#EEF2FF', borderRadius:12, border:'1px solid #C7D2FE', padding:'14px 16px' }}>
              <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86', marginBottom:8 }}>Accesos rápidos</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <button onClick={() => navigate('/guardia/cola')}
                  style={{ padding:'9px 14px', borderRadius:8, background:'#0D5CCF', color:'#fff', fontSize:12, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', textAlign:'left' }}>
                  ⏱ Ver cola de eventos
                </button>
                <button onClick={() => navigate('/guardia/invitados')}
                  style={{ padding:'9px 14px', borderRadius:8, background:'#fff', color:'#374151', fontSize:12, fontWeight:600, border:'1.5px solid #E2E8F0', cursor:'pointer', fontFamily:'Inter,sans-serif', textAlign:'left' }}>
                  👤 Ver invitados
                </button>
                <button onClick={() => navigate('/guardia/contingencia')}
                  style={{ padding:'9px 14px', borderRadius:8, background:'#fff', color:'#F2851F', fontSize:12, fontWeight:600, border:'1.5px solid #FDE68A', cursor:'pointer', fontFamily:'Inter,sans-serif', textAlign:'left' }}>
                  ⚠ Registrar contingencia
                </button>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </DashboardTemplate>
  );
};
export default AlertasGuardiaPage;
