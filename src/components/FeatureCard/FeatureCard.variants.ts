import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — FeatureCard Variants
 *
 * Fuente: component set "Cards para destacar" de Figma (16903:57057). El set tiene errores en Figma (no se pueden leer
 * sus props) y sus variantes se llaman "Type=File card, State=default", "Type=canva, State=default" y "Type=File card":
 * aquí son `variant` photo, cutout y surface.
 *
 * - photo (498×654, ancho fluido con la misma proporción): foto de fondo con radius/general/2xl (24) y effect/shadow sm
 *   (utilidad shadow-ds-on-card en la raíz, alfa 0 en oscuro). El texto va en un
 *   `MediaScrim` (tema oscuro forzado y velo superior G14 hasta los bordes): la foto no cambia con el tema. Padding space/container/default (24 → space/general/3xl). Columna con gap
 *   16 (space/general/2xl): bloque de texto y botón (Button secondary sm unicolor).
 * - surface (498 × alto según contenido): superficie interna común (`NotchedSurface`) en
 *   background/container/default-on-canva, muesca de 48 para el Button corner md (On card) y effect/shadow sm como
 *   drop-shadow de la silueta. Padding 24, gap 16 entre el texto y el slot "Espacio" (lista).
 * - Texto (photo y surface): fecha 10/14 (body/size/xs, body/line-height-short/xs) con ícono calendar de 12 y gap 4;
 *   título Prospero semibold heading/size/xl de Figma = 32/36 (en tokens.css heading-2xl; heading-xl es 24/28);
 *   descripción 16/20 (size/lg, body/line-height-short/lg) en "text/neutral/gray 2" de Figma (G07 = text/neutral/gray de
 *   tokens.css). Gap 8 (space/general/lg). Colores de fecha: photo icon/general/white y text/neutral/white; surface
 *   icon/general/gray-high-contrast y text/neutral/body.
 * - cutout (612×681 como mínimo; crece si el texto no cabe): foto con effect/shadow md (drop-shadow) y un recorte escalonado abajo a la
 *   izquierda con esquinas de radius/general/2xl; el texto va en el recorte, sobre la superficie de la página.
 *   Línea corta Prospero semibold 14/18 (heading/size/xs de Figma = heading-sm de tokens.css) en text/neutral/white y
 *   título Prospero bold 40/44 (size/5xl, line-height/9xl) en text/neutral/heading. Gap 11 de Figma sin variable →
 *   space/general/xl (12). El recorte se ajusta al bloque de texto (ver FeatureCard.tsx).
 */

const primary = 'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]';
const secondary = 'font-ds-primitives-typography-family-secondary';

/** Raíz (`<article>`). En surface la superficie lee `--surface-fill`. */
export const featureCardVariants = cva('relative isolate box-border flex w-full min-w-0 flex-col text-left', {
  variants: {
    variant: {
      photo: 'aspect-[498/654] gap-ds-space-general-3xl p-ds-space-general-3xl rounded-ds-radius-general-2xl shadow-ds-on-card',
      surface: [
        'gap-ds-space-general-3xl p-ds-space-general-3xl',
        '[--surface-fill:var(--color-ds-background-container-default-on-canva)]',
      ].join(' '),
      // La proporción 612×681 es un mínimo (espaciador en la misma celda): si el texto no cabe, la tarjeta crece.
      // Tamaño del bloque de texto: lo mide FeatureCard.tsx; hasta la primera medida (o sin JS), valores de reserva.
      cutout: [
        'grid grid-cols-1 [--fc-cut-w:min(70%,28rem)] [--fc-cut-h:9rem]',
        "before:block before:pb-[calc(681/612*100%)] before:content-[''] before:[grid-area:1/1]",
      ].join(' '),
    },
  },
  defaultVariants: { variant: 'photo' },
});

/**
 * photo: el velo de `MediaScrim` llega a los bordes de la tarjeta (sale el padding de 24 por los lados y arriba). Color
 * G14 (el más oscuro de la escala, sin token de velo en Figma): se funde con la foto oscura de Figma y da ≥ 11:1 al
 * texto de Dark con cualquier foto.
 */
export const featureCardScrimClass =
  '[--scrim:var(--color-ds-primitives-color-primary-g14)] [--scrim-out:var(--ds-responsive-space-general-3xl)]';

/** Foto de photo: capa detrás del contenido con el radio de la tarjeta. */
export const featureCardPhotoClass =
  'pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-ds-radius-general-2xl bg-ds-background-container-default-on-card';

/** Imagen dentro de su capa. */
export const featureCardImageClass = 'block size-full object-cover';

/** Marcador neutro cuando no hay imagen: bloque de superficie con el ícono de imagen al centro. */
export const featureCardPlaceholderClass =
  'flex size-full items-center justify-center bg-ds-background-container-default-on-card text-ds-icon-general-gray-high-contrast';

/** Capa "Frame 1984080535": bloque de texto, acción (photo) y slot, con gap 16. */
export const featureCardBodyClass = 'flex w-full min-w-0 flex-col items-start gap-ds-space-general-2xl';

/** Capa "Title/state": fecha, título y descripción con gap 8. */
export const featureCardHeaderClass = 'flex w-full min-w-0 flex-col gap-ds-space-general-lg';

/** Fila de la fecha: ícono de 12 y texto con gap 4. Colores según el tipo. */
export const featureCardDateVariants = cva(
  `flex min-w-0 items-center gap-ds-space-general-md ${primary} text-ds-typography-body-size-xs leading-ds-typography-body-line-height-short-xs`,
  {
    variants: {
      variant: {
        photo: 'text-ds-text-neutral-white [&_[data-slot=date-icon]]:text-ds-icon-general-default',
        surface: 'text-ds-text-neutral-body [&_[data-slot=date-icon]]:text-ds-icon-general-gray-high-contrast',
      },
    },
    defaultVariants: { variant: 'photo' },
  }
);

export const featureCardTitleClass = [
  `m-0 min-w-0 ${secondary} [font-weight:var(--ds-primitives-typography-weight-semibold)]`,
  'text-ds-typography-heading-size-2xl leading-ds-typography-heading-line-height-2xl text-ds-text-neutral-heading',
].join(' ');

export const featureCardDescriptionClass = `m-0 min-w-0 ${primary} text-ds-primitives-typography-size-lg leading-ds-typography-body-line-height-short-lg text-ds-text-neutral-gray`;

/** Slot "Espacio" (ancho completo). */
export const featureCardSlotClass = 'flex w-full min-w-0 flex-col';

/** Button corner de surface: arriba a la derecha, dentro de la muesca de 48. */
export const featureCardCornerClass = 'absolute top-0 right-0 z-[1] flex';

/** Cutout: capa de sombra (effect/shadow md sin spread: drop-shadow sigue el recorte de la máscara). */
export const featureCardCutoutShadowClass =
  'pointer-events-none absolute inset-0 -z-10 [filter:drop-shadow(0_12px_32px_var(--color-ds-responsive-effect-shadow-on-canva-md))]';

/** Cutout: forma "Subtract" (foto recortada con máscara). */
export const featureCardCutoutShapeClass =
  'absolute inset-0 block overflow-hidden rounded-ds-radius-general-2xl bg-ds-background-container-default-on-card';

/**
 * Cutout: bloque de texto en el recorte. Pegado abajo a la izquierda, 16 de aire arriba (space/general/2xl) y 24 a la
 * derecha (space/general/3xl). Deja sitio para las dos esquinas del recorte.
 */
export const featureCardCutoutTextClass = [
  'relative flex max-w-[calc(100%-2*var(--ds-responsive-radius-general-2xl))] min-w-0 flex-col gap-ds-space-general-xl',
  'self-end justify-self-start [grid-area:1/1]',
  'pt-ds-space-general-2xl pr-ds-space-general-3xl',
].join(' ');

export const featureCardEyebrowClass = [
  `order-first m-0 min-w-0 ${secondary} [font-weight:var(--ds-primitives-typography-weight-semibold)]`,
  'text-ds-typography-heading-size-xs leading-ds-typography-heading-line-height-xs text-ds-text-neutral-white',
].join(' ');

export const featureCardCutoutTitleClass = [
  // Palabras más anchas que el recorte (títulos largos, 320 px): se parten en vez de salirse sobre la foto
  `m-0 min-w-0 whitespace-pre-line break-words hyphens-auto ${secondary} [font-weight:var(--ds-primitives-typography-weight-bold)]`,
  'text-ds-primitives-typography-size-5xl leading-ds-primitives-typography-line-height-9xl text-ds-text-neutral-heading',
].join(' ');
