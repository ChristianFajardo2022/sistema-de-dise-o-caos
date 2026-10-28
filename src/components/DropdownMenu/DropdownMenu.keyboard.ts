import type { KeyboardEvent } from 'react';

/**
 * Teclado de menú compartido (patrón WAI-ARIA APG Menu) entre `DropdownMenu` (panel con disparador) y
 * `DropdownMenuList` (lista suelta dentro de otra superficie): flechas con vuelta, Inicio, Fin y letra inicial.
 * Los ítems deshabilitados (`aria-disabled="true"`) se saltan.
 */

export const MENU_ITEM_SELECTOR = '[role^="menuitem"]:not([aria-disabled="true"])';
/** Ítem elegido (aspecto Select o radio marcado): recibe el foco inicial en lugar del primero. */
export const MENU_SELECTED_SELECTOR = '[aria-current="true"], [role="menuitemradio"][aria-checked="true"]';

const TYPEAHEAD_RESET_MS = 600;

export const getMenuItems = (container: HTMLElement | null) =>
  Array.from(container?.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR) ?? []);

/** Foco inicial: el último (`last`) o el elegido si lo hay y, si no, el primero (`first`). */
export function focusMenuItem(container: HTMLElement | null, which: 'first' | 'last') {
  const list = getMenuItems(container);
  if (!list.length) return;
  if (which === 'last') {
    list[list.length - 1].focus();
    return;
  }
  const selected = container?.querySelector<HTMLElement>(MENU_SELECTED_SELECTOR);
  (selected && list.includes(selected) ? selected : list[0]).focus();
}

export interface TypeaheadState {
  text: string;
  timer: number;
}

export const createTypeahead = (): TypeaheadState => ({ text: '', timer: 0 });

interface MenuNavigationOptions {
  /** Estado de la búsqueda por letra (uno por menú; `createTypeahead`). */
  typeahead: TypeaheadState;
  /** Flecha arriba en el primer ítem: si devuelve un elemento, el foco va ahí en lugar de dar la vuelta (campo de búsqueda). */
  beforeFirst?: () => HTMLElement | null | undefined;
}

/**
 * Mueve el foco entre los ítems de `container` según la tecla. Devuelve `true` si la tecla era suya (y entonces ya hizo
 * `preventDefault`). Escape y Tab no son de la lista: los resuelve la superficie que la contiene.
 */
export function handleMenuNavigation(
  event: KeyboardEvent<HTMLElement>,
  container: HTMLElement | null,
  { typeahead, beforeFirst }: MenuNavigationOptions
): boolean {
  const list = getMenuItems(container);
  if (!list.length) return false;
  const target = event.target as HTMLElement;
  const index = list.indexOf(target.closest<HTMLElement>('[role^="menuitem"]') as HTMLElement);
  const move = (el?: HTMLElement | null) => {
    event.preventDefault();
    el?.focus();
    return true;
  };
  switch (event.key) {
    case 'ArrowDown':
      return move(list[(index + 1) % list.length]);
    case 'ArrowUp': {
      const before = index === 0 ? beforeFirst?.() : null;
      return move(before ?? list[(index - 1 + list.length) % list.length]);
    }
    case 'Home':
      return move(list[0]);
    case 'End':
      return move(list[list.length - 1]);
    default: {
      const printable = event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey;
      if (!printable) return false;
      event.preventDefault();
      window.clearTimeout(typeahead.timer);
      typeahead.text += event.key.toLowerCase();
      typeahead.timer = window.setTimeout(() => (typeahead.text = ''), TYPEAHEAD_RESET_MS);
      // Desde el ítem siguiente al actual: con una sola letra repetida se avanza al siguiente que empiece igual
      const order = [...list.slice(index + 1), ...list.slice(0, index + 1)];
      order.find((el) => el.textContent?.trim().toLowerCase().startsWith(typeahead.text))?.focus();
      return true;
    }
  }
}
