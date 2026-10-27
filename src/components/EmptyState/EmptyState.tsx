import { forwardRef } from 'react';
import type { EmptyStateAction, EmptyStateProps, EmptyStateType } from './EmptyState.types';
import {
  emptyStateActionsClass,
  emptyStateArtClass,
  emptyStateButtonClass,
  emptyStateDescriptionClass,
  emptyStateIconBoxClass,
  emptyStateSquareDashedClass,
  emptyStateSquareSolidClass,
  emptyStateTextsClass,
  emptyStateTitleClass,
  emptyStateVariants,
} from './EmptyState.variants';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { DashedStroke } from '../_internal/DashedStroke';
import type { IconName } from '../Icon/Icon.types';
import { cn } from '../../utils/cn';

const TYPE_ICON: Record<EmptyStateType, IconName> = {
  'first-use': 'add-circle',
  'no-results': 'search',
  'errors-issues': 'warning',
  'no-content': 'document',
};

function ActionButton({ action, variant }: { action: EmptyStateAction; variant: 'primary' | 'secondary' }) {
  const { label, type = 'button', ...buttonProps } = action;
  return (
    <Button
      {...buttonProps}
      type={type}
      variant={variant}
      size="md"
      className={emptyStateButtonClass}
      data-figma-part="Button"
    >
      {label}
    </Button>
  );
}

/**
 * Estado vacío (component set "Empty states" 12304:6287 de Figma). Composición de cuadros con un ícono, título,
 * descripción y hasta dos acciones (Button primary y secondary). Las acciones siguen el orden de Figma Desktop
 * (secundaria a la izquierda, principal a la derecha; el DOM y el teclado van igual); en Mobile se apilan a ancho
 * completo con la principal arriba (`flex-col-reverse`). La composición de cuadros es decorativa.
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      type = 'first-use',
      icon,
      title,
      description,
      primaryAction,
      secondaryAction,
      headingLevel = 3,
      className,
      ...restProps
    },
    ref
  ) => {
    const Heading = `h${headingLevel}` as const;
    const hasTexts = title != null || description != null;
    return (
      <div ref={ref} {...restProps} className={cn(emptyStateVariants(), className)}>
        <div aria-hidden="true" data-figma-part="Group" className={emptyStateArtClass}>
          <span className={emptyStateSquareSolidClass} />
          <DashedStroke dash={5} radius="var(--radius-ds-radius-general-2xl)" className={emptyStateSquareDashedClass} />
          <span className={emptyStateIconBoxClass} data-figma-part="Frame 12">
            <Icon name={icon ?? TYPE_ICON[type]} size={32} variant="line" data-figma-part="Icon-sizes" />
          </span>
        </div>
        {hasTexts && (
          <div data-figma-part="Text" className={emptyStateTextsClass}>
            {title != null && (
              <Heading data-figma-part="Title" className={emptyStateTitleClass}>
                {title}
              </Heading>
            )}
            {description != null && (
              <p data-figma-part="Descripción" className={emptyStateDescriptionClass}>
                {description}
              </p>
            )}
          </div>
        )}
        {(primaryAction || secondaryAction) && (
          <div data-figma-part="Buttons" className={emptyStateActionsClass}>
            {secondaryAction && <ActionButton action={secondaryAction} variant="secondary" />}
            {primaryAction && <ActionButton action={primaryAction} variant="primary" />}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
