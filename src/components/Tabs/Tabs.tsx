import { forwardRef, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { TabsContext } from './Tabs.context';
import type { TabsContextValue } from './Tabs.context';
import type { TabListProps, TabOverflowProps, TabPanelProps, TabProps, TabsProps } from './Tabs.types';
import {
  tabIconClass,
  tabLabelClass,
  tabListInnerVariants,
  tabListVariants,
  tabPanelClass,
  tabVariants,
} from './Tabs.variants';
import { Badge } from '../Badge';
import { Dots } from '../Dots';
import { DropdownMenu } from '../DropdownMenu';
import { Icon } from '../Icon';
import { useMergedRefs } from '../../utils/refs';
import { cn } from '../../utils/cn';

const TAB_SELECTOR = '[role="tab"]';
const ENABLED_TAB_SELECTOR = '[role="tab"]:not(:disabled)';

/** Un `value` cualquiera como parte segura de un id. */
const slug = (value: string) => value.replace(/[^\w-]/g, '_');

/**
 * Tabs: grupo de pestañas y paneles. Patrón WAI-ARIA APG Tabs.
 *
 * - `TabList` es el `tablist`, cada `Tab` un botón `role="tab"` con `aria-selected` y `aria-controls`, y cada
 *   `TabPanel` un `role="tabpanel"` con `aria-labelledby`, enfocable.
 * - Roving tabindex: solo la pestaña seleccionada (o la primera habilitada) entra en el orden de Tab.
 * - Teclado: flechas izquierda/derecha (circulares), Inicio y Fin; las deshabilitadas se saltan.
 *   `activationMode="automatic"` (por defecto) selecciona al mover el foco; `manual`, con Enter o Espacio.
 * - Controlado (`value`) o no controlado (`defaultValue`), con `onValueChange`.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      size = 'md',
      contrast = 'on-canva',
      activationMode = 'automatic',
      children,
      className,
      ...restProps
    },
    ref
  ) => {
    const uid = useId();
    const [inner, setInner] = useState<string | undefined>(defaultValue);
    const [tabStop, setTabStop] = useState<string | undefined>(undefined);
    const [panels, setPanels] = useState<ReadonlySet<string>>(() => new Set());
    const registerPanel = useCallback((panel: string) => {
      setPanels((prev) => new Set(prev).add(panel));
      return () =>
        setPanels((prev) => {
          const next = new Set(prev);
          next.delete(panel);
          return next;
        });
    }, []);
    const isControlled = value !== undefined;
    const selected = isControlled ? value : inner;

    const select = useCallback(
      (next: string, notify = true) => {
        if (!isControlled) setInner(next);
        if (notify && next !== selected) onValueChange?.(next);
      },
      [isControlled, onValueChange, selected]
    );

    const context = useMemo<TabsContextValue>(
      () => ({
        size,
        contrast,
        activationMode,
        selected,
        tabStop,
        setTabStop,
        select,
        panels,
        registerPanel,
        fullWidth: false,
        tabId: (v) => `${uid}-tab-${slug(v)}`,
        panelId: (v) => `${uid}-panel-${slug(v)}`,
      }),
      [size, contrast, activationMode, selected, tabStop, select, panels, registerPanel, uid]
    );

    return (
      <TabsContext.Provider value={context}>
        <div ref={ref} className={className} {...restProps}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

/**
 * Contenedor visual (fondo y píldora de Figma) con el `tablist` dentro y, opcional, el desborde a la derecha.
 * `ref`, `aria-*` y el resto de props van al `tablist`; `className` y `rootProps`, al contenedor.
 */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ overflow, fullWidth = false, rootProps, children, className, onKeyDown, ...restProps }, ref) => {
    const ctx = useContext(TabsContext);
    const listRef = useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergedRefs(ref, listRef);
    const size = ctx?.size ?? 'md';
    const contrast = ctx?.contrast ?? 'on-canva';

    // Selección inicial y pestaña del orden de Tab, según las pestañas que hay en el DOM (en cada render:
    // las pestañas pueden cambiar o deshabilitarse). Solo actualiza estado si cambia, así que no hace bucles.
    useEffect(() => {
      if (!ctx || !listRef.current) return;
      const enabled = Array.from(listRef.current.querySelectorAll<HTMLElement>(ENABLED_TAB_SELECTOR)).map(
        (el) => el.dataset.value ?? ''
      );
      if (ctx.selected === undefined && enabled.length) {
        ctx.select(enabled[0], false);
        return;
      }
      const stop = ctx.selected !== undefined && enabled.includes(ctx.selected) ? ctx.selected : enabled[0];
      if (stop !== ctx.tabStop) ctx.setTabStop(stop);
    });

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !ctx || !listRef.current) return;
      const tabs = Array.from(listRef.current.querySelectorAll<HTMLElement>(ENABLED_TAB_SELECTOR));
      const current = tabs.indexOf((event.target as HTMLElement).closest<HTMLElement>(TAB_SELECTOR) as HTMLElement);
      if (current < 0 || !tabs.length) return;
      let next: number;
      switch (event.key) {
        case 'ArrowRight':
          next = (current + 1) % tabs.length;
          break;
        case 'ArrowLeft':
          next = (current - 1 + tabs.length) % tabs.length;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = tabs.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      tabs[next].focus();
      // En una lista con scroll (no cabe), la pestaña enfocada tiene que quedar a la vista
      tabs[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      if (ctx.activationMode === 'automatic') ctx.select(tabs[next].dataset.value ?? '');
    };

    const listContext = useMemo(() => (ctx ? { ...ctx, fullWidth } : null), [ctx, fullWidth]);

    return (
      <div {...rootProps} className={cn(tabListVariants({ size, contrast, fullWidth }), rootProps?.className, className)}>
        <div
          {...restProps}
          ref={mergedRef}
          role="tablist"
          aria-orientation="horizontal"
          className={tabListInnerVariants({ fullWidth })}
          data-figma-part="tabs"
          onKeyDown={handleKeyDown}
        >
          <TabsContext.Provider value={listContext}>{children}</TabsContext.Provider>
        </div>
        {overflow}
      </div>
    );
  }
);

TabList.displayName = 'TabList';

/**
 * Pestaña (set "Tab (Atom)"): ícono, texto y badge opcionales. Sin texto es de solo ícono y exige `aria-label`.
 * Dentro de `Tabs` toma Size, Contrast, la selección y los ids del grupo. Suelta (documentación) usa sus props.
 */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      value,
      icon,
      badge,
      badgeLabel,
      disabled,
      size: sizeProp,
      contrast: contrastProp,
      state = 'default',
      children,
      className,
      onClick,
      type = 'button',
      id,
      tabIndex,
      'aria-label': ariaLabel,
      ...restProps
    },
    ref
  ) => {
    const ctx = useContext(TabsContext);
    const size = sizeProp ?? ctx?.size ?? 'md';
    const contrast = contrastProp ?? ctx?.contrast ?? 'on-canva';
    const isDisabled = disabled || state === 'inactive';
    const isSelected = state === 'select' || (state === 'default' && ctx?.selected === value);
    const hasText = children != null && children !== false && children !== '';
    const hasBadge = badge != null && badge !== false && badge !== '';
    // Solo ícono: el nombre va como texto sr-only (no aria-label) para que el número visible del badge forme parte
    // del nombre accesible ("Favoritos 2", WCAG 2.5.3)
    const srName = !hasText && ariaLabel ? ariaLabel : undefined;
    const panelExists = ctx?.panels.has(value) ?? false;

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented && ctx && !isDisabled) ctx.select(value);
    };

    return (
      <button
        {...restProps}
        ref={ref}
        type={type}
        role="tab"
        id={ctx ? ctx.tabId(value) : id}
        aria-controls={ctx && panelExists ? ctx.panelId(value) : undefined}
        aria-label={srName ? undefined : ariaLabel}
        aria-selected={isSelected}
        tabIndex={ctx ? (ctx.tabStop === value ? 0 : -1) : tabIndex}
        disabled={isDisabled}
        data-value={value}
        className={cn(
          tabVariants({ size, contrast, state: isDisabled ? 'inactive' : state, fullWidth: ctx?.fullWidth ?? false }),
          className
        )}
        onClick={handleClick}
      >
        {icon && <Icon name={icon} size={16} variant="fill" className={tabIconClass} data-figma-part="Icon-sizes" />}
        {srName && <span className="sr-only">{srName}</span>}
        {hasText && (
          <span className={tabLabelClass} data-figma-part="Text-button">
            {/* Capa de texto de Figma (se llama como su texto de muestra): el comparador la empareja por nombre */}
            <span data-figma-part="En alistamiento">{children}</span>
          </span>
        )}
        {hasBadge && (
          <Badge type="number" state={isDisabled ? 'neutral' : 'default'} label={badgeLabel} data-figma-part="Badge">
            {badge}
          </Badge>
        )}
      </button>
    );
  }
);

Tab.displayName = 'Tab';

/** Panel de una pestaña: `role="tabpanel"`, enfocable (salvo `focusable={false}`) y oculto (`hidden`) cuando su pestaña no está seleccionada. */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, keepMounted = false, focusable = true, children, className, id, ...restProps }, ref) => {
    const ctx = useContext(TabsContext);
    const isSelected = ctx?.selected === value;
    const registerPanel = ctx?.registerPanel;
    // La pestaña solo apunta (aria-controls) a paneles que existen
    useEffect(() => registerPanel?.(value), [registerPanel, value]);
    return (
      <div
        {...restProps}
        ref={ref}
        role="tabpanel"
        id={ctx ? ctx.panelId(value) : id}
        aria-labelledby={ctx?.tabId(value)}
        tabIndex={focusable ? 0 : undefined}
        hidden={!isSelected}
        className={cn(tabPanelClass, className)}
      >
        {isSelected || keepMounted ? children : null}
      </div>
    );
  }
);

TabPanel.displayName = 'TabPanel';

/**
 * Desborde ("more options" de Figma): botón `Dots` xs que abre un `DropdownMenu` con las pestañas que no caben.
 * Se pasa en `overflow` de `TabList`; queda fuera del `tablist` (es un botón de menú, no una pestaña).
 * Los ítems son `DropdownMenuItem`: al elegir uno, quien usa el componente lo selecciona (`value` controlado) y
 * lo pasa a las pestañas visibles para que la pestaña seleccionada exista siempre.
 */
export const TabOverflow = forwardRef<HTMLDivElement, TabOverflowProps>(
  ({ label = 'Más pestañas', 'aria-label': menuLabel, children, ...restProps }, ref) => (
    <DropdownMenu
      ref={ref}
      trigger={<Dots size="xs" label={label} data-figma-part="Dots-moreoptions" />}
      aria-label={menuLabel ?? label}
      {...restProps}
    >
      {children}
    </DropdownMenu>
  )
);

TabOverflow.displayName = 'TabOverflow';
