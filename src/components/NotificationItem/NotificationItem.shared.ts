import type { ReactNode } from 'react';

/**
 * Piezas compartidas por los componentes de notificaciones (NotificationItem, NotificationCard, NotificationGroup,
 * NotificationPanel). No se exportan desde el paquete: son de uso interno entre esas carpetas.
 */

/** Texto de muestra de las capas de descripción de Figma ("Lorem ipsum…"); las capas se llaman como su texto. */
export const FIGMA_LOREM = 'Lorem ipsum dolor sit amet consectetur. Duis enim lacinia massa nullam.';

/** `true` si el nodo dibuja algo (ni vacío, ni `false`, ni `null`). */
export const hasContent = (node: ReactNode) => node != null && node !== false && node !== '';

/** Marca el control principal de una notificación (título, descripción o botón de desplegar). */
export const CONTROL_ATTR = 'data-notification-control';

/** Marca la raíz de un panel de notificaciones: último respaldo del foco al eliminar. */
export const PANEL_ATTR = 'data-notification-panel';

/**
 * Foco al eliminar una notificación: pasa a la fila siguiente (o a la anterior si era la última) y, si no queda
 * ninguna, al panel que la contiene. Se llama antes de `onDelete`, mientras la fila sigue montada. Fuera de un panel
 * (lista suelta) y sin filas vecinas el foco no se mueve: quien usa la lista debe llevarlo a un lugar con sentido.
 */
export function focusNeighborNotification(row: Element | null) {
  const li = row?.closest('li');
  if (!li) return;
  let target: HTMLElement | null = null;
  for (const side of ['nextElementSibling', 'previousElementSibling'] as const) {
    for (let el = li[side]; el && !target; el = el[side]) {
      target = el.querySelector<HTMLElement>(`[${CONTROL_ATTR}]`) ?? el.querySelector<HTMLElement>('button:not(:disabled)');
    }
    if (target) break;
  }
  (target ?? li.closest<HTMLElement>(`[${PANEL_ATTR}]`))?.focus();
}

/** Texto del tiempo de la capa "Hace 22m" y descripción, con las mismas medidas en todas las notificaciones. */
export const notificationTimeClass =
  'm-0 min-w-0 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm text-ds-text-neutral-white';

/** Grosor del trazo de Figma (0.5, border/divider/md = stroke/dm; tokens.css aún no trae el alias responsive) como variable local; el trazo se dibuja con box-shadow inset. */
export const STROKE_VAR = '[--nstroke:var(--ds-primitives-stroke-dm)]';

/** Trazo inferior (border/general/default-on-card). */
export const STROKE_BOTTOM = '[box-shadow:inset_0_calc(var(--nstroke)_*_-1)_0_0_var(--color-ds-border-general-default-on-card)]';

/**
 * El trazo INSIDE de Figma suma su grosor al alto del marco con auto layout; el box-shadow no ocupa espacio, así que
 * el relleno inferior (16) lleva el grosor sumado.
 */
/** Igual que `PAD_B_16_STROKE` con el relleno space/container/on-card (24 en escritorio) de las tarjetas. */
export const PAD_B_CARD_STROKE = 'pb-[calc(var(--ds-responsive-space-container-on-card)_+_var(--nstroke))]';

export const PAD_B_16_STROKE = 'pb-[calc(var(--ds-responsive-space-general-2xl)_+_var(--nstroke))]';
