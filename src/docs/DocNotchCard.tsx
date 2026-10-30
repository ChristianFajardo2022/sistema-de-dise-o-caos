import type { ReactNode } from 'react';
import { Icon } from '../components/Icon';
import { NotchedSurface } from '../components/_internal/NotchedSurface';
import { cn } from '../utils/cn';

interface DocNotchCardProps {
  /** `success` (verifica) o `error` (cierre) en el distintivo de la muesca. */
  tone: 'success' | 'error';
  children: ReactNode;
  className?: string;
}

// Figma: 22627:8505 (Cuando usarlo), 22627:8523 (Cuando evitarlo; distintivo error/tertiary + close-circle)
/**
 * Card con muesca arriba a la derecha ("Card/Simple/On canva/Default"): superficie `NotchedSurface` de 48 (corner de
 * 40), relleno default-on-canva, padding `space/container/on-canva-stretch` y 24 entre piezas. El distintivo de la
 * muesca (40: padding 12 + ícono 16) es decorativo: el título de la tarjeta ya dice qué es.
 */
export function DocNotchCard({ tone, children, className }: DocNotchCardProps) {
  const success = tone === 'success';
  return (
    <div
      className={cn(
        // Ancho entero y borde derecho en un píxel exacto (la primera tarjeta pegada a la izquierda de su celda y la segunda a
        // la derecha): con medio píxel, las teselas de la máscara de la muesca dejan líneas finas en las uniones
        'relative isolate flex w-[round(down,100%,1px)] min-w-0 flex-col gap-ds-space-general-3xl p-ds-space-container-on-canva-stretch odd:justify-self-start even:justify-self-end',
        className,
      )}
    >
      <NotchedSurface notch="md" shadow="on-canva" fill="var(--color-ds-background-container-default-on-canva)" />
      {children}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-0 right-0 flex size-10 items-center justify-center rounded-ds-radius-general-full text-ds-text-neutral-white-unicolor',
          success ? 'bg-ds-background-semantic-success-fourth' : 'bg-ds-background-semantic-error-tertiary',
        )}
      >
        <Icon name={success ? 'verify' : 'close-circle'} size={16} variant="fill" />
      </span>
    </div>
  );
}

/** Título de Card (Heading-md-600): Prospero semibold 20/24 en el color del tono. */
export function DocNotchTitle({ tone, children }: { tone: 'success' | 'error'; children: ReactNode }) {
  return (
    <h3
      className={cn(
        'm-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg font-ds-primitives-typography-weight-semibold',
        tone === 'success' ? 'text-ds-text-semantic-success-secondary' : 'text-ds-text-semantic-error-secondary',
      )}
    >
      {children}
    </h3>
  );
}
