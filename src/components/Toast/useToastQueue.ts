import { useCallback, useRef, useState } from 'react';
import type { SnackbarProps, ToastProps } from './Toast.types';

/** Aviso que se agrega a la cola: las props de un `Toast` o un `Snackbar` (según `kind`) y un `id` opcional. */
export type ToastQueueInput =
  | ({ kind?: 'toast'; id?: string } & Omit<ToastProps, 'open' | 'onExited'>)
  | ({ kind: 'snackbar'; id?: string } & Omit<SnackbarProps, 'open' | 'onExited'>);

/** Aviso ya en la cola: `props` se esparce tal cual sobre `<Toast>` o `<Snackbar>` (trae `open`, `onClose` y `onExited`). */
export interface ToastQueueItem {
  id: string;
  kind: 'toast' | 'snackbar';
  props: ToastProps & SnackbarProps;
}

export interface UseToastQueueOptions {
  /** Máximo de avisos visibles a la vez (por defecto 3). Al pasarse, el más antiguo empieza su salida. */
  limit?: number;
}

export interface UseToastQueueResult {
  /** Avisos montados, del más antiguo al más nuevo (incluye los que están saliendo). */
  items: ToastQueueItem[];
  /** Agrega un aviso y devuelve su `id`. Con un `id` ya en uso no duplica: devuelve el existente. */
  add: (toast: ToastQueueInput) => string;
  /** Cierra uno (inicia su salida animada). Sin efecto si no existe o ya se está cerrando. */
  remove: (id: string) => void;
  /** Cierra todos. */
  clear: () => void;
}

/**
 * Cola sencilla para `Toaster`: agregar, quitar y límite de avisos visibles. Cada aviso se desmonta solo cuando
 * termina su animación de salida (`onExited`). Los `onClose` que pases se llaman además de cerrar.
 *
 * ```tsx
 * const { items, add } = useToastQueue({ limit: 3 });
 * <Toaster>{items.map((i) => (i.kind === 'toast' ? <Toast key={i.id} {...i.props} /> : <Snackbar key={i.id} {...i.props} />))}</Toaster>
 * ```
 */
export function useToastQueue({ limit = 3 }: UseToastQueueOptions = {}): UseToastQueueResult {
  type Entry = { id: string; kind: 'toast' | 'snackbar'; open: boolean; input: ToastQueueInput };
  const [entries, setEntries] = useState<Entry[]>([]);
  const counter = useRef(0);
  const max = Math.max(1, Math.floor(limit));

  const remove = useCallback((id: string) => {
    setEntries((list) => list.map((e) => (e.id === id && e.open ? { ...e, open: false } : e)));
  }, []);
  const exited = useCallback((id: string) => {
    setEntries((list) => list.filter((e) => e.id !== id));
  }, []);
  const clear = useCallback(() => {
    setEntries((list) => list.map((e) => (e.open ? { ...e, open: false } : e)));
  }, []);

  const add = useCallback(
    (input: ToastQueueInput) => {
      const id = input.id ?? `toast-${++counter.current}`;
      setEntries((list) => {
        if (list.some((e) => e.id === id && e.open)) return list;
        const next = [...list.filter((e) => e.id !== id), { id, kind: input.kind ?? 'toast', open: true, input } as Entry];
        // Pasado el límite, los más antiguos que siguen abiertos empiezan a salir
        let over = next.filter((e) => e.open).length - max;
        return next.map((e) => (e.open && over-- > 0 ? { ...e, open: false } : e));
      });
      return id;
    },
    [max]
  );

  const items: ToastQueueItem[] = entries.map(({ id, kind, open, input }) => {
    const { id: _id, kind: _kind, onClose, ...props } = input as ToastQueueInput & { onClose?: () => void };
    return {
      id,
      kind,
      props: {
        ...(props as ToastProps & SnackbarProps),
        open,
        onClose: () => {
          onClose?.();
          remove(id);
        },
        onExited: () => exited(id),
      },
    };
  });

  return { items, add, remove, clear };
}
