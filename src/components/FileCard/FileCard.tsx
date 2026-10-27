import { forwardRef, useId } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import type { FileCardProps } from './FileCard.types';
import {
  fileCardCornerClass,
  fileCardDescriptionClass,
  fileCardOverlayVariants,
  fileCardPhotoCornerShadowClass,
  fileCardPhotoTextClass,
  fileCardStateVariants,
  fileCardTextGroupClass,
  fileCardThumbnailCornerClass,
  fileCardTitleClass,
  fileCardVariants,
} from './FileCard.variants';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { ButtonCorner } from '../ButtonCorner';
import { buttonCornerVariants } from '../ButtonCorner/ButtonCorner.variants';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { Radio } from '../Radio';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { cn } from '../../utils/cn';

/**
 * Tarjeta de archivo (component sets "File card" 14043:59452 y 15005:15958 de Figma).
 * No es interactiva en sí: la interacción vive en sus controles (selección, más opciones, acciones),
 * cada uno con nombre accesible que incluye el título del archivo. Hover sale de CSS; Select, del control marcado.
 * El `ref` va a la raíz (la tarjeta es un contenedor con controles opcionales); el input de selección se alcanza con
 * `selectionProps` (incluido su `ref`).
 */
export const FileCard = forwardRef<HTMLDivElement, FileCardProps>(
  (
    {
      type = 'icon',
      title,
      description,
      children,
      src,
      alt,
      icon,
      selection,
      checked,
      defaultChecked,
      onCheckedChange,
      name,
      value,
      disabled,
      selectionLabel,
      selectionProps,
      onMoreClick,
      moreLabel,
      moreButtonProps,
      onDownload,
      downloadLabel,
      onDelete,
      deleteLabel,
      state,
      className,
      ...restProps
    },
    ref
  ) => {
    const titleId = useId();
    const stateKey = state ?? 'auto';
    const isThumbnail = type === 'thumbnail';
    const avatarIcon = icon ?? (type === 'icon' ? 'folder' : 'image');
    const cornerSize = type === 'photo' ? 'md' : 'sm';

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      selectionProps?.onChange?.(event);
      onCheckedChange?.(event.target.checked);
    };

    // Nombres de las acciones (patrón de ListItem): "Descargar <título>". Si el título no es texto, el nombre queda
    // genérico y el título llega como descripción. Los *Label reemplazan el nombre completo.
    const titleText = typeof title === 'string' || typeof title === 'number' ? String(title) : null;
    const actionName = (label: string | undefined, verb: string) => label ?? (titleText ? `${verb} ${titleText}` : verb);
    const describedBy = titleText ? undefined : titleId;

    let corner: ReactNode = null;
    if (selection) {
      const Control = selection === 'radio' ? Radio : Checkbox;
      corner = (
        <span
          data-figma-part="Button corner "
          className={cn(
            buttonCornerVariants({ contrast: 'on-card', size: cornerSize }),
            fileCardCornerClass,
            type === 'photo' && fileCardPhotoCornerShadowClass,
            isThumbnail && fileCardThumbnailCornerClass,
            'cursor-default'
          )}
        >
          {/* La fila del control ocupa todo el círculo: el clic en cualquier punto del Button corner marca */}
          <Control
            {...selectionProps}
            className="absolute inset-0 justify-center rounded-ds-radius-button-full"
            aria-label={selectionLabel}
            aria-labelledby={selectionLabel ? undefined : titleId}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            name={name}
            value={value}
            disabled={disabled}
          />
        </span>
      );
    } else if (onMoreClick && !isThumbnail) {
      corner = (
        <ButtonCorner
          {...moreButtonProps}
          variant="dots"
          contrast="on-card"
          size={cornerSize}
          aria-label={actionName(moreLabel, 'Más opciones de')}
          aria-describedby={describedBy}
          onClick={onMoreClick}
          className={cn(fileCardCornerClass, type === 'photo' && fileCardPhotoCornerShadowClass)}
          data-figma-part="Icon-sizes"
        />
      );
    }

    const avatar = (
      <Avatar
        variant="icon"
        size={isThumbnail ? 'sm' : 'md'}
        contrast="on-card"
        icon={avatarIcon}
        className={cn('relative bg-(--fc-avatar)', type === 'icon' && 'self-start')}
      />
    );

    const media = src ? <img src={src} alt={alt ?? ''} className="block size-full object-cover" /> : null;

    const textGroup = (
      <div className={fileCardTextGroupClass}>
        <p id={titleId} data-figma-part="Filename" className={fileCardTitleClass}>
          {title}
        </p>
        {description != null && description !== false && (
          <p data-figma-part="Status" className={fileCardDescriptionClass}>
            {description}
          </p>
        )}
      </div>
    );

    const rootClass = cn(fileCardVariants({ type }), fileCardStateVariants({ type, state: stateKey }), className);

    if (type === 'photo') {
      return (
        <div ref={ref} {...restProps} className={rootClass}>
          <div data-figma-part="canva" className="relative z-10 flex h-40 w-full items-center justify-center">
            <NotchedSurface notch="md" data-figma-part="Subtract">
              {media}
            </NotchedSurface>
            {!src && avatar}
            {corner}
          </div>
          <div data-figma-part="Text" className={fileCardPhotoTextClass}>
            {textGroup}
            {children}
          </div>
          {/*
            Capa de sombra común al lienzo y al texto: la silueta entera de la tarjeta (drop-shadow, sigue la muesca).
            Va detrás de todo (-z-10). Solo pinta la capa interior (1 px adentro) para no sumar antialiasing en el borde.
          */}
          <NotchedSurface notch="md" shadow="on-card" className="[--surface-edge:transparent]" />
        </div>
      );
    }

    if (isThumbnail) {
      const hasActions = onDownload != null || onDelete != null;
      return (
        <div ref={ref} {...restProps} className={rootClass}>
          <NotchedSurface notch="sm">{media}</NotchedSurface>
          {!src && avatar}
          <p id={titleId} className="sr-only">
            {title}
          </p>
          {/* Orden de tabulación: selección y luego acciones (el corner queda encima por z-index) */}
          {corner}
          {hasActions && (
            <div className={fileCardOverlayVariants({ state: stateKey })}>
              <NotchedSurface notch="sm" fill="var(--color-ds-background-effect-backdrop)" data-figma-part="Backdrop" />
              {onDownload && (
                <Button
                  variant="primary"
                  size="xs"
                  iconOnly
                  aria-label={actionName(downloadLabel, 'Descargar')}
                  aria-describedby={describedBy}
                  onClick={onDownload}
                >
                  <Icon name="download" size={16} data-figma-part="Icon-sizes" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="primary"
                  size="xs"
                  iconOnly
                  state="delete"
                  aria-label={actionName(deleteLabel, 'Eliminar')}
                  aria-describedby={describedBy}
                  onClick={onDelete}
                >
                  <Icon name="trash" size={16} data-figma-part="Icon-sizes" />
                </Button>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} {...restProps} className={rootClass}>
        <NotchedSurface notch="sm" />
        {avatar}
        {textGroup}
        {children}
        {corner}
      </div>
    );
  }
);

FileCard.displayName = 'FileCard';
