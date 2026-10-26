import { Children, forwardRef, isValidElement, useMemo, useState } from 'react';
import type { KeyboardEvent, MouseEventHandler, ReactElement } from 'react';
import type { ChipGroupProps, ChipProps } from './Chip.types';
import { ChipGroupContext } from './Chip.context';
import type { ChipGroupContextValue } from './Chip.context';
import { ChipPlus } from './ChipPlus';
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu';
import { cn } from '../../utils/cn';

/**
 * Grupo de chips con selección y desbordamiento.
 * - `selectionMode="single"`: `role="radiogroup"`; los chips son `role="radio"`, con una sola parada de tabulación;
 *   las flechas mueven el foco y seleccionan (patrón APG Radio Group).
 * - `selectionMode="multiple"`: `role="toolbar"` de botones de alternancia (`aria-pressed`), patrón APG Toolbar: una
 *   parada de tabulación y las flechas, Inicio y Fin mueven el foco.
 * - `selectionMode="none"` (por defecto): `role="group"` de chips independientes (cada uno con su `onClick`/`onRemove`).
 * - Quitar: Supr o Retroceso sobre el chip (en `single`/`multiple` el botón Quitar no es parada de tabulación). El foco
 *   pasa al chip vecino; si era el último, al "+N" o al propio grupo.
 * Con `max`, los chips sobrantes se resumen en un "+N" ("Chips plus") que abre una lista: casillas en `multiple`,
 * radios en `single` y, en `none`, texto (o ítems de menú con la acción del chip si la tienen; los chips con
 * `onRemove` no se ocultan). Los chips deben ser hijos directos con `value` único.
 */
export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(function ChipGroup(
  {
    children,
    selectionMode = 'none',
    value,
    defaultValue,
    onValueChange,
    max,
    overflowLabel,
    overflowMenuLabel = 'Más opciones',
    className,
    onKeyDown,
    ...rest
  },
  ref
) {
  const [innerValue, setInnerValue] = useState<string[]>(defaultValue ?? []);
  const [focusValue, setFocusValue] = useState<string>();
  const [menuOpen, setMenuOpen] = useState(false);
  const selected = value ?? innerValue;

  const items = Children.toArray(children).filter(isValidElement) as ReactElement<ChipProps>[];
  // En `none`, un chip con `onRemove` no se oculta: su botón de quitar no tiene equivalente en la lista
  const keep = (el: ReactElement<ChipProps>, i: number) =>
    max === undefined || i < Math.max(0, max) || (selectionMode === 'none' && el.props.onRemove !== undefined);
  const visible = items.filter(keep);
  const hidden = items.filter((el, i) => !keep(el, i));
  // En `none` la lista es informativa salvo que algún chip oculto tenga acción
  const hiddenActions = selectionMode === 'none' && hidden.some((el) => typeof el.props.onClick === 'function');

  const select = (next: string[]) => {
    if (value === undefined) setInnerValue(next);
    onValueChange?.(next);
  };

  const enabled = visible.filter((el) => !el.props.disabled && el.props.value !== undefined).map((el) => el.props.value as string);
  const tabValue =
    selectionMode === 'none'
      ? undefined
      : focusValue !== undefined && enabled.includes(focusValue)
        ? focusValue
        : (enabled.find((v) => selected.includes(v)) ?? enabled[0]);

  const context = useMemo<ChipGroupContextValue>(
    () => ({
      mode: selectionMode,
      isSelected: (v) => selected.includes(v),
      toggle: (v) => {
        if (selectionMode === 'single') select([v]);
        else select(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
      },
      tabValue,
      setFocusValue,
      focusNeighbor: (root) => {
        const group = root?.closest<HTMLElement>('[data-chip-group]');
        if (!root || !group) return;
        // Parada de foco de cada chip: el cuerpo si es botón; si no, su botón de quitar
        const stop = (r: Element) =>
          [r.querySelector<HTMLButtonElement>('button[data-chip-body]'), r.querySelector<HTMLButtonElement>('button[data-chip-close]')].find(
            (b) => b && !b.disabled
          );
        const roots = Array.from(group.querySelectorAll('[data-chip-root]')).filter((r) => stop(r));
        const i = roots.indexOf(root);
        const target = roots[i + 1] ?? roots[i - 1];
        if (target) {
          stop(target)?.focus();
          return;
        }
        // Era el último: el foco va al grupo (el lector lo anuncia) en vez de perderse en `body`
        const next = group.querySelector<HTMLElement>('[aria-haspopup]') ?? group;
        if (next === group) {
          group.tabIndex = -1;
          group.addEventListener('blur', () => group.removeAttribute('tabindex'), { once: true });
        }
        next.focus();
      },
    }),
    // select cambia con value/innerValue, que ya están en selected
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectionMode, selected, tabValue, onValueChange, value]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || selectionMode === 'none') return;
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const target = event.target as HTMLElement;
    if (!target.matches('[data-chip-body]')) return;
    const bodies = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-chip-body]')).filter(
      (b) => !b.disabled
    );
    const i = bodies.indexOf(target as HTMLButtonElement);
    if (i < 0) return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? bodies.length - 1
          : event.key === 'ArrowRight' || event.key === 'ArrowDown'
            ? (i + 1) % bodies.length
            : (i - 1 + bodies.length) % bodies.length;
    bodies[next].focus();
    // Radio Group: las flechas seleccionan lo que enfocan
    if (selectionMode === 'single') bodies[next].click();
  };

  return (
    <ChipGroupContext value={context}>
      <div
        role={selectionMode === 'single' ? 'radiogroup' : selectionMode === 'multiple' ? 'toolbar' : 'group'}
        {...rest}
        ref={ref}
        data-chip-group=""
        onKeyDown={handleKeyDown}
        className={cn(
          'flex flex-wrap items-center gap-ds-gap-button-internal-margin-lg',
          // Solo recibe el foco al quitar el último chip
          'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-border-field-active',
          className
        )}
      >
        {visible}
        {hidden.length > 0 && (
          <DropdownMenu
            mode={selectionMode === 'none' && !hiddenActions ? 'list' : 'menu'}
            aria-label={overflowMenuLabel}
            onOpenChange={setMenuOpen}
            trigger={
              <ChipPlus
                count={hidden.length}
                state={menuOpen ? 'select' : 'default'}
                label={overflowLabel?.(hidden.length)}
              />
            }
          >
            {hidden.map((el, i) => {
              const { value: v, children: text, disabled, onClick } = el.props;
              const itemType = selectionMode === 'multiple' ? 'checkbox' : selectionMode === 'single' ? 'radio' : 'simple';
              return (
                <DropdownMenuItem
                  key={el.key ?? v ?? i}
                  type={itemType}
                  disabled={disabled}
                  // En `none`, la acción del chip pasa al ítem
                  onClick={itemType === 'simple' ? (onClick as MouseEventHandler<HTMLElement> | undefined) : undefined}
                  {...(itemType === 'simple' || v === undefined
                    ? {}
                    : { checked: selected.includes(v), onCheckedChange: () => context.toggle(v) })}
                >
                  {text}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenu>
        )}
      </div>
    </ChipGroupContext>
  );
});

ChipGroup.displayName = 'ChipGroup';
