/**
 * Capa superior (atributo `popover`, colocada a mano con `utils/anchoredPosition`). Pieza interna: no se exporta desde
 * el paquete. La usan DropdownMenu, Select, DatePicker, Tooltip y Popover.
 *
 * - Restablece el estilo del navegador para `[popover]` (margen, borde, relleno, `inset`, desplazamiento, fondo y color
 *   de sistema): el panel de dentro pinta.
 * - Cerrado, se oculta explícitamente: si la capa tiene `display` propio (p. ej. `flex` en TooltipBubble y PopoverPanel),
 *   ganaría al `display: none` del navegador. El selector exige el atributo `popover`, así que no oculta un elemento que
 *   no lo tenga (p. ej. el calendario en línea de DatePicker).
 */
export const TOP_LAYER_CLASS =
  'm-0 border-0 bg-transparent p-0 [inset:auto] overflow-visible text-inherit [&[popover]:not(:popover-open)]:hidden';

/** Ancho máximo de un panel de la capa superior: la pantalla menos el margen de 8 a cada lado. */
export const TOP_LAYER_MAX_WIDTH = 'max-w-[calc(100vw-2*0.5rem)]';
