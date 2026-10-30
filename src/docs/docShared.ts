import { createContext } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

/** Texto del cuerpo con el marcado en línea permitido (`strong`, `code`, `em`). */
export const docInline =
  '[&_strong]:font-ds-primitives-typography-weight-semibold [&_strong]:text-ds-text-neutral-heading [&_code]:rounded-ds-radius-general-sm [&_code]:bg-ds-background-icon-default-on-canva [&_code]:px-ds-space-general-md [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-ds-text-neutral-heading';

export const docBody = cn(
  'm-0 font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-xl text-ds-text-neutral-body text-pretty',
  docInline,
);

/** Título de la sección para las tarjetas que lo llevan adentro (`titleInside`). */
export interface DocSectionHead {
  headingId: string;
  title: string;
  description?: ReactNode;
}
export const DocSectionHeadContext = createContext<DocSectionHead | null>(null);

