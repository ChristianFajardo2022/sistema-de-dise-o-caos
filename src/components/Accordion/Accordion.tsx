import { createElement, forwardRef, useCallback, useContext, useId, useMemo } from 'react';
import type { KeyboardEvent } from 'react';
import type { AccordionItemProps, AccordionProps } from './Accordion.types';
import { AccordionContext } from './Accordion.context';
import type { AccordionContextValue } from './Accordion.context';
import {
  accordionDescriptionClass,
  accordionItemVariants,
  accordionPanelInnerVariants,
  accordionPanelVariants,
  accordionShapeClasses,
  accordionSlotClass,
  accordionTitleClass,
  accordionTriggerVariants,
} from './Accordion.variants';
import { useControllableState } from '../../utils/controllableState';
import { Avatar } from '../Avatar';
import { ButtonCorner } from '../ButtonCorner';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

const toArray = (v: string | string[] | undefined): string[] | undefined =>
  v === undefined ? undefined : Array.isArray(v) ? v : v ? [v] : [];

/**
 * Accordion: lista de `AccordionItem`. Patrón WAI-ARIA APG: cada ítem es un encabezado con un botón
 * (`aria-expanded`, `aria-controls`) y un panel `role="region"` con `aria-labelledby`.
 * `type="single"` (por defecto) abre uno a la vez; `type="multiple"`, varios.
 * Controlado (`value`) o no controlado (`defaultValue`), con `onValueChange`.
 * Teclado: Enter y Espacio alternan; flechas arriba/abajo, Inicio y Fin mueven el foco entre encabezados.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
  const {
    type = 'single',
    value,
    defaultValue,
    onValueChange,
    collapsible = true,
    contrast = 'on-card',
    headingLevel = 3,
    children,
    className,
    ...restProps
  } = props;

  const [open, setOpen] = useControllableState<string[]>(toArray(value), toArray(defaultValue) ?? [], (next) => {
    if (type === 'multiple') (onValueChange as ((v: string[]) => void) | undefined)?.(next);
    else (onValueChange as ((v: string) => void) | undefined)?.(next[0] ?? '');
  }, 'Accordion');

  const toggle = useCallback(
    (item: string) => {
      const isOpen = open.includes(item);
      if (type === 'multiple') setOpen(isOpen ? open.filter((v) => v !== item) : [...open, item]);
      else if (isOpen) {
        if (collapsible) setOpen([]);
      } else setOpen([item]);
    },
    [open, setOpen, type, collapsible]
  );

  const context = useMemo<AccordionContextValue>(
    () => ({
      contrast,
      headingLevel,
      canCollapse: type === 'multiple' || collapsible,
      isOpen: (v) => open.includes(v),
      toggle,
    }),
    [contrast, headingLevel, type, collapsible, open, toggle]
  );

  return (
    <AccordionContext.Provider value={context}>
      <div {...restProps} ref={ref} data-accordion-root="" data-figma-part="Accordion" className={cn('w-full', className)}>
        <div className="flex w-full flex-col gap-ds-space-general-lg" data-figma-part="Container">
          {children}
        </div>
      </div>
    </AccordionContext.Provider>
  );
});

Accordion.displayName = 'Accordion';

/** Mueve el foco entre los botones de encabezado del mismo `Accordion` (flechas, Inicio y Fin). */
function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
  const { key } = event;
  if (key !== 'ArrowDown' && key !== 'ArrowUp' && key !== 'Home' && key !== 'End') return;
  const root = event.currentTarget.closest('[data-accordion-root]');
  if (!root) return;
  const triggers = [...root.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]')].filter(
    (el) => el.closest('[data-accordion-root]') === root
  );
  const index = triggers.indexOf(event.currentTarget);
  if (index < 0) return;
  event.preventDefault();
  const last = triggers.length - 1;
  const next =
    key === 'Home' ? 0 : key === 'End' ? last : key === 'ArrowDown' ? (index === last ? 0 : index + 1) : index === 0 ? last : index - 1;
  triggers[next]?.focus();
}

/**
 * AccordionItem: la tarjeta "Card accordion (Atom)" de Figma. Dentro de un `Accordion` lo gobierna el grupo;
 * suelto lleva su propio estado (`open`, `defaultOpen`, `onOpenChange`).
 * El botón del encabezado es el único que entra en el orden de tabulación; el `ButtonCorner` es solo su indicador visual.
 */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    {
      value,
      title,
      description,
      icon = true,
      iconName,
      contrast: contrastProp,
      headingLevel: levelProp,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      children,
      className,
      ...restProps
    },
    ref
  ) => {
    const group = useContext(AccordionContext);
    const autoId = useId();
    const itemValue = value ?? autoId;
    const [ownOpen, setOwnOpen] = useControllableState(openProp, defaultOpen, onOpenChange, 'AccordionItem');
    const open = group ? group.isOpen(itemValue) : ownOpen;
    // Ítem abierto que el grupo no deja cerrar (single con collapsible={false}): sigue enfocable pero deshabilitado
    const locked = Boolean(group) && open && !group?.canCollapse;
    const toggle = () => (group ? group.toggle(itemValue) : setOwnOpen(!ownOpen));

    const contrast = contrastProp ?? group?.contrast ?? 'on-card';
    const level = levelProp ?? group?.headingLevel ?? 3;
    const triggerId = `${autoId}-trigger`;
    const panelId = `${autoId}-panel`;
    const state = open ? 'open' : 'closed';
    const hasDescription = description != null && description !== false && description !== '';

    return (
      <div
        {...restProps}
        ref={ref}
        data-state={state}
        data-figma-part="Card accordion (Atom)"
        className={cn(accordionItemVariants({ contrast, open }), className)}
      >
        <span aria-hidden="true" className={accordionShapeClasses.wrapper} data-figma-part="Canva">
          <span className={accordionShapeClasses.body} />
          <span className={accordionShapeClasses.foot} />
          <span className={accordionShapeClasses.fillet} />
        </span>

        {createElement(
          `h${level}`,
          { className: 'relative z-10 m-0 flex', 'data-figma-part': 'Container' },
          <button
            id={triggerId}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-disabled={locked || undefined}
            data-accordion-trigger=""
            onClick={toggle}
            onKeyDown={handleTriggerKeyDown}
            className={accordionTriggerVariants({ open })}
          >
            <span className="flex min-h-9.5 min-w-0 flex-1 items-center gap-ds-space-general-2xl" data-figma-part="Container">
              {icon && (
                <Avatar variant="icon" size="sm" contrast="on-card" icon={iconName} className="shrink-0" data-figma-part="Avatar" />
              )}
              <span className="flex min-w-0 flex-1 flex-col justify-center" data-figma-part="Container">
                <span className={accordionTitleClass} data-figma-part="Filename">
                  {title}
                </span>
                {hasDescription && (
                  <span className={accordionDescriptionClass} data-figma-part="Status">
                    {description}
                  </span>
                )}
              </span>
            </span>
          </button>
        )}

        <ButtonCorner
          variant="icon"
          size="sm"
          status={contrast}
          aria-label={open ? 'Contraer' : 'Expandir'}
          aria-hidden="true"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggle}
          className="absolute top-0 right-0 z-20"
          data-figma-part="Button corner "
          icon={
            <Icon
              name="chevron-down"
              size={16}
              variant="line"
              className={cn('transition-transform duration-300 motion-reduce:duration-[0.01ms]', open && 'rotate-180')}
              data-figma-part="Icon-sizes"
            />
          }
        />

        <div id={panelId} role="region" aria-labelledby={triggerId} data-state={state} className={accordionPanelVariants({ open })}>
          <div className={accordionPanelInnerVariants({ open })}>
            <div className={accordionSlotClass} data-figma-part="Container">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AccordionItem.displayName = 'AccordionItem';
