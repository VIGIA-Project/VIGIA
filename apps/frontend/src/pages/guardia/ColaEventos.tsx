import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';

type Criticidad = 'ALTA' | 'MEDIA' | 'BAJA';
type Movimiento = 'ENTRADA' | 'SALIDA';
type Motivo = 'CONDUCTOR_NO_AUTORIZADO' | 'VEHICULO_NO_REGISTRADO' | 'EVIDENCIA_INSUFICIENTE' | 'CONDUCTOR_PRESENTA_PASE';

interface Evento {
  id: number;
  placa: string;
  tiempo: string;
  minutos: number;
  movimiento: Movimiento;
  hora: string;
  motivo: Motivo;
  descripcion: string;
  criticidad: Criticidad;
  vehiculo: string;
  propietario: string;
  score?: number;
}

const EVENTOS: Evento[] = [
  { id:1, placa:'PCB-1234', tiempo:'hace 1 min', minutos:1, movimiento:'SALIDA', hora:'13:24:15', motivo:'CONDUCTOR_NO_AUTORIZADO', descripcion:'La persona capturada no coincide con ningún conductor autorizado vigente. Riesgo de retiro no autorizado del vehículo.', criticidad:'ALTA', vehiculo:'Toyota Corolla Blanco', propietario:'Carlos Mendoza' },
  { id:2, placa:'ABC-5678', tiempo:'hace 3 min', minutos:3, movimiento:'ENTRADA', hora:'13:21:08', motivo:'VEHICULO_NO_REGISTRADO', descripcion:'La placa no existe en el registro institucional. Registre como invitado o deniegue el ingreso.', criticidad:'MEDIA', vehiculo:'Vehículo no registrado', propietario:'—' },
  { id:3, placa:'XYZ-9012', tiempo:'hace 5 min', minutos:5, movimiento:'SALIDA', hora:'13:19:33', motivo:'EVIDENCIA_INSUFICIENTE', descripcion:'Score biométrico 0.62 inferior al umbral requerido 0.75. Revise la evidencia visual.', criticidad:'MEDIA', vehiculo:'Honda Civic Gris', propietario:'María López', score:0.62 },
  { id:4, placa:'MNB-4455', tiempo:'hace 7 min', minutos:7, movimiento:'SALIDA', hora:'13:17:22', motivo:'CONDUCTOR_PRESENTA_PASE', descripcion:'El conductor no fue reconocido biométricamente pero presenta un código de pase rápido.', criticidad:'BAJA', vehiculo:'Nissan Versa Plata', propietario:'Ana García' },
];

const cfgCrit: Record<Criticidad,{border:string;headerBg:string;headerText:string;dot:string;cardBg:string}> = {
  ALTA:  { border:'#FECACA', headerBg:'#FEF2F2', headerText:'#991B1B', dot:'#C62828', cardBg:'#FFF8F8' },
  MEDIA: { border:'#FDE68A', headerBg:'#FFFBEB', headerText:'#92400E', dot:'#F2851F', cardBg:'#FFFDF5' },
  BAJA:  { border:'#BFDBFE', headerBg:'#EFF6FF', headerText:'#1E3A8A', dot:'#0D5CCF', cardBg:'#F8FAFF' },
};

const cfgMov: Record<Movimiento,{bg:string;text:string}> = {
  ENTRADA: { bg:'#E3F2FD', text:'#1565C0' },
  SALIDA:  { bg:'#EDE7F6', text:'#4527A0' },
};

const motivoLabel: Record<Motivo,string> = {
  CONDUCTOR_NO_AUTORIZADO: 'Conductor no autorizado',
  VEHICULO_NO_REGISTRADO:  'Vehículo no registrado',
  EVIDENCIA_INSUFICIENTE:  'Evidencia insuficiente',
  CONDUCTOR_PRESENTA_PASE: 'Pase rápido — validación requerida',
};

const critLabel: Record<Criticidad,string> = {
  ALTA:  '⚠ Alta criticidad',
  MEDIA: 'Media criticidad',
  BAJA:  'Pase rápido',
};

export const ColaEventosPage: React.FC = () => {
  const navigate = useNavigate();
  const [filtroMov, setFiltroMov] = useState('Todos');
  const [filtroCrit, setFiltroCrit] = useState('Todos');
  const [sort, setSort] = useState('MasCritico');
  const [modalDenegar, setModalDenegar] = useState<Evento | null>(null);
  const [eventosResueltos, setEventosResueltos] = useState<number[]>([]);

  const confirmarDenegar = (ev: Evento) => {
    setEventosResueltos(prev => [...prev, ev.id]);
    setModalDenegar(null);
  };

  const ordCrit: Record<Criticidad,number> = { ALTA:0, MEDIA:1, BAJA:2 };

  const visibles = EVENTOS
    .filter(e => !eventosResueltos.includes(e.id))
    .filter(e => {
      if (filtroMov !== 'Todos' && e.movimiento !== filtroMov) return false;
      if (filtroCrit !== 'Todos' && e.criticidad !== filtroCrit) return false;
      return true;
    })
    .sort((a,b) => {
      if (sort === 'MasCritico') return ordCrit[a.criticidad] - ordCrit[b.criticidad];
      if (sort === 'MasAntiguo') return b.minutos - a.minutos;
      return a.minutos - b.minutos;
    });

  const altaCount = visibles.filter(e=>e.criticidad==='ALTA').length;

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Cola de pendientes">
      <Box sx={{ fontFamily:'Inter,sans-serif' }}>

        {/* HEADER */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
          <div>
            <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:22, fontWeight:700, color:'#0F172A' }}>Cola de pendientes</div>
            <div style={{ fontSize:13, color:'#6B7280', marginTop:3 }}>
              Acceso Norte · Ordenado por criticidad ·{' '}
              <strong style={{ color:'#C62828' }}>{visibles.length} eventos pendientes</strong>
            </div>
          </div>
          {altaCount > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'#FEE2E2', padding:'7px 16px', borderRadius:20, border:'1px solid #FECACA' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'#C62828' }} />
              <span style={{ color:'#991B1B', fontWeight:700, fontSize:12 }}>{altaCount} caso{altaCount>1?'s':''} crítico{altaCount>1?'s':''}</span>
            </div>
          )}
        </div>

        {/* FILTROS */}
        <div style={{ background:'#fff', borderRadius:12, border:'1px solid #E2E8F0', padding:'14px 18px', marginBottom:18, display:'flex', alignItems:'flex-end', gap:12, flexWrap:'wrap' }}>
          {[
            { label:'Movimiento', value:filtroMov, set:setFiltroMov, opts:['Todos','ENTRADA','SALIDA'] },
            { label:'Criticidad',  value:filtroCrit, set:setFiltroCrit, opts:['Todos','ALTA','MEDIA','BAJA'] },
            { label:'Ordenar por', value:sort, set:setSort, opts:[{v:'MasCritico',l:'Mayor criticidad'},{v:'MasAntiguo',l:'Más antiguo'},{v:'MasReciente',l:'Más reciente'}] as any },
          ].map(f => (
            <div key={f.label} style={{ display:'flex', flexDirection:'column', gap:4, flex:1, minWidth:140 }}>
              <label style={{ fontSize:11, fontWeight:600, color:'#94A3B8' }}>{f.label}</label>
              <select value={f.value} onChange={e=>f.set(e.target.value)} style={{ padding:'7px 12px', borderRadius:7, border:'1px solid #E2E8F0', fontSize:13, fontFamily:'Inter,sans-serif', background:'#FAFBFC' }}>
                {f.opts.map((o:any) => typeof o === 'string'
                  ? <option key={o} value={o}>{o}</option>
                  : <option key={o.v} value={o.v}>{o.l}</option>
                )}
              </select>
            </div>
          ))}
        </div>

        {/* LISTA EVENTOS */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {visibles.length === 0 && (
            <div style={{ padding:48, textAlign:'center', background:'#FAFBFC', borderRadius:14, border:'1px dashed #E2E8F0' }}>
              <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
              <div style={{ fontSize:14, color:'#6B7280' }}>Cola vacía — todos los eventos resueltos</div>
            </div>
          )}

          {visibles.map(ev => {
            const cc = cfgCrit[ev.criticidad];
            const mc = cfgMov[ev.movimiento];
            return (
              <div key={ev.id} style={{ borderRadius:14, overflow:'hidden', border:`1px solid ${cc.border}`, background:cc.cardBg, boxShadow:'0 3px 14px rgba(10,47,134,0.08)' }}>

                {/* HEADER */}
                <div style={{ background:cc.headerBg, borderBottom:`1px solid ${cc.border}`, padding:'11px 22px', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:cc.dot, flexShrink:0 }} />
                  <span style={{ fontFamily:'"Exo 2",sans-serif', fontSize:11, fontWeight:700, color:cc.headerText, textTransform:'uppercase', letterSpacing:.8, flex:1 }}>
                    {critLabel[ev.criticidad]} — {motivoLabel[ev.motivo]}
                  </span>
                  <span style={{ fontSize:11, color:cc.headerText, opacity:.8, fontWeight:600 }}>{ev.tiempo}</span>
                </div>

                {/* BODY */}
                <div style={{ padding:'18px 22px', display:'flex', alignItems:'center', gap:18 }}>

                  {/* PLACA */}
                  <div style={{ flexShrink:0 }}>
                    <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:20, fontWeight:800, color:'#0A2F86', background:'#EEF2FF', padding:'6px 16px', borderRadius:8, border:'1px solid #C7D2FE', letterSpacing:2, marginBottom:8 }}>
                      {ev.placa}
                    </div>
                    <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:mc.bg, color:mc.text }}>
                      {ev.movimiento}
                    </span>
                  </div>

                  {/* SEPARADOR */}
                  <div style={{ width:1, alignSelf:'stretch', background:'#E2E8F0', flexShrink:0 }} />

                  {/* INFO */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:'#1F2A44', marginBottom:5 }}>{motivoLabel[ev.motivo]}</div>
                    <div style={{ fontSize:13, color:'#555', lineHeight:1.55, marginBottom:6 }}>{ev.descripcion}</div>
                    {ev.score !== undefined && (
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                        <span style={{ fontSize:11, color:'#888' }}>Score:</span>
                        <div style={{ flex:1, maxWidth:120, height:6, background:'#E2E8F0', borderRadius:3 }}>
                          <div style={{ width:`${ev.score*100}%`, height:'100%', background:'#C62828', borderRadius:3 }} />
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, color:'#C62828' }}>{ev.score}</span>
                        <span style={{ fontSize:11, color:'#888' }}>/ umbral 0.75</span>
                      </div>
                    )}
                    <div style={{ fontSize:11, color:'#94A3B8' }}>
                      {ev.vehiculo !== 'Vehículo no registrado' ? `${ev.vehiculo} · ` : ''}
                      {ev.propietario !== '—' ? `Prop: ${ev.propietario} · ` : ''}
                      Acceso Norte · {ev.hora}
                    </div>
                  </div>

                  {/* BOTONES CONTEXTUALES */}
                  <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0, minWidth:178 }}>

                    {ev.motivo === 'CONDUCTOR_NO_AUTORIZADO' && <>
                      <button onClick={() => setModalDenegar(ev)}
                        style={{ padding:'10px 16px', borderRadius:9, background:'#C62828', color:'#fff', fontSize:12, fontWeight:700, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', justifyContent:'center', display:'flex', alignItems:'center', gap:6 }}>
                        ✕ Denegar salida
                      </button>
                      <button onClick={() => navigate('/guardia/revision-manual', { state:{ eventoId:ev.id, placa:ev.placa } })}
                        style={{ padding:'10px 16px', borderRadius:9, background:'#0D5CCF', color:'#fff', fontSize:12, fontWeight:600, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', justifyContent:'center', display:'flex', alignItems:'center', gap:6 }}>
                        ℹ Ver detalle completo
                      </button>
                    </>}

                    {ev.motivo === 'VEHICULO_NO_REGISTRADO' && <>
                      <button onClick={() => navigate('/guardia/registro-invitado', { state:{ eventoId:ev.id, placa:ev.placa } })}
                        style={{ padding:'10px 16px', borderRadius:9, background:'#0D5CCF', color:'#fff', fontSize:12, fontWeight:700, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', justifyContent:'center', display:'flex', alignItems:'center', gap:6 }}>
                        👤 Registrar invitado
                      </button>
                      <button onClick={() => setModalDenegar(ev)}
                        style={{ padding:'10px 16px', borderRadius:9, background:'#C62828', color:'#fff', fontSize:12, fontWeight:700, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', justifyContent:'center', display:'flex', alignItems:'center', gap:6 }}>
                        ✕ Denegar ingreso
                      </button>
                      <button onClick={() => navigate('/guardia/revision-manual', { state:{ eventoId:ev.id, placa:ev.placa } })}
                        style={{ padding:'9px 16px', borderRadius:9, background:'#F8FAFC', color:'#374151', fontSize:12, fontWeight:600, border:'1.5px solid #E2E8F0', cursor:'pointer', fontFamily:'Inter,sans-serif', justifyContent:'center', display:'flex', alignItems:'center', gap:6 }}>
                        Ver detalle
                      </button>
                    </>}

                    {ev.motivo === 'EVIDENCIA_INSUFICIENTE' && <>
                      <button onClick={() => navigate('/guardia/revision-manual', { state:{ eventoId:ev.id, placa:ev.placa } })}
                        style={{ padding:'10px 16px', borderRadius:9, background:'#0D5CCF', color:'#fff', fontSize:12, fontWeight:700, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', justifyContent:'center', display:'flex', alignItems:'center', gap:6 }}>
                        ℹ Ver detalle y resolver
                      </button>
                      <button onClick={() => navigate('/guardia/contingencia', { state:{ eventoId:ev.id, placa:ev.placa } })}
                        style={{ padding:'10px 16px', borderRadius:9, background:'#F2851F', color:'#fff', fontSize:12, fontWeight:700, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', justifyContent:'center', display:'flex', alignItems:'center', gap:6 }}>
                        ⚠ Contingencia
                      </button>
                    </>}

                    {ev.motivo === 'CONDUCTOR_PRESENTA_PASE' && <>
                      <button onClick={() => navigate('/guardia/pase-rapido', { state:{ eventoId:ev.id, placa:ev.placa } })}
                        style={{ padding:'10px 16px', borderRadius:9, background:'#0D5CCF', color:'#fff', fontSize:12, fontWeight:700, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif', justifyContent:'center', display:'flex', alignItems:'center', gap:6 }}>
                        🔓 Validar pase rápido
                      </button>
                      <button onClick={() => navigate('/guardia/revision-manual', { state:{ eventoId:ev.id, placa:ev.placa } })}
                        style={{ padding:'9px 16px', borderRadius:9, background:'#F8FAFC', color:'#374151', fontSize:12, fontWeight:600, border:'1.5px solid #E2E8F0', cursor:'pointer', fontFamily:'Inter,sans-serif', justifyContent:'center', display:'flex', alignItems:'center', gap:6 }}>
                        Ver detalle
                      </button>
                    </>}

                  </div>
                </div>

                {/* FOOTER ADVERTENCIA */}
                {ev.motivo === 'CONDUCTOR_NO_AUTORIZADO' && (
                  <div style={{ background:'#FFF8F8', borderTop:`1px solid ${cc.border}`, padding:'9px 22px', display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:11, color:'#991B1B' }}>⚠ Aprobación rápida no disponible — revise el detalle completo antes de decidir</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* MODAL CONFIRMAR DENEGAR */}
        {modalDenegar && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 }}>
            <div style={{ background:'#fff', borderRadius:16, border:'1px solid #FECACA', padding:28, width:420, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
                <div>
                  <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:18, fontWeight:800, color:'#C62828' }}>Confirmar denegación</div>
                  <div style={{ fontSize:12, color:'#6B7280', marginTop:3 }}>Esta acción quedará registrada con tu nombre y timestamp</div>
                </div>
                <button onClick={() => setModalDenegar(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#888', lineHeight:1 }}>✕</button>
              </div>
              <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'14px 18px', marginBottom:16 }}>
                <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:24, fontWeight:800, color:'#991B1B', letterSpacing:2 }}>{modalDenegar.placa}</div>
                <div style={{ fontSize:12, color:'#C62828', marginTop:4 }}>{modalDenegar.movimiento} · {motivoLabel[modalDenegar.motivo]}</div>
              </div>
              <div style={{ fontSize:13, color:'#555', marginBottom:20 }}>
                ¿Confirmas que deseas <strong style={{ color:'#C62828' }}>denegar este acceso</strong>? El evento se cerrará con decisión DENIED y se notificará al propietario.
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setModalDenegar(null)} style={{ flex:1, padding:11, borderRadius:8, background:'#fff', color:'#555', fontSize:13, fontWeight:500, border:'1.5px solid #E2E8F0', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  Cancelar
                </button>
                <button onClick={() => confirmarDenegar(modalDenegar)} style={{ flex:1, padding:11, borderRadius:8, background:'#C62828', color:'#fff', fontSize:13, fontWeight:700, border:'none', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                  ✕ Confirmar denegación
                </button>
              </div>
            </div>
          </div>
        )}

      </Box>
    </DashboardTemplate>
  );
};

export default ColaEventosPage;
