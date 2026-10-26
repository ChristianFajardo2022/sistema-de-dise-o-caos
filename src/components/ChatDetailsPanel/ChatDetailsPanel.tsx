import { Children, forwardRef, useId, useState } from 'react';
import type { Ref } from 'react';
import type {
  ChatDetailsGridProps,
  ChatDetailsHeaderProps,
  ChatDetailsLinkProps,
  ChatDetailsPanelProps,
  ChatDetailsProfileProps,
} from './ChatDetailsPanel.types';
import {
  chatDetailsActionsVariants,
  chatDetailsGridVariants,
  chatDetailsHeaderVariants,
  chatDetailsLinkCompactVariants,
  chatDetailsPanelContentVariants,
  chatDetailsPanelToggleVariants,
  chatDetailsPanelVariants,
  chatDetailsProfileDescriptionVariants,
  chatDetailsProfileNameVariants,
  chatDetailsProfileVariants,
} from './ChatDetailsPanel.variants';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ListItem } from '../ListItem';
import { ScrollArea } from '../ScrollArea';
import { cn } from '../../utils/cn';

/**
 * Panel lateral de detalle de la conversación (set "Laterales (Atom)" de Figma, 14894:12557). Es un `<aside>` con
 * nombre. Con `collapsible` dibuja arriba el botón de plegar (con `aria-expanded`); plegado mide 64 de ancho (riel). El
 * contenido se compone con `ChatDetailsHeader`, `ChatDetailsProfile`, `ChatDetailsLink` y `ChatDetailsGrid`.
 */
export const ChatDetailsPanel = forwardRef<HTMLElement, ChatDetailsPanelProps>(
  (
    {
      collapsible = false,
      collapsed: collapsedProp,
      defaultCollapsed = false,
      onCollapsedChange,
      collapseLabel = 'Ocultar detalles',
      expandLabel = 'Mostrar detalles',
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const contentId = useId();
    const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
    const collapsed = collapsedProp ?? innerCollapsed;
    const toggle = () => {
      const next = !collapsed;
      if (collapsedProp === undefined) setInnerCollapsed(next);
      onCollapsedChange?.(next);
    };
    const content = typeof children === 'function' ? children({ collapsed }) : children;

    return (
      <aside
        {...rest}
        ref={ref}
        data-collapsed={collapsed ? '' : undefined}
        className={cn(chatDetailsPanelVariants({ collapsed }), className)}
      >
        {collapsible && (
          <div className={chatDetailsPanelToggleVariants({ collapsed })}>
            <Button
              iconOnly
              variant="secondary"
              size="xs"
              aria-label={collapsed ? expandLabel : collapseLabel}
              aria-expanded={!collapsed}
              aria-controls={contentId}
              onClick={toggle}
              data-figma-part="Button"
              className="[&_[data-slot=icon]]:size-4"
            >
              <Icon name={collapsed ? 'chevron-left' : 'chevron-right'} size={16} variant="fill" data-figma-part="Icon-sizes" />
            </Button>
          </div>
        )}
        <div id={contentId} className={chatDetailsPanelContentVariants()}>
          {content}
        </div>
      </aside>
    );
  }
);

ChatDetailsPanel.displayName = 'ChatDetailsPanel';

/** Encabezado de las vistas de archivos: volver ("Anterior") y acciones a la derecha. */
export const ChatDetailsHeader = forwardRef<HTMLDivElement, ChatDetailsHeaderProps>(
  ({ onBack, backLabel = 'Anterior', backRef, actions, className, ...rest }, ref) => (
    <div {...rest} ref={ref} className={cn(chatDetailsHeaderVariants(), className)}>
      {onBack ? (
        <Button
          ref={backRef}
          variant="tertiary"
          size="xs"
          onClick={onBack}
          leftIcon={<Icon name="chevron-left" size={20} variant="fill" data-figma-part="Icon-sizes" />}
          data-figma-part="Button"
        >
          {backLabel}
        </Button>
      ) : (
        <span />
      )}
      {actions != null && actions !== false && <div className={chatDetailsActionsVariants()}>{actions}</div>}
    </div>
  )
);

ChatDetailsHeader.displayName = 'ChatDetailsHeader';

/** Perfil de la persona (vista Photo de Figma): avatar, nombre y descripción centrados. */
export const ChatDetailsProfile = forwardRef<HTMLDivElement, ChatDetailsProfileProps>(
  ({ avatar, name, description, headingLevel = 2, className, ...rest }, ref) => {
    const Heading = `h${headingLevel}` as const;
    return (
      <div {...rest} ref={ref} className={cn(chatDetailsProfileVariants(), className)}>
        {avatar}
        <div data-figma-part="Info" className="flex w-full flex-col gap-ds-space-general-md">
          <Heading data-figma-part="Heading" className={chatDetailsProfileNameVariants()}>
            {name}
          </Heading>
          {description != null && description !== false && (
            <p data-figma-part="Lorem ipsum dolor sit amet." className={chatDetailsProfileDescriptionVariants()}>
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

ChatDetailsProfile.displayName = 'ChatDetailsProfile';

const noop = () => {};

/**
 * Fila de sección (Documentos, Fotografías): un `ListItem` complex con Avatar icon y la acción "navegar" (el título es
 * un `<button>` —o `<a>` con `href`— estirado sobre la fila, con `chevron-right`), como la instancia "List (Atom)" de
 * Figma. Es un `<li>`: va dentro de un `<ul>`. `compact` deja solo el Avatar icon (riel), un botón con el título como
 * nombre accesible. En los dos modos el `ref` apunta al control (útil para devolverle el foco al volver de la vista).
 */
export const ChatDetailsLink = forwardRef<HTMLElement, ChatDetailsLinkProps>(
  ({ icon, children, compact = false, onClick, href, disabled = false, className, ...rest }, ref) =>
    compact ? (
      <button
        {...rest}
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-label={rest['aria-label'] ?? children}
        className={cn(chatDetailsLinkCompactVariants(), className)}
      >
        <Avatar variant="icon" size="sm" contrast="on-canva" icon={icon} />
      </button>
    ) : (
      <ListItem
        {...rest}
        variant="complex"
        title={children}
        leading={<Avatar variant="icon" size="sm" contrast="on-canva" icon={icon} />}
        onNavigate={href === undefined ? (onClick ?? noop) : onClick}
        href={href}
        disabled={disabled}
        controlRef={ref}
        className={className}
      />
    )
);

ChatDetailsLink.displayName = 'ChatDetailsLink';

/** Cuadrícula de 2 columnas con desplazamiento (galería de fotografías o documentos): región con nombre y lista dentro. */
export const ChatDetailsGrid = forwardRef<HTMLDivElement, ChatDetailsGridProps>(
  ({ children, className, 'aria-label': ariaLabel, ...rest }, ref) => (
    <ScrollArea {...rest} ref={ref} role="region" aria-label={ariaLabel} className={cn('min-h-0 flex-1 overflow-x-hidden pr-ds-space-general-lg', className)}>
      {/* El nombre va solo en la región (siempre presente, desborde o no): repetirlo en la lista lo leería dos veces */}
      <ul className={chatDetailsGridVariants()}>
        {Children.map(children, (child) => (child == null || child === false ? null : <li className="min-w-0">{child}</li>))}
      </ul>
    </ScrollArea>
  )
);

ChatDetailsGrid.displayName = 'ChatDetailsGrid';
