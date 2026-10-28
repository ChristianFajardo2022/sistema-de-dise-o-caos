import { forwardRef, useId, useRef } from 'react';
import type { FormEvent, ReactNode } from 'react';
import type { HeaderProps } from './Header.types';
import {
  headerBarVariants,
  headerEndClass,
  headerLogoLinkClass,
  headerMenuButtonClass,
  headerSearchClass,
  headerSheetClass,
  headerStartVariants,
  headerVariants,
} from './Header.variants';
import { HeaderBell } from './HeaderBell';
import { HeaderMobileMenu } from './HeaderMobileMenu';
import { HeaderNav } from './HeaderNav';
import { AvatarMenu } from '../AvatarMenu';
import { IconMenu } from '../IconMenu';
import { Input } from '../Input';
import { Logo } from '../Logo';
import { useMobileSheet } from '../_internal/useMobileSheet';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/controllableState';
import { useMergedRefs } from '../../utils/refs';
import { useMediaQuery } from '../../utils/useMediaQuery';

/** Desde este ancho (64rem, donde tokens.css pasa al modo Desktop) `layout="auto"` dibuja la cabecera de escritorio. */
const DESKTOP_QUERY = '(min-width: 64rem)';
const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY, true);

/**
 * Cabecera del producto: "Header desktop" (13448:29988) y "Header mobile" (13520:81850) de Figma.
 *
 * - Landmarks: `<header>` (rol `banner` cuando es hijo directo de `body`; dentro de otro contenedor use `role="banner"`),
 *   `<nav>` con nombre para la navegación principal y `<form role="search">` para el buscador. La sección actual lleva
 *   `aria-current="page"`.
 * - Escritorio: logo, navegación con submenús en banda (`ButtonMenu`; disclosure con `aria-expanded`, la lista sigue a
 *   su botón en el orden de Tab; Escape, el clic fuera o el foco que sale de la navegación la cierran), buscador
 *   (`Input` `search-header`), campana con panel y avatar con menú de perfil (`AvatarMenu`).
 * - Móvil: botón de menú (`IconMenu`, `aria-expanded`) que despliega una hoja con el buscador y los enlaces (justo
 *   después del botón en el orden de Tab); Escape la cierra y devuelve el foco al botón. La campana y el avatar quedan
 *   en la barra. Con `layout="auto"` cambia en 64rem.
 * - Campana: `notificationPanel` (un `NotificationPanel` simple o complejo) se abre como diálogo no modal anclado a la
 *   campana; Escape y clic fuera cierran, el foco vuelve a la campana.
 * - `ref` y las props nativas van al `<header>`.
 */
export const Header = forwardRef<HTMLElement, HeaderProps>(
  (
    {
      layout = 'auto',
      logo,
      homeHref,
      homeLabel = 'Inicio',
      items = [],
      navLabel = 'Navegación principal',
      openItem: openItemProp,
      defaultOpenItem = null,
      onOpenItemChange,
      search = true,
      searchLabel = 'Buscar',
      searchProps,
      onSearch,
      notificationPanel,
      notificationCount,
      notificationsOpen: notificationsOpenProp,
      defaultNotificationsOpen = false,
      onNotificationsOpenChange,
      user,
      profileMenu,
      onLogout,
      logoutLabel,
      actions,
      menuOpen: menuOpenProp,
      defaultMenuOpen = false,
      onMenuOpenChange,
      openMenuLabel = 'Abrir menú',
      closeMenuLabel = 'Cerrar menú',
      menuClassName,
      className,
      ...rest
    },
    ref
  ) => {
    const uid = useId();
    const isDesktopViewport = useIsDesktop();
    const desktop = layout === 'auto' ? isDesktopViewport : layout === 'desktop';
    const headerRef = useRef<HTMLElement | null>(null);
    const mergedRef = useMergedRefs(headerRef, ref);
    const [openItem, setOpenItem] = useControllableState<string | null>(
      openItemProp,
      defaultOpenItem,
      onOpenItemChange,
      'Header (openItem)'
    );
    const [notificationsOpen, setNotificationsOpen] = useControllableState(
      notificationsOpenProp,
      defaultNotificationsOpen,
      onNotificationsOpenChange,
      'Header (notificationsOpen)'
    );
    const [menuOpen, setMenuOpen] = useControllableState(menuOpenProp, defaultMenuOpen, onMenuOpenChange, 'Header (menuOpen)');
    const sheetId = `${uid}-menu`;

    const sheetOpen = !desktop && menuOpen;
    // Móvil: Escape cierra la hoja y devuelve el foco al botón de menú; activar un enlace también la cierra
    const { buttonRef: menuButtonRef, sheetProps } = useMobileSheet({ open: sheetOpen, setOpen: setMenuOpen, containerRef: headerRef });

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const field = event.currentTarget.elements.namedItem('q');
      if (field instanceof HTMLInputElement) onSearch?.(field.value);
    };

    const brand: ReactNode = logo ?? <Logo type="icon" size="sm" decorative={Boolean(homeHref)} />;
    const logoNode = homeHref ? (
      <a href={homeHref} aria-label={homeLabel} className={headerLogoLinkClass} data-figma-part="Logo ">
        {brand}
      </a>
    ) : (
      <span className="inline-flex shrink-0" data-figma-part="Logo ">
        {brand}
      </span>
    );

    const searchField = (mobile: boolean) =>
      search && (
        <form role="search" onSubmit={handleSearch} className={mobile ? 'm-0 w-full' : headerSearchClass} data-figma-part="General input">
          <Input
            name="q"
            {...searchProps}
            variant="search-header"
            label={searchLabel}
            fullWidth
            className={cn(mobile && 'h-10 py-ds-space-field-sm', searchProps?.className)}
          />
        </form>
      );

    const bell = notificationPanel && (
      <span className="flex" data-figma-part="Simple notifications">
        <HeaderBell
          size={desktop ? 'sm' : 'xs'}
          count={notificationCount}
          panel={notificationPanel}
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
        />
      </span>
    );

    const profile = user && (
      <AvatarMenu
        name={user.name}
        email={user.email}
        size={desktop ? 'md' : 'sm'}
        onLogout={onLogout}
        logoutLabel={logoutLabel}
        rootProps={{ 'data-figma-part': 'Avatar+dropdown (Atom)' }}
      >
        {profileMenu}
      </AvatarMenu>
    );

    const hasEnd = Boolean(bell || profile || actions);
    const end = hasEnd && (
      <div className={headerEndClass} data-figma-part="Avatar">
        {bell}
        {profile}
        {actions}
      </div>
    );

    return (
      <header {...rest} ref={mergedRef} className={cn(headerVariants(), className)}>
        {desktop ? (
          <div className={headerBarVariants({ layout: 'desktop' })} data-figma-part="Header desktop">
            <div className={headerStartVariants({ layout: 'desktop' })} data-figma-part="Logo+options">
              {logoNode}
              {items.length > 0 && (
                <HeaderNav
                  items={items}
                  navLabel={navLabel}
                  openItem={openItem}
                  onOpenItemChange={setOpenItem}
                  headerRef={headerRef}
                  baseId={`${uid}-nav`}
                />
              )}
            </div>
            {searchField(false)}
            {end}
          </div>
        ) : (
          <div className={headerBarVariants({ layout: 'mobile' })} data-figma-part="Header mobile">
            <div className={headerStartVariants({ layout: 'mobile' })} data-figma-part="Content">
              <button
                ref={menuButtonRef}
                type="button"
                aria-label={menuOpen ? closeMenuLabel : openMenuLabel}
                aria-expanded={menuOpen}
                aria-controls={sheetId}
                onClick={() => setMenuOpen(!menuOpen)}
                className={headerMenuButtonClass}
              >
                <IconMenu variant={menuOpen ? 'close' : 'menu'} data-figma-part="Icon menu (Atom)" />
              </button>
              {/* La hoja va en el DOM justo después de su botón (Tab entra a ella sin pasar por logo, campana y avatar);
                  se coloca respecto del <header>, de todo el ancho bajo la barra. */}
              {menuOpen && (
                <div id={sheetId} {...sheetProps} className={cn(headerSheetClass, menuClassName)} data-figma-part="Dropdown">
                  {searchField(true)}
                  {items.length > 0 && <HeaderMobileMenu items={items} navLabel={navLabel} />}
                </div>
              )}
              {logoNode}
            </div>
            {end}
          </div>
        )}
      </header>
    );
  }
);

Header.displayName = 'Header';
