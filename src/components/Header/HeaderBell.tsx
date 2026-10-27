import { cloneElement, useCallback, useId, useRef } from 'react';
import type { ReactElement } from 'react';
import { HeaderLayer } from './HeaderLayer';
import { NotificationBell } from '../NotificationBell';
import type { NotificationPanelProps } from '../NotificationPanel/NotificationPanel.types';
import type { ButtonSize } from '../Button/Button.types';

interface HeaderBellProps {
  size: ButtonSize;
  count?: number;
  panel: ReactElement<NotificationPanelProps>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Campana de la cabecera con su panel de notificaciones (pieza interna del Header). La campana abre el panel con el
 * atributo nativo `popovertarget`; el panel vive en una capa superior anclada a la campana: Escape y el clic fuera lo
 * cierran y el foco vuelve a la campana.
 *
 * El panel queda montado dentro de la capa cerrada (oculta con `popover`, fuera del árbol de accesibilidad), como el
 * menú de perfil de `AvatarMenu`: así conserva el filtro, la pestaña y el desplazamiento entre aperturas, y la capa se
 * mide ya con su contenido. Solo abierto es `popup` (diálogo no modal que recibe el foco).
 */
export function HeaderBell({ size, count, panel, open, onOpenChange }: HeaderBellProps) {
  const uid = useId();
  const panelId = `${uid}-notifications`;
  const bellRef = useRef<HTMLButtonElement | null>(null);
  const getAnchor = useCallback(() => bellRef.current, []);
  return (
    <>
      <NotificationBell
        ref={bellRef}
        size={size}
        count={count}
        open={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        popoverTarget={panelId}
        popoverTargetAction="toggle"
      />
      <HeaderLayer id={panelId} open={open} onOpenChange={onOpenChange} getAnchor={getAnchor} className="w-100">
        {cloneElement(panel, { popup: open, open: true, onOpenChange })}
      </HeaderLayer>
    </>
  );
}
