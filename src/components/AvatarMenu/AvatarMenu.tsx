import { forwardRef, useCallback, useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { AvatarMenuProps } from './AvatarMenu.types';
import { avatarMenuButtonVariants, avatarMenuVariants } from './AvatarMenu.variants';
import { AvatarMenuPanel } from './AvatarMenuPanel';
import { Avatar } from '../Avatar';
import { getInitials } from '../Avatar/Avatar.utils';
import { HeaderLayer } from '../Header/HeaderLayer';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/controllableState';
import { useMergedRefs } from '../../utils/refs';

const ITEM_SELECTOR = '[role^="menuitem"]:not([aria-disabled="true"])';

// Figma: 12537:1567
/**
 * Avatar que abre el menú de perfil ("Avatar+dropdown (Atom)" de Figma). Type Default = cerrado; Type
 * Dropdown = abierto (`open`).
 *
 * - Es una composición, no un átomo nuevo: el botón envuelve un `Avatar` (initials) y la tarjeta reutiliza `Avatar`,
 *   `DropdownMenuList`/`DropdownMenuItem` y el divisor de las notificaciones. No usa `DropdownMenu` porque su panel es otra superficie
 *   (lista sin encabezado) y solo admite ítems; aquí la tarjeta lleva la identidad de la persona arriba.
 * - Nombre del botón: empieza con las iniciales visibles ("HG, menú de perfil de Hugo García"; WCAG 2.5.3).
 * - Patrón WAI-ARIA Menu Button: el botón tiene `aria-haspopup="menu"`, `aria-expanded` y `aria-controls`. Al abrir, el
 *   foco va al primer ítem; flechas, Inicio y Fin los recorren; Tab cierra y sigue; Escape y el clic fuera cierran y el
 *   foco vuelve al botón. Activar un ítem cierra el menú.
 * - Capa superior nativa (`popover`) colocada con `useAnchoredPosition`: abajo, con el borde derecho de la tarjeta sobre
 *   el del avatar y a 8 de él; si no cabe, pasa arriba.
 * - `ref` y las props nativas van al `<button>`; `className` y `rootProps` al contenedor.
 */
export const AvatarMenu = forwardRef<HTMLButtonElement, AvatarMenuProps>(
  (
    {
      name,
      email,
      avatar,
      size = 'md',
      children,
      onLogout,
      logoutLabel,
      label,
      menuLabel,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      rootProps,
      className,
      ...rest
    },
    ref
  ) => {
    const uid = useId();
    const panelId = `${uid}-menu`;
    const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange, 'AvatarMenu');
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const layerRef = useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergedRefs(buttonRef, ref);
    const getAnchor = useCallback(() => buttonRef.current, []);
    const pendingFocus = useRef<'first' | 'last'>('first');
    // El foco entra al menú solo si lo abrió el usuario (no con `defaultOpen` ni desde fuera)
    const openedByUser = useRef(false);

    // WCAG 2.5.3: el nombre empieza con el texto visible del botón (las iniciales del avatar), para que el control por voz
    // ("pulsar HG") y el lector coincidan. Con un `avatar` propio (foto) no hay texto visible.
    const initials = avatar ? '' : getInitials(name);
    const accessibleName = label ?? (initials ? `${initials}, menú de perfil de ${name}` : `Menú de perfil de ${name}`);

    const items = () => Array.from(layerRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);
    const focusItem = (which: 'first' | 'last') => {
      const list = items();
      (which === 'first' ? list[0] : list[list.length - 1])?.focus();
    };

    const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      rest.onKeyDown?.(event);
      if (event.defaultPrevented || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
      event.preventDefault();
      if (open) focusItem(event.key === 'ArrowUp' ? 'last' : 'first');
      else {
        // Se abre y el foco va al primer o al último ítem cuando la capa esté colocada
        pendingFocus.current = event.key === 'ArrowUp' ? 'last' : 'first';
        openedByUser.current = true;
        setOpen(true);
      }
    };
    const handleLayerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const list = items();
      const index = list.indexOf(document.activeElement as HTMLElement);
      const move = (el?: HTMLElement) => {
        event.preventDefault();
        el?.focus();
      };
      switch (event.key) {
        case 'ArrowDown':
          move(list[(index + 1) % list.length]);
          break;
        case 'ArrowUp':
          move(list[(index - 1 + list.length) % list.length]);
          break;
        case 'Home':
          move(list[0]);
          break;
        case 'End':
          move(list[list.length - 1]);
          break;
        case 'Tab':
          // Sin preventDefault: el foco sigue al elemento que viene después del botón
          buttonRef.current?.focus();
          setOpen(false);
          break;
      }
    };

    const handleOpened = () => {
      if (openedByUser.current) focusItem(pendingFocus.current);
      openedByUser.current = false;
      pendingFocus.current = 'first';
    };

    return (
      <span {...rootProps} data-open={open} className={cn(avatarMenuVariants(), rootProps?.className, className)}>
        <button
          type="button"
          aria-label={accessibleName}
          {...rest}
          ref={mergedRef}
          id={rest.id ?? `${uid}-button`}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={panelId}
          popoverTarget={panelId}
          popoverTargetAction="toggle"
          onKeyDown={handleButtonKeyDown}
          onClick={(event) => {
            if (!open) openedByUser.current = true;
            rest.onClick?.(event);
          }}
          className={avatarMenuButtonVariants()}
        >
          {avatar ?? <Avatar variant="initials" size={size} name={name} aria-hidden="true" />}
        </button>
        <HeaderLayer ref={layerRef} id={panelId} open={open} onOpenChange={setOpen} getAnchor={getAnchor} onOpened={handleOpened} onKeyDown={handleLayerKeyDown}>
          <AvatarMenuPanel name={name} email={email} onLogout={onLogout} logoutLabel={logoutLabel} menuLabel={menuLabel} onClose={() => { buttonRef.current?.focus(); setOpen(false); }}>
            {children}
          </AvatarMenuPanel>
        </HeaderLayer>
      </span>
    );
  }
);

AvatarMenu.displayName = 'AvatarMenu';
