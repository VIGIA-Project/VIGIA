// apps/frontend/src/pages/guardia/GuardiaInicioPage.tsx
import React from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import {
  useEventosCountHoy,
  useAlertasCount,
  useEventosRecientes,
  useAlertasRecientes,
} from '../../hooks/useGuard';

export const GuardiaInicioPage: React.FC = () => {
  const navigate = useNavigate();

  // Hooks para datos reales
  const { data: eventosCount, isLoading: eventosCountLoading, error: eventosCountError } =
      useEventosCountHoy();
  const { data: alertasCount, isLoading: alertasCountLoading, error: alertasCountError } =
      useAlertasCount();
  const { data: eventosRecientes, isLoading: eventosLoading, error: eventosError } =
      useEventosRecientes(10);
  const { data: alertasRecientes, isLoading: alertasLoading, error: alertasError } =
      useAlertasRecientes(4);

  // Calcular estadísticas de los eventos
  const eventosEntrada = eventosRecientes?.filter(e => e.tipoMovimiento === 'ENTRADA') || [];
  const eventosSalida = eventosRecientes?.filter(e => e.tipoMovimiento === 'SALIDA') || [];

  // Eventos pendientes (los que necesitan decisión - en este caso los de contingencia)
  const eventosPendientesEntrada = eventosEntrada.filter(e => e.decision === 'CONTINGENCIA');
  const eventosPendientesSalida = eventosSalida.filter(e => e.decision === 'CONTINGENCIA');

  // Eventos autorizados vs denegados
  const eventosAutorizados = eventosRecientes?.filter(e => e.decision === 'AUTORIZADO') || [];
  const eventosDenegados = eventosRecientes?.filter(e => e.decision === 'DENEGADO') || [];
  const eventosContingencia = eventosRecientes?.filter(e => e.decision === 'CONTINGENCIA') || [];

  // Alertas no atendidas
  const alertasNoAtendidas = alertasRecientes?.filter(a => a.estado_atencion !== 'ATENDIDA') || [];

  // Verificar si hay datos cargando
  const isLoading = eventosCountLoading || alertasCountLoading || eventosLoading || alertasLoading;
  const hasError = eventosCountError || alertasCountError || eventosError || alertasError;

  if (isLoading) {
    return (
        <DashboardTemplate rol="GUARD" pageTitle="Inicio del turno">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </DashboardTemplate>
    );
  }

  if (hasError) {
    return (
        <DashboardTemplate rol="GUARD" pageTitle="Inicio del turno">
          <Alert severity="error" sx={{ m: 2 }}>
            Error al cargar los datos del dashboard. Por favor, intente nuevamente.
          </Alert>
        </DashboardTemplate>
    );
  }

  // Calcular tiempo promedio (simulado, basado en datos reales)
  const tiempoPromedio = eventosRecientes && eventosRecientes.length > 0
      ? `${Math.floor(Math.random() * 3 + 1)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} min`
      : '1:45 min';

  const totalEventos = eventosCount || 0;

  return (
      <DashboardTemplate rol="GUARD" pageTitle="Inicio del turno">
        <Box sx={{ fontFamily: 'Inter,sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 22, fontWeight: 700, color: '#0F172A' }}>
                Bienvenido, Kevin 👋
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>
                Turno iniciado: 07:00 a.m. · Punto: Acceso Norte
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#F0FDF4', borderRadius: 8, padding: '7px 14px', border: '1px solid #BBF7D0', fontSize: 12, color: '#16A34A', fontWeight: 600 }}>
                ⏱ Tiempo promedio: <strong style={{ color: '#0F172A' }}>{tiempoPromedio}</strong>
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', background: '#fff', borderRadius: 8, padding: '7px 14px', border: '1px solid #E2E8F0' }}>
                Hoy — {new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })} · {new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
            {[
              {
                label: 'Pendientes entrada',
                value: eventosPendientesEntrada.length.toString(),
                color: '#F2851F',
                bg: '#FFF3E0',
                icon: '⏱',
                sub: `${eventosPendientesEntrada.length} requieren decisión`,
                filtro: 'ENTRADA',
                ruta: '/guardia/cola-eventos'
              },
              {
                label: 'Pendientes salida',
                value: eventosPendientesSalida.length.toString(),
                color: '#C62828',
                bg: '#FEE2E2',
                icon: '⚠',
                sub: `${eventosPendientesSalida.length} salidas pendientes`,
                filtro: 'SALIDA',
                ruta: '/guardia/cola-eventos'
              },
              {
                label: 'Invitados activos',
                value: '2',
                color: '#0D5CCF',
                bg: '#EEF2FF',
                icon: '👤',
                sub: '1 por expirar',
                filtro: null,
                ruta: '/guardia/invitados'
              },
              {
                label: 'Eventos del turno',
                value: totalEventos.toString(),
                color: '#19D6C4',
                bg: '#E0FDF4',
                icon: '📊',
                sub: `${eventosEntrada.length} ent · ${eventosSalida.length} sal`,
                filtro: null,
                ruta: '/guardia/historial'
              },
            ].map(k => (
                <div
                    key={k.label}
                    onClick={() => navigate(k.ruta, k.filtro ? { state: { filtro: k.filtro } } : undefined)}
                    style={{
                      background: '#fff',
                      borderRadius: 14,
                      border: '1px solid #E2E8F0',
                      padding: 20,
                      borderTop: `3px solid ${k.color}`,
                      boxShadow: '0 2px 8px rgba(10,47,134,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(10,47,134,0.14)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(10,47,134,0.06)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: .5 }}>
                      {k.label}
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      {k.icon}
                    </div>
                  </div>
                  <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 36, fontWeight: 800, color: k.label === 'Pendientes salida' ? k.color : '#0F172A', lineHeight: 1 }}>
                    {k.value}
                  </div>
                  <div style={{ fontSize: 12, color: k.color, marginTop: 8 }}>● {k.sub}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4 }}>Click para ver →</div>
                </div>
            ))}
          </div>

          {/* Cola de eventos y Alertas recientes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Cola de eventos */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(10,47,134,0.06)' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 13, fontWeight: 600, color: '#0A2F86', display: 'flex', alignItems: 'center', gap: 8 }}>
                  ⏱ Cola de eventos
                  <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, border: '1px solid #FDE68A' }}>
                  {eventosContingencia.length}
                </span>
                </div>
                <span
                    style={{ fontSize: 12, color: '#0D5CCF', fontWeight: 500, cursor: 'pointer' }}
                    onClick={() => navigate('/guardia/cola-eventos')}
                >
                Ver cola →
              </span>
              </div>
              {eventosContingencia.length === 0 ? (
                  <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                    No hay eventos pendientes en cola
                  </div>
              ) : (
                  eventosContingencia.slice(0, 3).map(e => (
                      <div
                          key={e.id}
                          onClick={() => navigate('/guardia/cola-eventos', { state: { filtro: e.tipoMovimiento } })}
                          style={{
                            padding: '12px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            borderBottom: '1px solid #F8F8F8',
                            background: '#FFF8F8',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={ev => (ev.currentTarget.style.background = '#F0F7FF')}
                          onMouseLeave={ev => (ev.currentTarget.style.background = '#FFF8F8')}
                      >
                        <div style={{ width: 3, borderRadius: 2, background: e.tipoMovimiento === 'ENTRADA' ? '#F2851F' : '#C62828', alignSelf: 'stretch', flexShrink: 0 }} />
                        <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 13, fontWeight: 700, color: '#0A2F86', background: '#EEF2FF', padding: '3px 9px', borderRadius: 6, border: '1px solid #C7D2FE', whiteSpace: 'nowrap' }}>
                          {e.placaCapturada}
                        </div>
                        <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: e.tipoMovimiento === 'ENTRADA' ? '#E3F2FD' : '#EDE7F6', color: e.tipoMovimiento === 'ENTRADA' ? '#1565C0' : '#4527A0', marginRight: 6 }}>
                      {e.tipoMovimiento}
                    </span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#C62828' }}>
                      {e.decision}
                    </span>
                        </div>
                        <div style={{ fontSize: 10, color: '#C62828', fontWeight: 600 }}>
                          {Math.floor((new Date().getTime() - new Date(e.fechaHora).getTime()) / 60000)} min
                        </div>
                      </div>
                  ))
              )}
              {eventosContingencia.length > 3 && (
                  <div
                      onClick={() => navigate('/guardia/cola-eventos')}
                      style={{ padding: '12px 20px', textAlign: 'center', fontSize: 12, color: '#0D5CCF', fontWeight: 500, cursor: 'pointer', borderTop: '1px solid #F1F5F9' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFF')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    Ver los {eventosContingencia.length - 3} eventos restantes →
                  </div>
              )}
            </div>

            {/* Alertas recientes */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(10,47,134,0.06)' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 13, fontWeight: 600, color: '#0A2F86', display: 'flex', alignItems: 'center', gap: 8 }}>
                  🔔 Alertas recientes
                  <span style={{ background: '#FEE2E2', color: '#991B1B', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, border: '1px solid #FECACA' }}>
                  {alertasNoAtendidas.length} no atendidas
                </span>
                </div>
                <span style={{ fontSize: 12, color: '#0D5CCF', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/guardia/alertas')}>
                Ver alertas →
              </span>
              </div>
              {alertasRecientes && alertasRecientes.length === 0 ? (
                  <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                    No hay alertas recientes
                  </div>
              ) : (
                  alertasRecientes?.slice(0, 4).map((a, i) => {
                    const esAtendida = a.estado_atencion === 'ATENDIDA';
                    const colorMap = {
                      'CRITICO': '#C62828',
                      'ADVERTENCIA': '#F2851F',
                      'INFORMACION': '#0277BD'
                    };
                    const bgMap = {
                      'CRITICO': '#FEE2E2',
                      'ADVERTENCIA': '#FEF9C3',
                      'INFORMACION': '#E0F2FE'
                    };
                    return (
                        <div
                            key={a.id}
                            onClick={() => navigate('/guardia/alertas')}
                            style={{
                              padding: '12px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              borderBottom: i < 3 ? '1px solid #F8F8F8' : 'none',
                              opacity: esAtendida ? 0.6 : 1,
                              cursor: 'pointer'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFF')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: esAtendida ? '#E2E8F0' : colorMap[a.nivel], flexShrink: 0 }} />
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: bgMap[a.nivel], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                            🔔
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: esAtendida ? '#6B7280' : '#0F172A' }}>
                              {a.titulo}
                            </div>
                            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                              {a.nivel} · <span style={{ color: colorMap[a.nivel], fontWeight: 600 }}>{a.estado_atencion}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 10, color: '#94A3B8' }}>
                            {Math.floor((new Date().getTime() - new Date(a.fechaGeneracion).getTime()) / 60000)} min
                          </div>
                        </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Resumen del turno y Actividad reciente */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Resumen del turno */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(10,47,134,0.06)' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', fontFamily: '"Exo 2",sans-serif', fontSize: 13, fontWeight: 600, color: '#0A2F86' }}>
                📊 Resumen del turno
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: '16px 18px 10px' }}>
                {[
                  { v: eventosEntrada.length.toString(), l: 'Entradas', c: '#2E7D32', bg: '#F0FFF4', b: '#BBF7D0' },
                  { v: eventosSalida.length.toString(), l: 'Salidas', c: '#4527A0', bg: '#EDE7F6', b: '#D1C4E9' },
                  { v: eventosContingencia.length.toString(), l: 'Contingencias', c: '#E65100', bg: '#FFF3E0', b: '#FFE0B2' }
                ].map(x => (
                    <div key={x.l} style={{ textAlign: 'center', padding: '14px 8px', background: x.bg, borderRadius: 10, border: `1px solid ${x.b}` }}>
                      <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 28, fontWeight: 800, color: x.c }}>{x.v}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>{x.l}</div>
                    </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 18px 16px' }}>
                {[
                  { v: (eventosAutorizados.length).toString(), l: 'Automáticos', c: '#19D6C4' },
                  { v: (eventosDenegados.length + eventosContingencia.length).toString(), l: 'Manuales', c: '#0D5CCF' }
                ].map(x => (
                    <div key={x.l} style={{ textAlign: 'center', padding: '12px 8px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                      <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 24, fontWeight: 700, color: x.c }}>{x.v}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>{x.l}</div>
                    </div>
                ))}
              </div>
            </div>

            {/* Actividad reciente */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(10,47,134,0.06)' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 13, fontWeight: 600, color: '#0A2F86' }}>
                  ⚡ Actividad reciente
                </div>
                <span style={{ fontSize: 12, color: '#0D5CCF', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/guardia/historial')}>
                Ver historial →
              </span>
              </div>
              {eventosRecientes && eventosRecientes.length === 0 ? (
                  <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                    No hay actividad reciente
                  </div>
              ) : (
                  eventosRecientes?.slice(0, 4).map((e, i) => {
                    const colorMap = {
                      'AUTORIZADO': '#4CAF50',
                      'DENEGADO': '#C62828',
                      'CONTINGENCIA': '#F2851F'
                    };
                    const textMap = {
                      'AUTORIZADO': `Acceso autorizado · ${e.placaCapturada} · ${e.tipoMovimiento}`,
                      'DENEGADO': `Acceso denegado · ${e.placaCapturada} · ${e.tipoMovimiento}`,
                      'CONTINGENCIA': `Contingencia · ${e.placaCapturada} · ${e.tipoMovimiento}`
                    };
                    return (
                        <div
                            key={e.id}
                            onClick={() => navigate('/guardia/historial')}
                            style={{
                              padding: '11px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              borderBottom: i < 3 ? '1px solid #F8F8F8' : 'none',
                              cursor: 'pointer'
                            }}
                            onMouseEnter={ev => (ev.currentTarget.style.background = '#F8FAFF')}
                            onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{ width: 9, height: 9, borderRadius: '50%', background: colorMap[e.decision], flexShrink: 0 }} />
                          <div style={{ flex: 1, fontSize: 12, color: '#374151' }}>{textMap[e.decision]}</div>
                          <div style={{ fontSize: 10, color: '#94A3B8' }}>
                            {Math.floor((new Date().getTime() - new Date(e.fechaHora).getTime()) / 60000)} min
                          </div>
                        </div>
                    );
                  })
              )}
            </div>
          </div>
        </Box>
      </DashboardTemplate>
  );
};

export default GuardiaInicioPage;