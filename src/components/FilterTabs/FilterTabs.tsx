import { forwardRef } from 'react';
import type { FilterTabsProps } from './FilterTabs.types';
import { filterTabsListClass, filterTabsVariants } from './FilterTabs.variants';
import { Checkbox } from '../Checkbox';
import { Tab, TabList, TabPanel, Tabs } from '../Tabs';
import { useControllableState } from '../../utils/controllableState';
import { cn } from '../../utils/cn';

const EMPTY: string[] = [];

/**
 * Filtro por categorías: pestañas (Tabs, patrón APG Tabs) y, en cada panel, una lista de casillas.
 * La selección es una sola lista con las opciones marcadas de todas las pestañas; cada pestaña muestra cuántas
 * de las suyas están marcadas (Badge del Tab, leído como "2 seleccionadas").
 */
export const FilterTabs = forwardRef<HTMLDivElement, FilterTabsProps>(
  (
    {
      tabs,
      value,
      defaultValue,
      onValueChange,
      tab,
      defaultTab,
      onTabChange,
      showCounts = true,
      contrast = 'on-canva',
      checkboxContrast = 'positive',
      name,
      'aria-label': ariaLabel = 'Categorías',
      className,
      ...restProps
    },
    ref
  ) => {
    const [selected, setSelected] = useControllableState(value, defaultValue ?? EMPTY, onValueChange, 'FilterTabs');

    const toggle = (option: string, checked: boolean) => {
      const next = checked ? [...selected, option] : selected.filter((v) => v !== option);
      // Orden estable: el de las pestañas y sus listas
      const order = tabs.flatMap((t) => t.options.map((o) => o.value));
      setSelected(order.filter((v) => next.includes(v)));
    };

    return (
      <Tabs
        {...restProps}
        ref={ref}
        value={tab}
        defaultValue={defaultTab ?? tabs.find((t) => !t.disabled)?.value}
        onValueChange={onTabChange}
        contrast={contrast}
        size="md"
        className={cn(filterTabsVariants(), className)}
      >
        <TabList aria-label={ariaLabel} fullWidth rootProps={{ 'data-figma-part': 'Tab' }}>
          {tabs.map((t) => {
            const count = t.options.filter((o) => selected.includes(o.value)).length;
            return (
              <Tab
                key={t.value}
                value={t.value}
                icon={t.icon}
                disabled={t.disabled}
                badge={showCounts && count > 0 ? count : undefined}
                badgeLabel={count === 1 ? 'seleccionada' : 'seleccionadas'}
                data-figma-part="Tab (Atom)"
              >
                <span data-figma-part="En alistamiento">{t.label}</span>
              </Tab>
            );
          })}
        </TabList>
        {tabs.map((t) => (
          <TabPanel key={t.value} value={t.value} focusable={false}>
            <div role="group" aria-label={typeof t.label === 'string' ? t.label : undefined} className={filterTabsListClass} data-figma-part="List">
              {t.options.map((o) => (
                <Checkbox
                  key={o.value}
                  contrast={checkboxContrast}
                  name={name}
                  value={o.value}
                  disabled={o.disabled}
                  checked={selected.includes(o.value)}
                  onChange={(e) => toggle(o.value, e.target.checked)}
                  className="flex w-full"
                >
                  <span data-figma-part="Text description">{o.label}</span>
                </Checkbox>
              ))}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    );
  }
);

FilterTabs.displayName = 'FilterTabs';
