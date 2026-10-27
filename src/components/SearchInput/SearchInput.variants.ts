import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — SearchInput Variants
 *
 * Fuente: component set "Search input (Avance)" de Figma (19830:28839, 8 variantes: State).
 *
 * Barra ("Input"):
 * - Alto 64 = padding 12 (space/field/md) + campo de 40; padding izquierdo 24 (space/field/xl), gap 16 (space/field/lg),
 *   radio 16 (radius/field/md). Trazo de 1 por dentro (border/general/md) como box-shadow inset: así no quita alto.
 * - Relleno background/field/surface-search (Disabled sin relleno, Burnt-In background/field/burnt-in).
 * - Trazo por estado: border/field/default, active (foco o panel abierto), disabled, border/semantic/error, success e
 *   information (Helper text). Con error, éxito y ayuda el trazo no cambia con el foco: se suma un anillo de 2 con el
 *   borde activo cuando el `<input>` tiene foco visible (WCAG 2.4.7).
 * - Selector de categoría ("Box Area"): texto 14/18 (typography/field/size/sm) + chevron-down de 16, gap 8.
 *   Separador ("Line 1"): 40 de alto, 0.5 (border/general/sm) border/general/default-on-card, sin ancho en el flujo.
 * - Texto y placeholder: text/field/label (Disabled y Burnt-In text/field/disabled-negative).
 * - Botón de búsqueda: Button tertiary xs con ícono (32×32, lupa de 20).
 *
 * Panel ("Dropdown", Active/Focus): 8 debajo de la barra y con su ancho; padding 24 (space/field/xl), gap 24
 * (space/general/3xl), radio 16, relleno background/field/surface, trazo de 1 border/general/default-on-canva y sombra
 * 0 12 28 -2 (effect/shadow on canva md). Palabras clave 14/20 (body md, gap 8); títulos de sección heading md 16/20
 * Secondary Semibold con el botón de papelera (Button tertiary xs, State Delete); chips = Tag neutral md (gap 8);
 * separadores de 0.5 border/general/default-on-card.
 *
 * Colores locales (no son API): `--sb-border` (trazo), `--sb-text` (texto y placeholder), `--sb-icon` (chevron).
 */

/** Anillo de foco del recuadro cuando su trazo semántico no cambia con el foco. */
const FOCUS_RING_WITHIN = [
  'has-[input:focus-visible]:outline-2',
  'has-[input:focus-visible]:outline-offset-2',
  'has-[input:focus-visible]:outline-solid',
  'has-[input:focus-visible]:outline-ds-border-field-active',
].join(' ');

const ENABLED_TEXT = '[--sb-text:var(--color-ds-text-field-label)] [--sb-icon:var(--color-ds-icon-general-default)]';
const DISABLED_TEXT =
  '[--sb-text:var(--color-ds-text-field-disabled-negative)] [--sb-icon:var(--color-ds-icon-general-disabled-positive)]';

/** La barra (el recuadro con trazo). */
export const searchInputBarVariants = cva(
  [
    'relative box-border flex h-16 w-full min-w-0 items-center gap-ds-space-field-lg',
    'py-ds-space-field-md pr-ds-space-field-md pl-ds-space-field-xl rounded-ds-radius-field-md',
    'shadow-[inset_0_0_0_var(--ds-primitives-stroke-lg)_var(--sb-border)]',
    'transition-[box-shadow,background-color] duration-150 motion-reduce:transition-none',
    'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
  ].join(' '),
  {
    variants: {
      state: {
        default: [
          'bg-ds-background-field-surface-search',
          '[--sb-border:var(--color-ds-border-field-default)] has-[input:focus]:[--sb-border:var(--color-ds-border-field-active)]',
          ENABLED_TEXT,
        ],
        active: ['bg-ds-background-field-surface-search', '[--sb-border:var(--color-ds-border-field-active)]', ENABLED_TEXT],
        'burnt-in': ['bg-ds-background-field-burnt-in', '[--sb-border:var(--color-ds-border-field-default)]', DISABLED_TEXT],
        disabled: ['cursor-not-allowed bg-transparent', '[--sb-border:var(--color-ds-border-field-disabled)]', DISABLED_TEXT],
        error: [
          'bg-ds-background-field-surface-search',
          '[--sb-border:var(--color-ds-border-semantic-error)]',
          FOCUS_RING_WITHIN,
          ENABLED_TEXT,
        ],
        success: [
          'bg-ds-background-field-surface-search',
          '[--sb-border:var(--color-ds-border-semantic-success)]',
          FOCUS_RING_WITHIN,
          ENABLED_TEXT,
        ],
        helper: [
          'bg-ds-background-field-surface-search',
          '[--sb-border:var(--color-ds-border-semantic-information)]',
          FOCUS_RING_WITHIN,
          ENABLED_TEXT,
        ],
      },
    },
    defaultVariants: { state: 'default' },
  }
);

/** Texto 14/18 de la barra (categoría y campo). */
const FIELD_TEXT = 'text-ds-typography-field-size-sm leading-(--ds-responsive-typography-field-line-height-sm) text-(color:--sb-text)';

/** Botón del selector de categoría: texto + chevron. El área de toque crece 12 arriba y abajo y 8 a los lados. */
export const searchInputCategoryClass = [
  'relative flex max-w-40 shrink-0 cursor-pointer items-center gap-ds-space-general-lg border-0 bg-transparent p-0',
  'before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[""]',
  FIELD_TEXT,
  '[font-family:inherit] [font-weight:inherit]',
  'rounded-sm outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
  'disabled:cursor-not-allowed',
].join(' ');

/** Separador vertical de 0.5: 1 de ancho con margen -1 (no ocupa sitio, como la línea girada de Figma). */
export const searchInputDividerClass =
  'h-10 w-px shrink-0 -mr-px shadow-[inset_var(--ds-primitives-stroke-dm)_0_0_0_var(--color-ds-border-general-default-on-card)]';

/** El `<input>`: 40 de alto, sin aspecto nativo. */
export const searchInputControlClass = [
  'h-10 w-full min-w-0 appearance-none border-0 bg-transparent p-0 outline-none',
  FIELD_TEXT,
  'placeholder:text-(color:--sb-text) placeholder:opacity-100',
  '[font-family:inherit] [font-weight:inherit]',
  'read-only:cursor-default disabled:cursor-not-allowed',
  // Quita la "x" nativa del type=search
  '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
].join(' ');

/** Panel de sugerencias. */
export const searchInputPanelClass = [
  'box-border flex w-full min-w-0 flex-col gap-ds-space-general-3xl p-ds-space-field-xl',
  'rounded-ds-radius-field-md bg-ds-background-field-surface',
  '[box-shadow:inset_0_0_0_var(--ds-primitives-stroke-lg)_var(--color-ds-border-general-default-on-canva),0_12px_28px_-2px_var(--color-ds-responsive-effect-shadow-on-canva-md)]',
  'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]',
].join(' ');

/** Separador horizontal de 0.5 del panel (no ocupa alto en el flujo). */
export const searchInputPanelDividerClass =
  'h-px w-full shrink-0 -mb-px shadow-[inset_0_var(--ds-primitives-stroke-dm)_0_0_var(--color-ds-border-general-default-on-card)]';

/** Título de sección: heading md 16/20, Secondary Semibold. */
export const searchInputSectionTitleClass = [
  'm-0 min-w-0 truncate font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md text-ds-text-neutral-white',
].join(' ');

/**
 * Palabra clave (opción de la lista): body md 14/20. Hover y la opción activa (teclado) pintan background/field/hover
 * con un halo de 4 que no mueve el flujo; la activa suma el anillo de 2 con el borde activo.
 */
export const searchInputKeywordVariants = cva(
  [
    'cursor-pointer truncate rounded-sm text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-white',
    'hover:bg-ds-background-field-hover hover:shadow-[0_0_0_var(--ds-responsive-space-general-md)_var(--color-ds-background-field-hover)]',
  ].join(' '),
  {
    variants: {
      active: {
        true: [
          'bg-ds-background-field-hover shadow-[0_0_0_var(--ds-responsive-space-general-md)_var(--color-ds-background-field-hover)]',
          'outline-2 outline-offset-4 outline-solid outline-ds-border-field-active',
        ].join(' '),
        false: '',
      },
    },
    defaultVariants: { active: false },
  }
);

/** Opción con forma de chip (envuelve un Tag): el hover pinta el fondo hover del Tag. */
export const searchInputChipOptionClass =
  'inline-flex cursor-pointer rounded-ds-radius-button-full hover:*:bg-(color:--tag-bg-hover) hover:*:text-[color:var(--tag-fg-hover,var(--tag-fg))]';
