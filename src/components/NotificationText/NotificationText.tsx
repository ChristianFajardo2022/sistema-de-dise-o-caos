import { forwardRef } from 'react';
import type { NotificationTextProps, NotificationTextState } from './NotificationText.types';
import { notificationTextVariants } from './NotificationText.variants';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';

/** Íconos por state, según el set de Figma (Information usa tick-circle en el archivo). */
const STATE_ICON: Record<NotificationTextState, IconName> = {
  error: 'close-circle',
  helper: 'info-circle',
  confirmation: 'tick-circle',
  information: 'tick-circle',
};

const LIVE_ROLE: Partial<Record<NotificationTextState, 'alert' | 'status'>> = {
  error: 'alert',
  confirmation: 'status',
};

export const NotificationText = forwardRef<HTMLDivElement, NotificationTextProps>(
  ({ state = 'helper', announce = true, children, className, role, ...restProps }, ref) => (
    <div
      ref={ref}
      role={role}
      className={cn(notificationTextVariants({ state }), className)}
      {...restProps}
    >
      <span
        data-figma-part="Icon Message"
        aria-hidden="true"
        className="inline-flex size-3.5 shrink-0 items-center justify-center text-(color:--msg-ico)"
      >
        <Icon name={STATE_ICON[state]} size={14} variant="fill" />
      </span>
      {/* El rol vive en el texto y se remonta con cada state (key): así pasar de helper a error sin desmontar el componente también se anuncia */}
      <span
        key={state}
        data-figma-part="Helper text"
        role={role ? undefined : announce ? LIVE_ROLE[state] : undefined}
        className="min-w-0"
      >
        {children}
      </span>
    </div>
  )
);

NotificationText.displayName = 'NotificationText';
