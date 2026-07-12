// apps/frontend/src/pages/guardia/RevisionManualPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardTemplate from '../../components/templates/DashboardTemplate';
import {
  useBuscarVehiculoPorPlaca,
  useConjuntoAutorizado,
  useRegistrarEventoManual,
  useValidarPase,
  useConsumirPase,
} from '../../hooks/useGuard';
import { PersonaAutorizada } from '../../services/types/guard.types';

const CHIPS = [
  'Conductor presenta autorización física',
  'Propietario confirma autorización',
  'Fallo de cámara',
  'Coincidencia visual verificada',
  'Datos insuficientes',
];

export const RevisionManualPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const placaInicial = (location.state as any)?.placa || '';

  const [placa, setPlaca] = useState(placaInicial);
  const [placaBusqueda, setPlacaBusqueda] = useState<string | null>(placaInicial || null);
  const [chipSel, setChipSel] = useState('');
  const [motivo, setMotivo] = useState('');
  const [obs, setObs] = useState('');
  const [modal, setModal] = useState<'DENEGAR' | 'AUTORIZAR' | 'CONTINGENCIA' | null>(null);
  const [resuelto, setResuelto] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState<'ENTRADA' | 'SALIDA'>('SALIDA');
  const [mostrarValidarPase, setMostrarValidarPase] = useState(false);
  const [codigoPase, setCodigoPase] = useState('');
  const [conductorSeleccionado, setConductorSeleccionado] = useState<PersonaAutorizada | null>(null);

  // Queries
  const { data: vehiculo, isLoading: vehiculoLoading, error: vehiculoError, refetch: refetchVehiculo } =
      useBuscarVehiculoPorPlaca(placaBusqueda);

  const { data: conjuntoAutorizado, isLoading: conjuntoLoading, error: conjuntoError } =
      useConjuntoAutorizado(vehiculo?.id || null);

  // Mutations
  const registrarEventoMutation = useRegistrarEventoManual();
  const validarPaseMutation = useValidarPase();
  const consumirPaseMutation = useConsumirPase();

  // Efecto para cargar placa desde URL o estado
  useEffect(() => {
    if (placaInicial) {
      setPlaca(placaInicial);
      setPlacaBusqueda(placaInicial);
    }
  }, [placaInicial]);

  const validar = () => {
    if (!chipSel && motivo.length < 20) {
      alert('Seleccione un motivo sugerido o escriba al menos 20 caracteres.');
      return false;
    }
    return true;
  };

  const handleBuscar = () => {
    if (placa.trim()) {
      setPlacaBusqueda(placa.trim().toUpperCase());
    }
  };

  const handleAutorizar = async (personaId?: string) => {
    if (!placaBusqueda) return;

    try {
      await registrarEventoMutation.mutateAsync({
        placaCapturada: placaBusqueda,
        tipoMovimiento: tipoMovimiento,
        decision: 'AUTORIZADO',
        detalles: `${chipSel || motivo}${obs ? ` - ${obs}` : ''}`,
        vehiculoId: vehiculo?.id,
        personaId: personaId || conductorSeleccionado?.id,
      });
      setResuelto(true);
      setModal(null);
    } catch (error) {
      console.error('Error al autorizar:', error);
      alert('Error al registrar la autorización. Por favor, intente nuevamente.');
    }
  };

  const handleDenegar = async () => {
    if (!placaBusqueda) return;

    try {
      await registrarEventoMutation.mutateAsync({
        placaCapturada: placaBusqueda,
        tipoMovimiento: tipoMovimiento,
        decision: 'DENEGADO',
        detalles: `${chipSel || motivo}${obs ? ` - ${obs}` : ''}`,
        vehiculoId: vehiculo?.id,
      });
      setResuelto(true);
      setModal(null);
    } catch (error) {
      console.error('Error al denegar:', error);
      alert('Error al registrar la denegación. Por favor, intente nuevamente.');
    }
  };

  const handleContingencia = async () => {
    if (!placaBusqueda) return;

    try {
      await registrarEventoMutation.mutateAsync({
        placaCapturada: placaBusqueda,
        tipoMovimiento: tipoMovimiento,
        decision: 'CONTINGENCIA',
        detalles: `${chipSel || motivo}${obs ? ` - ${obs}` : ''}`,
        vehiculoId: vehiculo?.id,
      });
      setResuelto(true);
      setModal(null);
    } catch (error) {
      console.error('Error al registrar contingencia:', error);
      alert('Error al registrar la contingencia. Por favor, intente nuevamente.');
    }
  };

  const handleValidarPase = async () => {
    if (!placaBusqueda || !codigoPase.trim()) {
      alert('Ingrese un código de pase válido');
      return;
    }

    try {
      const result = await validarPaseMutation.mutateAsync({
        placa: placaBusqueda,
        codigo: codigoPase.trim(),
      });

      if (result.valido && result.pase) {
        // Consumir el pase
        await consumirPaseMutation.mutateAsync(result.pase.id);
        alert(`✅ Pase válido. Acceso autorizado para ${placaBusqueda}`);
        setMostrarValidarPase(false);
        setCodigoPase('');
        // Autorizar automáticamente
        await handleAutorizar();
      } else {
        alert(result.mensaje || '❌ Pase no válido');
      }
    } catch (error) {
      console.error('Error al validar pase:', error);
      alert('Error al validar el pase. Por favor, intente nuevamente.');
    }
  };

  const confirmarAccion = () => {
    if (modal === 'AUTORIZAR') handleAutorizar();
    else if (modal === 'DENEGAR') handleDenegar();
    else if (modal === 'CONTINGENCIA') handleContingencia();
  };

  // Verificar si el conductor está autorizado
  const esConductorAutorizado = (persona: PersonaAutorizada) => {
    return persona.tipoRelacion === 'PROPIETARIO' ||
        persona.tipoRelacion === 'FAMILIAR' ||
        persona.tipoRelacion === 'PERMISO_TEMPORAL';
  };

  const conductoresAutorizados = conjuntoAutorizado?.personasAutorizadas?.filter(esConductorAutorizado) || [];

  if (resuelto) {
    return (
        <DashboardTemplate rol="GUARD" pageTitle="Detalle de evento">
          <Box sx={{ fontFamily: 'Inter,sans-serif' }}>
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                {modal === 'DENEGAR' ? '🚫' : modal === 'CONTINGENCIA' ? '⚠️' : '✅'}
              </div>
              <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 22, fontWeight: 700, color: '#1F2A44', marginBottom: 8 }}>
                Evento resuelto
              </div>
              <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
                La decisión fue registrada correctamente.
              </div>
              <button
                  onClick={() => navigate('/guardia/cola-eventos')}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 10,
                    background: '#0D5CCF',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter,sans-serif',
                  }}
              >
                Volver a la cola
              </button>
            </div>
          </Box>
        </DashboardTemplate>
    );
  }

  const loading = vehiculoLoading || conjuntoLoading;

  return (
      <DashboardTemplate rol="GUARD" pageTitle="Detalle de evento">
        <Box sx={{ fontFamily: 'Inter,sans-serif' }}>
          <div
              onClick={() => navigate('/guardia/cola-eventos')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: '#0D5CCF',
                fontWeight: 500,
                cursor: 'pointer',
                padding: '5px 12px',
                borderRadius: 8,
                border: '1px solid #C7D2FE',
                background: '#EEF2FF',
                marginBottom: 18,
              }}
          >
            ← Cola de eventos
          </div>

          {/* Buscador de placa */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', padding: '16px 20px', marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                  type="text"
                  placeholder="Ingrese placa del vehículo"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1.5px solid #E2E8F0',
                    fontSize: 14,
                    fontFamily: 'Inter,sans-serif',
                    outline: 'none',
                  }}
              />
              <button
                  onClick={handleBuscar}
                  disabled={!placa.trim()}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 8,
                    background: '#0D5CCF',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    border: 'none',
                    cursor: placa.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'Inter,sans-serif',
                    opacity: placa.trim() ? 1 : 0.6,
                  }}
              >
                Buscar
              </button>
              <select
                  value={tipoMovimiento}
                  onChange={(e) => setTipoMovimiento(e.target.value as 'ENTRADA' | 'SALIDA')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1.5px solid #E2E8F0',
                    fontSize: 13,
                    fontFamily: 'Inter,sans-serif',
                    background: '#fff',
                    outline: 'none',
                  }}
              >
                <option value="ENTRADA">ENTRADA</option>
                <option value="SALIDA">SALIDA</option>
              </select>
            </div>
          </div>

          {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
          ) : vehiculoError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                Error al buscar el vehículo. Verifique la placa e intente nuevamente.
              </Alert>
          ) : !vehiculo ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                No se encontró el vehículo con placa {placaBusqueda}. Puede registrar una contingencia.
                <button
                    onClick={() => setModal('CONTINGENCIA')}
                    style={{
                      marginLeft: 12,
                      padding: '6px 16px',
                      borderRadius: 6,
                      background: '#F2851F',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Inter,sans-serif',
                    }}
                >
                  Registrar Contingencia
                </button>
              </Alert>
          ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18, alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Información del vehículo */}
                    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                      <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 13, fontWeight: 600, color: '#0A2F86' }}>
                          🚗 Vehículo encontrado
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#E3F2FD', color: '#1565C0' }}>
                        {vehiculo.estado}
                      </span>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: tipoMovimiento === 'ENTRADA' ? '#E3F2FD' : '#EDE7F6', color: tipoMovimiento === 'ENTRADA' ? '#1565C0' : '#4527A0' }}>
                        {tipoMovimiento}
                      </span>
                        </div>
                      </div>
                      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 28, fontWeight: 800, color: '#0A2F86', background: '#EEF2FF', padding: '8px 18px', borderRadius: 8, border: '1px solid #C7D2FE', letterSpacing: 2 }}>
                          {vehiculo.placa}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>
                            {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio} · {vehiculo.color}
                          </div>
                          <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>
                            Propietario: {vehiculo.propietarioNombre}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conductores autorizados */}
                    {conjuntoAutorizado && (
                        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 13, fontWeight: 600, color: '#0A2F86' }}>
                              👥 Conductores autorizados ({conjuntoAutorizado.totalAutorizados})
                            </div>
                            {conjuntoAutorizado.totalAutorizados === 0 && (
                                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: '#FEE2E2', color: '#C62828' }}>
                          SIN AUTORIZADOS
                        </span>
                            )}
                          </div>
                          <div style={{ padding: '12px 20px' }}>
                            {conjuntoAutorizado.propietario && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0D5CCF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
                                    {conjuntoAutorizado.propietario.nombre.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                                      {conjuntoAutorizado.propietario.nombre}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#64748B' }}>
                                      Propietario · Cédula: {conjuntoAutorizado.propietario.cedula}
                                    </div>
                                  </div>
                                  <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: '#BBF7D0', color: '#166534' }}>
                            ✓ Autorizado
                          </span>
                                </div>
                            )}
                            {conjuntoAutorizado.familiares?.map((familiar, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
                                    {familiar.nombre.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                                      {familiar.nombre}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#64748B' }}>
                                      Familiar · Cédula: {familiar.cedula}
                                    </div>
                                  </div>
                                  <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: '#BBF7D0', color: '#166534' }}>
                            ✓ Autorizado
                          </span>
                                </div>
                            ))}
                            {conjuntoAutorizado.permisosTemporales?.map((permiso, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
                                    {permiso.nombre.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
                                      {permiso.nombre}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#64748B' }}>
                                      Permiso temporal · Cédula: {permiso.cedula}
                                      {permiso.fechaInicio && permiso.fechaFin && (
                                          <span style={{ display: 'block', fontSize: 10, color: '#F59E0B' }}>
                                  Válido: {new Date(permiso.fechaInicio).toLocaleDateString()} - {new Date(permiso.fechaFin).toLocaleDateString()}
                                </span>
                                      )}
                                    </div>
                                  </div>
                                  <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 12, background: '#BBF7D0', color: '#166534' }}>
                            ✓ Autorizado
                          </span>
                                </div>
                            ))}
                            {conjuntoAutorizado.totalAutorizados === 0 && (
                                <div style={{ padding: '12px', background: '#FEF2F2', borderRadius: 8, border: '1px solid #FECACA', fontSize: 12, color: '#991B1B' }}>
                                  No hay conductores autorizados para este vehículo.
                                </div>
                            )}
                            {conjuntoAutorizado.totalAutorizados > 0 && (
                                <div style={{ marginTop: 10, padding: '8px 12px', background: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0', fontSize: 11, color: '#166534' }}>
                                  ✅ {conjuntoAutorizado.totalAutorizados} conductores autorizados encontrados
                                </div>
                            )}
                          </div>
                        </div>
                    )}

                    {/* Decisión del guardia */}
                    <div style={{ background: '#fff', borderRadius: 14, border: '2px solid #E2E8F0', overflow: 'hidden' }}>
                      <div style={{ padding: '14px 20px', borderBottom: '1px solid #F1F5F9', background: '#F8F9FF', fontFamily: '"Exo 2",sans-serif', fontSize: 13, fontWeight: 600, color: '#0A2F86' }}>
                        ✏ Decisión del guardia
                      </div>
                      <div style={{ padding: '18px 20px' }}>
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Motivo sugerido</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {CHIPS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setChipSel(chipSel === c ? '' : c)}
                                    style={{
                                      padding: '5px 12px',
                                      borderRadius: 20,
                                      fontSize: 11,
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      fontFamily: 'Inter,sans-serif',
                                      background: chipSel === c ? '#EEF2FF' : '#F8F9FF',
                                      color: chipSel === c ? '#0D5CCF' : '#555',
                                      border: chipSel === c ? '1.5px solid #C7D2FE' : '1.5px solid #E2E8F0',
                                    }}
                                >
                                  {chipSel === c ? '✓ ' : ''}{c}
                                </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                            Detalle del motivo <span style={{ color: '#C62828' }}>*</span>
                            {motivo.length > 0 && <span style={{ marginLeft: 8, fontSize: 11, color: motivo.length >= 20 ? '#16A34A' : '#C62828' }}>({motivo.length}/20 min)</span>}
                          </div>
                          <textarea
                              value={motivo}
                              onChange={e => setMotivo(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: 8,
                                border: `1.5px solid ${motivo.length >= 20 ? '#BBF7D0' : '#E2E8F0'}`,
                                fontSize: 13,
                                fontFamily: 'Inter,sans-serif',
                                resize: 'none',
                                minHeight: 72,
                                boxSizing: 'border-box',
                                outline: 'none',
                              }}
                              placeholder="Mínimo 20 caracteres..."
                          />
                        </div>
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Observaciones opcionales</div>
                          <textarea
                              value={obs}
                              onChange={e => setObs(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: 8,
                                border: '1.5px solid #E2E8F0',
                                fontSize: 13,
                                fontFamily: 'Inter,sans-serif',
                                resize: 'none',
                                minHeight: 56,
                                boxSizing: 'border-box',
                                outline: 'none',
                              }}
                              placeholder="Información adicional..."
                          />
                        </div>

                        {/* Botón para validar pase */}
                        <button
                            onClick={() => setMostrarValidarPase(!mostrarValidarPase)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: 8,
                              background: '#EEF2FF',
                              color: '#0D5CCF',
                              fontSize: 12,
                              fontWeight: 600,
                              border: '1px solid #C7D2FE',
                              cursor: 'pointer',
                              fontFamily: 'Inter,sans-serif',
                              marginBottom: 14,
                            }}
                        >
                          {mostrarValidarPase ? 'Ocultar' : '🔓 Validar pase rápido'}
                        </button>

                        {mostrarValidarPase && (
                            <div style={{ background: '#F8FAFF', padding: '12px 16px', borderRadius: 8, border: '1px solid #C7D2FE', marginBottom: 14 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Código del pase</div>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <input
                                    type="text"
                                    placeholder="Ingrese código de pase"
                                    value={codigoPase}
                                    onChange={(e) => setCodigoPase(e.target.value.toUpperCase())}
                                    style={{
                                      flex: 1,
                                      padding: '8px 12px',
                                      borderRadius: 6,
                                      border: '1.5px solid #E2E8F0',
                                      fontSize: 13,
                                      fontFamily: 'Inter,sans-serif',
                                      outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={handleValidarPase}
                                    disabled={!codigoPase.trim()}
                                    style={{
                                      padding: '8px 16px',
                                      borderRadius: 6,
                                      background: '#0D5CCF',
                                      color: '#fff',
                                      fontSize: 12,
                                      fontWeight: 600,
                                      border: 'none',
                                      cursor: codigoPase.trim() ? 'pointer' : 'not-allowed',
                                      fontFamily: 'Inter,sans-serif',
                                      opacity: codigoPase.trim() ? 1 : 0.6,
                                    }}
                                >
                                  Validar
                                </button>
                              </div>
                            </div>
                        )}

                        <div style={{ background: '#FEF2F2', borderRadius: 10, padding: '12px 16px', border: '1px solid #FECACA', marginBottom: 16, fontSize: 12, color: '#991B1B' }}>
                          ⚠ En {tipoMovimiento === 'SALIDA' ? 'SALIDA' : 'ENTRADA'}, la acción segura predeterminada es {tipoMovimiento === 'SALIDA' ? 'denegar' : 'verificar'}.
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button
                              onClick={() => { if (validar()) setModal('DENEGAR'); }}
                              style={{
                                flex: 1,
                                padding: 12,
                                borderRadius: 8,
                                background: '#C62828',
                                color: '#fff',
                                fontSize: 13,
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'Inter,sans-serif',
                              }}
                          >
                            ✕ Denegar acceso
                          </button>
                          <button
                              onClick={() => { if (validar()) setModal('AUTORIZAR'); }}
                              style={{
                                flex: 1,
                                padding: 12,
                                borderRadius: 8,
                                background: '#16A34A',
                                color: '#fff',
                                fontSize: 13,
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'Inter,sans-serif',
                              }}
                          >
                            ✓ Autorizar
                          </button>
                          <button
                              onClick={() => { if (validar()) setModal('CONTINGENCIA'); }}
                              style={{
                                flex: 1,
                                padding: 12,
                                borderRadius: 8,
                                background: '#F59E0B',
                                color: '#fff',
                                fontSize: 13,
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'Inter,sans-serif',
                              }}
                          >
                            ⚠ Contingencia
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                      <div style={{ padding: '14px 18px', borderBottom: '1px solid #F1F5F9', fontFamily: '"Exo 2",sans-serif', fontSize: 13, fontWeight: 600, color: '#0A2F86' }}>
                        📋 Información del vehículo
                      </div>
                      <div style={{ padding: '16px 18px' }}>
                        <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 20, fontWeight: 800, color: '#0A2F86', background: '#EEF2FF', padding: '6px 14px', borderRadius: 7, border: '1px solid #C7D2FE', display: 'inline-block', letterSpacing: 1, marginBottom: 10 }}>
                          {vehiculo.placa}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2A44', marginBottom: 4 }}>
                          {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio} · {vehiculo.color}
                        </div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>
                          Propietario: <strong style={{ color: '#0A2F86' }}>{vehiculo.propietarioNombre}</strong>
                        </div>
                        <div style={{ marginTop: 10, padding: '8px 12px', background: vehiculo.estado === 'ACTIVO' ? '#F0FDF4' : '#FEF2F2', borderRadius: 8, border: `1px solid ${vehiculo.estado === 'ACTIVO' ? '#BBF7D0' : '#FECACA'}`, fontSize: 11, color: vehiculo.estado === 'ACTIVO' ? '#166534' : '#991B1B' }}>
                          Estado: {vehiculo.estado} {vehiculo.estado === 'ACTIVO' ? '· Sin alertas previas' : ''}
                        </div>
                      </div>
                    </div>
                    {conjuntoAutorizado && conjuntoAutorizado.totalAutorizados > 0 && (
                        <div style={{ background: '#F0FDF4', borderRadius: 14, border: '1px solid #BBF7D0', padding: '16px 18px' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#166534', marginBottom: 8 }}>
                            ✅ Acceso recomendado
                          </div>
                          <div style={{ fontSize: 12, color: '#166534' }}>
                            El vehículo tiene {conjuntoAutorizado.totalAutorizados} conductores autorizados.
                            Verifique que el conductor coincida con la lista.
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </>
          )}

          {/* Modales de confirmación */}
          {modal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <div style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: 28,
                  width: 400,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                  border: `1px solid ${modal === 'DENEGAR' ? '#FECACA' : modal === 'CONTINGENCIA' ? '#FDE68A' : '#BBF7D0'}`,
                }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 18, fontWeight: 800, color: modal === 'DENEGAR' ? '#C62828' : modal === 'CONTINGENCIA' ? '#F59E0B' : '#2E7D32' }}>
                      {modal === 'DENEGAR' ? '✕ Confirmar denegación' : modal === 'CONTINGENCIA' ? '⚠ Confirmar contingencia' : '✓ Confirmar autorización'}
                    </div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>
                      Esta acción quedará registrada en el sistema
                    </div>
                  </div>
                  <div style={{
                    background: modal === 'DENEGAR' ? '#FEF2F2' : modal === 'CONTINGENCIA' ? '#FFFBEB' : '#F0FDF4',
                    border: `1px solid ${modal === 'DENEGAR' ? '#FECACA' : modal === 'CONTINGENCIA' ? '#FDE68A' : '#BBF7D0'}`,
                    borderRadius: 10,
                    padding: '12px 16px',
                    marginBottom: 14,
                  }}>
                    <div style={{ fontFamily: '"Exo 2",sans-serif', fontSize: 20, fontWeight: 800, color: modal === 'DENEGAR' ? '#991B1B' : modal === 'CONTINGENCIA' ? '#92400E' : '#166534', letterSpacing: 2 }}>
                      {vehiculo?.placa || placaBusqueda}
                    </div>
                    <div style={{ fontSize: 12, color: modal === 'DENEGAR' ? '#C62828' : modal === 'CONTINGENCIA' ? '#F59E0B' : '#16A34A', marginTop: 4 }}>
                      {tipoMovimiento} · {chipSel || motivo.slice(0, 40)}
                    </div>
                  </div>
                  {modal === 'AUTORIZAR' && (
                      <div style={{ background: