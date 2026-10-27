import { forwardRef } from 'react';
import type { PopoverPanelProps } from './Popover.types';
import {
  popoverActionsVariants,
  popoverArrowVariants,
  popoverArrowWrapVariants,
  popoverCloseClass,
  popoverContentVariants,
  popoverDescriptionClass,
  popoverInnerVariants,
  popoverLinkRowClass,
  popoverLinkTextClass,
  popoverMediaClass,
  popoverPageClass,
  popoverPanelVariants,
  popoverTextVariants,
  popoverTitleClass,
} from './Popover.variants';
import { ButtonCorner } from '../ButtonCorner';
import { Icon } from '../Icon';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { cn } from '../../utils/cn';

const has = (node: unknown) => node != null && node !== false;

/**
 * Panel del popover (dibujo del set "Tooltip" de Figma), sin comportamiento: título, texto, contador, acciones y, con
 * `media`, el bloque de medios con el botón cerrar. Lo usa `Popover` en la capa superior; suelto sirve para
 * documentación o para colocarlo a mano. No tiene rol: `Popover` le pone `role="dialog"`.
 * La superficie es unicolor (oscura en los dos temas): el contenido usa siempre los tokens de Dark (`data-theme="dark"`,
 * como MediaScrim), también los botones y avatares del bloque de medios.
 */
export const PopoverPanel = forwardRef<HTMLDivElement, PopoverPanelProps>(
  (
    {
      arrow = 'top-left',
      type: typeProp,
      title,
      headingLevel = 2,
      // `icon` está obsoleto (Figma quitó el ícono del título): se descarta para que no llegue al DOM
      icon: _icon,
      children,
      link,
      linkDescription,
      media,
      onClose,
      closeLabel = 'Cerrar',
      page,
      actions,
      titleId,
      descriptionId,
      className,
      ...rest
    },
    ref
  ) => {
    const withMedia = has(media);
    const type = typeProp ?? (withMedia ? 'complex' : 'simple');
    const Heading = headingLevel === 'none' ? 'p' : (`h${headingLevel}` as const);
    const withFooter = has(page) || has(actions);

    return (
      <div data-theme="dark" {...rest} ref={ref} className={cn(popoverPanelVariants({ arrow }), className)}>
        <div data-figma-part="Content" className={popoverContentVariants({ type, arrow })}>
          <div data-figma-part="Inner Container" className={popoverInnerVariants({ type })}>
            {withMedia && (
              <div data-figma-part="Frame 6" className={popoverMediaClass}>
                <NotchedSurface notch={onClose ? 'sm' : 'none'} radius="xl" bleed interactive data-figma-part="Subtract">
                  <span className="flex size-full items-center justify-center gap-ds-space-general-2xl p-ds-space-general-2xl">
                    {media}
                  </span>
                </NotchedSurface>
                {onClose && (
                  <ButtonCorner
                    variant="icon"
                    contrast="on-canva"
                    size="sm"
                    aria-label={closeLabel}
                    icon={<Icon name="close" size={16} variant="line" data-figma-part="Icon-sizes" />}
                    onClick={onClose}
                    className={popoverCloseClass}
                    data-figma-part="Button corner "
                  />
                )}
              </div>
            )}
            <div data-figma-part="Text" className={popoverTextVariants({ media: withMedia })}>
              {has(title) && (
                <div data-figma-part="Title Wrapper" className="flex items-center gap-ds-space-general-md">
                  <Heading id={titleId} data-figma-part="Tooltip Title" className={popoverTitleClass}>
                    {title}
                  </Heading>
                </div>
              )}
              {has(children) && (
                <div id={descriptionId} data-figma-part="Paragraph Default" className={popoverDescriptionClass}>
                  {children}
                </div>
              )}
            </div>
            {has(link) && (
              <div data-figma-part="Description+link" className={popoverLinkRowClass}>
                {has(linkDescription) ? (
                  <p data-figma-part="Paragraph Default" className={popoverLinkTextClass}>
                    {linkDescription}
                  </p>
                ) : (
                  <span aria-hidden="true" className="flex-1" />
                )}
                {link}
              </div>
            )}
            {withFooter && (
              <div data-figma-part="Actions" className={popoverActionsVariants({ media: withMedia })}>
                {has(page) ? (
                  <p data-figma-part="Paragraph Default" className={popoverPageClass}>
                    {page}
                  </p>
                ) : (
                  <span aria-hidden="true" className="flex-1" />
                )}
                {actions}
              </div>
            )}
          </div>
        </div>
        <span aria-hidden="true" data-figma-part={arrow.startsWith('middle') ? 'Frame 5' : 'div'} className={popoverArrowWrapVariants({ arrow })}>
          <span data-figma-part="Polygon 1" className={popoverArrowVariants({ arrow })} />
        </span>
      </div>
    );
  }
);

PopoverPanel.displayName = 'PopoverPanel';
