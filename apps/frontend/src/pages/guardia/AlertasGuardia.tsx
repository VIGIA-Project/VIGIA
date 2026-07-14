import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { LoadingSkeleton, ErrorState } from '../../components/atoms';
import { useAlertasRecientes, useMarcarAlertaAtendida } from '../../hooks/useNotifications';
import { Alerta, EstadoAtencionAlerta, SeveridadAlerta } from '../../services/types/admin.types';

const sevCfg: Record<SeveridadAlerta,{border:string;bg:string;text:string;icon:string}> = {
  ALTA:        { border:'#C62828', bg:'#FEF2F2', text:'#991B1B', icon:'⚠' },
  MEDIA:       { border:'#F2851F', bg:'#FFF7ED', text:'#92400E', icon:'⚠' },
  INFORMATIVA: { border:'#0277BD', bg:'#E0F2FE', text:'#0277BD', icon:'ℹ' },
};
const estadoCfg: Record<EstadoAtencionAlerta,{bg:string;text:string}> = {
  GENERADA:  { bg:'#FEE2E2', text:'#C62828' },
  ENTREGADA: { bg:'#EDE7F6', text:'#4527A0' },
  ATENDIDA:  { bg:'#DCFCE7', text:'#166534' },
};

const CAUSA_LABEL: Record<string, string> = {
  ACCESO_DENEGADO: 'Acceso denegado',
  INVITADO_EXCEDIO_TIEMPO: 'Invitado con tiempo excedido',
  PERMISO_POR_EXPIRAR: 'Permiso próximo a expirar',
};

const tituloDeAlerta = (a: Alerta) => CAUSA_LABEL[a.causaOrigen] ?? a.causaOrigen;

const tiempoRelativo = (iso: string) => {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutos < 1) return 'ahora';
  if (minutos < 60) return `hace ${minutos} min`;
  return `hace ${Math.round(minutos / 60)} h`;
};

export const AlertasGuardiaPage: React.FC = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState<'Todas'|SeveridadAlerta|'No atendidas'>('Todas');

  const alertasQuery = useAlertasRecientes(30);
  const atenderMutation = useMarcarAlertaAtendida();

  const alertas = alertasQuery.data ?? [];
  const noAtendidas = alertas.filter(a => a.estadoAtencion !== 'ATENDIDA').length;

  const atender = (id: string) => atenderMutation.mutate(id);
  const atenderTodas = () => {
    alertas.filter(a => a.estadoAtencion !== 'ATENDIDA').forEach(a => atenderMutation.mutate(a.alertaId));
  };

  const handleAccion = (alerta: Alerta) => {
    if (alerta.causaOrigen === 'ACCESO_DENEGADO') navigate('/guardia/cola');
    else if (alerta.causaOrigen === 'INVITADO_EXCEDIO_TIEMPO') navigate('/guardia');
  };

  const accionLabel = (causa: string): string | null => {
    if (causa === 'ACCESO_DENEGADO') return 'Ver cola de eventos';
    if (causa === 'INVITADO_EXCEDIO_TIEMPO') return 'Ver invitados';
    return null;
  };

  const visible = useMemo(() => alertas.filter(a => {
    if (filtro === 'Todas') return true;
    if (filtro === 'No atendidas') return a.estadoAtencion !== 'ATENDIDA';
    return a.severidad === filtro;
  }), [alertas, filtro]);

  return (
    <DashboardTemplate rol="GUARD" pageTitle="Alertas del turno">
      <Box sx={{ fontFamily:'Inter,sans-serif' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
          <div>
            <div style={{ fontFamily:'"Exo 2",sans-serif', fontSize:20, fontWeight:700, color:'#0F172A' }}>Alertas del turno</div>
            <div style={{ fontSize:12, color:'#6B7280', marginTop:3 }}>{alertas.length} alertas · {noAtendidas} no atendidas</div>
          </div>
          {noAtendidas > 0 && (
            <button onClick={atenderTodas}
              style={{ padding:'9px 18px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', background:'#fff', color:'#0D5CCF', border:'1.5px solid #C7D2FE', fontFamily:'Inter,sans-serif' }}>
              ✓ Marcar todas atendidas
            </button>
          )}
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

        {alertasQuery.isLoading ? (
          <LoadingSkeleton variant="cards" rows={4} />
        ) : alertasQuery.isError ? (
          <ErrorState mensaje="No se pudieron cargar las alertas." onRetry={() => alertasQuery.refetch()} />
        ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:18, alignItems:'start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {visible.length === 0 && (
              <div style={{ padding:40, textAlign:'center', background:'#FAFBFC', borderRadius:14, border:'1px dashed #E2E8F0' }}>
                <div style={{ fontSize:14, color:'#6B7280' }}>✅ Sin alertas en este filtro</div>
              </div>
            )}
            {visible.map(a => {
              const sc = sevCfg[a.severidad];
              const ec = estadoCfg[a.estadoAtencion];
              const accion = accionLabel(a.causaOrigen);
              return (
                <div key={a.alertaId} style={{ background:'#fff', borderRadius:14, border:`1px solid ${sc.bg}`, borderLeft:`4px solid ${sc.border}`, boxShadow:'0 2px 8px rgba(10,47,134,0.06)', overflow:'hidden', opacity: a.estadoAtencion==='ATENDIDA'?0.75:1 }}>
                  <div style={{ padding:'16px 20px', display:'flex', alignItems:'flex-start', gap:14 }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:sc.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 }}>{sc.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                        <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:sc.bg, color:sc.text }}>{a.severidad}</span>
                        <span style={{ fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:20, background:ec.bg, color:ec.text }}>{a.estadoAtencion}</span>
                      </div>
                      <div style={{ fontSize:14, fontWeight:600, color:'#1F2A44', marginBottom:4 }}>{tituloDeAlerta(a)}</div>
                      <div style={{ fontSize:13, color:'#555', marginBottom:8, lineHeight:1.5 }}>{a.mensajeResumen}</div>
                      <div style={{ fontSize:11, color:'#94A3B8' }}>Causa: {a.causaOrigen} · {tiempoRelativo(a.generadaEn)}</div>
                      {a.estadoAtencion !== 'ATENDIDA' && (
                        <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
                          {accion && (
                            <button onClick={() => handleAccion(a)}
                              style={{ padding:'7px 14px', borderRadius:7, fontSize:11, fontWeight:600, cursor:'pointer', background:'#0D5CCF', color:'#fff', border:'none', fontFamily:'Inter,sans-serif' }}>
                              {accion}
                            </button>
                          )}
                          <button onClick={() => atender(a.alertaId)}
                            style={{ padding:'7px 14px', borderRadius:7, fontSize:11, fontWeight:600, cursor:'pointer', background:'#fff', color:'#555', border:'1px solid #E2E8F0', fontFamily:'Inter,sans-serif' }}>
                            Marcar atendida
                          </button>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize:10, color:'#94A3B8', whiteSpace:'nowrap' }}>{tiempoRelativo(a.generadaEn)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:'#fff', borderRadius:14, border:'1px solid #E2E8F0', overflow:'hidden' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9', fontFamily:'"Exo 2",sans-serif', fontSize:13, fontWeight:600, color:'#0A2F86' }}>Resumen</div>
              <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:10 }}>
                {(['ALTA','MEDIA','INFORMATIVA'] as SeveridadAlerta[]).map(s=>(
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
                <button onClick={() => navigate('/guardia')}
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
        )}
      </Box>
    </DashboardTemplate>
  );
};
export default AlertasGuardiaPage;
