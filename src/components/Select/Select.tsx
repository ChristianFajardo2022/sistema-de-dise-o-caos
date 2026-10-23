import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { SelectOptionData, SelectOptionProps, SelectProps } from './Select.types';
import { selectFrameVariants, selectOptionActiveClass, selectTriggerVariants } from './Select.variants';
import type { InputState } from '../Input/Input.types';
import { inputControlVariants, inputFieldVariants, inputLabelVariants } from '../Input/Input.variants';
import {
  dropdownMenuItemIconVariants,
  dropdownMenuItemTextVariants,
  dropdownMenuItemVariants,
  dropdownMenuPanelVariants,
  dropdownMenuScrollVariants,
} from '../DropdownMenu/DropdownMenu.variants';
import type { DropdownMenuItemState } from '../DropdownMenu/DropdownMenu.types';
import { Icon } from '../Icon';
import { NotificationText } from '../NotificationText';
import { ScrollArea } from '../ScrollArea';
import { cn } from '../../utils/cn';

/** Separación campo → lista (8, como Figma) y margen mínimo con el borde de la pantalla. */
const OFFSET = 8;
const MARGIN = 8;
const TYPEAHEAD_RESET_MS = 500;
const PAGE_STEP = 10;

const ICON_SLOT = 'inline-flex size-4 shrink-0 items-center justify-center text-(color:--ico)';
const FOCUS_RING =
  'outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active';

/**
 * Opción declarativa de `Select`. No pinta nada por sí sola: `Select` lee sus props.
 * `<SelectOption value="co">Colombia</SelectOption>`
 */
export function SelectOption(props: SelectOptionProps): null {
  void props;
  return null;
}
SelectOption.displayName = 'SelectOption';

function collectOptions(children: ReactNode, options: SelectOptionData[] = []): SelectOptionData[] {
  const fromChildren: SelectOptionData[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<SelectOptionProps>(child) && child.type === SelectOption) {
      const { value, children: text, disabled, icon } = child.props;
      fromChildren.push({ value, label: String(text), disabled, icon });
    }
  });
  return [...fromChildren, ...options];
}

/**
 * Select del sistema de diseño CAOS: Type=Dropdown de "General input". Patrón WAI-ARIA APG Select-Only Combobox:
 * `<button role="combobox">` con `aria-activedescendant` sobre un `listbox` de `option` (el foco no sale del botón).
 *
 * Teclado. Cerrado: Flecha abajo/arriba, Alt + Flecha abajo, Enter y Espacio abren en la opción elegida (o la primera);
 * Inicio y Fin abren en la primera o la última; escribir abre y salta a la opción que empieza así.
 * Abierto: flechas (sin dar la vuelta), Inicio, Fin, Re Pág / Av Pág (10), escribir para saltar; Enter, Espacio y
 * Alt + Flecha arriba eligen y cierran; Tab elige y deja seguir el foco; Esc cierra sin cambiar.
 *
 * La lista va en la capa superior (atributo `popover`), alineada al campo (o a `anchorRef`) y con su ancho; si abajo no
 * cabe, se abre arriba. El `ref` apunta al botón combobox (para enfocar, como el `<input>` de Input);
 * `className` y el resto de props van al elemento raíz.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      optional = false,
      placeholder,
      tooltip,
      helperText,
      errorText,
      successText,
      options,
      children,
      value: valueProp,
      defaultValue,
      onValueChange,
      onOpenChange,
      name,
      id,
      disabled = false,
      readOnly = false,
      required = false,
      fullWidth = false,
      state = 'default',
      frame = 'field',
      anchorRef,
      scrollbar = true,
      maxHeight = '20rem',
      className,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const uid = useId();
    const triggerId = id ?? `${uid}-combobox`;
    const labelId = `${uid}-label`;
    const listboxId = `${uid}-listbox`;
    const messageId = `${uid}-message`;
    const tooltipId = `${uid}-tooltip`;
    const optionId = (index: number) => `${uid}-option-${index}`;

    const items = useMemo(() => collectOptions(children, options), [children, options]);

    const [innerValue, setInnerValue] = useState<string | null>(defaultValue ?? null);
    const value = valueProp !== undefined ? valueProp : innerValue;
    const selectedIndex = items.findIndex((o) => o.value === value);
    const selected = selectedIndex >= 0 ? items[selectedIndex] : undefined;

    const [openState, setOpenState] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [focused, setFocused] = useState(false);

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const fieldRef = useRef<HTMLDivElement | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const typeaheadRef = useRef({ text: '', timer: 0 });

    const isDisabled = disabled || state === 'disabled';
    const isReadOnly = readOnly || state === 'burnt-in';
    const isError = Boolean(errorText) || state === 'error';
    const isSuccess = !isError && (Boolean(successText) || state === 'success');
    // `state="active"` (documentación): lista abierta en el flujo, sin capa superior
    const isInlineOpen = state === 'active' && !isDisabled;
    const open = isInlineOpen || (openState && !isDisabled && !isReadOnly);

    // Prioridad visual: disabled > error > success > burnt-in (readOnly) > state forzado; con foco o abierta, active
    const computedState: InputState = isDisabled
      ? 'disabled'
      : isError
        ? 'error'
        : isSuccess
          ? 'success'
          : isReadOnly
            ? 'burnt-in'
            : open
              ? 'active'
              : state;

    const hasValue = selected !== undefined;
    const forcedFloat = ['filled', 'active', 'burnt-in', 'error', 'success'].includes(state);
    const floated = hasValue || (!isDisabled && (focused || open || isReadOnly || forcedFloat));

    const message = errorText
      ? { kind: 'error' as const, text: errorText }
      : successText
        ? { kind: 'success' as const, text: successText }
        : helperText
          ? { kind: 'helper' as const, text: helperText }
          : null;
    const isField = frame === 'field';

    const setTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const enabledIndexes = useMemo(() => items.flatMap((o, i) => (o.disabled ? [] : [i])), [items]);
    const firstEnabled = enabledIndexes[0] ?? -1;
    const lastEnabled = enabledIndexes[enabledIndexes.length - 1] ?? -1;

    const setOpen = (next: boolean) => {
      if (next === openState) return;
      setOpenState(next);
      onOpenChange?.(next);
    };

    const openAt = (index: number) => {
      if (isDisabled || isReadOnly) return;
      setActiveIndex(index);
      setOpen(true);
    };

    const close = () => {
      setOpen(false);
      typeaheadRef.current.text = '';
    };

    const commit = (index: number) => {
      const option = items[index];
      if (!option || option.disabled) return;
      if (option.value !== value) {
        if (valueProp === undefined) setInnerValue(option.value);
        onValueChange?.(option.value);
      }
    };

    const defaultActive = () => (selected && !selected.disabled ? selectedIndex : firstEnabled);

    // Paso entre opciones habilitadas, sin dar la vuelta (APG)
    const step = (from: number, delta: number) => {
      if (!enabledIndexes.length) return -1;
      const pos = enabledIndexes.indexOf(from);
      if (pos < 0) return delta > 0 ? firstEnabled : lastEnabled;
      return enabledIndexes[Math.max(0, Math.min(enabledIndexes.length - 1, pos + delta))];
    };

    const typeahead = (key: string, from: number) => {
      const t = typeaheadRef.current;
      window.clearTimeout(t.timer);
      t.text += key.toLowerCase();
      t.timer = window.setTimeout(() => (t.text = ''), TYPEAHEAD_RESET_MS);
      // La misma letra repetida recorre las opciones que empiezan por ella
      const repeated = t.text.length > 1 && [...t.text].every((c) => c === t.text[0]);
      const query = repeated ? t.text[0] : t.text;
      const start = repeated || t.text.length === 1 ? from + 1 : from;
      const order = [...enabledIndexes.filter((i) => i >= start), ...enabledIndexes.filter((i) => i < start)];
      return order.find((i) => items[i].label.toLowerCase().startsWith(query)) ?? -1;
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      const { key, altKey, ctrlKey, metaKey } = event;
      const printable = key.length === 1 && !ctrlKey && !metaKey && !altKey;
      if (isInlineOpen) return;

      if (!open) {
        if (isReadOnly) return;
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
          event.preventDefault();
          openAt(defaultActive());
        } else if (key === 'Home' || key === 'End') {
          event.preventDefault();
          openAt(key === 'Home' ? firstEnabled : lastEnabled);
        } else if (printable) {
          event.preventDefault();
          const found = typeahead(key, selectedIndex);
          openAt(found >= 0 ? found : defaultActive());
        }
        return;
      }

      switch (key) {
        case 'Escape':
          event.preventDefault();
          // Un overlay padre que escuche Esc en document no debe cerrarse junto con la lista
          event.stopPropagation();
          close();
          return;
        case 'Tab':
          // Sin preventDefault: elige y el foco sigue su camino
          commit(activeIndex);
          close();
          return;
        case 'Enter':
          event.preventDefault();
          commit(activeIndex);
          close();
          return;
        case 'ArrowUp':
          event.preventDefault();
          if (altKey) {
            commit(activeIndex);
            close();
          } else setActiveIndex(step(activeIndex, -1));
          return;
        case 'ArrowDown':
          event.preventDefault();
          if (!altKey) setActiveIndex(step(activeIndex, 1));
          return;
        case 'Home':
          event.preventDefault();
          setActiveIndex(firstEnabled);
          return;
        case 'End':
          event.preventDefault();
          setActiveIndex(lastEnabled);
          return;
        case 'PageUp':
          event.preventDefault();
          setActiveIndex(step(activeIndex, -PAGE_STEP));
          return;
        case 'PageDown':
          event.preventDefault();
          setActiveIndex(step(activeIndex, PAGE_STEP));
          return;
        default:
          break;
      }
      if (key === ' ' && !typeaheadRef.current.text) {
        event.preventDefault();
        commit(activeIndex);
        close();
        return;
      }
      if (printable) {
        event.preventDefault();
        const found = typeahead(key, activeIndex);
        if (found >= 0) setActiveIndex(found);
      }
    };

    // Puntero en cualquier parte del campo (padding y chevron incluidos): enfoca el botón y abre o cierra
    const handleFieldMouseDown = (event: MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0 || isDisabled || isInlineOpen) return;
      event.preventDefault();
      triggerRef.current?.focus();
      if (isReadOnly) return;
      if (open) close();
      else openAt(defaultActive());
    };

    // Activación sin puntero (lectores de pantalla): el clic llega con detail 0. El de ratón ya se resolvió en mousedown
    const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (event.detail !== 0 || isInlineOpen || isReadOnly) return;
      if (open) close();
      else openAt(defaultActive());
    };

    const place = useCallback(() => {
      const pop = popoverRef.current;
      const anchor = anchorRef?.current ?? fieldRef.current;
      if (!pop || !anchor || !pop.matches(':popover-open')) return;
      const a = anchor.getBoundingClientRect();
      pop.style.width = `${a.width}px`;
      const { height } = pop.getBoundingClientRect();
      const below = a.bottom + OFFSET;
      const above = a.top - OFFSET - height;
      const fitsBelow = below + height <= window.innerHeight - MARGIN;
      pop.style.left = `${a.left}px`;
      pop.style.top = `${fitsBelow || above < MARGIN ? below : above}px`;
      pop.style.visibility = '';
    }, [anchorRef]);

    // Abierto -> capa superior; mientras esté abierto, seguir al campo
    useLayoutEffect(() => {
      const pop = popoverRef.current;
      if (!pop || typeof pop.showPopover !== 'function') return;
      const showing = pop.matches(':popover-open');
      if (open && !isInlineOpen && !showing) {
        pop.style.visibility = 'hidden';
        pop.showPopover();
        place();
      } else if ((!open || isInlineOpen) && showing) pop.hidePopover();
      if (!open || isInlineOpen) return;
      const onMove = () => place();
      window.addEventListener('resize', onMove);
      window.addEventListener('scroll', onMove, true);
      return () => {
        window.removeEventListener('resize', onMove);
        window.removeEventListener('scroll', onMove, true);
      };
    }, [open, isInlineOpen, place]);

    // La opción activa siempre a la vista dentro de la lista
    useEffect(() => {
      if (!open || activeIndex < 0) return;
      listRef.current?.querySelector(`[id="${uid}-option-${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
    }, [open, activeIndex, uid]);

    useEffect(() => () => window.clearTimeout(typeaheadRef.current.timer), []);

    const listbox = (
      <div
        data-figma-part="Dropdown"
        // El foco se queda en el combobox al pulsar opciones o el riel
        onMouseDown={(e) => e.preventDefault()}
        className={cn(dropdownMenuPanelVariants({ type: 'simple' }), 'w-full')}
      >
        <ScrollArea
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          // ScrollArea exige aria-label; el listbox se nombra con aria-labelledby, que tiene prioridad
          aria-label={label}
          aria-labelledby={labelId}
          maxHeight={maxHeight}
          data-figma-part="Check List"
          className={dropdownMenuScrollVariants({ type: 'simple', scrollbar, list: false })}
        >
          {items.map((option, index) => {
            const isSelected = index === selectedIndex;
            const isActive = !isInlineOpen && index === activeIndex;
            const itemState: DropdownMenuItemState = option.disabled
              ? 'disabled'
              : isSelected
                ? 'select'
                : isActive
                  ? 'hover'
                  : 'default';
            return (
              <div
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                data-item-type={option.icon ? 'icon' : 'simple'}
                data-figma-part="Dropdown list"
                onMouseMove={() => !option.disabled && !isInlineOpen && activeIndex !== index && setActiveIndex(index)}
                onClick={() => {
                  if (option.disabled || isInlineOpen) return;
                  commit(index);
                  close();
                }}
                className={cn(dropdownMenuItemVariants({ state: itemState }), isActive && selectOptionActiveClass)}
              >
                {option.icon && (
                  <Icon
                    name={option.icon}
                    size={16}
                    variant="fill"
                    aria-hidden="true"
                    data-figma-part="Icon-sizes"
                    className={dropdownMenuItemIconVariants({ disabled: Boolean(option.disabled) })}
                  />
                )}
                <span data-figma-part="Text item" className={dropdownMenuItemTextVariants()}>
                  {option.label}
                </span>
              </div>
            );
          })}
        </ScrollArea>
      </div>
    );

    const trigger = (
      <div
        ref={fieldRef}
        data-figma-part={isField ? 'Input' : 'Text field'}
        onMouseDown={handleFieldMouseDown}
        className={cn(
          inputFieldVariants({ variant: 'text', state: computedState }),
          selectFrameVariants({
            frame,
            burntIn: computedState === 'burnt-in',
            focusRing: isField && (computedState === 'error' || computedState === 'success'),
            disabled: isDisabled,
          })
        )}
      >
        <div className="relative h-10 min-w-0 flex-1">
          <button
            ref={setTriggerRef}
            id={triggerId}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={open && !isInlineOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
            aria-labelledby={labelId}
            aria-describedby={cn(isField && message && messageId, isField && tooltip && tooltipId, ariaDescribedBy) || undefined}
            aria-invalid={isError || undefined}
            aria-required={required || undefined}
            aria-readonly={isReadOnly || undefined}
            disabled={isDisabled}
            onKeyDown={handleKeyDown}
            onClick={handleTriggerClick}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              if (openState) close();
            }}
            className={cn(inputControlVariants(), selectTriggerVariants({ readOnly: isReadOnly }))}
          >
            <span data-figma-part="Placeholder" className={cn('block truncate', !hasValue && !floated && 'invisible')}>
              {selected ? selected.label : placeholder}
            </span>
          </button>
          {/* Valor para el formulario y "peer" del label: vacío = :placeholder-shown, el label descansa dentro */}
          <input hidden readOnly tabIndex={-1} name={name} value={value ?? ''} placeholder=" " disabled={isDisabled} className="peer" />
          {/* Mide el label flotante para que un contenedor con ancho automático (p. ej. el prefijo de PhoneInput) no lo corte */}
          <span aria-hidden="true" className="invisible block h-0 overflow-hidden whitespace-nowrap text-ds-typography-field-size-xs">
            {label}
            {optional && ' | Opcional'}
          </span>
          <label id={labelId} htmlFor={triggerId} data-figma-part="Label" className={inputLabelVariants({ float: floated ? 'always' : 'auto' })}>
            {label}
            {optional && <span data-figma-part="| Opcional" className="text-ds-text-acent-firts"> | Opcional</span>}
          </label>
        </div>
        <span data-figma-part="Icon Right" aria-hidden="true" className={ICON_SLOT}>
          <Icon name="chevron-down" size={16} variant="line" />
        </span>
      </div>
    );

    return (
      <div
        {...restProps}
        className={cn(
          'flex min-w-0 flex-col gap-ds-space-general-lg',
          isField && (fullWidth ? 'w-full' : 'w-80 max-w-full'),
          className
        )}
      >
        {isField ? (
          <div className="flex items-center gap-ds-space-general-lg">
            {trigger}
            {tooltip && (
              <>
                <span id={tooltipId} className="sr-only">
                  {tooltip}
                </span>
                <button
                  type="button"
                  aria-label={tooltip}
                  title={tooltip}
                  className={cn(
                    ICON_SLOT,
                    'cursor-help rounded-sm border-0 bg-transparent p-0',
                    FOCUS_RING,
                    isDisabled ? '[--ico:var(--color-ds-icon-general-disabled-positive)]' : '[--ico:var(--color-ds-icon-general-white)]'
                  )}
                >
                  <Icon name="info-circle" size={16} variant="fill" />
                </button>
              </>
            )}
          </div>
        ) : (
          trigger
        )}

        {isInlineOpen ? (
          listbox
        ) : (
          <div
            ref={popoverRef}
            popover="manual"
            className="m-0 max-w-[calc(100vw-2*0.5rem)] overflow-visible border-0 bg-transparent p-0 [inset:auto]"
          >
            {listbox}
          </div>
        )}

        {isField && (
          // Región viva siempre montada; vacía no ocupa sitio ni suma gap
          <div aria-live="polite" className="empty:absolute">
            {message && (
              <NotificationText id={messageId} state={message.kind === 'success' ? 'confirmation' : message.kind} announce={false}>
                {message.text}
              </NotificationText>
            )}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
