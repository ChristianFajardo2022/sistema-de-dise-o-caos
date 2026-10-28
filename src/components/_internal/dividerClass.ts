/**
 * Divisor de lista de Figma: `border/divider/md` (0.5, alias `stroke/dm`; la variable no está en tokens.css, se usa el
 * primitivo `--ds-primitives-stroke-dm`) en `border/general/default-on-card`. Como el Vector de Figma, la línea no
 * ocupa alto: la caja mide 0 y la raya es un pseudo-elemento centrado en ella (el gap del contenedor queda igual a
 * ambos lados). Trazo fino con relleno de 0.5, no `border` (Chrome redondea border-width).
 */
export const dividerClass = [
  'relative block h-0 w-full shrink-0',
  'before:absolute before:inset-x-0 before:top-0 before:h-(--ds-primitives-stroke-dm) before:-translate-y-1/2',
  "before:bg-ds-border-general-default-on-card before:content-['']",
].join(' ');
