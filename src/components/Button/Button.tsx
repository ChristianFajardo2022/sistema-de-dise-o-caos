import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { ButtonProps, ButtonState } from './Button.types';
import { buttonVariants } from './Button.variants';
import { cn } from '../../utils/cn';

/** Forma "Union" del efecto de Primary: dos círculos con blur 24. */
function EffectUnion({ className }: { className?: string }) {
  return (
    <svg
      width="104"
      height="74"
      viewBox="0 0 104 74"
      fill="none"
      aria-hidden="true"
      className={cn('pointer-events-none absolute h-[74px] w-[104px] blur-[24px]', className)}
    >
      <circle cx="30" cy="44" r="30" fill="var(--color-ds-background-effect-button)" />
      <circle cx="74" cy="30" r="30" fill="var(--color-ds-background-effect-button)" />
    </svg>
  );
}

/**
 * Indicador de Load de Figma: 3 puntos de 8px en una caja de 24×24 (dos arriba, uno abajo
 * al centro), color --btn-icon (icon/button/<tipo>/load). Medidas tomadas de la variante
 * estática; animación según el video del prototipo: el trío gira 120° y se junta/abre alrededor de su centroide, ciclo de 0.667s.
 */
function LoadDots() {
  const dot =
    'absolute size-[8px] rounded-full bg-(--btn-icon) animate-[caos-load-gather_0.667s_ease-in-out_infinite] motion-reduce:animate-none';
  return (
    <span
      data-slot="load"
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 z-10 size-[24px] -translate-x-1/2 -translate-y-1/2"
    >
      {/* origen en el centroide de los puntos (12px, 8.62px); triángulo equilátero para que el giro de 120° coincida */}
      <span className="absolute inset-0 origin-[12px_8.62px] animate-[caos-load-turn_0.667s_ease-in-out_infinite] motion-reduce:animate-none">
        <span className={cn(dot, 'left-0 top-0 [--dx:8px] [--dy:4.62px]')} />
        <span className={cn(dot, 'right-0 top-0 [--dx:-8px] [--dy:4.62px]')} />
        <span className={cn(dot, 'top-[13.86px] left-[8px] [--dx:0px] [--dy:-9.24px]')} />
      </span>
    </span>
  );
}

/** Slot de ícono: 20×20 y color por token del estado (--btn-icon). En px: no hay token de 20 y la raíz no siempre mide 16px. */
function IconSlot({ children }: { children: ReactNode }) {
  return (
    <span
      data-slot="icon"
      aria-hidden="true"
      className="inline-flex size-[20px] shrink-0 items-center justify-center text-(color:--btn-icon) [&>svg]:size-full"
    >
      {children}
    </span>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      contrast = 'low',
      unicolor = false,
      size = 'md',
      state = 'default',
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      className,
      disabled,
      children,
      type = 'button',
      ...restProps
    },
    ref
  ) => {
    const wantsLoad = loading || state === 'load';
    // Tertiary no tiene Load en Figma: se muestra como Inactive
    const isLoading = wantsLoad && variant !== 'tertiary';
    const isDisabled = disabled || state === 'inactive' || wantsLoad;
    const computedState: ButtonState = isLoading
      ? 'load'
      : isDisabled
        ? 'inactive'
        : state;
    const isUnicolor = unicolor && !iconOnly && (variant === 'secondary' || variant === 'tertiary');
    const showEffect = variant === 'primary' && (computedState === 'default' || computedState === 'hover' || computedState === 'press');

    const icon = iconOnly ? (leftIcon ?? rightIcon ?? children) : null;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={wantsLoad || undefined}
        className={cn(
          buttonVariants({
            variant,
            contrast,
            unicolor: isUnicolor,
            size,
            state: computedState,
            iconOnly,
          }),
          className
        )}
        {...restProps}
      >
        {showEffect && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-ds-radius-button-full"
          >
            {/* Hover: la forma Union recorre el botón de izquierda a derecha en una sola fase (3s, sin retroceso) */}
            {computedState !== 'press' && (
              <span
                className={cn(
                  'absolute inset-0 transition-opacity duration-300 ease-out',
                  '*:[animation-play-state:paused] group-hover:*:[animation-play-state:running] motion-reduce:*:animate-none',
                  computedState === 'hover'
                    ? 'opacity-100 *:[animation-play-state:running]'
                    : 'opacity-0 group-hover:opacity-100 group-active:opacity-0'
                )}
              >
                <EffectUnion className="top-1/2 -translate-y-1/2 animate-[caos-primary-sweep_3s_linear_infinite]" />
              </span>
            )}

            {/* Press: la forma Union queda fija abajo a la derecha */}
            <span
              className={cn(
                'absolute inset-0 transition-opacity duration-300 ease-out',
                computedState === 'press' ? 'opacity-100' : 'opacity-0 group-active:opacity-100'
              )}
            >
              <EffectUnion className="right-[-0.5px] top-[calc(50%+29px)] -translate-y-1/2" />
            </span>

            {/* Textura de ruido sobre la forma difuminada */}
            <span
              className={cn(
                'absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 ease-out',
                computedState === 'default' ? 'group-hover:opacity-30' : 'opacity-30'
              )}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </span>
        )}

        {/* Trazo interior de Primary por encima del efecto: stroke/dm (0.5px), o --btn-stroke-w en Focus (stroke/lg) */}
        {variant === 'primary' && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] text-(color:--btn-stroke) shadow-[inset_0_0_0_var(--btn-stroke-w,var(--ds-primitives-stroke-dm))_currentColor] transition-colors duration-300 ease-out"
          />
        )}

        {/* Contenido sobre el efecto; en Load se oculta y quedan los 3 puntos centrados */}
        <span
          className={cn(
            'relative z-10 inline-flex items-center justify-center gap-ds-space-button-lg',
            isLoading && 'invisible'
          )}
        >
          {iconOnly ? (
            icon && <IconSlot>{icon}</IconSlot>
          ) : (
            <>
              {leftIcon && <IconSlot>{leftIcon}</IconSlot>}
              {children && <span className="pb-ds-space-button-sm">{children}</span>}
              {rightIcon && <IconSlot>{rightIcon}</IconSlot>}
            </>
          )}
        </span>

        {isLoading && <LoadDots />}
        {isLoading && <span className="sr-only">Cargando</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
