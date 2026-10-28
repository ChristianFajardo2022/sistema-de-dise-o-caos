import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import type { ButtonIconSize, ButtonProps, ButtonSize, ButtonState, ButtonVariant } from './Button.types';
import { buttonVariants } from './Button.variants';
import { Spinner } from '../Spinner';
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

/** Clases de cada medida de ícono. En px: no hay token de estas medidas y la raíz no siempre mide 16px. */
const ICON_SIZE_CLASS: Record<ButtonIconSize, string> = {
  14: 'size-[14px]',
  16: 'size-[16px]',
  20: 'size-[20px]',
  24: 'size-[24px]',
};

/**
 * Medida del ícono según Figma (Icon-sizes): con texto 20 en md y sm y 14 en xs; Icon-single 20 en md y sm y 16 en xs
 * (primary y secondary), o 24 y 20 en tertiary. `iconSize` la reemplaza.
 */
function defaultIconSize(size: ButtonSize, variant: ButtonVariant, iconOnly: boolean, touchTarget = false): ButtonIconSize {
  if (!iconOnly) return size === 'xs' ? 14 : 20;
  if (touchTarget) return 20;
  if (variant === 'tertiary') return size === 'xs' ? 20 : 24;
  return size === 'xs' ? 16 : 20;
}

/**
 * Caja "Content icon" de Icon-single: 16 de ancho (FIXED en Figma) por dimention/button/container/lg · md · xs de alto
 * (responsive). El ícono se centra y puede desbordarla, como en Figma (tertiary xs: ícono de 20 en caja de 16).
 */
const ICON_ONLY_CONTENT: Record<ButtonSize, string> = {
  md: 'w-4 h-ds-dimention-button-container-lg',
  sm: 'w-4 h-ds-dimention-button-container-md',
  xs: 'w-4 h-ds-dimention-button-container-xs',
};

/** Slot de ícono: medida de `iconSize` (o la de Figma por tamaño) y color por token del estado (--btn-icon). */
function IconSlot({ children, sizeClass }: { children: ReactNode; sizeClass: string }) {
  return (
    <span
      data-slot="icon"
      aria-hidden="true"
      className={cn('inline-flex shrink-0 items-center justify-center text-(color:--btn-icon) [&>svg]:size-full', sizeClass)}
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
      fullWidth = false,
      touchTarget = false,
      iconSize,
      href,
      target,
      rel,
      download,
      hrefLang,
      className,
      disabled,
      children,
      type = 'button',
      onClick,
      ...restProps
    },
    ref
  ) => {
    const wantsLoad = loading || state === 'load';
    // Tertiary no tiene Load en Figma: se muestra como Inactive
    const isLoading = wantsLoad && variant !== 'tertiary';
    // Load conserva el foco: usa aria-disabled en vez de disabled. Inactive (y Tertiary, que no tiene Load) usan disabled nativo
    const isDisabled = disabled || state === 'inactive' || (wantsLoad && !isLoading);
    const computedState: ButtonState = isLoading
      ? 'load'
      : isDisabled
        ? 'inactive'
        : state;
    const isUnicolor = unicolor && !iconOnly && (variant === 'secondary' || variant === 'tertiary');
    const showEffect = variant === 'primary' && (computedState === 'default' || computedState === 'hover' || computedState === 'press');

    const icon = iconOnly ? (leftIcon ?? rightIcon ?? children) : null;
    const iconClass = ICON_SIZE_CLASS[iconSize ?? defaultIconSize(size, variant, iconOnly, touchTarget && iconOnly)];
    const isLink = href !== undefined;

    const classes = cn(
      buttonVariants({
        variant,
        contrast,
        unicolor: isUnicolor,
        size,
        state: computedState,
        iconOnly,
        fullWidth,
        touchTarget: touchTarget && iconOnly,
      }),
      // Enlace inactivo: sin :disabled nativo, el cursor va por clase
      isLink && isDisabled && 'cursor-not-allowed',
      className
    );

    const content = (
      <>
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
                {/* Pista del ancho del botón: translateX en % del recorrido, sin animar left */}
                <span className="absolute inset-y-0 left-0 w-full animate-[caos-primary-sweep_3s_linear_infinite]">
                  <EffectUnion className="left-0 top-1/2 -translate-y-1/2" />
                </span>
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

        {/* Contenido sobre el efecto; en Load se oculta con opacity-0 (sigue en el árbol de accesibilidad) y quedan los 3 puntos centrados */}
        <span
          className={cn(
            'relative z-10 inline-flex items-center justify-center gap-ds-space-button-lg',
            iconOnly && (touchTarget ? 'size-full' : ICON_ONLY_CONTENT[size]),
            isLoading && 'opacity-0'
          )}
        >
          {iconOnly ? (
            icon && <IconSlot sizeClass={iconClass}>{icon}</IconSlot>
          ) : (
            <>
              {leftIcon && <IconSlot sizeClass={iconClass}>{leftIcon}</IconSlot>}
              {children && <span className="pb-ds-space-button-sm">{children}</span>}
              {rightIcon && <IconSlot sizeClass={iconClass}>{rightIcon}</IconSlot>}
            </>
          )}
        </span>

        {isLoading && (
          <Spinner
            variant="dots"
            size="md"
            tone="current"
            decorative
            data-slot="load"
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-(color:--btn-icon)"
          />
        )}
        {isLoading && <span className="sr-only"> Cargando</span>}
        {isLink && target === '_blank' && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
      </>
    );

    if (isLink) {
      // Inactive: sin href no navega ni entra en el orden de tabulación; se restituye el rol de enlace.
      // Load: conserva el href (y el foco) con aria-disabled y cancela la navegación.
      const blocked = isDisabled || isLoading;
      return (
        <a
          ref={ref as unknown as Ref<HTMLAnchorElement>}
          href={isDisabled ? undefined : href}
          role={isDisabled ? 'link' : undefined}
          aria-disabled={blocked || undefined}
          aria-busy={wantsLoad || undefined}
          target={target}
          rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
          download={download}
          hrefLang={hrefLang}
          onClick={(e) => {
            if (blocked) {
              e.preventDefault();
              return;
            }
            onClick?.(e as unknown as MouseEvent<HTMLButtonElement>);
          }}
          className={classes}
          {...(restProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isLoading && !isDisabled ? true : undefined}
        aria-busy={wantsLoad || undefined}
        onClick={(e) => {
          // Mientras carga no se dispara el clic ni el submit
          if (isLoading) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
        className={classes}
        {...restProps}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
