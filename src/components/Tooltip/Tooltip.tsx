import { cloneElement, forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { FocusEvent, MouseEvent, PointerEvent, ReactElement, Ref } from 'react';
import type { TooltipArrow, TooltipProps } from './Tooltip.types';
import { TooltipBubble } from './TooltipBubble';
import { TOP_LAYER_CLASS } from '../_internal/overlay';
import { useAnchoredPosition } from '../../utils/anchoredPosition';
import type { AnchoredSide } from '../../utils/anchoredPosition';
import { cn } from '../../utils/cn';
import { useMergedRefs } from '../../utils/refs';

/** Separación entre el disparador y la punta de la flecha, y margen mínimo con el borde de la pantalla. */
const OFFSET = 4;
const MARGIN = 8;
/** Un foco que llega hasta este tiempo después de un toque viene del toque (no abre el tooltip). */
const TOUCH_FOCUS_MS = 500;

/** La flecha mira al disparador: está en el borde opuesto al lado donde aparece la burbuja. */
const SIDE_OF: Record<TooltipArrow, AnchoredSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
const ARROW_OF: Record<AnchoredSide, TooltipArrow> = { bottom: 'top', top: 'bottom', right: 'left', left: 'right' };

interface TriggerProps {
  ref?: Ref<HTMLElement>;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  'aria-label'?: string;
  onPointerDown?: (event: PointerEvent<HTMLElement>) => void;
  onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

/**
 * Retrasos de apertura y cierre. `dismiss` (Escape) cierra y bloquea la reapertura hasta que se llame a `schedule` con
 * `resetDismissed` (el puntero salió, el disparador perdió el foco o se volvió a enfocar).
 */
function useOpenTimer(setOpen: (open: boolean) => void) {
  const timer = useRef(0);
  const dismissed = useRef(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const cancel = useCallback(() => window.clearTimeout(timer.current), []);

  const schedule = useCallback(
    (next: boolean, ms: number, resetDismissed = false) => {
      window.clearTimeout(timer.current);
      if (resetDismissed) dismissed.current = false;
      if (next && dismissed.current) return;
      if (ms <= 0) setOpen(next);
      else timer.current = window.setTimeout(() => setOpen(next), ms);
    },
    [setOpen]
  );

  const dismiss = useCallback(() => {
    window.clearTimeout(timer.current);
    dismissed.current = true;
    setOpen(false);
  }, [setOpen]);

  return { schedule, cancel, dismiss };
}

/** Recuerda el último toque en el disparador: el foco que llega justo después viene del toque. */
function useTouchFocusGuard() {
  const lastTouch = useRef(0);
  const mark = useCallback((event: PointerEvent<HTMLElement>) => {
    lastTouch.current = event.pointerType === 'touch' ? event.timeStamp : 0;
  }, []);
  const fromTouch = useCallback(
    (event: FocusEvent<HTMLElement>) => lastTouch.current > 0 && event.timeStamp - lastTouch.current < TOUCH_FOCUS_MS,
    []
  );
  return { mark, fromTouch };
}

/**
 * Tooltip: patrón WAI-ARIA APG Tooltip. Texto breve que describe (o nombra) a su disparador.
 *
 * - La burbuja (`role="tooltip"`) vive siempre en el DOM y el disparador la referencia con `aria-describedby` (o con
 *   `aria-labelledby` si `describes="label"`: tooltip como nombre de un botón solo con ícono).
 * - Aparece al pasar el puntero o al enfocar el disparador (tras `delay`) y se oculta al salir el puntero (tras
 *   `closeDelay`) o al perder el foco. No aparece con toque, tampoco por el foco que sigue al toque (igual en todos los
 *   navegadores): en pantallas táctiles el texto debe estar también en otro lugar o en el nombre accesible.
 * - `mode="toggletip"`: para información que solo vive en el globo (p. ej. el ícono de información de un campo). Abre
 *   y cierra con clic, toque, Enter o Espacio en el disparador; cierra con Escape y con clic fuera. Al abrir, el
 *   contenido se anuncia por una región `role="status"`.
 * - WCAG 1.4.13: se puede pasar el puntero a la burbuja sin que se cierre (persistente), Escape la cierra sin mover
 *   el foco ni el puntero (descartable; el Escape se consume y no cierra además un panel que la contenga) y no vuelve a
 *   abrirse hasta que el puntero salga o el disparador pierda o recupere el foco.
 * - No lleva contenido interactivo: nunca recibe el foco. Para botones o enlaces, `Popover`.
 * - Capa superior (atributo `popover="manual"`): no la cortan los contenedores con `overflow` ni cierra otros paneles.
 *   Posición con la flecha apuntando al disparador; pasa al lado opuesto si no cabe y la flecha se reubica.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      content,
      arrow = 'bottom',
      solid = true,
      // `icon` está obsoleto (Figma quitó el ícono): se descarta para que no llegue al DOM
      icon: _icon,
      mode = 'tooltip',
      describes = 'description',
      delay = 300,
      closeDelay = 150,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      id: idProp,
      className,
      onPointerEnter,
      onPointerLeave,
      ...rest
    },
    ref
  ) => {
    const uid = useId();
    const id = idProp ?? `${uid}-tooltip`;
    const toggletip = mode === 'toggletip';
    const [openState, setOpenState] = useState(defaultOpen);
    const open = !disabled && (openProp ?? openState);
    // Lado usado en la última colocación, válido mientras no cambie la posición pedida
    const [placed, setPlaced] = useState<{ arrow: TooltipArrow; side: AnchoredSide }>({ arrow, side: SIDE_OF[arrow] });
    const placedSide = placed.arrow === arrow ? placed.side : SIDE_OF[arrow];
    const bubbleRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const touch = useTouchFocusGuard();
    const mergedBubbleRef = useMergedRefs(bubbleRef, ref);

    const setOpen = useCallback(
      (next: boolean) => {
        if (openProp === undefined) setOpenState(next);
        onOpenChange?.(next);
      },
      [openProp, onOpenChange]
    );
    const { schedule, cancel, dismiss } = useOpenTimer(setOpen);

    // Escape descarta sin mover el foco ni el puntero, y se consume: no cierra también un panel que contenga al disparador
    useEffect(() => {
      if (!open) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        event.stopPropagation();
        dismiss();
      };
      document.addEventListener('keydown', onKeyDown, true);
      return () => document.removeEventListener('keydown', onKeyDown, true);
    }, [open, dismiss]);

    // Toggletip: el clic fuera lo cierra
    useEffect(() => {
      if (!open || !toggletip) return;
      const onPointerDown = (event: globalThis.PointerEvent) => {
        const target = event.target instanceof Node ? event.target : null;
        if (target && (triggerRef.current?.contains(target) || bubbleRef.current?.contains(target))) return;
        setOpen(false);
      };
      document.addEventListener('pointerdown', onPointerDown, true);
      return () => document.removeEventListener('pointerdown', onPointerDown, true);
    }, [open, toggletip, setOpen]);

    const getAnchor = useCallback(() => triggerRef.current, []);
    const place = useAnchoredPosition(
      open,
      bubbleRef,
      getAnchor,
      { side: SIDE_OF[arrow], align: 'center', offset: OFFSET, margin: MARGIN, arrowInset: 16, overflow: 'none', observeSize: true },
      ({ side }) => setPlaced((prev) => (prev.arrow === arrow && prev.side === side ? prev : { arrow, side }))
    );

    // Estado -> capa superior nativa
    useEffect(() => {
      const el = bubbleRef.current;
      if (!el || typeof el.showPopover !== 'function') return;
      const isOpen = el.matches(':popover-open');
      if (open && !isOpen) {
        // Oculto hasta medir y colocar, para que no se vea un cuadro en otra posición
        el.style.visibility = 'hidden';
        el.showPopover();
        place();
      } else if (!open && isOpen) el.hidePopover();
    }, [open, place]);

    const trigger = children as ReactElement<TriggerProps>;
    const {
      ref: ownRef,
      'aria-describedby': ownDescribedBy,
      'aria-labelledby': ownLabelledBy,
      'aria-label': ownLabel,
      onPointerDown: ownPointerDown,
      onPointerEnter: ownPointerEnter,
      onPointerLeave: ownPointerLeave,
      onFocus: ownFocus,
      onBlur: ownBlur,
      onClick: ownClick,
    } = trigger.props;
    const attachTrigger = useMergedRefs(triggerRef, ownRef);
    // Como nombre, el tooltip reemplaza al `aria-label`; como descripción (no en toggletip: lo anuncia la región viva)
    // se suma a la del disparador
    const asLabel = describes === 'label' && !disabled;
    const describedBy =
      [ownDescribedBy, disabled || asLabel || toggletip ? undefined : id].filter(Boolean).join(' ') || undefined;

    const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
      ownPointerDown?.(event);
      touch.mark(event);
    };
    const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
      ownPointerEnter?.(event);
      if (event.pointerType !== 'touch') schedule(true, delay);
    };
    const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
      ownPointerLeave?.(event);
      schedule(false, closeDelay, true);
    };
    const handleFocus = (event: FocusEvent<HTMLElement>) => {
      ownFocus?.(event);
      // El foco que sigue a un toque (Chromium y Android lo dan; Safari en iOS no) no abre: mismo comportamiento en todos
      if (touch.fromTouch(event)) return;
      schedule(true, delay, true);
    };
    const handleBlur = (event: FocusEvent<HTMLElement>) => {
      ownBlur?.(event);
      // Al salir, se olvida el descarte con Escape: el hover lo vuelve a abrir
      schedule(false, 0, true);
    };
    const handleClick = (event: MouseEvent<HTMLElement>) => {
      ownClick?.(event);
      if (event.defaultPrevented || disabled) return;
      setOpen(!open);
    };

    const triggerNode = cloneElement(trigger, {
      ref: attachTrigger,
      'aria-describedby': describedBy,
      ...(asLabel ? { 'aria-labelledby': [...new Set([ownLabelledBy, id].filter(Boolean))].join(' '), 'aria-label': undefined } : {}),
      ...(toggletip
        ? { onClick: handleClick }
        : {
            onPointerDown: handlePointerDown,
            onPointerEnter: handlePointerEnter,
            onPointerLeave: handlePointerLeave,
            onFocus: handleFocus,
            onBlur: handleBlur,
          }),
    });

    if (import.meta.env.DEV && asLabel && ownLabel) {
      console.warn('Tooltip con describes="label": el tooltip nombra al disparador; quítale el aria-label.');
    }

    return (
      <>
        {triggerNode}
        <TooltipBubble
          {...rest}
          ref={mergedBubbleRef}
          id={id}
          role="tooltip"
          popover="manual"
          arrow={open ? ARROW_OF[placedSide] : arrow}
          solid={solid}
          className={cn(TOP_LAYER_CLASS, 'fixed', className)}
          onPointerEnter={(event) => {
            onPointerEnter?.(event);
            // Persistente: el puntero puede pasar a la burbuja sin que se cierre
            if (!toggletip) cancel();
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);
            if (!toggletip) schedule(false, closeDelay);
          }}
        >
          {content}
        </TooltipBubble>
        {toggletip && (
          // Región viva siempre montada: se llena al abrir para que el lector anuncie el contenido
          <span role="status" className="sr-only">
            {open ? content : null}
          </span>
        )}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';
