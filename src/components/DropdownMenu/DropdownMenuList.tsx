import { forwardRef, useEffect, useMemo, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { DropdownMenuContext } from './DropdownMenu.context';
import { createTypeahead, focusMenuItem, handleMenuNavigation } from './DropdownMenu.keyboard';
import type { DropdownMenuListProps } from './DropdownMenu.types';
import { useMergedRefs } from '../../utils/refs';

/**
 * Lista de ítems de menú sin superficie, para usar dentro de otra tarjeta o panel (p. ej. el menú de perfil o la hoja
 * "más" de NavBar). Es un `role="menu"` con el contexto que necesitan los `DropdownMenuItem` (`menuitem*` y cierre al
 * activar), así que ningún ítem queda huérfano fuera de `DropdownMenu`. La superficie la pone quien la usa; para la
 * superficie del Dropdown de Figma, `DropdownMenuPanel`.
 *
 * Teclado (WAI-ARIA APG Menu), dentro del componente: Flecha abajo/arriba recorren los ítems con vuelta (saltan los
 * deshabilitados), Inicio y Fin van al primero y al último y una letra lleva al siguiente que empieza por ella. Esas
 * teclas no siguen a la superficie que la contiene (no se mueve dos veces). `initialFocus` enfoca un ítem al montar.
 * No abre ni cierra nada: el disparador, Escape, Tab y el retorno del foco son de quien la contiene (`onClose`).
 */
export const DropdownMenuList = forwardRef<HTMLDivElement, DropdownMenuListProps>(
  ({ onClose, initialFocus = 'none', onKeyDown, children, ...rest }, ref) => {
    const listRef = useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergedRefs(listRef, ref);
    const typeaheadRef = useRef(createTypeahead());
    const context = useMemo(() => ({ mode: 'menu' as const, close: onClose ?? (() => {}) }), [onClose]);

    // Solo al montar: quien abre la superficie decide si el foco entra (abierta por la persona) o no (abierta de entrada)
    const initialFocusRef = useRef(initialFocus);
    useEffect(() => {
      if (initialFocusRef.current !== 'none') focusMenuItem(listRef.current, initialFocusRef.current);
    }, []);

    useEffect(() => {
      const typeahead = typeaheadRef.current;
      return () => window.clearTimeout(typeahead.timer);
    }, []);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (handleMenuNavigation(event, listRef.current, { typeahead: typeaheadRef.current })) event.stopPropagation();
    };

    return (
      <DropdownMenuContext.Provider value={context}>
        <div {...rest} ref={mergedRef} role="menu" onKeyDown={handleKeyDown}>
          {children}
        </div>
      </DropdownMenuContext.Provider>
    );
  }
);

DropdownMenuList.displayName = 'DropdownMenuList';
