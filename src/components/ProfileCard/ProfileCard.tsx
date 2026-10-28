import { Fragment, forwardRef, useId } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import type { ProfileCardProps } from './ProfileCard.types';
import {
  profileCardActionsVariants,
  profileCardColumnClass,
  profileCardContentClass,
  profileCardCornerClass,
  profileCardDescriptionClass,
  profileCardHeadClass,
  profileCardHeroFootClass,
  profileCardHeroFrameClass,
  profileCardHeroHeadClass,
  profileCardLeadingClass,
  profileCardStatClass,
  profileCardStatLabelClass,
  profileCardStatValueClass,
  profileCardStatsVariants,
  profileCardSubtitleVariants,
  profileCardTagsVariants,
  profileCardTextVariants,
  profileCardTitleVariants,
  profileCardVariants,
} from './ProfileCard.variants';
import { Badge } from '../Badge';
import { ButtonCorner } from '../ButtonCorner';
import { buttonCornerVariants } from '../ButtonCorner/ButtonCorner.variants';
import { Checkbox } from '../Checkbox';
import { Dots } from '../Dots';
import { Radio } from '../Radio';
import { StarRating } from '../Rating';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { cn } from '../../utils/cn';
import { RATING_SUFFIX, formatRating } from '../../utils/format';

const has = (node: unknown) => node != null && node !== false;

/**
 * Tarjeta de perfil (set "Profile card" de Figma, 12995:3291). Es un `<article>` nombrado por el nombre de la
 * persona (encabezado `h3` por defecto). No es interactiva en sí: lo interactivo son sus controles (selección real
 * en el Button corner, más opciones y las acciones que se le pasan), cada uno con un nombre que incluye a la persona.
 * El `ref` va a la raíz; el input de selección se alcanza con `selectionProps.ref`.
 */
export const ProfileCard = forwardRef<HTMLElement, ProfileCardProps>(
  (
    {
      layout: layoutProp = 'vertical',
      title,
      subtitle,
      description,
      leading,
      rating,
      ratingLabel = RATING_SUFFIX,
      stars,
      starsLabel,
      tags,
      stats,
      children,
      actions,
      onMoreClick,
      moreLabel,
      moreButtonProps,
      selection,
      checked,
      defaultChecked,
      onCheckedChange,
      name,
      value,
      disabled,
      selectionLabel,
      selectionProps,
      headingLevel = 3,
      className,
      ...rest
    },
    ref
  ) => {
    const titleId = useId();
    const Heading = headingLevel === 'none' ? 'p' : (`h${headingLevel}` as const);
    const titleText = typeof title === 'string' || typeof title === 'number' ? String(title) : null;
    // `hero` es el nombre anterior de `full`
    const layout = layoutProp === 'full' ? 'hero' : layoutProp;
    const withCorner = layout === 'vertical' || layout === 'horizontal';

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      selectionProps?.onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };

    // Nombres de los controles propios (patrón de ListItem): "Seleccionar <nombre>", "Más opciones de <nombre>".
    // Si el título no es texto, el control se nombra con el título (aria-labelledby).
    let corner: ReactNode = null;
    if (withCorner && selection) {
      const Control = selection === 'radio' ? Radio : Checkbox;
      const label = selectionLabel ?? (titleText ? `Seleccionar ${titleText}` : undefined);
      corner = (
        <span
          data-figma-part="Button corner "
          className={cn(buttonCornerVariants({ contrast: 'on-canva', size: 'md' }), profileCardCornerClass, 'cursor-default')}
        >
          {/* La fila del control ocupa todo el círculo: el clic en cualquier punto del Button corner marca */}
          <Control
            {...selectionProps}
            className="absolute inset-0 justify-center rounded-ds-radius-button-full"
            aria-label={label}
            aria-labelledby={label ? undefined : titleId}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            name={name}
            value={value}
            disabled={disabled}
          />
        </span>
      );
    }

    const moreName = moreLabel ?? (titleText ? `Más opciones de ${titleText}` : 'Más opciones');
    const moreDescribedBy = moreLabel || titleText ? undefined : titleId;
    if (withCorner && !corner && onMoreClick) {
      corner = (
        <ButtonCorner
          {...moreButtonProps}
          variant="dots"
          contrast="on-canva"
          size="md"
          aria-label={moreName}
          aria-describedby={moreDescribedBy}
          onClick={onMoreClick}
          className={profileCardCornerClass}
          data-figma-part="Button corner "
        />
      );
    }

    const leadingNode = has(leading) ? (
      <span data-figma-part="Avatar" className={profileCardLeadingClass}>
        {leading}
        {rating != null && (
          <Badge
            type="icon-number"
            label={ratingLabel}
            className="absolute right-0 bottom-0"
            data-figma-part="00"
          >
            {formatRating(rating)}
          </Badge>
        )}
      </span>
    ) : null;

    const subtitleItems = Array.isArray(subtitle) ? subtitle.filter(has) : has(subtitle) ? [subtitle] : [];
    const subtitleNode =
      subtitleItems.length > 0 ? (
        <p data-figma-part="Description Block" className={profileCardSubtitleVariants({ centered: layout === 'centered' })}>
          {subtitleItems.map((item, i) => (
            <Fragment key={i}>
              {i > 0 && (
                <span aria-hidden="true" data-figma-part="Status">
                  ·
                </span>
              )}
              <span data-figma-part="Status">{item}</span>
            </Fragment>
          ))}
        </p>
      ) : null;

    const titleNode = (
      <Heading id={titleId} data-figma-part="Filename" className={cn(profileCardTitleVariants({ layout }))}>
        {title}
      </Heading>
    );

    const starsNode =
      stars != null ? <StarRating value={stars} size="sm" label={starsLabel} data-figma-part="Star rating" /> : null;

    const descriptionNode = has(description) ? (
      <p data-figma-part="Status" className={profileCardDescriptionClass}>
        {description}
      </p>
    ) : null;

    const tagsNode = has(tags) ? (
      <div data-figma-part="Tags" className={profileCardTagsVariants({ layout })}>
        {tags}
      </div>
    ) : null;

    const statsNode =
      stats && stats.length > 0 ? (
        <dl data-figma-part="Counters" className={profileCardStatsVariants({ layout })}>
          {stats.map((stat, i) => (
            <div key={i} className={profileCardStatClass}>
              <dt className={profileCardStatLabelClass} data-figma-part="Status">
                {stat.label}
              </dt>
              <dd className={profileCardStatValueClass}>
                <span data-figma-part="Filename">{stat.value}</span>
                {stat.icon}
              </dd>
            </div>
          ))}
        </dl>
      ) : null;

    const actionsNode = has(actions) ? <div className={profileCardActionsVariants({ layout })}>{actions}</div> : null;

    const rootProps = {
      ...rest,
      ref,
      'aria-labelledby': rest['aria-labelledby'] ?? titleId,
      className: cn(profileCardVariants({ layout }), className),
    };

    if (layout === 'hero') {
      const more = onMoreClick ? (
        <Dots
          {...moreButtonProps}
          size="sm"
          label={moreName}
          aria-describedby={moreDescribedBy}
          onClick={onMoreClick}
          className="shrink-0"
          data-figma-part="Dots-moreoptions"
        />
      ) : null;
      return (
        <article {...rootProps}>
          <div data-figma-part="Desktop" className={profileCardHeroFrameClass}>
            <div className={profileCardHeroHeadClass}>
              {leadingNode}
              <div className={profileCardTextVariants({ layout })}>
                {titleNode}
                {subtitleNode}
                {starsNode}
                {descriptionNode}
                {children}
              </div>
              {actionsNode}
              {more}
            </div>
            {(tagsNode || statsNode) && (
              <div className={profileCardHeroFootClass}>
                {tagsNode}
                {statsNode}
              </div>
            )}
          </div>
        </article>
      );
    }

    if (layout === 'centered') {
      return (
        <article {...rootProps}>
          {leadingNode}
          <div className={profileCardTextVariants({ layout })}>
            {titleNode}
            {subtitleNode}
            {starsNode}
            {descriptionNode}
            {tagsNode}
            {children}
          </div>
          {actionsNode}
          {statsNode}
        </article>
      );
    }

    const content = (
      <div data-figma-part="Content" className={profileCardContentClass}>
        <div className={profileCardHeadClass}>
          <div className={profileCardTextVariants({ layout, corner: corner != null })}>
            {titleNode}
            {subtitleNode}
          </div>
          {starsNode}
          {tagsNode}
        </div>
        {descriptionNode}
        {children}
      </div>
    );

    return (
      <article {...rootProps}>
        <NotchedSurface notch={corner ? 'md' : 'none'} className="[--surface-fill:var(--color-ds-background-container-default-on-card)]" />
        {leadingNode}
        {layout === 'horizontal' ? (
          <div className={profileCardColumnClass}>
            {content}
            {actionsNode}
            {statsNode}
          </div>
        ) : (
          <>
            {content}
            {actionsNode}
            {statsNode}
          </>
        )}
        {corner}
      </article>
    );
  }
);

ProfileCard.displayName = 'ProfileCard';
