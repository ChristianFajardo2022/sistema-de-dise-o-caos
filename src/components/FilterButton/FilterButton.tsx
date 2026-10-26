import { forwardRef, useId, useSyncExternalStore } from 'react';
import type { FilterButtonProps } from './FilterButton.types';
import { filterButtonVariants } from './FilterButton.variants';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/** Mismo corte que la variante `mobile:` de tokens.css. */
const MOBILE_QUERY = '(width < 48rem)';

const subscribe = (notify: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener('change', notify);
  return () => mql.removeEventListener('change', notify);
};
const isMobileViewport = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(MOBILE_QUERY).matches);

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
    const mobileViewport = useSyncExternalStore(subscribe, isMobileViewport, () => false);
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
            state={disabled ? 'inactive' : 'info'}
            label={typeof countLabel === 'function' ? countLabel(count ?? 0) : countLabel}
            // Se lee como descripción del botón (aria-describedby funciona con nodos ocultos): fuera del orden de lectura
            // para no anunciar el conteo dos veces
            aria-hidden="true"
            data-figma-part="Badge"
          >
            {count}
          </Badge>
        )}
        {resolved === 'mobile' ? (
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
