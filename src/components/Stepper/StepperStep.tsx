import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { useStepperContext } from './StepperContext';
import type { StepperStepProps } from './Stepper.types';
import {
  stepperBarVariants,
  stepperContentVariants,
  stepperDescriptionClass,
  stepperIconVariants,
  stepperRingClass,
  stepperStepVariants,
  stepperTitleRowVariants,
  stepperTitleVariants,
} from './Stepper.variants';

/** Ícono del título según el estado (Icon-sizes 14: info-circle line, tick-circle fill, close-circle fill) o el aro de In progress. */
function StatusMark({ status, className }: { status: NonNullable<StepperStepProps['status']>; className: string }) {
  if (status === 'in-progress') {
    return <span aria-hidden="true" data-figma-part="Ellipse 1" className={cn(stepperRingClass)} />;
  }
  const icon = status === 'complete' ? 'tick-circle' : status === 'error' ? 'close-circle' : 'info-circle';
  return (
    <span aria-hidden="true" data-figma-part="Icon-sizes" className={cn('inline-flex', className)}>
      <Icon name={icon} size={14} variant={status === 'incomplete' ? 'line' : 'fill'} />
    </span>
  );
}

/**
 * Un paso del Stepper (Indicators (Atom) de Figma). Es un `<li>`; el estado se anuncia con texto oculto
 * y el paso en curso lleva `aria-current="step"`. Con `onClick` el contenido pasa a ser un botón.
 */
export const StepperStep = forwardRef<HTMLLIElement, StepperStepProps>(
  (
    { status = 'incomplete', orientation: orientationProp, title, description, current, statusLabel, onClick, className, ...rest },
    ref
  ) => {
    const ctx = useStepperContext();
    const orientation = orientationProp ?? ctx.orientation;
    const label = statusLabel ?? ctx.statusLabels[status];
    const isCurrent = current ?? status === 'in-progress';

    const body: ReactNode = (
      <>
        <span className="sr-only">{label}. </span>
        {title != null && title !== false && (
          <span className={stepperTitleRowVariants()} data-figma-part="Frame 1984079689">
            <StatusMark status={status} className={stepperIconVariants({ status })} />
            <span className={stepperTitleVariants({ status })} data-figma-part="Step 1">
              {title}
            </span>
          </span>
        )}
        {description != null && description !== false && (
          <span className={stepperDescriptionClass} data-figma-part="Personal info">
            {description}
          </span>
        )}
      </>
    );

    return (
      <li
        {...rest}
        ref={ref}
        aria-current={isCurrent ? 'step' : undefined}
        data-status={status}
        className={cn(stepperStepVariants({ orientation }), className)}
      >
        <span aria-hidden="true" data-figma-part="indicator" className={stepperBarVariants({ orientation, status })} />
        {onClick ? (
          <button
            type="button"
            onClick={onClick}
            data-figma-part="Content"
            className={stepperContentVariants({ orientation, interactive: true })}
          >
            {body}
          </button>
        ) : (
          <div data-figma-part="Content" className={stepperContentVariants({ orientation, interactive: false })}>
            {body}
          </div>
        )}
      </li>
    );
  }
);

StepperStep.displayName = 'StepperStep';
