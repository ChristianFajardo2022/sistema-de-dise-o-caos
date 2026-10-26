import { useCallback, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Posicionamiento compartido de paneles en la capa superior (atributo `popover`, `position: fixed`) junto a un ancla:
 * DropdownMenu, la lista de Select, el calendario de DatePicker, Tooltip y Popover.
 *
 * - Lado: el preferido (`side`) si cabe; si no, el opuesto si cabe. Si no cabe en ninguno:
 *   - `overflow: 'shrink'` (por defecto; solo `top`/`bottom`): el lado con más espacio, con el alto limitado a ese
 *     espacio y desplazamiento interno (así lo de abajo del panel, p. ej. Aplicar, siempre se alcanza).
 *   - `overflow: 'none'`: el opuesto si tiene más espacio (si no, el preferido), sin limitar el alto.
 * - Alineación sobre el eje cruzado (`align`): `start`, `center` o `end`, sin salirse de la pantalla (margen `margin`).
 *   Con `alignTo: 'edge'` (por defecto) `start`/`end` alinean el borde del panel con el del ancla; con
 *   `alignTo: 'center'` ponen la esquina del panel (la punta de una flecha de esquina) sobre el centro del ancla.
 *   `flipAlign`: si la alineación pedida no cabe y la opuesta sí, usa la opuesta. Los lados laterales siempre centran.
 * - `matchWidth`: el panel toma el ancho del ancla.
 * - `arrowInset`: con flecha centrada (o lateral), su posición a lo largo del borde (`arrowOffset`), para que siga al
 *   ancla si el panel se corrió para no salirse, a no menos de `arrowInset` de las esquinas. Se escribe en
 *   `--anchored-arrow-offset`.
 * - `observeSize`: recoloca cuando cambia el tamaño del panel o del ancla (ResizeObserver).
 */
export type AnchoredSide = 'top' | 'bottom' | 'left' | 'right';
export type AnchoredAlign = 'start' | 'center' | 'end';

export interface AnchoredPositionOptions {
  /** Lado preferido. Por defecto `bottom`. */
  side?: AnchoredSide;
  /** Alineación sobre el eje cruzado. Por defecto `start`. Los lados laterales solo admiten `center`. */
  align?: AnchoredAlign;
  /**
   * Qué se alinea con `start`/`end`: `edge` (por defecto) el borde del panel con el del ancla (DropdownMenu, Select,
   * DatePicker); `center` la esquina del panel con el centro del ancla (flecha de esquina de Popover).
   */
  alignTo?: 'edge' | 'center';
  /** Separación entre el ancla y el panel (px). */
  offset: number;
  /** Margen mínimo con el borde de la pantalla (px). Por defecto 8. */
  margin?: number;
  /** El panel toma el ancho del ancla. */
  matchWidth?: boolean;
  /** Si no cabe en ningún lado: `shrink` (por defecto, solo arriba/abajo) limita el alto con scroll; `none` no lo limita. */
  overflow?: 'shrink' | 'none';
  /** Si la alineación pedida no cabe y la opuesta sí, usar la opuesta. Por defecto `false`. */
  flipAlign?: boolean;
  /** Con flecha: distancia mínima del centro de la flecha a las esquinas (px). Activa `arrowOffset`. */
  arrowInset?: number;
  /** Recolocar cuando cambia el tamaño del panel o del ancla (ResizeObserver). Por defecto `false`. */
  observeSize?: boolean;
}

interface Rect {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  /** Si falta, `bottom - top`. */
  height?: number;
}

/** Posición del panel (lo que necesitan DropdownMenu, Select y DatePicker). */
export interface AnchoredPosition {
  left: number;
  top: number;
  /** Alto máximo (px) cuando el panel no cabe ni arriba ni abajo (`overflow: 'shrink'`); `null` si cabe. */
  maxHeight: number | null;
}

/** Colocación completa: la posición más el lado y la alineación usados y la posición de la flecha. */
export interface AnchoredPlacement extends AnchoredPosition {
  /** Lado usado. */
  side: AnchoredSide;
  /** Alineación usada. */
  align: AnchoredAlign;
  /** Con `arrowInset` y alineación centrada (o lado lateral): centro de la flecha desde el inicio del borde (px). */
  arrowOffset: number | null;
}

/** Variable CSS con la posición de la flecha (la leen TooltipBubble y PopoverPanel). */
export const ANCHORED_ARROW_VAR = '--anchored-arrow-offset';

const OPPOSITE: Record<AnchoredSide, AnchoredSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const FLIP: Record<AnchoredAlign, AnchoredAlign> = { start: 'end', center: 'center', end: 'start' };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, Math.max(min, max)));

/** Cálculo puro con el lado, la alineación y la flecha: ancla, tamaño natural del panel y tamaño de la pantalla. */
export function computeAnchoredPlacement(
  anchor: Rect,
  panel: { width: number; height: number },
  viewport: { width: number; height: number },
  {
    side: preferred = 'bottom',
    align: alignOption = 'start',
    alignTo = 'edge',
    offset,
    margin = 8,
    overflow = 'shrink',
    flipAlign = false,
    arrowInset,
  }: AnchoredPositionOptions
): AnchoredPlacement {
  const anchorHeight = anchor.height ?? anchor.bottom - anchor.top;
  const vertical = preferred === 'top' || preferred === 'bottom';
  const size = vertical ? panel.height : panel.width;
  const room: Record<AnchoredSide, number> = {
    top: anchor.top - offset - margin,
    bottom: viewport.height - margin - anchor.bottom - offset,
    left: anchor.left - offset - margin,
    right: viewport.width - margin - anchor.right - offset,
  };
  const opposite = OPPOSITE[preferred];

  // Lado: el preferido si cabe; si no, el opuesto si cabe; si no cabe en ninguno, según `overflow`
  let side = preferred;
  let maxHeight: number | null = null;
  if (room[preferred] < size) {
    if (room[opposite] >= size) side = opposite;
    else if (vertical && overflow === 'shrink') {
      side = room.bottom >= room.top ? 'bottom' : 'top';
      maxHeight = Math.max(0, room[side]);
    } else if (room[opposite] > room[preferred]) side = opposite;
  }

  if (vertical) {
    const height = maxHeight ?? panel.height;
    const top = side === 'bottom' ? anchor.bottom + offset : anchor.top - offset - height;
    const cx = anchor.left + anchor.width / 2;
    const maxLeft = viewport.width - margin - panel.width;
    const rawLeft = (a: AnchoredAlign) => {
      if (a === 'center') return cx - panel.width / 2;
      if (alignTo === 'center') return a === 'start' ? cx : cx - panel.width;
      return a === 'start' ? anchor.left : anchor.right - panel.width;
    };
    const fits = (a: AnchoredAlign) => rawLeft(a) >= margin && rawLeft(a) <= maxLeft;
    let align = alignOption;
    if (flipAlign && !fits(alignOption) && fits(FLIP[alignOption])) align = FLIP[alignOption];
    const left = clamp(rawLeft(align), margin, maxLeft);
    const arrowOffset =
      arrowInset !== undefined && align === 'center' ? clamp(cx - left, arrowInset, panel.width - arrowInset) : null;
    return { left, top, maxHeight, side, align, arrowOffset };
  }

  const left = side === 'right' ? anchor.right + offset : anchor.left - offset - panel.width;
  const cy = anchor.top + anchorHeight / 2;
  const top = clamp(cy - panel.height / 2, margin, viewport.height - margin - panel.height);
  const arrowOffset = arrowInset !== undefined ? clamp(cy - top, arrowInset, panel.height - arrowInset) : null;
  return { left, top, maxHeight: null, side, align: 'center', arrowOffset };
}

/** Cálculo puro de la posición (sin lado ni flecha): ancla, tamaño natural del panel y tamaño de la pantalla. */
export function computeAnchoredPosition(
  anchor: Rect,
  panel: { width: number; height: number },
  viewport: { width: number; height: number },
  options: AnchoredPositionOptions
): AnchoredPosition {
  const { left, top, maxHeight } = computeAnchoredPlacement(anchor, panel, viewport, options);
  return { left, top, maxHeight };
}

/** Coloca `panel` (ya abierto en la capa superior) junto a `anchor`. Deja el panel visible al terminar. */
export function placeAnchored(panel: HTMLElement, anchor: HTMLElement, options: AnchoredPositionOptions): AnchoredPlacement {
  const a = anchor.getBoundingClientRect();
  if (options.matchWidth) panel.style.width = `${a.width}px`;
  // Mide el alto natural (sin el límite de una colocación anterior)
  panel.style.maxHeight = '';
  panel.style.overflowY = '';
  const { width, height } = panel.getBoundingClientRect();
  const pos = computeAnchoredPlacement(a, { width, height }, { width: document.documentElement.clientWidth, height: window.innerHeight }, options);
  if (pos.maxHeight !== null) {
    panel.style.maxHeight = `${pos.maxHeight}px`;
    panel.style.overflowY = 'auto';
  }
  panel.style.left = `${pos.left}px`;
  panel.style.top = `${pos.top}px`;
  if (pos.arrowOffset === null) panel.style.removeProperty(ANCHORED_ARROW_VAR);
  else panel.style.setProperty(ANCHORED_ARROW_VAR, `${pos.arrowOffset}px`);
  panel.style.visibility = '';
  return pos;
}

/**
 * Mientras `open`, coloca el panel y lo sigue al desplazar la página o cambiar el tamaño de la ventana (el desplazamiento
 * dentro del propio panel no lo recoloca); con `observeSize`, también al cambiar el tamaño del panel o del ancla.
 * Escribe la posición directamente en el estilo (sin volver a renderizar) y avisa con `onPlace` la colocación usada.
 * Devuelve `place` para recolocar a mano (p. ej. al abrirse por `popovertarget`).
 */
export function useAnchoredPosition(
  open: boolean,
  panelRef: RefObject<HTMLElement | null>,
  getAnchor: () => HTMLElement | null | undefined,
  { side, align, alignTo, offset, margin, matchWidth, overflow, flipAlign, arrowInset, observeSize = false }: AnchoredPositionOptions,
  onPlace?: (placement: AnchoredPlacement) => void
) {
  const onPlaceRef = useRef(onPlace);
  useLayoutEffect(() => {
    onPlaceRef.current = onPlace;
  });

  const place = useCallback(() => {
    const panel = panelRef.current;
    const anchor = getAnchor();
    if (!panel || !anchor || !panel.matches(':popover-open')) return;
    const pos = placeAnchored(panel, anchor, { side, align, alignTo, offset, margin, matchWidth, overflow, flipAlign, arrowInset });
    onPlaceRef.current?.(pos);
  }, [panelRef, getAnchor, side, align, alignTo, offset, margin, matchWidth, overflow, flipAlign, arrowInset]);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    // Al montar abierto, un ancla ancestro todavía no tiene su ref asignado en este efecto: se recoloca en el siguiente cuadro
    const frame = requestAnimationFrame(place);
    const onScroll = (event: Event) => {
      if (event.target instanceof Node && panelRef.current?.contains(event.target)) return;
      place();
    };
    const observer = observeSize && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => place()) : null;
    if (observer) {
      const anchor = getAnchor();
      if (panelRef.current) observer.observe(panelRef.current);
      if (anchor) observer.observe(anchor);
    }
    window.addEventListener('resize', place);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, place, panelRef, getAnchor, observeSize]);

  return place;
}
