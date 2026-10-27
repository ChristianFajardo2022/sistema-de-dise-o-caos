import { forwardRef } from 'react';
import type { DataCardProps } from './DataCard.types';
import {
  dataCardActionVariants,
  dataCardAvatarHoverClass,
  dataCardDescriptionVariants,
  dataCardGraphicVariants,
  dataCardTextVariants,
  dataCardTitleVariants,
  dataCardVariants,
} from './DataCard.variants';
import { Avatar } from '../Avatar/Avatar';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { cn } from '../../utils/cn';

const has = (node: unknown) => node != null && node !== false;

/**
 * Tarjeta de dato: avatar de ícono, título y descripción, un slot gráfico y un control opcional.
 * Es una composición: el gráfico llega como `children` y el control como `action`. Usa la superficie interna común de
 * las tarjetas (sin muesca ni sombra).
 */
export const DataCard = forwardRef<HTMLDivElement, DataCardProps>(
  (
    {
      title,
      description,
      headingLevel = 3,
      icon = 'chart-square',
      leading,
      children,
      action,
      selected = false,
      inactive = false,
      state,
      className,
      ...restProps
    },
    ref
  ) => {
    const Title = headingLevel === 'none' ? 'p' : (`h${headingLevel}` as const);
    const current = inactive ? 'inactive' : selected ? 'select' : (state ?? 'auto');
    const raised = current === 'hover' || current === 'select' || current === 'inactive';
    return (
      <div ref={ref} {...restProps} className={cn(dataCardVariants({ state: current }), className)}>
        <NotchedSurface />
        {leading === undefined ? (
          <Avatar
            variant="icon"
            size="md"
            contrast={raised ? 'on-card' : 'on-canva'}
            inactive={current === 'inactive'}
            icon={icon}
            className={current === 'auto' ? dataCardAvatarHoverClass : undefined}
            data-figma-part="Icon Right"
          />
        ) : (
          leading
        )}
        <div data-figma-part="Text container" className={dataCardTextVariants()}>
          <Title data-figma-part="Título" className={dataCardTitleVariants({ inactive })}>
            {title}
          </Title>
          {has(description) && (
            <p data-figma-part="Descripción" className={dataCardDescriptionVariants({ inactive })}>
              {description}
            </p>
          )}
        </div>
        {has(children) && (
          <div data-figma-part="Container graphic" className={dataCardGraphicVariants()}>
            {children}
          </div>
        )}
        {has(action) && <div className={dataCardActionVariants()}>{action}</div>}
      </div>
    );
  }
);

DataCard.displayName = 'DataCard';
