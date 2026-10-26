import { forwardRef } from 'react';
import type { LogoProps } from './Logo.types';
import { LOGO_DRAWINGS } from './Logo.data';
import { logoVariants } from './Logo.variants';
import { cn } from '../../utils/cn';

/** Nombre de la marca tal como se lee en el logo. */
export const LOGO_BRAND_NAME = 'Inter Rapidísimo';

/**
 * Logo: imagen vectorial de la marca (`<svg role="img">` con nombre accesible).
 * Con `decorative` pasa a `aria-hidden` y sin rol. El color lo da el token del tema
 * `background/logo/default`; no se pinta con valores sueltos.
 */
export const Logo = forwardRef<SVGSVGElement, LogoProps>(
  ({ type = 'logo', size = 'lg', title = LOGO_BRAND_NAME, decorative = false, className, ...restProps }, ref) => {
    const { width, height, padX, padY, markup } = LOGO_DRAWINGS[type][size];
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        // El viewBox recorta el dibujo; el padding de Figma lo pone la clase de tamaño (box-border)
        viewBox={`${padX} ${padY} ${width - 2 * padX} ${height - 2 * padY}`}
        width={width}
        height={height}
        fill="currentColor"
        focusable="false"
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : title}
        aria-hidden={decorative ? true : undefined}
        {...restProps}
        ref={ref}
        className={cn(logoVariants({ type, size }), className)}
        data-logo={type}
        data-size={size}
        // Marcado propio exportado de Figma (solo <path>)
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    );
  }
);

Logo.displayName = 'Logo';
