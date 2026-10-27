import { forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, Ref } from 'react';
import type { SearchInputLabels, SearchInputProps, SearchInputSection, SearchInputState, SearchInputSuggestion } from './SearchInput.types';
import {
  searchInputBarVariants,
  searchInputCategoryClass,
  searchInputControlClass,
  searchInputDividerClass,
} from './SearchInput.variants';
import { SearchInputPanel } from './SearchInputPanel';
import type { SearchInputFlatOption, SearchInputPanelSection } from './SearchInputPanel';
import { Button } from '../Button';
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu';
import { FieldMessage, useField } from '../Field';
import { Icon } from '../Icon';
import { TOP_LAYER_CLASS, TOP_LAYER_MAX_WIDTH } from '../_internal/overlay';
import { useAnchoredPosition } from '../../utils/anchoredPosition';
import { useControllableState } from '../../utils/controllableState';
import { cn } from '../../utils/cn';
import { useMergedRefs } from '../../utils/refs';

/** Separación barra → panel (8, como Figma). */
const OFFSET = 8;

const DEFAULT_LABELS: SearchInputLabels = {
  search: 'Buscar',
  category: 'Categoría',
  suggestions: 'Sugerencias',
  recent: 'Búsquedas recientes',
  popular: 'Popular ahora',
  clearRecent: 'Borrar búsquedas recientes',
  clearPopular: 'Borrar búsquedas populares',
};

const SECTIONS: SearchInputSection[] = ['keywords', 'recent', 'popular'];

const normalize = (s: SearchInputSuggestion) => (typeof s === 'string' ? { value: s, label: s } : { value: s.value, label: s.label ?? s.value });

/**
 * Barra de búsqueda del set "Search input (Avance)" de Figma: selector de categoría opcional, campo y botón de búsqueda;
 * con el foco abre un panel de sugerencias (palabras clave, búsquedas recientes y populares).
 *
 * Patrón WAI-ARIA APG Combobox con autocompletado de lista: el `<input type="search" role="combobox">` conserva el
 * foco y recorre las opciones de todas las secciones con `aria-activedescendant`.
 * Teclado: Flecha abajo/arriba abren y recorren (al pasar del extremo vuelven al texto); Enter elige la opción activa
 * o busca lo escrito; Esc cierra el panel y, cerrado, borra el texto; Tab sigue al botón de búsqueda y a las papeleras
 * del panel, que se cierra cuando el foco sale del campo, del botón y del panel.
 *
 * El selector de categoría es un DropdownMenu (Menu Button). El `ref` y los atributos nativos van al `<input>`;
 * `className` y `rootProps`, a la raíz.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      label,
      placeholder,
      value: valueProp,
      defaultValue = '',
      onValueChange,
      onChange,
      onSearch,
      categories,
      category: categoryProp,
      defaultCategory,
      onCategoryChange,
      suggestions,
      onSuggestionSelect,
      onClearRecent,
      onClearPopular,
      labels: labelsProp,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      helperText,
      errorText,
      successText,
      state = 'default',
      disabled = false,
      readOnly = false,
      id,
      className,
      rootProps,
      onKeyDown,
      onFocus,
      onClick,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const field = useField({
      id,
      helperText,
      errorText,
      successText,
      state: state === 'helper' ? 'default' : state,
      disabled,
      readOnly,
    });
    const { ids, message, isDisabled, isReadOnly, isError } = field;

    const [query, setQuery] = useControllableState(valueProp, defaultValue, onValueChange, 'SearchInput');
    const hasCategories = Boolean(categories?.length);
    const [category, setCategory] = useControllableState(
      categoryProp,
      defaultCategory ?? categories?.[0]?.value ?? '',
      onCategoryChange,
      'SearchInput (category)'
    );
    const currentCategory = categories?.find((c) => c.value === category);

    const [openValue, setOpenValue] = useControllableState(openProp, defaultOpen, onOpenChange, 'SearchInput (open)');
    const [activeIndex, setActiveIndex] = useState(-1);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const setInputRef = useMergedRefs(inputRef, ref);
    const barRef = useRef<HTMLDivElement | null>(null);
    const searchButtonRef = useRef<HTMLButtonElement | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    // Opciones de todas las secciones en el orden del recorrido con flechas
    const flat: SearchInputFlatOption[] = [];
    const sections: SearchInputPanelSection[] = [];
    for (const section of SECTIONS) {
      const items = suggestions?.[section] ?? [];
      if (!items.length) continue;
      const options = items.map(normalize).map((o, i) => {
        const opt = { ...o, section, id: `${ids.control}-${section}-${i}`, index: flat.length };
        flat.push(opt);
        return opt;
      });
      const onClear = section === 'recent' ? onClearRecent : section === 'popular' ? onClearPopular : undefined;
      sections.push({
        section,
        listId: `${ids.control}-${section}`,
        titleId: `${ids.control}-${section}-title`,
        title: section === 'recent' ? labels.recent : section === 'popular' ? labels.popular : undefined,
        listLabel: section === 'keywords' ? labels.suggestions : undefined,
        options,
        clear: onClear ? { label: section === 'recent' ? labels.clearRecent : labels.clearPopular, onClear } : undefined,
      });
    }

    // `state="active"` (documentación): panel abierto en el flujo, sin capa superior
    const isInline = state === 'active' && !isDisabled && flat.length > 0;
    const open = isInline || (openValue && flat.length > 0 && !isDisabled && !isReadOnly);

    const isHelper = !isDisabled && !isError && !field.isSuccess && !isReadOnly && (state === 'helper' || Boolean(helperText));
    const visualState: Exclude<SearchInputState, 'filled'> = isDisabled
      ? 'disabled'
      : isError
        ? 'error'
        : field.isSuccess
          ? 'success'
          : isReadOnly
            ? 'burnt-in'
            : isHelper
              ? 'helper'
              : open || state === 'active'
                ? 'active'
                : 'default';

    const setOpen = (next: boolean) => {
      if (next !== openValue) setOpenValue(next);
      if (!next) setActiveIndex(-1);
    };

    // Si cambian las sugerencias, la opción activa deja de valer (por contenido: un objeto nuevo con lo mismo no cuenta)
    const signature = flat.map((o) => `${o.section}:${o.value}`).join('\n');
    const [prevSignature, setPrevSignature] = useState(signature);
    if (prevSignature !== signature) {
      setPrevSignature(signature);
      setActiveIndex(-1);
    }

    const search = (text: string) => onSearch?.(text, hasCategories ? category : undefined);

    const choose = (option: SearchInputFlatOption) => {
      if (isInline) return;
      setQuery(option.value);
      setOpen(false);
      onSuggestionSelect?.(option.value, option.section);
      search(option.value);
    };

    const canOpen = !isDisabled && !isReadOnly && flat.length > 0;

    // Recorrido cíclico: texto (-1) → opciones → texto
    const move = (delta: number) => {
      const total = flat.length + 1;
      setActiveIndex((current) => ((current + 1 + delta + total) % total) - 1);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || isInline) return;
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp': {
          if (!canOpen) return;
          event.preventDefault();
          if (!open) {
            setOpen(true);
            // Alt + Flecha abajo solo abre; Flecha abajo/arriba abren en la primera o la última
            if (!event.altKey) setActiveIndex(event.key === 'ArrowDown' ? 0 : flat.length - 1);
          } else if (event.altKey && event.key === 'ArrowUp') setOpen(false);
          else move(event.key === 'ArrowDown' ? 1 : -1);
          return;
        }
        case 'Enter': {
          if (event.nativeEvent.isComposing) return;
          if (open && activeIndex >= 0 && flat[activeIndex]) {
            event.preventDefault();
            choose(flat[activeIndex]);
            return;
          }
          if (isReadOnly) return;
          setOpen(false);
          search(query);
          return;
        }
        case 'Escape': {
          if (open) {
            event.preventDefault();
            // Un overlay padre que escuche Esc no debe cerrarse junto con el panel
            event.stopPropagation();
            setOpen(false);
          } else if (query && !isReadOnly) {
            event.preventDefault();
            setQuery('');
          }
          return;
        }
        default:
          break;
      }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      setQuery(event.target.value);
      setActiveIndex(-1);
      if (canOpen) setOpen(true);
    };

    // El foco en cualquier otra parte (selector de categoría y su menú) cierra el panel
    const handleRootFocus = (event: FocusEvent<HTMLDivElement>) => {
      const target = event.target as Node;
      const keepsOpen =
        target === inputRef.current || target === searchButtonRef.current || Boolean(popoverRef.current?.contains(target));
      if (!keepsOpen && openValue) setOpen(false);
    };

    const handleRootBlur = (event: FocusEvent<HTMLDivElement>) => {
      const next = event.relatedTarget as Node | null;
      if (!next || !event.currentTarget.contains(next)) {
        if (openValue) setOpen(false);
      }
    };

    // Abierto -> capa superior (oculto hasta colocarlo)
    useLayoutEffect(() => {
      const pop = popoverRef.current;
      if (!pop || typeof pop.showPopover !== 'function') return;
      const showing = pop.matches(':popover-open');
      const wantsLayer = open && !isInline;
      if (wantsLayer && !showing) {
        pop.style.visibility = 'hidden';
        pop.showPopover();
      } else if (!wantsLayer && showing) pop.hidePopover();
    }, [open, isInline]);

    const getAnchor = useCallback(() => barRef.current, []);
    useAnchoredPosition(open && !isInline, popoverRef, getAnchor, { offset: OFFSET, matchWidth: true, observeSize: true });

    const activeId = open && !isInline && activeIndex >= 0 ? flat[activeIndex]?.id : undefined;
    const listIds = sections.map((s) => s.listId).join(' ') || undefined;

    const panel = (
      <SearchInputPanel
        sections={sections}
        activeIndex={isInline ? -1 : activeIndex}
        onChoose={choose}
        onClear={(clear) => {
          // La papelera puede desaparecer con su sección: el foco vuelve antes al campo
          inputRef.current?.focus();
          clear();
        }}
      />
    );

    return (
      <div
        {...rootProps}
        onFocus={(e) => {
          rootProps?.onFocus?.(e);
          handleRootFocus(e);
        }}
        onBlur={(e) => {
          rootProps?.onBlur?.(e);
          handleRootBlur(e);
        }}
        className={cn(
          // Figma: 4 hasta el mensaje; 8 hasta el panel en Active/Focus (en el flujo solo en documentación)
          'flex w-full min-w-0 flex-col gap-ds-space-general-md',
          isInline && 'gap-ds-space-general-lg',
          rootProps?.className,
          className
        )}
      >
        <div className="relative">
          <div ref={barRef} data-figma-part="Input" className={searchInputBarVariants({ state: visualState })}>
            {hasCategories && (
              <>
                <DropdownMenu
                  align="start"
                  anchorRef={barRef}
                  offset={OFFSET}
                  aria-label={labels.category}
                  trigger={(triggerProps) => (
                    <button
                      {...triggerProps}
                      ref={triggerProps.ref as Ref<HTMLButtonElement>}
                      type="button"
                      disabled={isDisabled || isReadOnly}
                      aria-label={`${labels.category}: ${currentCategory?.label ?? ''}`}
                      data-figma-part="Box Area"
                      className={searchInputCategoryClass}
                    >
                      <span data-figma-part="Label" className="truncate">
                        {currentCategory?.label}
                      </span>
                      <Icon
                        name="chevron-down"
                        size={16}
                        variant="line"
                        aria-hidden="true"
                        data-figma-part="Icon Left"
                        className="size-4 shrink-0 text-(color:--sb-icon)"
                      />
                    </button>
                  )}
                >
                  {categories!.map((c) => (
                    <DropdownMenuItem
                      key={c.value}
                      selected={c.value === category}
                      disabled={c.disabled}
                      onSelect={() => {
                        if (c.value !== category) setCategory(c.value);
                      }}
                    >
                      {c.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenu>
                <span aria-hidden="true" data-figma-part="Line 1" className={searchInputDividerClass} />
              </>
            )}

            <div data-figma-part="Field" className="flex h-10 min-w-0 flex-1 items-center">
              <label htmlFor={ids.control} className="sr-only">
                {label}
              </label>
              <input
                ref={setInputRef}
                id={ids.control}
                type="search"
                role="combobox"
                autoComplete="off"
                enterKeyHint="search"
                placeholder={placeholder}
                disabled={isDisabled}
                readOnly={isReadOnly}
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-autocomplete="list"
                aria-controls={listIds}
                aria-activedescendant={activeId}
                aria-invalid={isError || undefined}
                aria-describedby={field.describedBy(ariaDescribedBy)}
                data-figma-part="Placeholder"
                className={searchInputControlClass}
                {...restProps}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={(e) => {
                  onFocus?.(e);
                  if (canOpen) setOpen(true);
                }}
                onClick={(e) => {
                  onClick?.(e);
                  if (canOpen && !open) setOpen(true);
                }}
              />
            </div>

            <Button
              ref={searchButtonRef}
              variant="tertiary"
              size="xs"
              iconOnly
              aria-label={labels.search}
              disabled={isDisabled || isReadOnly}
              data-figma-part="Button"
              onClick={() => {
                setOpen(false);
                search(query);
              }}
            >
              <Icon name="search" size={20} variant="fill" data-figma-part="Icon-sizes" />
            </Button>
          </div>

          {isInline ? (
            <div className="absolute inset-x-0 top-full z-10 mt-ds-space-general-lg">{panel}</div>
          ) : (
            <div ref={popoverRef} popover="manual" className={`${TOP_LAYER_CLASS} ${TOP_LAYER_MAX_WIDTH}`}>
              {panel}
            </div>
          )}
        </div>

        <FieldMessage id={ids.message} message={message} />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
