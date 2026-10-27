import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — ContactCard Variants
 *
 * Fuente: component set "Call/chat card" de Figma (18867:20091), Propiedad 1 = More | Communication | External Link
 * (498×82). Mismo componente con tres acciones a la derecha, sobre la superficie interna de las tarjetas.
 *
 * - Raíz transparente, fila, centrada, alto mínimo 82 (min-h-20.5), padding 16 (space/general/2xl), gap 16.
 *   Superficie background/container/default-on-card, radius/general/2xl (24); con muesca (More y External Link)
 *   el Button corner va arriba a la derecha.
 * - "Item card" (Avatar 56): marcador interno, un contenedor 56×56 relativo (con -3 de margen vertical: el alto de 82 de Figma
 *   es menor que 56 + padding 16×2) para el avatar y la calificación
 *   (Badge ícono + número a 22/40 del avatar).
 * - Información: gap 4. Línea corta (`eyebrow`, capa "Titulo") 12/18 (typography/body/size/sm) en text/neutral/body;
 *   encabezado (`title`, capa "Subtitulo") Prospero semibold 12/16 (heading xs) en text/neutral/white.
 * - More: Button corner Dots en la muesca de 48. External Link: Button primario de 48 en una muesca de 54 (`lg`).
 * - Communication: dos Button secondary sm de ícono (48), gap 8.
 */
export const contactCardVariants = cva(
  [
    'relative isolate box-border flex min-h-20.5 w-full min-w-0 items-center gap-ds-space-general-2xl',
    'p-ds-space-container-on-card',
    '[--surface-fill:var(--color-ds-background-container-default-on-card)]',
  ].join(' ')
);

export const contactCardItemVariants = cva('relative -my-0.75 flex size-14 shrink-0 items-center justify-center');

export const contactCardRatingVariants = cva('absolute top-10 left-5.5');

export const contactCardInfoVariants = cva('flex min-w-0 flex-1 flex-col gap-ds-space-general-md');

/** Línea corta (capa "Titulo"): va después del encabezado en el DOM y se ve arriba. */
export const contactCardEyebrowVariants = cva(
  [
    'order-first m-0 min-w-0 truncate font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
    'text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-body',
  ].join(' ')
);

/** Encabezado (capa "Subtitulo"): el nombre. */
export const contactCardTitleVariants = cva(
  [
    'm-0 min-w-0 truncate font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'text-ds-typography-heading-size-xs leading-ds-typography-heading-line-height-xs text-ds-text-neutral-white',
  ].join(' ')
);

export const contactCardActionsVariants = cva('flex shrink-0 items-center gap-ds-space-general-lg');

/** Button corner de "More": arriba a la derecha, dentro de la muesca de 48. */
export const contactCardCornerSlotClass = 'absolute top-0 right-0 z-[1]';

/**
 * Botón principal de "External Link" (48): centrado en la muesca de 54 (3 px de cada borde). Figma resta 54×54 pero
 * deja el botón a 16 del borde derecho, 10 px fuera de la muesca (para diseño).
 */
export const contactCardLinkSlotClass = 'absolute top-0.75 right-0.75 z-[1] flex';

/**
 * Reserva el ancho del botón de la esquina para que el texto no pase por debajo: con el padding (16) y el gap (16),
 * More (40 desde el borde) necesita 8 y External Link (51 desde el borde) 19 → 20.
 */
export const contactCardSpacerVariants = cva('shrink-0 self-stretch', {
  variants: { corner: { more: 'w-2', link: 'w-5' } },
});
