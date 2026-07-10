// src/config/propietario-vehiculos.config.ts
// Contenido y mock data de "Mis Vehículos" del dashboard PROPIETARIO — Dashboard PROPIETARIO v1.2 §10-12

export type VehiculoEstado = "ACTIVO" | "INACTIVO";

export interface PropietarioVehiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  tipo: string;
  estado: VehiculoEstado;
  permisosActivos: number;
  alertas: number;
  /** Personas del Grupo Familiar con acceso autorizado a este vehículo */
  personasAsignadas: number;
  /** De las personas asignadas, cuántas aún no completan su biometría propia */
  personasSinBiometria: number;
  observacion?: string;
}

export const VEHICLE_TYPE_OPTIONS = [
  "Sedán",
  "SUV",
  "Camioneta",
  "Motocicleta",
  "Otro",
] as const;

export const VEHICLE_COLOR_OPTIONS = [
  "Blanco",
  "Negro",
  "Gris",
  "Rojo",
  "Azul",
  "Verde",
  "Amarillo",
  "Otro",
] as const;

export const MIS_VEHICULOS_COPY = {
  title: "Mis vehículos",
  registerCta: "Registrar vehículo",
  searchPlaceholder: "Buscar por placa...",
  filters: { todos: "Todos", activos: "Activos", inactivos: "Inactivos" },
  emptySearch: "No se encontraron vehículos con ese criterio.",
  emptyState: {
    title: "Aún no tienes vehículos registrados",
    description:
      "Registra tu primer vehículo para comenzar a gestionar permisos y accesos.",
  },
} as const;

export const REGISTER_VEHICLE_DRAWER_COPY = {
  title: "Registrar vehículo",
  subtitle: "Agrega un vehículo propio para gestionarlo",
  editTitle: "Editar vehículo",
  editSubtitle: "Actualiza los datos de tu vehículo",
  sectionVehiculo: "Datos del vehículo",
  sectionAdicional: "Información adicional",
  placaLabel: "Placa",
  placaPlaceholder: "ABC-1234",
  placaHelper: "Formato ecuatoriano: 3 letras, guión, 4 números",
  placaHelperEdit: "La placa no puede modificarse una vez registrada",
  marcaLabel: "Marca",
  marcaPlaceholder: "Toyota",
  modeloLabel: "Modelo",
  modeloPlaceholder: "Corolla",
  anioLabel: "Año",
  anioPlaceholder: "2020",
  colorLabel: "Color",
  tipoLabel: "Tipo de vehículo",
  observacionLabel: "Observación",
  observacionPlaceholder: "Opcional",
  cancelLabel: "Cancelar",
  submitLabel: "Registrar",
  submitEditLabel: "Guardar cambios",
  submittingLabel: "Registrando...",
  successToast: "Vehículo registrado correctamente",
  successToastEdit: "Cambios guardados correctamente",
} as const;

export const VEHICLE_CARD_COPY = {
  viewDetail: "Ver detalle",
  createPermiso: "Crear permiso",
  notAvailable: "No disponible para permisos",
  personasLabel: (n: number) =>
    n === 0
      ? "Sin personas asignadas"
      : n === 1
        ? "Personas: 1"
        : `Personas: ${n}`,
  personasSinBiometriaTooltip: (n: number) =>
    `${n} persona${n === 1 ? "" : "s"} sin biometría`,
  permisosSuffix: (n: number) => (n === 1 ? "1 permiso" : `${n} permisos`),
  alertasSuffix: (n: number) => (n === 1 ? "1 alerta" : `${n} alertas`),
} as const;

export const HISTORIAL_ACCESOS_COPY = {
  title: "Historial reciente de accesos",
  empty: "Cuando tus vehículos registren accesos, los verás aquí.",
} as const;

export interface AccesoRecienteEvento {
  id: string;
  placa: string;
  title: string;
  subtitle: string;
  timestamp: string;
  severity: "success" | "warning" | "error" | "info";
}

export const MOCK_ACCESOS_RECIENTES: AccesoRecienteEvento[] = [
  {
    id: "acc-1",
    placa: "PCB-1234",
    title: "Acceso autorizado · Acceso Norte",
    subtitle: "Validación biométrica exitosa",
    timestamp: "hace 2h",
    severity: "success",
  },
  {
    id: "acc-2",
    placa: "GHI-8821",
    title: "Alerta operativa · Acceso Sur",
    subtitle: "Intento de acceso fuera de horario habitual",
    timestamp: "hace 5h",
    severity: "warning",
  },
  {
    id: "acc-3",
    placa: "PCB-1234",
    title: "Salida registrada · Acceso Norte",
    subtitle: "Salida exitosa",
    timestamp: "ayer",
    severity: "info",
  },
];

const ONBOARDING_VEHICLE_STORAGE_KEY = "vigia_first_vehicle";
const VEHICULOS_STORAGE_KEY = "vigia_vehiculos_storage_v1";

export const MOCK_VEHICULOS: PropietarioVehiculo[] = [
  {
    id: "veh-001",
    placa: "PCB-1234",
    marca: "Toyota",
    modelo: "Corolla",
    anio: 2022,
    color: "Blanco",
    tipo: "Sedán",
    estado: "ACTIVO",
    permisosActivos: 2,
    alertas: 0,
    personasAsignadas: 2,
    personasSinBiometria: 0,
  },
  {
    id: "veh-002",
    placa: "GHI-8821",
    marca: "Kia",
    modelo: "Sportage",
    anio: 2021,
    color: "Gris",
    tipo: "SUV",
    estado: "ACTIVO",
    permisosActivos: 1,
    alertas: 1,
    personasAsignadas: 1,
    personasSinBiometria: 1,
  },
  {
    id: "veh-003",
    placa: "JKL-4455",
    marca: "Chevrolet",
    modelo: "Aveo",
    anio: 2018,
    color: "Negro",
    tipo: "Sedán",
    estado: "INACTIVO",
    permisosActivos: 0,
    alertas: 0,
    personasAsignadas: 0,
    personasSinBiometria: 0,
  },
];

/** Lee el vehículo registrado en el onboarding (localStorage) y lo adapta al modelo de esta pantalla */
export const loadOnboardingVehiculo = (): PropietarioVehiculo | null => {
  try {
    const raw = localStorage.getItem(ONBOARDING_VEHICLE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      placa: string;
      marca: string;
      modelo: string;
      color: string;
      anio: number;
    };
    if (!parsed?.placa) return null;

    return {
      id: `veh-onboarding-${parsed.placa}`,
      placa: parsed.placa,
      marca: parsed.marca,
      modelo: parsed.modelo,
      anio: parsed.anio,
      color: parsed.color,
      tipo: "Sedán",
      estado: "ACTIVO",
      permisosActivos: 0,
      alertas: 0,
      personasAsignadas: 0,
      personasSinBiometria: 0,
    };
  } catch {
    return null;
  }
};

export const buildInitialVehiculos = (): PropietarioVehiculo[] => {
  try {
    const stored = localStorage.getItem(VEHICULOS_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as PropietarioVehiculo[];
  } catch {
    // ignore and fallback to mocks
  }

  const onboardingVehiculo = loadOnboardingVehiculo();
  if (!onboardingVehiculo) return MOCK_VEHICULOS;
  // Evita duplicar si la placa del onboarding coincide con algún mock
  const withoutDuplicate = MOCK_VEHICULOS.filter(
    (v) => v.placa !== onboardingVehiculo.placa,
  );
  return [onboardingVehiculo, ...withoutDuplicate];
};

export const saveVehiculos = (vehiculos: PropietarioVehiculo[]) => {
  try {
    localStorage.setItem(VEHICULOS_STORAGE_KEY, JSON.stringify(vehiculos));
  } catch {
    // ignore
  }
};

export const upsertVehiculo = (vehiculo: PropietarioVehiculo) => {
  const current = buildInitialVehiculos();
  const idx = current.findIndex(
    (v) => v.id === vehiculo.id || v.placa === vehiculo.placa,
  );
  if (idx >= 0) {
    current[idx] = { ...current[idx], ...vehiculo };
  } else {
    current.unshift(vehiculo);
  }
  saveVehiculos(current);
};

export const getVehiculoById = (id: string) =>
  buildInitialVehiculos().find((v) => v.id === id || v.placa === id) ?? null;

export const deleteVehiculo = (idOrPlaca: string) => {
  const current = buildInitialVehiculos();
  const filtered = current.filter(
    (v) => v.id !== idOrPlaca && v.placa !== idOrPlaca,
  );
  saveVehiculos(filtered);
};
