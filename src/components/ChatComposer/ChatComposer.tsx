import { forwardRef, useId, useState } from 'react';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import type { ChatComposerProps } from './ChatComposer.types';
import {
  chatComposerBottomRowVariants,
  chatComposerFieldVariants,
  chatComposerGroupVariants,
  chatComposerSendInlineVariants,
  chatComposerTextareaVariants,
  chatComposerTopRowVariants,
  chatComposerVariants,
} from './ChatComposer.variants';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/** Button xs: Figma dibuja el ícono a 16 (Button lo dibuja a 20 en todos los tamaños). Mismo recurso que FileCard. */
const SMALL_ICON = '[&_[data-slot=icon]]:size-4';

/**
 * Campo para escribir de la conversación (set "Audio (Atom)" de Figma, 14894:2745). Es un `<form>`: Enter o el botón
 * Enviar llaman a `onSend`; Shift+Enter hace un salto de línea (y Enter no envía mientras un IME está componiendo, también
 * en Safari). Enviar queda habilitado con el campo vacío y no hace nada (no envía mensajes vacíos). El `<textarea>` tiene
 * una etiqueta sr-only (`label`) y crece con el texto hasta 7 líneas con `field-sizing: content` (mejora progresiva: en
 * navegadores sin soporte, como Firefox, queda en 2 filas con desplazamiento). Con `audio` muestra el audio grabado en
 * lugar del campo. El `ref` va al `<textarea>` (es `null` mientras hay `audio`, porque el campo no se monta).
 */
export const ChatComposer = forwardRef<HTMLTextAreaElement, ChatComposerProps>(
  (
    {
      value: valueProp,
      defaultValue = '',
      onValueChange,
      onSend,
      placeholder = 'Escribe un mensaje...',
      label = 'Mensaje',
      sendLabel = 'Enviar mensaje',
      onRecord,
      recordLabel = 'Grabar audio',
      attachments,
      audio,
      onSendAudio,
      touch = false,
      disabled = false,
      textareaProps,
      className,
      ...rest
    },
    ref
  ) => {
    const id = useId();
    const fieldId = textareaProps?.id ?? `${id}-field`;
    const [innerValue, setInnerValue] = useState(defaultValue);
    const value = valueProp ?? innerValue;
    const hasAudio = audio != null && audio !== false;
    const buttonSize = touch ? 'sm' : 'xs';
    const iconSize = touch ? 20 : 16;

    const setValue = (next: string) => {
      if (valueProp === undefined) setInnerValue(next);
      onValueChange?.(next);
    };

    const send = () => {
      const message = value.trim();
      if (!message || disabled) return;
      onSend?.(message);
      if (valueProp === undefined) setInnerValue('');
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (hasAudio) onSendAudio?.();
      else send();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      textareaProps?.onKeyDown?.(event);
      if (event.defaultPrevented) return;
      // Safari entrega el Enter que confirma un IME después de `compositionend`, con `isComposing = false` y keyCode 229
      const composing = event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229;
      if (event.key === 'Enter' && !event.shiftKey && !composing) {
        event.preventDefault();
        send();
      }
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      textareaProps?.onChange?.(event);
      setValue(event.target.value);
    };

    const sendButton = (
      <Button
        type="submit"
        iconOnly
        variant="primary"
        size={buttonSize}
        aria-label={sendLabel}
        disabled={disabled}
        data-figma-part="Button"
        className={cn(!hasAudio && chatComposerSendInlineVariants(), !touch && SMALL_ICON)}
      >
        <Icon name="send2" size={iconSize} variant="fill" data-figma-part="Icon-sizes" />
      </Button>
    );

    const recordButton = onRecord ? (
      <Button
        iconOnly
        variant="secondary"
        size={buttonSize}
        aria-label={recordLabel}
        disabled={disabled}
        onClick={onRecord}
        data-figma-part="Button"
        className={cn('shrink-0', !touch && SMALL_ICON)}
      >
        <Icon name="maximize-circle-2" size={iconSize} variant="fill" data-figma-part="Icon-sizes" />
      </Button>
    ) : null;

    const hasAttachments = attachments != null && attachments !== false;
    const bottomRight = hasAudio && (recordButton || onSendAudio) ? (
      <div className={chatComposerGroupVariants()}>
        {recordButton}
        {onSendAudio && sendButton}
      </div>
    ) : null;

    return (
      <form
        {...rest}
        noValidate
        onSubmit={handleSubmit}
        className={cn(chatComposerVariants({ touch, withAudio: hasAudio }), className)}
      >
        {hasAudio ? (
          <div className={chatComposerTopRowVariants()}>{audio}</div>
        ) : (
          <div className={chatComposerTopRowVariants()}>
            <div data-figma-part="Frame 1984080613" className={chatComposerFieldVariants()}>
              <label htmlFor={fieldId} className="sr-only">
                {label}
              </label>
              <textarea
                {...textareaProps}
                ref={ref}
                id={fieldId}
                rows={textareaProps?.rows ?? 2}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                data-figma-part="Escribe un mensaje..."
                className={cn(chatComposerTextareaVariants(), textareaProps?.className)}
              />
              {sendButton}
            </div>
            {recordButton}
          </div>
        )}
        {(hasAttachments || bottomRight) && (
          <div data-figma-part="CTA" className={chatComposerBottomRowVariants()}>
            <div className={chatComposerGroupVariants()}>{attachments}</div>
            {bottomRight}
          </div>
        )}
      </form>
    );
  }
);

ChatComposer.displayName = 'ChatComposer';
