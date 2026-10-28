import { createContext, forwardRef, useContext, useId } from 'react';
import type { ChangeEvent } from 'react';
import type {
  InteractiveCardDescriptionProps,
  InteractiveCardDetailProps,
  InteractiveCardDetailsProps,
  InteractiveCardHeaderProps,
  InteractiveCardListProps,
  InteractiveCardProps,
  InteractiveCardStatProps,
  InteractiveCardStatsProps,
  InteractiveCardTagsProps,
} from './InteractiveCard.types';
import {
  interactiveCardActionsClass,
  interactiveCardAvatarCheckedClass,
  interactiveCardCornerClass,
  interactiveCardCornerSlotClass,
  interactiveCardHoverShadowClass,
  interactiveCardSimpleAvatarClass,
  interactiveCardStatClass,
  interactiveCardTextVariants,
  interactiveCardVariants,
} from './InteractiveCard.variants';
import { Avatar } from '../Avatar';
import { ButtonCorner } from '../ButtonCorner';
import { Icon } from '../Icon';
import { Radio } from '../Radio';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { cn } from '../../utils/cn';

/** Estado que las sub-partes leen de la tarjeta (Inactive pinta sus textos deshabilitados). */
const InteractiveCardContext = createContext<{ disabled: boolean }>({ disabled: false });
const useCardDisabled = () => useContext(InteractiveCardContext).disabled;

const noop = () => {};

/**
 * Tarjeta seleccionable (set "Interactive card" de Figma, 13219:38332).
 *
 * Toda la tarjeta es un radio: el control real es un `<input type="radio">` (con `name` se agrupa con otras tarjetas)
 * cuyo nombre accesible es el título. Para que toda la superficie sea clicable sin anidar botones dentro de otro
 * control, se usa el patrón de "control estirado": el `<label>` del radio cubre la tarjeta con un pseudo-elemento, y los
 * controles internos (Button corner, acciones de `InteractiveCardList`) quedan por encima con su propio foco y clic.
 * Un control propio dentro de la tarjeta debe llevar `data-card-action` para quedar encima del área de clic.
 * En simple el label es el `Radio` visible; en complex (Figma no dibuja radio) el input es sr-only.
 */
export const InteractiveCard = forwardRef<HTMLInputElement, InteractiveCardProps>(
  (
    {
      variant = 'simple',
      title,
      subtitle,
      leading,
      icon = 'folder',
      tags,
      content,
      children,
      indicator = true,
      cornerLabel,
      onCornerClick,
      cornerIcon,
      onCheckedChange,
      onChange,
      disabled = false,
      state,
      rootProps,
      className,
      id,
      checked,
      ...inputProps
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id ?? `${autoId}-input`;
    const titleId = `${autoId}-title`;
    const subtitleId = `${autoId}-subtitle`;
    const isComplex = variant === 'complex';
    const isDisabled = disabled || state === 'inactive';
    const hasSubtitle = subtitle != null && subtitle !== false;

    // Con state forzado el aspecto sale de state (como Radio); si no, del input nativo
    const forced = state !== undefined;
    const checkedProps = forced
      ? { checked: state === 'select', onChange: onChange ?? noop }
      : {
          checked,
          onChange: (event: ChangeEvent<HTMLInputElement>) => {
            onChange?.(event);
            onCheckedChange?.(event.target.checked);
          },
        };

    const controlProps = {
      ...inputProps,
      ...checkedProps,
      ref,
      id: inputId,
      disabled: isDisabled,
      'data-card-control': '',
      'aria-labelledby': titleId,
      'aria-describedby': hasSubtitle ? subtitleId : undefined,
    };

    // Label estirado: cubre toda la tarjeta (la raíz es `relative`)
    const stretched = "after:absolute after:inset-0 after:content-['']";

    const control =
      !isComplex && indicator ? (
        <Radio {...controlProps} data-figma-part="Selection" className={cn('static shrink-0', stretched)} />
      ) : (
        <>
          <input {...controlProps} type="radio" className="peer sr-only" />
          <label htmlFor={inputId} aria-hidden="true" className={cn('absolute inset-0', isDisabled ? 'cursor-not-allowed' : 'cursor-pointer')} />
        </>
      );

    const hasCorner = isComplex && cornerLabel != null;

    return (
      <InteractiveCardContext.Provider value={{ disabled: isDisabled }}>
        <div
          {...rootProps}
          data-state={state === 'hover' ? 'hover' : undefined}
          data-disabled={isDisabled ? '' : undefined}
          className={cn(interactiveCardVariants({ variant, disabled: isDisabled }), rootProps?.className, className)}
        >
          <NotchedSurface
            notch={hasCorner ? 'md' : 'none'}
            shadow={isComplex ? 'on-card' : 'none'}
            className={isComplex ? undefined : interactiveCardHoverShadowClass}
          />
          {isComplex ? (
            <>
              {control}
              {hasCorner && (
                <span className={interactiveCardCornerSlotClass}>
                  <ButtonCorner
                    data-card-action=""
                    data-figma-part="Button corner "
                    aria-label={cornerLabel}
                    icon={cornerIcon ?? <Icon name="arrow-diagonal-right" size={16} variant="line" data-figma-part="Icon-sizes" />}
                    disabled={isDisabled}
                    onClick={onCornerClick}
                    className={interactiveCardCornerClass}
                  />
                </span>
              )}
              <div data-figma-part="Content" className="flex min-w-0 flex-col gap-ds-space-general-2xl">
                <InteractiveCardHeader
                  leading={leading}
                  icon={icon}
                  title={title}
                  subtitle={subtitle}
                  tags={tags}
                  titleId={titleId}
                  subtitleId={subtitleId}
                />
                {content}
              </div>
              {children}
            </>
          ) : (
            <>
              <div data-figma-part="Container" className="flex min-h-12 min-w-0 flex-1 items-center gap-ds-space-general-2xl">
                {leading === undefined ? (
                  <Avatar
                    data-figma-part="Avatar"
                    variant="icon"
                    size="sm"
                    contrast="on-canva"
                    icon={icon}
                    inactive={isDisabled}
                    className={interactiveCardSimpleAvatarClass}
                  />
                ) : (
                  leading
                )}
                <div data-figma-part="Text container" className="flex min-w-0 flex-1 flex-col gap-ds-space-badge-sm">
                  <span
                    id={titleId}
                    data-figma-part="Título"
                    className={interactiveCardTextVariants({ kind: 'title-sm', tone: 'strong', disabled: isDisabled })}
                  >
                    {title}
                  </span>
                  {hasSubtitle && (
                    <span
                      id={subtitleId}
                      data-figma-part="Subtítulo"
                      className={interactiveCardTextVariants({ kind: 'body', tone: 'body', disabled: isDisabled })}
                    >
                      {subtitle}
                    </span>
                  )}
                </div>
              </div>
              {control}
            </>
          )}
        </div>
      </InteractiveCardContext.Provider>
    );
  }
);

InteractiveCard.displayName = 'InteractiveCard';

/**
 * Encabezado de la Complex: avatar, dos líneas de texto y etiquetas. La tarjeta dibuja el primero con su título;
 * se puede agregar otro en `content` (p. ej. `emphasis="subtitle"` para un dato destacado).
 */
export const InteractiveCardHeader = forwardRef<HTMLDivElement, InteractiveCardHeaderProps>(
  (
    { leading, icon = 'folder', title, subtitle, emphasis = 'title', subtitleIcon, tags, titleId, subtitleId, className, ...rest },
    ref
  ) => {
    const disabled = useCardDisabled();
    const strongTitle = emphasis === 'title';
    const hasSubtitle = subtitle != null && subtitle !== false;
    const hasTags = tags != null && tags !== false;
    return (
      <div {...rest} ref={ref} className={cn('flex min-w-0 items-center gap-ds-space-general-2xl', className)}>
        {leading === undefined ? (
          <Avatar
            data-figma-part="Avatar"
            variant="icon"
            size="lg"
            contrast={disabled ? 'on-canva' : 'on-card'}
            icon={icon}
            inactive={disabled}
            className={interactiveCardAvatarCheckedClass}
          />
        ) : (
          leading
        )}
        <div
          data-figma-part="Information"
          className="flex min-w-0 flex-1 flex-col gap-ds-space-general-md"
        >
          <span
            id={titleId}
            data-figma-part="Título"
            className={interactiveCardTextVariants({
              kind: strongTitle ? 'title-md' : 'body',
              tone: strongTitle ? 'strong' : 'body',
              disabled,
            })}
          >
            {title}
          </span>
          {hasSubtitle &&
            (strongTitle ? (
              <span
                id={subtitleId}
                data-figma-part="Subtítulo"
                className={interactiveCardTextVariants({ kind: 'body', tone: 'body', disabled })}
              >
                {subtitle}
              </span>
            ) : (
              <span className="flex min-w-0 items-center gap-ds-space-general-lg">
                <span
                  id={subtitleId}
                  data-figma-part="Subtítulo"
                  className={interactiveCardTextVariants({ kind: 'title-md', tone: 'strong', disabled })}
                >
                  {subtitle}
                </span>
                {subtitleIcon && (
                  <Icon
                    name={subtitleIcon}
                    size={16}
                    variant="line"
                    data-figma-part="Icon-sizes"
                    className="shrink-0 text-ds-icon-general-default"
                  />
                )}
              </span>
            ))}
        </div>
        {hasTags && (
          <div data-figma-part="Tags9" className="flex shrink-0 items-center justify-end gap-ds-space-general-lg">
            {tags}
          </div>
        )}
      </div>
    );
  }
);

InteractiveCardHeader.displayName = 'InteractiveCardHeader';

/** Texto descriptivo de la Complex (14/18, text/neutral/body). */
export const InteractiveCardDescription = forwardRef<HTMLParagraphElement, InteractiveCardDescriptionProps>(
  ({ className, ...rest }, ref) => {
    const disabled = useCardDisabled();
    return (
      <p
        {...rest}
        ref={ref}
        data-figma-part="Status"
        className={cn(interactiveCardTextVariants({ kind: 'description', tone: 'body', disabled }), className)}
      />
    );
  }
);

InteractiveCardDescription.displayName = 'InteractiveCardDescription';

/** Fila de etiquetas (gap 8). Pasar `disabled` a cada `Tag` cuando la tarjeta esté inactiva. */
export const InteractiveCardTags = forwardRef<HTMLDivElement, InteractiveCardTagsProps>(({ className, ...rest }, ref) => (
  <div {...rest} ref={ref} data-figma-part="Tags9" className={cn('flex flex-wrap items-center gap-ds-space-general-lg', className)} />
));

InteractiveCardTags.displayName = 'InteractiveCardTags';

/** Pares término/valor (slot "List" de Figma): una lista de definiciones con gap de 4. */
export const InteractiveCardDetails = forwardRef<HTMLDListElement, InteractiveCardDetailsProps>(({ className, ...rest }, ref) => (
  <dl {...rest} ref={ref} data-figma-part="List" className={cn('m-0 flex min-w-0 flex-col gap-ds-space-general-md', className)} />
));

InteractiveCardDetails.displayName = 'InteractiveCardDetails';

/** Un par término/valor: término 14/18 semibold y valor 14/20, en fila con gap 8. */
export const InteractiveCardDetail = forwardRef<HTMLDivElement, InteractiveCardDetailProps>(
  ({ term, children, className, ...rest }, ref) => {
    const disabled = useCardDisabled();
    return (
      <div {...rest} ref={ref} data-figma-part="Information" className={cn('flex min-w-0 items-center gap-ds-space-general-lg', className)}>
        <dt data-figma-part="Título" className={interactiveCardTextVariants({ kind: 'title-xs', tone: 'strong', disabled })}>
          {term}
        </dt>
        <dd data-figma-part="Descripción" className={cn('m-0', interactiveCardTextVariants({ kind: 'body', tone: 'body', disabled }))}>
          {children}
        </dd>
      </div>
    );
  }
);

InteractiveCardDetail.displayName = 'InteractiveCardDetail';

/** Lista de ítems (instancia "List" de Figma): un `<ul>` para `ListItem`. Pasar `disabled` a cada ítem si la tarjeta está inactiva. */
export const InteractiveCardList = forwardRef<HTMLUListElement, InteractiveCardListProps>(({ className, ...rest }, ref) => (
  // role="list" explícito: con list-style none Safari deja de anunciar la lista
  <ul {...rest} ref={ref} role="list" data-figma-part="List" className={cn('m-0 flex min-w-0 flex-col p-0', interactiveCardActionsClass, className)} />
));

InteractiveCardList.displayName = 'InteractiveCardList';

/** Fila de bloques de dato (Box text de Figma), gap 8. */
export const InteractiveCardStats = forwardRef<HTMLDivElement, InteractiveCardStatsProps>(({ className, ...rest }, ref) => (
  <div {...rest} ref={ref} data-figma-part="Box text" className={cn('flex min-w-0 items-start gap-ds-space-general-lg', className)} />
));

InteractiveCardStats.displayName = 'InteractiveCardStats';

/** Bloque de dato: rótulo 14/20 y dato 20/24 con un ícono opcional. */
export const InteractiveCardStat = forwardRef<HTMLDivElement, InteractiveCardStatProps>(
  ({ label, value, icon, className, ...rest }, ref) => {
    const disabled = useCardDisabled();
    return (
      <div {...rest} ref={ref} className={cn(interactiveCardStatClass, className)}>
        <span data-figma-part="Subtítulo" className={interactiveCardTextVariants({ kind: 'body', tone: 'body', disabled })}>
          {label}
        </span>
        <span className="flex min-w-0 items-center gap-ds-space-general-lg">
          <span data-figma-part="Descripción" className={cn(interactiveCardTextVariants({ kind: 'value', tone: 'strong', disabled }), 'truncate')}>
            {value}
          </span>
          {icon && (
            <Icon name={icon} size={16} variant="line" data-figma-part="Icon-sizes" className="shrink-0 text-ds-icon-general-default" />
          )}
        </span>
      </div>
    );
  }
);

InteractiveCardStat.displayName = 'InteractiveCardStat';
