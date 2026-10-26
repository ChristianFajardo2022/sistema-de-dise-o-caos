/** Sombras de las superficies de tarjeta (las usa `NotchedSurface` y el Button corner que va en su muesca). */

export type NotchedSurfaceShadow = 'none' | 'on-card' | 'on-canva' | 'on-card-on-canva';

// drop-shadow no admite spread: se usa el x/y/blur de effect/shadow sm (0 4 12) y md (0 12 32)
export const DROP_SHADOW: Record<NotchedSurfaceShadow, string> = {
  none: '',
  'on-card': '[filter:drop-shadow(0_4px_12px_var(--ds-responsive-effect-shadow-sm))]',
  'on-canva': '[filter:drop-shadow(0_12px_32px_var(--ds-responsive-effect-shadow-md))]',
  'on-card-on-canva':
    '[filter:drop-shadow(0_4px_12px_var(--ds-responsive-effect-shadow-sm))_drop-shadow(0_12px_32px_var(--ds-responsive-effect-shadow-md))]',
};

/** Sombra del Button corner que va en la muesca (effect/shadow sm de la instancia), como `drop-shadow`. */
export const cornerShadowClass = DROP_SHADOW['on-card'];

