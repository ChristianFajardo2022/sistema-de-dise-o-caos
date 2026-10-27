import { forwardRef, useId } from 'react';
import type { InformationCardProps } from './InformationCard.types';
import {
  informationCardActionsVariants,
  informationCardContentVariants,
  informationCardDescriptionVariants,
  informationCardDividerVariants,
  informationCardFooterRowVariants,
  informationCardFooterStartVariants,
  informationCardFooterVariants,
  informationCardImageClass,
  informationCardSimpleTitleVariants,
  informationCardHeaderVariants,
  informationCardSubtitleVariants,
  informationCardTagsVariants,
  informationCardTitleBlockVariants,
  informationCardTitleVariants,
  informationCardVariants,
} from './InformationCard.variants';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { cn } from '../../utils/cn';

const has = (node: unknown) => node != null && node !== false;

/**
 * Tarjeta de información (set "Information card" de Figma, 14195:31274). No es interactiva: es un `<article>`
 * nombrado por su título; lo interactivo son los controles que se le pasan (botones, lista, avatares).
 * Usa la superficie interna común de las tarjetas (sin muesca).
 */
export const InformationCard = forwardRef<HTMLElement, InformationCardProps>(
  (
    {
      variant = 'default',
      image = false,
      title,
      subtitle,
      description,
      leading,
      tags,
      tagsPosition = 'header',
      children,
      footer,
      actions,
      headingLevel = 3,
      className,
      ...rest
    },
    ref
  ) => {
    const titleId = useId();
    const Heading = headingLevel === 'none' ? 'p' : (`h${headingLevel}` as const);
    const tagsNode = has(tags) ? (
      <div data-figma-part="Tags9" className={informationCardTagsVariants()}>
        {tags}
      </div>
    ) : null;
    const tagsInHeader = tagsPosition === 'header' && tagsNode;
    const hasHeader = has(leading) || tagsInHeader;
    const titleBlock = (
      <div data-figma-part="Frame 1984080587" className={informationCardTitleBlockVariants()}>
        <Heading id={titleId} data-figma-part="Filename" className={informationCardTitleVariants()}>
          {title}
        </Heading>
        {has(subtitle) && (
          <p data-figma-part="Status" className={informationCardSubtitleVariants()}>
            {subtitle}
          </p>
        )}
      </div>
    );
    const actionsNode = has(actions) && (
      <div data-figma-part="Group button" className={informationCardActionsVariants()}>
        {actions}
      </div>
    );

    const imageNode = image ? <span aria-hidden="true" data-figma-part="Image" className={informationCardImageClass} /> : null;

    if (variant === 'simple') {
      return (
        <article
          {...rest}
          ref={ref}
          aria-labelledby={rest['aria-labelledby'] ?? titleId}
          className={cn(informationCardVariants({ variant }), className)}
        >
          <NotchedSurface shadow="on-card-on-canva" />
          {imageNode}
          <Heading id={titleId} data-figma-part="Filename" className={informationCardSimpleTitleVariants()}>
            {title}
          </Heading>
          {has(description) && (
            <p data-figma-part="Status" className={informationCardDescriptionVariants()}>
              {description}
            </p>
          )}
        </article>
      );
    }

    return (
      <article
        {...rest}
        ref={ref}
        aria-labelledby={rest['aria-labelledby'] ?? titleId}
        className={cn(informationCardVariants(), className)}
      >
        <NotchedSurface shadow="on-card-on-canva" />
        {imageNode}
        {hasHeader && (
          <div data-figma-part="Container" className={informationCardHeaderVariants({ hasLeading: has(leading) })}>
            {leading}
            {tagsInHeader}
          </div>
        )}
        <div data-figma-part="Content" className={informationCardContentVariants({ tagsPosition })}>
          {tagsPosition === 'content' && tagsNode ? (
            <div className="flex min-w-0 flex-col gap-ds-space-general-lg">
              {titleBlock}
              {tagsNode}
            </div>
          ) : (
            titleBlock
          )}
          {has(description) && (
            <p data-figma-part="Status" className={informationCardDescriptionVariants()}>
              {description}
            </p>
          )}
        </div>
        {children}
        {has(footer) ? (
          <div data-figma-part="Desktop" className={informationCardFooterVariants()}>
            <hr data-figma-part="Line 112" className={informationCardDividerVariants()} />
            <div className={informationCardFooterRowVariants()}>
              <div className={informationCardFooterStartVariants()}>{footer}</div>
              {actionsNode}
            </div>
          </div>
        ) : (
          actionsNode
        )}
      </article>
    );
  }
);

InformationCard.displayName = 'InformationCard';
