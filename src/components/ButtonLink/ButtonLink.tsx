import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, Ref } from 'react';
import type { ButtonLinkProps, ButtonLinkState } from './ButtonLink.types';
import { buttonLinkVariants } from './ButtonLink.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

export const ButtonLink = forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonLinkProps>(
  (
    {
      state = 'default',
      disabled = false,
      iconRight = true,
      icon,
      href,
      type = 'button',
      className,
      children,
      onClick,
      ...restProps
    },
    ref
  ) => {
    const isDisabled = disabled || state === 'inactive';
    const computedState: ButtonLinkState = isDisabled ? 'inactive' : state;
    const classes = cn(buttonLinkVariants({ state: computedState }), 'bg-transparent border-0', className);

    const content = (
      <>
        {/* Text-button: línea de 16 (dimention/button/container/xs), subrayado sólido 6 % */}
        <span className="inline-flex h-ds-dimention-button-container-xs items-center underline decoration-solid [text-decoration-thickness:6%] [text-decoration-skip-ink:auto]">
          {children}
        </span>
        {href !== undefined && restProps.target === '_blank' && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
        {iconRight && (
          <span
            data-slot="icon"
            aria-hidden="true"
            className="inline-flex size-[12px] shrink-0 items-center justify-center text-(color:--link-icon) [&>svg]:size-full"
          >
            {icon ?? <Icon name="export2" variant="line" size={12} />}
          </span>
        )}
      </>
    );

    // Sin href: acción (Reenviar, Editar…). <button> real: teclado y disabled nativos
    if (href === undefined) {
      return (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type={type}
          disabled={isDisabled}
          onClick={onClick}
          className={classes}
          {...(restProps as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      );
    }

    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        // Inactive: sin href no navega ni entra en el orden de tabulación
        href={isDisabled ? undefined : href}
        // Sin href el <a> pierde el rol de enlace: se restituye (no entra en el orden de tabulación)
        role={isDisabled ? 'link' : undefined}
        aria-disabled={isDisabled || undefined}
        onClick={isDisabled ? (e) => e.preventDefault() : onClick}
        className={classes}
        {...restProps}
      >
        {content}
      </a>
    );
  }
);

ButtonLink.displayName = 'ButtonLink';
