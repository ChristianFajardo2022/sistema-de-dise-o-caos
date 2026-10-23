import { forwardRef, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import type { InputState } from '../Input/Input.types';
import { inputFieldVariants } from '../Input/Input.variants';
import { NotificationText } from '../NotificationText';
import { Select } from '../Select';
import type { SelectState } from '../Select/Select.types';
import { selectFrameVariants } from '../Select/Select.variants';
import { cn } from '../../utils/cn';
import type { TripleSelectProps } from './TripleSelect.types';
import {
  tripleSelectDividerVariants,
  tripleSelectFrameVariants,
  tripleSelectRootVariants,
} from './TripleSelect.variants';

/**
 * TripleSelect del sistema de diseño CAOS: tipo Triple de "General input". Tres `Select` (sin marco propio) dentro de un
 * mismo recuadro, separados por líneas. Es genérico: sirve para fecha (día / mes / año), lugar (departamento / ciudad /
 * barrio) o cualquier terna de listas.
 *
 * Accesibilidad: el recuadro es `role="group"` con nombre (`label`); cada sección es un combobox (patrón APG Select-Only
 * Combobox, ver `Select`) con su propio nombre; el mensaje se asocia a las tres secciones y al grupo con `aria-describedby`.
 * Teclado: Tab pasa de una sección a otra; flechas, Enter, Espacio, Esc y escribir funcionan como en `Select`.
 * Foco: el borde del recuadro pasa a activo con `:focus-within` (como Input); en error y éxito, un anillo de 2.
 * La lista de cada sección se abre bajo todo el recuadro y con su ancho (`anchorRef`).
 * `ref` apunta a la raíz (el mismo nodo que recibe `id`, `className` y el resto de props).
 */
export const TripleSelect = forwardRef<HTMLDivElement, TripleSelectProps>(
  (
    {
      label,
      fields,
      helperText,
      errorText,
      successText,
      disabled = false,
      readOnly = false,
      fullWidth = false,
      state = 'default',
      className,
      id,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const uid = useId();
    const messageId = `${id ?? uid}-message`;
    const groupRef = useRef<HTMLDivElement | null>(null);

    const isDisabled = disabled || state === 'disabled';
    const isReadOnly = readOnly || state === 'burnt-in';
    const isError = Boolean(errorText) || state === 'error';
    const isSuccess = !isError && (Boolean(successText) || state === 'success');

    // Prioridad visual: disabled > error > success > burnt-in (readOnly) > state forzado
    const frameState: InputState = isDisabled
      ? 'disabled'
      : isError
        ? 'error'
        : isSuccess
          ? 'success'
          : isReadOnly
            ? 'burnt-in'
            : state;

    // Cada sección solo necesita saber si flota el label y el color de éste; "active" (lista abierta en el flujo) no aplica
    const fieldState: SelectState = isError
      ? 'error'
      : isSuccess
        ? 'success'
        : state === 'filled' || state === 'active'
          ? 'filled'
          : 'default';

    const message = errorText
      ? { kind: 'error' as const, text: errorText }
      : successText
        ? { kind: 'success' as const, text: successText }
        : helperText
          ? { kind: 'helper' as const, text: helperText }
          : null;
    const describedBy = cn(message && messageId, ariaDescribedBy) || undefined;

    return (
      <div
        {...restProps}
        ref={ref}
        id={id}
        className={cn(tripleSelectRootVariants({ fullWidth }), className)}
      >
        <div
          ref={groupRef}
          role="group"
          aria-label={label}
          aria-describedby={describedBy}
          data-figma-part="Input"
          className={cn(
            inputFieldVariants({ variant: 'text', state: frameState }),
            tripleSelectFrameVariants({ disabled: isDisabled }),
            // Error y éxito no cambian el borde con el foco: anillo de 2 (WCAG 2.4.7)
            selectFrameVariants({ frame: 'field', focusRing: frameState === 'error' || frameState === 'success', disabled: isDisabled })
          )}
        >
          {fields.map((field, index) => (
            <FieldSlot key={index} first={index === 0} burntIn={frameState === 'burnt-in'}>
              <Select
                frame="none"
                anchorRef={groupRef}
                label={field.label}
                optional={field.optional}
                placeholder={field.placeholder}
                options={field.options}
                name={field.name}
                value={field.value}
                defaultValue={field.defaultValue}
                onValueChange={field.onValueChange}
                state={fieldState}
                disabled={isDisabled}
                readOnly={isReadOnly}
                aria-describedby={describedBy}
                className="min-w-0 flex-1"
              />
            </FieldSlot>
          ))}
        </div>

        {/* Región viva siempre montada; vacía no ocupa sitio ni suma gap */}
        <div aria-live="polite" className="empty:absolute">
          {message && (
            <NotificationText id={messageId} state={message.kind === 'success' ? 'confirmation' : message.kind} announce={false}>
              {message.text}
            </NotificationText>
          )}
        </div>
      </div>
    );
  }
);

TripleSelect.displayName = 'TripleSelect';

/** Sección con su línea a la izquierda (salvo la primera). Fragmento: los hijos quedan como hermanos en el recuadro. */
function FieldSlot({ first, burntIn, children }: { first: boolean; burntIn: boolean; children: ReactNode }) {
  return (
    <>
      {!first && <span aria-hidden="true" data-figma-part="Line" className={tripleSelectDividerVariants({ burntIn })} />}
      {children}
    </>
  );
}
