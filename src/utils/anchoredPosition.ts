import { useCallback, useLayoutEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Posicionamiento compartido de paneles en la capa superior (atributo `popover`, `position: fixed`) junto a un ancla:
 * DropdownMenu, la lista de Select y el calendario de DatePicker.
 *
 * - Lado: el preferido (`side`) si cabe; si no, el otro; si no cabe en ninguno, el que tenga más espacio, con el alto
 *   limitado a ese espacio y desplazamiento interno (así lo de abajo del panel, p. ej. Aplicar, siempre se alcanza).
 * - Alineación horizontal: `start` (borde izquierdo con el del ancla) o `end` (borde derecho con el del ancla), sin
 *   salirse de la pantalla (margen `margin`).
 * - `matchWidth`: el panel toma el ancho del ancla.
 */
export interface AnchoredPositionOptions {
  /** Alineación horizontal con el ancla. Por defecto `start`. */
  align?: 'start' | 'end';
  /** Lado preferido. Por defecto `bottom`. */
  side?: 'bottom' | 'top';
  /** Separación entre el ancla y el panel (px). */
  offset: number;
  /** Margen mínimo con el borde de la pantalla (px). Por defecto 8. */
  margin?: number;
  /** El panel toma el ancho del ancla. */
  matchWidth?: boolean;
}

interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
}

export interface AnchoredPosition {
  left: number;
  top: number;
  /** Alto máximo (px) cuando el panel no cabe ni arriba ni abajo; `null` si cabe. */
  maxHeight: number | null;
}

/** Cálculo puro de la posición: ancla, tamaño natural del panel y tamaño de la pantalla. */
export function computeAnchoredPosition(
  anchor: Rect,
  panel: { width: number; height: number },
  viewport: { width: number; height: number },
  { align = 'start', side = 'bottom', offset, margin = 8 }: AnchoredPositionOptions
): AnchoredPosition {
  const rawLeft = align === 'end' ? anchor.right - panel.width : anchor.left;
  const left = Math.max(margin, Math.min(rawLeft, viewport.width - panel.width - margin));
  const below = anchor.bottom + offset;
  const spaceBelow = viewport.height - margin - below;
  const spaceAbove = anchor.top - offset - margin;
  const fitsBelow = panel.height <= spaceBelow;
  const fitsAbove = panel.height <= spaceAbove;
  const above = anchor.top - offset - panel.height;

  if (side === 'bottom' ? fitsBelow : fitsBelow && !fitsAbove) return { left, top: below, maxHeight: null };
  if (fitsAbove) return { left, top: above, maxHeight: null };
  // No cabe en ningún lado: el lado con más espacio y el alto limitado a ese espacio
  const useBelow = spaceBelow >= spaceAbove;
  const room = Math.max(0, useBelow ? spaceBelow : spaceAbove);
  return { left, top: useBelow ? below : anchor.top - offset - room, maxHeight: room };
}

/** Coloca `panel` (ya abierto en la capa superior) junto a `anchor`. Deja el panel visible al terminar. */
export function placeAnchored(panel: HTMLElement, anchor: HTMLElement, options: AnchoredPositionOptions) {
  const a = anchor.getBoundingClientRect();
  if (options.matchWidth) panel.style.width = `${a.width}px`;
  // Mide el alto natural (sin el límite de una colocación anterior)
  panel.style.maxHeight = '';
  panel.style.overflowY = '';
  const { width, height } = panel.getBoundingClientRect();
  const pos = computeAnchoredPosition(a, { width, height }, { width: document.documentElement.clientWidth, height: window.innerHeight }, options);
  if (pos.maxHeight !== null) {
    panel.style.maxHeight = `${pos.maxHeight}px`;
    panel.style.overflowY = 'auto';
  }
  panel.style.left = `${pos.left}px`;
  panel.style.top = `${pos.top}px`;
  panel.style.visibility = '';
}

/**
 * Mientras `open`, coloca el panel y lo sigue al desplazar la página o cambiar el tamaño de la ventana (el desplazamiento
 * dentro del propio panel no lo recoloca). Devuelve `place` para recolocar a mano (p. ej. al abrirse por `popovertarget`).
 */
export function useAnchoredPosition(
  open: boolean,
  panelRef: RefObject<HTMLElement | null>,
  getAnchor: () => HTMLElement | null | undefined,
  { align, side, offset, margin, matchWidth }: AnchoredPositionOptions
) {
  const place = useCallback(() => {
    const panel = panelRef.current;
    const anchor = getAnchor();
    if (!panel || !anchor || !panel.matches(':popover-open')) return;
    placeAnchored(panel, anchor, { align, side, offset, margin, matchWidth });
  }, [panelRef, getAnchor, align, side, offset, margin, matchWidth]);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    // Al montar abierto, un ancla ancestro todavía no tiene su ref asignado en este efecto: se recoloca en el siguiente cuadro
    const frame = requestAnimationFrame(place);
    const onScroll = (event: Event) => {
      if (event.target instanceof Node && panelRef.current?.contains(event.target)) return;
      place();
    };
    window.addEventListener('resize', place);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, place, panelRef]);

  return place;
}
