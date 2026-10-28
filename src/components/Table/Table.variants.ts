import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Table Variants
 *
 * Fuente: página Table de Figma. Sets:
 * - `Table` (13751:23691): Type Table | Empty state; columnas en slots (Column, Container, Column3) y columnas fijas
 *   (Sticky 1 y 2). Filas separadas 8 (space/general/lg); el encabezado y la primera fila también.
 * - `Header table (Atom)` (13544:69540): Type Text | Checkbox × State × Radius. Alto dimention/table/header (48 en
 *   escritorio, 56 en móvil), padding space/general/2xl (16; en móvil 16/12), texto 12/18 semibold text/neutral/gray,
 *   ícono transfer2 de 12 con gap 4. Trazo arriba y abajo de border/general/md (1).
 * - `Cell table (Atom)` (13544:69578): State × Radius Left | None | Right. Padding 16/12 (móvil 12/8), trazo de 1 arriba
 *   y abajo (y al costado en Left/Right con Hover o Select), radio radius/general/xl (16) en el extremo.
 * - `Item table (Atom)` (13544:69501) e `Item table` (13059:16129): contenido de 40 de alto, gap space/general/lg (8).
 * - `Dropdown table (Atom)` (13544:69601): fila de 56 con el chevron centrado (padding 24/8).
 * - `Row mobile (Atom)` (13544:69614) y `Card tabla` (20231:8418): versiones de fila para pantallas angostas.
 *
 * Colores por estado (los pone la fila en variables propias, `--tbl-bg` y `--tbl-stroke`, que leen sus celdas):
 * - Default: background/table/default. El trazo border/table/default no existe en tokens.css; vale lo mismo que el
 *   fondo, así que se usa background/table/default (trazo invisible, como en Figma).
 * - Hover (también con foco dentro de la fila): background/table/hover + border/table/hover.
 * - Select (fila seleccionada): background/table/select + border/table/select. Gana sobre Hover.
 */

/** Fila: fija las variables de color de sus celdas según el estado (`data-state` fuerza el aspecto en docs). */
export const tableRowVariants = cva(
  [
    'group/row',
    '[--tbl-bg:var(--color-ds-background-table-default)] [--tbl-stroke:var(--color-ds-background-table-default)]',
    // Hover real, foco con teclado dentro de la fila y Hover forzado
    'hover:[--tbl-bg:var(--color-ds-background-table-hover)] hover:[--tbl-stroke:var(--color-ds-border-table-hover)]',
    'focus-within:[--tbl-bg:var(--color-ds-background-table-hover)] focus-within:[--tbl-stroke:var(--color-ds-border-table-hover)]',
    'data-[state=hover]:[--tbl-bg:var(--color-ds-background-table-hover)] data-[state=hover]:[--tbl-stroke:var(--color-ds-border-table-hover)]',
    // Select gana sobre Hover: las combinaciones con :hover y :focus-within suben la especificidad
    'data-selected:[--tbl-bg:var(--color-ds-background-table-select)] data-selected:[--tbl-stroke:var(--color-ds-border-table-select)]',
    'data-selected:hover:[--tbl-bg:var(--color-ds-background-table-select)] data-selected:hover:[--tbl-stroke:var(--color-ds-border-table-select)]',
    'data-selected:focus-within:[--tbl-bg:var(--color-ds-background-table-select)] data-selected:focus-within:[--tbl-stroke:var(--color-ds-border-table-select)]',
  ].join(' ')
);

const cellColors = 'bg-(--tbl-bg) motion-safe:transition-[background-color,border-color,box-shadow] motion-safe:duration-150';

/** Fija la columna al desplazar en horizontal (Sticky 1 y 2 de Figma). La distancia sale de `stickyOffset`. */
const stickyVariant = {
  none: '',
  start: 'sticky left-(--tbl-sticky-offset,0px) z-10',
  end: 'sticky right-(--tbl-sticky-offset,0px) z-10',
} as const;

/**
 * Celda `<th>` / `<td>`: transparente y sin padding, como la raíz del componente de Figma (el relleno, el trazo y el
 * padding viven en el marco hijo). `h-px` deja que el marco ocupe todo el alto de la fila (`h-full`).
 */
export const tableCellShellVariants = cva('group/cell h-px p-0 align-middle', {
  variants: {
    sticky: stickyVariant,
    checkbox: { true: 'w-12', false: '' },
  },
  defaultVariants: { sticky: 'none', checkbox: false },
});

const frameAlign = {
  start: 'justify-start text-left',
  center: 'justify-center text-center',
  end: 'justify-end text-right',
} as const;

/**
 * Marco de `Header table (Atom)` ("Header table/Text"). Alto dimention/table/header (48; 56 en móvil). El trazo va
 * con box-shadow inset (no ocupa sitio). Radius=On sale de la posición: radio izquierdo en la primera celda y derecho
 * en la última.
 */
export const tableHeadFrameVariants = cva(
  [
    cellColors,
    'flex h-full min-h-ds-dimention-table-header items-center gap-ds-space-general-lg whitespace-nowrap',
    '[box-shadow:inset_0_var(--ds-responsive-border-general-md)_0_0_var(--tbl-stroke),inset_0_calc(-1*var(--ds-responsive-border-general-md))_0_0_var(--tbl-stroke)]',
    'group-first/cell:rounded-l-ds-radius-general-xl group-last/cell:rounded-r-ds-radius-general-xl',
    'py-ds-space-general-2xl font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-gray',
  ].join(' '),
  {
    variants: {
      type: {
        text: 'px-ds-space-general-2xl mobile:px-ds-space-general-xl',
        checkbox: 'px-ds-space-general-2xl',
      },
      align: frameAlign,
    },
    defaultVariants: { type: 'text', align: 'start' },
  }
);

/** Contenido del encabezado ("Text", 16 de alto fijo como en Figma): texto (o botón de orden) con el ícono a 4. */
export const tableHeadContentClass = 'inline-flex h-4 max-w-full items-center gap-ds-space-general-md';

/** Botón de orden dentro del encabezado: hereda tipografía y color; foco visible de 2px. */
export const tableSortButtonClass = [
  tableHeadContentClass,
  'cursor-pointer rounded-ds-radius-general-xs bg-transparent p-0 text-inherit [font:inherit]',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
].join(' ');

/** Ícono transfer2 del encabezado. En móvil Figma lo oculta. */
export const tableSortIconClass = 'shrink-0 text-ds-background-general-white mobile:hidden';

/**
 * Marco de `Cell table (Atom)`. El trazo es un `border` de 1 (Figma lo cuenta en el alto: 1 + 16 + 40 + 16 + 1 = 74).
 * Left y Right salen de la posición (primera y última celda de la fila): radio y trazo lateral.
 */
export const tableCellFrameVariants = cva(
  [
    cellColors,
    'flex h-full flex-col justify-center',
    'border-y-(length:--ds-responsive-border-general-md) border-solid border-(color:--tbl-stroke)',
    'group-first/cell:border-l-(length:--ds-responsive-border-general-md) group-first/cell:rounded-l-ds-radius-general-xl',
    'group-last/cell:border-r-(length:--ds-responsive-border-general-md) group-last/cell:rounded-r-ds-radius-general-xl',
    'px-ds-space-general-xl py-ds-space-general-2xl mobile:px-ds-space-general-lg mobile:py-ds-space-general-xl',
    'font-ds-primitives-typography-family-primary text-ds-text-neutral-white',
  ].join(' ')
);

/** `Item table (Atom)`: caja de contenido de 40 de alto, gap 8. */
export const tableItemVariants = cva('flex min-h-10 min-w-0 items-center gap-ds-space-general-lg', {
  variants: {
    align: { start: 'justify-start text-left', center: 'justify-center text-center', end: 'justify-end text-right' },
    /** Type=Checkbox: 4 a cada lado de la casilla (24 de ancho). */
    checkbox: { true: 'px-ds-space-general-md', false: '' },
  },
  defaultVariants: { align: 'start', checkbox: false },
});

const fontRegular = 'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]';
const fontSemibold = 'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-semibold)]';

/** Bloque de textos (Text Container): título arriba, descripción abajo, sin gap. */
export const tableTextBlockClass = 'flex min-w-0 flex-col justify-center text-left';

/** Título de Type=Text y Text+badge: 14/20 regular, text/neutral/white. */
export const tableTextTitleClass = `${fontRegular} text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-white`;

/** Título de Type=Profile: 14/20 semibold, text/neutral/white. */
export const tableProfileNameClass = `${fontSemibold} text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-white`;

/** Descripción: 12/18 regular, text/neutral/gray 2. */
export const tableDescriptionClass = `${fontRegular} text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-gray-2`;

/** Type=Highlighted text: 14/20 semibold, text/semantic/information-secondary. */
export const tableHighlightClass = `${fontSemibold} text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-semantic-information-secondary`;

/** Type=Button (Actions Block): acciones centradas, gap space/general/md (4). */
export const tableActionsClass = 'flex min-w-0 flex-1 items-center justify-center gap-ds-space-general-md';

/** Celda del estado vacío: sin fondo ni trazo; el EmptyState ocupa todo el ancho. */
export const tableEmptyCellClass = 'p-0 align-middle';

/**
 * `Dropdown table (Atom)`: fila de 56 (padding 24/8 en escritorio; 20/8 dentro de Row mobile) con el botón chevron
 * centrado. State Select usa el fondo de la fila seleccionada.
 */
export const tableDisclosureVariants = cva(
  'flex h-14 flex-1 items-center justify-center gap-ds-space-general-lg px-ds-space-general-lg',
  {
    variants: {
      selected: {
        true: 'bg-ds-background-table-select',
        false: 'bg-ds-background-table-default',
      },
    },
    defaultVariants: { selected: false },
  }
);

/**
 * `Row mobile (Atom)`: tarjeta de radio 16 con trazo de 1 (border/table/default, que no existe en tokens.css: se usa
 * background/table/default, igual valor; o border/table/select). Figma cuenta el trazo en la medida (1286 = 1284 + 2):
 * es un `border`. Sombra effect/shadow-on-canva-md (0 12 32 -2). El fondo lo ponen sus partes (cabecera, campos y
 * fila desplegable), como en Figma.
 */
export const tableMobileRowVariants = cva(
  [
    'list-none overflow-hidden rounded-ds-radius-general-xl border-(length:--ds-responsive-border-general-md) border-solid border-(color:--tbl-stroke)',
    'shadow-[0_12px_32px_-2px_var(--color-ds-responsive-effect-shadow-on-canva-md)]',
    '[--tbl-stroke:var(--color-ds-background-table-default)] [--tbl-bg:var(--color-ds-background-table-default)]',
    'data-selected:[--tbl-stroke:var(--color-ds-border-table-select)] data-selected:[--tbl-bg:var(--color-ds-background-table-select)]',
  ].join(' ')
);

/** Lista de filas móviles: separadas 8 (space/general/lg). */
export const tableMobileListClass = 'm-0 flex list-none flex-col gap-ds-space-general-lg p-0';

/** Cabecera de Row mobile: casilla (40), etiqueta y acciones a la derecha; 56 de alto. */
export const tableMobileHeaderClass = 'flex h-14 items-center bg-(--tbl-bg)';

/** Celda móvil (Cell table en modo Mobile): padding 12/8. */
export const tableMobileCellClass = 'flex h-full min-w-0 items-center px-ds-space-general-lg py-ds-space-general-xl';

/**
 * Lista de campos con la línea divisoria final: 0.5 (stroke/dm) en border/general/default-on-canva, con 12 a cada
 * lado. Es un pseudo-elemento absoluto (`<dl>` solo admite grupos de término y definición; en Figma la línea no
 * ocupa alto).
 */
export const tableMobileDividerClass = [
  'relative bg-(--tbl-bg)',
  "after:absolute after:inset-x-ds-space-general-xl after:bottom-0 after:h-(--ds-primitives-stroke-dm) after:bg-ds-border-general-default-on-canva after:content-['']",
].join(' ');

/** Fila de campo (Header table de 120 + Cell table), con la misma línea arriba como pseudo-elemento. */
export const tableMobileFieldClass = [
  'relative flex h-14 items-center',
  "before:absolute before:inset-x-ds-space-general-xl before:top-0 before:h-(--ds-primitives-stroke-dm) before:bg-ds-border-general-default-on-canva before:content-['']",
].join(' ');

/** Etiqueta del campo: Header table en modo Mobile (120 de ancho, padding 16/12, 12/18 semibold text/neutral/gray). */
export const tableMobileLabelClass = [
  'flex h-full w-30 shrink-0 items-center px-ds-space-general-xl py-ds-space-general-2xl',
  fontSemibold,
  'text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-gray',
].join(' ');

/** Valor del campo: Cell table en modo Mobile. */
export const tableMobileValueClass = 'm-0 flex h-full min-w-0 flex-1 items-center px-ds-space-general-lg py-ds-space-general-xl';

/**
 * `Card tabla` (20231:8418): Default = resumen en una fila (padding 16, gap 32, radio 16,
 * background/container/default-on-canva). Variant2 (abierta) = background/container/select-on-canva, columna con gap 24.
 */
export const tableRowCardVariants = cva(
  'flex rounded-ds-radius-general-xl p-ds-space-general-2xl motion-safe:transition-colors motion-safe:duration-150',
  {
    variants: {
      expanded: {
        true: 'flex-col gap-ds-space-general-3xl bg-ds-background-container-select-on-canva',
        false: 'items-center gap-ds-space-general-4xl bg-ds-background-container-default-on-canva',
      },
    },
    defaultVariants: { expanded: false },
  }
);

/** Fila de resumen: campos con gap 32 y el chevron a la derecha. */
export const tableRowCardSummaryClass = 'flex min-w-0 flex-1 items-center gap-ds-space-general-4xl';

/** Campos del resumen (Frame interno de Figma): fila con gap 32 que se parte en varias líneas si no cabe. */
export const tableRowCardFieldsClass = 'flex min-w-0 flex-1 flex-wrap items-center gap-x-ds-space-general-4xl gap-y-ds-space-general-lg';

/** Botón chevron de 24 (sin fondo en Figma) con foco visible. */
export const tableRowCardToggleClass = [
  'inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-ds-radius-general-xs bg-transparent p-0 text-ds-icon-general-default',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
].join(' ');

/** Detalle de la tarjeta abierta: bloques con gap 24. */
export const tableRowCardDetailsClass = 'flex flex-col gap-ds-space-general-3xl';

/** Pie de la tarjeta abierta (Button "Ver más"): alineado a la derecha. */
export const tableRowCardFooterClass = 'flex justify-end';
