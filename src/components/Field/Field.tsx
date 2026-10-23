import type { LabelHTMLAttributes, ReactNode } from 'react';
import type { FieldMessageData } from './Field.types';
import { FIELD_FOCUS_RING, FIELD_ICON_SLOT } from './Field.utils';
import { inputLabelVariants } from '../Input/Input.variants';
import { Icon } from '../Icon';
import { NotificationText } from '../NotificationText';
import type { NotificationTextProps } from '../NotificationText/NotificationText.types';
import { cn } from '../../utils/cn';

/**
 * Base común de los controles de formulario (Input, Textarea, Select, DatePicker, TimePicker, PhoneInput, TripleSelect,
 * CodeInput, InlineField, NumberPicker). Interna: no se exporta desde la librería.
 *
 * - `useField`: ids (control, label, mensaje, tooltip), estado visual con la misma prioridad en todos
 *   (disabled > error > success > burnt-in > `state`), el mensaje (error > éxito > ayuda) y `describedBy`.
 * - `FieldMessage`: el mensaje con NotificationText dentro de **una** región viva `aria-live="polite"` siempre montada
 *   (vacía no ocupa sitio ni suma gap). Ningún control usa `role="alert"`: el error se anuncia por la región y se lee
 *   con `aria-describedby` al volver al campo.
 * - `FieldTooltip`: el texto sr-only (lo referencia `aria-describedby` del control) y el botón del ícono de información.
 * - `FieldRow`: fila del campo + tooltip.
 * - `FieldLabel`: label flotante de Input (`inputLabelVariants`) con el sufijo " | Opcional".
 * - El marco es `inputFieldVariants` (Input): alto, padding y radio se ajustan con `className` (cn() resuelve el
 *   conflicto con las utilidades ds-, sin `!`).
 */
export interface FieldMessageProps extends Omit<NotificationTextProps, 'children' | 'state' | 'id' | 'announce'> {
  /** id del mensaje (lo referencia `aria-describedby`). */
  id: string;
  message: FieldMessageData | null;
  /** Clases de la región viva. */
  regionClassName?: string;
}

/** Región viva (siempre montada) con el mensaje del campo. */
export function FieldMessage({ id, message, regionClassName, ...rest }: FieldMessageProps) {
  return (
    <div aria-live="polite" className={cn('empty:absolute', regionClassName)}>
      {message && (
        <NotificationText {...rest} id={id} state={message.kind} announce={false}>
          {message.text}
        </NotificationText>
      )}
    </div>
  );
}

export interface FieldTooltipProps {
  id: string;
  text: string;
  disabled?: boolean;
  /** Ícono propio (por defecto `info-circle` de la biblioteca). */
  icon?: ReactNode;
}

/** Ícono de información fuera del campo: el texto queda sr-only para `aria-describedby` y como nombre del botón. */
export function FieldTooltip({ id, text, disabled = false, icon }: FieldTooltipProps) {
  return (
    <>
      <span id={id} className="sr-only">
        {text}
      </span>
      <button
        type="button"
        aria-label={text}
        title={text}
        className={cn(
          FIELD_ICON_SLOT,
          'cursor-help rounded-sm border-0 bg-transparent p-0',
          FIELD_FOCUS_RING,
          disabled ? '[--ico:var(--color-ds-icon-general-disabled-positive)]' : '[--ico:var(--color-ds-icon-general-white)]'
        )}
      >
        {icon ?? <Icon name="info-circle" size={16} variant="fill" />}
      </button>
    </>
  );
}

export interface FieldRowProps {
  children: ReactNode;
  tooltip?: FieldTooltipProps | null;
  /**
   * Dibuja la fila aunque no haya tooltip (Input, Select, DatePicker y Textarea siempre la tuvieron). Sin ella y sin
   * tooltip, los hijos van sueltos; con tooltip, los hijos ocupan el ancho libre.
   */
  always?: boolean;
  className?: string;
}

/** Fila: el campo y, a su derecha, el tooltip (gap 8). */
export function FieldRow({ children, tooltip, always = false, className }: FieldRowProps) {
  if (!tooltip && !always) return <>{children}</>;
  return (
    <div className={cn('flex items-center gap-ds-space-general-lg', className)}>
      {always ? children : <div className="min-w-0 flex-1">{children}</div>}
      {tooltip && <FieldTooltip {...tooltip} />}
    </div>
  );
}

export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Siempre arriba (estados forzados, valor elegido, foco o lista abierta). Si no, sube en CSS con foco o valor. */
  float?: boolean;
  /** Agrega " | Opcional". */
  optional?: boolean;
  /** Clases del sufijo " | Opcional". */
  optionalClassName?: string;
}

/** Label flotante de Input con el sufijo opcional. Debe ir después del control (`peer`). */
export function FieldLabel({ float = false, optional = false, optionalClassName, className, children, ...rest }: FieldLabelProps) {
  return (
    <label {...rest} className={cn(inputLabelVariants({ float: float ? 'always' : 'auto' }), className)}>
      {children}
      {optional && (
        <span data-figma-part="| Opcional" className={cn('text-ds-text-acent-firts', optionalClassName)}>
          {' | Opcional'}
        </span>
      )}
    </label>
  );
}
