import { forwardRef, useMemo } from 'react';
import { DropdownMenuContext } from './DropdownMenu.context';
import type { DropdownMenuListProps } from './DropdownMenu.types';

/**
 * Lista de ítems de menú sin superficie, para usar dentro de otra tarjeta o panel (p. ej. el menú de perfil).
 * Es un `role="menu"` con el contexto que necesitan los `DropdownMenuItem` (`menuitem*` y cierre al activar), así que
 * ningún ítem queda huérfano fuera de `DropdownMenu`. La superficie la pone quien la usa; para la superficie del Dropdown
 * de Figma, `DropdownMenuPanel`. No abre ni cierra nada: el disparador y el foco son de quien la contiene (`onClose`).
 */
export const DropdownMenuList = forwardRef<HTMLDivElement, DropdownMenuListProps>(({ onClose, children, ...rest }, ref) => {
  const context = useMemo(() => ({ mode: 'menu' as const, close: onClose ?? (() => {}) }), [onClose]);
  return (
    <DropdownMenuContext.Provider value={context}>
      <div {...rest} ref={ref} role="menu">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
});

DropdownMenuList.displayName = 'DropdownMenuList';
