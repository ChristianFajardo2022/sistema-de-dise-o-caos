import { createContext, useContext } from 'react';
import type { StepperOrientation, StepperStatusLabels } from './Stepper.types';

export const DEFAULT_STATUS_LABELS: StepperStatusLabels = {
  incomplete: 'Pendiente',
  'in-progress': 'En curso',
  complete: 'Completado',
  error: 'Con error',
};

interface StepperContextValue {
  orientation: StepperOrientation;
  statusLabels: StepperStatusLabels;
}

const StepperContext = createContext<StepperContextValue>({
  orientation: 'vertical',
  statusLabels: DEFAULT_STATUS_LABELS,
});

export const StepperProvider = StepperContext.Provider;
export const useStepperContext = () => useContext(StepperContext);
