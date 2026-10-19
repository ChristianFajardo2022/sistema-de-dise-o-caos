import { forwardRef } from 'react';
import type { ButtonProps } from './Button.types';
import { buttonVariants } from './Button.variants';
import { Spinner } from '../../icons/Spinner';
import { cn } from '../../utils/cn';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      contrast = 'low',
      size = 'md',
      state = 'default',
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      asChild: _asChild = false,
      className,
      disabled,
      children,
      type = 'button',
      ...restProps
    },
    ref
  ) => {
    const isLoading = loading || state === 'load';
    const isDisabled = disabled || state === 'disabled' || isLoading;
    const computedState = isLoading ? 'load' : disabled ? 'disabled' : state;
    const isForcedHover = state === 'hover';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(
          buttonVariants({
            variant,
            contrast,
            size,
            state: computedState,
            iconOnly,
          }),
          className
        )}
        {...restProps}
      >
        {/* Efecto interior de Primary: Unión booleana de dos círculos con blur 24 y textura de ruido, ciclo de 4 estados por disolución */}
        {variant === 'primary' && !isDisabled && (
          <div
            className={cn(
              'absolute inset-0 pointer-events-none overflow-hidden rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-0',
              isForcedHover && 'opacity-100'
            )}
            aria-hidden="true"
          >
            {/* Fase 1 (Hover): Coordenadas x = -12px, y = 20px */}
            <div
              className="absolute w-[104px] h-[74px] pointer-events-none animate-[dissolve-phase-1_4s_linear_infinite]"
              style={{ left: '-12px', top: '20px' }}
            >
              <svg
                width="104"
                height="74"
                viewBox="0 0 104 74"
                fill="none"
                className="w-[104px] h-[74px]"
                style={{ filter: 'blur(24px)' }}
              >
                <circle cx="30" cy="44" r="30" fill="var(--color-ds-background-effect-button, #ADB0B4)" />
                <circle cx="74" cy="30" r="30" fill="var(--color-ds-background-effect-button, #ADB0B4)" />
              </svg>
            </div>

            {/* Fases 2 y 4 (Hover2 y Hover4): Coordenadas x = -6px, y = 0px */}
            <div
              className="absolute w-[104px] h-[74px] pointer-events-none animate-[dissolve-phase-2-4_4s_linear_infinite]"
              style={{ left: '-6px', top: '0px' }}
            >
              <svg
                width="104"
                height="74"
                viewBox="0 0 104 74"
                fill="none"
                className="w-[104px] h-[74px]"
                style={{ filter: 'blur(24px)' }}
              >
                <circle cx="30" cy="44" r="30" fill="var(--color-ds-background-effect-button, #ADB0B4)" />
                <circle cx="74" cy="30" r="30" fill="var(--color-ds-background-effect-button, #ADB0B4)" />
              </svg>
            </div>

            {/* Fase 3 (Hover3): Coordenadas x = -33px, y = -40px */}
            <div
              className="absolute w-[104px] h-[74px] pointer-events-none animate-[dissolve-phase-3_4s_linear_infinite]"
              style={{ left: '-33px', top: '-40px' }}
            >
              <svg
                width="104"
                height="74"
                viewBox="0 0 104 74"
                fill="none"
                className="w-[104px] h-[74px]"
                style={{ filter: 'blur(24px)' }}
              >
                <circle cx="30" cy="44" r="30" fill="var(--color-ds-background-effect-button, #ADB0B4)" />
                <circle cx="74" cy="30" r="30" fill="var(--color-ds-background-effect-button, #ADB0B4)" />
              </svg>
            </div>

            {/* Textura de ruido (noise) sobre la forma difuminada */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </div>
        )}

        {/* Contenido (texto e iconos) situado en capa superior z-10 */}
        {isLoading ? (
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            <Spinner
              className={cn(
                'shrink-0',
                size === 'xs' || size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
              )}
            />
            {!iconOnly && children && (
              <span className="whitespace-nowrap">{children}</span>
            )}
          </span>
        ) : (
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            {leftIcon && (
              <span className="inline-flex shrink-0 items-center">{leftIcon}</span>
            )}
            {!iconOnly && children && (
              <span className="whitespace-nowrap">{children}</span>
            )}
            {iconOnly && !leftIcon && !rightIcon && children}
            {rightIcon && (
              <span className="inline-flex shrink-0 items-center">{rightIcon}</span>
            )}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';