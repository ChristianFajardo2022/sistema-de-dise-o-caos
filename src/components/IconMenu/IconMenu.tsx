import { forwardRef } from 'react';
import type { IconMenuProps } from './IconMenu.types';
import { iconMenuLineClasses, iconMenuVariants } from './IconMenu.variants';
import { cn } from '../../utils/cn';

/** Nombres de las tres rayas en Figma. */
const LINES = [
  { part: 'Vector 24', y: 8 },
  { part: 'Vector 25', y: 16 },
  { part: 'Vector 26', y: 24 },
] as const;

/**
 * Ícono del botón de menú ("Icon menu (Atom)" de Figma, 13616:14074): tres rayas que pasan a una X.
 *
 * - Es un componente propio y no un `Icon`: el dibujo de Figma son tres trazos de 1.5 sobre una cuadrícula de 32 que
 *   giran sobre su centro, y la biblioteca de íconos CAOS (`menu`, `close`) trae dibujos fijos de otra cuadrícula, sin
 *   fotograma intermedio ni transición.
 * - Es decorativo por defecto (`aria-hidden`): el nombre lo da el botón que lo contiene ("Abrir menú" / "Cerrar menú").
 */
export const IconMenu = forwardRef<SVGSVGElement, IconMenuProps>(({ variant = 'menu', className, 'aria-label': label, ...rest }, ref) => {
  const classes = iconMenuLineClasses[variant];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      focusable="false"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
      ref={ref}
      className={cn(iconMenuVariants(), className)}
      data-variant={variant}
    >
      {LINES.map((line, index) => (
        <line key={line.part} x1="4" x2="28" y1={line.y} y2={line.y} className={classes[index]} data-figma-part={line.part} />
      ))}
    </svg>
  );
});

IconMenu.displayName = 'IconMenu';
