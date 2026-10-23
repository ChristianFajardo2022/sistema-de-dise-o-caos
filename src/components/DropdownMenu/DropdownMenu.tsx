import { cloneElement, forwardRef, isValidElement, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement, Ref, SyntheticEvent } from 'react';
import { DropdownMenuContext } from './DropdownMenu.context';
import type { DropdownMenuProps, DropdownMenuTriggerProps } from './DropdownMenu.types';
import { DropdownMenuPanel } from './DropdownMenuPanel';
import { useAnchoredPosition } from '../../utils/anchoredPosition';
import { assignRef } from '../../utils/refs';

/** Separación entre el disparador y el panel, y margen mínimo con el borde de la pantalla. */
const OFFSET = 4;
const MARGIN = 8;
const TYPEAHEAD_RESET_MS = 600;

interface TriggerElementProps {
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  ref?: unknown;
  id?: string;
}

type FocusIntent = 'first' | 'last' | 'none';

const ITEM_SELECTOR = '[role^="menuitem"]:not([aria-disabled="true"])';
/** Ítem elegido (aspecto Select o radio marcado): recibe el foco al abrir en lugar del primero. */
const SELECTED_SELECTOR = '[aria-current="true"], [role="menuitemradio"][aria-checked="true"]';

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
 * (scroll, resize). Por defecto abajo y con el borde derecho del panel alineado al del disparador; no se sale de la
 * pantalla, pasa al otro lado si no cabe y, si no cabe en ninguno, usa el lado con más espacio con el alto limitado.
 */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      trigger,
      mode = 'menu',
      align = 'end',
      side = 'bottom',
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
    const typeaheadRef = useRef({ text: '', timer: 0 });
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

    const getAnchor = useCallback(() => triggerRef.current, []);
    const place = useAnchoredPosition(open, popoverRef, getAnchor, { align, side, offset: OFFSET, margin: MARGIN });

    const items = () => Array.from(popoverRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);

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
      const selected = pop?.querySelector<HTMLElement>(SELECTED_SELECTOR);
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

    const typeahead = (key: string) => {
      const t = typeaheadRef.current;
      window.clearTimeout(t.timer);
      t.text += key.toLowerCase();
      t.timer = window.setTimeout(() => (t.text = ''), TYPEAHEAD_RESET_MS);
      const list = items();
      const current = list.indexOf(document.activeElement as HTMLElement);
      // Con una sola letra repetida se avanza al siguiente que empiece igual
      const order = [...list.slice(current + 1), ...list.slice(0, current + 1)];
      const found = order.find((el) => el.textContent?.trim().toLowerCase().startsWith(t.text));
      found?.focus();
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
      const target = event.target as HTMLElement;
      const list = items();
      if (target.tagName === 'INPUT') {
        if (event.key === 'ArrowDown' && list.length) {
          event.preventDefault();
          list[0].focus();
        }
        return;
      }
      const index = list.indexOf(target.closest<HTMLElement>('[role^="menuitem"]') as HTMLElement);
      const move = (el?: HTMLElement) => {
        event.preventDefault();
        el?.focus();
      };
      switch (event.key) {
        case 'ArrowDown':
          move(list[(index + 1) % list.length]);
          break;
        case 'ArrowUp': {
          const search = popoverRef.current?.querySelector<HTMLInputElement>('input[type="search"]');
          if (index === 0 && search) move(search);
          else move(list[(index - 1 + list.length) % list.length]);
          break;
        }
        case 'Home':
          move(list[0]);
          break;
        case 'End':
          move(list[list.length - 1]);
          break;
        default:
          if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ') {
            event.preventDefault();
            typeahead(event.key);
          }
      }
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
          className="m-0 max-w-[calc(100vw-2*0.5rem)] overflow-visible border-0 bg-transparent p-0 [inset:auto]"
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
