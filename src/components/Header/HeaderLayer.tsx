import { forwardRef, useCallback, useEffect, useRef } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode, SyntheticEvent } from 'react';
import { TOP_LAYER_CLASS, TOP_LAYER_MAX_WIDTH } from '../_internal/overlay';
import { useAnchoredPosition } from '../../utils/anchoredPosition';
import type { AnchoredAlign } from '../../utils/anchoredPosition';
import { assignRef } from '../../utils/refs';
import { cn } from '../../utils/cn';

/** Separación entre el ancla y el panel (la de Figma: 8) y margen mínimo con el borde de la pantalla. */
const OFFSET = 8;
const MARGIN = 8;

export interface HeaderLayerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onToggle' | 'onBeforeToggle'> {
  /** Visible. Debe seguir a `onOpenChange` (la capa también se cierra sola con Escape y el clic fuera). */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** El elemento junto al que se coloca el panel (la campana, el avatar). */
  getAnchor: () => HTMLElement | null;
  /** Alineación con el ancla: `end` = borde derecho con borde derecho (Figma). Por defecto `end`. */
  align?: AnchoredAlign;
  /** Se llama con la capa ya visible y colocada (p. ej. para llevar el foco a su primer control). */
  onOpened?: () => void;
  children: ReactNode;
}

/**
 * Capa superior anclada de la cabecera (pieza interna, no se exporta): atributo nativo `popover="auto"`, posición con
 * `useAnchoredPosition` y foco que vuelve al ancla al cerrar. Escape dentro de la capa y el clic fuera (que no sea en el
 * ancla, que alterna con `popovertarget`) la cierran también desde React: el cierre ligero nativo solo responde a
 * eventos del usuario, no a los que despachan las pruebas o las tecnologías de apoyo.
 * La usan el panel de notificaciones del Header y el menú de perfil de `AvatarMenu`.
 */
export const HeaderLayer = forwardRef<HTMLDivElement, HeaderLayerProps>(
  ({ open, onOpenChange, getAnchor, align = 'end', onOpened, children, className, onKeyDown, ...rest }, ref) => {
    const layerRef = useRef<HTMLDivElement | null>(null);
    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        layerRef.current = node;
        assignRef(ref, node);
      },
      [ref]
    );
    const place = useAnchoredPosition(open, layerRef, getAnchor, { side: 'bottom', align, offset: OFFSET, margin: MARGIN, observeSize: true });

    // Estado controlado -> capa nativa
    useEffect(() => {
      const el = layerRef.current;
      if (!el || typeof el.showPopover !== 'function') return;
      const isOpen = el.matches(':popover-open');
      if (open && !isOpen) el.showPopover();
      else if (!open && isOpen) el.hidePopover();
    }, [open]);

    // Clic fuera de la capa y del ancla: cierra
    useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target;
        if (!(target instanceof Node) || layerRef.current?.contains(target) || getAnchor()?.contains(target)) return;
        onOpenChange(false);
      };
      document.addEventListener('pointerdown', onPointerDown, true);
      return () => document.removeEventListener('pointerdown', onPointerDown, true);
    }, [open, onOpenChange, getAnchor]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || event.key !== 'Escape' || !open) return;
      event.preventDefault();
      onOpenChange(false);
    };

    const handleBeforeToggle = (event: SyntheticEvent<HTMLDivElement>) => {
      // Oculto hasta medir y colocar, para que no se vea un cuadro en otra posición
      if ((event.nativeEvent as ToggleEvent).newState === 'open' && event.target === event.currentTarget) event.currentTarget.style.visibility = 'hidden';
    };

    const handleToggle = (event: SyntheticEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;
      const next = (event.nativeEvent as ToggleEvent).newState === 'open';
      if (next) {
        place();
        onOpened?.();
      } else {
        // Si el foco se perdió con el cierre, vuelve al ancla (no si el clic fuera lo llevó a otro control)
        const active = document.activeElement;
        if (!active || active === document.body || event.currentTarget.contains(active)) getAnchor()?.focus({ preventScroll: true });
      }
      if (next !== open) onOpenChange(next);
    };

    return (
      <div
        {...rest}
        ref={setRef}
        popover="auto"
        onBeforeToggle={handleBeforeToggle}
        onToggle={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(TOP_LAYER_CLASS, TOP_LAYER_MAX_WIDTH, className)}
      >
        {children}
      </div>
    );
  }
);

HeaderLayer.displayName = 'HeaderLayer';
