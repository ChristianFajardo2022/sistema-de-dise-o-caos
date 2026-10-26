import { forwardRef, useId, useState } from 'react';
import { STAR_RATING_MAX, type IconStarSize, type StarRatingProps } from './Rating.types';
import { starRatingItemClasses, starRatingVariants } from './Rating.variants';
import { IconStar } from './IconStar';
import { cn } from '../../utils/cn';
import { formatRating } from '../../utils/format';

const STAR_PX = { sm: 20, md: 32 } as const satisfies Record<string, IconStarSize>;
const STARS = [1, 2, 3, 4, 5] as const;

const clamp = (n: number) => Math.min(Math.max(Number.isFinite(n) ? n : 0, 0), STAR_RATING_MAX);

/**
 * Puntaje con estrellas. Dos modos:
 * - Solo lectura (por defecto): `role="img"` con "4 de 5 estrellas".
 * - Interactivo (`onChange` o `defaultValue`): grupo de radios nativos (patrón APG Radio Group:
 *   Tab entra al grupo, flechas mueven y seleccionan, foco visible). Al pasar el puntero, las
 *   estrellas hasta la señalada se previsualizan (solo con ratón, `pointerType === 'mouse'`) con el estado `hover` de Figma.
 */
export const StarRating = forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      readOnly = false,
      disabled = false,
      name,
      size = 'sm',
      label,
      className,
      onPointerLeave,
      ...restProps
    },
    ref
  ) => {
    const groupName = useId();
    const [inner, setInner] = useState<number | undefined>(defaultValue);
    const [hover, setHover] = useState(0);
    const px = STAR_PX[size];

    const interactive = !readOnly && (onChange !== undefined || defaultValue !== undefined);
    const current = clamp((value !== undefined ? value : inner) ?? 0);
    const filled = Math.round(current);

    if (!interactive) {
      const text = label ?? `${formatRating(current)} de ${STAR_RATING_MAX} estrellas`;
      return (
        <div
          {...restProps}
          ref={ref}
          role="img"
          aria-label={text}
          className={cn(starRatingVariants({ size }), className)}
        >
          {STARS.map((n) => (
            <IconStar key={n} size={px} state={n <= filled ? 'select' : 'default'} />
          ))}
          {/* Solo lectura con `name`: el valor se conserva en un input oculto para que viaje en el formulario */}
          {name !== undefined && <input type="hidden" name={name} value={current} />}
        </div>
      );
    }

    const choose = (n: number) => {
      if (value === undefined) setInner(n);
      onChange?.(n);
    };

    return (
      <div
        {...restProps}
        ref={ref}
        role="radiogroup"
        aria-label={label ?? 'Calificación'}
        aria-disabled={disabled || undefined}
        className={cn(starRatingVariants({ size, disabled }), className)}
        onPointerLeave={(event) => {
          setHover(0);
          onPointerLeave?.(event);
        }}
      >
        {STARS.map((n) => {
          const state = hover > 0 && !disabled ? (n <= hover ? 'hover' : 'default') : n <= filled ? 'select' : 'default';
          return (
            <label
              key={n}
              className={starRatingItemClasses}
              // Solo el ratón previsualiza: en táctil el pointerenter emulado dejaría la vista previa pegada
              onPointerEnter={(event) => event.pointerType === 'mouse' && !disabled && setHover(n)}
            >
              <input
                type="radio"
                className="sr-only"
                name={name ?? groupName}
                value={n}
                checked={Math.round(current) === n}
                disabled={disabled}
                aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                onChange={() => choose(n)}
              />
              <IconStar size={px} state={state} />
            </label>
          );
        })}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';
