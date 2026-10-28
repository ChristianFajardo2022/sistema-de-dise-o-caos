import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Avatar Variants
 *
 * Fuente: component sets de Figma de la carpeta Avatar.
 * - Avatar (Type Text/Photo/Brand/Icon, 56): envoltorio de los átomos; en código es `variant`.
 * - Avatar colors (Type Names/User × Size xs/sm/md/lg × Color): círculo con dimention/avatar/*
 *   (24, 32, 48, 56), radio radius/button/full, texto Helvetica (md y lg: typography/button/size/md en regular,
 *   sm y xs: typography/button/size/sm en medium 500). Color: fondo background/*-secondary, texto text/* e ícono icon/*.
 *   Disabled: background/container/disabled-on-card, text/neutral/disabled-negative, icon/general/disabled-negative.
 * - Avatar photo (Size xs-lg): círculo con la imagen; Disabled = imagen en grises.
 * - Avatar brand / Avatar icon (Contrast × State × Size): píldora con fondo background/icon/* y radio
 *   radius/general/full (detalle en avatarPillVariants). Brand: logo de 32 (56 y 48) o 24 (32), color
 *   background/logo/default. Icon: ícono de 24, color icon/general/default . Disabled (brand) e Inactive (icon):
 *   el logo y el ícono pasan a icon/general/disabled-positive.
 * - Indicador: Badge simple en la esquina inferior derecha: de 12 en lg y md, de 8 en sm (avatarBadgeSmClass).
 * - Anillo del grupo: trazo border/general/white-unicolor de border/general/md (0.5) hacia dentro.
 */

/** Raíz transparente: círculo + indicador. En brand e icon la raíz es la píldora (avatarPillVariants). */
export const avatarRootVariants = cva('relative inline-flex shrink-0 align-middle select-none', {
  variants: {
    variant: {
      initials: 'gap-2.5',
      user: 'gap-2.5',
      photo: 'gap-0',
    },
  },
  defaultVariants: { variant: 'initials' },
});

const RING =
  'after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-white-unicolor)]';

/** Punto del indicador en `sm` (32): Figma lo dibuja de 8 (en lg y md es el Badge de 12). Redimensiona la raíz y la elipse. */
export const avatarBadgeSmClass = 'size-2 [&>[data-figma-part=Badge]]:size-2';

/** Anillo de grupo; se mezcla en círculo y píldora. */
export const avatarRingClass = RING;

/** Círculo de initials, user y photo ("Avatar" / "Photos (Atom)" en Figma). */
export const avatarCircleVariants = cva(
  'relative box-border flex shrink-0 items-center justify-center overflow-hidden rounded-ds-radius-button-full',
  {
    variants: {
      size: {
        xs: 'size-ds-dimention-avatar-xs',
        sm: 'size-ds-dimention-avatar-sm',
        md: 'size-ds-dimention-avatar-md',
        lg: 'size-ds-dimention-avatar-lg',
      },
      tone: {
        purple: 'bg-ds-background-acent-secondary text-ds-text-acent-secondary',
        yellow: 'bg-ds-background-semantic-alert-secondary text-ds-text-semantic-alert',
        blue: 'bg-ds-background-semantic-information-secondary text-ds-text-semantic-information',
        green: 'bg-ds-background-semantic-success-secondary text-ds-text-semantic-success',
        red: 'bg-ds-background-semantic-error-secondary text-ds-text-semantic-error',
        disabled: 'bg-ds-background-container-disabled-on-card text-ds-text-neutral-disabled-negative',
        none: '',
      },
    },
    defaultVariants: { size: 'lg', tone: 'purple' },
  }
);

/**
 * Iniciales: Helvetica, peso typography/weight/Semibold (600) en todos los tamaños. md y lg: tamaño de botón md (14);
 * sm y xs: tamaño de botón sm (12).
 */
export const avatarTextVariants = cva(
  [
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'whitespace-nowrap uppercase',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'text-ds-typography-button-size-sm',
        sm: 'text-ds-typography-button-size-sm',
        md: 'text-ds-typography-button-size-md',
        lg: 'text-ds-typography-button-size-md',
      },
    },
    defaultVariants: { size: 'lg' },
  }
);

/**
 * Silueta "User": una cabeza y unos hombros recortados por el círculo. Medidas y posiciones
 * tomadas de Figma por tamaño (relativas al círculo).
 */
export const avatarUserHeadVariants = cva('absolute rounded-full', {
  variants: {
    size: {
      lg: 'size-5 top-[6.57px] left-[18px]',
      md: 'size-[17.14px] top-[7px] left-[15.43px]',
      sm: 'size-[13.48px] top-1 left-[9.26px]',
      xs: 'size-[10.11px] top-1 left-[6.95px]',
    },
    tone: {
      purple: 'bg-ds-icon-acent-tertiary',
      yellow: 'bg-ds-icon-semantic-alert-secondary',
      blue: 'bg-ds-icon-semantic-information-secondary',
      green: 'bg-ds-icon-semantic-success-secondary',
      red: 'bg-ds-icon-semantic-error-secondary',
      disabled: 'bg-ds-icon-general-disabled-negative',
    },
  },
  defaultVariants: { size: 'lg', tone: 'purple' },
});

export const avatarUserBodyVariants = cva('absolute rounded-full', {
  variants: {
    size: {
      lg: 'size-14 top-[28.57px] left-0',
      md: 'size-12 top-[25.86px] left-0',
      sm: 'size-7 top-[18.33px] left-0.5',
      xs: 'size-[21px] top-[14.74px] left-[1.5px]',
    },
    tone: {
      purple: 'bg-ds-icon-acent-tertiary',
      yellow: 'bg-ds-icon-semantic-alert-secondary',
      blue: 'bg-ds-icon-semantic-information-secondary',
      green: 'bg-ds-icon-semantic-success-secondary',
      red: 'bg-ds-icon-semantic-error-secondary',
      disabled: 'bg-ds-icon-general-disabled-negative',
    },
  },
  defaultVariants: { size: 'lg', tone: 'purple' },
});

/** Fondos de la píldora (Figma: background/icon/{default,hover,select}-{on-canva,on-card}). */
const ON_CANVA_DEFAULT = 'bg-ds-background-icon-default-on-canva';
const ON_CARD_DEFAULT = 'bg-ds-background-icon-default-on-card';
const ON_CANVA_HOVER = 'bg-ds-background-icon-hover-on-canva';
const ON_CANVA_SELECT = 'bg-ds-background-icon-select-on-canva';
const ON_CARD_HOVER = 'bg-ds-background-icon-hover-on-card';
const ON_CARD_SELECT = 'bg-ds-background-icon-select-on-card';
const ON_CARD_INACTIVE = 'bg-ds-background-icon-low-unicolor';

/**
 * Píldora de brand e icon: la raíz del avatar. El padding (y por tanto el recuadro interior) depende del tamaño.
 * Icon (set "Avatar icon", Contrast × Size × State): 56 / 48 / 40 con ícono de 24 y padding 16 / 12 / 8
 * (Figma md / sm / xs = aquí lg / md / sm). En móvil (< 48rem) los tokens dimention/avatar bajan lg a 48 y md a 40, y el
 * padding baja con ellos (12 y 8) para que el ícono siga en 24. `xs` (24, ícono de 16) no existe en Figma y se conserva derivado.
 * Brand (set "Avatar brand"): State Default o Disabled; en Figma su On Canva usa el fondo "on-card" del set Icon y su
 * On Card el "on-canva".
 */
export const avatarPillVariants = cva(
  'relative box-border inline-flex shrink-0 items-center justify-center align-middle select-none gap-2.5 rounded-ds-radius-general-full',
  {
    variants: {
      variant: { brand: '', icon: '' },
      size: {
        xs: 'size-ds-dimention-avatar-xs p-ds-space-general-md',
        sm: 'size-ds-dimention-avatar-sm',
        md: 'size-ds-dimention-avatar-md',
        lg: 'size-ds-dimention-avatar-lg',
      },
      contrast: { 'on-canva': '', 'on-card': '' },
      state: { default: '', hover: '', select: '', inactive: '' },
    },
    compoundVariants: [
      { variant: 'brand', size: 'sm', class: 'p-ds-space-general-md' },
      { variant: 'brand', size: 'md', class: 'p-ds-space-general-lg' },
      { variant: 'brand', size: 'lg', class: 'p-ds-space-general-xl' },
      { variant: 'icon', size: 'xs', class: 'p-ds-space-general-md' },
      { variant: 'icon', size: 'sm', class: 'size-10 p-ds-space-general-lg' },
      { variant: 'icon', size: 'md', class: 'p-ds-space-general-xl mobile:p-ds-space-general-lg' },
      { variant: 'icon', size: 'lg', class: 'p-ds-space-general-2xl mobile:p-ds-space-general-xl' },
      // Colores del glifo
      { variant: 'brand', state: ['default', 'hover', 'select'], class: 'text-ds-background-logo-default' },
      { variant: 'icon', state: ['default', 'hover', 'select'], class: 'text-ds-icon-general-default' },
      { state: 'inactive', class: 'text-ds-icon-general-disabled-positive' },
      // Brand: solo Default / Disabled; el fondo no cambia
      { variant: 'brand', contrast: 'on-canva', class: ON_CARD_DEFAULT },
      { variant: 'brand', contrast: 'on-card', class: ON_CANVA_DEFAULT },
      // Icon
      { variant: 'icon', contrast: 'on-canva', state: ['default', 'inactive'], class: ON_CANVA_DEFAULT },
      { variant: 'icon', contrast: 'on-canva', state: 'hover', class: ON_CANVA_HOVER },
      { variant: 'icon', contrast: 'on-canva', state: 'select', class: ON_CANVA_SELECT },
      { variant: 'icon', contrast: 'on-card', state: 'default', class: ON_CARD_DEFAULT },
      { variant: 'icon', contrast: 'on-card', state: 'hover', class: ON_CARD_HOVER },
      { variant: 'icon', contrast: 'on-card', state: 'select', class: ON_CARD_SELECT },
      { variant: 'icon', contrast: 'on-card', state: 'inactive', class: ON_CARD_INACTIVE },
    ],
    defaultVariants: { variant: 'brand', size: 'lg', contrast: 'on-canva', state: 'default' },
  }
);

/** Recuadro del logo dentro de la píldora brand. El hijo ocupa todo el recuadro. */
export const avatarLogoVariants = cva('flex shrink-0 items-center justify-center [&>*]:size-full', {
  variants: {
    size: { xs: 'size-4', sm: 'size-6', md: 'size-8', lg: 'size-8' },
  },
  defaultVariants: { size: 'lg' },
});

/** Raíz del "+N": transparente, envuelve el botón (y en Figma el menú del Hover). */
export const avatarPlusRootVariants = cva('relative inline-flex shrink-0 align-middle', {
  variants: { state: { default: 'gap-2.5 hover:gap-2', hover: 'gap-2' } },
  defaultVariants: { state: 'default' },
});

/** Botón del "+N": alto avatar/sm, padding X space/general/lg, fondo background/general/gray-sixth. */
export const avatarPlusButtonVariants = cva(
  [
    'box-border inline-flex cursor-pointer items-center justify-center rounded-ds-radius-general-full border-0',
    'bg-ds-background-general-gray-sixth text-ds-text-neutral-white',
    'outline-offset-2 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
    'hover:shadow-[inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-white-unicolor)]',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'h-ds-dimention-avatar-xs',
        sm: 'h-ds-dimention-avatar-sm',
        md: 'h-ds-dimention-avatar-md',
        lg: 'h-ds-dimention-avatar-lg',
      },
      state: {
        default: 'px-ds-space-general-lg',
        hover:
          'px-[calc(var(--ds-responsive-space-general-lg)+0.5px)] shadow-[inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-white-unicolor)]',
      },
    },
    defaultVariants: { size: 'sm', state: 'default' },
  }
);

/** Texto del "+N": 14 semibold (button/size/md, typography/weight/Semibold) con padding inferior space/general/sm (marco "Frame" de Figma). */
export const avatarPlusTextVariants = cva(
  [
    '[font-family:var(--ds-primitives-typography-family-primary),sans-serif]',
    '[font-weight:var(--ds-primitives-typography-weight-semibold)]',
    'pb-ds-space-general-sm whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'text-ds-typography-button-size-sm',
        sm: 'text-ds-typography-button-size-md',
        md: 'text-ds-typography-button-size-md',
        lg: 'text-ds-typography-button-size-md',
      },
    },
    defaultVariants: { size: 'sm' },
  }
);

/** Raíz del grupo: fila con solape de -8 entre avatares y -16 antes del "+N". */
export const avatarGroupVariants = cva('inline-flex items-center');
