import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — IconMenu Variants
 *
 * Fuente: component set "Icon menu (Atom)" de Figma (13616:14074), Property 1 = 1 | 2 | 3. Marco de 32×32 con rayas
 * de 24 de largo y trazo `border/general/xl` (1.5) en `border/general/white`.
 *
 * - 1 (menu): rayas horizontales con centro en y = 8, 16 y 24.
 * - 2 (half): la de arriba y la de abajo giradas +15° y -15° sobre su centro (Figma las coloca en x = 4.41); la del
 *   medio no se mueve.
 * - 3 (close): dos rayas a ±45° con centro en (16.5, 16.5); la del medio desaparece.
 * Cada raya gira sobre su propio centro (`transform-box: fill-box`), así el paso de un estado a otro es continuo.
 */
export const iconMenuVariants = cva(
  'box-border block size-8 shrink-0 text-ds-border-general-white [&_line]:origin-center [&_line]:[transform-box:fill-box] [&_line]:stroke-current [&_line]:[stroke-width:var(--ds-responsive-border-general-lg)] [&_line]:[stroke-linecap:butt] motion-safe:[&_line]:transition-[translate,rotate,opacity] motion-safe:[&_line]:duration-200'
);

/** Las tres rayas según el estado. Las clases `translate-*` y `rotate-*` van sobre cada `<line>`. */
export const iconMenuLineClasses: Record<'menu' | 'half' | 'close', readonly [string, string, string]> = {
  menu: ['', '', ''],
  half: ['rotate-[15deg]', '', '-rotate-[15deg]'],
  close: ['translate-x-[0.5px] translate-y-[8.5px] rotate-45', 'opacity-0', 'translate-x-[0.5px] -translate-y-[7.5px] -rotate-45'],
};
