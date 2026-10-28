import { cloneElement, forwardRef, isValidElement, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement, Ref, SyntheticEvent } from 'react';
import { DropdownMenuContext } from './DropdownMenu.context';
import { MENU_SELECTED_SELECTOR, createTypeahead, getMenuItems, handleMenuNavigation } from './DropdownMenu.keyboard';
import type { DropdownMenuProps, DropdownMenuTriggerProps } from './DropdownMenu.types';
import { DropdownMenuPanel } from './DropdownMenuPanel';
import { TOP_LAYER_CLASS, TOP_LAYER_MAX_WIDTH } from '../_internal/overlay';
import { useAnchoredPosition } from '../../utils/anchoredPosition';
import { assignRef } from '../../utils/refs';

/** Separación por defecto entre el disparador y el panel, y margen mínimo con el borde de la pantalla. */
const OFFSET = 4;
const MARGIN = 8;

interface TriggerElementProps {
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  ref?: unknown;
  id?: string;
}

type FocusIntent = 'first' | 'last' | 'none';

/**
 * Panel con disparador, sobre el atributo nativo `popover` (capa superior, clic fuera y Esc los resuelve el navegador).
 *
 * - `mode="menu"` (por defecto): patrón WAI-ARIA APG Menu Button. Enter, Espacio y Flecha abajo abren y llevan el foco al
 *   primer ítem; Flecha arriba al último. Dentro: flechas, Inicio, Fin y letra inicial. Esc cierra y devuelve el foco.
 *   Tab cierra y sigue al elemento siguiente al disparador. Activar un ítem cierra (salvo `checkbox`).
 * - `mode="list"`: lista informativa (`ul`/`li`). El foco se queda en el disparador; no hay roles de menú.
 *
 * Al abrir, el foco va al ítem elegido (`selected` o radio marcado) si lo hay; si no, al primero.
 *
 * Posición (compartida con Select y DatePicker, `utils/anchoredPosition`): se calcula al abrir y mientras esté abierto
 * (scroll, resize). `offset` cambia la separación (4 por defecto) y `anchorRef` coloca el panel junto a otro elemento (p. ej.
 * la barra que contiene al disparador); el foco sigue volviendo al disparador. Por defecto abajo y con el borde derecho del panel alineado al del disparador; no se sale de la
 * pantalla, pasa al otro lado si no cabe y, si no cabe en ninguno, usa el lado con más espacio con el alto limitado.
 */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      trigger,
      mode = 'menu',
      align = 'end',
      side = 'bottom',
      offset = OFFSET,
      anchorRef,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      children,
      type = 'simple',
      ...panelProps
    },
    ref
  ) => {
    const uid = useId();
    const popoverId = `${uid}-popover`;
    const triggerId = `${uid}-trigger`;
    const [openState, setOpenState] = useState(defaultOpen);
    const open = openProp ?? openState;
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const intentRef = useRef<FocusIntent>('first');
    const typeaheadRef = useRef(createTypeahead());
    const isMenu = mode === 'menu';

    const setPopoverRef = useCallback(
      (node: HTMLDivElement | null) => {
        popoverRef.current = node;
        assignRef(ref, node);
      },
      [ref]
    );

    const setTriggerRef = useCallback((node: HTMLElement | null) => {
      triggerRef.current = node;
    }, []);

    const getAnchor = useCallback(() => anchorRef?.current ?? triggerRef.current, [anchorRef]);
    const place = useAnchoredPosition(open, popoverRef, getAnchor, { align, side, offset, margin: MARGIN });

    const items = () => getMenuItems(popoverRef.current);

    const closePanel = useCallback((returnFocus: boolean) => {
      const pop = popoverRef.current;
      if (pop?.matches(':popover-open')) pop.hidePopover();
      if (returnFocus) triggerRef.current?.focus();
    }, []);

    const focusIntent = () => {
      if (!isMenu) return;
      const pop = popoverRef.current;
      const search = pop?.querySelector<HTMLInputElement>('input[type="search"]');
      const list = items();
      const selected = pop?.querySelector<HTMLElement>(MENU_SELECTED_SELECTOR);
      if (intentRef.current === 'last' && list.length) list[list.length - 1].focus();
      else if (search) search.focus();
      else if (selected && list.includes(selected)) selected.focus();
      else list[0]?.focus();
      intentRef.current = 'first';
    };

    // Estado controlado o inicial -> panel nativo
    useEffect(() => {
      const pop = popoverRef.current;
      if (!pop || typeof pop.showPopover !== 'function') return;
      const isOpen = pop.matches(':popover-open');
      if (open && !isOpen) pop.showPopover();
      else if (!open && isOpen) pop.hidePopover();
    }, [open]);

    const handleBeforeToggle = (event: SyntheticEvent<HTMLDivElement>) => {
      // Oculto hasta medir y colocar, para que no se vea un frame en otra posición
      if ((event.nativeEvent as ToggleEvent).newState === 'open') popoverRef.current!.style.visibility = 'hidden';
    };

    const handleToggle = (event: SyntheticEvent<HTMLDivElement>) => {
      const next = (event.nativeEvent as ToggleEvent).newState === 'open';
      if (next) {
        place();
        focusIntent();
      }
      setOpenState(next);
      if (next !== open) onOpenChange?.(next);
    };

    const handlePanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isMenu) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel(true);
        return;
      }
      if (event.key === 'Tab') {
        // Sin preventDefault: el foco sale al elemento que sigue (o precede) al disparador
        closePanel(true);
        return;
      }
      const list = items();
      if ((event.target as HTMLElement).tagName === 'INPUT') {
        if (event.key === 'ArrowDown' && list.length) {
          event.preventDefault();
          list[0].focus();
        }
        return;
      }
      handleMenuNavigation(event, popoverRef.current, {
        typeahead: typeaheadRef.current,
        beforeFirst: () => popoverRef.current?.querySelector<HTMLInputElement>('input[type="search"]'),
      });
    };

    const handleTriggerKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      // Esc con el foco en el disparador (siempre en modo lista) también cierra
      if (event.key === 'Escape' && popoverRef.current?.matches(':popover-open')) {
        event.preventDefault();
        closePanel(false);
        return;
      }
      if (!isMenu || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
      event.preventDefault();
      intentRef.current = event.key === 'ArrowUp' ? 'last' : 'first';
      const pop = popoverRef.current;
      if (pop && !pop.matches(':popover-open')) pop.showPopover();
      else focusIntent();
    };

    const triggerProps: DropdownMenuTriggerProps = {
      ref: setTriggerRef,
      id: triggerId,
      'aria-haspopup': isMenu ? 'menu' : undefined,
      'aria-expanded': open,
      'aria-controls': popoverId,
      popoverTarget: popoverId,
      popoverTargetAction: 'toggle',
      onKeyDown: handleTriggerKeyDown,
    };

    let triggerNode: React.ReactNode;
    if (typeof trigger === 'function') {
      triggerNode = trigger(triggerProps);
    } else if (isValidElement(trigger)) {
      const el = trigger as ReactElement<TriggerElementProps>;
      const { onKeyDown: own, ref: ownRef, id: ownId } = el.props;
      triggerNode = cloneElement(el, {
        ...triggerProps,
        id: ownId ?? triggerId,
        ref: (node: HTMLElement | null) => {
          setTriggerRef(node);
          assignRef(ownRef as Ref<HTMLElement> | undefined, node);
        },
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          own?.(e);
          if (!e.defaultPrevented) handleTriggerKeyDown(e);
        },
      });
    }

    const context = useMemo(() => ({ mode, close: () => closePanel(true) }), [mode, closePanel]);

    return (
      <>
        {triggerNode}
        <div
          ref={setPopoverRef}
          id={popoverId}
          popover="auto"
          onBeforeToggle={handleBeforeToggle}
          onToggle={handleToggle}
          onKeyDown={handlePanelKeyDown}
          className={`${TOP_LAYER_CLASS} ${TOP_LAYER_MAX_WIDTH}`}
        >
          <DropdownMenuContext.Provider value={context}>
            <DropdownMenuPanel {...panelProps} type={type} mode={mode}>
              {children}
            </DropdownMenuPanel>
          </DropdownMenuContext.Provider>
        </div>
      </>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';
