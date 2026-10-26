import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — FilterPanel / FilterSection Variants
 *
 * Fuentes en la página Filter de Figma:
 * - "Filters" (14014:6050, suelto, 416 × 1080): marcos Desktop y Mobile.
 *   - Desktop: columna, padding 24 (space/container/default ≈ space-general-3xl), gap 32 (gap/canva/default ≈
 *     space-general-4xl), fondo background/container/default-on-canva, radios 32 a la izquierda (radius/container/On canva)
 *     y radius/general/xs a la derecha (pegado al borde de la pantalla).
 *   - Encabezado: "Filtros avanzados" Secundary semibold heading/md (20/24 = heading-lg en tokens.css) + close 24 (line, background/general/white).
 *   - Container: Accordion de Card accordion (Atom) On card con gap 8. Scroll bar oculto.
 *   - Buttons: fila al final (MAX) con gap 8: Secondary md + Primary md.
 *   - Mobile: hoja inferior con radios 24 arriba (radius/container/On card), padding 16/24/40/24, asa de 48 × 2
 *     (background/general/gray-fifth), título heading/sm y botones apilados a todo el ancho.
 * - "Individual filter" (15489:48186, suelto, 554 × 58): título Secundary semibold heading/xs (14/18 = heading-sm en tokens.css; text/neutral/heading)
 *   y slot Container en fila con wrap y gap 8 (gap/general/md ≈ space-general-lg); gap interno 8 (space/general/lg).
 * - "Atoms" (13874:43337): contenido de cada tipo de sección, en columna con gap 16 (gap/general/xl ≈ space-general-2xl).
 */
export const filterPanelSurfaceVariants = cva(
  [
    'relative box-border flex h-full min-h-0 flex-col bg-ds-background-container-default-on-canva',
    'gap-ds-space-general-4xl p-ds-space-general-3xl',
    'w-104 max-w-full rounded-l-ds-radius-container-on-canva rounded-r-ds-radius-general-xs',
    // Móvil: hoja inferior
    'mobile:w-full mobile:rounded-t-ds-radius-container-on-card mobile:rounded-b-ds-radius-general-xs',
    'mobile:pt-ds-space-general-2xl mobile:pb-ds-space-general-5xl',
  ].join(' ')
);

/**
 * Medidas propias del `<dialog>` (la colocación lateral / hoja, el velo y el bloqueo de scroll los da `ModalDialog`
 * con `placement="side"`): ancho del panel en escritorio y alto máximo de la hoja en móvil.
 */
export const filterPanelDialogClass = [
  'w-104',
  // La hoja crece con el contenido hasta el 90 % de la pantalla; a partir de ahí se desplaza la zona de secciones
  'mobile:[&>div]:max-h-[90dvh]',
].join(' ');

/** Asa de la hoja inferior (solo móvil). */
export const filterPanelHandleClass =
  'pointer-events-none absolute top-ds-space-general-md left-1/2 hidden h-0.5 w-12 -translate-x-1/2 rounded-ds-radius-general-3xl bg-ds-background-general-gray-fifth mobile:block';

export const filterPanelHeaderClass = 'flex items-center gap-ds-space-general-lg';

export const filterPanelTitleClass = [
  'm-0 min-w-0 flex-1 font-ds-primitives-typography-family-secundary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  // Figma heading/md (20/24) y, en móvil, heading/sm (16/20): en tokens.css esos valores son heading-lg y heading-md
  'text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg text-ds-text-neutral-white',
  'mobile:text-ds-typography-heading-size-md mobile:leading-ds-typography-heading-line-height-md',
].join(' ');

/** Botón cerrar: ícono de 24 sin caja (como Figma) con foco visible. */
export const filterPanelCloseClass = [
  'inline-flex size-6 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-ds-radius-general-full border-0 bg-transparent p-0',
  'text-ds-background-general-white',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
].join(' ');

/**
 * Zona de secciones: ocupa el alto libre y se desplaza. Se extiende sobre el padding del panel (margen negativo +
 * padding iguales) para que el recorte del scroll no corte la sombra de las tarjetas; el contenido no se mueve.
 */
export const filterPanelBodyClass =
  'flex min-h-0 flex-1 flex-col gap-ds-space-general-lg overflow-y-auto -m-ds-space-general-3xl p-ds-space-general-3xl';

export const filterPanelFooterClass = [
  'flex items-center justify-end gap-ds-space-general-lg',
  'mobile:flex-col mobile:items-stretch',
].join(' ');

export const filterSectionContentClass = 'flex w-full flex-col gap-ds-space-general-2xl';

/** Título con su badge de conteo. */
export const filterSectionTitleRowClass = 'inline-flex items-center gap-ds-space-general-lg';

/** "Individual filter": raíz en columna. */
export const filterSectionPlainVariants = cva('flex w-full flex-col gap-ds-space-general-lg');

export const filterSectionPlainHeaderClass = 'flex items-center gap-ds-space-general-2xl';

export const filterSectionPlainTitleClass = [
  'm-0 min-w-0 font-ds-primitives-typography-family-secundary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  // Figma heading/xs (14/18): en tokens.css ese valor es heading-sm (heading-xs resuelve 12/16)
  'text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm text-ds-text-neutral-heading',
].join(' ');

/** Slot Container de "Individual filter": fila con wrap. */
export const filterSectionPlainSlotClass = 'flex w-full flex-wrap gap-ds-space-general-lg';
