import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { BREAKPOINT_VARS } from './breakpoints.generated';
import type { DocBreakpointName } from './breakpoints.generated';

interface DocDeviceFrameProps {
  /**
   * Breakpoint cuyos valores responsive se aplican dentro del marco. Los tokens responsive van por media query (según el
   * ancho de la ventana); el marco fija en línea las variables `--ds-responsive-*` de este breakpoint, así el
   * componente se dibuja con sus medidas de Mobile, Tablet o Desktop sin importar el ancho de la página.
   */
  breakpoint: DocBreakpointName;
  /** `top`: solo el borde superior redondeado y pegado al fondo del panel (Do / Don't); `all`: marco completo. */
  rounding?: 'top' | 'all';
  /** Barra de estado de teléfono: la hora "9:41" y la isla dinámica (pastilla de 125×37). Sin íconos de señal. */
  statusBar?: boolean;
  children: ReactNode;
  className?: string;
}

// Figma: 22627:8505 (marco de dispositivo de Do/Don't), 22648:12735 (Mobile)
/**
 * Marco de dispositivo: `background/container/surface` con radio `radius/general/2xl` (24) y, dentro, un panel
 * `default-on-canva` de radio 8 y padding 16 donde va el componente real. Sin barra de estado.
 */
export function DocDeviceFrame({ breakpoint, rounding = 'all', statusBar = false, children, className }: DocDeviceFrameProps) {
  return (
    <div
      data-breakpoint={breakpoint}
      style={BREAKPOINT_VARS[breakpoint] as CSSProperties}
      className={cn(
        'flex w-full min-w-0 flex-col bg-ds-background-container-surface p-ds-space-general-lg',
        rounding === 'top' ? 'rounded-t-ds-radius-general-2xl pb-0' : 'rounded-ds-radius-general-2xl',
        statusBar && 'min-h-48',
        className,
      )}
    >
      {statusBar && (
        // Figma: fila de la barra de estado (hora a la izquierda, isla dinámica al centro); decorativa
        <div aria-hidden="true" className="relative flex h-ds-primitives-dimention-4xl shrink-0 items-center px-ds-space-general-4xl">
          <span className="font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-lg leading-ds-primitives-typography-line-height-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading tabular-nums">
            9:41
          </span>
          <span className="absolute top-1/2 left-1/2 h-[37px] w-[125px] -translate-x-1/2 -translate-y-1/2 rounded-ds-radius-general-full bg-ds-background-general-black-unicolor shadow-[inset_0_0_0_1px_var(--color-ds-border-general-default-on-canva)]" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col items-start justify-start gap-ds-space-general-2xl overflow-hidden rounded-ds-radius-general-lg bg-ds-background-container-default-on-canva p-ds-space-general-2xl">
        {children}
      </div>
    </div>
  );
}
