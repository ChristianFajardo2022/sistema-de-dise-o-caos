import { forwardRef } from 'react';
import { DropdownMenuContext } from './DropdownMenu.context';
import type { DropdownMenuNavListProps } from './DropdownMenu.types';
import { dropdownMenuNavListClass } from './DropdownMenu.variants';
import { cn } from '../../utils/cn';

const NAVIGATION_CONTEXT = { mode: 'navigation' as const, close: () => {} };

/**
 * Lista de enlaces con el aspecto de "Dropdown list" de Figma, para navegación de sitio (submenús de Header, SideBar):
 * un `<ul>` sin roles de menú. Dentro, cada `DropdownMenuItem` con `href` es un `<a>` normal (Tab lo recorre, Enter lo
 * sigue, `selected` = `aria-current="page"`); sin `href` es un `<button>`. Cada ítem va en su propio `<li>` (lo pone
 * quien compone, para sumar subniveles o divisores). No es un menú WAI-ARIA: para acciones, `DropdownMenuList`.
 */
export const DropdownMenuNavList = forwardRef<HTMLUListElement, DropdownMenuNavListProps>(({ className, children, ...rest }, ref) => (
  <DropdownMenuContext.Provider value={NAVIGATION_CONTEXT}>
    <ul {...rest} ref={ref} className={cn(dropdownMenuNavListClass, className)}>
      {children}
    </ul>
  </DropdownMenuContext.Provider>
));

DropdownMenuNavList.displayName = 'DropdownMenuNavList';
