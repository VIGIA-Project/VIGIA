// src/config/propietario-vehiculos.config.ts
// Contenido y mock data de "Mis Vehículos" del dashboard PROPIETARIO — Dashboard PROPIETARIO v1.2 §10-12

export type VehiculoEstado = "ACTIVO" | "INACTIVO";

export interface PropietarioVehiculo {
  id: string;
  /** vehiculoId real en Registry — usado para consultar permisos/pases/eventos por vehículo. */
  vehiculoId: string;
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
