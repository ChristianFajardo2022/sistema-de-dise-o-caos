import { headerSheetListClass } from './Header.variants';
import type { HeaderNavItem } from './Header.types';
import { DropdownMenuItem, DropdownMenuNavList } from '../DropdownMenu';
import { dropdownMenuItemTextVariants, dropdownMenuItemVariants } from '../DropdownMenu/DropdownMenu.variants';
import { Divider } from '../_internal/Divider';
import { cn } from '../../utils/cn';

/**
 * Lista de enlaces del menú móvil (`DropdownMenuNavList`): cada sección es un enlace y sus subenlaces van debajo, con
 * sangría. Separada por divisores. Activar un enlace cierra la hoja (lo resuelve `useMobileSheet` en Header).
 */
export function HeaderMobileMenu({ items, navLabel }: { items: HeaderNavItem[]; navLabel: string }) {
  return (
    <nav aria-label={navLabel}>
      <DropdownMenuNavList className={headerSheetListClass}>
        {items.flatMap((item) => [
          <li key={item.id} data-figma-part="Dropdown list">
            {item.href ? (
              <DropdownMenuItem href={item.href} selected={item.current}>
                {item.label}
              </DropdownMenuItem>
            ) : (
              <span className={cn(dropdownMenuItemVariants({ interactive: false }), 'text-ds-text-neutral-white')}>
                <span className={dropdownMenuItemTextVariants()} data-figma-part="Text item">
                  {item.label}
                </span>
              </span>
            )}
            {item.items && (
              <DropdownMenuNavList className="pl-ds-space-general-2xl">
                {item.items.map((link) => (
                  <li key={link.href + String(link.label)}>
                    <DropdownMenuItem href={link.href} selected={link.current}>
                      {link.label}
                    </DropdownMenuItem>
                  </li>
                ))}
              </DropdownMenuNavList>
            )}
          </li>,
          <Divider key={`${item.id}-divider`} as="li" />,
        ])}
      </DropdownMenuNavList>
    </nav>
  );
}
