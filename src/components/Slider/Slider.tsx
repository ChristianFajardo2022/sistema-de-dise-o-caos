import { forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ForwardedRef, KeyboardEvent, PointerEvent, ReactElement, Ref } from 'react';
import type { SliderProps, SliderThumbAppearance, SliderValue } from './Slider.types';
import {
  sliderRangeVariants,
  sliderRootVariants,
  sliderThumbVariants,
  sliderTrackVariants,
  sliderValueTextVariants,
} from './Slider.variants';
import { clamp, closestThumb, directionalKey, pageStep, snapToStep, toPercent, valueForKey } from './Slider.utils';
import { useMergedRefs } from '../../utils/refs';
import { cn } from '../../utils/cn';

const DEFAULT_THUMB_LABELS: [string, string] = ['Mínimo', 'Máximo'];

/**
 * Posición del centro de un pulgar desde el inicio de la pista (`inset-inline-start`: la izquierda, o la derecha en una
 * página de derecha a izquierda): recorre la pista sin que el pulgar se salga de ella.
 */
const thumbPosition = (percent: number) =>
  `calc(var(--slider-thumb) / 2 + (100% - var(--slider-thumb)) * ${percent / 100})`;

function toList(value: SliderValue | undefined, min: number, max: number, range: boolean): number[] {
  if (Array.isArray(value)) {
    const [a, b] = value.map((v) => clamp(v, min, max));
    return a <= b ? [a, b] : [b, a];
  }
  if (value === undefined) return range ? [min, max] : [min];
  return [clamp(value, min, max)];
}

function SliderInner<T extends SliderValue>(
  {
    min = 0,
    max = 100,
    step = 1,
    value: valueProp,
    defaultValue,
    onValueChange,
    onValueCommit,
    showValue = false,
    formatValue,
    disabled = false,
    thumbLabels = DEFAULT_THUMB_LABELS,
    name,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    ...restProps
  }: SliderProps<T>,
  ref: ForwardedRef<HTMLSpanElement>
) {
  const isRange = Array.isArray(valueProp ?? defaultValue);
  const controlled = valueProp !== undefined;
  const [inner, setInner] = useState(() => toList(defaultValue, min, max, isRange));
  const values = controlled ? toList(valueProp, min, max, isRange) : inner;
  const appearance: SliderThumbAppearance = showValue ? 'number' : isRange ? 'range' : 'simple';

  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const thumbRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const setFirstThumb = useCallback((node: HTMLSpanElement | null) => {
    thumbRefs.current[0] = node;
  }, []);
  const setSecondThumb = useCallback((node: HTMLSpanElement | null) => {
    thumbRefs.current[1] = node;
  }, []);
  const firstThumbRef = useMergedRefs<HTMLSpanElement>(ref, setFirstThumb);
  // Valores vigentes durante un arrastre (el estado de React llega un render más tarde)
  const latest = useRef(values);
  useLayoutEffect(() => {
    latest.current = values;
  });
  // `index: null`: arrastre desde dos pulgares juntos; se elige con la dirección del primer movimiento
  const drag = useRef<{ index: number | null; startX: number; changed: boolean } | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const output = (list: number[]) => (isRange ? [list[0], list[1]] : list[0]) as T;
  const format = (v: number) => (formatValue ? formatValue(v) : String(v));

  /** Mueve un pulgar a `raw` (redondeado al paso y sin cruzar al otro). Devuelve si cambió. */
  const update = (index: number, raw: number) => {
    const next = [...latest.current];
    let v = snapToStep(raw, min, max, step);
    if (isRange) v = index === 0 ? Math.min(v, next[1]) : Math.max(v, next[0]);
    if (v === next[index]) return false;
    next[index] = v;
    latest.current = next;
    if (!controlled) setInner(next);
    onValueChange?.(output(next));
    return true;
  };

  /** De derecha a izquierda (atributo `dir` o CSS `direction`): el valor crece hacia la izquierda. */
  const isRtl = () => (rootRef.current ? getComputedStyle(rootRef.current).direction === 'rtl' : false);

  const valueFromPointer = (clientX: number, index: number) => {
    const track = trackRef.current;
    if (!track) return latest.current[index];
    const rect = track.getBoundingClientRect();
    const thumb = thumbRefs.current[index]?.offsetHeight ?? 0;
    const usable = rect.width - thumb;
    const fromStart = isRtl() ? rect.right - clientX : clientX - rect.left;
    const ratio = usable > 0 ? (fromStart - thumb / 2) / usable : 0;
    return min + clamp(ratio, 0, 1) * (max - min);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (event.defaultPrevented || disabled || event.button !== 0) return;
    const fromThumb = (event.target as HTMLElement).closest<HTMLElement>('[data-slider-thumb]');
    let index = fromThumb ? Number(fromThumb.dataset.sliderThumb) : 0;
    if (isRange && !fromThumb) {
      const target = valueFromPointer(event.clientX, 0);
      index = closestThumb([latest.current[0], latest.current[1]], target, max);
    }
    // Sin selección de texto; el foco va al pulgar que se mueve
    event.preventDefault();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Un puntero sintético (pruebas) no siempre se puede capturar: el arrastre sigue funcionando sobre la raíz
    }
    // Sobre dos pulgares juntos no se sabe cuál mover hasta ver hacia dónde va el arrastre (mismo criterio que la pista)
    if (isRange && fromThumb && latest.current[0] === latest.current[1]) {
      drag.current = { index: null, startX: event.clientX, changed: false };
      return;
    }
    thumbRefs.current[index]?.focus();
    drag.current = { index, startX: event.clientX, changed: update(index, valueFromPointer(event.clientX, index)) };
    setActive(index);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const current = drag.current;
    if (!current) return;
    if (current.index === null) {
      if (event.clientX === current.startX) return;
      // Hacia el final del rango, el máximo; hacia el inicio, el mínimo
      const towardsEnd = isRtl() ? event.clientX < current.startX : event.clientX > current.startX;
      current.index = towardsEnd ? 1 : 0;
      thumbRefs.current[current.index]?.focus();
      setActive(current.index);
    }
    if (update(current.index, valueFromPointer(event.clientX, current.index))) current.changed = true;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (current.changed) onValueCommit?.(output(latest.current));
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    const list = latest.current;
    // En un rango, Inicio/Fin llevan el pulgar hasta donde lo deja el otro
    const lower = isRange && index === 1 ? list[0] : min;
    const upper = isRange && index === 0 ? list[1] : max;
    const key = directionalKey(event.key, isRtl());
    const next = valueForKey(key, list[index], { min: lower, max: upper, step, page: pageStep(min, max, step) });
    if (next === null) return;
    event.preventDefault();
    setActive(index);
    if (update(index, next)) onValueCommit?.(output(latest.current));
  };

  const percents = values.map((v) => toPercent(v, min, max));
  const rangeStyle = isRange
    ? { insetInlineStart: thumbPosition(percents[0]), width: `calc((100% - var(--slider-thumb)) * ${(percents[1] - percents[0]) / 100})` }
    : { insetInlineStart: 0, width: thumbPosition(percents[0]) };
  const groupName = ariaLabel;

  return (
    <div
      {...restProps}
      ref={rootRef}
      role={isRange ? 'group' : undefined}
      aria-label={isRange ? groupName : undefined}
      aria-labelledby={isRange ? ariaLabelledBy : undefined}
      aria-disabled={isRange && disabled ? true : undefined}
      data-disabled={disabled ? '' : undefined}
      className={cn(sliderRootVariants({ appearance, disabled }), className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        endDrag(event);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        endDrag(event);
      }}
    >
      <span ref={trackRef} data-figma-part="Shape" className={sliderTrackVariants()}>
        <span data-figma-part="Form" className={sliderRangeVariants()} style={rangeStyle} />
      </span>
      {values.map((v, index) => {
        // Pulgares juntos al final: el mínimo queda arriba para poder moverlo de vuelta
        const onTop = active === index || (isRange && index === 0 && values[0] === values[1] && values[0] >= max);
        return (
          <span
            key={index}
            ref={index === 0 ? firstThumbRef : setSecondThumb}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={isRange ? thumbLabels[index] : groupName}
            aria-labelledby={isRange ? undefined : ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-valuemin={isRange && index === 1 ? values[0] : min}
            aria-valuemax={isRange && index === 0 ? values[1] : max}
            aria-valuenow={v}
            aria-valuetext={formatValue ? formatValue(v) : undefined}
            aria-orientation="horizontal"
            aria-disabled={disabled ? true : undefined}
            data-slider-thumb={index}
            data-figma-part={showValue ? 'Number' : 'Rectangle 2'}
            className={sliderThumbVariants({ appearance, disabled })}
            style={{ insetInlineStart: thumbPosition(percents[index]), zIndex: onTop ? 2 : 1 }}
            onKeyDown={handleKeyDown(index)}
            onBlur={() => setActive((current) => (current === index ? null : current))}
          >
            {showValue && (
              <span data-figma-part="00" aria-hidden className={sliderValueTextVariants()}>
                {format(v)}
              </span>
            )}
          </span>
        );
      })}
      {name != null &&
        values.map((v, index) => <input key={index} type="hidden" name={name} value={v} disabled={disabled} />)}
    </div>
  );
}

/**
 * Slider con los patrones APG Slider y Multi-thumb slider. Un número en `value`/`defaultValue` da un pulgar
 * (Simple); un par `[a, b]`, dos pulgares que no se cruzan (Range). Teclado: flechas, RePág/AvPág, Inicio/Fin.
 * Puntero: arrastre con captura y clic en la pista (mueve el pulgar más cercano; con los dos pulgares juntos, el del
 * lado hacia el que se arrastra). De derecha a izquierda (`dir="rtl"` en la raíz o un ancestro) la pista, el arrastre
 * y las flechas se invierten. Nombre accesible con `aria-label` o `aria-labelledby` (Figma no dibuja etiqueta: si va
 * en un formulario, la etiqueta visible la pone la pantalla y se enlaza con `aria-labelledby`).
 */
export const Slider = forwardRef(SliderInner) as (<T extends SliderValue = number>(
  props: SliderProps<T> & { ref?: Ref<HTMLSpanElement> }
) => ReactElement | null) & { displayName?: string };

Slider.displayName = 'Slider';
