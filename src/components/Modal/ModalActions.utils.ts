import type { ModalAction } from './Modal.types';

/** Qué acción recibe el foco inicial (la menos destructiva, patrón APG Alert Dialog). */
export type ModalFocusAction = 'primary' | 'secondary' | 'tertiary';

/** La acción menos destructiva presente: Secondary, luego Tertiary y por último Primary. */
export function leastDestructiveAction(props: {
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  tertiaryAction?: ModalAction;
}): ModalFocusAction | undefined {
  if (props.secondaryAction && !props.secondaryAction.disabled) return 'secondary';
  if (props.tertiaryAction && !props.tertiaryAction.disabled) return 'tertiary';
  if (props.primaryAction && !props.primaryAction.disabled) return 'primary';
  return undefined;
}
