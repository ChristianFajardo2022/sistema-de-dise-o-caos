import { forwardRef, useMemo } from 'react';
import type { AvatarMenuPanelProps } from './AvatarMenu.types';
import {
  avatarMenuEmailClass,
  avatarMenuIdentityClass,
  avatarMenuLogoutClass,
  avatarMenuMenuClass,
  avatarMenuNameBlockClass,
  avatarMenuNameClass,
  avatarMenuPanelVariants,
} from './AvatarMenu.variants';
import { Avatar } from '../Avatar';
import { DropdownMenuContext } from '../DropdownMenu/DropdownMenu.context';
import { DropdownMenuItem } from '../DropdownMenu';
import { notificationPanelDividerVariants } from '../NotificationPanel/NotificationPanel.variants';
import { cn } from '../../utils/cn';

/**
 * Tarjeta del menú de perfil ("Profile card" de Figma): quién es la persona, un divisor y el menú de acciones.
 * No abre ni cierra nada: para eso, `AvatarMenu`. Sirve también en línea (documentación, medición contra Figma).
 *
 * Los ítems (`DropdownMenuItem`) quedan dentro de un `role="menu"`; la identidad queda fuera, para que el menú solo
 * contenga ítems (WAI-ARIA).
 */
export const AvatarMenuPanel = forwardRef<HTMLDivElement, AvatarMenuPanelProps>(
  ({ name, email, avatar, children, onLogout, logoutLabel = 'Cerrar sesión', menuLabel = 'Menú de perfil', onClose, className, ...rest }, ref) => {
    const context = useMemo(() => ({ mode: 'menu' as const, close: onClose ?? (() => {}) }), [onClose]);
    return (
      <div {...rest} ref={ref} className={cn(avatarMenuPanelVariants(), className)} data-figma-part="Profile card">
        <div className={avatarMenuIdentityClass} data-figma-part="Container">
          {avatar ?? <Avatar variant="initials" size="xs" name={name} aria-hidden="true" />}
          <div className={avatarMenuNameBlockClass} data-figma-part="Name">
            <p className={avatarMenuNameClass} data-figma-part="User name">
              {name}
            </p>
            {email && (
              <p className={avatarMenuEmailClass} data-figma-part="User email">
                {email}
              </p>
            )}
          </div>
        </div>
        <div aria-hidden="true" className={notificationPanelDividerVariants()} data-figma-part="Divider" />
        <DropdownMenuContext.Provider value={context}>
          <div role="menu" aria-label={menuLabel} className={avatarMenuMenuClass}>
            {children}
            {onLogout && (
              <DropdownMenuItem type="icon" icon="logout2" onSelect={onLogout} className={children ? avatarMenuLogoutClass : undefined} data-figma-part="Dropdown list">
                {logoutLabel}
              </DropdownMenuItem>
            )}
          </div>
        </DropdownMenuContext.Provider>
      </div>
    );
  }
);

AvatarMenuPanel.displayName = 'AvatarMenuPanel';
