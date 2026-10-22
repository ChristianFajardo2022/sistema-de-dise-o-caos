import { defaultIconVariant } from './Icon.types';
import type { IconBareProps } from './Icon.types';
import { cn } from '../../utils/cn';

/**
 * Dibuja un ícono a partir de sus datos, sin importar el registro completo.
 * Para tree-shaking: `<IconBase icon={searchIcon} />`.
 */
export function IconBase({ icon, size = 24, variant, className, 'aria-label': ariaLabel, ...restProps }: IconBareProps) {
  const markup = icon[variant ?? defaultIconVariant(size)];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      data-icon={icon.name}
      className={cn('inline-block shrink-0', className)}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      aria-hidden={ariaLabel ? undefined : true}
      focusable="false"
      {...restProps}
      // Marcado propio generado por scripts/build-caos-icons.mjs (solo <path>)
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
