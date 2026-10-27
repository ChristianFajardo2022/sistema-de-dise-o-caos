import { forwardRef, useId } from 'react';
import type { FilterButtonProps } from './FilterButton.types';
import { filterButtonVariants } from './FilterButton.variants';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { useIsMobile } from '../../utils/useMediaQuery';

const defaultCountLabel = (count: number | string) => (count === 1 ? 'filtro aplicado' : 'filtros aplicados');

/**
 * Botón que abre los filtros, con el contador de filtros aplicados (Badge) delante.
 * En escritorio es un Button Tertiary con texto y chevron; en móvil, un botón de solo ícono (filter) cuyo nombre
 * accesible es el texto. El número del badge se lee como descripción del botón ("Filtros, 3 filtros aplicados").
 * Para abrir un `FilterPanel` modal, pasar `aria-haspopup="dialog"` y `aria-expanded`.
 */
export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  (
    {
      children = 'Filtros',
      count,
      badge = true,
      countLabel = defaultCountLabel,
      disabled = false,
      layout = 'auto',
      className,
      rootProps,
      'aria-describedby': describedBy,
      ...restProps
    },
    ref
  ) => {
    const badgeId = useId();
    const mobileViewport = useIsMobile();
    const resolved = layout === 'auto' ? (mobileViewport ? 'mobile' : 'desktop') : layout;
    const showBadge = badge && (typeof count === 'number' ? count > 0 : typeof count === 'string' && count !== '');
    const described = [describedBy, showBadge ? badgeId : null].filter(Boolean).join(' ') || undefined;

    return (
      <span
        {...rootProps}
        data-layout={resolved}
        className={cn(filterButtonVariants({ layout: resolved }), className, rootProps?.className)}
      >
        {showBadge && (
          <Badge
            id={badgeId}
            type="number"
            state={disabled ? 'inactive' : resolved === 'icon' ? 'default' : 'info'}
            label={typeof countLabel === 'function' ? countLabel(count ?? 0) : countLabel}
            // Se lee como descripción del botón (aria-describedby funciona con nodos ocultos): fuera del orden de lectura
            // para no anunciar el conteo dos veces
            aria-hidden="true"
            className={resolved === 'icon' ? 'absolute right-0 bottom-0 z-10' : undefined}
            data-figma-part="Badge"
          >
            {count}
          </Badge>
        )}
        {resolved === 'icon' ? (
          <Button
            {...restProps}
            ref={ref}
            variant="secondary"
            contrast="low"
            size="md"
            iconOnly
            aria-label={typeof children === 'string' ? children : 'Filtros'}
            aria-describedby={described}
            disabled={disabled}
            data-figma-part="Button"
          >
            <Icon name="filter" size={20} variant="fill" data-figma-part="Icon-sizes" />
          </Button>
        ) : resolved === 'mobile' ? (
          <Button
            {...restProps}
            ref={ref}
            variant="tertiary"
            size="md"
            iconOnly
            aria-label={typeof children === 'string' ? children : 'Filtros'}
            aria-describedby={described}
            disabled={disabled}
            data-figma-part="Button"
          >
            <Icon name="filter" size={24} variant="fill" data-figma-part="Icon-sizes" />
          </Button>
        ) : (
          <Button
            {...restProps}
            ref={ref}
            variant="tertiary"
            size="md"
            aria-describedby={described}
            disabled={disabled}
            rightIcon={<Icon name="chevron-right" size={20} variant="fill" data-figma-part="Icon-sizes" />}
            data-figma-part="Button"
          >
            {children}
          </Button>
        )}
      </span>
    );
  }
);

FilterButton.displayName = 'FilterButton';
