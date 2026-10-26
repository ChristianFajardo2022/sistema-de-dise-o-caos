import { cloneElement, forwardRef, isValidElement, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactElement, Ref, ToggleEvent } from 'react';
import type { PopoverArrow, PopoverProps } from './Popover.types';
import { PopoverPanel } from './PopoverPanel';
import { Button } from '../Button';
import { TOP_LAYER_CLASS } from '../_internal/overlay';
import { useAnchoredPosition } from '../../utils/anchoredPosition';
import type { AnchoredAlign, AnchoredSide } from '../../utils/anchoredPosition';
import { cn } from '../../utils/cn';
import { useMergedRefs } from '../../utils/refs';

/** Separación entre el ancla y la punta de la flecha, y margen mínimo con el borde de la pantalla. */
const OFFSET = 4;
const MARGIN = 8;
/** Centro de la flecha centrada a no menos de radius/general/2xl (24) + media flecha (11.31) de las esquinas. */
const ARROW_INSET = 36;

/** Type de Figma (flecha) -> lado del ancla donde va el panel y alineación. */
const PLACEMENT: Record<PopoverArrow, { side: AnchoredSide; align: AnchoredAlign }> = {
  'top-left': { side: 'bottom', align: 'start' },
  'top-right': { side: 'bottom', align: 'end' },
  'center-top': { side: 'bottom', align: 'center' },
  'bottom-left': { side: 'top', align: 'start' },
  'bottom-right': { side: 'top', align: 'end' },
  'center-bottom': { side: 'top', align: 'center' },
  'middle-left': { side: 'right', align: 'center' },
  'middle-right': { side: 'left', align: 'center' },
};

function arrowFor(side: AnchoredSide, align: AnchoredAlign): PopoverArrow {
  if (side === 'left') return 'middle-right';
  if (side === 'right') return 'middle-left';
  const edge = side === 'bottom' ? 'top' : 'bottom';
  return align === 'center' ? `center-${edge}` : `${edge}-${align === 'start' ? 'left' : 'right'}`;
}

const resolveAnchor = (anchor: PopoverProps['anchor']) =>
  anchor && 'current' in anchor ? anchor.current : (anchor as HTMLElement | null | undefined);

/**
 * Popover: diálogo no modal anclado a un elemento, con flecha (set "Tooltip" de Figma con título, texto, contador y
 * botones). No es un tooltip porque tiene contenido interactivo: es `role="dialog"` nombrado por su título
 * (`aria-labelledby`) y descrito por su texto (`aria-describedby`).
 *
 * - Capa superior con el atributo nativo `popover="auto"`: no lo cortan los contenedores con `overflow`; Escape y el
 *   clic fuera lo cierran (los resuelve el navegador). Con `trigger`, el disparador lo abre y cierra
 *   (`popovertarget`) y expone `aria-expanded`, `aria-controls` y `aria-haspopup="dialog"`.
 * - Foco: al abrir pasa al panel (el lector anuncia título y texto; Tab recorre sus botones). Al cerrar vuelve al
 *   elemento que tenía el foco al abrir (normalmente el disparador). No atrapa el foco (no es modal).
 * - Recorrido paso a paso: `step`, `totalSteps` y `onStepChange` dibujan el contador ("1 de 2") y los botones
 *   Anterior / Siguiente (Finalizar en el último paso). Con `anchor` distinto en cada paso, el panel se mueve al nuevo
 *   elemento (y lo desplaza a la vista). Si el botón enfocado desaparece al cambiar de paso, el foco va a Siguiente.
 * - Posición: el lado y la alineación salen de `arrow` (Type de Figma); si no cabe, pasa al lado o la alineación
 *   opuestos y la flecha se reubica para seguir apuntando al ancla.
 * - Escape en capas: con otro panel de la capa superior abierto dentro (p. ej. el "+N" de un AvatarGroup), Escape cierra
 *   solo ese panel.
 * - Controlado: `open` debe seguir a `onOpenChange`; si el padre mantiene `open` cuando el usuario cierra (Escape o
 *   clic fuera, que resuelve el navegador), el panel se vuelve a abrir para no quedar desincronizado.
 * - Sin `actions`, recorrido ni `media` con botón cerrar no hay un control visible para cerrarlo (con lector de
 *   pantalla en móvil no hay Escape): en desarrollo se avisa por consola.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      trigger,
      anchor,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      arrow = 'top-left',
      title,
      children,
      media,
      closeButton = true,
      closeLabel,
      page,
      actions,
      step,
      totalSteps,
      onStepChange,
      onFinish,
      formatStep = (s, t) => `${s} de ${t}`,
      previousLabel = 'Anterior',
      nextLabel = 'Siguiente',
      finishLabel = 'Finalizar',
      id: idProp,
      className,
      onToggle,
      onBeforeToggle,
      ...rest
    },
    ref
  ) => {
    const uid = useId();
    const id = idProp ?? `${uid}-popover`;
    const titleId = `${uid}-title`;
    const descriptionId = `${uid}-description`;
    const [openState, setOpenState] = useState(defaultOpen);
    const open = openProp ?? openState;
    // Lado y alineación de la última colocación, válidos mientras no cambie la posición pedida
    const [placedState, setPlacedState] = useState({ arrow, ...PLACEMENT[arrow] });
    const placed = placedState.arrow === arrow ? placedState : PLACEMENT[arrow];
    const panelRef = useRef<HTMLDivElement | null>(null);
    const openPropRef = useRef(openProp);
    useLayoutEffect(() => {
      openPropRef.current = openProp;
    });
    const triggerRef = useRef<HTMLElement | null>(null);
    const openerRef = useRef<HTMLElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);
    const mergedRef = useMergedRefs(panelRef, ref);
    const ownTriggerRef = isValidElement(trigger) ? (trigger as ReactElement<{ ref?: Ref<HTMLElement> }>).props.ref : undefined;
    const triggerMergedRef = useMergedRefs(triggerRef, ownTriggerRef);

    const getAnchor = useCallback(() => triggerRef.current ?? resolveAnchor(anchor), [anchor]);
    const place = useAnchoredPosition(
      open,
      panelRef,
      getAnchor,
      {
        ...PLACEMENT[arrow],
        alignTo: 'center',
        flipAlign: true,
        offset: OFFSET,
        margin: MARGIN,
        arrowInset: ARROW_INSET,
        overflow: 'none',
        observeSize: true,
      },
      (next) =>
        setPlacedState((prev) =>
          prev.arrow === arrow && prev.side === next.side && prev.align === next.align ? prev : { arrow, side: next.side, align: next.align }
        )
    );

    const hide = useCallback(() => {
      const el = panelRef.current;
      if (!el?.matches(':popover-open')) return;
      // Con el foco dentro, vuelve a quien lo tenía al abrir (antes de ocultar, para que no se pierda)
      if (el.contains(document.activeElement)) openerRef.current?.focus({ preventScroll: true });
      el.hidePopover();
    }, []);

    // Estado controlado o inicial -> capa superior nativa
    useEffect(() => {
      const el = panelRef.current;
      if (!el || typeof el.showPopover !== 'function') return;
      const isOpen = el.matches(':popover-open');
      if (open && !isOpen) el.showPopover();
      else if (!open && isOpen) el.hidePopover();
    }, [open]);

    // Escape y clic fuera también a mano (además del cierre nativo de `popover="auto"`), por si el evento no es del usuario
    useEffect(() => {
      if (!open) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || event.defaultPrevented) return;
        const el = panelRef.current;
        // Un panel anidado abierto (menú, lista) se cierra solo: el nativo cierra el de arriba y este sigue abierto
        if (el?.querySelector(':popover-open')) return;
        const target = event.target instanceof Node ? event.target : null;
        if (target && (el?.contains(target) || triggerRef.current?.contains(target))) hide();
      };
      const onPointerDown = (event: PointerEvent) => {
        const target = event.target instanceof Node ? event.target : null;
        if (!target || panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
        // Otro panel de la capa superior abierto desde este (p. ej. el "+N" de un AvatarGroup) cuenta como dentro
        if (target instanceof Element && target.closest('[popover]') && !target.closest(`#${CSS.escape(id)}`)) return;
        hide();
      };
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('pointerdown', onPointerDown, true);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('pointerdown', onPointerDown, true);
      };
    }, [open, hide, id]);

    const handleBeforeToggle = (event: ToggleEvent<HTMLDivElement>) => {
      onBeforeToggle?.(event);
      // React propaga el toggle de los paneles anidados (p. ej. el "+N" de un AvatarGroup): solo cuenta el propio
      if (event.target !== event.currentTarget) return;
      const el = event.currentTarget;
      if (event.newState === 'open') {
        // Oculto hasta medir y colocar; se recuerda quién tenía el foco para devolvérselo
        el.style.visibility = 'hidden';
        const active = document.activeElement;
        openerRef.current = active instanceof HTMLElement && !el.contains(active) ? active : triggerRef.current;
      }
    };

    const handleToggle = (event: ToggleEvent<HTMLDivElement>) => {
      onToggle?.(event);
      // El cierre de un panel anidado no cierra este (Escape en capas)
      if (event.target !== event.currentTarget) return;
      const next = event.newState === 'open';
      const el = event.currentTarget;
      if (next) {
        place();
        el.focus({ preventScroll: true });
      } else {
        // Si el foco se perdió, vuelve a quien lo tenía al abrir (no si el clic fuera lo llevó a otro control)
        const active = document.activeElement;
        if (!active || active === document.body || el.contains(active)) openerRef.current?.focus({ preventScroll: true });
      }
      setOpenState(next);
      if (next !== open) onOpenChange?.(next);
      // Controlado y el padre no aceptó el cambio (Escape o clic fuera nativos): se vuelve a su estado (el del render
      // siguiente, por si el padre sí lo aceptó)
      if (openProp !== undefined && next !== openProp) {
        requestAnimationFrame(() => {
          const node = panelRef.current;
          const wanted = openPropRef.current;
          if (!node || wanted === undefined || node.matches(':popover-open') === wanted) return;
          if (wanted) node.showPopover();
          else node.hidePopover();
        });
      }
    };

    // Cambio de paso: el ancla nuevo a la vista y, si el botón enfocado desapareció, el foco a Siguiente
    useLayoutEffect(() => {
      const el = panelRef.current;
      if (!open || !el || step === undefined) return;
      const target = getAnchor();
      if (target && target !== triggerRef.current) target.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      if (!el.contains(document.activeElement)) (nextRef.current ?? el).focus({ preventScroll: true });
    }, [step, open, getAnchor]);

    const tour = step !== undefined && totalSteps !== undefined;
    const isLast = tour && step >= totalSteps;
    const footer =
      actions !== undefined
        ? actions
        : tour && onStepChange && (
            <>
              {step > 1 && (
                <Button variant="tertiary" size="xs" unicolor onClick={() => onStepChange(step - 1)} data-figma-part="Button">
                  {previousLabel}
                </Button>
              )}
              <Button
                ref={nextRef}
                variant="secondary"
                contrast="low"
                size="xs"
                unicolor
                data-figma-part="Button"
                onClick={() => {
                  if (!isLast) {
                    onStepChange(step + 1);
                    return;
                  }
                  onFinish?.();
                  hide();
                }}
              >
                {isLast ? finishLabel : nextLabel}
              </Button>
            </>
          );

    const closable = (footer !== undefined && footer !== null && footer !== false) || (media != null && closeButton);
    useEffect(() => {
      if (import.meta.env.DEV && !closable) {
        console.warn('Popover sin `actions`, recorrido ni `media` con botón cerrar: no hay un control visible para cerrarlo.');
      }
    }, [closable]);

    let triggerNode = null;
    if (isValidElement(trigger)) {
      triggerNode = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        ref: triggerMergedRef,
        popoverTarget: id,
        popoverTargetAction: 'toggle',
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': id,
      });
    }

    return (
      <>
        {triggerNode}
        <PopoverPanel
          {...rest}
          ref={mergedRef}
          id={id}
          role="dialog"
          aria-labelledby={title != null && rest['aria-label'] === undefined ? titleId : rest['aria-labelledby']}
          aria-describedby={children != null ? descriptionId : rest['aria-describedby']}
          tabIndex={-1}
          popover="auto"
          onBeforeToggle={handleBeforeToggle}
          onToggle={handleToggle}
          arrow={open ? arrowFor(placed.side, placed.align) : arrow}
          title={title}
          titleId={titleId}
          descriptionId={descriptionId}
          media={media}
          onClose={media != null && closeButton ? hide : undefined}
          closeLabel={closeLabel}
          page={page ?? (tour ? formatStep(step, totalSteps) : undefined)}
          actions={footer}
          className={cn(TOP_LAYER_CLASS, 'outline-none', className)}
        >
          {children}
        </PopoverPanel>
      </>
    );
  }
);

Popover.displayName = 'Popover';
