import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — AvatarMenu Variants
 *
 * Fuente: component set "Avatar+dropdown (Atom)" de Figma (12537:1567), Type = Default | Dropdown (48×48; el
 * Dropdown trae la tarjeta "Profile card" 8 por debajo del avatar y alineada a su borde derecho).
 *
 * - Botón: el Avatar (initials, 48 `md`), sin marco propio. El contorno de foco es de 2 con el token de borde activo.
 * - Tarjeta: ancho según el contenido (Hug; 233 con los textos de Figma), relleno background/container/default-on-canva,
 *   trazo de 1 en border/general/default-on-card (cuenta en el layout, como en Figma), radio radius/container/on-card
 *   (24), padding space/container/on-canva (32 escritorio, 24 tableta, 20 móvil) y gap space/general/2xl (16).
 * - Encabezado: Avatar xs (24) + nombre (16/20 typography/weight/Semibold, text/neutral/white) y correo (12/16,
 *   text/acent/firts), gap 8.
 * - Divisor border/general/md; ítems "Dropdown list" simple (34 de alto, sin separación entre ellos); el cierre de sesión
 *   va 16 más abajo, con ícono `logout2`.
 */
/** Con la tarjeta abierta, Figma separa avatar y tarjeta con space/general/lg (8): la capa superior la coloca a esa distancia. */
export const avatarMenuVariants = cva('relative box-border inline-flex shrink-0 align-middle data-[open=true]:gap-ds-space-general-lg');

export const avatarMenuButtonVariants = cva(
  [
    'm-0 box-border inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0',
    'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  ].join(' ')
);

export const avatarMenuPanelVariants = cva(
  [
    'box-border flex w-max max-w-full flex-col gap-ds-space-general-2xl p-ds-space-container-on-canva',
    'rounded-ds-radius-container-on-card bg-ds-background-container-default-on-canva',
    'border-ds-border-general-lg border-solid border-ds-border-general-default-on-card',
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
  ].join(' ')
);

export const avatarMenuIdentityClass = 'flex min-w-0 items-center gap-ds-space-general-lg';
export const avatarMenuNameBlockClass = 'flex min-w-0 flex-col';
export const avatarMenuNameClass =
  'm-0 truncate [font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-primitives-typography-size-lg leading-ds-typography-body-line-height-short-lg text-ds-text-neutral-white';
export const avatarMenuEmailClass =
  'm-0 truncate [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm text-ds-text-acent-firts';
export const avatarMenuMenuClass = 'm-0 flex w-full flex-col p-0';
export const avatarMenuLogoutClass = 'mt-ds-space-general-2xl';
