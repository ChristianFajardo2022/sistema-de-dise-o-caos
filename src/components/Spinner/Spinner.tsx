import { forwardRef } from 'react';
import type { SpinnerProps, SpinnerSize, SpinnerTone, SpinnerType } from './Spinner.types';
import { dotMotion, dotOrder, dotSlots, ringBase, ringTone, spinnerVariants } from './Spinner.variants';
import { cn } from '../../utils/cn';

/** Fotograma: ring solo tiene 1 y 2; el 3 se trata como 1 */
function Ring({ type, tone, animated }: { type: SpinnerType; tone: SpinnerTone; animated: boolean }) {
  const outerBright = type !== '2';
  // Los dos anillos laten en contrafase; con reduced-motion el pulso es más lento
  const pulse = animated ? 'animate-pulse [animation-duration:1.2s] motion-reduce:[animation-duration:3s]' : '';
  return (
    <span data-figma-part="Elipses" className="absolute inset-0">
      <span
        data-figma-part={outerBright ? 'Ellipse 1' : 'Ellipse 2'}
        className={cn(
          ringBase,
          'size-full',
          outerBright ? ringTone.bright[tone] : ringTone.muted[tone],
          pulse
        )}
      />
      <span
        data-figma-part={outerBright ? 'Ellipse 2' : 'Ellipse 1'}
        className={cn(
          ringBase,
          'size-ds-dimention-icono-s',
          outerBright ? ringTone.muted[tone] : ringTone.bright[tone],
          pulse,
          animated && '[animation-delay:-0.6s]'
        )}
      />
    </span>
  );
}

function Dots({
  type,
  size,
  tone,
  animated,
}: {
  type: SpinnerType;
  size: SpinnerSize;
  tone: SpinnerTone;
  animated: boolean;
}) {
  const slots = dotSlots[size];
  const motion = dotMotion[size];
  const dotSize = size === 'md' ? 'size-2' : 'size-[6px]';
  const color = tone === 'current' ? 'bg-current' : 'bg-ds-background-general-white';
  const order = dotOrder[type];
  const names = ['Ellipse 6', 'Ellipse 7', 'Ellipse 8'];

  const dots = order.map((slot, i) => (
    <span
      key={names[i]}
      data-figma-part={names[i]}
      className={cn(
        'absolute rounded-full',
        dotSize,
        color,
        animated && slot === 'b' ? motion.bottom : slots[slot],
        animated && [
          motion[slot],
          'animate-[caos-load-gather_0.667s_ease-in-out_infinite]',
          // reduced-motion: sin giro ni desplazamiento, pulso suave escalonado
          'motion-reduce:animate-pulse motion-reduce:[animation-duration:2s]',
          i === 1 && 'motion-reduce:[animation-delay:-0.66s]',
          i === 2 && 'motion-reduce:[animation-delay:-1.33s]',
        ]
      )}
    />
  ));

  if (!animated) return <>{dots}</>;
  return (
    <span
      className={cn(
        'absolute inset-0 animate-[caos-load-turn_0.667s_ease-in-out_infinite] motion-reduce:animate-none',
        motion.origin
      )}
    >
      {dots}
    </span>
  );
}

/**
 * Indicador de carga. `variant="ring"` es el Spinner de Figma (dos anillos) y
 * `variant="dots"` es el Spinner button (tres puntos, a la medida de los botones).
 * Por defecto es una región `role="status"` con el nombre "Cargando"; con `decorative`
 * queda oculto a lectores de pantalla.
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      variant = 'ring',
      type = '1',
      size = 'md',
      tone = 'default',
      label = 'Cargando',
      decorative = false,
      animated = true,
      className,
      ...restProps
    },
    ref
  ) => {
    const a11y = decorative
      ? { 'aria-hidden': true as const }
      : { role: 'status' as const, 'aria-label': label };
    return (
      <span
        ref={ref}
        {...a11y}
        {...restProps}
        className={cn(spinnerVariants({ variant, size }), className)}
      >
        {variant === 'ring' ? (
          <Ring type={type} tone={tone} animated={animated} />
        ) : (
          <Dots type={type} size={size} tone={tone} animated={animated} />
        )}
        {!decorative && <span className="sr-only">{label}</span>}
      </span>
    );
  }
);

Spinner.displayName = 'Spinner';
