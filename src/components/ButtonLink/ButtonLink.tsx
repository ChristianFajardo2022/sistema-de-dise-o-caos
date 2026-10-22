import { forwardRef } from 'react';
import type { ButtonLinkProps, ButtonLinkState } from './ButtonLink.types';
import { buttonLinkVariants } from './ButtonLink.variants';
import { ExportIcon } from '../../icons/ExportIcon';
import { cn } from '../../utils/cn';

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      state = 'default',
      disabled = false,
      iconRight = true,
      icon,
      href,
      className,
      children,
      onClick,
      ...restProps
    },
    ref
  ) => {
    const isDisabled = disabled || state === 'inactive';
    const computedState: ButtonLinkState = isDisabled ? 'inactive' : state;

    return (
      <a
        ref={ref}
        // Inactive: sin href no navega ni entra en el orden de tabulación
        href={isDisabled ? undefined : href}
        // Sin href el <a> pierde el rol de enlace: se restituye (no entra en el orden de tabulación)
        role={isDisabled ? 'link' : undefined}
        aria-disabled={isDisabled || undefined}
        onClick={isDisabled ? (e) => e.preventDefault() : onClick}
        className={cn(buttonLinkVariants({ state: computedState }), className)}
        {...restProps}
      >
        {/* Text-button: línea de 16 (dimention/button/container/xs), subrayado sólido 6 % */}
        <span className="inline-flex h-ds-dimention-button-container-xs items-center underline decoration-solid [text-decoration-thickness:6%] [text-decoration-skip-ink:auto]">
          {children}
        </span>
        {restProps.target === '_blank' && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
        {iconRight && (
          <span
            data-slot="icon"
            aria-hidden="true"
            className="inline-flex size-[12px] shrink-0 items-center justify-center text-(color:--link-icon) [&>svg]:size-full"
          >
            {icon ?? <ExportIcon />}
          </span>
        )}
      </a>
    );
  }
);

ButtonLink.displayName = 'ButtonLink';
