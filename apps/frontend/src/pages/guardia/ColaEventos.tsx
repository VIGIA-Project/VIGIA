// apps/frontend/src/pages/guardia/ColaEventosPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import { useEventosRecientes, useRegistrarEventoManual } from '../../hooks/useGuard';
import { EventoAcceso } from '../../services/types/guard.types';

type Movimiento = 'ENTRADA' | 'SALIDA';
type Criticidad = 'ALTA' | 'MEDIA' | 'BAJA';

interface EventoConCriticidad extends EventoAcceso {
  criticidad: Criticidad;
  tiempo: string;
  minutos: number;
  motivo: string;
  descripcion: string;
  vehiculo?: string;
  propietario?: string;
  score?: number;
}

const cfgCrit: Record<Criticidad, { border: string; headerBg: string; headerText: string; dot: string; cardBg: string }> = {
  ALTA: { border: '#FECACA', headerBg: '#FEF2F2', headerText: '#991B1B', dot: '#C62828', cardBg: '#FFF8F8' },
  MEDIA: { border: '#FDE68A', headerBg: '#FFFBEB', headerText: '#92400E', dot: '#F2851F', cardBg: '#FFFDF5' },
  BAJA: { border: '#BFDBFE', headerBg: '#EFF6FF', headerText: '#1E3A8A', dot: '#0D5CCF', cardBg: '#F8FAFF' },
};

const cfgMov: Record<Movimiento, { bg: string; text: string }> = {
  ENTRADA: { bg: '#E3F2FD', text: '#1565C0' },
  SALIDA: { bg: '#EDE7F6', text: '#4527A0' },
};

const motivoLabel: Record<string, string> = {
  'AUTORIZADO': 'Acceso autorizado',
  'DENEGADO': 'Acceso denegado',
  'CONTINGENCIA': 'Contingencia - requiere decisión',
};

const critLabel: Record<Criticidad, string> = {
  ALTA: '⚠ Alta criticidad',
  MEDIA: 'Media criticidad',
  BAJA: 'Baja criticidad',
};

export const ColaEventosPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const estadoFiltro = (location.state as any)?.filtro;

  const [filtroMov, setFiltroMov] = useState<Movimiento | 'Todos'>(estadoFiltro || 'Todos');
  const [filtroCrit, setFiltroCrit] = useState<Criticidad | 'Todos'>('Todos');
  const [sort, setSort] = useState('MasCritico');
  const [modalDenegar, setModalDenegar] = useState<EventoConCriticidad | null>(null);
  const [resueltos, setResueltos] = useState<string[]>([]);
  const [procesando, setProcesando] = useState<string | null>(null);

  // Obtener eventos reales
  const { data: eventos, isLoading, error, refetch } = useEventosRecientes(50);
  const registrarEventoMutation = useRegistrarEventoManual();

  // Procesar eventos para agregar criticidad y metadata
  const eventosProcesados = useMemo(() => {
    if (!eventos) return [];

    // Solo eventos de CONTINGENCIA son "pendientes" en la cola
    const eventosPendientes = eventos.filter(e => e.decision === 'CONTINGENCIA');

    return eventosPendientes.map((e): EventoConCriticidad => {
      // Determinar criticidad basada en el tipo de movimiento y contexto
      let criticidad: Criticidad = 'BAJA';
      let motivo = 'CONTINGENCIA - requiere decisión';
      let descripcion = 'Este evento requiere revisión manual por parte del guardia.';

      if (e.tipoMovimiento === 'SALIDA') {
        criticidad = 'ALTA';
        descripcion = 'Salida no autorizada detectada. Verificar identidad del conductor antes de autorizar.';
      } else if (e.tipoMovimiento === 'ENTRADA') {
        criticidad = 'MEDIA';
        descripcion = 'Vehículo sin registro o conductor no autorizado. Validar credenciales.';
      }

      if (e.detalles) {
        descripcion = e.detalles;
      }

      const minutos = Math.floor((new Date().getTime() - new Date(e.fechaHora).getTime()) / 60000);

      return {
        ...e,
        criticidad,
        tiempo: minutos < 1 ? 'hace unos segundos' : `hace ${minutos} min`,
        minutos,
        motivo,
        descripcion,
        vehiculo: e.vehiculoId ? `Vehículo ID: ${e.vehiculoId}` : 'Vehículo no registrado',
        propietario: e.personaId ? `Persona ID: ${e.personaId}` : '—',
      };
    });
  }, [eventos]);

  // Filtrar y ordenar
  const visibles = useMemo(() => {
    return eventosProcesados
        .filter(e => !resueltos.includes(e.id))
        .filter(e => {
          if (filtroMov !== 'Todos' && e.tipoMovimiento !== filtroMov) return false;
          if (filtroCrit !== 'Todos' && e.criticidad !== filtroCrit) return false;
          return true;
        })
        .sort((a, b) => {
          if (sort === 'MasCritico') {
            const order = { ALTA: 0, MEDIA: 1, BAJA: 2 };
            return order[a.criticidad] - order[b.criticidad];
          }
          if (sort === 'MasAntiguo') return b.minutos - a.minutos;
          return a.minutos - b.minutos;
        });
  }, [eventosProcesados, resueltos, filtroMov, filtroCrit, sort]);

  // Auto-refresh cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  const confirmarDenegar = async (ev: EventoConCriticidad) => {
    setProcesando(ev.id);
    try {
      await registrarEventoMutation.mutateAsync({
        placaCapturada: ev.placaCapturada,
        tipoMovimiento: ev.tipoMovimiento,
        decision: 'DENEGADO',
        detalles: `Acceso denegado por guardia: ${ev.descripcion || 'Sin detalles adicionales'}`,
        vehiculoId: ev.vehiculoId,
        personaId: ev.personaId,
      });
      setResueltos(prev => [...prev, ev.id]);
      setModalDenegar(null);
      refetch();
    } catch (error) {
      console.error('Error al denegar acceso:', error);
      alert('Error al procesar la denegación. Por favor, intente nuevamente.');
    } finally {
      setProcesando(null);
    }
  };

  const handleAutorizar = async (ev: EventoConCriticidad) => {
    setProcesando(ev.id);
    try {
      await registrarEventoMutation.mutateAsync({
        placaCapturada: ev.placaCapturada,
        tipoMovimiento: ev.tipoMovimiento,
        decision: 'AUTORIZADO',
        detalles: `Acceso autorizado por guardia: ${ev.descripcion || 'Sin detalles adicionales'}`,
        vehiculoId: ev.vehiculoId,
        personaId: ev.personaId,
      });
      setResueltos(prev => [...prev, ev.id]);
      refetch();
    } catch (error) {
      console.error('Error al autorizar acceso:', error);
      alert('Error al procesar la autorización. Por favor, intente nuevamente.');
    } finally {
      setProcesando(null);
    }
  };

  const btnFiltro = (label: string, active: boolean, onClick: () => void, color = '#0D5CCF') => (
      <button
          key={label}
          onClick={onClick}
          style={{
            padding: '6px 16px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter,sans-serif',
            background: active ? color : '#fff',
            color: active ? '#fff' : '#374151',
            border: active ? 'none' : '1.5px solid #E2E8F0',
          }}
      >
        {label}
      </button>
  );

  if (isLoading) {
    return (
        <DashboardTemplate rol="GUARD" pageTitle="Cola de eventos">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </DashboardTemplate>
    );
  }

  if (error) {
    return (
        <DashboardTemplate rol="GUARD" pageTitle="Cola de eventos">
          <Alert severity="error" sx={{ m: 2 }}>
            Error al cargar la cola de eventos. Por favor, intente nuevamente.
          </Alert>
        </DashboardTemplate>
    );
  }

  return (
      <DashboardTemplate rol="GUARD" pageTitle="Cola de eventos">
        <Box sx={{ fontFamily: 'Inter,sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 20, fontWeight: 700, color: '#0F172A' }}>
                Cola de eventos
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>
                Acceso Norte · <strong style={{ color: '#C62828' }}>{visibles.length} eventos pendientes</strong>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '14px 18px', marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', minWidth: 80 }}>Movimiento:</span>
              {['Todos', 'ENTRADA', 'SALIDA'].map(o => btnFiltro(o, filtroMov === o, () => setFiltroMov(o as Movimiento | 'Todos'), o === 'ENTRADA' ? '#1565C0' : o === 'SALIDA' ? '#4527A0' : '#0D5CCF'))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', minWidth: 80 }}>Criticidad:</span>
              {['Todos', 'ALTA', 'MEDIA', 'BAJA'].map(o => btnFiltro(o, filtroCrit === o, () => setFiltroCrit(o as Criticidad | 'Todos'), o === 'ALTA' ? '#C62828' : o === 'MEDIA' ? '#F2851F' : '#0D5CCF'))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', minWidth: 80 }}>Ordenar:</span>
              {[{ v: 'MasCritico', l: 'Mayor criticidad' }, { v: 'MasAntiguo', l: 'Más antiguo' }, { v: 'MasReciente', l: 'Más reciente' }].map(o => btnFiltro(o.l, sort === o.v, () => setSort(o.v)))}
            </div>
          </div>

          {/* Lista de eventos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {visibles.length === 0 && (
                <div style={{ padding: 48, textAlign: 'center', background: '#FAFBFC', borderRadius: 14, border: '1px dashed #E2E8F0' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <div style={{ fontSize: 14, color: '#6B7280' }}>Cola vacía — todos los eventos resueltos</div>
                </div>
            )}
            {visibles.map(ev => {
              const cc = cfgCrit[ev.criticidad];
              const mc = cfgMov[ev.tipoMovimiento as Movimiento];
              const estaProcesando = procesando === ev.id;

              return (
                  <div key={ev.id} style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${cc.border}`, background: cc.cardBg, boxShadow: '0 3px 14px rgba(10,47,134,0.08)' }}>
                    <div style={{ background: cc.headerBg, borderBottom: `1px solid ${cc.border}`, padding: '11px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: cc.dot, flexShrink: 0 }} />
                      <span style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 11, fontWeight: 700, color: cc.headerText, textTransform: 'uppercase', letterSpacing: .8, flex: 1 }}>
                    {critLabel[ev.criticidad]} — Contingencia
                  </span>
                      <span style={{ fontSize: 11, color: cc.headerText, opacity: .8, fontWeight: 600 }}>{ev.tiempo}</span>
                    </div>
                    <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
                      <div style={{ flexShrink: 0 }}>
                        <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 20, fontWeight: 800, color: '#0A2F86', background: '#EEF2FF', padding: '6px 16px', borderRadius: 8, border: '1px solid #C7D2FE', letterSpacing: 2, marginBottom: 8 }}>
                          {ev.placaCapturada}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: mc.bg, color: mc.text }}>
                      {ev.tipoMovimiento}
                    </span>
                      </div>
                      <div style={{ width: 1, alignSelf: 'stretch', background: '#E2E8F0', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2A44', marginBottom: 5 }}>
                          Contingencia - requiere decisión
                        </div>
                        <div style={{ fontSize: 13, color: '#555', lineHeight: 1.55, marginBottom: 6 }}>
                          {ev.descripcion || 'Evento de contingencia registrado automáticamente.'}
                        </div>
                        {ev.detalles && (
                            <div style={{ fontSize: 12, color: '#6B7280', background: '#F8FAFC', padding: '6px 12px', borderRadius: 6, marginBottom: 6 }}>
                              <strong>Detalle:</strong> {ev.detalles}
                            </div>
                        )}
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>
                          {ev.vehiculo && ev.vehiculo !== 'Vehículo no registrado' ? `${ev.vehiculo} · ` : ''}
                          {ev.propietario && ev.propietario !== '—' ? `Prop: ${ev.propietario} · ` : ''}
                          Acceso Norte · {new Date(ev.fechaHora).toLocaleTimeString('es-EC')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0, minWidth: 178 }}>
                        <button
                            onClick={() => handleAutorizar(ev)}
                            disabled={estaProcesando}
                            style={{
                              padding: '10px 16px',
                              borderRadius: 9,
                              background: '#16A34A',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 700,
                              border: 'none',
                              cursor: estaProcesando ? 'not-allowed' : 'pointer',
                              fontFamily: 'Inter,sans-serif',
                              opacity: estaProcesando ? 0.6 : 1,
                            }}
                        >
                          {estaProcesando ? 'Procesando...' : '✓ Autorizar acceso'}
                        </button>
                        <button
                            onClick={() => setModalDenegar(ev)}
                            disabled={estaProcesando}
                            style={{
                              padding: '10px 16px',
                              borderRadius: 9,
                              background: '#C62828',
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: 700,
                              border: 'none',
                              cursor: estaProcesando ? 'not-allowed' : 'pointer',
                              fontFamily: 'Inter,sans-serif',
                              opacity: estaProcesando ? 0.6 : 1,
                            }}
                        >
                          ✕ Denegar acceso
                        </button>
                        <button
                            onClick={() => navigate('/guardia/revision-manual', { state: { placa: ev.placaCapturada } })}
                            style={{
                              padding: '9px 16px',
                              borderRadius: 9,
                              background: '#F8FAFC',
                              color: '#374151',
                              fontSize: 12,
                              fontWeight: 600,
                              border: '1.5px solid #E2E8F0',
                              cursor: 'pointer',
                              fontFamily: 'Inter,sans-serif',
                            }}
                        >
                          ℹ Ver detalle
                        </button>
                      </div>
                    </div>
                    <div style={{ background: '#FFF8F8', borderTop: `1px solid ${cc.border}`, padding: '9px 22px', fontSize: 11, color: '#991B1B' }}>
                      ⚠ Evento de contingencia — requiere decisión manual del guardia
                    </div>
                  </div>
              );
            })}
          </div>

          {/* Modal de confirmación */}
          {modalDenegar && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #FECACA', padding: 28, width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 18, fontWeight: 800, color: '#C62828' }}>✕ Confirmar denegación</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>Esta acción quedará registrada en el sistema</div>
                    </div>
                    <button onClick={() => setModalDenegar(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}>
                      ✕
                    </button>
                  </div>
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '14px 18px', marginBottom: 16 }}>
                    <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 22, fontWeight: 800, color: '#991B1B', letterSpacing: 2 }}>
                      {modalDenegar.placaCapturada}
                    </div>
                    <div style={{ fontSize: 12, color: '#C62828', marginTop: 4 }}>
                      {modalDenegar.tipoMovimiento} · Contingencia
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: '#555', marginBottom: 20 }}>
                    ¿Confirmas que deseas <strong style={{ color: '#C62828' }}>denegar este acceso</strong>? El evento se registrará como DENEGADO.
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={() => setModalDenegar(null)}
                        style={{ flex: 1, padding: 11, borderRadius: 8, background: '#fff', color: '#555', fontSize: 13, fontWeight: 500, border: '1.5px solid #E2E8F0', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}
                    >
                      Cancelar
                    </button>
                    <button
                        onClick={() => confirmarDenegar(modalDenegar)}
                        disabled={procesando === modalDenegar.id}
                        style={{
                          flex: 1,
                          padding: 11,
                          borderRadius: 8,
                          background: '#C62828',
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 700,
                          border: 'none',
                          cursor: procesando === modalDenegar.id ? 'not-allowed' : 'pointer',
                          fontFamily: 'Inter,sans-serif',
                          opacity: procesando === modalDenegar.id ? 0.6 : 1,
                        }}
                    >
                      {procesando === modalDenegar.id ? 'Procesando...' : '✕ Confirmar denegación'}
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