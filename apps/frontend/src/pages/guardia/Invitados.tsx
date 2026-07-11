import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';

type EstadoInvitado = 'VIGENTE' | 'EXPIRADO' | 'CERRADO';

interface Invitado {
  id: number;
  nombre: string;
  cedula: string;
  placa: string;
  facultad: string;
  motivo: string;
  tiempoAutorizado: number;
  registradoEn: string;
  expiraEn: string;
  estado: EstadoInvitado;
  minutosRestantes?: number;
  minutosExcedidos?: number;
  guardia: string;
}

const INVITADOS: Invitado[] = [
  { id:1, nombre:'Juan Pérez', cedula:'1700112233', placa:'ABC-0001', facultad:'Ingeniería', motivo:'VISITA_ACADEMICA', tiempoAutorizado:2, registradoEn:'11:20', expiraEn:'13:20', estado:'VIGENTE', minutosRestantes:83, guardia:'Kevin Chicaisa' },
  { id:2, nombre:'Ana García', cedula:'1700445566', placa:'DEF-0002', facultad:'Medicina', motivo:'TRAMITE_ADMINISTRATIVO', tiempoAutorizado:2, registradoEn:'11:05', expiraEn:'13:05', estado:'EXPIRADO', minutosExcedidos:18, guardia:'Kevin Chicaisa' },
  { id:3, nombre:'Luis Torres', cedula:'1700778899', placa:'GHI-0003', facultad:'Derecho', motivo:'ENTREGA_PROVEEDOR', tiempoAutorizado:1, registradoEn:'09:30', expiraEn:'10:30', estado:'CERRADO', guardia:'Kevin Chicaisa' },
  { id:4, nombre:'María Soto', cedula:'1700991122', placa:'JKL-0004', facultad:'Arquitectura', motivo:'VISITA_ACADEMICA', tiempoAutorizado:4, registradoEn:'10:00', expiraEn:'14:00', estado:'VIGENTE', minutosRestantes:197, guardia:'Kevin Chicaisa' },
];

const estadoCfg: Record<EstadoInvitado,{bg:string;text:string;border:string}> = {
  VIGENTE:  { bg:'#F0FFF4', text:'#166534', border:'#BBF7D0' },
  EXPIRADO: { bg:'#FEF2F2', text:'#C62828', border:'#FECACA' },
  CERRADO:  { bg:'#F1F5F9', text:'#475569', border:'#E2E8F0' },
};

const motivoLabel: Record<string,string> = {
  VISITA_ACADEMICA:       'Visita académica',
  TRAMITE_ADMINISTRATIVO: 'Trámite administrativo',
  ENTREGA_PROVEEDOR:      'Entrega de proveedor',
  EMERGENCIA:             'Emergencia',
  OTRO:                   'Otro',
};

export const InvitadosPage: React.FC = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState<'Todos'|EstadoInvitado>('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [invitados, setInvitados] = useState(INVITADOS);
  const [modalSalida, setModalSalida] = useState<Invitado|null>(null);

  const cerrarSalida = (id: number) => {
    setInvitados(prev => prev.map(inv => inv.id===id ? {...inv, estado:'CERRADO' as EstadoInvitado} : inv));
    setModalSalida(null);
  };

  const visible = invitados.filter(inv => {
    if (filtro !== 'Todos' && inv.estado !== filtro) return false;
    if (busqueda && !inv.nombre.toLowerCase().includes(busqueda.toLowerCase()) && !inv.placa.includes(busqueda.toUpperCase())) return false;
    return true;
  });

  const vigentes  = invitados.filter(i => i.estado === 'VIGENTE').length;
  const expirados = invitados.filter(i => i.estado === 'EXPIRADO').length;
  const cerrados  = invitados.filter(i => i.estado === 'CERRADO').length;

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Invitados en campus">
      <Box sx={{ fontFamily:'Inter,sans-serif' }}>

        {/* HEADER */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
          <div>
            <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:20, fontWeight:700, color:'#0F172A' }}>
              Invitados en campus <span style={{ fontSize:14, color:'#6B7280', fontWeight:400 }}>— Acceso Norte</span>
            </div>
            <div style={{ fontSize:12, color:'#6B7280', marginTop:3 }}>
              {vigentes} vigentes
              {expirados > 0 && <span style={{ color:'#C62828', fontWeight:600 }}> · {expirados} expirados ⚠</span>}
            </div>
          </div>
          <button
            onClick={() => navigate('/guardia/registro-invitado')}
            style={{ padding:'10px 20px', borderRadius:10, background:'#0D5CCF', color:'#fff', fontSize:13, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', gap:8 }}>
            👤 Registrar nuevo invitado
          </button>
        </div>

        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
          {[
            { label:'Vigentes',     value:vigentes,  color:'#2E7D32', bg:'#F0FFF4', border:'#BBF7D0', icon:'✅' },
            { label:'Expirados',    value:expirados, color:'#C62828', bg:'#FEF2F2', border:'#FECACA', icon:'⚠' },
            { label:'Cerrados hoy', value:cerrados,  color:'#475569', bg:'#F1F5F9', border:'#E2E8F0', icon:'🔒' },
          ].map(k => (
            <div key={k.label} style={{ background:k.bg, borderRadius:12, border:`1px solid ${k.border}`, padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ fontSize:24 }}>{k.icon}</div>
              <div>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:26, fontWeight:800, color:k.color }}>{k.value}</div>
                <div style={{ fontSize:12, color:'#6B7280' }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* FILTROS */}
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid #E2E8F0', padding:'12px 18px', marginBottom:16, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o placa..."
            style={{ flex:1, minWidth:180, padding:'7px 12px', borderRadius:7, border:'1px solid #E2E8F0', fontSize:12, fontFamily:'Inter,sans-serif' }}
          />
          <div style={{ display:'flex', gap:8 }}>
            {(['Todos','VIGENTE','EXPIRADO','CERRADO'] as const).map(f => (
              <button key={f} onClick={() => setFiltro(f)} style={{
                padding:'6px 14px', borderRadius:20, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif',
                background: filtro===f ? '#0D5CCF' : '#fff',
                color: filtro===f ? '#fff' : '#374151',
                border: filtro===f ? 'none' : '1.5px solid #E2E8F0',
              }}>{f}</button>
            ))}
          </div>
        </div>

        {/* LISTA */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {visible.length === 0 && (
            <div style={{ padding:40, textAlign:'center', background:'#FAFBFC', borderRadius:14, border:'1px dashed #E2E8F0' }}>
              <div style={{ fontSize:14, color:'#6B7280' }}>Sin invitados en este filtro</div>
            </div>
          )}
          {visible.map(inv => {
            const ec = estadoCfg[inv.estado];
            return (
              <div key={inv.id} style={{ background:'#fff', borderRadius:14, border:`1px solid ${ec.border}`, boxShadow:'0 2px 8px rgba(10,47,134,0.06)', overflow:'hidden' }}>
                <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'#0D5CCF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#fff', flexShrink:0 }}>
                    {inv.nombre.split(' ').map((n:string) => n[0]).join('').slice(0,2)}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                      <div style={{ fontSize:15, fontWeight:700, color:'#0F172A' }}>{inv.nombre}</div>
                      <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:ec.bg, color:ec.text, border:`1px solid ${ec.border}` }}>{inv.estado}</span>
                      {inv.estado === 'EXPIRADO' && (
                        <span style={{ fontSize:10, fontWeight:700, color:'#C62828', background:'#FEF2F2', padding:'3px 8px', borderRadius:20 }}>⚠ {inv.minutosExcedidos} min excedidos</span>
                      )}
                    </div>
                    <div style={{ display:'flex', gap:12, flexWrap:'wrap', fontSize:12, color:'#6B7280' }}>
                      <span>CI: {inv.cedula}</span>
                      <span>·</span>
                      <span style={{ fontFamily:'"Exo 2",sans-serif', fontWeight:700, color:'#0A2F86' }}>{inv.placa}</span>
                      <span>·</span>
                      <span>{inv.facultad}</span>
                      <span>·</span>
                      <span>{motivoLabel[inv.motivo]}</span>
                    </div>
                    <div style={{ fontSize:11, color:'#94A3B8', marginTop:4 }}>
                      Ingresó: {inv.registradoEn} · Expira: {inv.expiraEn} · Autorizado: {inv.tiempoAutorizado}h · Guardia: {inv.guardia}
                    </div>
                    {inv.estado === 'VIGENTE' && inv.minutosRestantes && (
                      <div style={{ marginTop:8 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'#6B7280', marginBottom:3 }}>
                          <span>Tiempo restante</span>
                          <span style={{ fontWeight:600, color:'#2E7D32' }}>{Math.floor(inv.minutosRestantes/60)}h {inv.minutosRestantes%60}min</span>
                        </div>
                        <div style={{ height:6, background:'#E2E8F0', borderRadius:3 }}>
                          <div style={{ width:`${Math.min(100,(inv.minutosRestantes/(inv.tiempoAutorizado*60))*100)}%`, height:'100%', background:'#2E7D32', borderRadius:3 }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
                    {inv.estado === 'VIGENTE' && (
                      <button onClick={() => setModalSalida(inv)}
                        style={{ padding:'9px 16px', borderRadius:8, background:'#0D5CCF', color:'#fff', fontSize:12, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                        ✓ Registrar salida
                      </button>
                    )}
                    {inv.estado === 'EXPIRADO' && (
                      <>
                        <button onClick={() => setModalSalida(inv)}
                          style={{ padding:'9px 16px', borderRadius:8, background:'#C62828', color:'#fff', fontSize:12, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                          ✓ Registrar salida
                        </button>
                        <button style={{ padding:'9px 16px', borderRadius:8, background:'#fff', color:'#F2851F', fontSize:12, fontWeight:600, border:'1.5px solid #FDE68A', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                          ⚠ Reportar
                        </button>
                      </>
                    )}
                    {inv.estado === 'CERRADO' && (
                      <span style={{ fontSize:11, color:'#94A3B8', fontStyle:'italic' }}>Salida registrada</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL CONFIRMAR SALIDA */}
        {modalSalida && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
            <div style={{ background:'#fff', borderRadius:16, padding:28, width:400, boxShadow:'0 20px 60px rgba(0,0,0,0.2)', border:'1px solid #BBF7D0' }}>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:18, fontWeight:800, color:'#2E7D32' }}>✓ Confirmar salida</div>
                <div style={{ fontSize:12, color:'#6B7280', marginTop:3 }}>Esta acción cerrará el registro del invitado</div>
              </div>
              <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, padding:'14px 18px', marginBottom:16 }}>
                <div style={{ fontSize:16, fontWeight:700, color:'#0F172A' }}>{modalSalida.nombre}</div>
                <div style={{ fontSize:12, color:'#6B7280', marginTop:4 }}>
                  {modalSalida.placa} · {modalSalida.facultad} · Ingresó: {modalSalida.registradoEn}
                </div>
                {modalSalida.estado === 'EXPIRADO' && (
                  <div style={{ fontSize:11, color:'#C62828', marginTop:6, fontWeight:600 }}>⚠ Permanencia excedida {modalSalida.minutosExcedidos} min</div>
                )}
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setModalSalida(null)}
                  style={{ flex:1, padding:11, borderRadius:8, background:'#fff', color:'#555', fontSize:13, fontWeight:500, border:'1.5px solid #E2E8F0', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  Cancelar
                </button>
                <button onClick={() => cerrarSalida(modalSalida.id)}
                  style={{ flex:1, padding:11, borderRadius:8, background:'#2E7D32', color:'#fff', fontSize:13, fontWeight:700, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  ✓ Confirmar salida
                </button>
              </div>
            </div>
          </div>
        )}

      </Box>
    </DashboardTemplate>
  );
};

export default InvitadosPage;
