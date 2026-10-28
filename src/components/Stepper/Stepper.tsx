import { Children, cloneElement, forwardRef, isValidElement, useMemo } from 'react';
import type { ReactElement } from 'react';
import { cn } from '../../utils/cn';
import { StepperStep } from './StepperStep';
import { DEFAULT_STATUS_LABELS, StepperProvider } from './StepperContext';
import type { StepperProps, StepperStatus, StepperStepProps } from './Stepper.types';
import { stepperVariants } from './Stepper.variants';

/** Estado que corresponde al índice `i` cuando hay un paso en curso. */
function derive(i: number, current: number | undefined): StepperStatus | undefined {
  if (current === undefined) return undefined;
  if (i < current) return 'complete';
  return i === current ? 'in-progress' : 'incomplete';
}

/**
 * Stepper de CAOS: lista ordenada de pasos (`<ol>`). `current` deriva los estados (completo antes, en curso, incompleto
 * después) y `status` por paso fuerza uno, p. ej. `error`. Con `onStepClick` cada paso es un botón.
 */
export const Stepper = forwardRef<HTMLOListElement, StepperProps>(
  ({ steps, children, current, orientation = 'vertical', onStepClick, statusLabels, className, ...rest }, ref) => {
    const labels = useMemo(() => ({ ...DEFAULT_STATUS_LABELS, ...statusLabels }), [statusLabels]);

    const stepProps = (i: number, own: StepperStepProps): StepperStepProps => ({
      ...own,
      status: own.status ?? derive(i, current) ?? 'incomplete',
      current: own.current ?? (current === undefined ? undefined : i === current),
      onClick: own.onClick ?? (onStepClick ? () => onStepClick(i) : undefined),
    });

    const items = steps
      ? steps.map((step, i) => <StepperStep key={i} {...stepProps(i, step)} />)
      : Children.toArray(children).map((child, i) =>
          isValidElement(child) ? cloneElement(child as ReactElement<StepperStepProps>, stepProps(i, (child as ReactElement<StepperStepProps>).props)) : child
        );

    return (
      <StepperProvider value={{ orientation, statusLabels: labels }}>
        <ol {...rest} ref={ref} data-orientation={orientation} className={cn(stepperVariants({ orientation }), className)}>
          {items}
        </ol>
      </StepperProvider>
    );
  }
);

Stepper.displayName = 'Stepper';
