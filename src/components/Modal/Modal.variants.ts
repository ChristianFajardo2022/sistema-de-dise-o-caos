import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Modal (Complex modal) Variants
 *
 * Fuente: set "Complex modal" de Figma (14446:66166), Lateral = off / on. Marcos Desktop y Mobile. El contenido de
 * ejemplo de Figma (Interactive card, List item, Profile card…) vive en el slot Container: va en las historias.
 * - Lateral=off (500 × 548): padding 32 (space/container/on-canva), gap 32 (space/general/4xl). Silueta "Canva" /
 *   "Subtract": background/container/default-on-canva, radio 24 (radius/general/2xl) con muesca de 48 para el
 *   Button corner md On canva (40, ícono close 16).
 * - Lateral=on (576 × 1080): panel lateral derecho a todo el alto, background/container/default-on-canva, radios 32 a la
 *   izquierda (radius/container/on-canva) y 0 a la derecha (radius/general/xs). Encabezado en columna con gap 8
 *   (space/general/lg): fila "Close" (ícono close 24 en línea, alineado a la derecha) + encabezado. Contenido con
 *   Scroll bar a 8 (space/general/lg).
 * - Header: fila con gap 16 (space/general/2xl): Avatar icon On card de 48 (40 en móvil) + "Info" en columna con gap 4
 *   (gap/general/sm): Heading Secondary semibold heading/lg (20/24, text/neutral/heading) y descripción Primary regular
 *   body/md (14/20, line-height-large, text/neutral/body).
 * - Container (slot): ocupa el alto libre, columna con gap 32 (space/general/4xl).
 * - CTA: fila alineada a la derecha con gap 8 (space/general/lg): Tertiary · Secondary · Primary md.
 * - Mobile (376): hoja inferior con background/container/default-on-canva, radios 24 arriba (radius/general/2xl),
 *   padding space/container/on-card arriba, space/general/3xl a los lados y space/container/on-canva abajo; asa de 48 × 2
 *   (background/general/gray-fifth); encabezado en columna centrado (gap 16, Info con gap 0); sin botón cerrar; botones
 *   apilados a todo el ancho (Primary · Secondary · Tertiary) con gap 8.
 */

/** Raíz (el componente de Figma): transparente, mide lo que el marco. */
export const modalPanelVariants = cva('flex min-h-0 max-w-full flex-col mobile:w-full', {
  variants: {
    lateral: {
      false: 'w-125',
      true: 'h-full w-144',
    },
  },
  defaultVariants: { lateral: false },
});

/** Marco "Desktop" (y "Mobile" en móvil). */
export const modalFrameVariants = cva(
  [
    'relative isolate box-border flex min-h-0 w-full flex-1 flex-col',
    'gap-ds-space-general-4xl p-ds-space-container-on-canva',
    'font-ds-primitives-typography-family-primary',
    // Móvil: hoja inferior (los dos tipos)
    'mobile:bg-ds-background-container-default-on-canva',
    'mobile:pt-ds-space-container-on-card mobile:px-ds-space-general-3xl mobile:pb-ds-space-container-on-canva',
    'mobile:rounded-t-ds-radius-general-2xl mobile:rounded-b-ds-radius-general-xs',
  ].join(' '),
  {
    variants: {
      lateral: {
        false: '[--surface-fill:var(--color-ds-background-container-default-on-canva)]',
        true: 'bg-ds-background-container-default-on-canva rounded-l-ds-radius-container-on-canva rounded-r-ds-radius-general-xs',
      },
    },
    defaultVariants: { lateral: false },
  }
);

/** Silueta con muesca (Lateral=off, escritorio). */
export const modalSurfaceClass = 'mobile:hidden';

/** Asa de la hoja (solo móvil). */
export const modalHandleClass =
  'hidden h-0.5 w-12 shrink-0 self-center rounded-ds-radius-general-3xl bg-ds-background-general-gray-fifth mobile:block';

/** Bloque superior (Lateral=on): fila Close + encabezado. */
export const modalTopClass = 'flex shrink-0 flex-col gap-ds-space-general-lg';

export const modalCloseRowClass = 'flex justify-end mobile:hidden';

/** Botón cerrar del panel lateral: ícono de 24 sin caja (como Figma), con foco visible. */
export const modalCloseIconClass = [
  'inline-flex size-6 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-ds-radius-general-full border-0 bg-transparent p-0',
  'text-ds-background-general-white',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
].join(' ');

/** Button corner en la muesca (Lateral=off); en móvil no se dibuja. */
export const modalCornerClass = 'absolute top-0 right-0 mobile:hidden';

export const modalHeaderClass = [
  'flex shrink-0 items-center gap-ds-space-general-2xl',
  'mobile:flex-col mobile:text-center',
].join(' ');

export const modalInfoClass = 'flex min-w-0 flex-1 flex-col gap-ds-space-general-md mobile:w-full mobile:gap-0';

export const modalTitleClass = [
  'm-0 font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg text-ds-text-neutral-heading',
  'outline-none',
].join(' ');

export const modalDescriptionClass = [
  'm-0 [font-weight:var(--ds-primitives-typography-weight-regular)]',
  'text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-body',
].join(' ');

/**
 * Contenido (slot Container): ocupa el alto libre y se desplaza (ScrollArea). Con desborde deja 8 entre el contenido y la
 * barra (ScrollArea `scrollbarGap="lg"`, space/general/lg), como el Scroll bar de Figma.
 */
export const modalBodyVariants = cva(
  'flex min-h-0 flex-1 flex-col gap-ds-space-general-4xl',
  {
    variants: {
      lateral: {
        false: 'mobile:gap-ds-space-general-5xl',
        true: '',
      },
    },
    defaultVariants: { lateral: false },
  }
);

/** CTA: fila a la derecha; en móvil, columna a todo el ancho con Primary arriba (orden del DOM: Tertiary, Secondary, Primary). */
export const modalActionsClass = [
  'flex shrink-0 flex-wrap items-center justify-end gap-ds-space-general-lg',
  'mobile:flex-col-reverse mobile:flex-nowrap mobile:items-stretch',
].join(' ');
