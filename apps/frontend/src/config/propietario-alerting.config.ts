// src/config/propietario-alerting.config.ts
// Mock data y helpers para alertas del módulo Propietario, reutilizable por Admin cuando convenga.

export type Severidad = "ALTA" | "MEDIA" | "INFORMATIVA";

export interface PropietarioAlerta {
  alerta_id: string;
  tipo: string;
  severidad: Severidad;
  titulo: string;
  descripcion: string;
  fecha: string;
  timestamp_relativo: string;
  leida: boolean;
  vehiculo_placa?: string;
  accion_sugerida?: string;
}

export const MOCK_ALERTAS_PROP: PropietarioAlerta[] = [
  {
    alerta_id: "alt-001",
    tipo: "ACCESO_DENEGADO",
    severidad: "ALTA",
    titulo: "Intento de acceso no autorizado",
    descripcion:
      "Persona no registrada intentó ingresar con el vehículo PBW-1234 por Acceso Sur. Se activó protocolo de seguridad.",
    fecha: "2026-07-04T02:15:00",
    timestamp_relativo: "hace 2h",
    leida: false,
    vehiculo_placa: "PBW-1234",
    accion_sugerida: "Ver vehículo",
  },
  {
    alerta_id: "alt-002",
    tipo: "PERMISO_POR_EXPIRAR",
    severidad: "MEDIA",
    titulo: "Permiso temporal próximo a expirar",
    descripcion:
      "El permiso de Jorge Mendoza para el vehículo PBB-3456 expira en 4 horas. Renueve si desea mantener el acceso.",
    fecha: "2026-07-04T01:30:00",
    timestamp_relativo: "hace 3h",
    leida: false,
    vehiculo_placa: "PBB-3456",
    accion_sugerida: "Renovar permiso",
  },
  {
    alerta_id: "alt-003",
    tipo: "ENROLLMENT_PENDIENTE",
    severidad: "MEDIA",
    titulo: "Enrollment biométrico pendiente",
    descripcion:
      "Stalin Coello aún no ha completado su enrollment biométrico. Sin enrollment, la validación será solo por placa.",
    fecha: "2026-07-03T18:00:00",
    timestamp_relativo: "hace 10h",
    leida: false,
    vehiculo_placa: undefined,
    accion_sugerida: "Ver personas",
  },
  {
    alerta_id: "alt-004",
    tipo: "ACCESO_EXITOSO",
    severidad: "INFORMATIVA",
    titulo: "Acceso autorizado registrado",
    descripcion:
      "María Elena Arévalo ingresó exitosamente con PBW-1234 por Acceso Norte. Validación biométrica correcta.",
    fecha: "2026-07-03T14:32:00",
    timestamp_relativo: "ayer 14:32",
    leida: true,
    vehiculo_placa: "PBW-1234",
    accion_sugerida: undefined,
  },
];

// Mapea la alerta del propietario a la estructura simple usada en el admin
export interface AdminAlertaRow {
  id: string;
  severidad: "ALTA" | "MEDIA" | "INFORMATIVA";
  estado: "GENERADA" | "ENTREGADA" | "ATENDIDA";
  descripcion: string;
  referencia: string;
  fecha: string;
}

export const mapPropietarioAlertToAdmin = (
  a: PropietarioAlerta,
): AdminAlertaRow => ({
  id: a.alerta_id,
  severidad: a.severidad,
  estado: a.leida ? "ATENDIDA" : "GENERADA",
  descripcion: a.titulo,
  referencia: a.vehiculo_placa || a.tipo,
  fecha: a.timestamp_relativo || a.fecha,
});

export default MOCK_ALERTAS_PROP;

const ALERTS_STORAGE_KEY = "vigia_alerts_v1";

export const loadAlerts = (): PropietarioAlerta[] => {
  try {
    const raw = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PropietarioAlerta[];
  } catch {}
  return MOCK_ALERTAS_PROP;
};

export const saveAlerts = (alerts: PropietarioAlerta[]) => {
  try {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  } catch {}
};

export const upsertAlert = (alert: PropietarioAlerta) => {
  const current = loadAlerts();
  const idx = current.findIndex((a) => a.alerta_id === alert.alerta_id);
  if (idx >= 0) current[idx] = { ...current[idx], ...alert };
  else current.unshift(alert);
  saveAlerts(current);
};

export const markAlertAsRead = (alertId: string) => {
  const current = loadAlerts();
  const idx = current.findIndex((a) => a.alerta_id === alertId);
  if (idx >= 0) {
    current[idx].leida = true;
    saveAlerts(current);
  }
};
