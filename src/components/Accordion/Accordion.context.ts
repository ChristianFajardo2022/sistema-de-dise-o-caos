import { createContext } from 'react';
import type { AccordionContrast, AccordionHeadingLevel } from './Accordion.types';

export interface AccordionContextValue {
  contrast: AccordionContrast;
  headingLevel: AccordionHeadingLevel;
  /** `false` en `type="single"` con `collapsible={false}`: el ítem abierto no se puede cerrar. */
  canCollapse: boolean;
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
}

/** Contexto del grupo; un `AccordionItem` suelto no lo tiene y lleva su propio estado. */
export const AccordionContext = createContext<AccordionContextValue | null>(null);
