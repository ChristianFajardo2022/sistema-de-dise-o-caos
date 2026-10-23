import { forwardRef, useRef } from 'react';
import type { ReactNode } from 'react';
import { inputFieldVariants } from '../Input/Input.variants';
import { FieldMessage, FieldRow, useField } from '../Field';
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
 * Combobox, ver `Select`) con su propio nombre; el mensaje se asocia a las tres secciones con `aria-describedby` (no al
 * grupo, para que no se lea dos veces al entrar).
 * Teclado: Tab pasa de una sección a otra; flechas, Enter, Espacio, Esc y escribir funcionan como en `Select`.
 * Foco: solo el borde exterior del recuadro, como Figma (Active/Focus solo cambia el trazo de "Input"): pasa a activo con
 * `:focus-within` (como Input); en error y éxito, el anillo de 2 de la base alrededor del recuadro. Las secciones no
 * tienen anillo propio, así que con teclado no se ve qué sección tiene el foco (decisión de producto; WCAG 2.4.7 para
 * diseño).
 * La lista de cada sección se abre bajo todo el recuadro y con su ancho (`anchorRef`).
 * `ref` apunta al primer combobox (el primer control enfocable); `id`, `className`, `rootProps` y el resto de props van a
 * la raíz. `label` es el nombre accesible del grupo (Figma no lo dibuja; cada sección tiene su label visible).
 */
export const TripleSelect = forwardRef<HTMLButtonElement, TripleSelectProps>(
  (
    {
      label,
      fields,
      helperText,
      errorText,
      successText,
      tooltip,
      disabled = false,
      readOnly = false,
      required = false,
      fullWidth = false,
      state = 'default',
      className,
      rootProps,
      id,
      'aria-describedby': ariaDescribedBy,
      ...restProps
    },
    ref
  ) => {
    const base = useField({ id: id ? `${id}-group` : undefined, helperText, errorText, successText, tooltip, state, disabled, readOnly });
    const { ids, message, isDisabled, isReadOnly, isError, isSuccess } = base;
    const groupRef = useRef<HTMLDivElement | null>(null);

    // Prioridad visual: disabled > error > success > burnt-in (readOnly) > state forzado
    const frameState = base.visualState;

    // Cada sección solo necesita saber si flota el label y el color de éste; "active" (lista abierta en el flujo) no aplica
    const fieldState: SelectState = isError
      ? 'error'
      : isSuccess
        ? 'success'
        : // Burnt-In forzado (documentación): como en Figma, label arriba y placeholder a la vista aunque no haya valor
          state === 'filled' || state === 'active' || state === 'burnt-in'
          ? 'filled'
          : 'default';

    // Mensaje y tooltip: en cada sección (no en el grupo, que lo repetiría al entrar)
    const describedBy = base.describedBy(ariaDescribedBy);

    return (
      <div
        {...restProps}
        {...rootProps}
        id={id}
        className={cn(tripleSelectRootVariants({ fullWidth }), rootProps?.className, className)}
      >
        <FieldRow tooltip={tooltip ? { id: ids.tooltip, text: tooltip, disabled: isDisabled } : null}>
          <div
            ref={groupRef}
            role="group"
            aria-label={label}
            data-figma-part="Input"
            // Error y éxito: el anillo de foco del recuadro lo dibuja la base (inputFieldVariants); las secciones no tienen
            className={cn(
              inputFieldVariants({ variant: 'text', state: frameState }),
              tripleSelectFrameVariants({ disabled: isDisabled }),
              selectFrameVariants({ frame: 'field', disabled: isDisabled })
            )}
          >
            {fields.map((field, index) => (
              <FieldSlot key={index} first={index === 0} burntIn={frameState === 'burnt-in'}>
                <Select
                  ref={index === 0 ? ref : undefined}
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
                  required={required}
                  aria-describedby={describedBy}
                  className="min-w-0 flex-1"
                />
              </FieldSlot>
            ))}
          </div>
        </FieldRow>

        <FieldMessage id={ids.message} message={message} />
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
