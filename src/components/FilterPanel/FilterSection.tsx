import { createElement, forwardRef, useEffect, useId, useRef } from 'react';
import type { FilterSectionField, FilterSectionProps, FilterValue } from './FilterPanel.types';
import {
  filterSectionContentClass,
  filterSectionPlainHeaderClass,
  filterSectionPlainSlotClass,
  filterSectionPlainTitleClass,
  filterSectionPlainVariants,
  filterSectionTitleRowClass,
} from './FilterPanel.variants';
import { countFilterValue } from './FilterPanel.utils';
import { useFilterPanel } from './FilterPanel.context';
import { AccordionItem } from '../Accordion';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { useControllableState } from '../../utils/controllableState';
import { useMergedRefs } from '../../utils/refs';
import { cn } from '../../utils/cn';

/**
 * Sección de filtro: título con el conteo de lo elegido, el control (cualquier componente existente: ChipGroup,
 * Select, Slider, DatePicker, Switch, Checkbox, Radio, NumberPicker, Tabs, RatingFilter, CheckboxTree…) y "Limpiar".
 *
 * - `card` (por defecto): Card accordion (Atom) plegable, patrón APG Accordion (lo da `AccordionItem`).
 * - `plain`: "Individual filter" de Figma, `role="group"` nombrado por el título, sin plegado.
 *
 * Dentro de un `FilterPanel` el valor vive en el panel (`values[id]`); suelta, con `value`/`defaultValue`/`onValueChange`.
 */
export const FilterSection = forwardRef<HTMLDivElement, FilterSectionProps>(
  (props, ref) => {
    const {
      id,
      title,
      variant = 'card',
      description,
      icon = true,
      iconName,
      count: countProp,
      clearable = true,
      clearLabel = 'Limpiar',
      headingLevel = 3,
      value: valueProp,
      defaultValue,
      onValueChange,
      defaultOpen = true,
      children,
      className,
      ...restProps
    } = props;
    const panel = useFilterPanel();
    const rootRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(rootRef, ref);
    const labelId = `${useId()}-title`;
    // Suelta y controlada, `undefined` es un valor válido ("sin filtro", lo que deja "Limpiar"): el modo lo da la
    // presencia de la prop, no su valor
    const [ownValue, setOwnValue] = useControllableState<FilterValue>(valueProp, defaultValue, onValueChange, {
      name: 'FilterSection',
      controlled: 'value' in props,
    });

    // Registro en el panel: abre la sección por defecto y le da nombre en el resumen
    const register = panel?.register;
    const titleText = typeof title === 'string' ? title : id;
    useEffect(() => register?.({ id, title: titleText, card: variant === 'card' }), [register, id, titleText, variant]);

    const value = panel ? panel.values[id] : ownValue;
    const setValue = (next: FilterValue) => (panel ? panel.setSectionValue(id, next) : setOwnValue(next));
    const clear = () => (panel ? panel.clearSection(id) : setOwnValue(undefined));

    const count = countProp ?? countFilterValue(value);
    const field: FilterSectionField = { id, value, onValueChange: setValue, clear, labelId };
    const content = typeof children === 'function' ? children(field) : children;

    const badge =
      count > 0 ? (
        <Badge type="number" state="default" label={count === 1 ? 'seleccionado' : 'seleccionados'}>
          {count}
        </Badge>
      ) : null;

    const clearButton =
      clearable && count > 0 ? (
        <Button
          variant="tertiary"
          size="xs"
          onClick={() => {
            clear();
            // El botón desaparece al limpiar: el foco pasa al encabezado de la sección para no perderse
            rootRef.current?.querySelector<HTMLElement>('[data-accordion-trigger], [data-filter-section-title]')?.focus();
          }}
          aria-label={typeof title === 'string' ? `${clearLabel} ${title}` : undefined}
          className="shrink-0"
        >
          {clearLabel}
        </Button>
      ) : null;

    if (variant === 'plain') {
      return (
        <div
          role="group"
          aria-labelledby={labelId}
          {...restProps}
          ref={mergedRef}
          data-filter-section={id}
          className={cn(filterSectionPlainVariants(), className)}
        >
          <div className={filterSectionPlainHeaderClass} data-figma-part="Frame 1984080547">
            {createElement(
              `h${headingLevel}`,
              { id: labelId, tabIndex: -1, className: cn(filterSectionPlainTitleClass, 'outline-none'), 'data-figma-part': 'Filename', 'data-filter-section-title': '' },
              title
            )}
            {badge}
            {clearButton && <span className="ml-auto">{clearButton}</span>}
          </div>
          <div className={filterSectionPlainSlotClass} data-figma-part="Container">
            {content}
          </div>
        </div>
      );
    }

    return (
      <AccordionItem
        {...restProps}
        ref={mergedRef}
        value={id}
        data-filter-section={id}
        title={
          <span className={filterSectionTitleRowClass}>
            <span id={labelId}>{title}</span>
            {badge}
          </span>
        }
        description={description}
        icon={icon}
        iconName={iconName}
        headingLevel={headingLevel}
        defaultOpen={panel ? undefined : defaultOpen}
        className={className}
      >
        <div className={filterSectionContentClass}>{content}</div>
        {clearButton}
      </AccordionItem>
    );
  }
);

FilterSection.displayName = 'FilterSection';
