import type { ReactNode } from 'react';
import { headerLinkClass, headerSheetListClass } from './Header.variants';
import type { HeaderNavItem } from './Header.types';
import { dropdownMenuItemVariants } from '../DropdownMenu/DropdownMenu.variants';
import { notificationPanelDividerVariants } from '../NotificationPanel/NotificationPanel.variants';
import { cn } from '../../utils/cn';

const linkClass = (current?: boolean) => cn(dropdownMenuItemVariants({ state: current ? 'select' : 'default' }), headerLinkClass);

/** Lista de enlaces del menú móvil: cada sección es un enlace y sus subenlaces van debajo, con sangría. Separada por divisores. */
export function HeaderMobileMenu({ items, navLabel, onNavigate }: { items: HeaderNavItem[]; navLabel: string; onNavigate: () => void }) {
  const rows: ReactNode[] = [];
  items.forEach((item) => {
    rows.push(
      <li key={item.id} data-figma-part="Dropdown list">
        {item.href ? (
          <a href={item.href} aria-current={item.current ? 'page' : undefined} onClick={onNavigate} className={linkClass(item.current)}>
            <span className="min-w-0 flex-1 truncate" data-figma-part="Text item">{item.label}</span>
          </a>
        ) : (
          <span className={cn(dropdownMenuItemVariants({ interactive: false }), 'text-ds-text-neutral-white')}>
            <span className="min-w-0 flex-1 truncate" data-figma-part="Text item">{item.label}</span>
          </span>
        )}
        {item.items && (
          <ul className="m-0 flex list-none flex-col p-0 pl-ds-space-general-2xl">
            {item.items.map((link) => (
              <li key={link.href + String(link.label)}>
                <a href={link.href} aria-current={link.current ? 'page' : undefined} onClick={onNavigate} className={linkClass(link.current)}>
                  <span className="min-w-0 flex-1 truncate" data-figma-part="Text item">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
    rows.push(<li key={`${item.id}-divider`} aria-hidden="true" className="list-none"><div className={notificationPanelDividerVariants()} /></li>);
  });
  return (
    <nav aria-label={navLabel}>
      <ul className={headerSheetListClass}>{rows}</ul>
    </nav>
  );
}
