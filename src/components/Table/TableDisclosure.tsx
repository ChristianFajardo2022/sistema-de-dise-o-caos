import { forwardRef } from 'react';
import type { TableDisclosureProps } from './Table.types';
import { tableDisclosureVariants } from './Table.variants';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../utils/controllableState';

/**
 * Fila desplegable (`Dropdown table (Atom)` de Figma, 13544:69601): una franja de 56 con un botón chevron
 * (Button tertiary xs, solo ícono) que muestra u oculta más datos. Patrón APG Disclosure: el botón lleva
 * `aria-expanded` y `aria-controls`; el nombre no cambia con el estado. Up=On (chevron arriba) = abierto.
 */
export const TableDisclosure = forwardRef<HTMLDivElement, TableDisclosureProps>(
  (
    {
      expanded,
      defaultExpanded = false,
      onExpandedChange,
      controls,
      selected = false,
      label = 'Ver más datos',
      className,
      ...restProps
    },
    ref
  ) => {
    const [open, setOpen] = useControllableState(expanded, defaultExpanded, onExpandedChange, 'TableDisclosure');
    return (
      <div ref={ref} className={cn('flex', className)} {...restProps}>
        <div className={tableDisclosureVariants({ selected })} data-figma-part="Item table">
          <Button
            variant="tertiary"
            size="xs"
            iconOnly
            aria-label={label}
            aria-expanded={open}
            aria-controls={controls}
            onClick={() => setOpen(!open)}
            data-figma-part="Button"
          >
            <Icon name={open ? 'chevron-up' : 'chevron-down'} variant="fill" data-figma-part="Icon-sizes" />
          </Button>
        </div>
      </div>
    );
  }
);
TableDisclosure.displayName = 'TableDisclosure';
