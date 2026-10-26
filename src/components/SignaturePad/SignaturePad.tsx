import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { ForwardedRef, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import type {
  SignatureExportOptions,
  SignaturePadHandle,
  SignaturePadLabels,
  SignaturePadProps,
  SignaturePoint,
  SignatureStroke,
  SignatureValue,
} from './SignaturePad.types';
import {
  signaturePadCanvasVariants,
  signaturePadIconButtonVariants,
  signaturePadPlaceholderVariants,
  signaturePadRootVariants,
  signaturePadRowVariants,
  signaturePadSignerVariants,
} from './SignaturePad.variants';
import { drawStrokes, isSamePoint, isSignatureEmpty, strokesToDataURL, toNormalizedPoint } from './SignaturePad.utils';
import { useControllableState } from '../../utils/controllableState';
import { cn } from '../../utils/cn';

const DEFAULT_LABELS: Required<SignaturePadLabels> = {
  placeholder: 'Dibuja tu firma aquí',
  empty: 'Firma vacía',
  signed: 'Firma registrada',
  cleared: 'Firma borrada',
  undo: 'Deshacer último trazo',
  clear: 'Borrar firma',
  maximize: 'Maximizar',
  close: 'Cerrar',
  cancel: 'Cancelar',
  create: 'Crear firma',
};

const NO_STROKES: SignatureValue = [];

/**
 * Columna de la versión vertical: su contenido es horizontal y se gira −90° (se lee de abajo hacia arriba), como la
 * pantalla de celular de Figma. El hijo mide el largo y el grueso de la columna con container query units.
 */
function RotatedColumn({ className, children, part }: { className: string; children: ReactNode; part?: string }) {
  return (
    <div data-figma-part={part} className={cn('relative shrink-0 self-stretch [container-type:size]', className)}>
      <div className="absolute top-1/2 left-1/2 h-[100cqw] w-[100cqh] -translate-x-1/2 -translate-y-1/2 -rotate-90">
        {children}
      </div>
    </div>
  );
}

function SignaturePadInner(
  {
    orientation = 'horizontal',
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled = false,
    strokeWidth = 2.5,
    labels: labelsProp,
    signerName,
    signerId,
    maximizable = false,
    onMaximize,
    onClose,
    onCancel,
    onCreate,
    requireSignature = true,
    className,
    ...restProps
  }: SignaturePadProps,
  ref: ForwardedRef<SignaturePadHandle>
) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const vertical = orientation === 'vertical';
  const [strokes, setStrokes] = useControllableState<SignatureValue>(
    valueProp,
    defaultValue ?? NO_STROKES,
    onValueChange,
    'SignaturePad'
  );
  const empty = isSignatureEmpty(strokes);

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef(strokes);
  const draftRef = useRef<SignatureStroke | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const announceFrameRef = useRef(0);
  const placeholderId = useId();
  useEffect(() => () => cancelAnimationFrame(announceFrameRef.current), []);
  useLayoutEffect(() => {
    strokesRef.current = strokes;
  });

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    // clientWidth/clientHeight ignoran la rotación de la versión vertical (son medidas de layout)
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const all = draftRef.current ? [...strokesRef.current, draftRef.current] : strokesRef.current;
    drawStrokes(ctx, all, width, height, getComputedStyle(canvas).color, strokeWidth);
  }, [strokeWidth]);

  // Redibuja con cada cambio de trazos; el tamaño y el tema también lo piden
  useLayoutEffect(() => {
    paint();
  }, [paint, strokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    const themeObserver = new MutationObserver(paint);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => {
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, [paint]);

  const commit = useCallback(
    (next: SignatureValue, message: string) => {
      strokesRef.current = next;
      setStrokes(next);
      // Vacía la región y fija el mensaje en el cuadro siguiente: un mensaje repetido (segundo trazo) se vuelve a anunciar
      cancelAnimationFrame(announceFrameRef.current);
      setAnnouncement('');
      announceFrameRef.current = requestAnimationFrame(() => setAnnouncement(message));
    },
    [setStrokes]
  );

  const clear = useCallback(() => {
    if (disabled || isSignatureEmpty(strokesRef.current)) return;
    commit([], labels.cleared);
  }, [commit, disabled, labels.cleared]);

  const undo = useCallback(() => {
    if (disabled || isSignatureEmpty(strokesRef.current)) return;
    const next = strokesRef.current.slice(0, -1);
    commit(next, isSignatureEmpty(next) ? labels.cleared : labels.signed);
  }, [commit, disabled, labels.cleared, labels.signed]);

  useImperativeHandle(
    ref,
    () => ({
      clear,
      undo,
      isEmpty: () => isSignatureEmpty(strokesRef.current),
      getValue: () => strokesRef.current,
      toDataURL: (options?: SignatureExportOptions) => {
        const canvas = canvasRef.current;
        const aspect = canvas && canvas.clientHeight > 0 ? canvas.clientWidth / canvas.clientHeight : 3;
        const height = options?.height ?? Math.round((options?.width ?? 600) / aspect);
        return strokesToDataURL(strokesRef.current, { ...options, height });
      },
      get element() {
        return rootRef.current;
      },
    }),
    [clear, undo]
  );

  // Posición normalizada desde clientX/clientY y el rectángulo en pantalla. En vertical el lienzo está girado −90°:
  // su eje x local sube por la pantalla y su eje y avanza hacia la derecha (el rectángulo es el de la caja girada)
  const pointFrom = (event: PointerEvent): SignaturePoint => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return vertical
      ? toNormalizedPoint(rect.bottom - event.clientY, event.clientX - rect.left, rect.height, rect.width)
      : toNormalizedPoint(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0) || pointerIdRef.current !== null) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointerIdRef.current = event.pointerId;
    draftRef.current = [pointFrom(event.nativeEvent)];
    setDrawing(true);
    paint();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const draft = draftRef.current;
    if (!draft || event.pointerId !== pointerIdRef.current) return;
    const native = event.nativeEvent;
    const events = native.getCoalescedEvents?.();
    for (const e of events && events.length > 0 ? events : [native]) {
      const point = pointFrom(e);
      if (!isSamePoint(draft[draft.length - 1], point)) draft.push(point);
    }
    paint();
  };

  const finishStroke = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const draft = draftRef.current;
    if (!draft || event.pointerId !== pointerIdRef.current) return;
    draftRef.current = null;
    pointerIdRef.current = null;
    setDrawing(false);
    commit([...strokesRef.current, draft], labels.signed);
  };

  const showPlaceholder = empty && !drawing;
  const stateLabel = empty && !drawing ? labels.empty : labels.signed;

  const canvas = (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={stateLabel}
      aria-describedby={showPlaceholder ? placeholderId : undefined}
      aria-disabled={disabled || undefined}
      className={signaturePadCanvasVariants({ orientation, disabled })}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishStroke}
      onPointerCancel={finishStroke}
    />
  );

  const placeholder = showPlaceholder && (
    <div
      id={placeholderId}
      data-figma-part="Dibuja tu firma aquí"
      className={signaturePadPlaceholderVariants({ orientation })}
    >
      {labels.placeholder}
    </div>
  );

  const undoButton = (
    <button
      type="button"
      aria-label={labels.undo}
      aria-disabled={disabled || empty || undefined}
      className={signaturePadIconButtonVariants()}
      onClick={undo}
    >
      <Icon name="rotate-left" size={24} variant="fill" data-figma-part="Icon-sizes" />
    </button>
  );
  const clearButton = (
    <button
      type="button"
      aria-label={labels.clear}
      aria-disabled={disabled || empty || undefined}
      className={signaturePadIconButtonVariants()}
      onClick={clear}
    >
      <Icon name="trash" size={24} variant="line" data-figma-part="Icon-sizes" />
    </button>
  );
  const maximizeButton = maximizable && (
    <button
      type="button"
      aria-label={labels.maximize}
      aria-disabled={disabled || undefined}
      className={signaturePadIconButtonVariants()}
      onClick={() => !disabled && onMaximize?.()}
    >
      <Icon name="maximize" size={24} variant="line" data-figma-part="Icon-sizes" />
    </button>
  );

  const status = (
    <span role="status" className="sr-only">
      {announcement}
    </span>
  );

  if (!vertical) {
    return (
      <div
        {...restProps}
        ref={rootRef}
        aria-disabled={disabled || undefined}
        className={cn(signaturePadRootVariants({ orientation, disabled }), className)}
      >
        {canvas}
        <div data-figma-part="Frame 1984080548" className={signaturePadRowVariants()}>
          {maximizeButton}
        </div>
        {placeholder || <div className="h-19 w-full shrink-0" />}
        <div data-figma-part="Frame 1984080547" className={signaturePadRowVariants()}>
          {undoButton}
          {clearButton}
        </div>
        {status}
      </div>
    );
  }

  const hasSigner = signerName !== undefined || signerId !== undefined;
  const createDisabled = disabled || (requireSignature && empty);

  return (
    <div
      {...restProps}
      ref={rootRef}
      aria-disabled={disabled || undefined}
      className={cn(signaturePadRootVariants({ orientation, disabled }), className)}
    >
      <RotatedColumn className="w-6" part="Frame 1984080547">
        <div className={cn(signaturePadRowVariants(), 'absolute inset-0 w-full')}>
          {maximizeButton}
          {undoButton}
          {clearButton}
        </div>
      </RotatedColumn>
      <RotatedColumn className="w-43.5">
        {canvas}
        {placeholder}
      </RotatedColumn>
      <div data-figma-part="line" className="relative flex w-7 shrink-0 flex-col justify-end">
        <button
          type="button"
          aria-label={labels.close}
          className={signaturePadIconButtonVariants()}
          onClick={onClose}
        >
          <Icon name="close" size={24} variant="line" data-figma-part="close" />
        </button>
        <span aria-hidden className="absolute inset-y-0 right-0 w-px bg-ds-border-general-gray-fifth" />
      </div>
      <RotatedColumn className="w-14" part="CTA">
        <div className="absolute inset-0 flex items-center justify-end gap-ds-space-general-xl">
          <div data-figma-part="Name,cc" className="flex min-w-0 flex-1 flex-col gap-ds-space-general-md">
            {hasSigner && (
              <>
                <span data-figma-part="Signer name" className={signaturePadSignerVariants()}>
                  {signerName}
                </span>
                <span data-figma-part="Signer id" className={signaturePadSignerVariants()}>
                  {signerId}
                </span>
              </>
            )}
          </div>
          <div data-figma-part="Buttons" className="flex items-center gap-2">
            <Button data-figma-part="Button" variant="secondary" contrast="low" disabled={disabled} onClick={onCancel}>
              {labels.cancel}
            </Button>
            <Button data-figma-part="Button" variant="primary" disabled={createDisabled} onClick={() => onCreate?.(strokesRef.current)}>
              {labels.create}
            </Button>
          </div>
        </div>
      </RotatedColumn>
      {status}
    </div>
  );
}

/**
 * Área para dibujar una firma manuscrita con puntero, mouse o dedo (`<canvas>` con Pointer Events, trazo suave,
 * escala por `devicePixelRatio`). Un dibujo no tiene alternativa por teclado: quien compone la pantalla debe ofrecer
 * otra vía (p. ej. escribir el nombre). El `ref` es un `SignaturePadHandle` (`clear`, `undo`, `toDataURL`…).
 */
export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(SignaturePadInner);
SignaturePad.displayName = 'SignaturePad';
