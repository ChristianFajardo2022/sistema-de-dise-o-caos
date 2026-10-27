import { useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, RefObject } from 'react';
import { headerBandClass, headerBandListClass, headerLinkClass, headerNavListClass } from './Header.variants';
import type { HeaderNavItem } from './Header.types';
import { ButtonMenu } from '../ButtonMenu';
import { dropdownMenuItemVariants } from '../DropdownMenu/DropdownMenu.variants';
import { cn } from '../../utils/cn';

interface HeaderNavProps {
  items: HeaderNavItem[];
  navLabel: string;
  openItem: string | null;
  onOpenItemChange: (id: string | null) => void;
  headerRef: RefObject<HTMLElement | null>;
  baseId: string;
}

/**
 * Navegación principal de escritorio (patrón WAI-ARIA "Disclosure Navigation Menu"): cada sección con submenú es un
 * botón con `aria-expanded` y `aria-controls` que muestra una lista de enlaces en la banda bajo la barra.
 * - La lista va en el DOM justo después de su botón (dentro del mismo `<li>` y del `<nav>`): Tab entra del botón a sus
 *   enlaces. La banda se coloca respecto del `<header>` (todo el ancho, bajo la barra).
 * - Escape cierra y devuelve el foco al botón; un clic fuera de la cabecera o el foco que sale de la navegación cierran.
 * - La sección actual lleva `aria-current="page"`.
 */
export function HeaderNav({ items, navLabel, openItem, onOpenItemChange, headerRef, baseId }: HeaderNavProps) {
  const buttons = useRef(new Map<string, HTMLElement>());
  const [left, setLeft] = useState(0);
  const open = items.find((item) => item.id === openItem && item.items?.length);

  // La lista empieza donde empieza el botón que la abrió
  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const button = buttons.current.get(open.id);
      // Al montar abierto, el ref del <header> aún no está asignado (los efectos de los hijos corren antes): se busca desde el botón
      const header = headerRef.current ?? button?.closest('header');
      if (button && header) setLeft(button.getBoundingClientRect().left - header.getBoundingClientRect().left);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [open, headerRef]);

  // Escape y clic fuera cierran
  useLayoutEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      onOpenItemChange(null);
      buttons.current.get(open.id)?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) onOpenItemChange(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [open, onOpenItemChange, headerRef]);

  // El foco sale de la navegación (Tab después del último enlace, o a otro control): se cierra el submenú
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget;
    if (open && next instanceof Node && !event.currentTarget.contains(next)) onOpenItemChange(null);
  };

  return (
    <nav aria-label={navLabel} data-figma-part="Menu list1" onBlur={handleBlur}>
      <ul className={headerNavListClass}>
        {items.map((item) => {
          const hasMenu = Boolean(item.items?.length);
          const listId = `${baseId}-${item.id}`;
          const expanded = hasMenu && openItem === item.id;
          return (
            <li key={item.id} className="flex">
              <ButtonMenu
                ref={(node) => {
                  if (node) buttons.current.set(item.id, node);
                  else buttons.current.delete(item.id);
                }}
                href={hasMenu ? undefined : item.href}
                iconRight={hasMenu}
                selected={item.current}
                disabled={item.disabled}
                aria-expanded={hasMenu ? expanded : undefined}
                aria-controls={hasMenu ? listId : undefined}
                onClick={hasMenu ? () => onOpenItemChange(expanded ? null : item.id) : undefined}
                data-figma-part="Button menu (Atom)"
              >
                {item.label}
              </ButtonMenu>
              {expanded && item.items && (
                <div className={headerBandClass} data-figma-part="Dropdown">
                  <ul id={listId} className={headerBandListClass} style={{ marginInlineStart: left }} data-figma-part="Options">
                    {item.items.map((link) => (
                      <li key={link.href + String(link.label)}>
                        <a
                          href={link.href}
                          aria-current={link.current ? 'page' : undefined}
                          onClick={() => onOpenItemChange(null)}
                          className={cn(dropdownMenuItemVariants({ state: link.current ? 'select' : 'default' }), headerLinkClass)}
                          data-figma-part="Dropdown list"
                        >
                          <span className="min-w-0 flex-1 truncate" data-figma-part="Text item">
                            {link.label}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
