import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Calendar Variants
 *
 * Fuente: component set "Calendar" de Figma (8098:2263; Type: Only date, Date range × Date: Day, Month, Year)
 * y sus celdas: Number cell (Date range), Number cell (Only day), Month cell y Year cell.
 *
 * - Contenedor: fondo background/field/surface, trazo interior de 1 (border/field/default, con sombra inset para que no sume al alto), radio de 24, padding space/field/lg (16),
 *   separación de 32 con el pie. `Only date` mide 413 (cuerpo de 381); `Date range` 740 desde la tableta
 *   (dimention/field/Calendar/calendar min y max) y hasta 460 en móvil.
 * - Celda de día (Only date): círculo con padding space/field/day-cells/sm (4), radio field/full, 14/18.
 *   Default: background/field/default (negro 40 %); Hover: background/field/hover; Select: background/field/active-purpple
 *   con texto white-unicolor; Disabled: sin relleno y texto text/neutral/disabled-positive.
 * - Celda de rango: marco transparente (padding space/field/xs: 4, móvil 2) con el "Number Item" dentro. Los extremos
 *   y el tramo usan la banda background/acent/tertiary-opacity (púrpura 20 %): Active firts y Active finish llevan el
 *   círculo púrpura y la banda al lado interior; Left/Right curve cierran la banda en el borde de la fila; Half active
 *   es la banda sin bordes redondeados.
 * - Celdas de mes (57×42) y año (44×42): padding 8/12, mismos rellenos y radio que el día.
 * - Sin token en tokens.css: las separaciones gap/field/* y gap/general/* (8, 12, 16, 24, 32), el radio
 *   radius/container/modal/top y botton (se usa radius/field/lg, 24) y la sombra del contenedor: dos sombras
 *   (0 -8 80 y -8 0 80) de #003166 al 4 %, sin variable; la geometría va tal cual y el color con secondary/A06 al 4 %.
 *   Las separaciones van con la escala de Tailwind.
 * - Días de la semana: `Only date` enlaza el primitivo color/primary/G08 (igual en los dos temas) y `Date range`
 *   text/neutral/gray 3 (en tokens.css, text/neutral/gray-2: mismos valores).
 */

const FONT = [
  '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
  '[font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-field-size-sm leading-ds-typography-field-line-height-sm',
].join(' ');

/** Foco con teclado (no existe en Figma): outline de 2px por dentro con el token de borde activo (WCAG 2.4.7). */
const FOCUS =
  'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active';

/** Anillo de "hoy" (no existe en Figma): trazo interior de stroke/lg con el borde activo. */
const TODAY = 'shadow-[inset_0_0_0_var(--ds-primitives-stroke-lg)_var(--color-ds-border-field-active)]';

/** Contenedor del calendario. */
export const calendarVariants = cva(
  [
    'box-border flex flex-col gap-8 p-ds-space-field-lg',
    'rounded-ds-radius-field-lg bg-ds-background-field-surface',
    // Trazo interior de 1 (border/field/default) y las dos sombras de Figma (0 -8 80 y -8 0 80). El color de Figma
    // (#003166 al 4 %) no tiene token: se usa el primitivo más cercano, secondary/A06, al 4 %
    '[box-shadow:inset_0_0_0_var(--ds-primitives-stroke-lg)_var(--color-ds-border-field-default),0_-8px_80px_0_var(--cal-shadow),-8px_0_80px_0_var(--cal-shadow)]',
    '[--cal-shadow:color-mix(in_srgb,var(--color-ds-primitives-color-secondary-a06)_4%,transparent)]',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-text-neutral-white',
  ].join(' '),
  {
    variants: {
      mode: {
        single: 'w-full max-w-md',
        range:
          'w-full min-w-ds-dimention-field-calendar-calendar-min max-w-ds-dimention-field-calendar-calendar-max',
      },
    },
    defaultVariants: { mode: 'single' },
  }
);

const CELL_FILL = {
  default: 'bg-ds-background-field-default text-ds-text-neutral-white',
  hover: 'bg-ds-background-field-hover text-ds-text-neutral-white',
  select: 'bg-ds-background-field-active-purpple text-ds-text-neutral-white-unicolor',
  disabled: 'text-ds-text-neutral-disabled-positive',
} as const;

/** Celda de día de `Only date` (set "Number cell (Only day)"): State Default, Hover, Select y Disabled. */
export const dayCellVariants = cva(
  [
    'box-border flex aspect-square w-full items-center justify-center rounded-ds-radius-field-full p-ds-space-field-day-cells-sm',
    'select-none transition-colors duration-150',
    FONT,
    FOCUS,
  ].join(' '),
  {
    variants: {
      state: {
        default: `${CELL_FILL.default} cursor-pointer hover:bg-ds-background-field-hover`,
        hover: `${CELL_FILL.hover} cursor-pointer`,
        select: `${CELL_FILL.select} cursor-pointer`,
        disabled: `${CELL_FILL.disabled} cursor-not-allowed`,
      },
      today: { true: TODAY, false: '' },
    },
    defaultVariants: { state: 'default', today: false },
  }
);

/** Celda de mes o año (sets "Month cell" y "Year cell"): _state Default, Hover, Select y Disabled. */
export const periodCellVariants = cva(
  [
    'box-border flex w-full items-center justify-center rounded-ds-radius-field-full',
    'px-ds-space-field-day-cells-md py-ds-space-field-day-cells-lg',
    'select-none transition-colors duration-150',
    FONT,
    FOCUS,
  ].join(' '),
  {
    variants: {
      state: {
        default: `${CELL_FILL.default} cursor-pointer hover:bg-ds-background-field-hover`,
        hover: `${CELL_FILL.hover} cursor-pointer`,
        select: `${CELL_FILL.select} cursor-pointer`,
        disabled: `${CELL_FILL.disabled} cursor-not-allowed`,
      },
    },
    defaultVariants: { state: 'default' },
  }
);

/** Marco de la celda de rango (el componente mide 56×56 con padding 4; en el calendario llena la columna). */
export const rangeCellVariants = cva(
  ['group/cell box-border flex aspect-square w-full items-stretch', FONT, FOCUS].join(' '),
  {
    variants: {
      state: {
        default: 'cursor-pointer p-ds-space-field-xs',
        hover: 'cursor-pointer p-ds-space-field-xs',
        select: 'cursor-pointer p-ds-space-field-xs',
        disabled: 'cursor-not-allowed p-ds-space-field-xs',
        // Banda hacia la derecha: sin padding derecho
        'active-first': 'cursor-pointer py-ds-space-field-xs pr-0 pl-ds-space-field-xs',
        'left-curve': 'cursor-pointer py-ds-space-field-xs pr-0 pl-ds-space-field-xs',
        // Banda hacia la izquierda: sin padding izquierdo
        'active-finish': 'cursor-pointer py-ds-space-field-xs pr-ds-space-field-xs pl-0',
        'right-curve': 'cursor-pointer py-ds-space-field-xs pr-ds-space-field-xs pl-0',
        // Banda de borde a borde
        'half-active': 'cursor-pointer px-0 py-ds-space-field-xs',
        'full-curve': 'cursor-pointer px-0 py-ds-space-field-xs',
      },
    },
    defaultVariants: { state: 'default' },
  }
);

/** "Number Item" de los estados de círculo (Default, Hover, Select y Disabled). */
export const rangeItemVariants = cva(
  'box-border flex size-full items-center justify-center rounded-ds-radius-field-full transition-colors duration-150',
  {
    variants: {
      state: {
        default: `${CELL_FILL.default} group-hover/cell:bg-ds-background-field-hover`,
        hover: CELL_FILL.hover,
        select: CELL_FILL.select,
        disabled: CELL_FILL.disabled,
      },
      today: { true: TODAY, false: '' },
    },
    defaultVariants: { state: 'default', today: false },
  }
);

/** Banda del tramo (background/acent/tertiary-opacity) con el radio que le toque en cada estado. */
export const rangeBandVariants = cva(
  'box-border flex h-full items-center bg-ds-background-acent-tertiary-opacity text-ds-text-neutral-white',
  {
    variants: {
      state: {
        'active-first': 'pr-ds-space-field-xs rounded-l-ds-radius-field-full',
        'left-curve': 'pr-ds-space-field-xs rounded-l-ds-radius-field-full',
        'active-finish': 'pl-ds-space-field-day-cells-sm rounded-r-ds-radius-field-full',
        'right-curve': 'pl-ds-space-field-day-cells-sm rounded-r-ds-radius-field-full',
        'half-active': 'w-full justify-center p-ds-space-field-day-cells-sm',
        'full-curve': 'w-full justify-center p-ds-space-field-day-cells-sm rounded-ds-radius-field-full',
      },
    },
  }
);

/** Círculo púrpura (o transparente en las curvas) dentro de la banda. */
export const rangeCircleVariants = cva(
  'box-border flex aspect-square h-full items-center justify-center rounded-ds-radius-field-full',
  {
    variants: {
      filled: {
        true: 'bg-ds-background-field-active-purpple text-ds-text-neutral-white-unicolor',
        false: 'text-ds-text-neutral-white',
      },
      today: { true: TODAY, false: '' },
    },
    defaultVariants: { filled: false, today: false },
  }
);

/** Campo desplegable Mes/Año del encabezado de `Date range` (General input Dropdown: alto 56, radio field/md). */
export const rangeFieldVariants = cva(
  [
    'box-border flex h-ds-dimention-field-input-default min-w-0 cursor-pointer items-center gap-3 text-left',
    'rounded-ds-radius-field-md border border-solid bg-transparent',
    'px-ds-space-field-md py-ds-space-field-sm',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'transition-colors duration-150',
    'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' '),
  {
    variants: {
      active: {
        true: 'border-ds-border-field-active',
        false: 'border-ds-border-field-default hover:border-ds-border-field-active',
      },
    },
    defaultVariants: { active: false },
  }
);

/**
 * Chip de la vista (Día, Mes, Año) del encabezado de `Only date`. En Figma es una instancia de
 * "Chips/Secondary/Default/off", que no está en la biblioteca: marcador interno con sus medidas (padding
 * space/button/lg y xl: 8 y 12, alto de texto dimention/button/container/xs: 16, texto typography/button/size/sm: 12,
 * radio button/full, trazo interior de border/general/md: 0.5 con border/general/gray-tertiary).
 */
export const viewChipVariants = cva(
  [
    'box-border inline-flex shrink-0 cursor-pointer items-center justify-center gap-ds-space-button-md',
    'px-ds-space-button-xl py-ds-space-button-lg rounded-ds-radius-button-full bg-transparent',
    '[box-shadow:inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-gray-tertiary)]',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-button-size-sm leading-none text-ds-text-neutral-white whitespace-nowrap',
    FOCUS,
  ].join(' ')
);
