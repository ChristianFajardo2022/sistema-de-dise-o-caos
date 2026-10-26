import { cloneElement, forwardRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { ChipProps } from './Chip.types';
import { useChipGroup } from './Chip.context';
import {
  chipBodyVariants,
  chipCloseVariants,
  chipDotVariants,
  chipTextVariants,
  chipVariants,
} from './Chip.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Chip: etiqueta compacta con texto, adorno a la izquierda (ícono, avatar o punto de color) y botón de quitar.
 * - Sin `onClick` ni selección: el cuerpo es un `<span>` (chip informativo, como un valor de entrada).
 * - Con `onClick`: `<button>` de acción. Con `selected`/`defaultSelected`/`onSelectedChange`: botón de alternancia
 *   (`aria-pressed`). Dentro de un `ChipGroup` con selección única es un `role="radio"` (`aria-checked`).
 * - Quitar es un botón aparte "Quitar <texto>" (no anidado en el cuerpo); Supr o Retroceso sobre el cuerpo hacen lo mismo.
 * - Interactivo: toda la cápsula (con su padding) es el área de clic del cuerpo; Quitar queda encima, con 24 de área.
 * Hover, foco y selección salen de CSS y del estado; `state` solo fuerza el aspecto en documentación.
 * `ref` y las props nativas van al cuerpo; `className` y `rootProps` a la cápsula.
 */
export const Chip = forwardRef<HTMLElement, ChipProps>(function Chip(props, ref) {
  const {
    type = 'primary',
    children,
    label,
    icon = true,
    iconName = 'clock',
    avatar,
    color = 'purple',
    colorLabel,
    close,
    onRemove,
    removeLabel,
    value,
    selected: selectedProp,
    defaultSelected,
    onSelectedChange,
    state: forcedState,
    disabled = false,
    className,
    rootProps,
    onClick,
    onKeyDown,
    onFocus,
    tabIndex,
    ...rest
  } = props;

  const group = useChipGroup();
  const inGroup = group !== null && group.mode !== 'none' && value !== undefined;
  const [innerSelected, setInnerSelected] = useState(defaultSelected ?? false);
  const standaloneSelectable =
    !inGroup && (selectedProp !== undefined || defaultSelected !== undefined || onSelectedChange !== undefined);
  const selectable = inGroup || standaloneSelectable;
  const selected = inGroup ? group.isSelected(value) : (selectedProp ?? innerSelected);
  const interactive = selectable || typeof onClick === 'function';
  const inactive = disabled || forcedState === 'inactive';
  const state = inactive ? 'inactive' : (forcedState ?? (selected ? 'select' : 'default'));
  const showClose = close ?? onRemove !== undefined;
  const radio = inGroup && group.mode === 'single';
  const roving = inGroup && group.tabValue !== undefined;

  const text = typeof children === 'string' ? children : label;
  const closeLabel = removeLabel ?? (text ? `Quitar ${text}` : 'Quitar');

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || inactive || !selectable) return;
    if (inGroup) group.toggle(value);
    else {
      if (selectedProp === undefined) setInnerSelected(!selected);
      onSelectedChange?.(!selected);
    }
  };

  const remove = (root: Element | null, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
    if (inactive || !onRemove) return;
    group?.focusNeighbor(root);
    onRemove(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !showClose || (event.key !== 'Delete' && event.key !== 'Backspace')) return;
    event.preventDefault();
    remove(event.currentTarget.closest('[data-chip-root]'), event);
  };

  const adornment =
    type === 'primary-avatar' && avatar ? (
      <span aria-hidden="true" data-figma-part="Avatar" className="inline-flex shrink-0">
        {cloneElement(avatar as React.ReactElement<{ size?: string; disabled?: boolean }>, {
          size: 'xs',
          disabled: inactive || (avatar.props as { disabled?: boolean }).disabled,
        })}
      </span>
    ) : type === 'primary-color' ? (
      <>
        <span aria-hidden="true" data-figma-part="Ellipse 1" className={chipDotVariants({ color })} />
        {colorLabel && <span className="sr-only">{colorLabel}: </span>}
      </>
    ) : (type === 'primary' || type === 'primary-box') && icon ? (
      <Icon
        name={iconName}
        size={14}
        variant="fill"
        className="shrink-0 text-(color:--chip-ic)"
        data-figma-part="Icon-sizes"
      />
    ) : null;

  const body = (
    <>
      {adornment}
      <span className={chipTextVariants({ type })} data-figma-part="Text-button">
        <span data-figma-part="Text">{children}</span>
      </span>
    </>
  );

  const bodyClasses = chipBodyVariants({ type, interactive });

  return (
    <span
      {...rootProps}
      data-chip-root=""
      aria-disabled={!interactive && inactive ? true : undefined}
      className={cn(chipVariants({ type, state, interactive }), rootProps?.className, className)}
    >
      {interactive ? (
        <button
          {...rest}
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          data-chip-body=""
          role={radio ? 'radio' : undefined}
          aria-checked={radio ? selected : undefined}
          aria-pressed={selectable && !radio ? selected : undefined}
          disabled={inactive}
          tabIndex={roving ? (group.tabValue === value ? 0 : -1) : tabIndex}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onFocus={(event) => {
            onFocus?.(event);
            if (inGroup) group.setFocusValue(value);
          }}
          className={bodyClasses}
        >
          {body}
        </button>
      ) : (
        <span ref={ref as React.Ref<HTMLSpanElement>} data-chip-body="" className={bodyClasses}>
          {body}
        </span>
      )}
      {showClose && (
        <button
          type="button"
          aria-label={closeLabel}
          disabled={inactive}
          tabIndex={roving ? -1 : undefined}
          data-chip-close=""
          onClick={(event) => remove(event.currentTarget.closest('[data-chip-root]'), event)}
          className={chipCloseVariants({ type })}
          data-figma-part="Close"
        >
          <Icon name="close" size={14} variant="fill" data-figma-part="Icon-sizes" />
        </button>
      )}
    </span>
  );
});

Chip.displayName = 'Chip';
