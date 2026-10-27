import { forwardRef } from 'react';
import type { NotificationFilterProps, NotificationFilterValue } from './NotificationPanel.types';
import { Chip, ChipGroup } from '../Chip';
import { useControllableState } from '../../utils/controllableState';

/**
 * Filtro "Todas" / "No leídos" del panel de notificaciones: dos `Chip` en un `ChipGroup` de selección única
 * (`role="radiogroup"`: una parada de Tab, las flechas mueven y seleccionan). No filtra nada por sí solo: avisa del
 * cambio con `onValueChange` y quien lo usa filtra las notificaciones.
 */
export const NotificationFilter = forwardRef<HTMLDivElement, NotificationFilterProps>(
  (
    { value, defaultValue = 'all', onValueChange, labels = { all: 'Todas', unread: 'No leídos' }, 'aria-label': ariaLabel = 'Filtrar notificaciones', ...rest },
    ref
  ) => {
    const [filter, setFilter] = useControllableState<NotificationFilterValue>(value, defaultValue, onValueChange, 'NotificationFilter');
    return (
      <ChipGroup
        {...rest}
        ref={ref}
        selectionMode="single"
        aria-label={ariaLabel}
        value={[filter]}
        onValueChange={(next) => {
          const picked = next[0] as NotificationFilterValue | undefined;
          if (picked && picked !== filter) setFilter(picked);
        }}
      >
        <Chip value="all" icon={false}>
          {labels.all}
        </Chip>
        <Chip value="unread" icon={false}>
          {labels.unread}
        </Chip>
      </ChipGroup>
    );
  }
);

NotificationFilter.displayName = 'NotificationFilter';
