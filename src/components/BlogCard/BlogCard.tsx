import { forwardRef, useId } from 'react';
import type { ReactNode } from 'react';
import type { BlogCardProps } from './BlogCard.types';
import {
  blogCardAuthorBarVariants,
  blogCardAuthorClass,
  blogCardAuthorNameVariants,
  blogCardCanvaClass,
  blogCardCornerClass,
  blogCardDateClass,
  blogCardDescriptionVariants,
  blogCardImageClass,
  blogCardInfoClass,
  blogCardInformationClass,
  blogCardInlineTagsClass,
  blogCardLabelLinkClass,
  blogCardLinkClass,
  blogCardMediaClass,
  blogCardMediaFillClass,
  blogCardPlaceholderClass,
  blogCardTagsClass,
  blogCardTextClass,
  blogCardTitleStateClass,
  blogCardTitleVariants,
  blogCardVariants,
} from './BlogCard.variants';
import { buttonVariants } from '../Button/Button.variants';
import { buttonCornerVariants } from '../ButtonCorner/ButtonCorner.variants';
import { Icon } from '../Icon';
import { MediaScrim } from '../_internal/MediaScrim';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { cornerShadowClass } from '../_internal/shadows';
import { cn } from '../../utils/cn';

const has = (node: unknown) => node != null && node !== false;

/**
 * Tarjeta de blog (set "Cards" de Figma, 17080:14028). Es un `<article>` nombrado por su título; el título lleva el
 * enlace al artículo (o lo lleva "Leer más") y ese enlace se estira sobre toda la tarjeta (un solo enlace, sin controles anidados dentro).
 * El Button corner de Figma es parte visual de ese enlace (oculto para lectores). Con el "Button" terciario
 * (`linkLabel`, "Leer más"), el enlace es ese texto visible, nombrado "título Leer más", y el título queda como texto. Lo que va sobre la foto (franja del autor,
 * etiquetas) es un `MediaScrim`: tema oscuro forzado, como lo dibuja Figma, y velo opaco bajo el texto.
 * `action` pone en la muesca un control propio, por encima del enlace. El `ref` va al `<article>`.
 */
export const BlogCard = forwardRef<HTMLElement, BlogCardProps>(
  (
    {
      orientation = 'vertical',
      title,
      description,
      href,
      linkProps,
      date,
      dateTime,
      src,
      alt,
      author,
      authorAvatar,
      tags,
      linkLabel,
      action,
      headingLevel = 3,
      className,
      ...rest
    },
    ref
  ) => {
    const titleId = useId();
    const titleTextId = `${titleId}-text`;
    const linkLabelId = `${titleId}-link-label`;
    const Heading = headingLevel === 'none' ? 'p' : (`h${headingLevel}` as const);
    const isVertical = orientation === 'vertical';

    const media: ReactNode = src ? (
      <img src={src} alt={alt ?? ''} className={blogCardImageClass} />
    ) : (
      <span className={blogCardPlaceholderClass}>
        <Icon name="image" size={32} variant="line" />
      </span>
    );

    const authorNode = (has(authorAvatar) || has(author)) && (
      <div data-figma-part="Container" className={blogCardAuthorClass}>
        {authorAvatar}
        {has(author) && (
          <span data-figma-part="Author" className={blogCardAuthorNameVariants({ orientation })}>
            {author}
          </span>
        )}
      </div>
    );

    const dateNode = has(date) && (
      <p data-figma-part="Frame 1984080544" className={blogCardDateClass}>
        <Icon name="calendar" size={12} variant="line" data-figma-part="Icon-sizes" />
        <time dateTime={dateTime} data-figma-part="Filename">
          {date}
        </time>
      </p>
    );

    // Con "Leer más" (linkLabel), ese texto visible es el enlace y se nombra con el título + "Leer más" (2.5.3, control
    // por voz); el encabezado queda solo con el título. Sin él, el enlace es el título. Siempre un solo enlace estirado.
    const hasLinkLabel = has(linkLabel);
    const heading = (
      <Heading id={titleId} data-figma-part={isVertical ? 'Filename' : 'Titulo'} className={blogCardTitleVariants({ orientation })}>
        {hasLinkLabel ? (
          <span id={titleTextId}>{title}</span>
        ) : (
          <a {...linkProps} href={href} className={cn(blogCardLinkClass, linkProps?.className)}>
            {title}
          </a>
        )}
      </Heading>
    );

    const descriptionNode = has(description) && (
      <p
        data-figma-part={isVertical ? 'Status' : 'Lorem ipsum dolor sit amet consectetur. Pretium at odio id turpis sem id.'}
        className={blogCardDescriptionVariants({ orientation })}
      >
        {description}
      </p>
    );

    // "Button" terciario de Figma: es el enlace principal (estirado sobre la tarjeta con ::after)
    const linkLabelNode = hasLinkLabel && (
      <a
        aria-labelledby={`${titleTextId} ${linkLabelId}`}
        {...linkProps}
        href={href}
        data-figma-part="Button"
        className={cn(
          buttonVariants({ variant: 'tertiary', size: isVertical ? 'sm' : 'xs', state: 'default', iconOnly: false }),
          blogCardLabelLinkClass,
          linkProps?.className
        )}
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-ds-space-button-lg">
          <span id={linkLabelId} className="pb-ds-space-button-sm">
            {linkLabel}
          </span>
        </span>
      </a>
    );

    const rootProps = {
      ...rest,
      ref,
      'aria-labelledby': rest['aria-labelledby'] ?? titleId,
      className: cn(blogCardVariants({ orientation }), className),
    };

    if (isVertical) {
      return (
        <article {...rootProps}>
          <div data-figma-part="canva" className={blogCardCanvaClass}>
            <NotchedSurface notch="md" shadow="on-card" bleed>
              {media}
            </NotchedSurface>
            {!has(action) && (
              <span
                aria-hidden="true"
                data-figma-part="Button corner "
                className={cn(buttonCornerVariants({ status: 'on-canva', size: 'md' }), blogCardCornerClass, cornerShadowClass, 'cursor-pointer')}
              >
                <Icon name="arrow-diagonal-right" size={16} variant="line" data-figma-part="Icon-sizes" />
              </span>
            )}
            {(authorNode || has(tags)) && (
              <MediaScrim edge="bottom" data-figma-part="Frame 1984080614" className={blogCardAuthorBarVariants({ orientation })}>
                {authorNode || <span className="flex-1" />}
                {has(tags) && <div className={blogCardInlineTagsClass}>{tags}</div>}
              </MediaScrim>
            )}
          </div>
          <div data-figma-part="Text" className={blogCardTextClass}>
            <div data-figma-part="Title/state" className={blogCardTitleStateClass}>
              {dateNode}
              {heading}
              {descriptionNode}
              {linkLabelNode}
            </div>
          </div>
          {/* La acción va al final del DOM (después del enlace en el orden de tabulación) y se posiciona en la muesca */}
          {has(action) && (
            <span data-figma-part="Button corner " className={cn(blogCardCornerClass, cornerShadowClass, 'z-20')}>
              {action}
            </span>
          )}
        </article>
      );
    }

    return (
      <article {...rootProps}>
        <div data-figma-part="Text" className={blogCardMediaClass}>
          <span className={blogCardMediaFillClass}>{media}</span>
          {has(tags) && (
            <MediaScrim veil="none" data-figma-part="Frame 1984080615" className={blogCardTagsClass}>
              {tags}
            </MediaScrim>
          )}
          {authorNode && (
            <MediaScrim edge="bottom" data-figma-part="Frame 1984080614" className={blogCardAuthorBarVariants({ orientation })}>
              {authorNode}
            </MediaScrim>
          )}
        </div>
        <div data-figma-part="info" className={blogCardInfoClass}>
          {dateNode}
          <div data-figma-part="Information" className={blogCardInformationClass}>
            {heading}
            {descriptionNode}
            {linkLabelNode}
          </div>
        </div>
      </article>
    );
  }
);

BlogCard.displayName = 'BlogCard';
