# 🎨 PLAN DEFINITIVO DE REFACTORIZACIÓN UI/UX — Dashboard Propietario VIGIA

> **Proyecto:** VIGIA — Ecosistema Inteligente de Seguridad y Control de Acceso Vehicular Biométrico  
> **Universidad Central del Ecuador · 2026**  
> **Versión:** 1.0 — Plan aprobado  
> **Fecha:** 2026-07-04  
> **Autor:** Antony Coello (Arquitectura de Software)  
> **Referencia:** Manual de Identidad Visual VIGIA (Confluence)

---

## 📋 Tabla de Contenidos

1. [Filosofía de Diseño](#1-filosofía-de-diseño)
2. [Paleta Cromática Aplicada a UI](#2-paleta-cromática-aplicada-a-ui)
3. [Sistema de Diseño Transversal (Design Tokens)](#3-sistema-de-diseño-transversal-design-tokens)
4. [Rediseño por Página](#4-rediseño-por-página)
5. [Sistema de Animaciones (Framer Motion)](#5-sistema-de-animaciones-framer-motion)
6. [Skeletons y Estados de Carga](#6-skeletons-y-estados-de-carga)
7. [Propagación a otras Dashboards](#7-propagación-a-otras-dashboards)
8. [Fases de Implementación](#8-fases-de-implementación)
9. [Checklist de Calidad](#9-checklist-de-calidad)

---

## 1. Filosofía de Diseño

### Principios rectores (basados en las leyes de UX proporcionadas)

| Ley / Principio | Aplicación concreta en VIGIA |
|-----------------|------------------------------|
| **Ley de Miller (5-9 elementos)** | Cada vista tiene máximo **6 bloques visuales**. El cerebro no debe esforzarse para entender la página. |
| **Ley de Fitts** | Botones de acción con **min-height 48px**, cards completas clickeables, áreas de toque generosas. CTAs principales con gradiente IA. |
| **Efecto sorpresa / Engagement** | Micro-animaciones en KPIs (counter-up), transiciones de entrada staggered, hover con elevación, gradiente IA en elementos premium. |
| **Menos es más** | Eliminar bordes visibles → usar sombras. Eliminar labels redundantes. Datos clave en tipografía grande. Sin decoración innecesaria. |
| **Jerarquía tipográfica** | Números/datos: **Exo 2 Bold 2rem+**. Labels: **Inter 0.7rem uppercase**. Descripciones: **Inter Regular 0.85rem**. |
| **Es discreto** | Las animaciones son sutiles (200-400ms). No hay parpadeos, no hay colores neón. Todo es elegante y profesional. |
| **Cuida hasta el último detalle** | Bordes redondeados consistentes (8px cards, 12px modals). Sombras con el mismo spread. Spacing en múltiplos de 4px. |
| **Es el menor diseño posible** | Cada elemento tiene un propósito. Si no aporta información o acción, se elimina. |

### Identidad visual transmitida (del Manual)

> "VIGIA debe presentarse siempre como una solución visualmente precisa, tecnológicamente avanzada y estéticamente confiable. Su identidad no comunica vigilancia tradicional, sino **inteligencia aplicada** a la protección de accesos."

**Traducción a UI:**
- No es un panel de seguridad frío → Es un **ecosistema inteligente** que el usuario siente como premium
- No es una tabla administrativa → Es una **experiencia de control** donde cada dato tiene contexto
- No es genérico → Tiene **personalidad propia** a través del gradiente IA, el dorado y las micro-interacciones

---

## 2. Paleta Cromática Aplicada a UI

### Colores principales (del Manual de Identidad Visual)

| Token | HEX | Uso en UI |
|-------|-----|-----------|
| `--vigia-blue-primary` | `#0D5CCF` | Botones primarios, links, iconos activos, headers de cards |
| `--vigia-blue-deep` | `#0A2F86` | Sidebar, fondos de secciones premium, texto de headings |
| `--vigia-blue-mid` | `#11A9D6` | Gradiente intermedio, hover states, badges informativos |
| `--vigia-green-ia` | `#19D6C4` | Indicadores activos, nav item seleccionado, badges de IA/biometría, skeletons |
| `--vigia-gold` | `#F2B51F` | Acentos premium, letra "A" del wordmark, badges de propietario, KPIs destacados |
| `--vigia-gold-light` | `#FFD85A` | Destellos, hover en elementos dorados, indicadores de tendencia positiva |
| `--vigia-white` | `#FFFFFF` | Fondos de cards, texto sobre fondos oscuros |

### Colores funcionales (derivados de la paleta)

| Token | HEX | Uso |
|-------|-----|-----|
| `--vigia-bg-page` | `#F8FAFC` | Fondo general del contenido |
| `--vigia-bg-card` | `#FFFFFF` | Fondo de cards |
| `--vigia-bg-card-hover` | `#F0F7FF` | Hover de cards (azul muy sutil) |
| `--vigia-bg-skeleton` | `rgba(13, 92, 207, 0.06)` | Base de skeletons (azulado sutil) |
| `--vigia-bg-skeleton-pulse` | `rgba(13, 92, 207, 0.12)` | Pulso de skeletons |
| `--vigia-border-subtle` | `rgba(10, 47, 134, 0.06)` | Bordes casi invisibles |
| `--vigia-shadow-sm` | `0 1px 3px rgba(10,47,134,0.06), 0 1px 2px rgba(10,47,134,0.04)` | Sombra base de cards |
| `--vigia-shadow-md` | `0 4px 12px rgba(10,47,134,0.08), 0 2px 4px rgba(10,47,134,0.04)` | Sombra en hover |
| `--vigia-shadow-lg` | `0 8px 24px rgba(10,47,134,0.12), 0 4px 8px rgba(10,47,134,0.06)` | Sombra en modals/elevated |
| `--vigia-success` | `#2E7D32` | Estados positivos, enrollment completado |
| `--vigia-warning` | `#EDB200` | Alertas medias, enrollment pendiente |
| `--vigia-error` | `#C62828` | Alertas altas, accesos denegados |
| `--vigia-text-primary` | `#1A1A2E` | Texto principal (casi negro con tinte azul) |
| `--vigia-text-secondary` | `#6B7280` | Texto secundario |
| `--vigia-text-tertiary` | `#9CA3AF` | Labels, timestamps, metadata |

### Gradiente Oficial de IA (del Manual)

```css
/* Gradiente lineal — flujo de datos → procesamiento → acción */
background: linear-gradient(90deg, #19D6C4 0%, #11A9D6 40%, #0D5CCF 100%);

/* Uso: Franja del sidebar, botones premium, KPI highlights, skeleton pulse */
```

---

## 3. Sistema de Diseño Transversal (Design Tokens)

### 3.1 Sombras (reemplazan bordes)

```typescript
// src/theme/shadows.ts
export const vigiaShadows = {
  none: 'none',
  sm: '0 1px 3px rgba(10,47,134,0.06), 0 1px 2px rgba(10,47,134,0.04)',
  md: '0 4px 12px rgba(10,47,134,0.08), 0 2px 4px rgba(10,47,134,0.04)',
  lg: '0 8px 24px rgba(10,47,134,0.12), 0 4px 8px rgba(10,47,134,0.06)',
  xl: '0 16px 48px rgba(10,47,134,0.16), 0 8px 16px rgba(10,47,134,0.08)',
  glow: {
    ia: '0 0 20px rgba(25, 214, 196, 0.15)',
    gold: '0 0 16px rgba(242, 181, 31, 0.12)',
    blue: '0 0 20px rgba(13, 92, 207, 0.12)',
  },
};
```

### 3.2 Spacing (múltiplos de 4px, reducido vs actual)

```typescript
// Antes: p: 4 (32px) en main content — demasiado vacío
// Después: p: 3 (24px) en main content — más denso pero respirado

export const vigiaSpacing = {
  page: 24,        // Padding del main content
  section: 20,     // Gap entre secciones
  card: 16,        // Padding interno de cards
  cardGap: 12,     // Gap entre cards en grid
  element: 8,      // Gap entre elementos dentro de una card
};
```

### 3.3 Border Radius (consistente)

```typescript
export const vigiaRadius = {
  sm: '6px',       // Chips, badges, botones pequeños
  md: '8px',       // Cards, inputs
  lg: '12px',      // Cards premium, modals
  xl: '16px',      // Cards hero, pantalla de código
  full: '9999px',  // Avatares, dots
};
```

### 3.4 Tipografía (jerarquía clara)

| Nivel | Font | Weight | Size | Color | Uso |
|-------|------|--------|------|-------|-----|
| **Hero number** | Exo 2 | 700 | 2.5rem | `#0A2F86` | KPIs principales |
| **Section title** | Exo 2 | 600 | 1.25rem | `#0A2F86` | Títulos de sección |
| **Card title** | Inter | 600 | 0.95rem | `#1A1A2E` | Títulos dentro de cards |
| **Body** | Inter | 400 | 0.875rem | `#1A1A2E` | Texto general |
| **Label** | Inter | 500 | 0.7rem | `#9CA3AF` | Labels uppercase, metadata |
| **Data highlight** | Exo 2 | 700 | 1.1rem | `#0A2F86` | Placas, códigos, datos clave |
| **Timestamp** | Inter | 400 | 0.75rem | `#9CA3AF` | Fechas, horas relativas |

### 3.5 Transiciones base (CSS)

```css
/* Transición estándar para hover */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Transición para elevación (cards) */
transition: transform 0.2s ease, box-shadow 0.2s ease;
```

---

## 4. Rediseño por Página

### 4.1 INICIO — La página más importante (engagement máximo)

#### Layout (6 bloques — cumple Miller)

```
┌─────────────────────────────────────────────────────────────────────┐
│ BLOQUE 1: Saludo contextual + Último acceso                         │
│ "Bienvenido, Antony" · Último acceso: hace 2h · Acceso Norte       │
├─────────────────────────────────────────────────────────────────────┤
│ BLOQUE 2: KPIs con contexto (4 cards en fila)                       │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│ │ 3       │ │ 1       │ │ 5       │ │ 2       │                   │
│ │Vehículos│ │Permiso  │ │Pases    │ │Alertas  │                   │
│ │ +1 mes  │ │ Activo  │ │Disponib.│ │ Pend.   │                   │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                   │
├─────────────────────────────────────────────────────────────────────┤
│ BLOQUE 3: Actividad Reciente (timeline 4-5 eventos)                 │
│ ✅ Acceso autorizado · PBW-1234 · Acceso Norte · hace 2h           │
│ ⚠️ Permiso próximo a expirar · PBB-3456 · 4h restantes             │
│ 🔴 Intento de acceso no autorizado · Acceso Sur · hace 5h          │
│ ✅ Pase consumido · VIG-A7K3M2 · Jorge Mendoza · ayer              │
├──────────────────────────────────┬──────────────────────────────────┤
│ BLOQUE 4: Mis Vehículos (mini)  │ BLOQUE 5: Grupo Familiar (mini)  │
│ ┌──────────────────────────┐    │ ┌──────────────────────────┐     │
│ │ PBW-1234 · Chevrolet     │    │ │ [👤] Stalin · Hermano    │     │
│ │ 🟢 Activo · 2 permisos   │    │ │     ⏳ Enrollment pend.  │     │
│ ├──────────────────────────┤    │ ├──────────────────────────┤     │
│ │ PBA-5678 · Kia           │    │ │ [👤] María · Madre       │     │
│ │ 🟢 Activo · 0 permisos   │    │ │     ✅ Enrollment OK     │     │
│ └──────────────────────────┘    │ └──────────────────────────┘     │
│ [Ver todos →]                   │ [Gestionar →]                     │
├─────────────────────────────────┴──────────────────────────────────┤
│ BLOQUE 6: Acciones Rápidas (3 botones grandes)                      │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐     │
│ │ 🔑 Generar Pase  │ │ 📋 Nuevo Permiso │ │ 🚗 Registrar Veh.│     │
│ │    de Acceso     │ │    Temporal      │ │                  │     │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Especificaciones de cada bloque:

**BLOQUE 1 — Saludo contextual:**
- Tipografía: "Bienvenido, Antony" → Exo 2 SemiBold 1.5rem #0A2F86
- Subtexto: "Último acceso: hace 2h · Acceso Norte · PBW-1234" → Inter 0.8rem #6B7280
- Sin card, directamente sobre el fondo de página
- Animación: fadeIn 300ms al montar

**BLOQUE 2 — KPIs con contexto:**
- 4 cards en grid (1fr 1fr 1fr 1fr en desktop, 2x2 en tablet, stack en mobile)
- Cada KPI card:
  - Número grande: Exo 2 Bold 2.5rem #0A2F86
  - Label: Inter 500 0.75rem uppercase #9CA3AF
  - Indicador contextual: chip pequeño con icono + texto (ej: "🟢 +1 mes", "⏰ Activo", "🔴 2 Pend.")
  - Sombra: `vigiaShadows.sm`
  - Hover: `vigiaShadows.md` + `translateY(-2px)`
  - Borde superior: 3px con color semántico (azul para vehículos, verde para permisos, dorado para pases, rojo para alertas)
  - Animación: staggered fadeInUp (cada card aparece 100ms después de la anterior)
  - Card completa es clickeable → navega a la página correspondiente

**BLOQUE 3 — Actividad Reciente:**
- Título de sección: "Actividad Reciente" → Exo 2 SemiBold 1.1rem #0A2F86
- Timeline vertical con 4-5 eventos
- Cada evento:
  - Icono de severidad: 20px (✅ verde, ⚠️ amarillo, 🔴 rojo, 🔵 azul info)
  - Texto principal: Inter 500 0.85rem #1A1A2E
  - Metadata: Inter 400 0.75rem #9CA3AF (timestamp relativo)
  - Borde izquierdo: 2px con color del icono
  - Hover: fondo `rgba(13,92,207,0.03)`
- Animación: staggered fadeInLeft (cada item 80ms delay)
- Link "Ver todo →" al final → navega a Alertas

**BLOQUE 4 — Mis Vehículos (mini):**
- Título: "Mis Vehículos" → Exo 2 SemiBold 1rem #0A2F86
- Lista compacta (máximo 3 vehículos):
  - Placa: Exo 2 Bold 0.95rem #0A2F86 con fondo `rgba(13,92,207,0.06)` y borderRadius 4px
  - Marca/modelo: Inter 400 0.8rem #6B7280
  - Estado: dot de 8px + texto
  - Permisos activos: badge numérico
- Link "Ver todos →" → navega a Mis Vehículos
- Animación: fadeInUp 400ms

**BLOQUE 5 — Grupo Familiar (mini):**
- Título: "Grupo Familiar" → Exo 2 SemiBold 1rem #0A2F86
- Cards compactas de miembros (máximo 3):
  - Avatar circular: 36px con iniciales, borde con gradiente IA si enrollment completado
  - Nombre: Inter 500 0.85rem #1A1A2E
  - Parentesco: Inter 400 0.75rem #9CA3AF
  - Enrollment indicator: inline (✅ o ⏳)
- Link "Gestionar →" → navega a Gestión de Autorizaciones tab 3
- Animación: fadeInUp 400ms (simultáneo con Bloque 4)

**BLOQUE 6 — Acciones Rápidas:**
- 3 botones grandes en fila (stack en mobile)
- Cada botón:
  - Min-height: 56px (Fitts)
  - Icono: 24px
  - Texto: Inter 600 0.9rem
  - Fondo: blanco con borde `rgba(13,92,207,0.12)`
  - Hover: fondo gradiente IA con texto blanco + sombra `vigiaShadows.md`
  - Transición: 200ms ease
- Animación: fadeInUp 500ms

---

### 4.2 MIS VEHÍCULOS — Cards con personalidad

#### Cambios vs actual:

| Antes | Después |
|-------|---------|
| Cards planas con border | Cards con sombra + borde lateral semántico |
| Placa en texto normal | Placa como "hero" con fondo azul sutil |
| Sin hover | Hover con elevación + sombra |
| Datos en lista plana | Datos con jerarquía (placa grande, resto pequeño) |
| Botón "Registrar" pequeño | Botón grande con gradiente IA |

#### Especificación de VehicleCard rediseñada:

```
┌─────────────────────────────────────┐
│ ▌ (borde izquierdo 4px verde)       │
│                                     │
│  PBW-1234          [🟢 Activo]      │  ← Placa: Exo 2 Bold 1.3rem
│  Chevrolet Sail · 2023              │  ← Inter 400 0.85rem #6B7280
│  Blanco                             │  ← Inter 400 0.8rem #9CA3AF
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │  1  │ │  2  │ │  ✅  │           │  ← Mini KPIs
│  │Perm.│ │Pases│ │Enrol│           │
│  └─────┘ └─────┘ └─────┘           │
│                                     │
└─────────────────────────────────────┘
```

- Borde izquierdo: 4px con color de estado (verde=activo, rojo=revocado, gris=inactivo)
- Placa: Exo 2 Bold 1.3rem #0A2F86, con fondo `rgba(13,92,207,0.04)` padding 4px 8px borderRadius 4px
- Marca/modelo/año: Inter 400 0.85rem #6B7280
- Color: Inter 400 0.8rem #9CA3AF
- Mini KPIs: 3 badges compactos (permisos activos, pases disponibles, enrollment)
- Sombra base: `vigiaShadows.sm`
- Hover: `vigiaShadows.md` + `translateY(-2px)` + fondo `#F0F7FF`
- Card completa clickeable (cursor pointer)
- Grid: 3 columnas desktop, 2 tablet, 1 mobile

---

### 4.3 GESTIÓN DE AUTORIZACIONES — 2 tabs (simplificado)

#### Reducción de 4 tabs a 2 (Ley de Miller):

| Tab actual | Nuevo tab | Contenido |
|------------|-----------|-----------|
| Permisos Temporales | **"Permisos y Autorizaciones"** | Tabla unificada con filtro por tipo (Temporal / Permanente) |
| Autorizaciones Permanentes | ↑ (mismo tab) | Chip de filtro: [Todos] [Temporales] [Permanentes] |
| Personas Autorizadas | **"Personas y Grupo Familiar"** | Vista unificada con sección de personas + sección de grupo familiar |
| Grupo Familiar | ↑ (mismo tab) | Cards de familiares debajo de la tabla de personas |

#### Tab 1: "Permisos y Autorizaciones"
- Filtros como chips horizontales: `[Todos] [Temporales] [Permanentes]`
- Chip activo: fondo gradiente IA, texto blanco
- Chip inactivo: fondo `rgba(13,92,207,0.06)`, texto #6B7280
- Tabla con row hover (fondo `rgba(13,92,207,0.02)`)
- StatusChip con más presencia (padding 4px 10px, borderRadius 12px)
- Botón "Nuevo" con dropdown: "Permiso Temporal" / "Autorización Permanente"

#### Tab 2: "Personas y Grupo Familiar"
- Sección superior: Tabla de personas autorizadas con EnrollmentIndicator
- Separador visual: línea sutil + título "Grupo Familiar (2/5)"
- Sección inferior: Cards de familiares (como en Fase 3 anterior pero con hover mejorado)

---

### 4.4 PASES DE ACCESO RÁPIDO — Código como protagonista

#### Cambios:

| Elemento | Antes | Después |
|----------|-------|---------|
| Código en tabla | Texto plano | Badge con fondo `rgba(13,92,207,0.06)`, font-family monospace, Exo 2 Bold 1rem |
| Pantalla código generado | Estática | Animación de entrada: scale(0.9)→scale(1) + fadeIn + pulse sutil del gradiente |
| Tabla | Fría | Row hover con fondo sutil + transición |
| Card informativa | Borde azul | Borde izquierdo 4px gradiente IA |

#### Pantalla "Código Generado" — Efecto sorpresa:

```
Animación de entrada (framer-motion):
1. Card aparece con scale(0.95) → scale(1) + opacity(0→1) — 400ms ease-out
2. Código aparece con delay 200ms, letra por letra (typewriter effect) — 600ms
3. Pulse sutil del borde (gradiente IA) — loop infinito, 2s, opacity 0.5→1→0.5
4. Botones aparecen con fadeInUp delay 400ms
```

---

### 4.5 MIS ALERTAS — Urgencia visual real

#### Cambios:

| Antes | Después |
|-------|---------|
| Dots de 8px | Iconos de 20px con color de severidad |
| Cards planas | Cards con borde izquierdo 4px de color de severidad |
| Sin diferenciación leída/no leída | No leídas: fondo `rgba(13,92,207,0.03)` + font-weight 500 |
| Timestamp absoluto | Timestamp relativo ("hace 2h") con tooltip de fecha exacta |
| Acciones genéricas | Acciones contextuales ("Ver vehículo", "Renovar permiso") |

#### Especificación de AlertCard:

```
┌─────────────────────────────────────────────────────────┐
│ ▌ (4px rojo)  🔴  Acceso denegado                       │
│               PBW-1234 · Acceso Sur                     │
│               Persona no registrada intentó acceder     │
│                                                         │
│               hace 2h          [Ver detalle] [Archivar] │
└─────────────────────────────────────────────────────────┘
```

- Borde izquierdo: 4px con color de severidad (rojo/amarillo/azul)
- Icono: 20px con color de severidad
- Título: Inter 600 0.9rem #1A1A2E
- Descripción: Inter 400 0.8rem #6B7280
- Timestamp: Inter 400 0.75rem #9CA3AF (relativo)
- Acciones: botones ghost (sin fondo, solo texto + hover)
- No leída: fondo `rgba(13,92,207,0.03)` + dot azul 6px en esquina superior derecha
- Hover: sombra `vigiaShadows.sm` + fondo `#F0F7FF`

---

## 5. Sistema de Animaciones (Framer Motion)

### 5.1 Dependencia

```bash
cd apps/frontend && pnpm add framer-motion
```

### 5.2 Variantes reutilizables

```typescript
// src/config/animations.config.ts
import { Variants } from 'framer-motion';

// Entrada con fade + slide up
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

// Entrada con fade + slide left
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

// Entrada con scale (para modals y pantalla de código)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

// Stagger container (para listas y grids)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Stagger item (hijo del container)
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

// Hover de cards
export const cardHover = {
  rest: { y: 0, boxShadow: '0 1px 3px rgba(10,47,134,0.06), 0 1px 2px rgba(10,47,134,0.04)' },
  hover: { y: -3, boxShadow: '0 8px 24px rgba(10,47,134,0.12), 0 4px 8px rgba(10,47,134,0.06)' },
};

// Counter up (para KPIs)
export const counterUp = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } },
};

// Pulse sutil (para el código generado)
export const pulseGlow = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(25, 214, 196, 0)',
      '0 0 20px rgba(25, 214, 196, 0.3)',
      '0 0 0px rgba(25, 214, 196, 0)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};
```

### 5.3 Uso en componentes

```tsx
// Ejemplo: Grid de KPIs con stagger
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, cardHover } from '../../config/animations.config';

<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {kpis.map((kpi) => (
    <motion.div key={kpi.id} variants={staggerItem} whileHover="hover" initial="rest" animate="rest">
      <KpiCard {...kpi} />
    </motion.div>
  ))}
</motion.div>
```

### 5.4 Reglas de animación

| Regla | Detalle |
|-------|---------|
| Duración máxima | 400ms para entradas, 200ms para hovers |
| Easing | `[0.4, 0, 0.2, 1]` (Material Design standard) |
| Stagger delay | 80-100ms entre items |
| No animar en reduced-motion | Respetar `prefers-reduced-motion: reduce` |
| No animar al navegar de vuelta | Solo en primera carga de la página |
| Hover solo en desktop | `@media (hover: hover)` |

---

## 6. Skeletons y Estados de Carga

### 6.1 Paleta de skeletons (del Manual — azulados, no grises)

```typescript
// Colores de skeleton basados en la paleta VIGIA
export const skeletonColors = {
  base: 'rgba(13, 92, 207, 0.06)',      // Azul muy sutil
  pulse: 'rgba(13, 92, 207, 0.12)',     // Azul sutil (pulso)
  // Alternativa con verde IA para elementos de "procesamiento":
  baseIA: 'rgba(25, 214, 196, 0.06)',
  pulseIA: 'rgba(25, 214, 196, 0.12)',
};
```

### 6.2 Animación del skeleton

```css
@keyframes vigiaSkeletonPulse {
  0% { background-color: rgba(13, 92, 207, 0.06); }
  50% { background-color: rgba(13, 92, 207, 0.12); }
  100% { background-color: rgba(13, 92, 207, 0.06); }
}

.vigia-skeleton {
  animation: vigiaSkeletonPulse 1.5s ease-in-out infinite;
  border-radius: 6px;
}
```

### 6.3 Variantes de skeleton por página

| Página | Skeleton layout |
|--------|----------------|
| **Inicio** | 1 rect (saludo) + 4 rects (KPIs) + 4 lines (actividad) + 2 columns (vehículos/familia) |
| **Mis Vehículos** | Grid de 3 rects (160px height) con borderRadius 8px |
| **Gestión Autorizaciones** | 1 rect (tabs) + 5 lines (tabla) |
| **Pases** | 1 rect (header) + 4 lines (tabla) |
| **Alertas** | 5 rects (cards de alerta) con borde izquierdo |

### 6.4 Implementación en el átomo LoadingSkeleton

El átomo `LoadingSkeleton.tsx` ya existe. Se debe actualizar para:
1. Usar colores azulados en vez de grises por defecto de MUI
2. Agregar variante `inicio` para el skeleton del dashboard
3. Agregar animación con `@keyframes` custom (más suave que la de MUI)

```tsx
// Actualizar el sx del Skeleton de MUI:
<Skeleton
  sx={{
    bgcolor: 'rgba(13, 92, 207, 0.06)',
    '&::after': {
      background: 'linear-gradient(90deg, transparent, rgba(13, 92, 207, 0.08), transparent)',
    },
  }}
/>
```

---

## 7. Propagación a otras Dashboards

### Estrategia: Atomic Design como vehículo de propagación

La refactorización se hace a nivel de **átomos y moléculas**. Cuando se mejora un átomo (ej: `StatusChip`, `EmptyState`) o una molécula (ej: `NavItem`, `VehicleCard`), **todas las páginas que lo usan se benefician automáticamente**.

| Nivel | Componentes que se mejoran | Impacto |
|-------|---------------------------|---------|
| **Átomos** | StatusChip, LoadingSkeleton, ErrorState, EmptyState, GradientBar | Todas las páginas |
| **Moléculas** | NavItem, VehicleCard, NotificationItem, BrandBlock | Sidebar + páginas específicas |
| **Organismos** | Sidebar, Header | Todas las páginas (via DashboardTemplate) |
| **Template** | DashboardTemplate | Todas las páginas |

### Componentes nuevos que se crean en esta refactorización:

| Componente | Nivel | Reutilizable en |
|------------|-------|-----------------|
| `KpiCard` | Molécula | Inicio Propietario, Inicio Guardia, Inicio Admin |
| `ActivityTimeline` | Organismo | Inicio Propietario, Inicio Guardia |
| `MiniVehicleList` | Molécula | Inicio Propietario |
| `MiniFamilyGrid` | Molécula | Inicio Propietario |
| `QuickActions` | Molécula | Inicio Propietario, Inicio Guardia |
| `AlertCard` | Molécula | Alertas Propietario, Alertas Guardia |
| `FilterChips` | Molécula | Gestión Autorizaciones, Alertas |
| `AnimatedCounter` | Átomo | KpiCard (cualquier dashboard) |
| `SectionHeader` | Átomo | Todas las páginas |

### Cuando se haga el dashboard del Guardia:

1. Reutiliza: `KpiCard`, `ActivityTimeline`, `QuickActions`, `AlertCard`, `AnimatedCounter`, `SectionHeader`
2. Solo crea: contenido específico del guardia (cola de eventos, validación de código)
3. El template, sidebar, header, animaciones y design tokens ya están listos

---

## 8. Fases de Implementación

### Fase R1: Sistema de diseño + Animaciones (fundación)
**Commit:** `feat(frontend): implementar design tokens, animaciones y skeletons azulados`

| Archivo | Acción |
|---------|--------|
| `src/config/animations.config.ts` | CREAR — Variantes de framer-motion |
| `src/theme/vigia-theme.ts` | ACTUALIZAR — Agregar sombras, radius, spacing tokens |
| `src/components/atoms/LoadingSkeleton.tsx` | ACTUALIZAR — Colores azulados + variante 'inicio' |
| `src/components/atoms/AnimatedCounter.tsx` | CREAR — Counter con spring animation |
| `src/components/atoms/SectionHeader.tsx` | CREAR — Título de sección reutilizable |
| `package.json` | ACTUALIZAR — Agregar framer-motion |

**Verificación:**
- [ ] `pnpm build` pasa sin errores
- [ ] framer-motion instalado correctamente
- [ ] Tokens exportados y accesibles desde theme

---

### Fase R2: Moléculas nuevas (building blocks)
**Commit:** `feat(frontend): crear moléculas KpiCard, ActivityTimeline, QuickActions, AlertCard`

| Archivo | Acción |
|---------|--------|
| `src/components/molecules/KpiCard.tsx` | CREAR — Card de KPI con número animado, label, indicador, borde superior de color, hover |
| `src/components/molecules/ActivityTimelineItem.tsx` | CREAR — Item de timeline con icono, texto, timestamp, borde izquierdo |
| `src/components/molecules/QuickActionButton.tsx` | CREAR — Botón grande con icono, label, hover con gradiente IA |
| `src/components/molecules/AlertCard.tsx` | CREAR — Card de alerta con borde lateral, icono severidad, acciones |
| `src/components/molecules/FilterChips.tsx` | CREAR — Grupo de chips de filtro con estado activo |
| `src/components/molecules/MiniVehicleItem.tsx` | CREAR — Item compacto de vehículo (placa + marca + estado) |
| `src/components/molecules/MiniFamilyCard.tsx` | CREAR — Card compacta de familiar (avatar + nombre + enrollment) |
| `src/components/molecules/index.ts` | ACTUALIZAR — Agregar exports |

**Verificación:**
- [ ] Todos los componentes se exportan correctamente
- [ ] Cada molécula acepta props tipadas
- [ ] Hover funciona en desktop
- [ ] `pnpm build` pasa sin errores

---

### Fase R3: Rediseño completo de Inicio.tsx
**Commit:** `feat(frontend): rediseñar página Inicio con KPIs, actividad, familia y acciones rápidas`

| Archivo | Acción |
|---------|--------|
| `src/pages/propietario/Inicio.tsx` | REESCRIBIR COMPLETAMENTE — 6 bloques con animaciones |

**Verificación:**
- [ ] 6 bloques visibles sin scroll excesivo en 1080p
- [ ] KPIs con animación counter-up al montar
- [ ] Actividad reciente con stagger fadeInLeft
- [ ] Grupo familiar visible con enrollment indicators
- [ ] Acciones rápidas con hover gradiente IA
- [ ] Responsive: 1 columna en mobile, 2 en tablet, layout completo en desktop
- [ ] Máximo 10% de espacio vacío visible
- [ ] `pnpm build` pasa sin errores

---

### Fase R4: Rediseño de MisVehiculos.tsx
**Commit:** `feat(frontend): rediseñar cards de vehículos con jerarquía visual y hover`

| Archivo | Acción |
|---------|--------|
| `src/components/molecules/VehicleCard.tsx` | REESCRIBIR — Placa hero, borde lateral, mini KPIs, hover con elevación |
| `src/pages/propietario/MisVehiculos.tsx` | ACTUALIZAR — Usar nuevas cards + stagger animation |

**Verificación:**
- [ ] Placa es el elemento más prominente de cada card
- [ ] Borde izquierdo con color de estado
- [ ] Hover eleva la card con sombra
- [ ] Grid responsive (3/2/1 columnas)
- [ ] Formulario de registro sigue funcionando
- [ ] `pnpm build` pasa sin errores

---

### Fase R5: Rediseño de Alertas.tsx
**Commit:** `feat(frontend): rediseñar alertas con urgencia visual y acciones contextuales`

| Archivo | Acción |
|---------|--------|
| `src/pages/propietario/Alertas.tsx` | REESCRIBIR — Usar AlertCard, filtros como chips, diferenciación leída/no leída |

**Verificación:**
- [ ] Alertas no leídas tienen fondo diferenciado
- [ ] Borde izquierdo con color de severidad
- [ ] Iconos de 20px (no dots de 8px)
- [ ] Timestamp relativo ("hace 2h")
- [ ] Filtros como chips horizontales con estado activo
- [ ] `pnpm build` pasa sin errores

---

### Fase R6: Simplificar Gestión de Autorizaciones (4 tabs → 2)
**Commit:** `feat(frontend): simplificar gestión de autorizaciones a 2 tabs con filtros`

| Archivo | Acción |
|---------|--------|
| `src/pages/propietario/PermisosTemporales.tsx` | REESTRUCTURAR — 2 tabs + FilterChips + tabla unificada |

**Verificación:**
- [ ] Solo 2 tabs visibles
- [ ] Tab 1: filtros [Todos][Temporales][Permanentes] funcionan
- [ ] Tab 2: personas + grupo familiar en una vista
- [ ] Toda la funcionalidad anterior se mantiene (crear, revocar)
- [ ] `pnpm build` pasa sin errores

---

### Fase R7: Rediseño de PasesRapidos.tsx + Efecto código
**Commit:** `feat(frontend): rediseñar pases con código badge y animación de generación`

| Archivo | Acción |
|---------|--------|
| `src/pages/propietario/PasesRapidos.tsx` | ACTUALIZAR — Código como badge, row hover, pantalla código con animación |

**Verificación:**
- [ ] Código en tabla tiene fondo azul sutil + monospace
- [ ] Pantalla de código generado tiene animación de entrada (scale + fade)
- [ ] Pulse sutil en el borde del código (gradiente IA)
- [ ] Validación de solapamiento sigue funcionando
- [ ] Warning "una sola vez" sigue visible
- [ ] `pnpm build` pasa sin errores

---

## 9. Checklist de Calidad

### Antes de considerar la refactorización completa:

#### Visual
- [ ] Ninguna página tiene más de 10% de espacio vacío visible en 1080p
- [ ] Todas las cards tienen sombra (no bordes)
- [ ] Todos los hovers tienen transición de 200ms
- [ ] La jerarquía tipográfica es consistente (números grandes, labels pequeños)
- [ ] El gradiente IA se usa en máximo 3 elementos por página (no saturar)
- [ ] El dorado se usa solo como acento (máximo 1-2 elementos por página)
- [ ] Los skeletons son azulados (no grises)

#### Funcional
- [ ] Toda la funcionalidad anterior se mantiene (crear, revocar, filtrar, copiar)
- [ ] La navegación es idéntica en todas las páginas (5 items, mismos iconos)
- [ ] El responsive funciona en 3 breakpoints (mobile/tablet/desktop)
- [ ] No hay errores de TypeScript
- [ ] `pnpm build` pasa sin errores

#### Animaciones
- [ ] Las animaciones respetan `prefers-reduced-motion`
- [ ] Ninguna animación dura más de 400ms
- [ ] El stagger no supera 500ms total (5 items × 100ms)
- [ ] Las animaciones solo ocurren en la primera carga (no al navegar de vuelta)
- [ ] Los hovers solo funcionan en dispositivos con hover (`@media (hover: hover)`)

#### Engagement
- [ ] El Inicio tiene información útil sin necesidad de navegar
- [ ] Los KPIs tienen contexto (no solo un número)
- [ ] La actividad reciente muestra qué pasó sin ir a otra página
- [ ] Las acciones rápidas son prominentes y accesibles
- [ ] El efecto de código generado produce "wow" (animación + pulse)

#### Propagación
- [ ] Los nuevos átomos/moléculas son genéricos (no hardcodean texto de propietario)
- [ ] El DashboardTemplate no cambió (sigue siendo reutilizable por rol)
- [ ] Los design tokens están centralizados en theme
- [ ] Las animaciones están en un config reutilizable

---

## 📊 Resumen ejecutivo

| Métrica | Antes | Después |
|---------|-------|---------|
| Espacio vacío en Inicio | ~70% | <10% |
| Elementos interactivos con hover | 2 (botones) | Todos (cards, rows, chips, botones) |
| Información visible sin navegar | 3 KPIs | KPIs + actividad + vehículos + familia + acciones |
| Animaciones | 0 | Stagger, counter-up, hover, pulse |
| Tiempo para entender el estado del sistema | ~10s (navegar 3 páginas) | ~3s (todo en Inicio) |
| Consistencia visual entre páginas | Baja (cada una diferente) | Alta (design tokens + componentes compartidos) |
| Preparación para dashboard Guardia/Admin | 0% | ~70% (componentes reutilizables listos) |

---

**Este plan es el patrón de diseño definitivo.** Una vez implementado en el dashboard del Propietario, las dashboards de Guardia y Admin seguirán exactamente la misma estructura: KPIs + Actividad + Contenido específico + Acciones rápidas, usando los mismos átomos, moléculas y animaciones.

---

*Documento generado para el proyecto VIGIA · UCE 2026*  
*Aprobado por: Antony Coello — Arquitectura de Software*
