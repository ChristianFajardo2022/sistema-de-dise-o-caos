import { useEffect, useRef, useState } from 'react';
import type { AnimationEvent, KeyboardEvent } from 'react';
import type { ToastRole, ToastType } from './Toast.types';

export const has = (node: unknown) => node != null && node !== false && node !== '';

/** error y alert interrumpen al lector (`alert`); success e info son avisos corteses (`status`). */
export function defaultRole(type: ToastType): ToastRole {
  return type === 'error' || type === 'alert' ? 'alert' : 'status';
}

/**
 * Cierre automático pausable. Devuelve los manejadores de puntero y foco que pausan la cuenta
 * (puntero encima o foco dentro) y la reinician al salir. Sin `duration` no hace nada.
 */
export function useAutoClose(duration: number | undefined, onClose: (() => void) | undefined) {
  const [paused, setPaused] = useState(false);
  const hovering = useRef(false);
  const focusing = useRef(false);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (duration == null || duration <= 0 || paused) return;
    const id = window.setTimeout(() => onCloseRef.current?.(), duration);
    return () => window.clearTimeout(id);
  }, [duration, paused]);

  const sync = () => setPaused(hovering.current || focusing.current);
  return {
    onMouseEnter: () => {
      hovering.current = true;
      sync();
    },
    onMouseLeave: () => {
      hovering.current = false;
      sync();
    },
    onFocus: () => {
      focusing.current = true;
      sync();
    },
    onBlur: () => {
      focusing.current = false;
      sync();
    },
  };
}

/** Escape con el foco dentro cierra el aviso (no roba el foco: solo actúa si ya está dentro). */
export function escapeCloses(onClose: (() => void) | undefined) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && onClose && !event.defaultPrevented) {
      event.stopPropagation();
      onClose();
    }
  };
}


/** Plazo máximo de la salida: si el navegador no emite `animationend` (animaciones desactivadas, pestaña oculta) se da por terminada. */
const EXIT_FALLBACK_MS = 400;

/**
 * Salida animada. Devuelve `data-state` (`open` o `closed`) y el manejador de `animationend`; al cerrarse llama
 * una sola vez a `onExited` cuando acaba la animación `animate-caos-toast-out` o vence el plazo de respaldo.
 */
export function useExit(open: boolean, onExited: (() => void) | undefined) {
  const onExitedRef = useRef(onExited);
  const done = useRef(false);
  useEffect(() => {
    onExitedRef.current = onExited;
  });
  const finish = () => {
    if (done.current) return;
    done.current = true;
    onExitedRef.current?.();
  };
  useEffect(() => {
    if (open) {
      done.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      if (done.current) return;
      done.current = true;
      onExitedRef.current?.();
    }, EXIT_FALLBACK_MS);
    return () => window.clearTimeout(id);
  }, [open]);
  return {
    'data-state': open ? ('open' as const) : ('closed' as const),
    onAnimationEnd: (event: AnimationEvent<HTMLElement>) => {
      if (!open && event.target === event.currentTarget && event.animationName.startsWith('caos-toast-out')) finish();
    },
  };
}
