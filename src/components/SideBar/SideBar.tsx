import { forwardRef, useCallback, useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import type { SideBarItemData, SideBarProps } from './SideBar.types';
import { SideBarItem, SideBarSubItem } from './SideBarItem';
import {
  sideBarDesktopVariants,
  sideBarFooterVariants,
  sideBarListVariants,
  sideBarLogoLinkClass,
  sideBarLogoVariants,
  sideBarMenuButtonClass,
  sideBarMobileBarClass,
  sideBarMobileClass,
  sideBarMobileEndClass,
  sideBarMobileStartClass,
  sideBarOptionsVariants,
  sideBarSheetClass,
} from './SideBar.variants';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconMenu } from '../IconMenu';
import { Logo } from '../Logo';
import { ScrollArea } from '../ScrollArea';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/controllableState';
import { useMergedRefs } from '../../utils/refs';
import { useIsMobile } from '../../utils/useMediaQuery';

/** Ítems con submenú que contienen el id dado (para abrir de entrada la sección actual). */
function parentsOf(items: SideBarItemData[], id: string | null | undefined): string[] {
  if (!id) return [];
  return items.filter((item) => item.items?.some((sub) => sub.id === id)).map((item) => item.id);
}

/**
 * Barra lateral de navegación: "Menu desktop" (13328:3630) y "Menu mobile" (13738:92956) de Figma, con los ítems
 * "Hamburguer menu (Atom)" (13328:3609).
 *
 * - Semántica: `<nav>` con nombre y una lista (`<ul>`/`<li>`). Los ítems con `href` son enlaces reales; la sección
 *   actual (`value`) lleva `aria-current="page"`. Los ítems con submenú son botones disclosure (`aria-expanded` +
 *   `aria-controls`) con su lista justo debajo, en el orden de Tab. Todo se recorre con Tab y se activa con Enter
 *   (Espacio en los botones).
 * - Escritorio: expandida (Type Select, 298) o contraída a solo íconos (Type Default, 63) con el botón de flecha del pie
 *   (`collapsible`). Contraída, cada ítem se nombra con su texto (y un tooltip a la derecha); pulsar un ítem con
 *   submenú expande la barra y abre su lista. El foco se queda en el control que se pulsó.
 * - Móvil: barra con el botón de menú (`IconMenu`, `aria-expanded`), el logo y las acciones (`mobileActions`). El menú
 *   se despliega como hoja bajo la barra, justo después del botón en el orden de Tab; Escape lo cierra y devuelve el
 *   foco al botón, y activar un enlace también lo cierra.
 * - `layout="auto"` cambia en 48rem (el corte Mobile de tokens.css) con `useMediaQuery`.
 * - `ref` y las props nativas van al contenedor raíz (`<div>`).
 */
export const SideBar = forwardRef<HTMLDivElement, SideBarProps>(
  (
    {
      items,
      layout = 'auto',
      value: valueProp,
      defaultValue = null,
      onValueChange,
      openItems: openItemsProp,
      defaultOpenItems,
      onOpenItemsChange,
      collapsed: collapsedProp,
      defaultCollapsed = false,
      onCollapsedChange,
      collapsible = true,
      collapseLabel = 'Contraer menú',
      expandLabel = 'Expandir menú',
      logo,
      homeHref,
      homeLabel = 'Inicio',
      footer,
      navLabel = 'Navegación principal',
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      mobileActions,
      openMenuLabel = 'Abrir menú',
      closeMenuLabel = 'Cerrar menú',
      menuClassName,
      className,
      ...rest
    },
    ref
  ) => {
    const uid = useId();
    const isMobileViewport = useIsMobile();
    const mobile = layout === 'auto' ? isMobileViewport : layout === 'mobile';
    const rootRef = useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergedRefs(rootRef, ref);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);

    const [value, setValue] = useControllableState<string | null>(valueProp, defaultValue, undefined, 'SideBar (value)');
    const [openItems, setOpenItems] = useControllableState<string[]>(
      openItemsProp,
      defaultOpenItems ?? parentsOf(items, valueProp ?? defaultValue),
      onOpenItemsChange,
      'SideBar (openItems)'
    );
    const [collapsedState, setCollapsed] = useControllableState(collapsedProp, defaultCollapsed, onCollapsedChange, 'SideBar (collapsed)');
    const [menuOpen, setMenuOpen] = useControllableState(openProp, defaultOpen, onOpenChange, 'SideBar (open)');
    const collapsed = !mobile && collapsedState;
    const sheetOpen = mobile && menuOpen;
    const sheetId = `${uid}-menu`;

    const select = useCallback(
      (id: string) => {
        setValue(id);
        onValueChange?.(id);
      },
      [setValue, onValueChange]
    );

    const setItemOpen = (id: string, next: boolean) => {
      const has = openItems.includes(id);
      if (next === has) return;
      setOpenItems(next ? [...openItems, id] : openItems.filter((open) => open !== id));
    };

    // Móvil: Escape cierra el menú y, si el foco estaba en la barra (o se perdió), vuelve al botón de menú
    useEffect(() => {
      if (!sheetOpen) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || event.defaultPrevented) return;
        const root = rootRef.current;
        const active = document.activeElement;
        if (root && active && active !== document.body && !root.contains(active)) return;
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      };
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [sheetOpen, setMenuOpen]);

    const renderItems = (mode: 'collapsed' | 'expanded', onNavigate?: () => void) =>
      items.map((item) => {
        const subItems = item.items ?? [];
        const hasSub = subItems.length > 0;
        const childSelected = subItems.some((sub) => sub.id === value);
        const expanded = hasSub && openItems.includes(item.id);
        return (
          <SideBarItem
            key={item.id}
            type={mode === 'collapsed' ? 'single-icon' : hasSub ? 'dropdown' : 'with-text'}
            icon={item.icon}
            badge={item.badge}
            badgeLabel={item.badgeLabel}
            href={hasSub ? undefined : item.href}
            selected={value === item.id || childSelected}
            expanded={expanded}
            onExpandedChange={(next) => {
              if (mode === 'collapsed') {
                // Contraída no hay lista: se expande la barra con la lista abierta
                setCollapsed(false);
                setItemOpen(item.id, true);
              } else setItemOpen(item.id, next);
            }}
            onSelect={
              hasSub
                ? undefined
                : () => {
                    select(item.id);
                    onNavigate?.();
                  }
            }
            submenu={
              hasSub
                ? subItems.map((sub) => (
                    <SideBarSubItem
                      key={sub.id}
                      href={sub.href}
                      selected={value === sub.id}
                      onSelect={() => {
                        select(sub.id);
                        onNavigate?.();
                      }}
                    >
                      {sub.label}
                    </SideBarSubItem>
                  ))
                : undefined
            }
            data-figma-part={mode === 'collapsed' ? 'Option' : 'Hamburguer menu (Atom)'}
          >
            {item.label}
          </SideBarItem>
        );
      });

    const brand = (variant: 'icon' | 'logo', size: 'sm' | 'md'): ReactNode =>
      logo ?? <Logo type={variant} size={size} decorative={Boolean(homeHref)} />;
    const logoNode = (node: ReactNode) =>
      homeHref ? (
        <a href={homeHref} aria-label={homeLabel} className={sideBarLogoLinkClass} data-figma-part="Logo ">
          {node}
        </a>
      ) : (
        <span className="inline-flex shrink-0" data-figma-part="Logo ">
          {node}
        </span>
      );

    if (mobile) {
      const closeMenu = () => setMenuOpen(false);
      return (
        <div {...rest} ref={mergedRef} className={cn(sideBarMobileClass, className)}>
          <div className={sideBarMobileBarClass} data-figma-part="Header mobile">
            <div className={sideBarMobileStartClass} data-figma-part="Content">
              <button
                ref={menuButtonRef}
                type="button"
                aria-label={menuOpen ? closeMenuLabel : openMenuLabel}
                aria-expanded={menuOpen}
                aria-controls={sheetId}
                onClick={() => setMenuOpen(!menuOpen)}
                className={sideBarMenuButtonClass}
              >
                <IconMenu variant={menuOpen ? 'close' : 'menu'} data-figma-part="Icon menu (Atom)" />
              </button>
              {/* La hoja va en el DOM justo después de su botón: Tab entra en ella sin pasar por el logo ni las acciones */}
              {menuOpen && (
                <div id={sheetId} className={cn(sideBarSheetClass, menuClassName)} data-figma-part="Dropdown">
                  <nav aria-label={navLabel} className="flex min-h-0 flex-1 flex-col">
                    <ScrollArea aria-label={navLabel} className="min-h-0 flex-1">
                      <ul className={sideBarListVariants({ collapsed: false })} data-figma-part="List items">
                        {renderItems('expanded', closeMenu)}
                      </ul>
                    </ScrollArea>
                  </nav>
                </div>
              )}
              {logoNode(brand('icon', 'sm'))}
            </div>
            {!menuOpen && mobileActions && (
              <div className={sideBarMobileEndClass} data-figma-part="Avatar">
                {mobileActions}
              </div>
            )}
          </div>
        </div>
      );
    }

    const navId = `${uid}-nav`;
    return (
      <div {...rest} ref={mergedRef} className={cn(sideBarDesktopVariants({ collapsed }), className)} data-collapsed={collapsed || undefined}>
        <div className={sideBarLogoVariants({ collapsed })} data-figma-part="Logo">
          {logoNode(brand(collapsed ? 'icon' : 'logo', 'md'))}
        </div>
        <nav id={navId} aria-label={navLabel} className={sideBarOptionsVariants({ collapsed })} data-figma-part="Opciones">
          <ScrollArea aria-label={navLabel} className="min-h-0 w-full flex-1">
            <ul className={sideBarListVariants({ collapsed })} data-figma-part="Espacio">
              {renderItems(collapsed ? 'collapsed' : 'expanded')}
            </ul>
          </ScrollArea>
        </nav>
        {(footer || collapsible) && (
          <div className={sideBarFooterVariants({ collapsed })} data-figma-part="Frame 1984079668">
            {footer}
            {collapsible && (
              <Button
                iconOnly
                variant="secondary"
                contrast="low"
                size="xs"
                aria-label={collapsed ? expandLabel : collapseLabel}
                onClick={() => setCollapsed(!collapsed)}
                data-figma-part="Button"
              >
                <Icon name={collapsed ? 'chevron-right' : 'chevron-left'} size={16} variant="fill" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

SideBar.displayName = 'SideBar';
