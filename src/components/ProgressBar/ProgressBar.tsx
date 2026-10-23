import { forwardRef, type CSSProperties } from 'react';
import type { ProgressBarProps } from './ProgressBar.types';
import {
  progressBarBubbleVariants,
  progressBarFillVariants,
  progressBarFloatingClasses,
  progressBarMoveTransition,
  progressBarTextVariants,
  progressBarTrackVariants,
  progressBarVariants,
} from './ProgressBar.variants';
import { cn } from '../../utils/cn';

const defaultFormat = (_value: number, percent: number) => `${Math.round(percent)}%`;

/**
 * Factor de alineación de la burbuja: 0 al inicio, 0.5 centrada (25-75 %), 1 al final.
 * Es continuo, así que la burbuja no salta al animar el valor.
 */
const alignFactor = (fraction: number) =>
  Math.min(2 * fraction, 0.5) + Math.max(0, 2 * fraction - 1.5);

/**
 * Barra de progreso determinada. Usa role="progressbar" sobre un div (y no `<progress>`)
 * porque el texto, la burbuja y el puntero viven dentro del mismo control y `<progress>`
 * no admite hijos visibles.
 */
export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      max = 100,
      type = 'linear-text',
      status = 'default',
      showValue = true,
      formatValue = defaultFormat,
      statusLabel,
      label,
      'aria-labelledby': labelledBy,
      className,
      style,
      ...restProps
    },
    ref
  ) => {
    const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
    const safeValue = Number.isFinite(value) ? Math.min(Math.max(value, 0), safeMax) : 0;
    const fraction = safeValue / safeMax;
    const percent = fraction * 100;
    const text = formatValue(safeValue, percent);
    const valueText = statusLabel ? `${text}, ${statusLabel}` : text;
    const complete = fraction >= 1;
    const atStart = fraction <= 0;

    const cssVars = {
      '--p': percent,
      '--r': alignFactor(fraction),
      ...style,
    } as CSSProperties;

    const fill = (
      <div
        data-figma-part="Bar"
        className={progressBarFillVariants({
          status,
          squareEnd: type === 'linear-text' && !complete,
        })}
      />
    );

    return (
      <div
        {...restProps}
        ref={ref}
        role="progressbar"
        aria-label={label}
        aria-labelledby={labelledBy}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
        aria-valuetext={valueText}
        className={cn(progressBarVariants({ type }), className)}
        style={cssVars}
      >
        <div className={progressBarTrackVariants({ type })}>{fill}</div>

        {showValue && type === 'linear-text' && (
          <span
            aria-hidden="true"
            data-figma-part="Container"
            className={progressBarBubbleVariants({ type })}
          >
            <span data-figma-part="Percentage" className={progressBarTextVariants({ stable: true })}>
              {text}
            </span>
          </span>
        )}

        {showValue && type === 'text-above' && (
          <span aria-hidden="true" className={progressBarFloatingClasses}>
            <span data-figma-part="Container" className={progressBarBubbleVariants({ type })}>
              <span data-figma-part="Percentage" className={progressBarTextVariants()}>
                {text}
              </span>
            </span>
          </span>
        )}

        {showValue && type === 'external-text' && (
          <span aria-hidden="true" className={progressBarFloatingClasses}>
            <span
              data-figma-part="Container"
              className={cn(
                'absolute top-0 left-0 h-[41px] w-fit [translate:calc(var(--r)*-100%)]',
                progressBarMoveTransition
              )}
            >
              <span
                className={cn(
                  progressBarBubbleVariants({ type }),
                  atStart && 'rounded-bl-ds-radius-general-xs',
                  complete && 'rounded-br-ds-radius-general-xs'
                )}
              >
                <span data-figma-part="Percentage" className={progressBarTextVariants()}>
                  {text}
                </span>
              </span>
            </span>
            {/* Puntero y punto: se anclan al progreso y se corren 8 px × --r, igual que la burbuja */}
            {!atStart && !complete && (
              <span
                className={cn(
                  'absolute top-[21px] left-0 block h-2.5 w-2 bg-ds-background-general-gray-sixth [clip-path:polygon(0_0,100%_0,50%_100%)] [translate:calc(var(--r)*-0.5rem)]',
                  progressBarMoveTransition
                )}
              />
            )}
            <span
              data-figma-part="Dot"
              className={cn(
                'absolute top-[33px] left-0 block size-2 rounded-full bg-ds-background-general-gray-sixth [translate:calc(var(--r)*-0.5rem)]',
                progressBarMoveTransition
              )}
            />
          </span>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
