import { forwardRef, useCallback, useId, useMemo, useRef, useState } from 'react';
import type { Ref } from 'react';
import type { FilterPanelProps, FilterValue, FilterValues } from './FilterPanel.types';
import {
  filterPanelBodyClass,
  filterPanelCloseClass,
  filterPanelDialogClass,
  filterPanelFooterClass,
  filterPanelHandleClass,
  filterPanelHeaderClass,
  filterPanelSurfaceVariants,
  filterPanelTitleClass,
} from './FilterPanel.variants';
import { countFilterValue, countFilters, omitFilter } from './FilterPanel.utils';
import { FilterPanelContext } from './FilterPanel.context';
import type { FilterPanelContextValue, FilterSectionInfo } from './FilterPanel.context';
import { Accordion } from '../Accordion';
import { Button } from '../Button';
import { Chip, ChipGroup } from '../Chip';
import { Icon } from '../Icon';
import { ModalDialog } from '../_internal/ModalDialog';
import { useControllableState } from '../../utils/controllableState';
import { cn } from '../../utils/cn';

const EMPTY: FilterValues = {};

/**
 * Panel de filtros ("Filters" de Figma): encabezado con cerrar, resumen de lo elegido, secciones plegables
 * (`FilterSection`) y acciones Limpiar / Aplicar.
 *
 * Estado: un objeto por sección (`{ [id]: valor }`), controlado o no (`value`/`defaultValue`/`onValueChange`). "Limpiar"
 * deja `{}`; cada sección tiene su propio "Limpiar". "Aplicar" entrega los valores con `onApply` (y cierra si es modal);
 * el total para el badge de `FilterButton` sale de `countFilters`.
 *
 * Con `modal` (por defecto) es un `<dialog>` abierto con `showModal()` (pieza interna `ModalDialog`): el navegador atrapa
 * el foco y deja inerte el resto, Escape y el clic en el fondo cierran (un arrastre desde dentro no), el documento no se
 * desplaza debajo y al cerrar el foco vuelve al botón que lo abrió. En escritorio es un panel lateral derecho; en móvil
 * (< 48rem), una hoja inferior. Sin `modal`, es una barra lateral en el flujo.
 */
export const FilterPanel = forwardRef<HTMLElement, FilterPanelProps>(
  (
    {
      title = 'Filtros avanzados',
      value,
      defaultValue,
      onValueChange,
      onApply,
      onClear,
      applyLabel = 'Aplicar',
      clearLabel = 'Limpiar',
      modal = true,
      open: openProp,
      defaultOpen,
      onOpenChange,
      closeLabel = 'Cerrar filtros',
      openSections,
      defaultOpenSections,
      onOpenSectionsChange,
      showSummary = true,
      children,
      className,
      surfaceProps,
      ...restProps
    },
    ref
  ) => {
    const titleId = `${useId()}-title`;
    const surfaceRef = useRef<HTMLDivElement>(null);

    const [values, setValues] = useControllableState<FilterValues>(value, defaultValue ?? EMPTY, onValueChange, 'FilterPanel');
    const [open, setOpen] = useControllableState<boolean>(openProp, defaultOpen ?? !modal, onOpenChange, 'FilterPanel');

    // Secciones registradas por cada FilterSection (en orden de montaje)
    const [sections, setSections] = useState<FilterSectionInfo[]>([]);
    const register = useCallback((info: FilterSectionInfo) => {
      setSections((prev) => (prev.some((s) => s.id === info.id) ? prev.map((s) => (s.id === info.id ? info : s)) : [...prev, info]));
      return () => setSections((prev) => prev.filter((s) => s.id !== info.id));
    }, []);
    const cardIds = sections.filter((s) => s.card).map((s) => s.id);

    // Secciones abiertas. Sin `defaultOpenSections` se guardan las cerradas: así toda sección nueva entra abierta
    const [innerOpen, setInnerOpen] = useState<string[] | null>(defaultOpenSections ?? null);
    const [closed, setClosed] = useState<string[]>([]);
    const expanded = openSections ?? innerOpen ?? cardIds.filter((id) => !closed.includes(id));
    const setExpanded = (next: string[]) => {
      if (openSections === undefined) {
        if (innerOpen) setInnerOpen(next);
        else setClosed(cardIds.filter((id) => !next.includes(id)));
      }
      onOpenSectionsChange?.(next);
    };

    const context = useMemo<FilterPanelContextValue>(
      () => ({
        values,
        register,
        setSectionValue: (id: string, next: FilterValue) => setValues({ ...values, [id]: next }),
        clearSection: (id: string) => setValues(omitFilter(values, id)),
      }),
      [values, setValues, register]
    );

    const total = countFilters(values);
    const active = sections.filter((s) => countFilterValue(values[s.id]) > 0);
    const showClose = modal || onOpenChange !== undefined;

    const clearAll = () => {
      setValues({});
      onClear?.();
    };
    // Quitar un chip del resumen. Si es el último, el resumen desaparece: el foco pasa al encabezado de la sección
    // quitada (o al título del panel) para no caer en `body` dentro del diálogo
    const removeFromSummary = (id: string) => {
      const wasLast = active.length === 1;
      context.clearSection(id);
      if (!wasLast) return;
      const root = surfaceRef.current;
      const target =
        root?.querySelector<HTMLElement>(`[data-filter-section="${CSS.escape(id)}"] :is([data-accordion-trigger], [data-filter-section-title])`) ??
        root?.querySelector<HTMLElement>(`#${CSS.escape(titleId)}`);
      target?.focus();
    };
    const apply = () => {
      onApply?.(values);
      if (modal) setOpen(false);
    };

    const surface = (
      <div
        {...surfaceProps}
        ref={surfaceRef}
        data-state={open ? 'open' : 'closed'}
        className={cn(filterPanelSurfaceVariants(), className, surfaceProps?.className)}
      >
        <span aria-hidden="true" className={filterPanelHandleClass} />
        <div className={filterPanelHeaderClass} data-figma-part="Frame 1984080545">
          <h2 id={titleId} tabIndex={-1} className={cn(filterPanelTitleClass, 'outline-none')} data-figma-part="Filtros avanzados">
            {title}
          </h2>
          {showClose && (
            <button type="button" aria-label={closeLabel} onClick={() => setOpen(false)} className={filterPanelCloseClass}>
              <Icon name="close" size={24} variant="line" data-figma-part="Icon-sizes" />
            </button>
          )}
        </div>

        {/* Total de filtros elegidos, anunciado al cambiar */}
        <p role="status" className="sr-only">
          {total === 0 ? 'Ningún filtro seleccionado' : `${total} ${total === 1 ? 'filtro seleccionado' : 'filtros seleccionados'}`}
        </p>

        {showSummary && active.length > 0 && (
          <ChipGroup aria-label="Filtros seleccionados" className="flex-wrap">
            {active.map((s) => {
              const n = countFilterValue(values[s.id]);
              const text = s.title;
              return (
                <Chip key={s.id} value={s.id} label={text} icon={false} onRemove={() => removeFromSummary(s.id)} removeLabel={`Quitar filtro ${text}`}>
                  {n > 1 ? `${text} (${n})` : text}
                </Chip>
              );
            })}
          </ChipGroup>
        )}

        <div className={filterPanelBodyClass} data-figma-part="Container">
          <Accordion type="multiple" contrast="on-card" headingLevel={3} value={expanded} onValueChange={setExpanded}>
            {children}
          </Accordion>
        </div>

        <div className={filterPanelFooterClass} data-figma-part="Buttons">
          <Button variant="secondary" size="md" onClick={clearAll} className="mobile:w-full" data-figma-part="Button">
            {clearLabel}
          </Button>
          <Button variant="primary" size="md" onClick={apply} className="mobile:w-full" data-figma-part="Button">
            {applyLabel}
          </Button>
        </div>
      </div>
    );

    return (
      <FilterPanelContext.Provider value={context}>
        {modal ? (
          <ModalDialog
            {...restProps}
            ref={ref as Ref<HTMLDialogElement>}
            open={open}
            onOpenChange={setOpen}
            placement="side"
            aria-labelledby={titleId}
            className={filterPanelDialogClass}
          >
            {surface}
          </ModalDialog>
        ) : (
          open && (
            <section {...restProps} ref={ref} aria-labelledby={titleId} className="flex h-full">
              {surface}
            </section>
          )
        )}
      </FilterPanelContext.Provider>
    );
  }
);

FilterPanel.displayName = 'FilterPanel';
