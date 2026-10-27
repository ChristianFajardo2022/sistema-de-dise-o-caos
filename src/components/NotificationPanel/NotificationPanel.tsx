import { forwardRef, useEffect, useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { NotificationPanelProps } from './NotificationPanel.types';
import {
  notificationPanelActionsVariants,
  notificationPanelDividerVariants,
  notificationPanelHeaderVariants,
  notificationPanelListVariants,
  notificationPanelTitleVariants,
  notificationPanelVariants,
} from './NotificationPanel.variants';
import { NotificationFilter } from './NotificationFilter';
import { NotificationTabStrip } from './NotificationTabStrip';
import { PANEL_ATTR } from '../NotificationItem/NotificationItem.shared';
import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import { Icon } from '../Icon';
import { ScrollArea } from '../ScrollArea';
import { TabPanel, Tabs } from '../Tabs';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/controllableState';
import { useMergedRefs } from '../../utils/refs';

/**
 * Panel de notificaciones (sets "Simple notifications" 12602:6152 y "Complex notifications" 15302:8832 de Figma,
 * el marco "Profile card"): encabezado con título, filtro "Todas" / "No leídos" (y ajustes en `complex`), pestañas
 * opcionales, divisor y la lista dentro de un `ScrollArea`. Sin notificaciones muestra un `EmptyState`.
 *
 * - Región o diálogo: por defecto es una región (`<section>`) nombrada por su título. Con `popup` (se abre desde la
 *   campana) es `role="dialog"` no modal: el foco pasa al panel al abrir y vuelve a quien lo tenía al cerrar, y Escape
 *   llama a `onOpenChange(false)`. El clic fuera y la posición del panel los resuelve quien lo abre.
 * - Lista: `<ul role="list">` con nombre; sus hijos son `<li>` (`NotificationItem`, `NotificationCard`, `NotificationGroup`
 *   y `NotificationPanelHeading`). Al eliminar una notificación el foco pasa a la vecina, o al panel si era la última.
 * - El panel no filtra ni agrupa: recibe `children` ya listos y avisa de los cambios de filtro y pestaña.
 * - `ref` y las props nativas van a la raíz; `rootProps`, también (para `data-*`).
 */
export const NotificationPanel = forwardRef<HTMLElement, NotificationPanelProps>(
  (
    {
      variant = 'simple',
      title = 'Notificaciones',
      headingLevel = 2,
      filter: filterProp,
      defaultFilter = 'all',
      onFilterChange,
      filterLabels,
      filterLabel,
      onSettingsClick,
      settingsLabel = 'Ajustes de notificaciones',
      tabs,
      tab: tabProp,
      defaultTab,
      onTabChange,
      tabsLabel,
      tabScrollButtons = false,
      children,
      empty = false,
      emptyDescription,
      emptyTitle,
      listLabel = 'Lista de notificaciones',
      listMaxHeight = '24rem',
      popup = false,
      open = true,
      onOpenChange,
      rootProps,
      className,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const uid = useId();
    const titleId = `${uid}-title`;
    const complex = variant === 'complex';
    const hasTabs = complex && tabs !== undefined && tabs.length > 0;
    const rootRef = useRef<HTMLElement | null>(null);
    const mergedRef = useMergedRefs(rootRef, ref);
    const [filter, setFilter] = useControllableState(filterProp, defaultFilter, onFilterChange, 'NotificationPanel');
    const [tab, setTab] = useControllableState<string | undefined>(tabProp, defaultTab ?? tabs?.[0]?.value, (next) => next !== undefined && onTabChange?.(next), {
      name: 'NotificationPanel',
      controlled: tabProp !== undefined,
    });
    const Heading = `h${headingLevel}` as const;

    // Diálogo no modal: foco al panel al abrir y de vuelta al disparador al cerrar
    useEffect(() => {
      if (!popup || !open) return;
      const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const panel = rootRef.current;
      panel?.focus({ preventScroll: true });
      return () => {
        const active = document.activeElement;
        if (opener?.isConnected && (active === document.body || panel?.contains(active))) {
          opener.focus({ preventScroll: true });
        }
      };
    }, [popup, open]);

    if (!open) return null;

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !popup || event.key !== 'Escape') return;
      event.stopPropagation();
      onOpenChange?.(false);
    };

    const body = empty ? (
      <div data-figma-part="Content" className="flex min-w-0 items-center">
        <EmptyState
          type="no-content"
          icon={complex ? 'notification' : 'document'}
          title={emptyTitle}
          description={emptyDescription ?? (filter === 'unread' ? 'No tienes notificaciones sin leer.' : 'No tienes notificaciones.')}
          headingLevel={Math.min(headingLevel + 1, 6) as 3 | 4 | 5 | 6}
        />
      </div>
    ) : (
      <div data-figma-part="Content" className="min-w-0">
        <ScrollArea aria-label={`${listLabel} (desplazable)`} maxHeight={listMaxHeight}>
          <ul role="list" aria-label={listLabel} className={notificationPanelListVariants({ variant })}>
            {typeof children === 'function' ? children(tab) : children}
          </ul>
        </ScrollArea>
      </div>
    );

    const filterNode = (
      <NotificationFilter value={filter} onValueChange={setFilter} labels={filterLabels} aria-label={filterLabel} />
    );

    return (
      <section
        {...rootProps}
        {...rest}
        ref={mergedRef}
        {...{ [PANEL_ATTR]: '' }}
        role={popup ? 'dialog' : undefined}
        aria-modal={popup ? false : undefined}
        aria-labelledby={rest['aria-label'] ? undefined : (rest['aria-labelledby'] ?? titleId)}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(notificationPanelVariants({ variant }), rootProps?.className, className)}
      >
        <div data-figma-part="Container" className={notificationPanelHeaderVariants()}>
          <Heading id={titleId} data-figma-part="Notificaciones" className={notificationPanelTitleVariants()}>
            {title}
          </Heading>
          <div data-figma-part="Chips" className={notificationPanelActionsVariants()}>
            {filterNode}
            {complex && onSettingsClick && (
              <Button iconOnly variant="tertiary" size="xs" aria-label={settingsLabel} onClick={onSettingsClick} data-figma-part="Button">
                <Icon name="setting" size={20} variant="fill" data-figma-part="Icon-sizes" />
              </Button>
            )}
          </div>
        </div>
        {hasTabs ? (
          <Tabs size="sm" contrast="on-card" value={tab} onValueChange={(next) => setTab(next)} className="contents">
            <NotificationTabStrip tabs={tabs} aria-label={tabsLabel} scrollButtons={tabScrollButtons} />
            <div data-figma-part="Divider" aria-hidden="true" className={notificationPanelDividerVariants()} />
            {tabs.map((t) => (
              <TabPanel key={t.value} value={t.value} focusable={false}>
                {body}
              </TabPanel>
            ))}
          </Tabs>
        ) : (
          <>
            <div data-figma-part="Divider" aria-hidden="true" className={notificationPanelDividerVariants()} />
            {body}
          </>
        )}
      </section>
    );
  }
);

NotificationPanel.displayName = 'NotificationPanel';
