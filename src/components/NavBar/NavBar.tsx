import { Children, forwardRef, isValidElement, useCallback, useEffect, useId, useRef } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { NavBarContext, useNavBar } from './NavBar.context';
import type { NavBarItemProps, NavBarProps } from './NavBar.types';
import {
  navBarBarVariants,
  navBarItemVariants,
  navBarMoreButtonVariants,
  navBarRowVariants,
  navBarSheetVariants,
  navBarVariants,
} from './NavBar.variants';
import { DropdownMenuItem, DropdownMenuList } from '../DropdownMenu';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/controllableState';
import { useMergedRefs } from '../../utils/refs';

/**
 * Opción de la barra ("Options tab bar (Atom)" de Figma): ícono de 20 y texto de 10/14.
 * Con `href` es un enlace; sin él, un botón. La opción activa lleva `aria-current="page"`.
 */
export const NavBarItem = forwardRef<HTMLElement, NavBarItemProps>(
  ({ value, label, icon, href, target, rel, current, state, className, onClick, ...rest }, ref) => {
    const ctx = useNavBar();
    const isCurrent = current ?? (ctx ? ctx.value === value : false);
    const visual = state ?? (isCurrent && (ctx?.showActive ?? true) ? 'select' : 'default');
    const classes = cn(navBarItemVariants({ state: visual }), className);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) ctx?.select(value);
    };

    const content = (
      <>
        <span data-figma-part={visual === 'select' ? 'Icon select' : visual === 'focus' ? 'Icon focus' : 'Icon default'} className="flex h-5 w-full items-center justify-center">
          <Icon name={icon} size={20} variant={visual === 'select' ? 'fill' : 'line'} aria-hidden="true" data-figma-part="Icon-sizes" />
        </span>
        <span data-figma-part="Transferencia" className="block max-w-full truncate">
          {label}
        </span>
      </>
    );

    if (href !== undefined) {
      return (
        <a
          {...(rest as object)}
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          aria-current={isCurrent ? 'page' : undefined}
          onClick={handleClick}
          className={classes}
        >
          {content}
        </a>
      );
    }
    return (
      <button
        {...(rest as object)}
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        aria-current={isCurrent ? 'page' : undefined}
        onClick={handleClick}
        className={classes}
      >
        {content}
      </button>
    );
  }
);
NavBarItem.displayName = 'NavBarItem';

/**
 * Barra de navegación inferior (set "Nav bar" de Figma). Dos estilos, según haya `moreItems`:
 * - "4 options": cuatro opciones en la píldora.
 * - "3 options": tres opciones y un botón redondo "más" que abre una hoja con las opciones extra.
 * La posición fija abajo de la pantalla (`fixed inset-x-0 bottom-0`) la decide quien la usa; el componente fluye
 * en el documento. Reserva espacio en la página para que no tape el contenido.
 */
export const NavBar = forwardRef<HTMLElement, NavBarProps>(
  (
    {
      items,
      children,
      value,
      defaultValue,
      onValueChange,
      moreItems,
      moreLabel = 'Más opciones',
      moreOpen,
      defaultMoreOpen = false,
      onMoreOpenChange,
      onMoreSelect,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const hasMore = (moreItems?.length ?? 0) > 0;
    const maxItems = hasMore ? 3 : 4;

    const childItems = Children.toArray(children).filter(isValidElement);
    const values: string[] = children
      ? childItems.map((c) => (c.props as { value: string }).value)
      : (items ?? []).slice(0, maxItems).map((i) => i.value);

    const [current, setCurrent] = useControllableState<string>(value, defaultValue ?? values[0] ?? '', onValueChange, 'NavBar');
    const [open, setOpen] = useControllableState<boolean>(moreOpen, defaultMoreOpen, onMoreOpenChange, 'NavBar (moreOpen)');

    const rootRef = useRef<HTMLElement | null>(null);
    const moreRef = useRef<HTMLButtonElement | null>(null);
    const sheetRef = useRef<HTMLDivElement | null>(null);
    const menuId = useId();
    const mergedRef = useMergedRefs<HTMLElement>(ref, rootRef);

    const showMore = hasMore;
    const sheetOpen = showMore && open;
    const index = values.indexOf(current);
    const showNotch = index >= 0 && !sheetOpen;

    const close = useCallback(
      (returnFocus: boolean) => {
        setOpen(false);
        if (returnFocus) moreRef.current?.focus();
      },
      [setOpen]
    );

    // Cierre con Escape y con un clic fuera
    useEffect(() => {
      if (!sheetOpen) return;
      const onKey = (event: globalThis.KeyboardEvent) => {
        if (event.key === 'Escape') close(true);
      };
      const onPointer = (event: PointerEvent) => {
        if (event.target instanceof Node && !rootRef.current?.contains(event.target)) close(false);
      };
      document.addEventListener('keydown', onKey);
      document.addEventListener('pointerdown', onPointer);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('pointerdown', onPointer);
      };
    }, [sheetOpen, close]);

    const toggleMore = () => {
      const next = !open;
      setOpen(next);
      if (next) {
        // Al abrir con una acción del usuario el foco entra en el primer ítem
        requestAnimationFrame(() => sheetRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-disabled])')?.focus());
      }
    };

    const onSheetKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const list = Array.from(sheetRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled])') ?? []);
      if (!list.length) return;
      const at = list.indexOf(document.activeElement as HTMLElement);
      let next: HTMLElement | undefined;
      if (event.key === 'ArrowDown') next = list[(at + 1) % list.length];
      else if (event.key === 'ArrowUp') next = list[(at - 1 + list.length) % list.length];
      else if (event.key === 'Home') next = list[0];
      else if (event.key === 'End') next = list[list.length - 1];
      else if (event.key === 'Tab') {
        close(false);
        return;
      }
      if (next) {
        event.preventDefault();
        next.focus();
      }
    };

    const n = Math.max(values.length, 1);
    const barStyle = {
      '--i': Math.max(index, 0),
      '--n': n,
    } as CSSProperties;
    const surfaceMask = showNotch
      ? 'radial-gradient(circle at var(--nx) 0, transparent 12px, #000 12.5px)'
      : undefined;

    const ctx = { value: current, showActive: !sheetOpen, select: (v: string) => setCurrent(v) };

    return (
      <nav
        {...rest}
        ref={mergedRef}
        className={cn(navBarVariants({ open: sheetOpen }), className)}
        style={style}
      >
        {sheetOpen && (
          <div ref={sheetRef} data-figma-part="Bottom sheet" className={navBarSheetVariants()} onKeyDown={onSheetKeyDown}>
            <DropdownMenuList id={menuId} aria-label={moreLabel} onClose={() => close(true)} className="flex flex-col gap-2.5">
              {moreItems?.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  type="icon"
                  icon={item.icon}
                  disabled={item.disabled}
                  data-figma-part="Dropdown list"
                  onSelect={() => {
                    item.onSelect?.();
                    onMoreSelect?.(item.value);
                  }}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuList>
          </div>
        )}
        <div data-figma-part="Nav bar" className={navBarRowVariants({ open: sheetOpen })}>
          <div data-figma-part="Nav bar" className={navBarBarVariants()} style={barStyle}>
            <span
              aria-hidden="true"
              data-figma-part="Canva"
              className="pointer-events-none absolute inset-0 rounded-ds-radius-general-full bg-ds-background-container-default-on-canva"
              style={surfaceMask ? { maskImage: surfaceMask, WebkitMaskImage: surfaceMask } : undefined}
            />
            {showNotch && (
              <span
                aria-hidden="true"
                data-figma-part="Ellipse 1"
                className="pointer-events-none absolute -top-[3px] left-(--nx) size-2 -translate-x-1/2 rounded-full bg-ds-background-acent-tertiary"
              />
            )}
            <NavBarContext.Provider value={ctx}>
              <ul data-figma-part="Description group" className="relative m-0 flex list-none items-center gap-ds-space-general-md p-0">
                {children
                  ? childItems.map((child, i) => (
                      <li key={values[i] ?? i} className="flex min-w-0 flex-1">
                        {child}
                      </li>
                    ))
                  : (items ?? []).slice(0, maxItems).map((item) => (
                      <li key={item.value} className="flex min-w-0 flex-1">
                        <NavBarItem {...item} className="w-full" />
                      </li>
                    ))}
              </ul>
            </NavBarContext.Provider>
          </div>
          {showMore && (
            <button
              ref={moreRef}
              type="button"
              data-figma-part="Button"
              aria-label={moreLabel}
              aria-haspopup="menu"
              aria-expanded={sheetOpen}
              aria-controls={sheetOpen ? menuId : undefined}
              onClick={toggleMore}
              className={navBarMoreButtonVariants({ open: sheetOpen })}
            >
              <Icon name="add-2" size={24} variant="fill" aria-hidden="true" className={cn('transition-transform motion-reduce:transition-none', sheetOpen && 'rotate-45')} />
            </button>
          )}
        </div>
      </nav>
    );
  }
);
NavBar.displayName = 'NavBar';
