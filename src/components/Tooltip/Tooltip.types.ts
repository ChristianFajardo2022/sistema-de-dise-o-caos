import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

/**
 * Position de Figma: borde de la burbuja donde está la flecha. La burbuja aparece del lado opuesto del disparador
 * (`top` = flecha arriba, burbuja debajo del disparador).
 */
export type TooltipArrow = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipBubbleProps extends HTMLAttributes<HTMLDivElement> {
  /** Position de Figma: borde donde se dibuja la flecha. Por defecto `bottom`. */
  arrow?: TooltipArrow;
  /** Solid de Figma: `true` relleno sólido (background/container/default-unicolor); `false` translúcido. Por defecto `true`. */
  solid?: boolean;
  /** Icon de Figma: ícono info-circle antes del texto. Por defecto `true`. */
  icon?: boolean;
  /** Text de Figma: texto breve, sin contenido interactivo. */
  children?: ReactNode;
}

/** Comportamiento del tooltip: hover/foco (`tooltip`) o clic (`toggletip`). */
export type TooltipMode = 'tooltip' | 'toggletip';

export interface TooltipProps extends Omit<TooltipBubbleProps, 'children' | 'content'> {
  /**
   * Disparador: un único elemento enfocable (botón, enlace, campo). Recibe `aria-describedby` y los manejadores de
   * puntero y foco; si ya tenía los suyos, se conservan.
   */
  children: ReactElement;
  /** Text de Figma: contenido del tooltip. Solo texto (sin enlaces ni botones: un tooltip no recibe foco). */
  content: ReactNode;
  /**
   * `tooltip` (por defecto): aparece con hover o foco; su texto es un complemento que también está en el nombre
   * accesible o en la interfaz. `toggletip`: para información que **solo** vive en el globo (p. ej. el ícono de
   * información de un campo): abre y cierra con clic, toque, Enter o Espacio, cierra con Escape y clic fuera, y el
   * contenido se anuncia por una región `role="status"` al abrir. El disparador debe ser un botón.
   */
  mode?: TooltipMode;
  /**
   * Qué es el tooltip para el disparador: `description` (por defecto, `aria-describedby`) o `label` (`aria-labelledby`:
   * el tooltip es el nombre de un botón solo con ícono; el disparador no lleva `aria-label`).
   */
  describes?: 'description' | 'label';
  /** Retraso antes de mostrarse al pasar el puntero o enfocar (ms). Por defecto 300. */
  delay?: number;
  /** Retraso antes de ocultarse al salir el puntero (ms): da tiempo a pasar el puntero a la burbuja. Por defecto 150. */
  closeDelay?: number;
  /** Abierto (controlado). */
  open?: boolean;
  /** Abierto al montar (no controlado). */
  defaultOpen?: boolean;
  /** Se llama cuando el tooltip quiere abrirse o cerrarse. */
  onOpenChange?: (open: boolean) => void;
  /** No se muestra (el disparador sigue igual). */
  disabled?: boolean;
}
