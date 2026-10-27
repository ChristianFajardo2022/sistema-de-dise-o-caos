import { forwardRef } from 'react';
import type { FloatButtonProps } from './FloatButton.types';
import { floatButtonVariants } from './FloatButton.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Botón flotante (FAB) circular con sombra. Sin `children` es de solo ícono y exige `aria-label`;
 * con `children` es extendido. No fija su posición: quien lo usa lo coloca (p. ej. `className="fixed bottom-6 right-6"`).
 */
export const FloatButton = forwardRef<HTMLButtonElement, FloatButtonProps>(
  ({ icon = 'heart', state = 'default', className, children, type = 'button', ...restProps }, ref) => {
    const extended = children !== undefined && children !== null && children !== false && children !== '';

    if (import.meta.env?.DEV && !extended && !restProps['aria-label'] && !restProps['aria-labelledby']) {
      console.warn('FloatButton sin texto necesita aria-label o aria-labelledby.');
    }

    return (
      <button
        ref={ref}
        type={type}
        data-extended={extended || undefined}
        className={cn(floatButtonVariants({ extended, state }), className)}
        {...restProps}
      >
        <Icon name={icon} size={24} variant="line" aria-hidden="true" className="size-6 shrink-0" data-figma-part="Icon-sizes" />
        {extended && (
          <span className="pb-ds-space-button-sm" data-figma-part="Text-button">
            {children}
          </span>
        )}
      </button>
    );
  }
);

FloatButton.displayName = 'FloatButton';
