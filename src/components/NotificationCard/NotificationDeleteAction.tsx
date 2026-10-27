import { notificationDeleteButtonVariants, notificationDeleteVariants } from './NotificationCard.variants';
import { focusNeighborNotification } from '../NotificationItem/NotificationItem.shared';
import { Icon } from '../Icon';

interface DeleteActionProps {
  revealed: boolean;
  label: string;
  onDelete: () => void;
}

/** Marco "Eliminate" de Figma: botón con el ícono trash. Mueve el foco a la fila vecina antes de eliminar. */
export function NotificationDeleteAction({ revealed, label, onDelete }: DeleteActionProps) {
  return (
    <div data-figma-part="Eliminate" className={notificationDeleteVariants({ revealed })}>
      <button
        type="button"
        aria-label={label}
        className={notificationDeleteButtonVariants()}
        onClick={(event) => {
          focusNeighborNotification(event.currentTarget);
          onDelete();
        }}
      >
        <Icon name="trash" size={24} variant="fill" data-figma-part="Icon-sizes" />
      </button>
    </div>
  );
}
